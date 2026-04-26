import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { c as createLucideIcon, N as createSlot, f as cn, t as Check, L as Link, z as useMemoryStore, O as Route } from "./router-CGwxE-ll.js";
import { Q as QuestionTypeChip } from "./question-type-chip-Tjh9sxDs.js";
import { A as AnimatePresence } from "./index-C1DORLhD.js";
import { m as motion } from "./proxy-C33hjfT0.js";
import { X } from "./x-I3phi6t4.js";
import { A as ArrowLeft } from "./arrow-left-B0ghWIUI.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$1 = [
  ["rect", { width: "8", height: "4", x: "8", y: "2", rx: "1", ry: "1", key: "tgr4d6" }],
  [
    "path",
    {
      d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2",
      key: "116196"
    }
  ]
];
const Clipboard = createLucideIcon("clipboard", __iconNode$1);
const __iconNode = [
  [
    "path",
    {
      d: "M21.174 6.812a1 1 0 0 0-3.986-3.987L3.842 16.174a2 2 0 0 0-.5.83l-1.321 4.352a.5.5 0 0 0 .623.622l4.353-1.32a2 2 0 0 0 .83-.497z",
      key: "1a8usu"
    }
  ],
  ["path", { d: "m15 5 4 4", key: "1mk7zo" }]
];
const Pencil = createLucideIcon("pencil", __iconNode);
function isSpeechSupported() {
  if (typeof window === "undefined") return false;
  const w = window;
  return Boolean(w.SpeechRecognition || w.webkitSpeechRecognition);
}
function startDictation(onInterim, onFinal) {
  if (typeof window === "undefined") return () => {
  };
  const w = window;
  const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
  if (!Ctor) return () => {
  };
  const rec = new Ctor();
  rec.continuous = true;
  rec.interimResults = true;
  rec.lang = "en-US";
  rec.onresult = (event) => {
    const e = event;
    let interim = "";
    let final = "";
    for (let i = e.resultIndex; i < e.results.length; i++) {
      const r = e.results[i];
      if (r.isFinal) final += r[0].transcript;
      else interim += r[0].transcript;
    }
    if (interim) onInterim(interim);
    if (final) onFinal(final);
  };
  try {
    rec.start();
  } catch {
  }
  return () => {
    try {
      rec.stop();
    } catch {
    }
  };
}
function createContextScope(scopeName, createContextScopeDeps = []) {
  let defaultContexts = [];
  function createContext3(rootComponentName, defaultContext) {
    const BaseContext = reactExports.createContext(defaultContext);
    BaseContext.displayName = rootComponentName + "Context";
    const index = defaultContexts.length;
    defaultContexts = [...defaultContexts, defaultContext];
    const Provider = (props) => {
      const { scope, children, ...context } = props;
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const value = reactExports.useMemo(() => context, Object.values(context));
      return /* @__PURE__ */ jsxRuntimeExports.jsx(Context.Provider, { value, children });
    };
    Provider.displayName = rootComponentName + "Provider";
    function useContext2(consumerName, scope) {
      const Context = scope?.[scopeName]?.[index] || BaseContext;
      const context = reactExports.useContext(Context);
      if (context) return context;
      if (defaultContext !== void 0) return defaultContext;
      throw new Error(`\`${consumerName}\` must be used within \`${rootComponentName}\``);
    }
    return [Provider, useContext2];
  }
  const createScope = () => {
    const scopeContexts = defaultContexts.map((defaultContext) => {
      return reactExports.createContext(defaultContext);
    });
    return function useScope(scope) {
      const contexts = scope?.[scopeName] || scopeContexts;
      return reactExports.useMemo(
        () => ({ [`__scope${scopeName}`]: { ...scope, [scopeName]: contexts } }),
        [scope, contexts]
      );
    };
  };
  createScope.scopeName = scopeName;
  return [createContext3, composeContextScopes(createScope, ...createContextScopeDeps)];
}
function composeContextScopes(...scopes) {
  const baseScope = scopes[0];
  if (scopes.length === 1) return baseScope;
  const createScope = () => {
    const scopeHooks = scopes.map((createScope2) => ({
      useScope: createScope2(),
      scopeName: createScope2.scopeName
    }));
    return function useComposedScopes(overrideScopes) {
      const nextScopes = scopeHooks.reduce((nextScopes2, { useScope, scopeName }) => {
        const scopeProps = useScope(overrideScopes);
        const currentScope = scopeProps[`__scope${scopeName}`];
        return { ...nextScopes2, ...currentScope };
      }, {});
      return reactExports.useMemo(() => ({ [`__scope${baseScope.scopeName}`]: nextScopes }), [nextScopes]);
    };
  };
  createScope.scopeName = baseScope.scopeName;
  return createScope;
}
var NODES = [
  "a",
  "button",
  "div",
  "form",
  "h2",
  "h3",
  "img",
  "input",
  "label",
  "li",
  "nav",
  "ol",
  "p",
  "select",
  "span",
  "svg",
  "ul"
];
var Primitive = NODES.reduce((primitive, node) => {
  const Slot = createSlot(`Primitive.${node}`);
  const Node = reactExports.forwardRef((props, forwardedRef) => {
    const { asChild, ...primitiveProps } = props;
    const Comp = asChild ? Slot : node;
    if (typeof window !== "undefined") {
      window[/* @__PURE__ */ Symbol.for("radix-ui")] = true;
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Comp, { ...primitiveProps, ref: forwardedRef });
  });
  Node.displayName = `Primitive.${node}`;
  return { ...primitive, [node]: Node };
}, {});
var PROGRESS_NAME = "Progress";
var DEFAULT_MAX = 100;
var [createProgressContext] = createContextScope(PROGRESS_NAME);
var [ProgressProvider, useProgressContext] = createProgressContext(PROGRESS_NAME);
var Progress$1 = reactExports.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeProgress,
      value: valueProp = null,
      max: maxProp,
      getValueLabel = defaultGetValueLabel,
      ...progressProps
    } = props;
    if ((maxProp || maxProp === 0) && !isValidMaxNumber(maxProp)) {
      console.error(getInvalidMaxError(`${maxProp}`, "Progress"));
    }
    const max = isValidMaxNumber(maxProp) ? maxProp : DEFAULT_MAX;
    if (valueProp !== null && !isValidValueNumber(valueProp, max)) {
      console.error(getInvalidValueError(`${valueProp}`, "Progress"));
    }
    const value = isValidValueNumber(valueProp, max) ? valueProp : null;
    const valueLabel = isNumber(value) ? getValueLabel(value, max) : void 0;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ProgressProvider, { scope: __scopeProgress, value, max, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "aria-valuemax": max,
        "aria-valuemin": 0,
        "aria-valuenow": isNumber(value) ? value : void 0,
        "aria-valuetext": valueLabel,
        role: "progressbar",
        "data-state": getProgressState(value, max),
        "data-value": value ?? void 0,
        "data-max": max,
        ...progressProps,
        ref: forwardedRef
      }
    ) });
  }
);
Progress$1.displayName = PROGRESS_NAME;
var INDICATOR_NAME = "ProgressIndicator";
var ProgressIndicator = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeProgress, ...indicatorProps } = props;
    const context = useProgressContext(INDICATOR_NAME, __scopeProgress);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        "data-state": getProgressState(context.value, context.max),
        "data-value": context.value ?? void 0,
        "data-max": context.max,
        ...indicatorProps,
        ref: forwardedRef
      }
    );
  }
);
ProgressIndicator.displayName = INDICATOR_NAME;
function defaultGetValueLabel(value, max) {
  return `${Math.round(value / max * 100)}%`;
}
function getProgressState(value, maxValue) {
  return value == null ? "indeterminate" : value === maxValue ? "complete" : "loading";
}
function isNumber(value) {
  return typeof value === "number";
}
function isValidMaxNumber(max) {
  return isNumber(max) && !isNaN(max) && max > 0;
}
function isValidValueNumber(value, max) {
  return isNumber(value) && !isNaN(value) && value <= max && value >= 0;
}
function getInvalidMaxError(propValue, componentName) {
  return `Invalid prop \`max\` of value \`${propValue}\` supplied to \`${componentName}\`. Only numbers greater than 0 are valid max values. Defaulting to \`${DEFAULT_MAX}\`.`;
}
function getInvalidValueError(propValue, componentName) {
  return `Invalid prop \`value\` of value \`${propValue}\` supplied to \`${componentName}\`. The \`value\` prop must be:
  - a positive number
  - less than the value passed to \`max\` (or ${DEFAULT_MAX} if no \`max\` prop is set)
  - \`null\` or \`undefined\` if the progress is indeterminate.

Defaulting to \`null\`.`;
}
var Root = Progress$1;
var Indicator = ProgressIndicator;
const Progress = reactExports.forwardRef(({ className, value, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Root,
  {
    ref,
    className: cn("relative h-2 w-full overflow-hidden rounded-full bg-primary/20", className),
    ...props,
    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Indicator,
      {
        className: "h-full w-full flex-1 bg-primary transition-all",
        style: { transform: `translateX(-${100 - (value || 0)}%)` }
      }
    )
  }
));
Progress.displayName = Root.displayName;
function QuestionProgress({ questions, currentIndex }) {
  const total = Math.max(questions.length, 1);
  const safeIndex = Math.min(currentIndex, questions.length - 1);
  const current = questions[safeIndex];
  const value = Math.min(100, Math.max(0, (safeIndex + 1) / total * 100));
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "rounded-[14px] border border-border bg-surface px-5 py-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex min-w-0 items-center gap-2", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: [
          "Question ",
          safeIndex + 1,
          " of ",
          questions.length
        ] }),
        current && /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionTypeChip, { type: current.type }),
        current && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "hidden shrink-0 text-ink-soft sm:inline", children: "·" }),
        current && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "hidden min-w-0 truncate text-[12px] leading-snug text-ink-muted sm:block", children: current.question })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "shrink-0 font-mono text-[11px] text-ink-soft", children: [
        Math.round(value),
        "%"
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      Progress,
      {
        value,
        className: "mt-3 h-1 bg-surface-2",
        style: { backgroundColor: "var(--surface-2)" }
      }
    ),
    current && /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 truncate text-[12px] leading-snug text-ink-muted sm:hidden", children: current.question })
  ] });
}
function VoiceStage({
  q,
  phase,
  pendingAnswer,
  onConfirm,
  onEdit,
  onDismiss,
  onCandidate
}) {
  const phaseLabel = phase === "speaking" ? "Speaking…" : phase === "listening" ? "Listening…" : phase === "confirming" ? "Confirm" : phase === "processing" ? "Got it." : phase === "done" ? "Done." : "Ready.";
  const isConfirming = phase === "confirming" && !!pendingAnswer;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: "flex h-full min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-border px-8 py-16 text-center shadow-soft",
      style: {
        background: "radial-gradient(ellipse at 50% 25%, var(--accent-soft) 0%, var(--surface) 70%)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(SiriOrb, { phase }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft", children: phaseLabel }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-4 min-h-[80px] max-w-[42ch]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-[26px] leading-[1.3] text-ink", children: q.question }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(AnimatePresence, { children: isConfirming && /* @__PURE__ */ jsxRuntimeExports.jsxs(
          motion.div,
          {
            initial: { opacity: 0, y: 16, scale: 0.96 },
            animate: { opacity: 1, y: 0, scale: 1 },
            exit: { opacity: 0, y: 8, scale: 0.98 },
            transition: { duration: 0.25, ease: "easeOut" },
            className: "mt-10 w-full max-w-[440px] rounded-[20px] border border-border bg-surface p-5 text-left shadow-soft",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "span",
                  {
                    className: "h-1.5 w-1.5 rounded-full",
                    style: { backgroundColor: "var(--accent)" }
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft", children: "What I understood" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-3 text-[15px] leading-snug text-ink", children: pendingAnswer }),
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-5 flex items-center gap-2", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: onConfirm,
                    className: "inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90",
                    style: {
                      background: "linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 70%, white) 100%)",
                      boxShadow: "0 8px 24px -8px color-mix(in oklab, var(--accent) 60%, transparent)"
                    },
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }),
                      " Confirm"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    onClick: onEdit,
                    className: "inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-[13px] text-ink hover:bg-surface",
                    children: [
                      /* @__PURE__ */ jsxRuntimeExports.jsx(Pencil, { size: 13 }),
                      " Edit"
                    ]
                  }
                ),
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: onDismiss,
                    "aria-label": "Dismiss",
                    className: "grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 14 })
                  }
                )
              ] })
            ]
          }
        ) })
      ]
    }
  );
}
function SiriOrb({ phase }) {
  const active = phase === "speaking" || phase === "listening";
  const intensity = phase === "speaking" ? 1 : phase === "listening" ? 0.7 : 0.3;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative grid h-[220px] w-[220px] place-items-center", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute inset-0 rounded-full",
        style: {
          background: "radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 65%)",
          filter: "blur(24px)"
        },
        animate: active ? { scale: [1, 1.12, 1], opacity: [0.35 * intensity, 0.6 * intensity, 0.35 * intensity] } : { scale: 1, opacity: 0.2 },
        transition: { duration: phase === "speaking" ? 2.2 : 3.4, repeat: Infinity, ease: "easeInOut" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute h-[180px] w-[180px] rounded-full",
        style: {
          background: "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--accent) 60%, white) 0%, var(--accent) 45%, color-mix(in oklab, var(--accent) 70%, black) 100%)",
          boxShadow: "inset 0 -20px 40px color-mix(in oklab, var(--accent) 60%, black), inset 0 20px 40px color-mix(in oklab, var(--accent) 30%, white)"
        },
        animate: active ? { scale: [1, 1.04, 0.98, 1], rotate: [0, 8, -4, 0] } : { scale: 1, rotate: 0 },
        transition: { duration: phase === "speaking" ? 3 : 5, repeat: Infinity, ease: "easeInOut" }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      motion.div,
      {
        className: "absolute h-[80px] w-[80px] rounded-full",
        style: {
          top: "30px",
          left: "55px",
          background: "radial-gradient(circle, color-mix(in oklab, white 75%, var(--accent)) 0%, transparent 70%)",
          filter: "blur(6px)"
        },
        animate: active ? { opacity: [0.7, 0.95, 0.7] } : { opacity: 0.5 },
        transition: { duration: 2.6, repeat: Infinity, ease: "easeInOut" }
      }
    )
  ] });
}
function InterviewSummary({ resolved, skipped, transcript }) {
  const [copied, setCopied] = reactExports.useState(false);
  const factsTouched = resolved.reduce((n, r) => n + r.question.affectedFactIds.length, 0);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ resolved, transcript }, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
    }
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[860px] px-6 py-12", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Interview complete" }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("h1", { className: "mt-2 text-[28px] text-ink", children: [
      resolved.length,
      " ",
      resolved.length === 1 ? "question" : "questions",
      " answered",
      skipped.length > 0 ? `, ${skipped.length} skipped` : "",
      "."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 text-[14px] text-ink-muted", children: [
      factsTouched,
      " ",
      factsTouched === 1 ? "fact" : "facts",
      " updated in memory."
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-10", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Transcript summary" }),
      resolved.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[13px] text-ink-muted", children: "No answers captured." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ol", { className: "space-y-4", children: resolved.map((r, i) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "rounded-[14px] border border-border bg-surface p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: String(i + 1).padStart(2, "0") }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: r.question.type.replace("_", " ") })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[15px] text-ink", children: r.question.question }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex items-start gap-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14, className: "mt-1 shrink-0", style: { color: "var(--accent)" } }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-[14px] text-ink", children: r.answer })
        ] })
      ] }, r.question.id)) })
    ] }),
    skipped.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-8", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Skipped — still in queue" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: skipped.map((q) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { className: "rounded-[12px] border border-border bg-background px-4 py-3 text-[13px] text-ink-muted", children: q.question }, q.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-10 flex flex-wrap items-center gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          className: "inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-medium",
          style: { backgroundColor: "var(--accent)", color: "white" },
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowLeft, { size: 14 }),
            "Back to cockpit"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          onClick: copy,
          className: "inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-2.5 text-[13px] text-ink hover:bg-surface-2",
          children: [
            copied ? /* @__PURE__ */ jsxRuntimeExports.jsx(Check, { size: 14 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Clipboard, { size: 14 }),
            copied ? "Copied" : "Copy transcript"
          ]
        }
      )
    ] })
  ] });
}
function matchAnswer(q, transcript) {
  const t = transcript.toLowerCase().trim();
  if (!q.candidates || q.candidates.length === 0) return null;
  for (const c of q.candidates) {
    if (t.includes(c.toLowerCase())) return c;
  }
  if (/(^|\b)(yes|same|correct|merge)\b/.test(t)) return q.candidates[0];
  if (/(^|\b)(no|different|separate|distinct)\b/.test(t) && q.candidates[1]) return q.candidates[1];
  return null;
}
function InterviewPage({ sessionId }) {
  const { questions, resolveQuestion, recordSession } = useMemoryStore();
  const initialQueue = reactExports.useMemo(() => {
    return questions.filter((q) => q.status === "open").sort((a, b) => {
      const ai = a.affectedFactIds.length + a.unblocksQuestionIds.length * 2;
      const bi = b.affectedFactIds.length + b.unblocksQuestionIds.length * 2;
      return bi - ai;
    });
  }, [sessionId]);
  const [currentIndex, setCurrentIndex] = reactExports.useState(0);
  const [phase, setPhase] = reactExports.useState("idle");
  const [transcript, setTranscript] = reactExports.useState([]);
  const [interim, setInterim] = reactExports.useState("");
  const [pendingAnswer, setPendingAnswer] = reactExports.useState("");
  const [resolved, setResolved] = reactExports.useState([]);
  const [skipped, setSkipped] = reactExports.useState([]);
  const startedAtRef = reactExports.useRef((/* @__PURE__ */ new Date()).toISOString());
  const recordedRef = reactExports.useRef(false);
  const cleanupRef = reactExports.useRef(null);
  const advanceTimer = reactExports.useRef(null);
  const voiceSupported = isSpeechSupported();
  const total = initialQueue.length;
  const current = initialQueue[currentIndex];
  const isDone = !current || phase === "done";
  const stopAll = () => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    if (advanceTimer.current) {
      clearTimeout(advanceTimer.current);
      advanceTimer.current = null;
    }
    if (typeof window !== "undefined") {
      try {
        window.speechSynthesis?.cancel();
      } catch {
      }
    }
  };
  const appendAgent = (text) => setTranscript((prev) => [
    ...prev,
    { id: `agent-${prev.length}-${Date.now()}`, speaker: "agent", text, ts: Date.now() }
  ]);
  const appendYou = (text) => setTranscript((prev) => [
    ...prev,
    { id: `you-${prev.length}-${Date.now()}`, speaker: "you", text, ts: Date.now() }
  ]);
  const askCurrent = (q) => {
    stopAll();
    setInterim("");
    setPhase("speaking");
    appendAgent(q.question);
    let spoke = false;
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        const u = new SpeechSynthesisUtterance(q.question);
        u.rate = 1;
        u.pitch = 1;
        u.onend = () => beginListening(q);
        window.speechSynthesis.speak(u);
        spoke = true;
      } catch {
        spoke = false;
      }
    }
    if (!spoke) {
      advanceTimer.current = setTimeout(() => beginListening(q), 1200);
    }
  };
  const beginListening = (q) => {
    if (!voiceSupported) {
      setPhase("listening");
      return;
    }
    setPhase("listening");
    cleanupRef.current = startDictation(
      (t) => setInterim(t),
      (t) => {
        const matched = matchAnswer(q, t);
        if (matched) {
          stageAnswer(matched);
        } else if (q.type === "gap" || q.type === "conflict" && t.trim().length > 4) {
          stageAnswer(t.trim());
        }
      }
    );
  };
  const stageAnswer = (choice) => {
    if (!current) return;
    stopAll();
    setInterim("");
    setPendingAnswer(choice);
    setPhase("confirming");
  };
  const handleConfirm = () => {
    if (!current || !pendingAnswer) return;
    const choice = pendingAnswer;
    setPhase("processing");
    appendYou(choice);
    resolveQuestion(current.id, choice);
    setResolved((prev) => [...prev, { question: current, answer: choice }]);
    setPendingAnswer("");
    advanceTimer.current = setTimeout(() => goNext(), 600);
  };
  const handleEdit = () => {
    setPendingAnswer("");
    if (current) {
      askCurrent(current);
    }
  };
  const handleDismiss = () => {
    setPendingAnswer("");
    if (current) beginListening(current);
  };
  const handleResolve = (choice) => {
    if (!current) return;
    stopAll();
    setInterim("");
    setPhase("processing");
    appendYou(choice);
    resolveQuestion(current.id, choice);
    setResolved((prev) => [...prev, { question: current, answer: choice }]);
    advanceTimer.current = setTimeout(() => goNext(), 700);
  };
  const goNext = () => {
    setCurrentIndex((i) => {
      const next = i + 1;
      if (next >= total) {
        setPhase("done");
        appendAgent("Interview complete. Thank you.");
        return i;
      }
      return next;
    });
  };
  reactExports.useEffect(() => {
    if (phase !== "done" || recordedRef.current) return;
    recordedRef.current = true;
    const endedAt = (/* @__PURE__ */ new Date()).toISOString();
    const startedAt = startedAtRef.current;
    const topic = resolved[0]?.question.question ?? initialQueue[0]?.question ?? "Interview session";
    recordSession({
      id: sessionId,
      mode: "voice",
      startedAt,
      endedAt,
      durationMs: new Date(endedAt).getTime() - new Date(startedAt).getTime(),
      questionsAnswered: resolved.length,
      questionsSkipped: skipped.length,
      topic,
      questionIds: initialQueue.map((q) => q.id)
    });
  }, [phase]);
  reactExports.useEffect(() => {
    if (!current || phase === "done") return;
    askCurrent(current);
    return () => {
      stopAll();
    };
  }, [currentIndex, sessionId]);
  reactExports.useEffect(() => {
    return () => stopAll();
  }, []);
  if (total === 0) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid min-h-screen place-items-center bg-background px-6 text-center", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Nothing to teach" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-2 text-[24px] text-ink", children: "Your queue is empty." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] text-ink-muted", children: "The AI has no open questions for you right now." }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Link,
        {
          to: "/",
          className: "mt-6 inline-block rounded-full px-5 py-2.5 text-[13px] font-medium",
          style: { backgroundColor: "var(--accent)", color: "white" },
          children: "Back to cockpit"
        }
      )
    ] }) });
  }
  if (isDone) {
    return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-background", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "border-b border-border bg-surface/60 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[1200px] items-center justify-between px-6 py-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: [
          "Live interview · session ",
          sessionId
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          Link,
          {
            to: "/",
            className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink",
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
              "Close"
            ]
          }
        )
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(InterviewSummary, { resolved, skipped, transcript })
    ] });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "min-h-screen bg-background", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("header", { className: "sticky top-0 z-10 border-b border-border bg-surface/80 backdrop-blur", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto flex max-w-[1200px] flex-wrap items-center justify-between gap-3 px-6 py-3.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        Link,
        {
          to: "/",
          onClick: stopAll,
          className: "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 13 }),
            "End interview"
          ]
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden h-4 w-px bg-border sm:block" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[11px] uppercase tracking-wide text-ink-soft", children: "Live interview" })
    ] }) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto max-w-[1200px] px-6 py-8", children: [
      !voiceSupported && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "div",
        {
          className: "mb-6 rounded-[14px] border border-border px-4 py-3 text-[13px] text-ink-muted",
          style: { backgroundColor: "var(--warning-soft)", color: "var(--warning)" },
          children: "Voice input isn't supported in this browser. Use the candidate buttons or skip to continue."
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mx-auto flex max-w-[760px] flex-col gap-6", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(QuestionProgress, { questions: initialQueue, currentIndex }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-[560px]", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          VoiceStage,
          {
            q: current,
            phase,
            pendingAnswer,
            onConfirm: handleConfirm,
            onEdit: handleEdit,
            onDismiss: handleDismiss,
            onCandidate: handleResolve
          }
        ) })
      ] })
    ] })
  ] });
}
function RouteComponent() {
  const {
    id
  } = Route.useParams();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(InterviewPage, { sessionId: id });
}
export {
  RouteComponent as component
};
