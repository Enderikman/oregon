import { Fragment, useMemo } from "react";
import { ArrowRight } from "lucide-react";
import type { Entity, Fact } from "@/lib/types";
import { RelativeTime } from "@/components/shared/relative-time";
import { SourceOfFactChip } from "./source-of-fact-chip";

interface Props {
  entity: Entity;
  facts: Fact[];
  allEntities: Entity[];
  focus: { kind: "source" | "interview"; id: string } | null;
  onFocusChange: (target: { kind: "source" | "interview"; id: string }) => void;
  onSelectEntity: (id: string) => void;
}

export function EntityDetail({
  entity,
  facts,
  allEntities,
  focus,
  onFocusChange,
  onSelectEntity,
}: Props) {
  const entityFacts = useMemo(
    () => facts.filter((f) => entity.factIds.includes(f.id)),
    [facts, entity.factIds],
  );

  const linkMap = useMemo(() => {
    const m = new Map<string, Entity>();
    for (const e of allEntities) m.set(e.id, e);
    return m;
  }, [allEntities]);

  return (
    <article className="rounded-[14px] border border-border bg-surface p-6 shadow-soft">
      {/* Header */}
      <header className="border-b border-border pb-4">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          <span>{entity.type}</span>
          <span>·</span>
          <span>updated</span>
          <RelativeTime iso={entity.updatedAt} />
        </div>
        <h1 className="mt-1.5 text-[24px] font-normal text-ink">{entity.name}</h1>
        <p className="mt-2 text-[13px] text-ink-muted">{entity.summary}</p>
      </header>

      {/* Body with wikilinks */}
      <section className="mt-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Notes
        </div>
        <p className="mt-2 text-[14px] leading-relaxed text-ink">
          <WikiBody body={entity.body} linkMap={linkMap} onSelect={onSelectEntity} />
        </p>
      </section>

      {/* Facts */}
      <section className="mt-6">
        <div className="mb-3 flex items-baseline justify-between">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Facts ({entityFacts.length})
          </div>
          <div className="font-mono text-[10px] text-ink-soft">
            click a fact → trace its source
          </div>
        </div>
        {entityFacts.length === 0 ? (
          <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-[12px] italic text-ink-soft">
            No facts recorded yet for this entity.
          </p>
        ) : (
          <ul className="space-y-2">
            {entityFacts.map((f) => (
              <FactRow
                key={f.id}
                fact={f}
                focus={focus}
                onFocusChange={onFocusChange}
              />
            ))}
          </ul>
        )}
      </section>
    </article>
  );
}

// ------- Fact row -------

function FactRow({
  fact,
  focus,
  onFocusChange,
}: {
  fact: Fact;
  focus: { kind: "source" | "interview"; id: string } | null;
  onFocusChange: (target: { kind: "source" | "interview"; id: string }) => void;
}) {
  const pct = Math.round(fact.confidence * 100);
  const confColor =
    fact.confidence >= 0.85
      ? "var(--accent)"
      : fact.confidence >= 0.6
        ? "var(--warning)"
        : "var(--danger, #c54b4b)";
  const conflict = !!fact.conflictingFactId;

  return (
    <li className="group rounded-[10px] border border-border bg-background px-3.5 py-2.5 transition-colors hover:border-[color:var(--accent)]/40">
      <div className="flex items-baseline justify-between gap-3">
        <div className="min-w-0 text-[13px]">
          <span className="text-ink-muted">{fact.predicate}</span>{" "}
          <span className="font-medium text-ink">{fact.object}</span>
        </div>
        <ArrowRight
          size={12}
          className="shrink-0 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100"
        />
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-2">
        <span
          className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tabular-nums"
          style={{ backgroundColor: "var(--surface-2)", color: confColor }}
        >
          {pct}%
        </span>
        {conflict && (
          <span
            className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
            style={{ backgroundColor: "var(--warning-soft)", color: "var(--warning)" }}
          >
            conflict
          </span>
        )}
        <SourceOfFactChip fact={fact} onActivate={onFocusChange} active={focus} />
      </div>
    </li>
  );
}

// ------- Wikilink body parser -------

function WikiBody({
  body,
  linkMap,
  onSelect,
}: {
  body: string;
  linkMap: Map<string, Entity>;
  onSelect: (id: string) => void;
}) {
  // Split on [[id]] keeping the matched segments.
  const parts = body.split(/(\[\[[^\]]+\]\])/g);
  return (
    <>
      {parts.map((part, i) => {
        const m = /^\[\[([^\]]+)\]\]$/.exec(part);
        if (!m) return <Fragment key={i}>{part}</Fragment>;
        const id = m[1];
        const target = linkMap.get(id);
        if (!target) {
          return (
            <span
              key={i}
              className="font-mono text-[12px] text-ink-soft"
              title={`Unknown entity: ${id}`}
            >
              [[{id}]]
            </span>
          );
        }
        return (
          <button
            key={i}
            type="button"
            onClick={() => onSelect(id)}
            className="rounded-sm font-medium underline decoration-dotted underline-offset-2 transition-colors hover:bg-[color:var(--accent-soft)]"
            style={{ color: "var(--accent-ink)" }}
          >
            {target.name}
          </button>
        );
      })}
    </>
  );
}
