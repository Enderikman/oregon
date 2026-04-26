import os
import re
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from textwrap import dedent

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.query.main import query as run_query
from src.ingest.reverse_index import WIKILINK_PATTERN

OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", "output/EnterpriseBench"))
ONTOLOGY_PATH = os.environ.get("ONTOLOGY_PATH", "src/ingest/ontology.yaml")
INGEST_DATA_DIR = os.environ.get("INGEST_DATA_DIR")
INGEST_ON_STARTUP = os.environ.get("INGEST_ON_STARTUP", "true").lower() in ("1", "true", "yes")


def _has_ingested_data(output_dir: Path) -> bool:
    if not output_dir.exists() or not output_dir.is_dir():
        return False
    return any(output_dir.iterdir())


def _maybe_ingest_on_startup():
    if not INGEST_ON_STARTUP:
        print("[startup] INGEST_ON_STARTUP=false — skipping")
        return
    if _has_ingested_data(OUTPUT_DIR):
        print(f"[startup] Data already present at {OUTPUT_DIR} — skipping ingest")
        return
    if not INGEST_DATA_DIR:
        print("[startup] INGEST_DATA_DIR not set — skipping ingest (frontend mocks will be used)")
        return
    data_dir = Path(INGEST_DATA_DIR)
    if not data_dir.exists() or not data_dir.is_dir():
        print(f"[startup] INGEST_DATA_DIR={data_dir} not found — skipping")
        return
    print(f"[startup] Ingesting {data_dir} → {OUTPUT_DIR} ...")
    from src.ingest.main import run as run_ingest
    run_ingest(str(data_dir), str(OUTPUT_DIR))
    print("[startup] Ingest done")


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        _maybe_ingest_on_startup()
    except Exception as e:
        print(f"[startup] Ingest failed: {e}")
    yield


app = FastAPI(title="Oregon API", lifespan=lifespan)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/health")
def health():
    return {
        "ok": True,
        "outputDir": str(OUTPUT_DIR),
        "hasData": _has_ingested_data(OUTPUT_DIR),
    }

# ── Chat ────────────────────────────────────────────────────────────────

_conversations: dict[str, list[dict]] = {}


class ChatRequest(BaseModel):
    prompt: str
    conversationId: str | None = None


class ChatResponse(BaseModel):
    conversationId: str
    reply: str


@app.post("/api/v1/admin/memory/chat", response_model=ChatResponse)
def memory_chat(req: ChatRequest):
    conv_id = req.conversationId or str(uuid.uuid4())
    if conv_id not in _conversations:
        _conversations[conv_id] = []
    _conversations[conv_id].append({"role": "user", "text": req.prompt})

    answer = run_query(req.prompt, OUTPUT_DIR, ONTOLOGY_PATH)

    _conversations[conv_id].append({"role": "assistant", "text": answer})
    return ChatResponse(conversationId=conv_id, reply=answer)


# ── Graph ───────────────────────────────────────────────────────────────

ENTITY_TYPE_MAP = {
    "Person": "employee",
    "Organization": "client",
    "Product": "product",
    "Ticket": "project",
    "Repository": "project",
    "Knowledge": "decision",
}


class GraphNode(BaseModel):
    id: str
    label: str
    kind: str
    entityType: str | None = None


class GraphEdge(BaseModel):
    id: str
    source: str
    target: str
    label: str


class GraphResponse(BaseModel):
    nodes: list[GraphNode]
    edges: list[GraphEdge]


def _parse_frontmatter(content: str) -> dict:
    if not content.startswith("---"):
        return {}
    end = content.index("---", 3)
    fm = {}
    for line in content[3:end].strip().splitlines():
        if ":" in line:
            k, v = line.split(":", 1)
            fm[k.strip()] = v.strip().strip('"')
    return fm


@app.get("/api/v1/admin/graph", response_model=GraphResponse)
def get_graph():
    if not OUTPUT_DIR.exists():
        raise HTTPException(404, "No ingested data found. Run ingest first.")

    nodes: list[GraphNode] = []
    edges: list[GraphEdge] = []
    seen_nodes: set[str] = set()
    edge_counter = 0

    for type_dir in sorted(OUTPUT_DIR.iterdir()):
        if not type_dir.is_dir() or type_dir.name.startswith("."):
            continue
        entity_type = type_dir.name
        frontend_type = ENTITY_TYPE_MAP.get(entity_type, "project")

        for entity_dir in sorted(type_dir.iterdir()):
            page_path = entity_dir / "page.md"
            if not page_path.exists():
                continue

            slug = f"{entity_type}/{entity_dir.name}"
            content = page_path.read_text(errors="ignore")
            fm = _parse_frontmatter(content)
            label = fm.get("name", fm.get("title", entity_dir.name))

            if slug not in seen_nodes:
                nodes.append(GraphNode(id=slug, label=label, kind="entity", entityType=frontend_type))
                seen_nodes.add(slug)

            for match in WIKILINK_PATTERN.finditer(content):
                target_type, target_id, display = match.groups()
                target_slug = f"{target_type}/{target_id}"
                if target_slug not in seen_nodes:
                    nodes.append(GraphNode(id=target_slug, label=display or target_id, kind="entity", entityType=ENTITY_TYPE_MAP.get(target_type, "project")))
                    seen_nodes.add(target_slug)
                edge_counter += 1
                edges.append(GraphEdge(id=f"e{edge_counter}", source=slug, target=target_slug, label="related"))

    return GraphResponse(nodes=nodes, edges=edges)


# ── Ingest ──────────────────────────────────────────────────────────────

import shutil
import tempfile
import zipfile

from src.ingest.main import run as run_ingest


class IngestResponse(BaseModel):
    datasetId: str
    mapperPath: str
    outputDir: str


@app.post("/api/v1/ingest", response_model=IngestResponse)
def ingest_dataset(file: UploadFile):
    if not file.filename or not file.filename.endswith(".zip"):
        raise HTTPException(400, "Upload a .zip archive of the dataset folder")

    tmp = tempfile.mkdtemp()
    zip_path = Path(tmp) / file.filename
    with open(zip_path, "wb") as f:
        shutil.copyfileobj(file.file, f)

    with zipfile.ZipFile(zip_path) as zf:
        zf.extractall(tmp)

    zip_path.unlink()
    entries = [e for e in Path(tmp).iterdir() if e.is_dir()]
    dataset_dir = entries[0] if entries else Path(tmp)
    dataset_id = dataset_dir.name

    output_dir = f"output/{dataset_id}"
    run_ingest(str(dataset_dir), output_dir)

    global OUTPUT_DIR
    OUTPUT_DIR = Path(output_dir)

    shutil.rmtree(tmp, ignore_errors=True)
    return IngestResponse(
        datasetId=dataset_id,
        mapperPath=f"src/ingest/mappers/{dataset_id.lower()}.yaml",
        outputDir=output_dir,
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
