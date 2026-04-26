import { Handle, Position, type NodeProps } from "reactflow";
import type { BuiltNode } from "./build-graph";
import type { EntityType } from "@/lib/types";

const TYPE_COLOR: Record<EntityType, string> = {
  client: "var(--graph-client)",
  employee: "var(--graph-employee)",
  product: "var(--graph-product)",
  policy: "var(--graph-policy)",
  project: "var(--graph-project)",
  decision: "var(--graph-decision)",
};

interface EntityData extends BuiltNode {
  faded?: boolean;
  selected?: boolean;
}

export function EntityNode({ data }: NodeProps<EntityData>) {
  const t = (data.entityType ?? "client") as EntityType;
  const color = TYPE_COLOR[t];
  const count = data.factCount ?? 0;
  // size by fact count: 36px floor, +6 per fact, cap 84
  const size = Math.min(84, 36 + count * 6);
  const opacity = data.faded ? 0.22 : 1;

  return (
    <div
      style={{ opacity, transition: "opacity 200ms ease" }}
      className="flex flex-col items-center"
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className="rounded-full transition-shadow"
        style={{
          width: size,
          height: size,
          backgroundColor: color,
          boxShadow: data.selected
            ? `0 0 0 3px var(--background), 0 0 0 5px ${color}, 0 8px 24px rgba(0,0,0,0.18)`
            : "0 4px 12px rgba(0,0,0,0.12)",
        }}
        aria-label={`${data.label} (${t}, ${count} facts)`}
      />
      <div
        className="mt-1.5 max-w-[140px] truncate text-center text-[11px] font-medium"
        style={{ color: "var(--ink)" }}
        title={data.label}
      >
        {data.label}
      </div>
      <div
        className="font-mono text-[9px] uppercase tracking-wider"
        style={{ color: "var(--ink-soft)" }}
      >
        {t} · {count}
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

interface FactData extends BuiltNode {
  faded?: boolean;
  selected?: boolean;
}

export function FactNode({ data }: NodeProps<FactData>) {
  const opacity = data.faded ? 0.22 : 1;
  const borderColor = data.inConflict
    ? "var(--graph-conflict)"
    : data.factSource === "human"
    ? "var(--graph-human)"
    : "var(--border)";
  const bg = "var(--surface)";

  return (
    <div
      style={{ opacity, transition: "opacity 200ms ease" }}
    >
      <Handle type="target" position={Position.Top} style={{ opacity: 0 }} />
      <div
        className="rounded-md px-2 py-1 text-[10px] leading-tight"
        style={{
          backgroundColor: bg,
          border: `1px solid ${borderColor}`,
          color: "var(--ink-muted)",
          maxWidth: 160,
          boxShadow: data.selected
            ? `0 0 0 2px ${borderColor}`
            : "0 1px 2px rgba(0,0,0,0.04)",
        }}
        title={data.label}
      >
        <div className="truncate">{data.label}</div>
      </div>
      <Handle type="source" position={Position.Bottom} style={{ opacity: 0 }} />
    </div>
  );
}

export const nodeTypes = {
  entity: EntityNode,
  fact: FactNode,
};
