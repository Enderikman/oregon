import type { Entity, EntityType, Fact } from "@/lib/types";

export interface BuiltNode {
  id: string;
  kind: "entity" | "fact";
  label: string;
  entityType?: EntityType;
  factCount?: number; // for entities
  // for facts:
  subjectId?: string;
  factSource?: "ai" | "human";
  inConflict?: boolean;
  confidence?: number;
  verifiedAt?: string;
}

export interface BuiltEdge {
  id: string;
  source: string;
  target: string;
  /** "fact-link" connects entity ↔ fact; "ref" connects fact ↔ another entity it references */
  kind: "fact-link" | "ref";
  factSource: "ai" | "human";
  inConflict: boolean;
  /** unix ms — when this edge "exists" (used by time scrubber) */
  createdAt: number;
}

/**
 * Build the full neural-link graph from entities + facts.
 * - Each entity becomes a sized circle (size by fact count).
 * - Each fact becomes a small rounded rectangle anchored to its subject entity.
 * - When a fact references another entity by id in its `object` field, we add a 'ref' edge.
 */
export function buildNeuralGraph(entities: Entity[], facts: Fact[]) {
  const entityById = new Map(entities.map((e) => [e.id, e]));
  const nodes: BuiltNode[] = [];
  const edges: BuiltEdge[] = [];

  // Entity nodes
  for (const e of entities) {
    nodes.push({
      id: e.id,
      kind: "entity",
      label: e.name,
      entityType: e.type,
      factCount: e.factIds.length,
    });
  }

  // Fact nodes + edges
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
      verifiedAt: f.verifiedAt,
    });

    const createdAt = new Date(f.verifiedAt).getTime();
    edges.push({
      id: `e-${f.subject}-${f.id}`,
      source: f.subject,
      target: f.id,
      kind: "fact-link",
      factSource: f.factSource,
      inConflict: Boolean(f.conflictingFactId),
      createdAt,
    });

    // If the fact's object string contains another entity name, add a ref edge.
    const refTarget = matchEntityInText(f.object, entities, f.subject);
    if (refTarget) {
      edges.push({
        id: `e-${f.id}-${refTarget}`,
        source: f.id,
        target: refTarget,
        kind: "ref",
        factSource: f.factSource,
        inConflict: Boolean(f.conflictingFactId),
        createdAt,
      });
    }
  }

  return { nodes, edges };
}

function truncate(s: string, n: number) {
  return s.length > n ? s.slice(0, n - 1) + "…" : s;
}

function matchEntityInText(text: string, entities: Entity[], excludeId: string) {
  const lower = text.toLowerCase();
  // Prefer the longest matching name to avoid "Lara" matching before "Lara Voss"
  const sorted = [...entities].sort((a, b) => b.name.length - a.name.length);
  for (const e of sorted) {
    if (e.id === excludeId) continue;
    if (e.name.length < 4) continue;
    if (lower.includes(e.name.toLowerCase())) return e.id;
  }
  return null;
}

/** Build adjacency for k-hop neighborhood queries (undirected). */
export function buildAdjacency(edges: BuiltEdge[]): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  const add = (a: string, b: string) => {
    if (!adj.has(a)) adj.set(a, new Set());
    adj.get(a)!.add(b);
  };
  for (const e of edges) {
    add(e.source, e.target);
    add(e.target, e.source);
  }
  return adj;
}

export function neighborhood(
  start: string,
  adj: Map<string, Set<string>>,
  hops: number,
): Set<string> {
  const visited = new Set<string>([start]);
  let frontier = new Set<string>([start]);
  for (let i = 0; i < hops; i++) {
    const next = new Set<string>();
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
