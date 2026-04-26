# Qontext Memory Kit

Two complete features, packaged for hand-off to another codebase:

1. **Neural Map** (`/admin/map`) — interactive 2D/3D force-graph of entities ↔
   facts, with time scrubber, search, dim toggle, and a fact-detail side panel.
2. **Memory Browser** (`/admin/memory`) — VFS-style three-column browser
   (entity tree → entity page with facts → backlinks + provenance), plus an
   interview transcript drawer with faux audio playback for voice sessions.

Everything in this kit is **frontend-only** and works against a mock dataset
shipped in `data/mock-data.ts`. There is no backend dependency.

---

## File map

```
qontext-memory-kit/
├── README.md                     ← you are here
├── INTEGRATION.md                ← step-by-step for Claude in the target repo
├── package-deps.json             ← exact npm deps + versions
├── tokens/
│   └── styles.append.css         ← design tokens (Tailwind v4 @theme + :root vars)
├── types/
│   └── memory-types.ts           ← Entity, Fact, Source, AIQuestion, etc.
├── data/
│   ├── mock-data.ts              ← entities, facts, sources, questions, interviews
│   ├── memory-context.tsx        ← <MemoryProvider/> + useMemoryStore()
│   ├── api.ts                    ← thin selector layer over mock-data
│   └── format.ts                 ← relativeTime() helper
├── routes/
│   ├── admin.map.tsx             ← TanStack Router file-based route
│   └── admin.memory.tsx
├── components/
│   ├── relative-time.tsx         ← SSR-safe RelativeTime
│   ├── neural-map/
│   │   ├── neural-map.tsx        ← top-level page component
│   │   ├── graph-view.tsx        ← SSR-safe lazy wrapper
│   │   ├── graph-view-impl.tsx   ← react-force-graph 2d/3d impl
│   │   ├── build-graph.ts        ← builds nodes/edges + adjacency + neighborhood
│   │   ├── colors.ts             ← entity-type & fact-source palette helpers
│   │   └── panels.tsx            ← search, scrubber, legend, side panel
│   ├── memory/
│   │   ├── memory-browser-page.tsx
│   │   ├── entity-tree.tsx
│   │   ├── entity-detail.tsx          (renders [[wikilinks]])
│   │   ├── provenance-panel.tsx
│   │   ├── source-of-fact-chip.tsx    (AI / human / interview chip)
│   │   └── interview-transcript-drawer.tsx
│   └── interviews/
│       └── interview-turns.tsx        (VoiceTranscript + SwipeReplay, shared)
└── ui-shims/
    └── README.md                 ← which shadcn primitives to install
```

---

## Required dependencies

See `package-deps.json` for the exact version map. The non-obvious ones:

- `react-force-graph-2d`, `react-force-graph-3d`, `three` — the graph engine.
  These touch `window` at import; the `graph-view.tsx` wrapper guards SSR.
- `@tanstack/react-router` — file-based routes. If the target uses
  React Router DOM instead, see INTEGRATION.md for the swap.
- shadcn/ui `sheet` — the only shadcn primitive the kit actually imports
  (`memory/interview-transcript-drawer.tsx`). Install with
  `npx shadcn@latest add sheet`.

---

## Tailwind tokens

The kit assumes these CSS custom properties exist on `:root` and `.dark`:

| Token                    | Purpose                                    |
|--------------------------|--------------------------------------------|
| `--background`           | page background                            |
| `--surface`, `--surface-2` | card backgrounds                         |
| `--ink`, `--ink-muted`, `--ink-soft` | text ramp                      |
| `--border`               | borders                                    |
| `--accent`, `--accent-soft`, `--accent-ink` | brand accent              |
| `--warning`, `--warning-soft`, `--danger`, `--danger-soft` | semantic |
| `--graph-human`, `--graph-ai`, `--graph-conflict` | edge colors      |
| `--graph-{client,employee,product,policy,project,decision}` | nodes  |
| `--shadow-soft`          | drop shadow on cards                       |

`tokens/styles.append.css` is a drop-in. Append it to the target project's
global stylesheet (Tailwind v4) or extract the `:root`/`.dark` blocks and add
a manual mapping (Tailwind v3 — see INTEGRATION.md).

---

## Data contract (the adapter surface)

If the target project already has its own data layer, you only need to expose
five shapes. The kit reads them via `data/api.ts` and `data/memory-context.tsx`.

```ts
interface Entity {
  id: string;
  type: "client" | "employee" | "product" | "policy" | "project" | "decision";
  name: string;
  summary: string;
  body: string;          // may contain [[entity-id]] wikilinks
  factIds: string[];
  backlinks: string[];   // entity ids that link to this one
  updatedAt: string;
}

interface Fact {
  id: string;
  subject: string;       // entity id
  predicate: string;
  object: string;
  confidence: number;    // 0..1
  verifiedAt: string;
  sourceId: string;
  factSource: "ai" | "human";
  conflictingFactId?: string;
  taughtBy?: string;
}

interface Source {
  id: string;
  kind: "email" | "crm_row" | "ticket" | "pdf_excerpt" | "doc" | "human_reply";
  label: string;
  excerpt: string;
}

interface AIQuestion {
  id: string;
  question: string;
  affectedFactIds: string[];   // ← drives factInterviewIndex
  // ...
}

// Runtime-built in data/mock-data.ts:
type FactInterviewIndex = Record</*factId*/ string, /*interviewId*/ string[]>;
```

`factInterviewIndex` is the bridge that lets the Memory Browser show
"Aditya K. · int_142" on a fact: for every interview, walk its question ids,
look up each `AIQuestion.affectedFactIds`, and bucket the interview id under
each fact id. See the bottom of `data/mock-data.ts` for the exact
implementation (~10 lines).

---

## SSR note

`react-force-graph-*` references `window` at module import. The kit handles
this with a lazy + mount-guarded wrapper in `components/neural-map/graph-view.tsx`.
**Do not remove the wrapper.** If the target uses Next.js App Router, mark
the route with `"use client"` at the top of the page that imports `NeuralMap`.

---

## What's intentionally NOT here

- Authentication, user roles, real backend.
- Other admin surfaces (Cockpit, Conflicts, Interviews list/detail, Quiz, etc.).
- Top navigation, layout shell — wire the two routes into your existing nav.
