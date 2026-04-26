# Organon

Enterprise knowledge graph system that transforms unstructured organizational data (HR, CRM, email, tickets, repos, knowledge bases) into a queryable markdown-based knowledge graph. LLM agents can then answer complex business questions by traversing entity pages connected through wiki-links.

## Problem

Organizations have data siloed across 10+ systems. Answering a cross-cutting question like *"Who manages the client that reported the most critical tickets last quarter?"* requires knowing where to look, joining across sources, respecting temporal semantics, and recognizing unanswerable questions.

Organon solves this with a two-phase architecture:
- **Ingestion** (offline, expensive): raw data → LLM-generated entity pages with inline wiki-links
- **Query** (online, cheap): question → entity detection → page lookup → link traversal → answer

## Architecture

> Open in [Excalidraw](https://excalidraw.com) or the VS Code Excalidraw extension.

- [`docs/architecture-overview.excalidraw`](docs/architecture-overview.excalidraw) — full system architecture
- [`docs/query-flow.excalidraw`](docs/query-flow.excalidraw) — query execution flow detail
- [`docs/data-model.excalidraw`](docs/data-model.excalidraw) — entity types and wiki-link graph

### High-Level Flow

```
DATA SOURCES (HR, CRM, ITSM, email, GitHub, KB)
        │
        ▼
INGESTION PIPELINE (offline, LLM-powered)
  ├─ Phase 1a: Entity Page Writer (LLM → markdown)
  ├─ Phase 1b: Communication Pages (raw write)
  ├─ Phase 2:  Communication Processor (LLM updates entity pages)
  └─ Phase 3:  Search Index Builder (FTS5 + vector embeddings)
        │
        ▼
KNOWLEDGE GRAPH (file-based)
  ├─ Markdown entity pages with YAML frontmatter + wiki-links
  ├─ Reverse index (backlinks)
  └─ SQLite search index (FTS5 + sqlite-vec)
        │
        ▼
QUERY ENGINE (online, ~2-3s per query)
  Entity Detection → Resolution → Page Lookup → LLM Loop (max 5 hops) → Answer
```

### Ingestion Pipeline

Raw data records (JSON, PDFs) are loaded via configurable YAML mappers that define how source fields map to entity types and frontmatter.

**Phase 1a — Entity Page Writing**: Each record is passed to the LLM, which generates a Wikipedia-style markdown article with structured frontmatter (name, type, department, relationships) and inline wiki-links (`[[Person/emp_0047|Aryan Mishra]]`) to related entities.

**Phase 1b — Communication Pages**: Emails, conversations, and support chats are written as raw markdown pages (no LLM), preserving thread structure.

**Phase 2 — Communication Processing**: Each communication is processed chronologically. For every participant, the LLM reads their current page and decides: `NO_UPDATE`, `EXTEND`, or `INVALIDATE`. This handles temporal semantics — newer info can override older state.

**Phase 3 — Search Index**: Builds a SQLite database with FTS5 full-text search and sqlite-vec vector embeddings for hybrid retrieval.

### Query Engine

1. **Entity Detection** — LLM extracts candidate entities from the question with confidence levels (high/medium/low)
2. **Entity Resolution** — Candidates are matched to existing pages via slug matching, partial matching, or frontmatter name lookup
3. **Page Lookup** — Resolved entities' pages are loaded; if nothing resolves, falls back to hybrid search (BM25 + semantic with reciprocal rank fusion)
4. **LLM Reasoning Loop** — The LLM reads pages and either requests more pages (following wiki-links) or provides a final answer. Max 5 hops to prevent loops.
5. **Answer** — Returns the answer or explicitly states "don't know"

### Entity Types

| Type | Frontmatter | Source |
|------|------------|--------|
| **Person** | name, department, is_external, reports_to | employees.json |
| **Organization** | name, relationship (client/vendor/customer) | clients.json, vendors.json |
| **Product** | name | products.json |
| **Ticket** | (minimal) | it_tickets.json |
| **Repository** | name | GitHub.json |
| **Knowledge** | title | overflow.json, posts.json |

Each entity is stored as `output/{Type}/{entity_id}/page.md` with an optional `_index.md` backlinks file.

### Storage Layout

```
output/{dataset}/
├── Person/
│   └── emp_0047/
│       ├── page.md       # frontmatter + LLM-generated body + wiki-links
│       └── _index.md     # backlinks
├── Organization/
├── Product/
├── Ticket/
├── Repository/
├── Knowledge/
├── email/                # raw communication threads
├── conversation/
├── support_chat/
└── .search.db            # SQLite FTS5 + vector index
```

## Tech Stack

- **Python >=3.12**
- **Google Gemini** (`gemini-2.5-flash-lite`) — LLM generation + embeddings
- **Local LM Studio** (optional) — `qwen3.6-35b-a3b` via local API
- **SQLite + sqlite-vec** — hybrid search index (BM25 + vector)
- **PyYAML** — schema mapping and configuration

## Usage

### Ingestion

```bash
organon-ingest EnterpriseBench/ \
  --output output/EnterpriseBench \
  --workers 500 \
  --mapper src/v1/ingest/mappers/enterprisebench.yaml
```

Options:
- `--just-vectors` — rebuild search index only (skip page generation)
- `--local-qwen` — use local Qwen model instead of Gemini

### Query (programmatic)

```python
from v1.query.main import query
answer = query("What is the latest status on Aguirre LLC?", Path("output/EnterpriseBench"))
```

### Evaluation

```bash
python -m v1.judge.main \
  --dataset-yaml dataset.yaml \
  --dataset-dir output/EnterpriseBench \
  --category graph
```

Options:
- `--id {eval_id}` — run a single evaluation
- `--category graph|db|hybrid` — filter by question type

## Configuration

**Environment variables** (`.env`):
- `GOOGLE_API_KEY` — Gemini API key
- `EMBED_ENDPOINT` — local embedding server URL (optional)
- `EMBED_MODEL` — embedding model name (optional)

**Mapper files** (`src/v1/ingest/mappers/*.yaml`): define how raw data sources map to entity types, frontmatter fields, and related entities.

**Ontology** (`src/v1/ingest/ontology.yaml`): defines the set of entity types and their frontmatter schemas.
