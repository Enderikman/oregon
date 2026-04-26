import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { f as cn, z as useMemoryStore, a1 as useNavigate, a2 as currentUser, a3 as initials, T as adminInterviews } from "./router-CGwxE-ll.js";
import { R as RelativeTime } from "./relative-time-Cm9AtzlF.js";
import { A as ArrowUp } from "./arrow-up-DqCcap8c.js";
import { A as ArrowDown } from "./arrow-down-D0UGej2F.js";
import { M as Mic, L as Layers } from "./mic-B3XzTfAc.js";
import { S as Search } from "./search-B1JRA4o8.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const Table = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative w-full overflow-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("table", { ref, className: cn("w-full caption-bottom text-sm", className), ...props }) })
);
Table.displayName = "Table";
const TableHeader = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { ref, className: cn("[&_tr]:border-b", className), ...props }));
TableHeader.displayName = "TableHeader";
const TableBody = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { ref, className: cn("[&_tr:last-child]:border-0", className), ...props }));
TableBody.displayName = "TableBody";
const TableFooter = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "tfoot",
  {
    ref,
    className: cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className),
    ...props
  }
));
TableFooter.displayName = "TableFooter";
const TableRow = reactExports.forwardRef(
  ({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    "tr",
    {
      ref,
      className: cn(
        "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
        className
      ),
      ...props
    }
  )
);
TableRow.displayName = "TableRow";
const TableHead = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "th",
  {
    ref,
    className: cn(
      "h-10 px-2 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableHead.displayName = "TableHead";
const TableCell = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  "td",
  {
    ref,
    className: cn(
      "p-2 align-middle [&:has([role=checkbox])]:pr-0 [&>[role=checkbox]]:translate-y-[2px]",
      className
    ),
    ...props
  }
));
TableCell.displayName = "TableCell";
const TableCaption = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx("caption", { ref, className: cn("mt-4 text-sm text-muted-foreground", className), ...props }));
TableCaption.displayName = "TableCaption";
function formatDuration(ms) {
  if (ms <= 0) return "—";
  const s = Math.round(ms / 1e3);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs === 0 ? `${m}m` : `${m}m ${rs}s`;
}
const STATUS_LABEL = {
  pending: "Pending",
  live: "Live",
  completed: "Completed",
  consolidated: "Consolidated"
};
function StatusCell({ status }) {
  if (status === "live") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-2 text-[12px] text-ink", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "relative inline-flex h-1.5 w-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "absolute inset-0 animate-ping rounded-full",
            style: { backgroundColor: "var(--accent)", opacity: 0.6 }
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "relative inline-flex h-1.5 w-1.5 rounded-full",
            style: { backgroundColor: "var(--accent)" }
          }
        )
      ] }),
      "Live"
    ] });
  }
  const dot = status === "pending" ? "var(--ink-soft)" : status === "completed" ? "var(--accent-soft)" : "var(--accent)";
  const text = status === "pending" ? "text-ink-muted" : "text-ink";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: `inline-flex items-center gap-2 text-[12px] ${text}`, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        "aria-hidden": true,
        className: "inline-block h-1.5 w-1.5 rounded-full",
        style: { backgroundColor: dot, border: status === "completed" ? "1px solid var(--accent)" : void 0 }
      }
    ),
    STATUS_LABEL[status]
  ] });
}
function ModeChip({ mode }) {
  const Icon = mode === "voice" ? Mic : Layers;
  const isVoice = mode === "voice";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
      style: {
        backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
        color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 10 }),
        isVoice ? "Voice" : "Swipe"
      ]
    }
  );
}
function AccuracyChip({ value, status }) {
  if (status === "pending") return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[12px] text-ink-soft", children: "—" });
  const pct = Math.round(value * 100);
  let bg = "var(--surface-2)";
  let fg = "var(--ink-muted)";
  if (value < 0.7) {
    bg = "var(--warning-soft)";
    fg = "var(--warning)";
  } else if (value >= 0.9) {
    bg = "var(--accent-soft)";
    fg = "var(--accent-ink)";
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums",
      style: { backgroundColor: bg, color: fg },
      children: [
        pct,
        "%"
      ]
    }
  );
}
function SortHeader({
  label,
  k,
  sort,
  onSortChange,
  align = "left"
}) {
  const active = sort.key === k;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onSortChange({
        key: k,
        dir: active ? sort.dir === "asc" ? "desc" : "asc" : "desc"
      }),
      className: `inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${active ? "text-ink" : "text-ink-soft hover:text-ink"} ${align === "right" ? "ml-auto" : ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        active && (sort.dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 10 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 10 }))
      ]
    }
  );
}
function InterviewsTable({ rows, sort, onSortChange, onRowClick, selectedId }) {
  if (rows.length === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface px-8 py-16 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "No matches" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] text-ink-muted", children: "No interviews match the current filter or search." })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-hidden rounded-[14px] border border-border bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Table, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableHeader, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(TableRow, { className: "border-border hover:bg-transparent", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Interviewee" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Topic" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Mode" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Status", k: "status", sort, onSortChange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Started", k: "startedAt", sort, onSortChange }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Duration", k: "durationMs", sort, onSortChange, align: "right" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Facts added", k: "factsAdded", sort, onSortChange, align: "right" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(TableHead, { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(SortHeader, { label: "Accuracy", k: "accuracy", sort, onSortChange, align: "right" }) })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(TableBody, { children: rows.map((row) => {
      const isLive = row.status === "live";
      const isSelected = row.id === selectedId;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        TableRow,
        {
          onClick: () => onRowClick(row.id),
          className: `cursor-pointer border-border transition-colors hover:bg-surface-2 ${isSelected ? "bg-surface-2" : ""}`,
          style: isLive ? { boxShadow: "inset 2px 0 0 0 var(--accent)" } : void 0,
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "div",
                {
                  className: "grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-[11px]",
                  style: { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" },
                  children: row.interviewee.initials
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[13px] text-ink", children: row.interviewee.name }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[11px] text-ink-muted", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: row.interviewee.role }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "font-mono text-[9px] uppercase tracking-wider",
                      style: { color: "var(--ink-soft)" },
                      children: [
                        "· ",
                        row.interviewee.level
                      ]
                    }
                  )
                ] })
              ] })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs(TableCell, { className: "px-4 py-3", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] text-ink", children: row.topic }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-ink-soft", children: row.topicId })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(ModeChip, { mode: row.mode }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx(StatusCell, { status: row.status }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3 text-[12px] text-ink-muted", children: /* @__PURE__ */ jsxRuntimeExports.jsx(RelativeTime, { iso: row.startedAt }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink", children: formatDuration(row.durationMs) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink", children: row.factsAdded > 0 ? row.factsAdded : /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "—" }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(TableCell, { className: "px-4 py-3 text-right", children: /* @__PURE__ */ jsxRuntimeExports.jsx(AccuracyChip, { value: row.accuracy, status: row.status }) })
          ]
        },
        row.id
      );
    }) })
  ] }) });
}
const STATUS_ORDER = {
  pending: 0,
  live: 1,
  completed: 2,
  consolidated: 3
};
function InterviewsPage() {
  const { sessions } = useMemoryStore();
  const navigate = useNavigate();
  const [filter, setFilter] = reactExports.useState("all");
  const [query, setQuery] = reactExports.useState("");
  const [sort, setSort] = reactExports.useState({
    key: "startedAt",
    dir: "desc"
  });
  const deferredQuery = reactExports.useDeferredValue(query);
  const liveRows = reactExports.useMemo(() => {
    return sessions.map((s) => {
      const denom = s.questionsAnswered + s.questionsSkipped;
      const accuracy = denom > 0 ? s.questionsAnswered / denom : 0;
      return {
        id: `int_${s.id}`,
        interviewee: {
          name: currentUser.name,
          initials: initials(currentUser.name) || currentUser.initials,
          role: currentUser.role,
          level: "IC"
        },
        topic: s.topic,
        topicId: `topic_${s.id}`,
        mode: s.mode === "voice" ? "voice" : "swipe",
        status: "completed",
        startedAt: s.startedAt,
        durationMs: s.durationMs,
        factsAdded: s.questionsAnswered,
        accuracy,
        conflictsFound: 0,
        questionIds: s.questionIds
      };
    });
  }, [sessions]);
  const allRows = reactExports.useMemo(() => [...liveRows, ...adminInterviews], [liveRows]);
  const filtered = reactExports.useMemo(() => {
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
  const sorted = reactExports.useMemo(() => {
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
  const counts = reactExports.useMemo(() => {
    return {
      all: allRows.length,
      voice: allRows.filter((r) => r.mode === "voice").length,
      swipe: allRows.filter((r) => r.mode === "swipe").length,
      pending: allRows.filter((r) => r.status === "pending").length,
      live: allRows.filter((r) => r.status === "live").length,
      conflicts: allRows.filter((r) => r.conflictsFound > 0).length
    };
  }, [allRows]);
  const handleRowClick = (id) => {
    navigate({ to: "/admin/interviews/$id", params: { id } });
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Admin · Interviews" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[26px] font-normal text-ink", children: "Interview tracking" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] tabular-nums text-ink-soft", children: [
        sorted.length,
        "/",
        allRows.length,
        " sessions"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "All", count: counts.all, active: filter === "all", onClick: () => setFilter("all") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Voice", count: counts.voice, active: filter === "voice", onClick: () => setFilter("voice") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Swipe", count: counts.swipe, active: filter === "swipe", onClick: () => setFilter("swipe") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Pending", count: counts.pending, active: filter === "pending", onClick: () => setFilter("pending") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Live", count: counts.live, active: filter === "live", onClick: () => setFilter("live"), dot: true }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Conflicts", count: counts.conflicts, active: filter === "conflicts", onClick: () => setFilter("conflicts"), tone: "warning" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-[280px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "input",
          {
            value: query,
            onChange: (e) => setQuery(e.target.value),
            placeholder: "Search interviewee, topic, ID…",
            className: "h-9 w-full rounded-full border border-border bg-surface pl-8 pr-3 text-[12px] text-ink placeholder:text-ink-soft focus:border-[color:var(--accent)] focus:outline-none"
          }
        )
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InterviewsTable,
      {
        rows: sorted,
        sort,
        onSortChange: setSort,
        onRowClick: handleRowClick,
        selectedId: null
      }
    )
  ] });
}
function FilterPill({
  label,
  count,
  active,
  onClick,
  dot = false,
  tone = "default"
}) {
  const bg = active ? tone === "warning" ? "bg-warning-soft text-warning" : "bg-accent-soft text-accent-ink" : "bg-surface-2 text-ink-muted hover:text-ink";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick,
      className: `inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] transition-colors ${bg}`,
      children: [
        dot && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            "aria-hidden": true,
            className: "relative inline-flex h-1.5 w-1.5",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "absolute inset-0 animate-ping rounded-full",
                  style: { backgroundColor: "var(--accent)", opacity: 0.6 }
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  className: "relative inline-flex h-1.5 w-1.5 rounded-full",
                  style: { backgroundColor: "var(--accent)" }
                }
              )
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tabular-nums opacity-70", children: count })
      ]
    }
  );
}
const SplitComponent = InterviewsPage;
export {
  SplitComponent as component
};
