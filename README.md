# oregon

<p align="center">
  <img src="assets/diagram.png" alt="Oregon architecture — sources → entity decomposition → knowledge graph → hybrid search → answer" width="100%"/>
</p>

An **organizational memory system**. Ingest company artifacts (emails, Slack, PDFs, CRM), decompose them into entity-linked knowledge graphs, and answer queries via entity-based + BM25 hybrid search.

Humans teach the system through swipe quizzes and voice interviews. Admins inspect the knowledge graph in a neural map.

> All data is mocked — no backend required to run.

---

## Quickstart

```bash
# frontend only
cd frontend && bun install && bun run dev   # → http://localhost:8080

# full stack (backend + frontend)
cd backend && python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
cd .. && ./dev.sh                           # → backend :8000, frontend :8080
```

---

## Routes

| Route | Description |
|---|---|
| `/` | Cockpit — health strip, entry to quiz/interview |
| `/quiz/$id` | Swipe quiz — confirm/reject AI-extracted facts |
| `/interview/$id` | Voice-style interview UI |
| `/admin` | Overview — health, trends, memory chat |
| `/admin/map` | Neural map (reactflow knowledge graph) |
| `/admin/interviews` | Interview log + detail |
| `/admin/conflicts` | Conflicting-facts queue |

---

## Stack

TanStack Start v1 · React 19 · Vite · Tailwind v4 · shadcn/ui · reactflow · framer-motion · Cloudflare Workers

---

## Backend API contract

When `VITE_API_BASE_URL` is set, `src/lib/quiz-api.ts` calls:

```
GET  {base}/open-questions?userId={uuid}
POST {base}/ingest-answer
POST {base}/ai/clarify          (SSE)
POST {base}/ai/draft
```

When unset, everything is mocked locally.
