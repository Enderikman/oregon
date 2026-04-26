import { U as jsxRuntimeExports, r as reactExports } from "./worker-entry-CmnI0TLV.js";
import { c as createLucideIcon, J as adminMetrics, L as Link, f as cn, H as api } from "./router-CGwxE-ll.js";
import { A as ArrowUp } from "./arrow-up-DqCcap8c.js";
import { C as CircleQuestionMark } from "./circle-question-mark-C_9nO6j-.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$4 = [
  [
    "path",
    {
      d: "M22 12h-2.48a2 2 0 0 0-1.93 1.46l-2.35 8.36a.25.25 0 0 1-.48 0L9.24 2.18a.25.25 0 0 0-.48 0l-2.35 8.36A2 2 0 0 1 4.49 12H2",
      key: "169zse"
    }
  ]
];
const Activity = createLucideIcon("activity", __iconNode$4);
const __iconNode$3 = [
  ["path", { d: "M16 20V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16", key: "jecpp" }],
  ["rect", { width: "20", height: "14", x: "2", y: "6", rx: "2", key: "i6l2r4" }]
];
const Briefcase = createLucideIcon("briefcase", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "m16 6-8.414 8.586a2 2 0 0 0 2.829 2.829l8.414-8.586a4 4 0 1 0-5.657-5.657l-8.379 8.551a6 6 0 1 0 8.485 8.485l8.379-8.551",
      key: "1miecu"
    }
  ]
];
const Paperclip = createLucideIcon("paperclip", __iconNode$2);
const __iconNode$1 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "M12 5v14", key: "s699le" }]
];
const Plus = createLucideIcon("plus", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z",
      key: "oel41y"
    }
  ],
  ["path", { d: "m9 12 2 2 4-4", key: "dzmm74" }]
];
const ShieldCheck = createLucideIcon("shield-check", __iconNode);
function useTickedNumber(value, durationMs = 400) {
  const [display, setDisplay] = reactExports.useState(value);
  const prev = reactExports.useRef(value);
  reactExports.useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const step = (now) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);
  return display;
}
function Stat({ value, suffix, label, tone = "default", to = "/admin" }) {
  const v = useTickedNumber(value);
  const color = tone === "danger" ? "var(--danger)" : tone === "warning" ? "var(--warning)" : tone === "accent" ? "var(--accent)" : "var(--ink)";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    Link,
    {
      to,
      className: "group flex min-w-0 items-baseline gap-2 transition-opacity hover:opacity-100",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "span",
          {
            className: "font-mono text-[26px] tabular-nums leading-none transition-colors",
            style: { color },
            children: [
              v,
              suffix
            ]
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-ink-muted transition-colors group-hover:text-ink", children: label })
      ]
    }
  );
}
function Dot$1() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("span", { "aria-hidden": true, className: "text-ink-soft select-none", children: "·" });
}
function HealthStrip() {
  const conf = Math.round(adminMetrics.confidenceAvg * 100);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface px-6 py-5 shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Memory health" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(Stat, { value: adminMetrics.factsLearned, label: "facts learned" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dot$1, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat,
        {
          value: conf,
          suffix: "%",
          label: "avg confidence",
          tone: conf < 70 ? "warning" : "default"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dot$1, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat,
        {
          value: adminMetrics.openInterviews,
          label: "open interviews",
          tone: "accent",
          to: "/admin/interviews"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dot$1, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Stat,
        {
          value: adminMetrics.conflictsPending,
          label: "conflicts pending",
          tone: "danger",
          to: "/admin/conflicts"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(Dot$1, {}),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/admin",
          className: "group flex min-w-0 items-baseline gap-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[26px] tabular-nums leading-none text-ink", children: [
              adminMetrics.sourcesConnected,
              /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-soft", children: [
                "/",
                adminMetrics.sourcesTotal
              ] })
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-[12px] text-ink-muted group-hover:text-ink", children: "sources connected" })
          ]
        }
      )
    ] })
  ] });
}
const Textarea = reactExports.forwardRef(
  ({ className, ...props }, ref) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "textarea",
      {
        className: cn(
          "flex min-h-[60px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        ),
        ref,
        ...props
      }
    );
  }
);
Textarea.displayName = "Textarea";
const SUGGESTIONS = [
  { label: "User's role", prompt: "What is this user's role?", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Briefcase, { className: "w-4 h-4" }) },
  { label: "What they own", prompt: "What does the user own?", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(ShieldCheck, { className: "w-4 h-4" }) },
  { label: "This week's activity", prompt: "How engaged has the user been this week?", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(Activity, { className: "w-4 h-4" }) },
  { label: "Open questions", prompt: "What's the user unsure about right now?", icon: /* @__PURE__ */ jsxRuntimeExports.jsx(CircleQuestionMark, { className: "w-4 h-4" }) }
];
function answerFor(prompt) {
  const p = prompt.toLowerCase();
  const user = api.getCurrentUser();
  const facts = api.listFacts();
  const userFacts = facts.filter((f) => f.subject === user.id);
  const questions = api.listQuestions();
  const open = questions.filter((q) => q.status === "open");
  if (p.includes("role") || p.includes("title") || p.includes("who")) {
    const role = userFacts.find((f) => f.predicate.toLowerCase().includes("role"));
    return `${user.name} — ${role?.object ?? "role not yet captured"}.
Confidence on this fact: ${role ? Math.round(role.confidence * 100) + "%" : "—"}.
→ Open their profile in the Memory browser for the full picture.`;
  }
  if (p.includes("own") || p.includes("responsible") || p.includes("project")) {
    const owns = userFacts.filter((f) => f.predicate.toLowerCase().includes("own"));
    if (owns.length === 0) {
      return `No ownership facts recorded for ${user.name} yet.
Consider scheduling a short interview to fill this gap.`;
    }
    const lines = owns.map((f) => `· ${f.object} (${Math.round(f.confidence * 100)}%)`).join("\n");
    return `${user.name} owns:
${lines}`;
  }
  if (p.includes("engage") || p.includes("active") || p.includes("week") || p.includes("activity")) {
    return `${user.name} resolved 4 AI questions in the last 7 days.
Average response time: 2h 14m.
Last active: today.`;
  }
  if (p.includes("unsure") || p.includes("question") || p.includes("blocker") || p.includes("stuck")) {
    if (open.length === 0) return `${user.name} has no open questions in the queue right now.`;
    const top = open.slice(0, 3).map((q) => `· ${q.question}`).join("\n");
    return `${user.name} has ${open.length} open question${open.length === 1 ? "" : "s"}:
${top}`;
  }
  if (p.includes("confidence") || p.includes("trust")) {
    const avg = userFacts.length ? Math.round(userFacts.reduce((s, f) => s + f.confidence, 0) / userFacts.length * 100) : 0;
    return `Avg confidence on facts about ${user.name}: ${avg}%.
Based on ${userFacts.length} fact${userFacts.length === 1 ? "" : "s"} across CRM, email, and interviews.`;
  }
  return `I don't have a confident answer about ${user.name} for that yet.
Try one of the suggested questions, or open their profile in the Memory browser.`;
}
function useAutoResizeTextarea({ minHeight, maxHeight }) {
  const textareaRef = reactExports.useRef(null);
  const adjustHeight = reactExports.useCallback(
    (reset) => {
      const ta = textareaRef.current;
      if (!ta) return;
      if (reset) {
        ta.style.height = `${minHeight}px`;
        return;
      }
      ta.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(ta.scrollHeight, maxHeight));
      ta.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight]
  );
  reactExports.useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);
  reactExports.useEffect(() => {
    const onResize = () => adjustHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [adjustHeight]);
  return { textareaRef, adjustHeight };
}
function MemoryChatPanel() {
  const [value, setValue] = reactExports.useState("");
  const [messages, setMessages] = reactExports.useState([]);
  const [pending, setPending] = reactExports.useState(false);
  const idRef = reactExports.useRef(0);
  const endRef = reactExports.useRef(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });
  const nextId = () => `m-${++idRef.current}`;
  reactExports.useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);
  const submit = (raw) => {
    const text = raw.trim();
    if (!text || pending) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setValue("");
    adjustHeight(true);
    setPending(true);
    const reply = answerFor(text);
    window.setTimeout(() => {
      setMessages((m) => [...m, { id: nextId(), role: "assistant", text: reply }]);
      setPending(false);
    }, 1e3);
  };
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  };
  const isEmpty = messages.length === 0;
  const canSend = value.trim().length > 0 && !pending;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col items-center w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[20px] sm:text-[22px] font-normal text-ink text-center mb-6", children: "What do you want to know about this user?" }),
    !isEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        role: "log",
        "aria-live": "polite",
        className: "w-full max-h-[360px] overflow-y-auto mb-4 space-y-3",
        children: [
          messages.map(
            (m) => m.role === "user" ? /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-end", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              "div",
              {
                className: "max-w-[78%] whitespace-pre-line rounded-[12px] px-3.5 py-2 text-[13.5px] text-ink",
                style: { backgroundColor: "var(--accent-soft)" },
                children: m.text
              }
            ) }, m.id) : /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "span",
                {
                  "aria-hidden": true,
                  className: "mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-white",
                  style: { backgroundColor: "var(--accent)" },
                  children: "Q"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-w-[78%] whitespace-pre-line rounded-[12px] border border-border bg-surface-2 px-3.5 py-2 text-[13.5px] text-ink", children: m.text })
            ] }, m.id)
          ),
          pending && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-2", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              "span",
              {
                "aria-hidden": true,
                className: "mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-white",
                style: { backgroundColor: "var(--accent)" },
                children: "Q"
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[12px] border border-border bg-surface-2 px-3.5 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "inline-flex items-center gap-1", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 0 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 150 }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Dot, { delay: 300 })
            ] }) })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { ref: endRef })
        ]
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full bg-surface-2 rounded-[14px] border border-border shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Textarea,
        {
          ref: textareaRef,
          value,
          onChange: (e) => {
            setValue(e.target.value);
            adjustHeight();
          },
          onKeyDown: handleKeyDown,
          placeholder: "Ask about role, ownership, activity…",
          className: cn(
            "w-full px-4 py-3",
            "resize-none bg-transparent border-none",
            "text-ink text-sm",
            "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
            "placeholder:text-ink-soft placeholder:text-sm",
            "min-h-[60px]"
          ),
          style: { overflow: "hidden" }
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between p-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "button",
          {
            type: "button",
            className: "group p-2 hover:bg-surface rounded-lg transition-colors flex items-center gap-1 text-ink-muted",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(Paperclip, { className: "w-4 h-4" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs hidden group-hover:inline transition-opacity", children: "Attach" })
            ]
          }
        ) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "button",
            {
              type: "button",
              className: "px-2 py-1 rounded-lg text-sm text-ink-muted transition-colors border border-dashed border-border hover:border-ink-soft hover:bg-surface flex items-center justify-between gap-1",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Plus, { className: "w-4 h-4" }),
                "Context"
              ]
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              type: "button",
              onClick: () => submit(value),
              disabled: !canSend,
              "aria-label": "Send",
              className: cn(
                "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center justify-center gap-1",
                canSend ? "border-transparent text-white" : "border-border text-ink-soft"
              ),
              style: canSend ? { backgroundColor: "var(--accent)" } : void 0,
              children: /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowUp, { className: "w-4 h-4" })
            }
          )
        ] })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-wrap items-center justify-center gap-2 mt-4", children: SUGGESTIONS.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => submit(s.prompt),
        disabled: pending,
        className: "flex items-center gap-2 px-3.5 py-2 bg-surface-2 hover:bg-surface rounded-full border border-border text-ink-muted hover:text-ink transition-colors disabled:opacity-50",
        children: [
          s.icon,
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-xs", children: s.label })
        ]
      },
      s.label
    )) })
  ] });
}
function Dot({ delay }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "block h-1.5 w-1.5 rounded-full bg-ink-soft",
      style: { animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${delay}ms` }
    }
  );
}
function AdminOverviewPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1200px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Cockpit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[24px] font-normal text-ink", children: "Memory health" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] text-ink-muted", children: "The state of the company brain at a glance. Click any number to drill in." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Headline metrics", children: /* @__PURE__ */ jsxRuntimeExports.jsx(HealthStrip, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("section", { "aria-label": "Ask the memory", className: "mt-12", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MemoryChatPanel, {}) })
  ] });
}
const SplitComponent = AdminOverviewPage;
export {
  SplitComponent as component
};
