import { useEffect, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { adminMetrics } from "@/lib/mock-data";

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

interface StatProps {
  value: number;
  suffix?: string;
  label: string;
  tone?: "default" | "warning" | "danger" | "accent";
  to?: "/admin" | "/admin/interviews" | "/admin/map" | "/admin/conflicts";
}

function Stat({ value, suffix, label, tone = "default", to = "/admin" }: StatProps) {
  const v = useTickedNumber(value);
  const color =
    tone === "danger"
      ? "var(--danger)"
      : tone === "warning"
      ? "var(--warning)"
      : tone === "accent"
      ? "var(--accent)"
      : "var(--ink)";
  return (
    <Link
      to={to}
      className="group flex min-w-0 items-baseline gap-2 transition-opacity hover:opacity-100"
    >
      <span
        className="font-mono text-[26px] tabular-nums leading-none transition-colors"
        style={{ color }}
      >
        {v}
        {suffix}
      </span>
      <span className="text-[12px] text-ink-muted transition-colors group-hover:text-ink">
        {label}
      </span>
    </Link>
  );
}

function Dot() {
  return (
    <span aria-hidden className="text-ink-soft select-none">
      ·
    </span>
  );
}

export function HealthStrip() {
  const conf = Math.round(adminMetrics.confidenceAvg * 100);
  return (
    <div className="rounded-[14px] border border-border bg-surface px-6 py-5 shadow-soft">
      <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
        Memory health
      </div>
      <div className="mt-3 flex flex-wrap items-baseline gap-x-5 gap-y-3">
        <Stat value={adminMetrics.factsLearned} label="facts learned" />
        <Dot />
        <Stat
          value={conf}
          suffix="%"
          label="avg confidence"
          tone={conf < 70 ? "warning" : "default"}
        />
        <Dot />
        <Stat
          value={adminMetrics.openInterviews}
          label="open interviews"
          tone="accent"
          to="/admin/interviews"
        />
        <Dot />
        <Stat
          value={adminMetrics.conflictsPending}
          label="conflicts pending"
          tone={adminMetrics.conflictsPending > 0 ? "danger" : "default"}
          to="/admin/conflicts"
        />
        <Dot />
        <Link
          to="/admin"
          className="group flex min-w-0 items-baseline gap-2"
        >
          <span className="font-mono text-[26px] tabular-nums leading-none text-ink">
            {adminMetrics.sourcesConnected}
            <span className="text-ink-soft">/{adminMetrics.sourcesTotal}</span>
          </span>
          <span className="text-[12px] text-ink-muted group-hover:text-ink">
            sources connected
          </span>
        </Link>
      </div>
    </div>
  );
}
