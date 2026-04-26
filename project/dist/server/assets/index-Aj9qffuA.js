import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CmnI0TLV.js";
import { L as Link, E as relativeTime, z as useMemoryStore, G as greeting, H as api } from "./router-CGwxE-ll.js";
import { Q as QuestionTypeChip } from "./question-type-chip-Tjh9sxDs.js";
import { m as motion } from "./proxy-C33hjfT0.js";
import { E as EmptyZen } from "./empty-zen-BVjaESqo.js";
import { M as Mic, L as Layers } from "./mic-B3XzTfAc.js";
import { f as finaleLandscape } from "./finale-landscape-Ug6mP7nY.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function AIQuestionCard({ q }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    motion.div,
    {
      initial: { opacity: 0, y: 4 },
      animate: { opacity: 1, y: 0 },
      transition: { duration: 0.22, ease: "easeOut" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/quiz/$id",
          params: { id: q.id },
          className: "block rounded-[14px] border border-border bg-surface p-5 shadow-soft transition-colors hover:bg-surface-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionTypeChip, { type: q.type }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[11px] text-ink-soft", children: relativeTime(q.raisedAt) })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "mt-3 text-[16px] leading-snug text-ink", children: q.question })
          ]
        }
      )
    }
  );
}
function ResolveQueuePanel({ count }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      className: "mb-8 rounded-[18px] border border-border p-6 shadow-soft",
      style: { background: "linear-gradient(180deg, var(--accent-soft) 0%, var(--surface) 100%)" },
      children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center justify-between gap-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[18px] text-ink", children: "Resolve your queue" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[13px] text-ink-muted", children: [
            "Walk through all ",
            count,
            " ",
            count === 1 ? "question" : "questions",
            " in one sitting. Pause whenever — saved answers stay saved."
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-wrap items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/interview/$id",
              params: { id: "queue" },
              className: "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium",
              style: { backgroundColor: "var(--accent)", color: "white" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Mic, { size: 15 }),
                "Voice Call"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/quiz/$id",
              params: { id: "queue" },
              className: "inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2",
              style: { borderColor: "var(--border)", backgroundColor: "var(--surface)" },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Layers, { size: 15 }),
                "Quiz Mode"
              ]
            }
          )
        ] })
      ] })
    }
  );
}
const filters = [
  { key: "all", label: "All" },
  { key: "disambiguation", label: "Disambiguation" },
  { key: "conflict", label: "Conflicts" },
  { key: "gap", label: "Gaps" },
  { key: "low_confidence", label: "Low confidence" }
];
function CockpitPage() {
  const { questions } = useMemoryStore();
  const user = api.getCurrentUser();
  const [filter, setFilter] = reactExports.useState("all");
  const totalOpen = reactExports.useMemo(
    () => questions.filter((q) => q.status === "open").length,
    [questions]
  );
  const open = reactExports.useMemo(() => {
    return questions.filter((q) => q.status === "open").filter((q) => filter === "all" || q.type === filter).sort((a, b) => {
      const ai = a.affectedFactIds.length + a.unblocksQuestionIds.length * 2;
      const bi = b.affectedFactIds.length + b.unblocksQuestionIds.length * 2;
      return bi - ai;
    });
  }, [questions, filter]);
  if (totalOpen === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "fixed inset-0 overflow-hidden", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "img",
        {
          src: finaleLandscape,
          alt: "",
          "aria-hidden": true,
          className: "absolute inset-0 h-full w-full object-cover"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "relative z-10 flex h-full w-full items-end px-6 pb-12 sm:px-12 sm:pb-16", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "max-w-[640px] text-white", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-[0.3em] text-white/70", children: "All clear" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-2 text-4xl sm:text-5xl font-light tracking-tight", children: [
          greeting(),
          ", ",
          user.name.split(" ")[0],
          "."
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-sm sm:text-base text-white/80 max-w-md", children: "The AI has no questions for you. The memory is current." })
      ] }) })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[980px] px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "text-[26px] font-normal text-ink", children: [
        greeting(),
        ", ",
        user.name.split(" ")[0],
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[14px] text-ink-muted", children: "The AI is asking you to teach it where it's unsure." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", "aria-label": "Today's queue", children: [
      totalOpen > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ResolveQueuePanel, { count: totalOpen }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Today's queue" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap gap-1", children: filters.map((f) => {
          const active = filter === f.key;
          return /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: () => setFilter(f.key),
              className: `rounded-full px-3 py-1 text-[12px] transition-colors ${active ? "text-ink" : "text-ink-muted hover:text-ink"}`,
              style: active ? { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" } : void 0,
              children: f.label
            },
            f.key
          );
        }) })
      ] }),
      open.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyZen, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "space-y-3", children: open.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx(AIQuestionCard, { q }, q.id)) })
    ] })
  ] });
}
const SplitComponent = CockpitPage;
export {
  SplitComponent as component
};
