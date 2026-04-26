import { useCallback, useMemo, useRef, useState } from "react";
import ReactFlow, {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlowProvider,
  useReactFlow,
  type Edge,
  type Node,
  type EdgeMouseHandler,
  type NodeMouseHandler,
} from "reactflow";
import "reactflow/dist/style.css";
import { useMemoryStore } from "@/lib/memory-context";
import { entities as allEntities, sources as allSources } from "@/lib/mock-data";
import {
  buildAdjacency,
  buildNeuralGraph,
  neighborhood,
  type BuiltEdge,
} from "./build-graph";
import { layoutGraph } from "./layout";
import { nodeTypes } from "./nodes";
import {
  NeuralLegend,
  NeuralScrubber,
  NeuralSearch,
  NeuralSidePanel,
} from "./panels";

function edgeStyle(e: BuiltEdge): React.CSSProperties {
  const color = e.inConflict
    ? "var(--graph-conflict)"
    : e.factSource === "human"
    ? "var(--graph-human)"
    : "var(--graph-ai)";
  return {
    stroke: color,
    strokeWidth: e.kind === "ref" ? 1.4 : 1,
    strokeDasharray: e.kind === "ref" ? "4 3" : undefined,
    opacity: 0.7,
  };
}

function NeuralMapInner() {
  const { facts } = useMemoryStore();
  const sourceById = useMemo(
    () => new Map(allSources.map((s) => [s.id, s])),
    [],
  );
  const factById = useMemo(() => new Map(facts.map((f) => [f.id, f])), [facts]);
  const entityById = useMemo(
    () => new Map(allEntities.map((e) => [e.id, e])),
    [],
  );

  // Build the full graph
  const built = useMemo(
    () => buildNeuralGraph(allEntities, facts),
    [facts],
  );
  const positioned = useMemo(
    () => layoutGraph(built.nodes, built.edges),
    [built],
  );
  const adj = useMemo(() => buildAdjacency(built.edges), [built.edges]);

  // Time scrubber bounds — clamp to the last 12 months so layout doesn't get a 240-day-old fact dwarfing the recent ones
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

  const rf = useReactFlow();
  const focusedRef = useRef<string | null>(null);

  // Compute visible edges by time
  const visibleEdges = useMemo(
    () => built.edges.filter((e) => e.createdAt <= scrubTs),
    [built.edges, scrubTs],
  );

  // Visible node ids: entities always shown; facts only when their fact-link edge is visible
  const visibleNodeIds = useMemo(() => {
    const set = new Set<string>();
    for (const n of built.nodes) {
      if (n.kind === "entity") set.add(n.id);
    }
    for (const e of visibleEdges) {
      if (e.kind === "fact-link") {
        set.add(e.target); // fact id
      }
    }
    return set;
  }, [built.nodes, visibleEdges]);

  // Focus neighborhood (2 hops) using only currently-visible edges
  const focusedSet = useMemo(() => {
    if (!focusId) return null;
    const visAdj = buildAdjacency(visibleEdges);
    return neighborhood(focusId, visAdj, 2);
  }, [focusId, visibleEdges]);

  const flowNodes: Node[] = useMemo(() => {
    return positioned
      .filter((p) => visibleNodeIds.has(p.id))
      .map((p) => {
        const faded = focusedSet ? !focusedSet.has(p.id) : false;
        const selected =
          (focusId === p.id && p.data.kind === "entity") ||
          (selectedFactId === p.id && p.data.kind === "fact");
        return {
          id: p.id,
          type: p.data.kind, // "entity" or "fact"
          position: { x: p.x, y: p.y },
          data: { ...p.data, faded, selected },
          draggable: false,
          selectable: true,
        };
      });
  }, [positioned, visibleNodeIds, focusedSet, focusId, selectedFactId]);

  const flowEdges: Edge[] = useMemo(() => {
    return visibleEdges.map((e) => {
      const faded = focusedSet
        ? !(focusedSet.has(e.source) && focusedSet.has(e.target))
        : false;
      const base = edgeStyle(e);
      return {
        id: e.id,
        source: e.source,
        target: e.target,
        style: { ...base, opacity: faded ? 0.08 : base.opacity },
        interactionWidth: 12,
      };
    });
  }, [visibleEdges, focusedSet]);

  const onNodeClick: NodeMouseHandler = useCallback(
    (_evt, node) => {
      if (node.type === "entity") {
        const id = node.id;
        if (focusedRef.current === id) {
          // toggle off
          focusedRef.current = null;
          setFocusId(null);
        } else {
          focusedRef.current = id;
          setFocusId(id);
          setSelectedFactId(null);
        }
      } else if (node.type === "fact") {
        setSelectedFactId(node.id);
      }
    },
    [],
  );

  const onEdgeClick: EdgeMouseHandler = useCallback((_evt, edge) => {
    // Edge target is either an entity or a fact. If a fact, open its panel.
    const targetIsFact = edge.target.startsWith("f-");
    const sourceIsFact = edge.source.startsWith("f-");
    const factId = targetIsFact ? edge.target : sourceIsFact ? edge.source : null;
    if (factId) setSelectedFactId(factId);
  }, []);

  const onPaneClick = useCallback(() => {
    focusedRef.current = null;
    setFocusId(null);
    setSelectedFactId(null);
  }, []);

  const handleSearchSelect = useCallback(
    (id: string) => {
      focusedRef.current = id;
      setFocusId(id);
      setSearch("");
      const node = positioned.find((p) => p.id === id);
      if (node) {
        rf.setCenter(node.x, node.y, { zoom: 1.1, duration: 600 });
      }
    },
    [positioned, rf],
  );

  // Side-panel data
  const selectedFact = selectedFactId ? factById.get(selectedFactId) ?? null : null;
  const subject = selectedFact ? entityById.get(selectedFact.subject) ?? null : null;
  const source = selectedFact ? sourceById.get(selectedFact.sourceId) ?? null : null;
  const conflictingFact = selectedFact?.conflictingFactId
    ? factById.get(selectedFact.conflictingFactId) ?? null
    : null;

  // Sessions are only mock-recorded by the user's own interviews; we still surface them when the question they resolved touched this fact.
  const { sessions, questions } = useMemoryStore();
  const relatedSessions = useMemo(() => {
    if (!selectedFactId) return [];
    const touchingQuestionIds = new Set(
      questions
        .filter((q) => q.affectedFactIds.includes(selectedFactId))
        .map((q) => q.id),
    );
    return sessions.filter((s) =>
      s.questionIds.some((qid) => touchingQuestionIds.has(qid)),
    );
  }, [sessions, questions, selectedFactId]);

  return (
    <div className="relative h-[calc(100vh-160px)] w-full overflow-hidden rounded-[14px] border border-border bg-background">
      <ReactFlow
        nodes={flowNodes}
        edges={flowEdges}
        nodeTypes={nodeTypes}
        onNodeClick={onNodeClick}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        fitView
        fitViewOptions={{ padding: 0.18 }}
        minZoom={0.2}
        maxZoom={2}
        proOptions={{ hideAttribution: true }}
        nodesDraggable={false}
        nodesConnectable={false}
        elementsSelectable
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={28}
          size={1}
          color="var(--border)"
        />
        <Controls
          showInteractive={false}
          className="!rounded-[10px] !border !border-border !bg-surface !shadow-soft"
        />
      </ReactFlow>

      <NeuralSearch
        entities={allEntities}
        value={search}
        onChange={setSearch}
        onSelect={handleSearchSelect}
      />

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

export function NeuralMap() {
  return (
    <ReactFlowProvider>
      <NeuralMapInner />
    </ReactFlowProvider>
  );
}
