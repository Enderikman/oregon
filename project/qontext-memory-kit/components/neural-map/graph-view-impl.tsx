import { useEffect, useMemo, useRef } from "react";
import ForceGraph2D, {
  type ForceGraphMethods as ForceGraphMethods2D,
} from "react-force-graph-2d";
import ForceGraph3D, {
  type ForceGraphMethods as ForceGraphMethods3D,
} from "react-force-graph-3d";
import * as THREE from "three";
import type { BuiltNode } from "./build-graph";
import { cssVar, edgeColor, entityColor, withAlpha } from "./colors";
import type { GraphViewProps } from "./graph-view";



interface FGNode {
  id: string;
  kind: "entity" | "fact";
  label: string;
  // entity:
  entityType?: BuiltNode["entityType"];
  factCount?: number;
  // fact:
  factSource?: "ai" | "human";
  inConflict?: boolean;
  // runtime, set by force-graph:
  x?: number;
  y?: number;
  z?: number;
  vx?: number;
  vy?: number;
  vz?: number;
}

interface FGLink {
  source: string | FGNode;
  target: string | FGNode;
  kind: "fact-link" | "ref";
  factSource: "ai" | "human";
  inConflict: boolean;
}

function entityRadius(factCount: number) {
  // 4px floor, +0.7 per fact, cap 14px (smaller than the old reactflow circles
  // because force layout brings them closer together).
  return Math.min(14, 4 + factCount * 0.7);
}

export function GraphViewImpl({
  dim,
  width,
  height,
  nodes,
  edges,
  focusedSet,
  selectedId,
  onNodeClick,
  onEdgeClick,
  onBackgroundClick,
}: GraphViewProps) {
  const fg2d = useRef<ForceGraphMethods2D<FGNode, FGLink> | undefined>(
    undefined,
  );
  const fg3d = useRef<ForceGraphMethods3D<FGNode, FGLink> | undefined>(
    undefined,
  );

  // Build the data shape force-graph wants. Recompute when nodes/edges change.
  const data = useMemo(() => {
    const fgNodes: FGNode[] = nodes.map((n) => ({
      id: n.id,
      kind: n.kind,
      label: n.label,
      entityType: n.entityType,
      factCount: n.factCount,
      factSource: n.factSource,
      inConflict: n.inConflict,
    }));
    const fgLinks: FGLink[] = edges.map((e) => ({
      source: e.source,
      target: e.target,
      kind: e.kind,
      factSource: e.factSource,
      inConflict: e.inConflict,
    }));
    return { nodes: fgNodes, links: fgLinks };
  }, [nodes, edges]);

  // Tune forces per dimension
  useEffect(() => {
    const fg = dim === "2d" ? fg2d.current : fg3d.current;
    if (!fg) return;
    fg.d3Force("charge")?.strength(dim === "2d" ? -240 : -160);
    const linkForce = fg.d3Force("link") as
      | { distance: (fn: (l: FGLink) => number) => unknown; strength: (n: number) => unknown }
      | undefined;
    linkForce?.distance((l: FGLink) => (l.kind === "ref" ? 90 : 50));
    linkForce?.strength(0.6);
    fg.d3ReheatSimulation?.();
  }, [dim, data]);

  // Color helpers wrapped in useMemo so we re-read CSS vars when theme changes
  // (we don't observe theme changes directly here, but this stays cheap).
  const colors = useMemo(() => {
    return {
      ink: cssVar("--ink", "#1f1b16"),
      inkMuted: cssVar("--ink-muted", "#6b655b"),
      inkSoft: cssVar("--ink-soft", "#a8a196"),
      surface: cssVar("--surface", "#f8f5ee"),
      background: cssVar("--background", "#fcfbf7"),
      conflict: cssVar("--graph-conflict", "#a85a5a"),
      human: cssVar("--graph-human", "#412bcf"),
    };
  }, [dim]);

  // ---- 2D custom canvas drawing -----------------------------------------
  const drawNode2D = (node: FGNode, ctx: CanvasRenderingContext2D, scale: number) => {
    const faded = focusedSet ? !focusedSet.has(node.id) : false;
    const selected = selectedId === node.id;
    const x = node.x ?? 0;
    const y = node.y ?? 0;

    if (node.kind === "entity") {
      const r = entityRadius(node.factCount ?? 0);
      const color = entityColor(node.entityType ?? "client");

      // glow
      const glowR = r * 2.6;
      const grad = ctx.createRadialGradient(x, y, r * 0.5, x, y, glowR);
      grad.addColorStop(0, withAlpha(color, faded ? 0.12 : 0.45));
      grad.addColorStop(1, withAlpha(color, 0));
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, glowR, 0, Math.PI * 2);
      ctx.fill();

      // body
      ctx.fillStyle = withAlpha(color, faded ? 0.35 : 1);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // selection ring
      if (selected) {
        ctx.strokeStyle = colors.ink;
        ctx.lineWidth = 1.5 / scale;
        ctx.beginPath();
        ctx.arc(x, y, r + 3 / scale, 0, Math.PI * 2);
        ctx.stroke();
      }

      // label — only when zoomed in OR selected OR large entity
      const showLabel = selected || scale > 1.3 || (node.factCount ?? 0) >= 5;
      if (showLabel) {
        const fontSize = Math.max(10, 12 / scale);
        ctx.font = `500 ${fontSize}px Inter, sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "top";
        ctx.fillStyle = withAlpha(colors.ink, faded ? 0.4 : 1);
        ctx.fillText(node.label, x, y + r + 4 / scale);
      }
    } else {
      // fact node — small rounded dot
      const r = 2.5;
      const color = node.inConflict
        ? colors.conflict
        : node.factSource === "human"
        ? colors.human
        : colors.inkSoft;
      ctx.fillStyle = withAlpha(color, faded ? 0.25 : 0.85);
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      if (selected) {
        ctx.strokeStyle = color;
        ctx.lineWidth = 1.5 / scale;
        ctx.beginPath();
        ctx.arc(x, y, r + 2 / scale, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  };

  // Pointer area for 2D (must match drawn radius for hit-testing)
  const pointerAreaPaint2D = (
    node: FGNode,
    color: string,
    ctx: CanvasRenderingContext2D,
  ) => {
    const r = node.kind === "entity"
      ? entityRadius(node.factCount ?? 0)
      : 4;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(node.x ?? 0, node.y ?? 0, r, 0, Math.PI * 2);
    ctx.fill();
  };

  // ---- 3D node rendering -------------------------------------------------
  // Use MeshBasicMaterial (unlit) so spheres render even if the scene's
  // default lighting is overridden — Lambert needs lights and was rendering
  // black/invisible in some setups.
  const nodeThreeObject = (node: FGNode) => {
    const faded = focusedSet ? !focusedSet.has(node.id) : false;
    if (node.kind === "entity") {
      const r = entityRadius(node.factCount ?? 0) * 0.5;
      const color = entityColor(node.entityType ?? "client");
      const geom = new THREE.SphereGeometry(r, 16, 16);
      const mat = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: faded ? 0.25 : 0.95,
      });
      return new THREE.Mesh(geom, mat);
    }
    // fact = small sphere
    const color = node.inConflict
      ? colors.conflict
      : node.factSource === "human"
      ? colors.human
      : colors.inkSoft;
    const geom = new THREE.SphereGeometry(1.2, 8, 8);
    const mat = new THREE.MeshBasicMaterial({
      color,
      transparent: true,
      opacity: faded ? 0.25 : 0.85,
    });
    return new THREE.Mesh(geom, mat);
  };

  const linkColor = (l: FGLink) => {
    const faded =
      focusedSet &&
      !(
        focusedSet.has(typeof l.source === "string" ? l.source : l.source.id) &&
        focusedSet.has(typeof l.target === "string" ? l.target : l.target.id)
      );
    const c = edgeColor({ inConflict: l.inConflict, factSource: l.factSource });
    return withAlpha(c, faded ? 0.06 : 0.55);
  };

  const linkWidth = (l: FGLink) => (l.kind === "ref" ? 0.6 : 0.9);

  const sharedNodeHandlers = {
    onNodeClick: (n: FGNode) => onNodeClick(n.id, n.kind),
    onLinkClick: (l: FGLink) => {
      const sId = typeof l.source === "string" ? l.source : l.source.id;
      const tId = typeof l.target === "string" ? l.target : l.target.id;
      onEdgeClick(sId, tId);
    },
    onBackgroundClick,
  };

  // Center the graph in the current viewport whenever container size changes
  // (e.g. when ResizeObserver fires after the initial 800x600 default) or when
  // the dataset changes. Without this, ForceGraph2D draws relative to its own
  // origin and the cluster ends up offset to one side on first paint.
  useEffect(() => {
    const t = window.setTimeout(() => {
      if (dim === "2d") {
        fg2d.current?.zoomToFit(400, 60);
      } else {
        fg3d.current?.zoomToFit(400, 80);
      }
    }, 350);
    return () => window.clearTimeout(t);
  }, [dim, width, height, data]);

  if (dim === "2d") {
    return (
      <ForceGraph2D
        ref={fg2d}
        width={width}
        height={height}
        graphData={data}
        backgroundColor={colors.background}
        nodeRelSize={4}
        nodeCanvasObject={drawNode2D}
        nodePointerAreaPaint={pointerAreaPaint2D}
        linkColor={linkColor}
        linkWidth={linkWidth}
        linkLabel={() => ""}
        nodeLabel={(n: FGNode) => n.label}
        cooldownTicks={120}
        d3VelocityDecay={0.3}
        warmupTicks={40}
        onEngineStop={() => fg2d.current?.zoomToFit(400, 60)}
        {...sharedNodeHandlers}
      />
    );
  }

  return (
    <ForceGraph3D
      ref={fg3d}
      width={width}
      height={height}
      graphData={data}
      backgroundColor={colors.background}
      nodeThreeObject={nodeThreeObject}
      linkColor={linkColor}
      linkWidth={linkWidth}
      linkOpacity={0.55}
      linkLabel={() => ""}
      nodeLabel={(n: FGNode) => n.label}
      showNavInfo={false}
      cooldownTicks={120}
      warmupTicks={40}
      onEngineStop={() => fg3d.current?.zoomToFit(400, 80)}
      {...sharedNodeHandlers}
    />
  );
}
