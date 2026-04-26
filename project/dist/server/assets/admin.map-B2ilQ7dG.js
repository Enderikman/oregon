import { r as reactExports, U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
import { L as Link, z as useMemoryStore, Z as sources, _ as entities } from "./router-CGwxE-ll.js";
import "node:events";
import "node:async_hooks";
import "node:stream/web";
import "node:stream";
function buildNeuralGraph(entities2, facts) {
  const entityById = new Map(entities2.map((e) => [e.id, e]));
  const nodes = [];
  const edges = [];
  for (const e of entities2) {
    nodes.push({
      id: e.id,
      kind: "entity",
      label: e.name,
      entityType: e.type,
      factCount: e.factIds.length
    });
  }
  for (const f of facts) {
    if (!entityById.has(f.subject)) continue;
    nodes.push({
      id: f.id,
      kind: "fact",
      label: `${f.predicate}: ${truncate(f.object, 32)}`,
      subjectId: f.subject,
      factSource: f.factSource,
      inConflict: Boolean(f.conflictingFactId),
      confidence: f.confidence,
      verifiedAt: f.verifiedAt
    });
    const createdAt = new Date(f.verifiedAt).getTime();
    edges.push({
      id: `e-${f.subject}-${f.id}`,
      source: f.subject,
      target: f.id,
      kind: "fact-link",
      factSource: f.factSource,
      inConflict: Boolean(f.conflictingFactId),
      createdAt
    });
    const refTarget = matchEntityInText(f.object, entities2, f.subject);
    if (refTarget) {
      edges.push({
        id: `e-${f.id}-${refTarget}`,
        source: f.id,
        target: refTarget,
        kind: "ref",
        factSource: f.factSource,
        inConflict: Boolean(f.conflictingFactId),
        createdAt
      });
    }
  }
  return { nodes, edges };
}
function truncate(s, n) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}
function matchEntityInText(text, entities2, excludeId) {
  const lower = text.toLowerCase();
  const sorted = [...entities2].sort((a, b) => b.name.length - a.name.length);
  for (const e of sorted) {
    if (e.id === excludeId) continue;
    if (e.name.length < 4) continue;
    if (lower.includes(e.name.toLowerCase())) return e.id;
  }
  return null;
}
function buildAdjacency(edges) {
  const adj = /* @__PURE__ */ new Map();
  const add = (a, b) => {
    if (!adj.has(a)) adj.set(a, /* @__PURE__ */ new Set());
    adj.get(a).add(b);
  };
  for (const e of edges) {
    add(e.source, e.target);
    add(e.target, e.source);
  }
  return adj;
}
function neighborhood(start, adj, hops) {
  const visited = /* @__PURE__ */ new Set([start]);
  let frontier = /* @__PURE__ */ new Set([start]);
  for (let i = 0; i < hops; i++) {
    const next = /* @__PURE__ */ new Set();
    for (const id of frontier) {
      const neighbors = adj.get(id);
      if (!neighbors) continue;
      for (const n of neighbors) {
        if (!visited.has(n)) {
          visited.add(n);
          next.add(n);
        }
      }
    }
    frontier = next;
  }
  return visited;
}
const LazyImpl = reactExports.lazy(
  () => import("./graph-view-impl-50xr6c09.js").then((m) => ({ default: m.GraphViewImpl }))
);
function GraphView(props) {
  const [mounted, setMounted] = reactExports.useState(false);
  reactExports.useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsx(reactExports.Suspense, { fallback: null, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LazyImpl, { ...props }) });
}
function NeuralSidePanel({
  open,
  onClose,
  fact,
  subject,
  source,
  conflictingFact,
  relatedSessions
}) {
  if (!open || !fact) return null;
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "aside",
    {
      role: "dialog",
      "aria-label": "Fact details",
      className: "absolute right-4 top-4 bottom-4 z-20 w-[360px] overflow-y-auto rounded-[14px] border border-border bg-surface p-5 shadow-soft",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "flex items-start justify-between gap-3", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "min-w-0", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: [
              "Fact · ",
              fact.factSource === "human" ? "human-taught" : "ai-extracted",
              fact.conflictingFactId ? " · in conflict" : ""
            ] }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 text-[15px] text-ink", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-muted", children: subject?.name ?? fact.subject }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-soft", children: fact.predicate }),
              " ",
              /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: fact.object })
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "button",
            {
              onClick: onClose,
              className: "rounded-md px-2 py-1 text-[12px] text-ink-muted hover:bg-surface-2 hover:text-ink",
              "aria-label": "Close panel",
              children: "✕"
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("dl", { className: "mt-4 grid grid-cols-2 gap-3 text-[12px]", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Confidence" }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("dd", { className: "mt-0.5 font-mono tabular-nums text-ink", children: [
              Math.round(fact.confidence * 100),
              "%"
            ] })
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("dt", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Verified" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("dd", { className: "mt-0.5 font-mono tabular-nums text-ink-muted", children: new Date(fact.verifiedAt).toLocaleDateString() })
          ] })
        ] }),
        source && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Source" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-2 rounded-md border border-border bg-background p-3", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-[12px] text-ink", children: source.label }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { className: "mt-1.5 text-[12px] leading-relaxed text-ink-muted", children: [
              '"',
              source.excerpt,
              '"'
            ] })
          ] })
        ] }),
        conflictingFact && /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "In conflict with" }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: "mt-2 rounded-md border p-3",
              style: {
                borderColor: "var(--graph-conflict)",
                backgroundColor: "var(--danger-soft)"
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-[12px] text-ink", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-muted", children: [
                    conflictingFact.predicate,
                    ":"
                  ] }),
                  " ",
                  /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: conflictingFact.object })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 font-mono text-[10px] text-ink-soft", children: [
                  Math.round(conflictingFact.confidence * 100),
                  "% ·",
                  " ",
                  conflictingFact.factSource === "human" ? "human" : "ai"
                ] })
              ]
            }
          )
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("section", { className: "mt-5", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Interviews that touched this" }),
          relatedSessions.length === 0 ? /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-2 text-[12px] text-ink-muted", children: "No interviews have referenced this fact yet." }) : /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-2 space-y-1.5", children: relatedSessions.map((s) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Link,
            {
              to: "/admin",
              className: "block rounded-md border border-border bg-background px-3 py-2 text-[12px] text-ink hover:bg-surface-2",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] text-ink-soft", children: s.id }),
                " · ",
                s.topic,
                " ·",
                " ",
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-ink-muted", children: s.mode })
              ]
            }
          ) }, s.id)) })
        ] })
      ]
    }
  );
}
function NeuralSearch({ entities: entities2, onSelect, value, onChange }) {
  const [open, setOpen] = reactExports.useState(false);
  const matches = reactExports.useMemo(() => {
    if (!value.trim()) return [];
    const q = value.toLowerCase();
    return entities2.filter((e) => e.name.toLowerCase().includes(q) || e.type.includes(q)).slice(0, 6);
  }, [entities2, value]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute left-4 top-4 z-20 w-[260px]", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "search",
        placeholder: "Search entities…",
        value,
        onChange: (e) => {
          onChange(e.target.value);
          setOpen(true);
        },
        onFocus: () => setOpen(true),
        onBlur: () => setTimeout(() => setOpen(false), 150),
        className: "w-full rounded-[10px] border border-border bg-surface px-3 py-2 text-[13px] text-ink shadow-soft outline-none placeholder:text-ink-soft focus:border-[color:var(--accent)]"
      }
    ),
    open && matches.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 overflow-hidden rounded-[10px] border border-border bg-surface shadow-soft", children: matches.map((e) => /* @__PURE__ */ jsxRuntimeExports.jsx("li", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "button",
      {
        onMouseDown: (ev) => {
          ev.preventDefault();
          onSelect(e.id);
          setOpen(false);
        },
        className: "flex w-full items-center justify-between gap-2 px-3 py-2 text-left text-[13px] text-ink hover:bg-surface-2",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "truncate", children: e.name }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-mono text-[10px] uppercase text-ink-soft", children: e.type })
        ]
      }
    ) }, e.id)) })
  ] });
}
function NeuralLegend({ className }) {
  const items = [
    { label: "Human-taught", color: "var(--graph-human)" },
    { label: "AI-extracted", color: "var(--graph-ai)" },
    { label: "In conflict", color: "var(--graph-conflict)" }
  ];
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      className: `absolute bottom-4 left-4 z-20 rounded-[10px] border border-border bg-surface px-3 py-2 shadow-soft ${className ?? ""}`,
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: "Edges" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("ul", { className: "mt-1 flex gap-3", children: items.map((it) => /* @__PURE__ */ jsxRuntimeExports.jsxs("li", { className: "flex items-center gap-1.5 text-[11px] text-ink-muted", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "span",
            {
              "aria-hidden": true,
              className: "inline-block h-[2px] w-5 rounded-full",
              style: { backgroundColor: it.color }
            }
          ),
          it.label
        ] }, it.label)) })
      ]
    }
  );
}
function NeuralScrubber({ min, max, value, onChange, total, visible }) {
  const date = new Date(value);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute bottom-4 right-4 z-20 w-[420px] rounded-[10px] border border-border bg-surface px-4 py-3 shadow-soft", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-baseline justify-between", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[9px] uppercase tracking-wider text-ink-soft", children: "Replay growth" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] tabular-nums text-ink", children: date.toLocaleDateString(void 0, { month: "short", day: "numeric", year: "numeric" }) })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "input",
      {
        type: "range",
        min,
        max,
        value,
        onChange: (e) => onChange(Number(e.target.value)),
        className: "mt-2 w-full accent-[color:var(--accent)]",
        "aria-label": "Replay graph growth"
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mt-1 flex justify-between font-mono text-[10px] tabular-nums text-ink-soft", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(min).toLocaleDateString() }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { className: "text-ink-muted", children: [
        visible,
        " / ",
        total,
        " facts visible"
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: new Date(max).toLocaleDateString() })
    ] })
  ] });
}
function NeuralMap() {
  const { facts } = useMemoryStore();
  const sourceById = reactExports.useMemo(() => new Map(sources.map((s) => [s.id, s])), []);
  const factById = reactExports.useMemo(() => new Map(facts.map((f) => [f.id, f])), [facts]);
  const entityById = reactExports.useMemo(() => new Map(entities.map((e) => [e.id, e])), []);
  const built = reactExports.useMemo(() => buildNeuralGraph(entities, facts), [facts]);
  const { minTs, maxTs } = reactExports.useMemo(() => {
    const ts = built.edges.map((e) => e.createdAt);
    const max = Math.max(...ts, Date.now());
    const minBound = max - 1e3 * 60 * 60 * 24 * 365;
    const min = Math.max(minBound, Math.min(...ts));
    return { minTs: min, maxTs: max };
  }, [built.edges]);
  const [scrubTs, setScrubTs] = reactExports.useState(maxTs);
  const [search, setSearch] = reactExports.useState("");
  const [focusId, setFocusId] = reactExports.useState(null);
  const [selectedFactId, setSelectedFactId] = reactExports.useState(null);
  const [dim, setDim] = reactExports.useState("2d");
  const visibleEdges = reactExports.useMemo(
    () => built.edges.filter((e) => e.createdAt <= scrubTs),
    [built.edges, scrubTs]
  );
  const visibleNodeIds = reactExports.useMemo(() => {
    const set = /* @__PURE__ */ new Set();
    for (const n of built.nodes) {
      if (n.kind === "entity") set.add(n.id);
    }
    for (const e of visibleEdges) {
      if (e.kind === "fact-link") set.add(e.target);
    }
    return set;
  }, [built.nodes, visibleEdges]);
  const visibleNodes = reactExports.useMemo(
    () => built.nodes.filter((n) => visibleNodeIds.has(n.id)),
    [built.nodes, visibleNodeIds]
  );
  const focusedSet = reactExports.useMemo(() => {
    if (!focusId) return null;
    const visAdj = buildAdjacency(visibleEdges);
    return neighborhood(focusId, visAdj, 2);
  }, [focusId, visibleEdges]);
  const wrapRef = reactExports.useRef(null);
  const [size, setSize] = reactExports.useState({ w: 800, h: 600 });
  reactExports.useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.max(320, r.width), h: Math.max(320, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  const focusedRef = reactExports.useRef(null);
  const onNodeClick = reactExports.useCallback((id, kind) => {
    if (kind === "entity") {
      if (focusedRef.current === id) {
        focusedRef.current = null;
        setFocusId(null);
      } else {
        focusedRef.current = id;
        setFocusId(id);
        setSelectedFactId(null);
      }
    } else {
      setSelectedFactId(id);
    }
  }, []);
  const onEdgeClick = reactExports.useCallback((sourceId, targetId) => {
    const factId = targetId.startsWith("f-") ? targetId : sourceId.startsWith("f-") ? sourceId : null;
    if (factId) setSelectedFactId(factId);
  }, []);
  const onBackgroundClick = reactExports.useCallback(() => {
    focusedRef.current = null;
    setFocusId(null);
    setSelectedFactId(null);
  }, []);
  const handleSearchSelect = reactExports.useCallback((id) => {
    focusedRef.current = id;
    setFocusId(id);
    setSearch("");
  }, []);
  const selectedId = selectedFactId ?? focusId;
  const selectedFact = selectedFactId ? factById.get(selectedFactId) ?? null : null;
  const subject = selectedFact ? entityById.get(selectedFact.subject) ?? null : null;
  const source = selectedFact ? sourceById.get(selectedFact.sourceId) ?? null : null;
  const conflictingFact = selectedFact?.conflictingFactId ? factById.get(selectedFact.conflictingFactId) ?? null : null;
  const { sessions, questions } = useMemoryStore();
  const relatedSessions = reactExports.useMemo(() => {
    if (!selectedFactId) return [];
    const touchingQuestionIds = new Set(
      questions.filter((q) => q.affectedFactIds.includes(selectedFactId)).map((q) => q.id)
    );
    return sessions.filter((s) => s.questionIds.some((qid) => touchingQuestionIds.has(qid)));
  }, [sessions, questions, selectedFactId]);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(
    "div",
    {
      ref: wrapRef,
      className: "relative h-[calc(100vh-160px)] w-full overflow-hidden rounded-[14px] border border-border bg-background",
      children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          GraphView,
          {
            dim,
            width: size.w,
            height: size.h,
            nodes: visibleNodes,
            edges: visibleEdges,
            focusedSet,
            selectedId,
            onNodeClick,
            onEdgeClick,
            onBackgroundClick
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeuralSearch,
          {
            entities,
            value: search,
            onChange: setSearch,
            onSelect: handleSearchSelect
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(DimToggle, { dim, onChange: setDim }),
        /* @__PURE__ */ jsxRuntimeExports.jsx(NeuralLegend, {}),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeuralScrubber,
          {
            min: minTs,
            max: maxTs,
            value: scrubTs,
            onChange: setScrubTs,
            total: built.edges.filter((e) => e.kind === "fact-link").length,
            visible: visibleEdges.filter((e) => e.kind === "fact-link").length
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          NeuralSidePanel,
          {
            open: Boolean(selectedFact),
            onClose: () => setSelectedFactId(null),
            fact: selectedFact,
            subject,
            source,
            conflictingFact,
            relatedSessions
          }
        )
      ]
    }
  );
}
function DimToggle({ dim, onChange }) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "div",
    {
      role: "tablist",
      "aria-label": "Graph dimension",
      className: "absolute right-4 top-4 z-20 flex overflow-hidden rounded-[10px] border border-border bg-surface shadow-soft",
      children: ["2d", "3d"].map((d) => {
        const active = d === dim;
        return /* @__PURE__ */ jsxRuntimeExports.jsx(
          "button",
          {
            role: "tab",
            "aria-selected": active,
            onClick: () => onChange(d),
            className: `px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${active ? "bg-[color:var(--accent)] text-[color:var(--accent-ink)]" : "text-ink-muted hover:bg-surface-2 hover:text-ink"}`,
            children: d
          },
          d
        );
      })
    }
  );
}
function NeuralMapPage() {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("main", { className: "mx-auto max-w-[1400px] px-6 py-6", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("header", { className: "mb-4", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "font-mono text-[10px] uppercase tracking-wider text-ink-soft", children: "Cockpit" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("h1", { className: "mt-1 text-[24px] font-normal text-ink", children: "Neural link map" }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "mt-1 text-[13px] text-ink-muted", children: "The whole company brain. Click an entity to focus its 2-hop neighborhood. Click an edge or fact for the source. Drag the timeline to replay how the brain grew." })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(NeuralMap, {})
  ] });
}
const SplitComponent = NeuralMapPage;
export {
  SplitComponent as component
};
