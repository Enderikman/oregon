import { Fragment, useMemo } from "react";
import type { MemoryPage, MemoryTreeEntry } from "@/lib/api";

interface Props {
  page: MemoryPage;
  tree: MemoryTreeEntry[];
  onSelectEntity: (id: string) => void;
}

const HIDDEN_FM_KEYS = new Set(["type", "name", "title"]);

export function EntityDetail({ page, tree, onSelectEntity }: Props) {
  const visibleFm = useMemo(
    () => Object.entries(page.frontmatter).filter(([k]) => !HIDDEN_FM_KEYS.has(k)),
    [page.frontmatter],
  );

  const nameById = useMemo(() => {
    const m = new Map<string, string>();
    for (const e of tree) m.set(e.id, e.name);
    return m;
  }, [tree]);

  return (
    <article className="rounded-[14px] border border-border bg-surface p-6 shadow-soft">
      <header className="border-b border-border pb-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          <span>{page.type}</span>
          <span>·</span>
          <span className="normal-case">{page.id}</span>
        </div>
        <h1 className="mt-1.5 text-[24px] font-normal text-ink">{page.name}</h1>
      </header>

      {visibleFm.length > 0 && (
        <section className="mt-4 border-b border-border pb-4">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Metadata
          </div>
          <dl className="mt-2 grid grid-cols-[auto_1fr] gap-x-4 gap-y-1">
            {visibleFm.map(([k, v]) => (
              <Fragment key={k}>
                <dt className="font-mono text-[11px] text-ink-soft">{k}</dt>
                <dd className="text-[13px] text-ink">{String(v)}</dd>
              </Fragment>
            ))}
          </dl>
        </section>
      )}

      <section className="mt-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Page content
        </div>
        <div className="mt-2 text-[14px] leading-relaxed text-ink">
          <WikiBody body={page.body} nameById={nameById} onSelect={onSelectEntity} />
        </div>
      </section>
    </article>
  );
}

function WikiBody({
  body,
  nameById,
  onSelect,
}: {
  body: string;
  nameById: Map<string, string>;
  onSelect: (id: string) => void;
}) {
  const parts = body.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[\[([^|\]]+?)(?:\|([^\]]+))?\]\]$/.exec(part);
        if (!m) {
          if (part.includes("\n\n")) {
            return (
              <Fragment key={i}>
                {part.split(/\n\n+/).map((para, j) => (
                  <p key={j} className={j > 0 ? "mt-3" : ""}>
                    {para}
                  </p>
                ))}
              </Fragment>
            );
          }
          return <Fragment key={i}>{part}</Fragment>;
        }
        const slug = m[1];
        const display = m[2] || nameById.get(slug) || slug;
        const exists = nameById.has(slug);
        if (!exists) {
          return (
            <span
              key={i}
              className="font-mono text-[12px] text-ink-soft"
              title={`Unknown: ${slug}`}
            >
              {display}
            </span>
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(slug)}
            className="rounded-sm font-medium underline decoration-dotted underline-offset-2 transition-colors hover:bg-[color:var(--accent-soft)]"
            style={{ color: "var(--accent-ink)" }}
          >
            {display}
          </button>
        );
      })}
    </>
  );
}
