import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { c as createLucideIcon, Q as factInterviewIndex, T as adminInterviews, g as composeRefs, a as useControllableState, i as useId, V as Presence, m as Portal$1, P as Primitive, b as composeEventHandlers, e as createContextScope, u as useComposedRefs, o as hideOthers, q as ReactRemoveScroll, p as useFocusGuards, F as FocusScope, D as DismissableLayer, W as createContext2, f as cn, X as cva, Y as aiQuestions, L as Link, H as api, z as useMemoryStore } from "./router-CGwxE-ll.js";
import { S as Search } from "./search-B1JRA4o8.js";
import { R as RelativeTime } from "./relative-time-Cm9AtzlF.js";
import { U as UserRound } from "./user-round-CuWTHKuo.js";
import { M as Mic, L as Layers } from "./mic-B3XzTfAc.js";
import { B as Bot, V as VoiceTranscript, S as SwipeReplay, P as Play } from "./interview-turns-DMLKh28G.js";
import { A as ArrowRight } from "./arrow-right-CLIuDgFg.js";
import { X } from "./x-I3phi6t4.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
const __iconNode$4 = [
  ["path", { d: "M15 3h6v6", key: "1q9fwt" }],
  ["path", { d: "M10 14 21 3", key: "gplh6r" }],
  ["path", { d: "M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6", key: "a6xqqp" }]
];
const ExternalLink = createLucideIcon("external-link", __iconNode$4);
const __iconNode$3 = [
  [
    "path",
    {
      d: "M6 22a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h8a2.4 2.4 0 0 1 1.704.706l3.588 3.588A2.4 2.4 0 0 1 20 8v12a2 2 0 0 1-2 2z",
      key: "1oefj6"
    }
  ],
  ["path", { d: "M14 2v5a1 1 0 0 0 1 1h5", key: "wfsgrz" }],
  ["path", { d: "M10 9H8", key: "b1mrlr" }],
  ["path", { d: "M16 13H8", key: "t4e002" }],
  ["path", { d: "M16 17H8", key: "z1uh3a" }]
];
const FileText = createLucideIcon("file-text", __iconNode$3);
const __iconNode$2 = [
  [
    "path",
    {
      d: "m6 14 1.5-2.9A2 2 0 0 1 9.24 10H20a2 2 0 0 1 1.94 2.5l-1.54 6a2 2 0 0 1-1.95 1.5H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h3.9a2 2 0 0 1 1.69.9l.81 1.2a2 2 0 0 0 1.67.9H18a2 2 0 0 1 2 2v2",
      key: "usdka0"
    }
  ]
];
const FolderOpen = createLucideIcon("folder-open", __iconNode$2);
const __iconNode$1 = [
  [
    "path",
    {
      d: "M20 20a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.9a2 2 0 0 1-1.69-.9L9.6 3.9A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2Z",
      key: "1kt360"
    }
  ]
];
const Folder = createLucideIcon("folder", __iconNode$1);
const __iconNode = [
  ["rect", { x: "14", y: "3", width: "5", height: "18", rx: "1", key: "kaeet6" }],
  ["rect", { x: "5", y: "3", width: "5", height: "18", rx: "1", key: "1wsw3u" }]
];
const Pause = createLucideIcon("pause", __iconNode);
const FOLDER_ORDER = [
  "client",
  "employee",
  "policy",
  "product",
  "project",
  "decision"
];
const FOLDER_LABELS = {
  client: "clients",
  employee: "employees",
  policy: "policies",
  product: "products",
  project: "projects",
  decision: "decisions"
};
function EntityTree({ entities, selectedId, onSelect }) {
  const [query, setQuery] = reactExports.useState("");
  const grouped = reactExports.useMemo(() => {
    const q = query.trim().toLowerCase();
    const out = {
      client: [],
      employee: [],
      policy: [],
      product: [],
      project: [],
      decision: []
    };
    for (const e of entities) {
      if (q && !e.name.toLowerCase().includes(q)) continue;
      out[e.type].push(e);
    }
    for (const t of FOLDER_ORDER) {
      out[t].sort((a, b) => a.name.localeCompare(b.name));
    }
    return out;
  }, [entities, query]);
  const isSearching = query.trim().length > 0;
  const allEmpty = FOLDER_ORDER.every((t) => grouped[t].length === 0);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative mb-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        Search,
        {
          size: 12,
          className: "pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        "input",
        {
          type: "search",
          value: query,
          onChange: (e) => setQuery(e.target.value),
          placeholder: "Search entities…",
          className: "w-full rounded-[8px] border border-border bg-background py-1.5 pl-7 pr-2 text-[12px] text-ink outline-none placeholder:text-ink-soft focus:border-[color:var(--accent)]"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("nav", { className: "space-y-1", children: [
      FOLDER_ORDER.map((type) => {
        const list = grouped[type];
        if (list.length === 0) return null;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          FolderGroup,
          {
            label: FOLDER_LABELS[type],
            count: list.length,
            defaultOpen: isSearching || list.some((e) => e.id === selectedId),
            children: /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "ml-4 mt-0.5 space-y-px border-l border-border pl-2", children: list.map((e) => {
              const active = e.id === selectedId;
              return /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
                "button",
                {
                  type: "button",
                  onClick: () => onSelect(e.id),
                  className: `flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left font-mono text-[11px] transition-colors ${active ? "bg-[color:var(--accent-soft)] text-ink" : "text-ink-muted hover:bg-surface-2 hover:text-ink"}`,
                  children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 11, className: "shrink-0 opacity-70" }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: e.name })
                  ]
                }
              ) }, e.id);
            }) })
          },
          type
        );
      }),
      allEmpty && /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "px-2 py-4 text-center text-[11px] italic text-ink-soft", children: [
        'No entities match "',
        query,
        '".'
      ] })
    ] })
  ] });
}
function FolderGroup({
  label,
  count,
  defaultOpen,
  children
}) {
  const [open, setOpen] = reactExports.useState(defaultOpen);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => setOpen((v) => !v),
        className: "flex w-full items-center justify-between rounded-md px-1.5 py-1 text-left text-ink-muted hover:bg-surface-2 hover:text-ink",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "flex items-center gap-1.5", children: [
            open ? /* @__PURE__ */ jsxRuntimeExports.jsx(FolderOpen, { size: 12, className: "text-ink-soft" }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Folder, { size: 12, className: "text-ink-soft" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "font-mono text-[11px]", children: [
              label,
              "/"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-ink-soft", children: count })
        ]
      }
    ),
    open && children
  ] });
}
const baseClass = "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide transition-colors";
function shortName(full) {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}
function SourceOfFactChip({ fact, onActivate, active }) {
  const interviewIds = factInterviewIndex[fact.id] ?? [];
  const interview = interviewIds.length ? adminInterviews.find((i) => i.id === interviewIds[0]) : void 0;
  if (fact.factSource === "human") {
    const target2 = interview ? { kind: "interview", id: interview.id } : null;
    const isActive2 = active && target2 && active.kind === target2.kind && active.id === target2.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => target2 && onActivate(target2),
        disabled: !target2,
        className: `${baseClass} ${isActive2 ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--accent-soft)]"} disabled:cursor-default disabled:opacity-100`,
        style: {
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)"
        },
        title: interview ? `Taught by ${interview.interviewee.name} · ${interview.id}` : `Taught by ${fact.taughtBy ?? "human"}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(UserRound, { size: 10 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: interview ? shortName(interview.interviewee.name) : fact.taughtBy ?? "human" }),
          interview && /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "·" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lowercase", children: interview.id })
          ] })
        ]
      }
    );
  }
  if (interview) {
    const Icon = interview.mode === "voice" ? Mic : Layers;
    const target2 = { kind: "interview", id: interview.id };
    const isActive2 = active && active.kind === "interview" && active.id === interview.id;
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        type: "button",
        onClick: () => onActivate(target2),
        className: `${baseClass} ${isActive2 ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--accent-soft)]"}`,
        style: {
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)"
        },
        title: `Via ${interview.mode} interview with ${interview.interviewee.name}`,
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 10 }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: shortName(interview.interviewee.name) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "·" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lowercase", children: interview.id })
        ]
      }
    );
  }
  const target = { kind: "source", id: fact.sourceId };
  const isActive = active && active.kind === "source" && active.id === fact.sourceId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "button",
    {
      type: "button",
      onClick: () => onActivate(target),
      className: `${baseClass} ${isActive ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--surface)]"}`,
      style: {
        backgroundColor: "var(--surface-2)",
        color: "var(--ink-muted)"
      },
      title: `AI extraction from ${fact.sourceId}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Bot, { size: 10 }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "AI" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "opacity-60", children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "lowercase", children: fact.sourceId })
      ]
    }
  );
}
function EntityDetail({
  entity,
  facts,
  allEntities,
  focus,
  onFocusChange,
  onSelectEntity
}) {
  const entityFacts = reactExports.useMemo(
    () => facts.filter((f) => entity.factIds.includes(f.id)),
    [facts, entity.factIds]
  );
  const linkMap = reactExports.useMemo(() => {
    const m = /* @__PURE__ */ new Map();
    for (const e of allEntities) m.set(e.id, e);
    return m;
  }, [allEntities]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("article", { className: "rounded-[14px] border border-border bg-surface p-6 shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "border-b border-border pb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: entity.type }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "updated" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RelativeTime, { iso: entity.updatedAt })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1.5 text-[24px] font-normal text-ink", children: entity.name }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[13px] text-ink-muted", children: entity.summary })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Notes" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[14px] leading-relaxed text-ink", children: /* @__PURE__ */ jsxRuntimeExports.jsx(WikiBody, { body: entity.body, linkMap, onSelect: onSelectEntity }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-3 flex items-baseline justify-between", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
          "Facts (",
          entityFacts.length,
          ")"
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] text-ink-soft", children: "click a fact → trace its source" })
      ] }),
      entityFacts.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border px-4 py-6 text-center text-[12px] italic text-ink-soft", children: "No facts recorded yet for this entity." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "space-y-2", children: entityFacts.map((f) => /* @__PURE__ */ jsxRuntimeExports.jsx(FactRow, { fact: f, focus, onFocusChange }, f.id)) })
    ] })
  ] });
}
function FactRow({
  fact,
  focus,
  onFocusChange
}) {
  const pct = Math.round(fact.confidence * 100);
  const confColor = fact.confidence >= 0.85 ? "var(--accent)" : fact.confidence >= 0.6 ? "var(--warning)" : "var(--danger, #c54b4b)";
  const conflict = !!fact.conflictingFactId;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "group rounded-[10px] border border-border bg-background px-3.5 py-2.5 transition-colors hover:border-[color:var(--accent)]/40", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between gap-3", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 text-[13px]", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-muted", children: fact.predicate }),
        " ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium text-ink", children: fact.object })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        ArrowRight,
        {
          size: 12,
          className: "shrink-0 text-ink-soft opacity-0 transition-opacity group-hover:opacity-100"
        }
      )
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 flex flex-wrap items-center gap-2", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] tabular-nums",
          style: { backgroundColor: "var(--surface-2)", color: confColor },
          children: [
            pct,
            "%"
          ]
        }
      ),
      conflict && /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
          style: { backgroundColor: "var(--warning-soft)", color: "var(--warning)" },
          children: "conflict"
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsx(SourceOfFactChip, { fact, onActivate: onFocusChange, active: focus })
    ] })
  ] });
}
function WikiBody({
  body,
  linkMap,
  onSelect
}) {
  const parts = body.split(/(\[\[[^\]]+\]\])/g);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: parts.map((part, i) => {
    const m = /^\[\[([^\]]+)\]\]$/.exec(part);
    if (!m) return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Fragment, { children: part }, i);
    const id = m[1];
    const target = linkMap.get(id);
    if (!target) {
      return /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "span",
        {
          className: "font-mono text-[12px] text-ink-soft",
          title: `Unknown entity: ${id}`,
          children: [
            "[[",
            id,
            "]]"
          ]
        },
        i
      );
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => onSelect(id),
        className: "rounded-sm font-medium underline decoration-dotted underline-offset-2 transition-colors hover:bg-[color:var(--accent-soft)]",
        style: { color: "var(--accent-ink)" },
        children: target.name
      },
      i
    );
  }) });
}
function ProvenancePanel({
  entity,
  entityFacts,
  sources,
  allEntities,
  focus,
  onSelectEntity,
  onOpenInterview
}) {
  const backlinks = reactExports.useMemo(
    () => entity.backlinks.map((id) => allEntities.find((e) => e.id === id)).filter((e) => Boolean(e)),
    [entity, allEntities]
  );
  const { linkedSources, linkedInterviews } = reactExports.useMemo(() => {
    const srcIds = /* @__PURE__ */ new Set();
    const ivIds = /* @__PURE__ */ new Set();
    for (const f of entityFacts) {
      srcIds.add(f.sourceId);
      for (const id of factInterviewIndex[f.id] ?? []) ivIds.add(id);
    }
    return {
      linkedSources: Array.from(srcIds).map((id) => sources.find((s) => s.id === id)).filter((s) => Boolean(s)),
      linkedInterviews: Array.from(ivIds).map((id) => adminInterviews.find((i) => i.id === id)).filter((i) => Boolean(i))
    };
  }, [entityFacts, sources]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("aside", { className: "space-y-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[14px] border border-border bg-surface p-4 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
        "Backlinks (",
        backlinks.length,
        ")"
      ] }),
      backlinks.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] italic text-ink-soft", children: "Nothing links here yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1", children: backlinks.map((b) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
        "button",
        {
          type: "button",
          onClick: () => onSelectEntity(b.id),
          className: "flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-ink hover:bg-surface-2",
          children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: b.name }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: b.type })
          ]
        }
      ) }, b.id)) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "rounded-[14px] border border-border bg-surface p-4 shadow-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Provenance" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1.5 text-[11px] text-ink-soft", children: "Every fact above traces to one of these." }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: [
          "Source records (",
          linkedSources.length,
          ")"
        ] }),
        linkedSources.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] italic text-ink-soft", children: "None." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1.5 space-y-1.5", children: linkedSources.map((s) => {
          const active = focus?.kind === "source" && focus.id === s.id;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "rounded-[10px] border bg-background p-2.5 transition-colors",
              style: {
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--accent-soft)" : void 0
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(FileText, { size: 10 }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: s.kind.replace("_", " ") }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-auto truncate normal-case lowercase", children: s.id })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1 text-[12px] text-ink", children: s.label }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-muted", children: [
                  "“",
                  s.excerpt,
                  "”"
                ] })
              ]
            },
            s.id
          );
        }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: [
          "Interviews (",
          linkedInterviews.length,
          ")"
        ] }),
        linkedInterviews.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[11px] italic text-ink-soft", children: "None." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1.5 space-y-1.5", children: linkedInterviews.map((iv) => {
          const active = focus?.kind === "interview" && focus.id === iv.id;
          const Icon = iv.mode === "voice" ? Mic : Layers;
          return /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "li",
            {
              className: "rounded-[10px] border p-2.5 transition-colors",
              style: {
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--accent-soft)" : "var(--background)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "div",
                    {
                      className: "grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]",
                      style: {
                        backgroundColor: "var(--surface-2)",
                        color: "var(--ink)"
                      },
                      children: iv.interviewee.initials
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-ink", children: iv.interviewee.name }),
                    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: iv.id })
                  ] }),
                  /* @__PURE__ */ jsxRuntimeExports.jsxs(
                    "span",
                    {
                      className: "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide",
                      style: {
                        backgroundColor: iv.mode === "voice" ? "var(--accent-soft)" : "var(--surface-2)",
                        color: iv.mode === "voice" ? "var(--accent-ink)" : "var(--ink-muted)"
                      },
                      children: [
                        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 9 }),
                        iv.mode === "voice" ? "voice" : "swipe"
                      ]
                    }
                  )
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mt-1.5 text-[11px] text-ink-muted", children: iv.topic }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs(
                  "button",
                  {
                    type: "button",
                    onClick: () => onOpenInterview(iv.id),
                    className: "mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink hover:text-[color:var(--accent-ink)]",
                    children: [
                      "Open transcript",
                      /* @__PURE__ */ jsxRuntimeExports.jsx(ExternalLink, { size: 9 })
                    ]
                  }
                )
              ]
            },
            iv.id
          );
        }) })
      ] })
    ] })
  ] });
}
// @__NO_SIDE_EFFECTS__
function createSlot(ownerName) {
  const SlotClone = /* @__PURE__ */ createSlotClone(ownerName);
  const Slot2 = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    const childrenArray = reactExports.Children.toArray(children);
    const slottable = childrenArray.find(isSlottable);
    if (slottable) {
      const newElement = slottable.props.children;
      const newChildren = childrenArray.map((child) => {
        if (child === slottable) {
          if (reactExports.Children.count(newElement) > 1) return reactExports.Children.only(null);
          return reactExports.isValidElement(newElement) ? newElement.props.children : null;
        } else {
          return child;
        }
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children: reactExports.isValidElement(newElement) ? reactExports.cloneElement(newElement, void 0, newChildren) : null });
    }
    return /* @__PURE__ */ jsxRuntimeExports.jsx(SlotClone, { ...slotProps, ref: forwardedRef, children });
  });
  Slot2.displayName = `${ownerName}.Slot`;
  return Slot2;
}
// @__NO_SIDE_EFFECTS__
function createSlotClone(ownerName) {
  const SlotClone = reactExports.forwardRef((props, forwardedRef) => {
    const { children, ...slotProps } = props;
    if (reactExports.isValidElement(children)) {
      const childrenRef = getElementRef(children);
      const props2 = mergeProps(slotProps, children.props);
      if (children.type !== reactExports.Fragment) {
        props2.ref = forwardedRef ? composeRefs(forwardedRef, childrenRef) : childrenRef;
      }
      return reactExports.cloneElement(children, props2);
    }
    return reactExports.Children.count(children) > 1 ? reactExports.Children.only(null) : null;
  });
  SlotClone.displayName = `${ownerName}.SlotClone`;
  return SlotClone;
}
var SLOTTABLE_IDENTIFIER = /* @__PURE__ */ Symbol("radix.slottable");
function isSlottable(child) {
  return reactExports.isValidElement(child) && typeof child.type === "function" && "__radixId" in child.type && child.type.__radixId === SLOTTABLE_IDENTIFIER;
}
function mergeProps(slotProps, childProps) {
  const overrideProps = { ...childProps };
  for (const propName in childProps) {
    const slotPropValue = slotProps[propName];
    const childPropValue = childProps[propName];
    const isHandler = /^on[A-Z]/.test(propName);
    if (isHandler) {
      if (slotPropValue && childPropValue) {
        overrideProps[propName] = (...args) => {
          const result = childPropValue(...args);
          slotPropValue(...args);
          return result;
        };
      } else if (slotPropValue) {
        overrideProps[propName] = slotPropValue;
      }
    } else if (propName === "style") {
      overrideProps[propName] = { ...slotPropValue, ...childPropValue };
    } else if (propName === "className") {
      overrideProps[propName] = [slotPropValue, childPropValue].filter(Boolean).join(" ");
    }
  }
  return { ...slotProps, ...overrideProps };
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}
var DIALOG_NAME = "Dialog";
var [createDialogContext] = createContextScope(DIALOG_NAME);
var [DialogProvider, useDialogContext] = createDialogContext(DIALOG_NAME);
var Dialog = (props) => {
  const {
    __scopeDialog,
    children,
    open: openProp,
    defaultOpen,
    onOpenChange,
    modal = true
  } = props;
  const triggerRef = reactExports.useRef(null);
  const contentRef = reactExports.useRef(null);
  const [open, setOpen] = useControllableState({
    prop: openProp,
    defaultProp: defaultOpen ?? false,
    onChange: onOpenChange,
    caller: DIALOG_NAME
  });
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    DialogProvider,
    {
      scope: __scopeDialog,
      triggerRef,
      contentRef,
      contentId: useId(),
      titleId: useId(),
      descriptionId: useId(),
      open,
      onOpenChange: setOpen,
      onOpenToggle: reactExports.useCallback(() => setOpen((prevOpen) => !prevOpen), [setOpen]),
      modal,
      children
    }
  );
};
Dialog.displayName = DIALOG_NAME;
var TRIGGER_NAME = "DialogTrigger";
var DialogTrigger = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...triggerProps } = props;
    const context = useDialogContext(TRIGGER_NAME, __scopeDialog);
    const composedTriggerRef = useComposedRefs(forwardedRef, context.triggerRef);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        "aria-haspopup": "dialog",
        "aria-expanded": context.open,
        "aria-controls": context.contentId,
        "data-state": getState(context.open),
        ...triggerProps,
        ref: composedTriggerRef,
        onClick: composeEventHandlers(props.onClick, context.onOpenToggle)
      }
    );
  }
);
DialogTrigger.displayName = TRIGGER_NAME;
var PORTAL_NAME = "DialogPortal";
var [PortalProvider, usePortalContext] = createDialogContext(PORTAL_NAME, {
  forceMount: void 0
});
var DialogPortal = (props) => {
  const { __scopeDialog, forceMount, children, container } = props;
  const context = useDialogContext(PORTAL_NAME, __scopeDialog);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeDialog, forceMount, children: reactExports.Children.map(children, (child) => /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children: child }) })) });
};
DialogPortal.displayName = PORTAL_NAME;
var OVERLAY_NAME = "DialogOverlay";
var DialogOverlay = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(OVERLAY_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, props.__scopeDialog);
    return context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(DialogOverlayImpl, { ...overlayProps, ref: forwardedRef }) }) : null;
  }
);
DialogOverlay.displayName = OVERLAY_NAME;
var Slot = /* @__PURE__ */ createSlot("DialogOverlay.RemoveScroll");
var DialogOverlayImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...overlayProps } = props;
    const context = useDialogContext(OVERLAY_NAME, __scopeDialog);
    return (
      // Make sure `Content` is scrollable even when it doesn't live inside `RemoveScroll`
      // ie. when `Overlay` and `Content` are siblings
      /* @__PURE__ */ jsxRuntimeExports.jsx(ReactRemoveScroll, { as: Slot, allowPinchZoom: true, shards: [context.contentRef], children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          "data-state": getState(context.open),
          ...overlayProps,
          ref: forwardedRef,
          style: { pointerEvents: "auto", ...overlayProps.style }
        }
      ) })
    );
  }
);
var CONTENT_NAME = "DialogContent";
var DialogContent = reactExports.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME, props.__scopeDialog);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: context.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(DialogContentNonModal, { ...contentProps, ref: forwardedRef }) });
  }
);
DialogContent.displayName = CONTENT_NAME;
var DialogContentModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, context.contentRef, contentRef);
    reactExports.useEffect(() => {
      const content = contentRef.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: true,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          event.preventDefault();
          context.triggerRef.current?.focus();
        }),
        onPointerDownOutside: composeEventHandlers(props.onPointerDownOutside, (event) => {
          const originalEvent = event.detail.originalEvent;
          const ctrlLeftClick = originalEvent.button === 0 && originalEvent.ctrlKey === true;
          const isRightClick = originalEvent.button === 2 || ctrlLeftClick;
          if (isRightClick) event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault()
        )
      }
    );
  }
);
var DialogContentNonModal = reactExports.forwardRef(
  (props, forwardedRef) => {
    const context = useDialogContext(CONTENT_NAME, props.__scopeDialog);
    const hasInteractedOutsideRef = reactExports.useRef(false);
    const hasPointerDownOutsideRef = reactExports.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      DialogContentImpl,
      {
        ...props,
        ref: forwardedRef,
        trapFocus: false,
        disableOutsidePointerEvents: false,
        onCloseAutoFocus: (event) => {
          props.onCloseAutoFocus?.(event);
          if (!event.defaultPrevented) {
            if (!hasInteractedOutsideRef.current) context.triggerRef.current?.focus();
            event.preventDefault();
          }
          hasInteractedOutsideRef.current = false;
          hasPointerDownOutsideRef.current = false;
        },
        onInteractOutside: (event) => {
          props.onInteractOutside?.(event);
          if (!event.defaultPrevented) {
            hasInteractedOutsideRef.current = true;
            if (event.detail.originalEvent.type === "pointerdown") {
              hasPointerDownOutsideRef.current = true;
            }
          }
          const target = event.target;
          const targetIsTrigger = context.triggerRef.current?.contains(target);
          if (targetIsTrigger) event.preventDefault();
          if (event.detail.originalEvent.type === "focusin" && hasPointerDownOutsideRef.current) {
            event.preventDefault();
          }
        }
      }
    );
  }
);
var DialogContentImpl = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, trapFocus, onOpenAutoFocus, onCloseAutoFocus, ...contentProps } = props;
    const context = useDialogContext(CONTENT_NAME, __scopeDialog);
    const contentRef = reactExports.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef);
    useFocusGuards();
    return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(
        FocusScope,
        {
          asChild: true,
          loop: true,
          trapped: trapFocus,
          onMountAutoFocus: onOpenAutoFocus,
          onUnmountAutoFocus: onCloseAutoFocus,
          children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            DismissableLayer,
            {
              role: "dialog",
              id: context.contentId,
              "aria-describedby": context.descriptionId,
              "aria-labelledby": context.titleId,
              "data-state": getState(context.open),
              ...contentProps,
              ref: composedRefs,
              onDismiss: () => context.onOpenChange(false)
            }
          )
        }
      ),
      /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(TitleWarning, { titleId: context.titleId }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DescriptionWarning, { contentRef, descriptionId: context.descriptionId })
      ] })
    ] });
  }
);
var TITLE_NAME = "DialogTitle";
var DialogTitle = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...titleProps } = props;
    const context = useDialogContext(TITLE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.h2, { id: context.titleId, ...titleProps, ref: forwardedRef });
  }
);
DialogTitle.displayName = TITLE_NAME;
var DESCRIPTION_NAME = "DialogDescription";
var DialogDescription = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...descriptionProps } = props;
    const context = useDialogContext(DESCRIPTION_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.p, { id: context.descriptionId, ...descriptionProps, ref: forwardedRef });
  }
);
DialogDescription.displayName = DESCRIPTION_NAME;
var CLOSE_NAME = "DialogClose";
var DialogClose = reactExports.forwardRef(
  (props, forwardedRef) => {
    const { __scopeDialog, ...closeProps } = props;
    const context = useDialogContext(CLOSE_NAME, __scopeDialog);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.button,
      {
        type: "button",
        ...closeProps,
        ref: forwardedRef,
        onClick: composeEventHandlers(props.onClick, () => context.onOpenChange(false))
      }
    );
  }
);
DialogClose.displayName = CLOSE_NAME;
function getState(open) {
  return open ? "open" : "closed";
}
var TITLE_WARNING_NAME = "DialogTitleWarning";
var [WarningProvider, useWarningContext] = createContext2(TITLE_WARNING_NAME, {
  contentName: CONTENT_NAME,
  titleName: TITLE_NAME,
  docsSlug: "dialog"
});
var TitleWarning = ({ titleId }) => {
  const titleWarningContext = useWarningContext(TITLE_WARNING_NAME);
  const MESSAGE = `\`${titleWarningContext.contentName}\` requires a \`${titleWarningContext.titleName}\` for the component to be accessible for screen reader users.

If you want to hide the \`${titleWarningContext.titleName}\`, you can wrap it with our VisuallyHidden component.

For more information, see https://radix-ui.com/primitives/docs/components/${titleWarningContext.docsSlug}`;
  reactExports.useEffect(() => {
    if (titleId) {
      const hasTitle = document.getElementById(titleId);
      if (!hasTitle) console.error(MESSAGE);
    }
  }, [MESSAGE, titleId]);
  return null;
};
var DESCRIPTION_WARNING_NAME = "DialogDescriptionWarning";
var DescriptionWarning = ({ contentRef, descriptionId }) => {
  const descriptionWarningContext = useWarningContext(DESCRIPTION_WARNING_NAME);
  const MESSAGE = `Warning: Missing \`Description\` or \`aria-describedby={undefined}\` for {${descriptionWarningContext.contentName}}.`;
  reactExports.useEffect(() => {
    const describedById = contentRef.current?.getAttribute("aria-describedby");
    if (descriptionId && describedById) {
      const hasDescription = document.getElementById(descriptionId);
      if (!hasDescription) console.warn(MESSAGE);
    }
  }, [MESSAGE, contentRef, descriptionId]);
  return null;
};
var Root = Dialog;
var Portal = DialogPortal;
var Overlay = DialogOverlay;
var Content = DialogContent;
var Title = DialogTitle;
var Description = DialogDescription;
var Close = DialogClose;
const Sheet = Root;
const SheetPortal = Portal;
const SheetOverlay = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Overlay,
  {
    className: cn(
      "fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
      className
    ),
    ...props,
    ref
  }
));
SheetOverlay.displayName = Overlay.displayName;
const sheetVariants = cva(
  "fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out",
  {
    variants: {
      side: {
        top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
        bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
        left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
        right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
      }
    },
    defaultVariants: {
      side: "right"
    }
  }
);
const SheetContent = reactExports.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
  /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
  /* @__PURE__ */ jsxRuntimeExports.jsxs(Content, { ref, className: cn(sheetVariants({ side }), className), ...props, children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(Close, { className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "h-4 w-4" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
    ] }),
    children
  ] })
] }));
SheetContent.displayName = Content.displayName;
const SheetHeader = ({ className, ...props }) => /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: cn("flex flex-col space-y-2 text-center sm:text-left", className), ...props });
SheetHeader.displayName = "SheetHeader";
const SheetTitle = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Title,
  {
    ref,
    className: cn("text-lg font-semibold text-foreground", className),
    ...props
  }
));
SheetTitle.displayName = Title.displayName;
const SheetDescription = reactExports.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsxRuntimeExports.jsx(
  Description,
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
SheetDescription.displayName = Description.displayName;
function formatMs(ms) {
  if (ms <= 0) return "0:00";
  const s = Math.floor(ms / 1e3);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}
function waveform(seed) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = h * 31 + seed.charCodeAt(i) >>> 0;
  const out = [];
  for (let i = 0; i < 60; i++) {
    h = h * 1664525 + 1013904223 >>> 0;
    out.push(0.25 + h % 1e3 / 1e3 * 0.75);
  }
  return out;
}
function InterviewTranscriptDrawer({ interviewId, open, onOpenChange }) {
  const interview = interviewId ? adminInterviews.find((i) => i.id === interviewId) : null;
  const turns = reactExports.useMemo(() => {
    if (!interview) return [];
    return interview.questionIds.map((qid) => aiQuestions.find((q) => q.id === qid)).filter((q) => Boolean(q));
  }, [interview]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open, onOpenChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "right", className: "w-full overflow-y-auto bg-surface p-0 sm:max-w-[560px]", children: interview && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex h-full flex-col", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetHeader, { className: "border-b border-border p-6 text-left", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-start gap-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          "div",
          {
            className: "grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-[14px]",
            style: {
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-ink)"
            },
            children: interview.interviewee.initials
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0 flex-1", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(SheetTitle, { className: "text-[16px] text-ink", children: interview.interviewee.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-0.5 text-[12px] text-ink-muted", children: [
            interview.interviewee.role,
            /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: interview.interviewee.level })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-soft", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono uppercase tracking-wider", children: interview.id }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(ModeChip, { mode: interview.mode }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "·" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(RelativeTime, { iso: interview.startedAt })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[12px] text-ink-muted", children: [
        "Topic: ",
        /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink", children: interview.topic })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 space-y-5 p-6", children: [
      interview.mode === "voice" ? /* @__PURE__ */ jsxRuntimeExports.jsx(AudioPlayer, { durationMs: interview.durationMs, seed: interview.id }) : /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[10px] border border-dashed border-border bg-surface-2 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Swipe replay — no audio" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: interview.mode === "voice" ? "Voice transcript" : "Swipe replay" }),
        turns.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "rounded-md border border-dashed border-border px-4 py-6 text-center text-[12px] italic text-ink-soft", children: "No transcript captured for this session." }) : interview.mode === "voice" ? /* @__PURE__ */ jsxRuntimeExports.jsx(VoiceTranscript, { interviewee: interview.interviewee, turns }) : /* @__PURE__ */ jsxRuntimeExports.jsx(SwipeReplay, { interviewee: interview.interviewee, turns })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "border-t border-border p-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Link,
      {
        to: "/admin/interviews/$id",
        params: { id: interview.id },
        className: "inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-opacity hover:opacity-90",
        style: {
          backgroundColor: "var(--accent)",
          color: "var(--accent-ink)"
        },
        children: [
          "View full interview",
          /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { size: 12 })
        ]
      }
    ) })
  ] }) }) });
}
function AudioPlayer({ durationMs, seed }) {
  const [playing, setPlaying] = reactExports.useState(false);
  const [elapsed, setElapsed] = reactExports.useState(0);
  const tickRef = reactExports.useRef(null);
  const bars = reactExports.useMemo(() => waveform(seed), [seed]);
  const total = Math.max(1e3, durationMs);
  reactExports.useEffect(() => {
    if (!playing) return;
    const start = Date.now() - elapsed;
    tickRef.current = window.setInterval(() => {
      const next = Date.now() - start;
      if (next >= total) {
        setElapsed(total);
        setPlaying(false);
        if (tickRef.current) window.clearInterval(tickRef.current);
        return;
      }
      setElapsed(next);
    }, 100);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
  }, [playing]);
  const pct = Math.min(1, elapsed / total);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[12px] border border-border bg-background px-3 py-2.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-3", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        type: "button",
        onClick: () => setPlaying((v) => !v),
        className: "grid h-8 w-8 place-items-center rounded-full transition-opacity hover:opacity-90",
        style: {
          backgroundColor: "var(--accent)",
          color: "var(--accent-ink)"
        },
        "aria-label": playing ? "Pause" : "Play",
        children: playing ? /* @__PURE__ */ jsxRuntimeExports.jsx(Pause, { size: 13 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Play, { size: 13 })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-1 items-end gap-[2px]", "aria-hidden": true, children: bars.map((h, i) => {
      const filled = i / bars.length <= pct;
      return /* @__PURE__ */ jsxRuntimeExports.jsx(
        "span",
        {
          className: "block w-[3px] rounded-full",
          style: {
            height: `${Math.round(h * 22)}px`,
            backgroundColor: filled ? "var(--accent)" : "var(--ink-soft)",
            opacity: filled ? 1 : 0.4
          }
        },
        i
      );
    }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "w-[80px] text-right font-mono text-[10px] tabular-nums text-ink-soft", children: [
      formatMs(elapsed),
      " / ",
      formatMs(total)
    ] })
  ] }) });
}
function ModeChip({ mode }) {
  const Icon = mode === "voice" ? Mic : Layers;
  const isVoice = mode === "voice";
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "span",
    {
      className: "inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide",
      style: {
        backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
        color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)"
      },
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(Icon, { size: 10 }),
        isVoice ? "voice" : "swipe"
      ]
    }
  );
}
function MemoryBrowserPage() {
  const entities = reactExports.useMemo(() => api.listEntities(), []);
  const sources = reactExports.useMemo(() => api.listSources(), []);
  const { facts } = useMemoryStore();
  const [entityId, setEntityId] = reactExports.useState(entities[0]?.id ?? "acme-corp");
  const [focus, setFocus] = reactExports.useState(null);
  const [drawerInterviewId, setDrawerInterviewId] = reactExports.useState(null);
  const entity = reactExports.useMemo(
    () => entities.find((e) => e.id === entityId) ?? entities[0],
    [entities, entityId]
  );
  const entityFacts = reactExports.useMemo(
    () => facts.filter((f) => entity?.factIds.includes(f.id)),
    [facts, entity]
  );
  const handleSelectEntity = (id) => {
    setEntityId(id);
    setFocus(null);
  };
  const handleFocusChange = (target) => {
    setFocus(target);
    if (target.kind === "interview") {
      setDrawerInterviewId(target.id);
    }
  };
  const handleOpenInterview = (id) => {
    setDrawerInterviewId(id);
    setFocus({ kind: "interview", id });
  };
  if (!entity) {
    return /* @__PURE__ */ jsxRuntimeExports.jsx("main", { className: "mx-auto max-w-[1200px] px-6 py-12 text-center text-ink-muted", children: "No entities loaded." });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-6 py-8", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-6", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Admin · Memory" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[26px] font-normal text-ink", children: "Memory browser" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] text-ink-muted", children: "Every fact traces back to a source — a record or a person." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "self-start lg:sticky lg:top-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "rounded-[14px] border border-border bg-surface p-3 shadow-soft", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EntityTree, { entities, selectedId: entity.id, onSelect: handleSelectEntity }) }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        EntityDetail,
        {
          entity,
          facts: entityFacts,
          allEntities: entities,
          focus,
          onFocusChange: handleFocusChange,
          onSelectEntity: handleSelectEntity
        }
      ) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "self-start lg:sticky lg:top-4", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        ProvenancePanel,
        {
          entity,
          entityFacts,
          sources,
          allEntities: entities,
          focus,
          onSelectEntity: handleSelectEntity,
          onOpenInterview: handleOpenInterview
        }
      ) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      InterviewTranscriptDrawer,
      {
        interviewId: drawerInterviewId,
        open: Boolean(drawerInterviewId),
        onOpenChange: (o) => {
          if (!o) setDrawerInterviewId(null);
        }
      }
    )
  ] });
}
const SplitComponent = MemoryBrowserPage;
export {
  SplitComponent as component
};
