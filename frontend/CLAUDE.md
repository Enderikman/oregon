# Project Context for Claude

## What this is

A frontend prototype for an **organizational memory system** — an AI that ingests company artifacts (emails, CRM rows, tickets, docs), extracts facts about entities (clients, employees, products, policies, projects, decisions), and asks humans to resolve ambiguities, conflicts, and gaps. Humans teach the AI through interviews and quick quizzes; admins inspect the resulting knowledge graph.

All data is mocked in `src/lib/mock-data.ts`. There is no backend.

## Stack

- **Framework**: TanStack Start v1 (React 19, SSR via Vite plugin, deploys as a Cloudflare Worker)
- **Routing**: TanStack Router with file-based routes in `src/routes/` (flat dot-separated naming, e.g. `admin.interviews.$id.tsx`). `routeTree.gen.ts` is auto-generated — never edit it.
- **Styling**: Tailwind CSS v4, configured via `@import` and `@theme` in `src/styles.css` (no `tailwind.config.js`). All colors defined as `oklch` semantic tokens.
- **UI primitives**: shadcn/ui (Radix under the hood) in `src/components/ui/`
- **Animation**: framer-motion
- **Graph**: react-force-graph (2d + 3d) for the Neural Map; uses three.js. Lazy-loaded behind a mount guard for SSR safety.
- **State**: React context + `useLocalStorage` hook. No server, no TanStack Query usage yet.
- **Build/runtime constraints**: Worker SSR — no Node-only packages, no `child_process`, no native binaries.

## App surfaces (routes)

- `/` — landing / cockpit entry (`src/routes/index.tsx`, `src/components/cockpit/`)
- `/quiz/$id` — Tinder-style swipe quiz where humans confirm/reject AI-extracted facts
- `/interview/$id` — voice-style interview UI (transcript stream, voice stage, progress)
- `/history` — past contributions
- `/settings`
- `/admin` (layout) — gated admin surface with sub-nav:
  - `/admin` — overview (health strip, trends, memory chat panel)
  - `/admin/map` — neural map (reactflow graph of entities and facts)
  - `/admin/interviews` + `/admin/interviews/$id` — interview log and detail
  - `/admin/conflicts` — conflicting facts queue
  - `/admin/memory` — VFS-style memory browser (entity tree → entity detail with facts → backlinks/provenance, interview transcript drawer)

## Domain model

See `src/lib/types.ts` for the source of truth. Key shapes:

- `Entity` — a person, company, product, etc. with `factIds[]` and `backlinks[]`.
- `Fact` — `subject → predicate → object` triple with `confidence`, `factSource` (`ai` | `human`), optional `conflictingFactId`, and a `sourceId` pointer.
- `Source` — the artifact a fact was extracted from (email, CRM row, ticket, PDF excerpt, doc, human reply).
- `AIQuestion` — a disambiguation/conflict/gap/low-confidence/categorization prompt the AI raises for a human.
- `MemoryHealth` — aggregate stats shown in cockpit and admin (facts learned, avg confidence, open questions, conflicts, sources).
- `GraphNode` / `GraphEdge` — feed the neural map.

The memory store lives in `src/lib/memory-context.tsx` (`useMemoryStore`). Cockpit, quiz, interviews, and conflicts all read from it — do not delete it.

## Conventions

- **Design tokens only**: never write raw color classes (`text-white`, `bg-black`). Use semantic tokens defined in `src/styles.css` (`bg-background`, `text-ink`, `text-ink-soft`, `text-ink-muted`, `border-border`, `var(--accent)`, etc.).
- **Typography**: monospaced labels (`font-mono text-[10px] uppercase tracking-wider`) for section eyebrows; restrained, editorial body type. No generic SaaS purple gradients.
- **Routing imports**: always `@tanstack/react-router`, never `react-router-dom`.
- **Links**: use `<Link to="/exact/path">` with type-safe params. Route files must exist before linking.
- **Components**: small, focused, colocated by feature under `src/components/<feature>/`. Shared primitives in `src/components/ui/` and `src/components/shared/`.
- **Hooks**: in `src/hooks/`.
- **No business logic in UI-only changes**: when the user asks for a UI tweak, keep edits in presentation code.

## Things that are intentionally not here

- No real backend, no Supabase/Lovable Cloud, no auth.
- No `src/pages/` directory — TanStack Start uses `src/routes/`.
- No `tailwind.config.js` — Tailwind v4 config lives in `src/styles.css`.
- No `entry-client.tsx` / `entry-server.tsx` — handled by the TanStack Start Vite plugin.

## When making changes

1. Read `src/lib/types.ts` and the relevant feature folder before edits.
2. For new routes, create the file in `src/routes/` first; the plugin regenerates `routeTree.gen.ts`.
3. For new colors/spacing, extend tokens in `src/styles.css` rather than inlining values.
4. After deletes, verify with `rg` that nothing still imports the removed path.
