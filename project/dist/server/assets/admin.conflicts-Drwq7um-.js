import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CmnI0TLV.js";
import { $ as ChevronRight, E as relativeTime, a0 as adminConflicts } from "./router-CGwxE-ll.js";
import { E as EmptyZen } from "./empty-zen-BVjaESqo.js";
import { A as ArrowRight } from "./arrow-right-CLIuDgFg.js";
import { A as ArrowUp } from "./arrow-up-DqCcap8c.js";
import { A as ArrowDown } from "./arrow-down-D0UGej2F.js";
import { S as Search } from "./search-B1JRA4o8.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
import "./proxy-C33hjfT0.js";
const KIND_LABEL = {
  consensus: "Consensus",
  escalation: "Escalation",
  override: "Override"
};
const STATUS_LABEL = {
  open: "Open",
  escalated: "Escalated",
  resolved: "Resolved"
};
function KindChip({ kind }) {
  const map = {
    consensus: { bg: "var(--surface-2)", fg: "var(--ink-muted)" },
    escalation: { bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
    override: { bg: "var(--warning-soft)", fg: "var(--warning)" }
  };
  const c = map[kind];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
      style: { backgroundColor: c.bg, color: c.fg },
      children: KIND_LABEL[kind]
    }
  );
}
function StatusChip({ status }) {
  const map = {
    open: { bg: "var(--surface-2)", fg: "var(--ink)" },
    escalated: { bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
    resolved: { bg: "var(--surface-2)", fg: "var(--ink-soft)" }
  };
  const c = map[status];
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
      style: { backgroundColor: c.bg, color: c.fg },
      children: STATUS_LABEL[status]
    }
  );
}
function RespondentColumn({ r }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex w-[180px] shrink-0 flex-col gap-2 rounded-[12px] border border-border bg-surface p-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-[11px]",
          style: { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" },
          children: r.initials
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "truncate text-[12px] text-ink", children: r.name }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 text-[10px] text-ink-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: r.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono uppercase tracking-wider text-ink-soft", children: r.level })
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "rounded-md bg-surface-2 px-2.5 py-2 text-[12px] italic text-ink",
        style: { lineHeight: 1.35 },
        children: [
          "“",
          r.answer,
          "”"
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between font-mono text-[10px] tabular-nums text-ink-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
        Math.round(r.confidence * 100),
        "% conf"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: relativeTime(r.answeredAt) })
    ] })
  ] });
}
function ChainStep({ step }) {
  if (step.status === "asked") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]",
        style: {
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)"
        },
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "line-through opacity-70", children: step.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider opacity-80", children: step.level })
        ]
      }
    );
  }
  if (step.status === "next") {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "span",
      {
        className: "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-ink",
        style: { borderColor: "var(--accent)", backgroundColor: "var(--surface)" },
        children: [
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
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: step.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: step.level })
        ]
      }
    );
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-ink-muted", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: step.name }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: step.level })
  ] });
}
function actionLabel(c) {
  switch (c.recommendedAction) {
    case "pick_canonical":
      return c.recommendedChoice ? `Pick “${c.recommendedChoice}”` : "Pick canonical";
    case "escalate": {
      const next = c.escalationChain.find((s) => s.status === "next");
      return next ? `Send to ${next.name} (${next.level})` : "Escalate";
    }
    case "override":
      return "Override manually";
  }
}
function actionTone(action) {
  return action === "override" ? "warning" : "accent";
}
function chainSummary(c) {
  const asked = c.escalationChain.filter((s) => s.status === "asked");
  const next = c.escalationChain.find((s) => s.status === "next");
  if (c.recommendedAction === "pick_canonical" && c.recommendedChoice) {
    return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} answered. Recommendation: pick “${c.recommendedChoice}”.`;
  }
  if (c.recommendedAction === "escalate" && next) {
    return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} agreed. Escalating to ${next.name} (${next.level}) for confirmation.`;
  }
  return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} disagree across functions. Manual override required.`;
}
function ConflictCard({ conflict }) {
  const tone = actionTone(conflict.recommendedAction);
  const leftBorder = conflict.status === "escalated" ? "var(--accent)" : conflict.kind === "override" ? "var(--warning)" : "transparent";
  const [aId, bId] = conflict.factPairIds;
  const aFact = conflict.respondents.find((r) => r.factId === aId);
  const bFact = conflict.respondents.find((r) => r.factId === bId) ?? conflict.respondents.find((r) => r.factId !== aId);
  const valueA = aFact?.answer ?? conflict.respondents[0]?.answer ?? "";
  const valueB = bFact?.answer ?? conflict.respondents[1]?.answer ?? "";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "article",
    {
      className: "relative overflow-hidden rounded-[16px] border border-border bg-surface shadow-soft",
      style: { borderLeft: `2px solid ${leftBorder}` },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[15px] text-ink", children: conflict.entityName }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-[13px] text-ink-muted", children: [
                "· ",
                conflict.predicate
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: conflict.id })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(KindChip, { kind: conflict.kind }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(StatusChip, { status: conflict.status })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-5 p-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[10px] border border-border bg-surface-2 px-3.5 py-2.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: "Fact in dispute" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-ink", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "italic", children: [
                "“",
                valueA,
                "”"
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "↔" }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "italic", children: [
                "“",
                valueB,
                "”"
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-mono text-[10px] tabular-nums text-ink-soft", children: [
              conflict.affectedFactCount,
              " downstream fact",
              conflict.affectedFactCount === 1 ? "" : "s",
              " affected · open for ",
              Math.round(conflict.ageMs / 36e5),
              "h"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: "Respondents" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex gap-3 overflow-x-auto pb-1", children: conflict.respondents.map((r) => /* @__PURE__ */ jsxRuntimeExports.jsx(RespondentColumn, { r }, `${r.factId}-${r.interviewId}`)) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: "Escalation chain" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center gap-1.5", children: conflict.escalationChain.map((step, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ChainStep, { step }),
              i < conflict.escalationChain.length - 1 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronRight, { size: 12, className: "text-ink-soft" })
            ] }, `${step.name}-${i}`)) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] text-ink-muted", children: chainSummary(conflict) })
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-2/40 px-5 py-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "max-w-[55%] text-[11px] italic text-ink-soft", children: [
            "System: ",
            conflict.recommendedReason
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium transition-opacity hover:opacity-90",
              style: {
                backgroundColor: tone === "warning" ? "var(--warning)" : "var(--accent)",
                color: tone === "warning" ? "var(--warning-soft)" : "var(--accent-ink)"
              },
              children: [
                actionLabel(conflict),
                /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
              ]
            }
          ) })
        ] })
      ]
    }
  );
}
const STATUS_ORDER = {
  open: 0,
  escalated: 1,
  resolved: 2
};
const SORT_LABEL = {
  age: "Age",
  impact: "Impact",
  status: "Status"
};
function ConflictsPage() {
  const [filter, setFilter] = reactExports.useState("all");
  const [query, setQuery] = reactExports.useState("");
  const [sort, setSort] = reactExports.useState({
    key: "age",
    dir: "desc"
  });
  const deferredQuery = reactExports.useDeferredValue(query);
  const allRows = adminConflicts;
  const filtered = reactExports.useMemo(() => {
    const q = deferredQuery.trim().toLowerCase();
    return allRows.filter((c) => {
      if (filter === "consensus" && c.kind !== "consensus") return false;
      if (filter === "escalation" && c.kind !== "escalation") return false;
      if (filter === "override" && c.kind !== "override") return false;
      if (filter === "high_impact" && c.affectedFactCount < 3) return false;
      if (q) {
        const blob = `${c.entityName} ${c.predicate} ${c.id} ${c.respondents.map((r) => r.name).join(" ")}`.toLowerCase();
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
  const counts = reactExports.useMemo(
    () => ({
      all: allRows.length,
      consensus: allRows.filter((c) => c.kind === "consensus").length,
      escalation: allRows.filter((c) => c.kind === "escalation").length,
      override: allRows.filter((c) => c.kind === "override").length,
      high_impact: allRows.filter((c) => c.affectedFactCount >= 3).length
    }),
    [allRows]
  );
  const cycleSort = () => {
    const order = ["age", "impact", "status"];
    const i = order.indexOf(sort.key);
    setSort({ key: order[(i + 1) % order.length], dir: "desc" });
  };
  const flipDir = () => setSort((s) => ({ key: s.key, dir: s.dir === "asc" ? "desc" : "asc" }));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1200px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6 flex items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Admin · Conflicts" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[26px] font-normal text-ink", children: "Conflict resolution" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] tabular-nums text-ink-soft", children: [
        sorted.length,
        "/",
        allRows.length,
        " open"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex flex-wrap items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "All", count: counts.all, active: filter === "all", onClick: () => setFilter("all") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Consensus", count: counts.consensus, active: filter === "consensus", onClick: () => setFilter("consensus") }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Escalation", count: counts.escalation, active: filter === "escalation", onClick: () => setFilter("escalation"), tone: "accent" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "Override", count: counts.override, active: filter === "override", onClick: () => setFilter("override"), tone: "warning" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(FilterPill, { label: "High impact", count: counts.high_impact, active: filter === "high_impact", onClick: () => setFilter("high_impact") })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "inline-flex items-center gap-1 rounded-full border border-border bg-surface px-2 py-1 text-[12px] text-ink", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "px-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Sort" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: cycleSort,
              className: "rounded-full px-2 py-0.5 hover:bg-surface-2",
              title: "Cycle sort key",
              children: SORT_LABEL[sort.key]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: flipDir,
              className: "rounded-full p-1 text-ink-soft hover:bg-surface-2 hover:text-ink",
              title: "Flip direction",
              children: sort.dir === "asc" ? /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { size: 12 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowDown, { size: 12 })
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative w-full max-w-[260px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Search, { size: 13, className: "absolute left-3 top-1/2 -translate-y-1/2 text-ink-soft" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "input",
            {
              value: query,
              onChange: (e) => setQuery(e.target.value),
              placeholder: "Search entity, respondent…",
              className: "h-9 w-full rounded-full border border-border bg-surface pl-8 pr-3 text-[12px] text-ink placeholder:text-ink-soft focus:border-[color:var(--accent)] focus:outline-none"
            }
          )
        ] })
      ] })
    ] }),
    sorted.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyZen, { copy: "Inbox zero — no open conflicts." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-4", children: sorted.map((c) => /* @__PURE__ */ jsxRuntimeExports.jsx(ConflictCard, { conflict: c }, c.id)) })
  ] });
}
function FilterPill({
  label,
  count,
  active,
  onClick,
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
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: label }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] tabular-nums opacity-70", children: count })
      ]
    }
  );
}
const SplitComponent = ConflictsPage;
export {
  SplitComponent as component
};
