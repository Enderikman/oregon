import asyncio
import json
import os
import re
import uuid
from contextlib import asynccontextmanager
from pathlib import Path
from textwrap import dedent

from fastapi import FastAPI, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from src.query.main import query as run_query
from src.ingest.reverse_index import WIKILINK_PATTERN

OUTPUT_DIR = Path(os.environ.get("OUTPUT_DIR", "output/EnterpriseBench"))
ONTOLOGY_PATH = os.environ.get("ONTOLOGY_PATH", "src/ingest/ontology.yaml")
INGEST_DATA_DIR = os.environ.get("INGEST_DATA_DIR")
INGEST_MAPPER_PATH = os.environ.get("INGEST_MAPPER_PATH")
INGEST_ON_STARTUP = os.environ.get("INGEST_ON_STARTUP", "true").lower() in ("1", "true", "yes")
MAPPERS_DIR = Path(__file__).parent / "ingest" / "mappers"


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
    mapper_path = INGEST_MAPPER_PATH
    if not mapper_path:
        candidate = MAPPERS_DIR / f"{data_dir.name.lower()}.yaml"
        if candidate.exists():
            mapper_path = str(candidate)
            print(f"[startup] Using mapper {mapper_path}")
        else:
            print(f"[startup] No mapper at {candidate} — falling back to LLM-generated mapper")

    print(f"[startup] Ingesting {data_dir} → {OUTPUT_DIR} ...")
    from src.ingest.main import run as run_ingest
    run_ingest(str(data_dir), str(OUTPUT_DIR), mapper_path=mapper_path)
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


# ── Mock data API surface ───────────────────────────────────────────────

from src import mock_data as _mock

# Per-user session state for the quiz flow.
_answered_by_user: dict[str, set[str]] = {}
_answers_log: list[dict] = []


@app.get("/api/v1/user/current")
def current_user():
    return _mock.CURRENT_USER


@app.get("/api/v1/memory/health")
def memory_health():
    return _mock.HEALTH


@app.get("/api/v1/memory/trends")
def memory_trends(days: int = 7):
    return _mock.TRENDS


@app.get("/api/v1/memory/entities")
def list_entities():
    return _mock.ENTITIES


@app.get("/api/v1/memory/entities/{entity_id}")
def get_entity(entity_id: str):
    for e in _mock.ENTITIES:
        if e["id"] == entity_id:
            return e
    raise HTTPException(404, f"Entity {entity_id} not found")


@app.get("/api/v1/memory/facts")
def list_facts(subject: str | None = None):
    if subject:
        return [f for f in _mock.FACTS if f["subject"] == subject]
    return _mock.FACTS


@app.get("/api/v1/memory/facts/{fact_id}")
def get_fact(fact_id: str):
    for f in _mock.FACTS:
        if f["id"] == fact_id:
            return f
    raise HTTPException(404, f"Fact {fact_id} not found")


@app.get("/api/v1/memory/sources")
def list_sources():
    return _mock.SOURCES


@app.get("/api/v1/memory/sources/{source_id}")
def get_source(source_id: str):
    for s in _mock.SOURCES:
        if s["id"] == source_id:
            return s
    raise HTTPException(404, f"Source {source_id} not found")


@app.get("/api/v1/memory/questions")
def list_questions(status: str | None = None):
    if status:
        return [q for q in _mock.QUESTIONS if q["status"] == status]
    return _mock.QUESTIONS


@app.get("/api/v1/memory/questions/{question_id}")
def get_question(question_id: str):
    for q in _mock.QUESTIONS:
        if q["id"] == question_id:
            return q
    raise HTTPException(404, f"Question {question_id} not found")


@app.get("/api/v1/memory/activity")
def list_activity(limit: int = 50, offset: int = 0):
    return _mock.ACTIVITY[offset : offset + limit]


@app.get("/api/v1/memory/source-streams")
def list_source_streams():
    return _mock.SOURCE_STREAMS


@app.get("/api/v1/admin/interviews")
def list_admin_interviews(status: str | None = None, mode: str | None = None):
    items = _mock.ADMIN_INTERVIEWS
    if status and status != "all":
        items = [i for i in items if i["status"] == status]
    if mode and mode != "all":
        items = [i for i in items if i["mode"] == mode]
    return items


@app.get("/api/v1/admin/interviews/{interview_id}")
def get_admin_interview(interview_id: str):
    for i in _mock.ADMIN_INTERVIEWS:
        if i["id"] == interview_id:
            return i
    raise HTTPException(404, f"Interview {interview_id} not found")


@app.get("/api/v1/admin/conflicts")
def list_admin_conflicts(status: str | None = None):
    if status and status != "all":
        return [c for c in _mock.ADMIN_CONFLICTS if c["status"] == status]
    return _mock.ADMIN_CONFLICTS


@app.get("/api/v1/admin/conflicts/{conflict_id}")
def get_admin_conflict(conflict_id: str):
    for c in _mock.ADMIN_CONFLICTS:
        if c["id"] == conflict_id:
            return c
    raise HTTPException(404, f"Conflict {conflict_id} not found")


# ── Quiz: open questions + answers (MOCK) ───────────────────────────────


@app.get("/open-questions")
def open_questions(userId: str | None = None):
    if not userId:
        return _mock.OPEN_QUESTIONS
    answered = _answered_by_user.get(userId, set())
    return [q for q in _mock.OPEN_QUESTIONS if q["question"]["id"] not in answered]


class IngestAnswerRequest(BaseModel):
    userId: str
    questionId: str
    answer: str
    durationMs: int | None = None
    followupText: str | None = None
    clarifications: list[dict] | None = None


@app.post("/ingest-answer")
def ingest_answer(req: IngestAnswerRequest):
    _answers_log.append(req.model_dump())
    _answered_by_user.setdefault(req.userId, set()).add(req.questionId)
    return {
        "success": True,
        "remaining": sum(
            1 for q in _mock.OPEN_QUESTIONS
            if q["question"]["id"] not in _answered_by_user[req.userId]
        ),
    }


class SessionResetRequest(BaseModel):
    userId: str


@app.post("/session/reset")
def reset_session(req: SessionResetRequest):
    """Clear answered state so the quiz flow starts over for this user."""
    _answered_by_user.pop(req.userId, None)
    return {"success": True, "remaining": len(_mock.OPEN_QUESTIONS)}


@app.get("/session/state")
def session_state(userId: str):
    answered = _answered_by_user.get(userId, set())
    total = len(_mock.OPEN_QUESTIONS)
    return {
        "userId": userId,
        "total": total,
        "answered": len(answered),
        "remaining": total - len(answered),
        "answeredQuestionIds": sorted(answered),
    }


# ── AI helpers (MOCK) ───────────────────────────────────────────────────

class ClarifyRequest(BaseModel):
    question: str
    context: str | None = None
    why: str | None = None
    clarify: str | None = None
    history: list[dict] = []
    userMessage: str


class DraftRequest(BaseModel):
    question: str
    context: str | None = None
    why: str | None = None
    clarify: str | None = None
    history: list[dict] | None = None
    partial: str | None = None


def _mock_clarify_text(req: ClarifyRequest) -> str:
    msg = req.userMessage.strip().lower()
    if "why" in msg:
        return f"We ask because the answer affects how the memory graph links related facts. The question — '{req.question}' — has uncertainty around its current state."
    if "example" in msg or "what" in msg:
        return f"For example: a 'yes' will mark the fact as confirmed; 'no' will flag it for re-extraction. Question recap: '{req.question}'."
    return f"Short take on '{req.question}': consider what you know directly versus what is inferred. If unsure, 'skip' is fine."


@app.post("/ai/clarify")
async def ai_clarify(req: ClarifyRequest):
    text = _mock_clarify_text(req)

    async def gen():
        for word in text.split(" "):
            chunk = {"choices": [{"delta": {"content": word + " "}}]}
            yield f"data: {json.dumps(chunk)}\n\n"
            await asyncio.sleep(0.03)
        yield "data: [DONE]\n\n"

    return StreamingResponse(gen(), media_type="text/event-stream")


@app.post("/ai/draft")
def ai_draft(req: DraftRequest):
    base = req.partial.strip() if req.partial else ""
    suffix = "Yes — based on the context provided." if not base else f"{base} (drafted)"
    return {"draft": suffix}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=3000)
