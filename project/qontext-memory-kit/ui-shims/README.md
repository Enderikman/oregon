# shadcn/ui primitives required by this kit

The kit imports these from `@/components/ui/...`. Install them in the target
project with shadcn-cli (works with the standard `components.json` setup):

```bash
npx shadcn@latest add sheet scroll-area separator tooltip button badge
```

Files the kit imports directly:

| Import path                            | Used by                                       |
|----------------------------------------|-----------------------------------------------|
| `@/components/ui/sheet`                | `memory/interview-transcript-drawer.tsx`      |

Indirect (via shadcn primitives the above pulls in): `dialog`, `cn` util in
`@/lib/utils.ts`.

If your project does not use shadcn, swap `Sheet`/`SheetContent`/`SheetHeader`/
`SheetTitle` for any side-drawer primitive (e.g. Radix Dialog with a slide
animation). The drawer is the only shadcn surface in the kit.
