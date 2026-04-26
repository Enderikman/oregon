import { useMemo } from "react";
import { Link } from "@tanstack/react-router";
import { Mic, Layers, Clock, CheckCircle2 } from "lucide-react";
import { useMemoryStore } from "@/lib/memory-context";
import { relativeTime } from "@/lib/format";
import type { InterviewSession } from "@/lib/memory-context";

function formatDuration(ms: number): string {
  const totalSec = Math.max(0, Math.round(ms / 1000));
  if (totalSec < 60) return `${totalSec}s`;
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  if (m < 60) return s === 0 ? `${m}m` : `${m}m ${s}s`;
  const h = Math.floor(m / 60);
  const rm = m % 60;
  return rm === 0 ? `${h}h` : `${h}h ${rm}m`;
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function groupByDay(sessions: InterviewSession[]): Array<{ key: string; label: string; items: InterviewSession[] }> {
  const groups = new Map<string, InterviewSession[]>();
  for (const s of sessions) {
    const d = new Date(s.startedAt);
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(s);
  }
  return Array.from(groups.entries()).map(([key, items]) => ({
    key,
    label: formatDate(items[0].startedAt),
    items,
  }));
}

export function HistoryPage() {
  const { sessions } = useMemoryStore();

  const sorted = useMemo(
    () => [...sessions].sort((a, b) => (a.startedAt < b.startedAt ? 1 : -1)),
    [sessions],
  );
  const groups = useMemo(() => groupByDay(sorted), [sorted]);

  const totalSessions = sorted.length;
  const totalAnswered = sorted.reduce((acc, s) => acc + s.questionsAnswered, 0);
  const totalDurationMs = sorted.reduce((acc, s) => acc + s.durationMs, 0);

  return (
    <main className="mx-auto max-w-[820px] px-6 py-10">
      <header className="mb-8">
        <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          Interview history
        </div>
        <h1 className="mt-1 text-[26px] font-normal text-ink">
          Every session you've used to add context.
        </h1>
      </header>

      {totalSessions > 0 && (
        <div className="mb-8 grid grid-cols-3 gap-3">
          <Stat label="Sessions" value={String(totalSessions)} />
          <Stat label="Questions answered" value={String(totalAnswered)} />
          <Stat label="Total time" value={formatDuration(totalDurationMs)} />
        </div>
      )}

      {totalSessions === 0 ? (
        <EmptyState />
      ) : (
        <ol className="space-y-8">
          {groups.map((g) => (
            <li key={g.key}>
              <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
                {g.label}
              </div>
              <ul className="space-y-2">
                {g.items.map((s) => (
                  <SessionRow key={s.id} session={s} />
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-[14px] border border-border bg-surface px-4 py-3">
      <div className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
        {label}
      </div>
      <div className="mt-1 text-[20px] text-ink">{value}</div>
    </div>
  );
}

function SessionRow({ session }: { session: InterviewSession }) {
  const isVoice = session.mode === "voice";
  const Icon = isVoice ? Mic : Layers;
  return (
    <li className="rounded-[14px] border border-border bg-surface px-4 py-3.5">
      <div className="flex items-start gap-3">
        <div
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
        >
          <Icon size={15} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
              style={{
                backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
                color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)",
              }}
            >
              {isVoice ? "Voice" : "Quiz"}
            </span>
            <span className="font-mono text-[11px] text-ink-soft">
              {formatTime(session.startedAt)} · {relativeTime(session.startedAt)}
            </span>
          </div>
          <p className="mt-1 truncate text-[14px] text-ink">{session.topic}</p>
          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] text-ink-muted">
            <span className="inline-flex items-center gap-1.5">
              <Clock size={12} />
              {formatDuration(session.durationMs)}
            </span>
            <span className="inline-flex items-center gap-1.5">
              <CheckCircle2 size={12} />
              {session.questionsAnswered} answered
            </span>
            {session.questionsSkipped > 0 && (
              <span className="text-ink-soft">{session.questionsSkipped} skipped</span>
            )}
          </div>
        </div>
      </div>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="rounded-[18px] border border-border bg-surface px-8 py-14 text-center">
      <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        No sessions yet
      </div>
      <h2 className="mt-2 text-[20px] text-ink">You haven't added any context yet :(</h2>
      <p className="mt-2 text-[13px] text-ink-muted">
        Every voice interview and quiz you complete will appear here.
      </p>
      <Link
        to="/"
        className="mt-5 inline-block rounded-full px-5 py-2.5 text-[13px] font-medium"
        style={{ backgroundColor: "var(--accent)", color: "white" }}
      >
        Back to cockpit
      </Link>
    </div>
  );
}