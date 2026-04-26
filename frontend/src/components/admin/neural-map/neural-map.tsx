import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { useMemoryStore } from "@/lib/memory-context";
import { useTheme } from "@/lib/theme-context";
import { entities as allEntities, sources as allSources } from "@/lib/mock-data";
import { buildAdjacency, buildNeuralGraph, neighborhood } from "./build-graph";
import { GraphView, type GraphDim } from "./graph-view";
import { NeuralLegend, NeuralScrubber, NeuralSearch, NeuralSidePanel } from "./panels";

export function NeuralMap() {
  const { facts } = useMemoryStore();
  const { resolvedTheme, setTheme } = useTheme();
  const sourceById = useMemo(() => new Map(allSources.map((s) => [s.id, s])), []);
  const factById = useMemo(() => new Map(facts.map((f) => [f.id, f])), [facts]);
  const entityById = useMemo(() => new Map(allEntities.map((e) => [e.id, e])), []);

  const built = useMemo(() => buildNeuralGraph(allEntities, facts), [facts]);

  // Time scrubber bounds — clamp to the last 12 months.
  const { minTs, maxTs } = useMemo(() => {
    const ts = built.edges.map((e) => e.createdAt);
    const max = Math.max(...ts, Date.now());
    const minBound = max - 1000 * 60 * 60 * 24 * 365;
    const min = Math.max(minBound, Math.min(...ts));
    return { minTs: min, maxTs: max };
  }, [built.edges]);

  const [scrubTs, setScrubTs] = useState<number>(maxTs);
  const [search, setSearch] = useState("");
  const [focusId, setFocusId] = useState<string | null>(null);
  const [selectedFactId, setSelectedFactId] = useState<string | null>(null);
  const [dim, setDim] = useState<GraphDim>("2d");

  const visibleEdges = useMemo(
    () => built.edges.filter((e) => e.createdAt <= scrubTs),
    [built.edges, scrubTs],
  );

  const visibleNodeIds = useMemo(() => {
    const set = new Set<string>();
    for (const n of built.nodes) {
      if (n.kind === "entity") set.add(n.id);
    }
    for (const e of visibleEdges) {
      if (e.kind === "fact-link") set.add(e.target);
    }
    return set;
  }, [built.nodes, visibleEdges]);

  const visibleNodes = useMemo(
    () => built.nodes.filter((n) => visibleNodeIds.has(n.id)),
    [built.nodes, visibleNodeIds],
  );

  const focusedSet = useMemo(() => {
    if (!focusId) return null;
    const visAdj = buildAdjacency(visibleEdges);
    return neighborhood(focusId, visAdj, 2);
  }, [focusId, visibleEdges]);

  const wrapRef = useRef<HTMLDivElement | null>(null);
  const [size, setSize] = useState({ w: 800, h: 600 });
  useEffect(() => {
    if (!wrapRef.current) return;
    const el = wrapRef.current;
    const ro = new ResizeObserver(([entry]) => {
      const r = entry.contentRect;
      setSize({ w: Math.max(320, r.width), h: Math.max(320, r.height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const focusedRef = useRef<string | null>(null);
  const onNodeClick = useCallback((id: string, kind: "entity" | "fact") => {
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

  const onEdgeClick = useCallback((sourceId: string, targetId: string) => {
    const factId = targetId.startsWith("f-")
      ? targetId
      : sourceId.startsWith("f-")
        ? sourceId
        : null;
    if (factId) setSelectedFactId(factId);
  }, []);

  const onBackgroundClick = useCallback(() => {
    focusedRef.current = null;
    setFocusId(null);
    setSelectedFactId(null);
  }, []);

  const handleSearchSelect = useCallback((id: string) => {
    focusedRef.current = id;
    setFocusId(id);
    setSearch("");
  }, []);

  const selectedId = selectedFactId ?? focusId;

  const selectedFact = selectedFactId ? (factById.get(selectedFactId) ?? null) : null;
  const subject = selectedFact ? (entityById.get(selectedFact.subject) ?? null) : null;
  const source = selectedFact ? (sourceById.get(selectedFact.sourceId) ?? null) : null;
  const conflictingFact = selectedFact?.conflictingFactId
    ? (factById.get(selectedFact.conflictingFactId) ?? null)
    : null;

  const { sessions, questions } = useMemoryStore();
  const relatedSessions = useMemo(() => {
    if (!selectedFactId) return [];
    const touchingQuestionIds = new Set(
      questions.filter((q) => q.affectedFactIds.includes(selectedFactId)).map((q) => q.id),
    );
    return sessions.filter((s) => s.questionIds.some((qid) => touchingQuestionIds.has(qid)));
  }, [sessions, questions, selectedFactId]);

  return (
    <div
      ref={wrapRef}
      className="relative h-[calc(100vh-160px)] w-full overflow-hidden rounded-[14px] border border-border bg-background"
    >
      <GraphView
        dim={dim}
        width={size.w}
        height={size.h}
        nodes={visibleNodes}
        edges={visibleEdges}
        focusedSet={focusedSet}
        selectedId={selectedId}
        resolvedTheme={resolvedTheme}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onBackgroundClick={onBackgroundClick}
      />

      <NeuralSearch
        entities={allEntities}
        value={search}
        onChange={setSearch}
        onSelect={handleSearchSelect}
      />

      <div className="absolute right-4 top-4 z-20 flex items-center gap-2">
        <ThemeToggle
          resolvedTheme={resolvedTheme}
          onToggle={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
        />
        <DimToggle dim={dim} onChange={setDim} />
      </div>

      <NeuralLegend />

      <NeuralScrubber
        min={minTs}
        max={maxTs}
        value={scrubTs}
        onChange={setScrubTs}
        total={built.edges.filter((e) => e.kind === "fact-link").length}
        visible={visibleEdges.filter((e) => e.kind === "fact-link").length}
      />

      <NeuralSidePanel
        open={Boolean(selectedFact)}
        onClose={() => setSelectedFactId(null)}
        fact={selectedFact}
        subject={subject}
        source={source}
        conflictingFact={conflictingFact}
        relatedSessions={relatedSessions}
      />
    </div>
  );
}

function DimToggle({ dim, onChange }: { dim: GraphDim; onChange: (d: GraphDim) => void }) {
  return (
    <div
      role="tablist"
      aria-label="Graph dimension"
      className="flex overflow-hidden rounded-[10px] border border-border bg-surface shadow-soft"
    >
      {(["2d", "3d"] as const).map((d) => {
        const active = d === dim;
        return (
          <button
            key={d}
            role="tab"
            aria-selected={active}
            onClick={() => onChange(d)}
            className={`px-3 py-1.5 font-mono text-[11px] uppercase tracking-wider transition-colors ${
              active
                ? "bg-[color:var(--accent)] text-[color:var(--accent-ink)]"
                : "text-ink-muted hover:bg-surface-2 hover:text-ink"
            }`}
          >
            {d}
          </button>
        );
      })}
    </div>
  );
}

function ThemeToggle({
  resolvedTheme,
  onToggle,
}: {
  resolvedTheme: "light" | "dark";
  onToggle: () => void;
}) {
  const Icon = resolvedTheme === "dark" ? Sun : Moon;
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      title={`Switch to ${resolvedTheme === "dark" ? "light" : "dark"} mode`}
      className="grid h-[30px] w-[30px] place-items-center rounded-[10px] border border-border bg-surface text-ink-muted shadow-soft transition-colors hover:bg-surface-2 hover:text-ink"
    >
      <Icon size={14} />
    </button>
  );
}
