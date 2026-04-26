import { useDeferredValue, useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "@tanstack/react-router";
import { adminInterviews, currentUser } from "@/lib/mock-data";
import type { AdminInterview } from "@/lib/mock-data";
import { useMemoryStore } from "@/lib/memory-context";
import { initials as makeInitials } from "@/lib/format";
import { InterviewsTable, type SortKey, type SortDir } from "./interviews-table";

type FilterKey = "all" | "voice" | "swipe" | "pending" | "live" | "conflicts";

const STATUS_ORDER: Record<AdminInterview["status"], number> = {
  pending: 0,
  live: 1,
  completed: 2,
  consolidated: 3,
};

export function InterviewsPage() {
  const { sessions } = useMemoryStore();
  const navigate = useNavigate();
  const [filter, setFilter] = useState<FilterKey>("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: SortDir }>({
    key: "startedAt",
    dir: "desc",
  });

  const deferredQuery = useDeferredValue(query);

  // Bridge real recorded sessions into the AdminInterview shape.
  const liveRows = useMemo<AdminInterview[]>(() => {
    return sessions.map((s) => {
      const denom = s.questionsAnswered + s.questionsSkipped;
      const accuracy = denom > 0 ? s.questionsAnswered / denom : 0;
      return {
        id: `int_${s.id}`,
        interviewee: {
          name: currentUser.name,
          initials: makeInitials(currentUser.name) || currentUser.initials,
          role: currentUser.role,
          level: "IC" as const,
        },
        topic: s.topic,
        topicId: `topic_${s.id}`,
        mode: s.mode === "voice" ? "voice" : "swipe",
        status: "completed" as const,
        startedAt: s.startedAt,
        durationMs: s.durationMs,
        factsAdded: s.questionsAnswered,
        accuracy,
        conflictsFound: 0,
        questionIds: s.questionIds,
      };
    });
  }, [sessions]);

  const allRows = useMemo(() => [...liveRows, ...adminInterviews], [liveRows]);

  const filtered = useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return allRows.filter((r) => {
      if (filter === "voice" && r.mode !== "voice") return false;
      if (filter === "swipe" && r.mode !== "swipe") return false;
      if (filter === "pending" && r.status !== "pending") return false;
      if (filter === "live" && r.status !== "live") return false;
      if (filter === "conflicts" && r.conflictsFound === 0) return false;
      if (q) {
        const blob = `${r.interviewee.name} ${r.interviewee.role} ${r.topic} ${r.topicId} ${r.id}`.toLowerCase();
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
        case "startedAt":
          return (new Date(a.startedAt).getTime() - new Date(b.startedAt).getTime()) * dir;
        case "durationMs":
          return (a.durationMs - b.durationMs) * dir;
        case "factsAdded":
          return (a.factsAdded - b.factsAdded) * dir;
        case "accuracy":
          return (a.accuracy - b.accuracy) * dir;
        case "status":
          return (STATUS_ORDER[a.status] - STATUS_ORDER[b.status]) * dir;
        default:
          return 0;
      }
    });
    return arr;
  }, [filtered, sort]);

  const counts = useMemo(() => {
    return {
      all: allRows.length,
      voice: allRows.filter((r) => r.mode === "voice").length,
      swipe: allRows.filter((r) => r.mode === "swipe").length,
      pending: allRows.filter((r) => r.status === "pending").length,
      live: allRows.filter((r) => r.status === "live").length,
      conflicts: allRows.filter((r) => r.conflictsFound > 0).length,
    };
  }, [allRows]);

  const handleRowClick = (id: string) => {
    navigate({ to: "/admin/interviews/$id", params: { id } });
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Admin · Interviews
          </div>
          <h1 className="mt-1 text-[26px] font-normal text-ink">Interview tracking</h1>
        </div>
        <div className="font-mono text-[11px] tabular-nums text-ink-soft">
          {sorted.length}/{allRows.length} sessions
        </div>
      </header>

      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <FilterPill label="All" count={counts.all} active={filter === "all"} onClick={() => setFilter("all")} />
          <FilterPill label="Voice" count={counts.voice} active={filter === "voice"} onClick={() => setFilter("voice")} />
          <FilterPill label="Swipe" count={counts.swipe} active={filter === "swipe"} onClick={() => setFilter("swipe")} />
          <FilterPill label="Pending" count={counts.pending} active={filter === "pending"} onClick={() => setFilter("pending")} />
          <FilterPill label="Live" count={counts.live} active={filter === "live"} onClick={() => setFilter("live")} dot />
          <FilterPill label="Conflicts" count={counts.conflicts} active={filter === "conflicts"} onClick={() => setFilter("conflicts")} tone="warning" />
        </div>
        <div className="relative w-full max-w-[280px]">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search interviewee, topic, ID…"
            className="h-9 w-full rounded-full border border-border bg-surface pl-8 pr-3 text-[12px] text-ink placeholder:text-ink-soft focus:border-[color:var(--accent)] focus:outline-none"
          />
        </div>
      </div>

      <InterviewsTable
        rows={sorted}
        sort={sort}
        onSortChange={setSort}
        onRowClick={handleRowClick}
        selectedId={null}
      />
    </main>
  );
}

function FilterPill({
  label,
  count,
  active,
  onClick,
  dot = false,
  tone = "default",
}: {
  label: string;
  count: number;
  active: boolean;
  onClick: () => void;
  dot?: boolean;
  tone?: "default" | "warning";
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
      {dot && (
        <span
          aria-hidden
          className="relative inline-flex h-1.5 w-1.5"
        >
          <span
            className="absolute inset-0 animate-ping rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.6 }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </span>
      )}
      <span>{label}</span>
      <span className="font-mono text-[10px] tabular-nums opacity-70">{count}</span>
    </button>
  );
}
