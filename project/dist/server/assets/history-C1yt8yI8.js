import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { c as createLucideIcon, z as useMemoryStore, L as Link, E as relativeTime } from "./router-CGwxE-ll.js";
import { M as Mic, L as Layers } from "./mic-B3XzTfAc.js";
import { C as CircleCheck } from "./circle-check-C-iq-o04.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "10", key: "1mglay" }],
  ["path", { d: "M12 6v6l4 2", key: "mmk7yg" }]
];
const Clock = createLucideIcon("clock", __iconNode);
function formatDuration(ms) {
  const totalSec = Math.max(0, Math.round(ms / 1e3));
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m < 60) return s === 0 ? `${m}m` : `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm === 0 ? `${h}h` : `${h}h ${rm}m`;
}
function formatDate(iso) {
  const d = new Date(iso);
  return d.toLocaleDateString(void 0, {
    month: "short",
    day: "numeric",
    year: "numeric"
  });
}
function formatTime(iso) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}
function groupByDay(sessions) {
  const groups = /* @__PURE__ */ new Map();
  for (const s of sessions) {
    const d = new Date(s.startedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(s);
  }
  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    label: formatDate(items[0].startedAt),
    items
  }));
}
function HistoryPage() {
  const { sessions } = useMemoryStore();
  const sorted = reactExports.useMemo(
    () => [...sessions].sort((a, b) => a.startedAt < b.startedAt ? 1 : -1),
    [sessions]
  );
  const groups = reactExports.useMemo(() => groupByDay(sorted), [sorted]);
  const totalSessions = sorted.length;
  const totalAnswered = sorted.reduce((acc, s) => acc + s.questionsAnswered, 0);
  const totalDurationMs = sorted.reduce((acc, s) => acc + s.durationMs, 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[820px] px-6 py-10", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Interview history" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[26px] font-normal text-ink", children: "Every session you've used to add context." })
    ] }),
    totalSessions > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-8 grid grid-cols-3 gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Sessions", value: String(totalSessions) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Questions answered", value: String(totalAnswered) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Total time", value: formatDuration(totalDurationMs) })
    ] }),
    totalSessions === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx(EmptyState, {}) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-8", children: groups.map((g) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: g.label }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: g.items.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx(SessionRow, { session: s }, s.id)) })
    ] }, g.key)) })
  ] });
}
function Stat({ label, value }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface px-4 py-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wide text-ink-soft", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[20px] text-ink", children: value })
  ] });
}
function SessionRow({ session }) {
  const isVoice = session.mode === "voice";
  const Icon = isVoice ? Mic : Layers;
  return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-[14px] border border-border bg-surface px-4 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: "grid h-9 w-9 shrink-0 place-items-center rounded-full",
        style: { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" },
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 15 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
            style: {
              backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
              color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)"
            },
            children: isVoice ? "Voice" : "Quiz"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px] text-ink-soft", children: [
          formatTime(session.startedAt),
          " · ",
          relativeTime(session.startedAt)
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 truncate text-[14px] text-ink", children: session.topic }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-muted", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, { size: 12 }),
          formatDuration(session.durationMs)
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12 }),
          session.questionsAnswered,
          " answered"
        ] }),
        session.questionsSkipped > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-soft", children: [
          session.questionsSkipped,
          " skipped"
        ] })
      ] })
    ] })
  ] }) });
}
function EmptyState() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[18px] border border-border bg-surface px-8 py-14 text-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "No sessions yet" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "mt-2 text-[20px] text-ink", children: "You haven't added any context yet :(" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] text-ink-muted", children: "Every voice interview and quiz you complete will appear here." }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Link,
      {
        to: "/",
        className: "mt-5 inline-block rounded-full px-5 py-2.5 text-[13px] font-medium",
        style: { backgroundColor: "var(--accent)", color: "white" },
        children: "Back to cockpit"
      }
    )
  ] });
}
const SplitComponent = HistoryPage;
export {
  SplitComponent as component
};
