import type { BuiltEdge, BuiltNode } from "./build-graph";

export interface PositionedNode {
  id: string;
  x: number;
  y: number;
  data: BuiltNode;
}

/**
 * Deterministic radial layout:
 *  - Entities sit on a large outer circle, ordered by type then name for visual grouping.
 *  - Facts cluster around their subject entity on a small inner ring.
 *
 * No physics simulation — keeps SSR-safe and snapshot-stable.
 */
export function layoutGraph(nodes: BuiltNode[], _edges: BuiltEdge[]): PositionedNode[] {
  const entities = nodes.filter((n) => n.kind === "entity");
  const facts = nodes.filter((n) => n.kind === "fact");

  // Sort entities by type then name for stable, grouped layout
  const sortedEntities = [...entities].sort((a, b) => {
    const t = (a.entityType ?? "").localeCompare(b.entityType ?? "");
    if (t !== 0) return t;
    return a.label.localeCompare(b.label);
  });

  const cx = 0;
  const cy = 0;
  const R = 520; // outer radius for entities
  const positioned: PositionedNode[] = [];
  const entityPos = new Map<string, { x: number; y: number }>();

  const N = sortedEntities.length;
  sortedEntities.forEach((e, i) => {
    const angle = (i / N) * Math.PI * 2 - Math.PI / 2;
    const x = cx + R * Math.cos(angle);
    const y = cy + R * Math.sin(angle);
    entityPos.set(e.id, { x, y });
    positioned.push({ id: e.id, x, y, data: e });
  });

  // Group facts by subject
  const factsBySubject = new Map<string, BuiltNode[]>();
  for (const f of facts) {
    const sid = f.subjectId!;
    if (!factsBySubject.has(sid)) factsBySubject.set(sid, []);
    factsBySubject.get(sid)!.push(f);
  }

  // Place fact nodes on a small arc *outside* the subject entity, pointing away from center
  for (const [subjectId, group] of factsBySubject) {
    const ep = entityPos.get(subjectId);
    if (!ep) continue;
    // direction from center to entity
    const baseAngle = Math.atan2(ep.y - cy, ep.x - cx);
    const ringR = 130;
    const spread = Math.PI * 0.7; // total arc angle
    const k = group.length;
    group.forEach((f, j) => {
      const t = k === 1 ? 0 : j / (k - 1) - 0.5; // -0.5..0.5
      const a = baseAngle + t * spread;
      const x = ep.x + ringR * Math.cos(a);
      const y = ep.y + ringR * Math.sin(a);
      positioned.push({ id: f.id, x, y, data: f });
    });
  }

  return positioned;
}
