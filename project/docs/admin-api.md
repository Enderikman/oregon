# Admin Panel — REST API

Endpoints required to back the `/admin` surfaces. Today the panel reads from `src/lib/mock-data.ts` via `src/lib/api.ts`. This doc lists what the real backend must expose, scoped to the admin UI.

Conventions:

- Base path: `/api/v1`
- Auth: bearer token; admin-role required on every endpoint here.
- Responses are JSON. Timestamps are ISO-8601 UTC. IDs are opaque strings.
- List endpoints accept `?cursor` / `?limit` (default 50, max 200) and return `{ items, nextCursor }`.
- Filter/sort/search params are listed per endpoint.
- Type names below match `src/lib/types.ts` and `src/lib/mock-data.ts` unless stated.

---

## 1. Overview — `/admin`

Backs `HealthStrip`, the trends row, and `MemoryChatPanel`.

### `GET /admin/metrics`
Headline numbers for the health strip.

```ts
// 200
{
  factsLearned: number,
  confidenceAvg: number,        // 0..1
  openInterviews: number,
  conflictsPending: number,
  sourcesConnected: number,
  sourcesTotal: number
}
```

### `GET /admin/trends?days=7`
Daily series for the trends row. Oldest → newest.

```ts
// 200
{
  factsAdded: number[],          // length = days
  confidence: number[],          // 0..1
  interviewCompletion: number[], // 0..1
  conflictOpenHours: number[]    // hours
}
```

### `POST /admin/memory/chat`
Memory chat panel (asks about a user / entity).

```ts
// req
{
  prompt: string,
  subjectEntityId?: string,      // defaults to current user
  conversationId?: string        // server-issued; omit on first turn
}
// 200
{
  conversationId: string,
  reply: string,                 // markdown allowed
  citedFactIds?: string[],
  citedSourceIds?: string[]
}
```

---

## 2. Neural Map — `/admin/map`

Backs `NeuralMap`, search, scrubber, side panel.

### `GET /admin/graph`
Full graph payload used to build entity + fact nodes and edges.

```ts
// 200
{
  entities: Entity[],            // see types.ts
  facts: Fact[],                 // includes conflictingFactId
  sources: Source[]              // referenced via fact.sourceId
}
```

Optional: `?since=<iso>` for incremental polling.

### `GET /admin/entities/{id}`
Single entity for focus / search hit.

```ts
// 200
Entity & { facts: Fact[] }       // facts inlined for the focus card
```

### `GET /admin/facts/{id}`
Side-panel detail when a fact node is selected.

```ts
// 200
{
  fact: Fact,
  subject: Entity,
  source: Source,
  conflictingFact?: Fact,
  relatedSessions: InterviewSession[]   // see §3
}
```

### `GET /admin/entities?search=&type=`
Search box autocomplete. Returns lightweight rows.

```ts
// 200
{ items: Array<Pick<Entity, "id"|"name"|"type"|"summary">> }
```

---

## 3. Interviews — `/admin/interviews`, `/admin/interviews/{id}`

Backs the interview table, detail page, and the live-session list bridged from `useMemoryStore().sessions`.

### `GET /admin/interviews`
Query: `mode=voice|swipe`, `status=pending|live|completed|consolidated`, `hasConflicts=true`, `search=`, `sort=startedAt|durationMs|factsAdded|accuracy|status`, `dir=asc|desc`.

```ts
// 200
{
  items: AdminInterview[],       // shape from mock-data.ts
  facets: {
    all: number, voice: number, swipe: number,
    pending: number, live: number, conflicts: number
  },
  nextCursor?: string
}
```

### `GET /admin/interviews/{id}`
Detail page payload.

```ts
// 200
{
  interview: AdminInterview,
  questions: AIQuestion[],       // q.affectedFactIds drive the rest
  facts: Fact[],
  entitiesTouched: Entity[],
  transcript?: {
    mode: "voice" | "swipe",
    audioUrl?: string,           // voice only
    turns: Array<{
      questionId: string,
      askedAt: string,
      answer?: string,
      answeredAt?: string
    }>
  }
}
```

### `POST /admin/interviews/{id}/reanalyze`
Re-run AI analysis (the "Re-run analysis" button). Async.

```ts
// 202
{ jobId: string }
```

### `GET /admin/interviews/{id}/reanalyze/{jobId}`
Poll for completion.

```ts
// 200
{ status: "queued" | "running" | "done" | "error", error?: string }
```

### `POST /admin/interviews`
Used by `recordSession` in `memory-context.tsx` to persist a finished local session.

```ts
// req
InterviewSession                 // see memory-context.tsx
// 201
AdminInterview                   // server-normalized row
```

---

## 4. Conflicts — `/admin/conflicts`

Backs the queue and the per-card actions.

### `GET /admin/conflicts`
Query: `kind=consensus|escalation|override`, `status=open|escalated|resolved`, `highImpact=true` (≥3 affected), `search=`, `sort=age|impact|status`, `dir=asc|desc`.

```ts
// 200
{
  items: AdminConflict[],        // shape from mock-data.ts
  facets: {
    all: number, consensus: number, escalation: number,
    override: number, high_impact: number
  },
  nextCursor?: string
}
```

### `GET /admin/conflicts/{id}`
Single conflict detail (used if we deep-link a card).

```ts
// 200
AdminConflict
```

### `POST /admin/conflicts/{id}/resolve`
Drives the three card actions: pick canonical, escalate, override.

```ts
// req
{
  action: "pick_canonical" | "escalate" | "override",
  choice?: string,               // required for pick_canonical / override
  escalateTo?: string,           // respondent name; required for escalate
  note?: string
}
// 200
{
  conflict: AdminConflict,       // updated status / chain
  affectedFactIds: string[]      // facts the resolution propagated to
}
```

---

## 5. Shared resources

These are referenced by the surfaces above and may be reused elsewhere; listed for completeness.

| Method | Path                       | Notes                                            |
| ------ | -------------------------- | ------------------------------------------------ |
| GET    | `/admin/sources`           | List ingestion streams + status, like `SourceStream` in types.ts. |
| GET    | `/admin/sources/{id}`      | Source artifact (email, ticket, etc).            |
| GET    | `/admin/questions`         | Open AI questions; supports `?status&type&entityId`. |
| GET    | `/admin/me`                | Current admin user — replaces `api.getCurrentUser()`. |

---

## Open questions

- Pagination strategy for `/admin/graph` once entities exceed a few hundred (server-side filter by neighborhood?).
- Whether `recordSession` should remain client-pushed or be derived server-side from the quiz/voice transports.
- Realtime updates: SSE on `/admin/conflicts/stream` and `/admin/interviews/stream` would replace today's polling, but is out of scope until needed.
