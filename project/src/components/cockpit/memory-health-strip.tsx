import { useEffect, useRef, useState } from "react";
import type { MemoryHealth } from "@/lib/types";

function useTickedNumber(value: number, durationMs = 400) {
  const [display, setDisplay] = useState(value);
  const prev = useRef(value);
  useEffect(() => {
    const from = prev.current;
    const to = value;
    if (from === to) return;
    const start = performance.now();
    let raf = 0;
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / durationMs);
      const eased = 1 - Math.pow(1 - t, 3);
      setDisplay(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(step);
      else prev.current = to;
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, durationMs]);
  return display;
}

function Tile({
  label,
  value,
  suffix,
  tone = "default",
}: {
  label: string;
  value: number;
  suffix?: string;
  tone?: "default" | "accent" | "warning" | "danger";
}) {
  const v = useTickedNumber(value);
  const color =
    tone === "danger" ? "var(--danger)"
    : tone === "warning" ? "var(--warning)"
    : tone === "accent" ? "var(--accent)"
    : "var(--ink)";
  return (
    <div className="flex-1 rounded-[14px] border border-border bg-surface px-5 py-4">
      <div className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">{label}</div>
      <div className="mt-1 font-mono text-[22px]" style={{ color }}>
        {v}
        {suffix}
      </div>
    </div>
  );
}

export function MemoryHealthStrip({ health }: { health: MemoryHealth }) {
  const conf = Math.round(health.confidenceAvg * 100);
  return (
    <div className="flex flex-wrap gap-3">
      <Tile label="Facts learned" value={health.factsLearned} />
      <Tile
        label="Confidence avg"
        value={conf}
        suffix="%"
        tone={conf < 70 ? "warning" : "default"}
      />
      <Tile
        label="Open questions"
        value={health.openQuestions}
        tone={health.openQuestions > 0 ? "accent" : "default"}
      />
      <Tile
        label="Conflicts"
        value={health.conflicts}
        tone={health.conflicts > 0 ? "danger" : "default"}
      />
      <Tile
        label="Sources"
        value={health.sourcesIngested}
        suffix={` / ${health.sourcesTotal}`}
      />
    </div>
  );
}