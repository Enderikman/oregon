# Integration guide (for Claude in the target repo)

Follow this checklist top-to-bottom. Stop and ask if any step doesn't match
the target project's structure.

---

## 0. Inventory the target project

Before touching anything, confirm:

- [ ] React 18 or 19
- [ ] Tailwind CSS (v3 or v4) — affects step 2
- [ ] Router: TanStack Router, React Router DOM, or Next.js App Router — affects step 6
- [ ] shadcn/ui installed (look for `components.json` and `src/components/ui/`)
- [ ] Path alias `@/` → `src/` in `tsconfig.json` and bundler config

If the target has an **older version of these features**, locate it first and
list every file that imports the old `NeuralMap` or memory-browser components.
Plan to delete the old files at the end (step 8), not before — this lets you
diff types and behavior while integrating.

---

## 1. Install dependencies

```bash
npm install react-force-graph-2d@^1.27.0 react-force-graph-3d@^1.27.0 \
  three@^0.184.0 framer-motion@^12 lucide-react@^0.575 \
  @tanstack/react-router@^1.168 \
  @radix-ui/react-dialog @radix-ui/react-scroll-area \
  @radix-ui/react-separator @radix-ui/react-tooltip \
  class-variance-authority clsx tailwind-merge
```

Then add the shadcn primitives the kit imports:

```bash
npx shadcn@latest add sheet scroll-area separator tooltip button badge
```

---

## 2. Wire up the design tokens

### Tailwind v4 (the kit's native target)

Append `tokens/styles.append.css` into the project's global stylesheet
(usually `src/styles.css` or `src/index.css`). If `:root { --background: ... }`
already exists, **merge** — don't duplicate. Keep the kit's `--graph-*` vars,
they're the only ones strictly required for the neural map.

### Tailwind v3

1. Copy the `:root { ... }` and `.dark { ... }` blocks from
   `tokens/styles.append.css` into the project's global CSS.
2. Extend `tailwind.config.js`:

```js
module.exports = {
  theme: {
    extend: {
      colors: {
        background: 'var(--background)',
        surface: 'var(--surface)',
        'surface-2': 'var(--surface-2)',
        ink: { DEFAULT: 'var(--ink)', muted: 'var(--ink-muted)', soft: 'var(--ink-soft)' },
        border: 'var(--border)',
        accent: { DEFAULT: 'var(--accent)', soft: 'var(--accent-soft)', ink: 'var(--accent-ink)' },
        warning: { DEFAULT: 'var(--warning)', soft: 'var(--warning-soft)' },
        danger: { DEFAULT: 'var(--danger)', soft: 'var(--danger-soft)' },
      },
      boxShadow: { soft: '0 1px 2px rgba(31,27,22,.04), 0 8px 24px rgba(31,27,22,.06)' },
      fontFamily: { sans: ['Inter', 'ui-sans-serif'], mono: ['JetBrains Mono', 'ui-monospace'] },
    },
  },
};
```

---

## 3. Drop in types

Copy `types/memory-types.ts` → `src/lib/types.ts`.

If the target project already has a `src/lib/types.ts`, **merge** the
`Entity`, `Fact`, `Source`, `AIQuestion`, `EntityType`, `SourceKind`,
`QuestionType`, `FactSource` exports. Either replace its versions, or write a
small adapter file that re-exports under the kit's expected names.

---

## 4. Drop in data + state

Copy these into `src/lib/`:

- `data/mock-data.ts` → `src/lib/mock-data.ts`
- `data/memory-context.tsx` → `src/lib/memory-context.tsx`
- `data/api.ts` → `src/lib/api.ts`
- `data/format.ts` → `src/lib/format.ts` (only if missing)

Wrap the app (or the admin layout) in `<MemoryProvider>`:

```tsx
// src/routes/__root.tsx (or your top-level layout)
import { MemoryProvider } from '@/lib/memory-context';

export const Route = createRootRoute({
  component: () => (
    <MemoryProvider>
      <Outlet />
    </MemoryProvider>
  ),
});
```

**If the target has a real backend**, replace `mock-data.ts` exports with
real loaders and keep the `factInterviewIndex` derivation block at the
bottom of the file (it's pure JS over `adminInterviews` + `aiQuestions`).

---

## 5. Drop in components

Copy:

- `components/neural-map/*` → `src/components/admin/neural-map/`
- `components/memory/*` → `src/components/admin/memory/`
- `components/interviews/interview-turns.tsx` → `src/components/admin/interviews/interview-turns.tsx`
- `components/relative-time.tsx` → `src/components/shared/relative-time.tsx`

All imports inside the kit use `@/lib/...`, `@/components/admin/...`,
`@/components/ui/...`, `@/components/shared/...`. They will resolve as long
as steps 3–5 placed files at those paths.

---

## 6. Add the routes

### TanStack Router (the kit's native target)

Copy:

- `routes/admin.map.tsx` → `src/routes/admin.map.tsx`
- `routes/admin.memory.tsx` → `src/routes/admin.memory.tsx`

The TanStack Router Vite plugin will regenerate `routeTree.gen.ts` on next dev
run. Do not edit `routeTree.gen.ts` by hand.

### React Router DOM

Skip the route files. Wire the components directly:

```tsx
import { NeuralMapPage } from '@/components/admin/neural-map-page';
import { MemoryBrowserPage } from '@/components/admin/memory/memory-browser-page';

<Routes>
  <Route path="/admin/map" element={<NeuralMapPage />} />
  <Route path="/admin/memory" element={<MemoryBrowserPage />} />
</Routes>
```

You'll also need to swap `<Link to="...">` from `@tanstack/react-router` for
`react-router-dom`'s `Link` in:

- `components/neural-map/panels.tsx`
- `components/memory/interview-transcript-drawer.tsx`

A find-replace of `from "@tanstack/react-router"` → `from "react-router-dom"`
covers it; the `to=` prop API is compatible. The typed `params={{ id }}` on
the interview link becomes `to={\`/admin/interviews/${interview.id}\`}`.

### Next.js App Router

Add `"use client"` at the top of `memory-browser-page.tsx` and any file that
imports `NeuralMap` directly. Place the routes under
`app/admin/map/page.tsx` and `app/admin/memory/page.tsx`, each just importing
and rendering the component.

---

## 7. Wire navigation

Add two links to the project's existing admin sub-nav (or wherever admin
navigation lives):

```tsx
<Link to="/admin/map">Neural Map</Link>
<Link to="/admin/memory">Memory</Link>
```

---

## 8. Remove the old version

Now that the new system is wired, delete the old files. Search the codebase
for stale imports:

```bash
rg "from .*neural-map|from .*memory-browser|from .*entity-tree" src
```

Remove anything that no longer resolves, and any old route files
(`/admin/memory-old`, `/admin/graph`, etc.).

---

## 9. Verify

Run the dev server and check:

- [ ] `/admin/map` loads, both 2D and 3D toggles render nodes
- [ ] Time scrubber filters edges; entity click focuses neighborhood
- [ ] Fact node click opens the right side panel
- [ ] `/admin/memory` shows the three-column layout
- [ ] Tree search filters; clicking an entity loads its facts
- [ ] `[[wikilinks]]` in body text are clickable and navigate
- [ ] Clicking a fact's source chip highlights it in the Provenance panel
- [ ] Clicking an interview chip opens the drawer; voice mode shows the
      faux waveform player

If `react-force-graph` throws "ReferenceError: window is not defined" during
SSR, the lazy wrapper in `components/neural-map/graph-view.tsx` got bypassed
or the route wasn't marked client-only. Re-check step 6.
