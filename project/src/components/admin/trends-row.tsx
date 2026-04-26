import { adminTrends } from "@/lib/mock-data";
import { Sparkline } from "./sparkline";

interface CardProps {
  label: string;
  value: string;
  delta: string;
  deltaTone: "up" | "down" | "neutral";
  values: number[];
  invert?: boolean;
  stroke?: string;
}

function TrendCard({ label, value, delta, deltaTone, values, invert, stroke }: CardProps) {
  const deltaColor =
    deltaTone === "up"
      ? "var(--accent)"
      : deltaTone === "down"
      ? "var(--danger)"
      : "var(--ink-muted)";
  return (
    <div className="flex-1 min-w-[180px] rounded-[14px] border border-border bg-surface px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div className="mt-2 flex items-end justify-between gap-3">
        <div>
          <div className="font-mono text-[22px] leading-none text-ink tabular-nums">
            {value}
          </div>
          <div
            className="mt-1.5 font-mono text-[11px] tabular-nums"
            style={{ color: deltaColor }}
          >
            {delta}
          </div>
        </div>
        <Sparkline
          values={values}
          invert={invert}
          stroke={stroke ?? "var(--accent)"}
          fill={stroke ?? "var(--accent)"}
        />
      </div>
    </div>
  );
}

function pctDelta(values: number[]): { text: string; tone: "up" | "down" | "neutral" } {
  if (values.length < 2) return { text: "—", tone: "neutral" };
  const first = values[0];
  const last = values[values.length - 1];
  if (first === 0) return { text: "—", tone: "neutral" };
  const pct = ((last - first) / first) * 100;
  const tone = pct > 0 ? "up" : pct < 0 ? "down" : "neutral";
  const sign = pct > 0 ? "+" : "";
  return { text: `${sign}${pct.toFixed(0)}% · 7d`, tone };
}

export function TrendsRow() {
  const facts = adminTrends.factsAdded;
  const conf = adminTrends.confidence;
  const comp = adminTrends.interviewCompletion;
  const conflict = adminTrends.conflictOpenHours;

  const factsDelta = pctDelta(facts);
  const confDelta = pctDelta(conf);
  const compDelta = pctDelta(comp);
  // For conflict open time, lower is better -> invert delta tone semantics
  const rawConflictDelta = pctDelta(conflict);
  const conflictDelta = {
    text: rawConflictDelta.text,
    tone:
      rawConflictDelta.tone === "up"
        ? ("down" as const)
        : rawConflictDelta.tone === "down"
        ? ("up" as const)
        : ("neutral" as const),
  };

  const last = <T,>(a: T[]) => a[a.length - 1];

  return (
    <div className="flex flex-wrap gap-3">
      <TrendCard
        label="Facts added"
        value={String(last(facts))}
        delta={factsDelta.text}
        deltaTone={factsDelta.tone}
        values={facts}
      />
      <TrendCard
        label="Confidence"
        value={`${Math.round(last(conf) * 100)}%`}
        delta={confDelta.text}
        deltaTone={confDelta.tone}
        values={conf}
      />
      <TrendCard
        label="Interview completion"
        value={`${Math.round(last(comp) * 100)}%`}
        delta={compDelta.text}
        deltaTone={compDelta.tone}
        values={comp}
      />
      <TrendCard
        label="Conflict open-time"
        value={`${last(conflict)}h`}
        delta={conflictDelta.text}
        deltaTone={conflictDelta.tone}
        values={conflict}
        invert
        stroke="var(--warning)"
      />
    </div>
  );
}
