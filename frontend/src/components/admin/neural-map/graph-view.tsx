import { lazy, Suspense, useEffect, useState } from "react";
import type { BuiltEdge, BuiltNode } from "./build-graph";

export type GraphDim = "2d" | "3d";

export interface GraphViewProps {
  dim: GraphDim;
  width: number;
  height: number;
  nodes: BuiltNode[];
  edges: BuiltEdge[];
  focusedSet: Set<string> | null;
  selectedId: string | null;
  onNodeClick: (id: string, kind: "entity" | "fact") => void;
  onEdgeClick: (sourceId: string, targetId: string) => void;
  onBackgroundClick: () => void;
}

// react-force-graph-* touches `window` at import time, so we can only load it
// in the browser. Lazy + mounted guard keeps it out of SSR.
const LazyImpl = lazy(() =>
  import("./graph-view-impl").then((m) => ({ default: m.GraphViewImpl })),
);

export function GraphView(props: GraphViewProps) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <Suspense fallback={null}>
      <LazyImpl {...props} />
    </Suspense>
  );
}
