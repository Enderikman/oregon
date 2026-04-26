import { useMemo, useState } from "react";
import type { Source, Fact, Entity } from "@/lib/types";
import type { InterviewSession } from "@/lib/memory-context";
import { Link } from "@tanstack/react-router";

interface SidePanelProps {
  open: boolean;
  onClose: () => void;
  fact: Fact | null;
  subject: Entity | null;
  source: Source | null;
  conflictingFact: Fact | null;
  relatedSessions: InterviewSession[];
}

export function NeuralSidePanel({
  open,
  onClose,
  fact,
  subject,
  source,
  conflictingFact,
  relatedSessions,
}: SidePanelProps) {
  if (!open || !fact) return null;

  return (
    <aside
      role="dialog"
      aria-label="Fact details"
      className="absolute right-4 top-4 bottom-4 z-20 w-[360px] overflow-y-auto rounded-[14px] border border-border bg-surface p-5 shadow-soft"
    >
      <header className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Fact · {fact.factSource === "human" ? "human-taught" : "ai-extracted"}
            {fact.conflictingFactId ? " · in conflict" : ""}
          </div>
          <div className="mt-2 text-[15px] text-ink">
            <span className="text-ink-muted">{subject?.name ?? fact.subject}</span>{" "}
            <span className="text-ink-soft">{fact.predicate}</span>{" "}
            <span className="font-medium">{fact.object}</span>
          </div>
        </div>
        <button
          onClick={onClose}
          className="rounded-md px-2 py-1 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink"
          aria-label="Close panel"
        >
          ✕
        </button>
      </header>

      <dl className="mt-4 grid grid-cols-2 gap-3 text-[12px]">
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Confidence
          </dt>
          <dd className="mt-0.5 font-mono tabular-nums text-ink">
            {Math.round(fact.confidence * 100)}%
          </dd>
        </div>
        <div>
          <dt className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Verified
          </dt>
          <dd className="mt-0.5 font-mono tabular-nums text-ink-muted">
            {new Date(fact.verifiedAt).toLocaleDateString()}
          </dd>
        </div>
      </dl>

      {source && (
        <section className="mt-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Source
          </div>
          <div className="mt-2 rounded-md border border-border bg-background p-3">
            <div className="text-[12px] text-ink">{source.label}</div>
            <p className="mt-1.5 text-[12px] leading-relaxed text-ink-muted">
              "{source.excerpt}"
            </p>
          </div>
        </section>
      )}

      {conflictingFact && (
        <section className="mt-5">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            In conflict with
          </div>
          <div
            className="mt-2 rounded-md border p-3"
            style={{
              borderColor: "var(--graph-conflict)",
              backgroundColor: "var(--danger-soft)",
            }}
          >
            <div className="text-[12px] text-ink">
              <span className="text-ink-muted">{conflictingFact.predicate}:</span>{" "}
              <span className="font-medium">{conflictingFact.object}</span>
            </div>
            <div className="mt-1 font-mono text-[10px] text-ink-soft">
              {Math.round(conflictingFact.confidence * 100)}% ·{" "}
              {conflictingFact.factSource === "human" ? "human" : "ai"}
            </div>
          </div>
        </section>
      )}

      <section className="mt-5">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Interviews that touched this
        </div>
        {relatedSessions.length === 0 ? (
          <p className="mt-2 text-[12px] text-ink-muted">
            No interviews have referenced this fact yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-1.5">
            {relatedSessions.map((s) => (
              <li key={s.id}>
                <Link
                  to="/admin"
                  className="block rounded-md border border-border bg-background px-3 py-2 text-[12px] text-ink hover:bg-surface-2"
                >
                  <span className="font-mono text-[10px] text-ink-soft">{s.id}</span>{" "}
                  · {s.topic} ·{" "}
                  <span className="text-ink-muted">{s.mode}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}

interface SearchProps {
  entities: Entity[];
  onSelect: (entityId: string) => void;
  value: string;
  onChange: (v: string) => void;
}

export function NeuralSearch({ entities, onSelect, value, onChange }: SearchProps) {
  const [open, setOpen] = useState(false);
  const matches = useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return entities
      .filter(
        (e) => e.name.toLowerCase().includes(q) || e.type.includes(q),
      )
      .slice(0, 6);
  }, [entities, value]);

  return (
    <div className="absolute left-4 top-4 z-20 w-[260px]">
      <input
        type="search"
        placeholder="Search entities…"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => setTimeout(() => setOpen(false), 150)}
        className="w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-ink shadow-soft outline-none placeholder:text-ink-soft focus:border-[color:var(--accent)]"
      />
      {open && matches.length > 0 && (
        <ul className="mt-1 overflow-hidden rounded-[10px] border border-border bg-surface shadow-soft">
          {matches.map((e) => (
            <li key={e.id}>
              <button
                onMouseDown={(ev) => {
                  ev.preventDefault();
                  onSelect(e.id);
                  setOpen(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] text-ink hover:bg-surface-2"
              >
                <span className="truncate">{e.name}</span>
                <span className="font-mono text-[10px] uppercase text-ink-soft">
                  {e.type}
                </span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

interface LegendProps {
  className?: string;
}

export function NeuralLegend({ className }: LegendProps) {
  const items: { label: string; color: string }[] = [
    { label: "Human-taught", color: "var(--graph-human)" },
    { label: "AI-extracted", color: "var(--graph-ai)" },
    { label: "In conflict", color: "var(--graph-conflict)" },
  ];
  return (
    <div
      className={`absolute bottom-4 left-4 z-20 rounded-[10px] border border-border bg-surface px-3 py-2 shadow-soft ${className ?? ""}`}
    >
      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
        Edges
      </div>
      <ul className="mt-1 flex gap-3">
        {items.map((it) => (
          <li key={it.label} className="flex items-center gap-1.5 text-[11px] text-ink-muted">
            <span
              aria-hidden
              className="inline-block h-[2px] w-5 rounded-full"
              style={{ backgroundColor: it.color }}
            />
            {it.label}
          </li>
        ))}
      </ul>
    </div>
  );
}

interface ScrubberProps {
  min: number;
  max: number;
  value: number;
  onChange: (v: number) => void;
  total: number;
  visible: number;
}

export function NeuralScrubber({ min, max, value, onChange, total, visible }: ScrubberProps) {
  const date = new Date(value);
  return (
    <div className="absolute bottom-4 right-4 z-20 w-[420px] rounded-[10px] border border-border bg-surface px-4 py-3 shadow-soft">
      <div className="flex items-baseline justify-between">
        <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
          Replay growth
        </div>
        <div className="font-mono text-[10px] tabular-nums text-ink">
          {date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })}
        </div>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="mt-2 w-full accent-[color:var(--accent)]"
        aria-label="Replay graph growth"
      />
      <div className="mt-1 flex justify-between font-mono text-[10px] tabular-nums text-ink-soft">
        <span>{new Date(min).toLocaleDateString()}</span>
        <span className="text-ink-muted">
          {visible} / {total} facts visible
        </span>
        <span>{new Date(max).toLocaleDateString()}</span>
      </div>
    </div>
  );
}
