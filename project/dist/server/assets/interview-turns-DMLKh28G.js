import { c as createLucideIcon } from "./router-CGwxE-ll.js";
import { U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
const __iconNode$1 = [
  ["path", { d: "M12 8V4H8", key: "hb8ula" }],
  ["rect", { width: "16", height: "12", x: "4", y: "8", rx: "2", key: "enze0r" }],
  ["path", { d: "M2 14h2", key: "vft8re" }],
  ["path", { d: "M20 14h2", key: "4cs60a" }],
  ["path", { d: "M15 13v2", key: "1xurst" }],
  ["path", { d: "M9 13v2", key: "rq6x2g" }]
];
const Bot = createLucideIcon("bot", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M5 5a2 2 0 0 1 3.008-1.728l11.997 6.998a2 2 0 0 1 .003 3.458l-12 7A2 2 0 0 1 5 19z",
      key: "10ikf1"
    }
  ]
];
const Play = createLucideIcon("play", __iconNode);
function VoiceTranscript({ interviewee, turns }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-4", children: turns.map((q, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "space-y-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]",
          style: { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" },
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 12 })
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13px]",
          style: { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" },
          children: q.question
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] tabular-nums text-ink-soft", children: String(i + 1).padStart(2, "0") })
    ] }),
    q.status === "resolved" && q.resolution && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-end justify-end gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[80%] rounded-2xl rounded-br-md border border-border bg-surface-2 px-4 py-2.5 text-[13px] text-ink", children: q.resolution.choice }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]",
          style: { backgroundColor: "var(--surface-2)", color: "var(--ink)" },
          children: interviewee.initials
        }
      )
    ] })
  ] }, q.id)) });
}
function SwipeReplay({ interviewee, turns }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "grid gap-3 sm:grid-cols-2", children: turns.map((q, i) => {
    const answered = q.status === "resolved" && q.resolution;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-[12px] border border-border bg-surface-2 p-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
          "card ",
          String(i + 1).padStart(2, "0")
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "span",
          {
            className: "rounded-full px-1.5 py-0.5 text-[9px]",
            style: {
              backgroundColor: answered ? "var(--accent-soft)" : "var(--surface)",
              color: answered ? "var(--accent-ink)" : "var(--ink-soft)"
            },
            children: answered ? "answered" : "skipped"
          }
        )
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[13px] text-ink", children: q.question }),
      answered && q.resolution && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-center gap-2 border-t border-border pt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[9px]",
            style: { backgroundColor: "var(--surface)", color: "var(--ink)" },
            children: interviewee.initials
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] italic text-ink", children: [
          "“",
          q.resolution.choice,
          "”"
        ] })
      ] })
    ] }, q.id);
  }) });
}
export {
  Bot as B,
  Play as P,
  SwipeReplay as S,
  VoiceTranscript as V
};
