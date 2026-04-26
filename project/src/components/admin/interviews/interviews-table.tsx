import { ArrowDown, ArrowUp, Layers, Mic } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { RelativeTime } from "@/components/shared/relative-time";
import type { AdminInterview, InterviewStatus } from "@/lib/mock-data";

export type SortKey = "startedAt" | "durationMs" | "factsAdded" | "accuracy" | "status";
export type SortDir = "asc" | "desc";

interface Props {
  rows: AdminInterview[];
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (s: { key: SortKey; dir: SortDir }) => void;
  onRowClick: (id: string) => void;
  selectedId: string | null;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs === 0 ? `${m}m` : `${m}m ${rs}s`;
}

const STATUS_LABEL: Record<InterviewStatus, string> = {
  pending: "Pending",
  live: "Live",
  completed: "Completed",
  consolidated: "Consolidated",
};

function StatusCell({ status }: { status: InterviewStatus }) {
  if (status === "live") {
    return (
      <span className="inline-flex items-center gap-2 text-[12px] text-ink">
        <span className="relative inline-flex h-1.5 w-1.5">
          <span
            className="absolute inset-0 animate-ping rounded-full"
            style={{ backgroundColor: "var(--accent)", opacity: 0.6 }}
          />
          <span
            className="relative inline-flex h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: "var(--accent)" }}
          />
        </span>
        Live
      </span>
    );
  }
  const dot =
    status === "pending"
      ? "var(--ink-soft)"
      : status === "completed"
        ? "var(--accent-soft)"
        : "var(--accent)";
  const text = status === "pending" ? "text-ink-muted" : "text-ink";
  return (
    <span className={`inline-flex items-center gap-2 text-[12px] ${text}`}>
      <span
        aria-hidden
        className="inline-block h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: dot, border: status === "completed" ? "1px solid var(--accent)" : undefined }}
      />
      {STATUS_LABEL[status]}
    </span>
  );
}

function ModeChip({ mode }: { mode: AdminInterview["mode"] }) {
  const Icon = mode === "voice" ? Mic : Layers;
  const isVoice = mode === "voice";
  return (
    <span
      className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{
        backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
        color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)",
      }}
    >
      <Icon size={10} />
      {isVoice ? "Voice" : "Swipe"}
    </span>
  );
}

function AccuracyChip({ value, status }: { value: number; status: InterviewStatus }) {
  if (status === "pending") return <span className="font-mono text-[12px] text-ink-soft">—</span>;
  const pct = Math.round(value * 100);
  let bg = "var(--surface-2)";
  let fg = "var(--ink-muted)";
  if (value < 0.7) {
    bg = "var(--warning-soft)";
    fg = "var(--warning)";
  } else if (value >= 0.9) {
    bg = "var(--accent-soft)";
    fg = "var(--accent-ink)";
  }
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[11px] tabular-nums"
      style={{ backgroundColor: bg, color: fg }}
    >
      {pct}%
    </span>
  );
}

function SortHeader({
  label,
  k,
  sort,
  onSortChange,
  align = "left",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: SortDir };
  onSortChange: (s: { key: SortKey; dir: SortDir }) => void;
  align?: "left" | "right";
}) {
  const active = sort.key === k;
  return (
    <button
      type="button"
      onClick={() =>
        onSortChange({
          key: k,
          dir: active ? (sort.dir === "asc" ? "desc" : "asc") : "desc",
        })
      }
      className={`inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
        active ? "text-ink" : "text-ink-soft hover:text-ink"
      } ${align === "right" ? "ml-auto" : ""}`}
    >
      <span>{label}</span>
      {active &&
        (sort.dir === "asc" ? <ArrowUp size={10} /> : <ArrowDown size={10} />)}
    </button>
  );
}

export function InterviewsTable({ rows, sort, onSortChange, onRowClick, selectedId }: Props) {
  if (rows.length === 0) {
    return (
      <div className="rounded-[14px] border border-border bg-surface px-8 py-16 text-center">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          No matches
        </div>
        <p className="mt-2 text-[14px] text-ink-muted">
          No interviews match the current filter or search.
        </p>
      </div>
    );
  }
  return (
    <div className="overflow-hidden rounded-[14px] border border-border bg-surface">
      <Table>
        <TableHeader>
          <TableRow className="border-border hover:bg-transparent">
            <TableHead className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Interviewee
            </TableHead>
            <TableHead className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Topic
            </TableHead>
            <TableHead className="px-4 py-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              Mode
            </TableHead>
            <TableHead className="px-4 py-3">
              <SortHeader label="Status" k="status" sort={sort} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="px-4 py-3">
              <SortHeader label="Started" k="startedAt" sort={sort} onSortChange={onSortChange} />
            </TableHead>
            <TableHead className="px-4 py-3 text-right">
              <SortHeader label="Duration" k="durationMs" sort={sort} onSortChange={onSortChange} align="right" />
            </TableHead>
            <TableHead className="px-4 py-3 text-right">
              <SortHeader label="Facts added" k="factsAdded" sort={sort} onSortChange={onSortChange} align="right" />
            </TableHead>
            <TableHead className="px-4 py-3 text-right">
              <SortHeader label="Accuracy" k="accuracy" sort={sort} onSortChange={onSortChange} align="right" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isLive = row.status === "live";
            const isSelected = row.id === selectedId;
            return (
              <TableRow
                key={row.id}
                onClick={() => onRowClick(row.id)}
                className={`cursor-pointer border-border transition-colors hover:bg-surface-2 ${
                  isSelected ? "bg-surface-2" : ""
                }`}
                style={
                  isLive
                    ? { boxShadow: "inset 2px 0 0 0 var(--accent)" }
                    : undefined
                }
              >
                <TableCell className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-[11px]"
                      style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
                    >
                      {row.interviewee.initials}
                    </div>
                    <div className="min-w-0">
                      <div className="truncate text-[13px] text-ink">{row.interviewee.name}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-ink-muted">
                        <span className="truncate">{row.interviewee.role}</span>
                        <span
                          className="font-mono text-[9px] uppercase tracking-wider"
                          style={{ color: "var(--ink-soft)" }}
                        >
                          · {row.interviewee.level}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <div className="text-[13px] text-ink">{row.topic}</div>
                  <div className="font-mono text-[10px] text-ink-soft">{row.topicId}</div>
                </TableCell>
                <TableCell className="px-4 py-3">
                  <ModeChip mode={row.mode} />
                </TableCell>
                <TableCell className="px-4 py-3">
                  <StatusCell status={row.status} />
                </TableCell>
                <TableCell className="px-4 py-3 text-[12px] text-ink-muted">
                  <RelativeTime iso={row.startedAt} />
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink">
                  {formatDuration(row.durationMs)}
                </TableCell>
                <TableCell className="px-4 py-3 text-right font-mono text-[12px] tabular-nums text-ink">
                  {row.factsAdded > 0 ? row.factsAdded : <span className="text-ink-soft">—</span>}
                </TableCell>
                <TableCell className="px-4 py-3 text-right">
                  <AccuracyChip value={row.accuracy} status={row.status} />
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
