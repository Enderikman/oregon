import { useDeferredValue, useMemo, useState } from "react";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { adminConflicts } from "@/lib/mock-data";
import type { AdminConflict, ConflictStatus } from "@/lib/mock-data";
import { EmptyZen } from "@/components/shared/empty-zen";
import { ConflictCard } from "./conflict-card";


type FilterKey = "all" | "consensus" | "escalation" | "override" | "high_impact";
type SortKey = "age" | "impact" | "status";
type SortDir = "asc" | "desc";

const STATUS_ORDER: Record<ConflictStatus, number> = {
  open: 0,
  escalated: 1,
  resolved: 2,
};

const SORT_LABEL: Record<SortKey, string> = {
  age: "Age",
  impact: "Impact",
  status: "Status",
};

export function ConflictsPage() {
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "age",
    dir: "desc",
  });
  

  const deferredQuery = useDeferredValue(query);

  const allRows: AdminConflict[] = adminConflicts;

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return allRows.filter((c) => {
      if (filter === "consensus" && c.kind !== "consensus") return false;
      if (filter === "escalation" && c.kind !== "escalation") return false;
      if (filter === "override" && c.kind !== "override") return false;
      if (filter === "high_impact" && c.affectedFactCount < 3) return false;
      if (q) {
        const blob = `${c.entityName} ${c.predicate} ${c.id} ${c.respondents
          .map((r) => r.name)
          .join(" ")}`.toLowerCase();
        if (!blob.includes(q)) return false;
      }
      return true;
    });
  }, [allRows, filter, deferredQuery]);

  const sorted = useMemo(() => {
    const arr = [...filtered];
    const dir = sort.dir === "asc" ? 1 : -1;
    arr.sort((a, b) => {
      switch (sort.key) {
        case "age":
          return (a.ageMs - b.ageMs) * dir;
        case "impact":
          return (a.affectedFactCount - b.affectedFactCount) * dir;
        case "status":
          return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sort]);

  const counts = useMemo(
    () => ({
      all: allRows.length,
      consensus: allRows.filter((c) => c.kind === "consensus").length,
      escalation: allRows.filter((c) => c.kind === "escalation").length,
      override: allRows.filter((c) => c.kind === "override").length,
      high_impact: allRows.filter((c) => c.affectedFactCount >= 3).length,
    }),
    [allRows],
  );

  const cycleSort = () => {
    const order: SortKey[] = ["age", "impact", "status"];
    const i = order.indexOf(sort.key);
    setSort({ key: order[(i + 1) % order.length], dir: "desc" });
  };

  const flipDir = () =>
    setSort((s) => ({ key: s.key, dir: s.dir === "asc" ? "desc" : "asc" }));

  return (
    <main className="mx-auto max-w-[1200px] px-6 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Admin · Conflicts
          </div>
          <h1 className="mt-1 text-[26px] font-normal text-ink">Conflict resolution</h1>
        </div>
        <div className="font-mono text-[11px] tabular-nums text-ink-soft">
          {sorted.length}/{allRows.length} open
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterPill label="All" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterPill label="Consensus" count={counts.consensus} active={filter === "consensus"} onClick={() => setFilter("consensus")} />
          <FilterPill label="Escalation" count={counts.escalation} active={filter === "escalation"} onClick={() => setFilter("escalation")} tone="accent" />
          <FilterPill label="Override" count={counts.override} active={filter === "override"} onClick={() => setFilter("override")} tone="warning" />
          <FilterPill label="High impact" count={counts.high_impact} active={filter === "high_impact"} onClick={() => setFilter("high_impact")} />
        </div>
        <div className="flex items-center gap-2">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[12px] text-ink">
            <span className="px-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Sort
            </span>
            <button
              type="button"
              onClick={cycleSort}
              className="rounded-full px-2 py-0.5 hover:bg-surface-2"
              title="Cycle sort key"
            >
              {SORT_LABEL[sort.key]}
            </button>
            <button
              type="button"
              onClick={flipDir}
              className="rounded-full p-1 text-ink-soft hover:bg-surface-2 hover:text-ink"
              title="Flip direction"
            >
              {sort.dir === "asc" ? <ArrowUp size={12} /> : <ArrowDown size={12} />}
            </button>
          </div>
          <div className="relative w-full max-w-[260px]">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search entity, respondent…"
              className="h-9 w-full rounded-full border border-border bg-surface pl-8 pr-3 text-[12px] text-ink placeholder:text-ink-soft focus:border-[color:var(--accent)] focus:outline-none"
            />
          </div>
        </div>
      </div>

      {sorted.length === 0 ? (
        <EmptyZen copy="Inbox zero — no open conflicts." />
      ) : (
        <div className="space-y-4">
          {sorted.map((c) => (
            <ConflictCard key={c.id} conflict={c} />
          ))}
        </div>
      )}
    </main>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
  tone = "default",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  tone?: "default" | "warning" | "accent";
}) {
  const bg = active
    ? tone === "warning"
      ? "bg-warning-soft text-warning"
      : "bg-accent-soft text-accent-ink"
    : "bg-surface-2 text-ink-muted hover:text-ink";
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors ${bg}`}
    >
      <span>{label}</span>
      <span className="font-mono text-[10px] tabular-nums opacity-70">{count}</span>
    </button>
  );
}
