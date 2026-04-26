# oregon

Frontend prototype of an **organizational memory system** — an AI ingests company
artifacts (emails, CRM rows, tickets, docs), extracts subject→predicate→object
facts about entities, and asks humans to resolve ambiguities via Tinder-style
quizzes and voice-style interviews. Admins inspect the resulting knowledge graph
in a neural map.

All data is mocked in `project/src/lib/mock-data.ts`. **No backend is required.**

---

## Stack

- **Framework:** TanStack Start v1 (React 19, SSR via Vite plugin)
- **Runtime:** Cloudflare Worker (`wrangler`)
- **Routing:** TanStack Router, file-based in `src/routes/`
- **Styling:** Tailwind CSS v4 (config inline in `src/styles.css`)
- **UI:** shadcn/ui + Radix, framer-motion, reactflow, recharts
- **Package manager:** Bun (lockfile-less — `bunfig.toml` sets `saveTextLockfile = false`). npm/pnpm also work.

---

## Prerequisites

| Tool      | Version       | Notes                                                    |
| --------- | ------------- | -------------------------------------------------------- |
| Node.js   | ≥ 20          | Vite 7 + React 19 require modern Node.                   |
| Bun       | ≥ 1.1         | Recommended. `curl -fsSL https://bun.sh/install \| bash` |
| Wrangler  | bundled       | Pulled in via `@cloudflare/vite-plugin`. No global install needed. |

---

## Repo layout

```
oregon/
├── project/          ← the actual app — run all commands from here
│   ├── src/
│   │   ├── routes/        file-based TanStack routes
│   │   ├── components/    feature folders + ui/ (shadcn) + shared/
│   │   ├── lib/           types, mock-data, memory-context, quiz-api, …
│   │   ├── hooks/
│   │   └── styles.css     Tailwind v4 @theme tokens
│   ├── package.json
│   ├── vite.config.ts     uses @lovable.dev/vite-tanstack-config
│   ├── wrangler.jsonc     Cloudflare Worker config
│   ├── bunfig.toml
│   ├── CLAUDE.md          ← read this for conventions
│   └── .env.example
└── archive/          old prototypes, ignored
```

---

## Setup

```bash
git clone <repo-url> oregon
cd oregon/project

# install deps
bun install         # or: npm install / pnpm install

# env (optional — app runs fully mocked without it)
cp .env.example .env
```

### Environment variables

`.env` is **optional**. The app reads exactly one Vite var; everything else is mocked.

| Var                  | Where used                          | Required | Default | Purpose |
| -------------------- | ----------------------------------- | -------- | ------- | ------- |
| `VITE_API_BASE_URL`  | `src/lib/quiz-api.ts:43`            | No       | `""`    | Base URL of the quiz/ingest backend. Empty ⇒ in-memory mock store. |

Vite only exposes vars prefixed `VITE_` to the client bundle. Anything sensitive
(API keys, tokens) must **not** be prefixed `VITE_` and must live in `.dev.vars`
(see below) so it stays server-only.

#### Cloudflare Worker secrets — `.dev.vars`

For local Worker development, server-side secrets go in `project/.dev.vars`
(gitignored). Wrangler injects them as `env.X` bindings during `vite dev` and
`vite preview`. Example:

```
API_TOKEN=...
OPENAI_API_KEY=...
```

In production, set them with:

```bash
bunx wrangler secret put API_TOKEN
```

The current codebase does not consume any Worker bindings — `.dev.vars` is only
needed once you wire a real backend.

---

## Running locally

All commands run from `project/`.

```bash
bun run dev          # http://localhost:5173 — Vite dev server, HMR, mock data
bun run build        # production build (Worker bundle in dist/)
bun run build:dev    # build with development mode flags
bun run preview      # serve the built Worker via wrangler
bun run lint         # eslint .
bun run format       # prettier --write .
```

Replace `bun run` with `npm run` / `pnpm` if you prefer.

---

## Deploying (Cloudflare Workers)

`wrangler.jsonc` defines a Worker named `tanstack-start-app` with
`nodejs_compat`. To deploy:

```bash
cd project
bunx wrangler login         # one-time
bun run build
bunx wrangler deploy
```

Set production secrets with `wrangler secret put <NAME>`. Update `name` in
`wrangler.jsonc` before deploying to your own account.

---

## App surfaces

| Route                          | What it is                                                         |
| ------------------------------ | ------------------------------------------------------------------ |
| `/`                            | Cockpit — health strip, quick entry into quiz/interview            |
| `/quiz/$id`                    | Tinder-style swipe quiz over AI-extracted facts                    |
| `/interview/$id`               | Voice-style interview UI (transcript + voice stage)                |
| `/history`                     | Past contributions                                                 |
| `/settings`                    | User settings                                                      |
| `/admin`                       | Overview — health, trends, memory chat panel                       |
| `/admin/map`                   | Neural map (reactflow graph)                                       |
| `/admin/interviews[/$id]`      | Interview log + detail                                             |
| `/admin/conflicts`             | Conflicting-facts queue                                            |

A former `/admin/memory` browser was removed; the underlying memory store stays.
See `project/CLAUDE.md` for full conventions.

---

## Domain model

Source of truth: `project/src/lib/types.ts`. Key shapes — `Entity`, `Fact`
(`subject → predicate → object` with `confidence`, `factSource`, optional
`conflictingFactId`), `Source`, `AIQuestion`, `MemoryHealth`, `GraphNode` /
`GraphEdge`. The store lives in `src/lib/memory-context.tsx`
(`useMemoryStore`) — cockpit, quiz, interviews, conflicts all read from it.

---

## Wiring a real backend

Set `VITE_API_BASE_URL=https://your.api` in `project/.env`. The contract
expected by `src/lib/quiz-api.ts`:

```
GET  {base}/open-questions?userId={uuid}
     → [{ question: { id, text }, poi: string[] }]

POST {base}/ingest-answer
     body: { userId, questionId, answer, durationMs?, followupText?, clarifications? }
     → { success: boolean }

POST {base}/ai/clarify   (SSE — OpenAI-style chunks)
POST {base}/ai/draft     → { draft: string }
```

When `VITE_API_BASE_URL` is empty, all of the above is short-circuited to the
local mock store.

---

## Troubleshooting

- **Port busy:** Vite picks a free port automatically (sandbox detection is
  enabled by `@lovable.dev/vite-tanstack-config`).
- **`routeTree.gen.ts` looks weird:** auto-generated — never edit. Restart `dev`.
- **Tailwind class missing:** v4 has no `tailwind.config.js`. Edit tokens in
  `src/styles.css` (`@theme`).
- **Worker SSR errors about Node APIs:** no `child_process`, no native binaries.
  `nodejs_compat` is on but treat it as Workers-runtime first.
- **Bun lockfile churn:** intentional — `saveTextLockfile = false`. Use
  `package-lock.json` if you prefer npm.
