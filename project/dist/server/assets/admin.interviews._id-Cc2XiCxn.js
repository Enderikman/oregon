import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { c as createLucideIcon, a1 as useNavigate, T as adminInterviews, z as useMemoryStore, Y as aiQuestions, a4 as facts, _ as entities, L as Link, a5 as Route } from "./router-CGwxE-ll.js";
import { P as Play, V as VoiceTranscript, S as SwipeReplay } from "./interview-turns-DMLKh28G.js";
import { R as RelativeTime } from "./relative-time-Cm9AtzlF.js";
import { A as ArrowLeft } from "./arrow-left-B0ghWIUI.js";
import { C as CircleCheck } from "./circle-check-C-iq-o04.js";
import { M as Mic, L as Layers } from "./mic-B3XzTfAc.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8", key: "v9h5vc" }],
  ["path", { d: "M21 3v5h-5", key: "1q7to0" }],
  ["path", { d: "M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16", key: "3uifl3" }],
  ["path", { d: "M8 16H3v5", key: "1cv678" }]
];
const RefreshCw = createLucideIcon("refresh-cw", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3",
      key: "wmoenq"
    }
  ],
  ["path", { d: "M12 9v4", key: "juzpu7" }],
  ["path", { d: "M12 17h.01", key: "p32p05" }]
];
const TriangleAlert = createLucideIcon("triangle-alert", __iconNode);
function formatDuration(ms) {
  if (ms <= 0) return "—";
  const s = Math.round(ms / 1e3);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs === 0 ? `${m}m` : `${m}m ${rs}s`;
}
function InterviewDetailPage({ interviewId }) {
  const navigate = useNavigate();
  const interview = adminInterviews.find((i) => i.id === interviewId) ?? null;
  const { questions } = useMemoryStore();
  const [rerunning, setRerunning] = reactExports.useState(false);
  const [rerunDone, setRerunDone] = reactExports.useState(false);
  if (!interview) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-[1200px] px-6 py-12", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface p-8 text-center", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Not found" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-2 text-[14px] text-ink-muted", children: [
        "No interview matches ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono", children: interviewId }),
        "."
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "button",
        {
          type: "button",
          onClick: () => navigate({ to: "/admin/interviews" }),
          className: "mt-4 rounded-full border border-border px-4 py-2 text-[12px] text-ink hover:bg-surface-2",
          children: "← Back to interviews"
        }
      )
    ] }) });
  }
  const linkedQuestions = interview.questionIds.map((qid) => questions.find((q) => q.id === qid) ?? aiQuestions.find((q) => q.id === qid)).filter((q) => Boolean(q));
  const factSet = /* @__PURE__ */ new Set();
  linkedQuestions.forEach((q) => q.affectedFactIds.forEach((id) => factSet.add(id)));
  const derivedFacts = Array.from(factSet).map((id) => facts.find((f) => f.id === id)).filter((f) => Boolean(f));
  const entitySet = /* @__PURE__ */ new Set();
  linkedQuestions.forEach((q) => q.affectedEntityIds.forEach((id) => entitySet.add(id)));
  derivedFacts.forEach((f) => entitySet.add(f.subject));
  const touchedEntities = Array.from(entitySet).map((id) => entities.find((e) => e.id === id)).filter((e) => Boolean(e));
  const autoAdded = derivedFacts.filter((f) => f.confidence >= 0.85 && !f.conflictingFactId);
  const flagged = derivedFacts.filter((f) => f.confidence < 0.85 || f.conflictingFactId);
  const handleRerun = () => {
    setRerunning(true);
    setRerunDone(false);
    setTimeout(() => {
      setRerunning(false);
      setRerunDone(true);
      setTimeout(() => setRerunDone(false), 2400);
    }, 1500);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-6 flex flex-wrap items-end justify-between gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/admin/interviews",
            className: "inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft hover:text-ink",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 11 }),
              "Admin · Interviews"
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-end gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "text-[26px] font-normal text-ink", children: interview.topic }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[12px] uppercase tracking-wider text-ink-soft", children: interview.id })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: interview.interviewee.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: interview.interviewee.role }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: interview.interviewee.level }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ModeChip, { mode: interview.mode }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(RelativeTime, { iso: interview.startedAt }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono tabular-nums", children: formatDuration(interview.durationMs) })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: handleRerun,
          disabled: rerunning,
          className: "inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[12px] text-ink transition-colors hover:bg-surface-2 disabled:opacity-60",
          title: "Re-run AI analysis (mocked)",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(RefreshCw, { size: 13, className: rerunning ? "animate-spin" : "" }),
            rerunning ? "Re-running…" : rerunDone ? "Analysis up-to-date" : "Re-run analysis"
          ]
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[14px] border border-border bg-surface p-6 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 flex items-center justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: interview.mode === "voice" ? "Voice transcript" : "Swipe replay" }),
            interview.mode === "voice" && /* @__PURE__ */ jsxRuntimeExports.jsxs(
              "button",
              {
                type: "button",
                disabled: true,
                className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] opacity-60",
                style: { backgroundColor: "var(--accent)", color: "var(--accent-ink)" },
                children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 11 }),
                  "Play audio"
                ]
              }
            )
          ] }),
          linkedQuestions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border px-4 py-8 text-center text-[12px] italic text-ink-soft", children: "No transcript captured for this session." }) : interview.mode === "voice" ? /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceTranscript, { interviewee: interview.interviewee, turns: linkedQuestions }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SwipeReplay, { interviewee: interview.interviewee, turns: linkedQuestions })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[14px] border border-border bg-surface p-6 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-baseline justify-between", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Graph subgraph" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] tabular-nums text-ink-soft", children: [
              touchedEntities.length,
              " entities · ",
              derivedFacts.length,
              " facts"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mb-4 text-[12px] text-ink-muted", children: "Edges this interview created or strengthened. Solid links were created here; dashed links existed before and were re-confirmed." }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            SubgraphView,
            {
              interviewee: interview.interviewee,
              entities: touchedEntities,
              facts: derivedFacts
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--accent)", label: "created" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(LegendDot, { color: "var(--ink-soft)", label: "strengthened", dashed: true })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "AI analysis" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 grid grid-cols-3 gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { label: "Facts", value: String(derivedFacts.length) }),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Stat,
              {
                label: "Accuracy",
                value: interview.status === "pending" ? "—" : `${Math.round(interview.accuracy * 100)}%`
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              Stat,
              {
                label: "Conflicts",
                value: String(interview.conflictsFound),
                tone: interview.conflictsFound > 0 ? "warning" : "default"
              }
            )
          ] })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CircleCheck, { size: 12, style: { color: "var(--accent)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
              "Auto-added (",
              autoAdded.length,
              ")"
            ] })
          ] }),
          autoAdded.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] italic text-ink-soft", children: "Nothing crossed the auto-add threshold (≥85% confidence, no conflict)." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: autoAdded.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FactRow, { fact: f }, f.id)) })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-2 flex items-center gap-1.5", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(TriangleAlert, { size: 12, style: { color: "var(--warning)" } }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
              "Flagged (",
              flagged.length,
              ")"
            ] })
          ] }),
          flagged.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[12px] italic text-ink-soft", children: "Nothing flagged. Clean run." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: flagged.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FactRow, { fact: f, flagged: true }, f.id)) })
        ] }),
        touchedEntities.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface p-5 shadow-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Entities touched" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-1", children: touchedEntities.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between rounded-md px-2 py-1.5 text-[12px] text-ink", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: e.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: e.type })
          ] }) }, e.id)) })
        ] })
      ] })
    ] })
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
function Stat({
  label,
  value,
  tone = "default"
}) {
  const color = tone === "warning" ? "var(--warning)" : "var(--ink)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[10px] border border-border bg-surface-2 px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: label }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 font-mono text-[18px] tabular-nums leading-none", style: { color }, children: value })
  ] });
}
function FactRow({ fact, flagged = false }) {
  const subject = entities.find((e) => e.id === fact.subject);
  const pct = Math.round(fact.confidence * 100);
  const conflict = !!fact.conflictingFactId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-md border border-border bg-surface-2 px-2.5 py-2", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] text-ink", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: subject?.name ?? fact.subject }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: " · " }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: fact.predicate }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: ": " }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "italic", children: [
        "“",
        fact.object,
        "”"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1.5 flex items-center justify-between gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-1 w-12 overflow-hidden rounded-full bg-surface", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "h-full rounded-full",
            style: {
              width: `${pct}%`,
              backgroundColor: flagged ? "var(--warning)" : "var(--accent)"
            }
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[10px] tabular-nums",
            style: { color: flagged ? "var(--warning)" : "var(--ink-muted)" },
            children: [
              pct,
              "%"
            ]
          }
        )
      ] }),
      conflict && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider",
          style: { backgroundColor: "var(--warning-soft)", color: "var(--warning)" },
          children: "conflict"
        }
      )
    ] })
  ] });
}
function LegendDot({
  color,
  label,
  dashed = false
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1.5", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "span",
      {
        className: "inline-block h-0 w-5",
        style: {
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`
        }
      }
    ),
    label
  ] });
}
function SubgraphView({
  interviewee,
  entities: entities2,
  facts: facts2
}) {
  const W = 700;
  const H = Math.max(180, 60 + entities2.length * 56);
  const personX = 80;
  const personY = H / 2;
  const entX = W - 130;
  const points = entities2.map((e, i) => {
    const y = entities2.length === 1 ? H / 2 : 40 + i * (H - 80) / (entities2.length - 1);
    return { id: e.id, name: e.name, type: e.type, x: entX, y };
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto rounded-[10px] border border-border bg-surface-2 p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { viewBox: `0 0 ${W} ${H}`, width: "100%", height: H, className: "block", children: [
    points.map((p) => {
      const eFacts = facts2.filter((f) => f.subject === p.id);
      if (eFacts.length === 0) return null;
      const created = eFacts.some(
        (f) => Date.now() - new Date(f.verifiedAt).getTime() < 30 * 864e5
      );
      const stroke = created ? "var(--accent)" : "var(--ink-soft)";
      const dash = created ? void 0 : "5 4";
      const midX = (personX + p.x) / 2;
      const path = `M ${personX + 28} ${personY} C ${midX} ${personY}, ${midX} ${p.y}, ${p.x - 8} ${p.y}`;
      return /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: path, fill: "none", stroke, strokeWidth: 1.5, strokeDasharray: dash }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "text",
          {
            x: midX,
            y: (personY + p.y) / 2 - 6,
            textAnchor: "middle",
            style: {
              fontSize: 9,
              fontFamily: "var(--font-mono, monospace)",
              fill: "var(--ink-soft)"
            },
            children: [
              eFacts.length,
              " ",
              eFacts.length === 1 ? "fact" : "facts"
            ]
          }
        )
      ] }, `edge-${p.id}`);
    }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "circle",
        {
          cx: personX,
          cy: personY,
          r: 26,
          fill: "var(--accent-soft)",
          stroke: "var(--accent)",
          strokeWidth: 1.5
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: personX,
          y: personY + 4,
          textAnchor: "middle",
          style: {
            fontSize: 11,
            fontFamily: "var(--font-mono, monospace)",
            fill: "var(--accent-ink)"
          },
          children: interviewee.initials
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: personX,
          y: personY + 44,
          textAnchor: "middle",
          style: { fontSize: 10, fill: "var(--ink-muted)" },
          children: interviewee.name.split(" ")[0]
        }
      )
    ] }),
    points.map((p) => /* @__PURE__ */ jsxRuntimeExports.jsxs("g", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "rect",
        {
          x: p.x - 8,
          y: p.y - 14,
          width: 120,
          height: 28,
          rx: 6,
          fill: "var(--surface)",
          stroke: "var(--border)",
          strokeWidth: 1
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("text", { x: p.x + 4, y: p.y + 4, style: { fontSize: 11, fill: "var(--ink)" }, children: p.name.length > 18 ? p.name.slice(0, 17) + "…" : p.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "text",
        {
          x: p.x + 4,
          y: p.y - 18,
          style: {
            fontSize: 8,
            fontFamily: "var(--font-mono, monospace)",
            fill: "var(--ink-soft)",
            textTransform: "uppercase",
            letterSpacing: 0.5
          },
          children: p.type
        }
      )
    ] }, p.id))
  ] }) });
}
function RouteComponent() {
  const {
    id
  } = Route.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InterviewDetailPage, { interviewId: id });
}
export {
  RouteComponent as component
};
