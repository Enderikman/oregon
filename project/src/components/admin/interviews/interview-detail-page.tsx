import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowLeft, RefreshCw, Mic, Layers, CheckCircle2, AlertTriangle, Bot, Play } from "lucide-react";
import {
  adminInterviews,
  facts as allFacts,
  entities as allEntities,
  aiQuestions,
} from "@/lib/mock-data";
import type { AdminInterview } from "@/lib/mock-data";
import type { Fact, Entity } from "@/lib/types";
import { useMemoryStore } from "@/lib/memory-context";
import { RelativeTime } from "@/components/shared/relative-time";

interface Props {
  interviewId: string;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs === 0 ? `${m}m` : `${m}m ${rs}s`;
}

export function InterviewDetailPage({ interviewId }: Props) {
  const navigate = useNavigate();
  const interview = adminInterviews.find((i) => i.id === interviewId) ?? null;
  const { questions } = useMemoryStore();
  const [rerunning, setRerunning] = useState(false);
  const [rerunDone, setRerunDone] = useState(false);

  if (!interview) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-12">
        <div className="rounded-[14px] border border-border bg-surface p-8 text-center">
          <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            Not found
          </div>
          <p className="mt-2 text-[14px] text-ink-muted">
            No interview matches <span className="font-mono">{interviewId}</span>.
          </p>
          <button
            type="button"
            onClick={() => navigate({ to: "/admin/interviews" })}
            className="mt-4 rounded-full border border-border px-4 py-2 text-[12px] text-ink hover:bg-surface-2"
          >
            ← Back to interviews
          </button>
        </div>
      </main>
    );
  }

  // Resolve linked questions
  const linkedQuestions = interview.questionIds
    .map((qid) => questions.find((q) => q.id === qid) ?? aiQuestions.find((q) => q.id === qid))
    .filter((q): q is NonNullable<typeof q> => Boolean(q));

  // Facts derived: union of every affectedFactId on linked questions
  const factSet = new Set<string>();
  linkedQuestions.forEach((q) => q.affectedFactIds.forEach((id) => factSet.add(id)));
  const derivedFacts: Fact[] = Array.from(factSet)
    .map((id) => allFacts.find((f) => f.id === id))
    .filter((f): f is Fact => Boolean(f));

  // Entities touched
  const entitySet = new Set<string>();
  linkedQuestions.forEach((q) => q.affectedEntityIds.forEach((id) => entitySet.add(id)));
  derivedFacts.forEach((f) => entitySet.add(f.subject));
  const touchedEntities: Entity[] = Array.from(entitySet)
    .map((id) => allEntities.find((e) => e.id === id))
    .filter((e): e is Entity => Boolean(e));

  const autoAdded = derivedFacts.filter((f) => f.confidence >= 0.85 && !f.conflictingFactId);
  const flagged = derivedFacts.filter((f) => f.confidence < 0.85 || f.conflictingFactId);

  const handleRerun = () => {
    setRerunning(true);
    setRerunDone(false);
    setTimeout(() => {
      setRerunning(false);
      setRerunDone(true);
      setTimeout(() => setRerunDone(false), 2400);
    }, 1500);
  };

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <Link
            to="/admin/interviews"
            className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-ink-soft hover:text-ink"
          >
            <ArrowLeft size={11} />
            Admin · Interviews
          </Link>
          <div className="mt-2 flex flex-wrap items-end gap-3">
            <h1 className="text-[26px] font-normal text-ink">{interview.topic}</h1>
            <span className="font-mono text-[12px] uppercase tracking-wider text-ink-soft">
              {interview.id}
            </span>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[12px] text-ink-muted">
            <span>{interview.interviewee.name}</span>
            <span className="text-ink-soft">·</span>
            <span>{interview.interviewee.role}</span>
            <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              {interview.interviewee.level}
            </span>
            <span className="text-ink-soft">·</span>
            <ModeChip mode={interview.mode} />
            <span className="text-ink-soft">·</span>
            <RelativeTime iso={interview.startedAt} />
            <span className="text-ink-soft">·</span>
            <span className="font-mono tabular-nums">{formatDuration(interview.durationMs)}</span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleRerun}
          disabled={rerunning}
          className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-2 text-[12px] text-ink transition-colors hover:bg-surface-2 disabled:opacity-60"
          title="Re-run AI analysis (mocked)"
        >
          <RefreshCw size={13} className={rerunning ? "animate-spin" : ""} />
          {rerunning ? "Re-running…" : rerunDone ? "Analysis up-to-date" : "Re-run analysis"}
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        {/* LEFT — Transcript + Subgraph stacked */}
        <div className="space-y-4">
          <section className="rounded-[14px] border border-border bg-surface p-6 shadow-soft">
            <div className="mb-4 flex items-center justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                {interview.mode === "voice" ? "Voice transcript" : "Swipe replay"}
              </div>
              {interview.mode === "voice" && (
                <button
                  type="button"
                  disabled
                  className="inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] opacity-60"
                  style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
                >
                  <Play size={11} />
                  Play audio
                </button>
              )}
            </div>

            {linkedQuestions.length === 0 ? (
              <p className="rounded-md border border-dashed border-border px-4 py-8 text-center text-[12px] italic text-ink-soft">
                No transcript captured for this session.
              </p>
            ) : interview.mode === "voice" ? (
              <VoiceTranscript
                interviewee={interview.interviewee}
                turns={linkedQuestions}
              />
            ) : (
              <SwipeReplay
                interviewee={interview.interviewee}
                turns={linkedQuestions}
              />
            )}
          </section>

          <section className="rounded-[14px] border border-border bg-surface p-6 shadow-soft">
            <div className="mb-3 flex items-baseline justify-between">
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                Graph subgraph
              </div>
              <div className="font-mono text-[10px] tabular-nums text-ink-soft">
                {touchedEntities.length} entities · {derivedFacts.length} facts
              </div>
            </div>
            <p className="mb-4 text-[12px] text-ink-muted">
              Edges this interview created or strengthened. Solid links were
              created here; dashed links existed before and were re-confirmed.
            </p>
            <SubgraphView
              interviewee={interview.interviewee}
              entities={touchedEntities}
              facts={derivedFacts}
            />
            <div className="mt-3 flex flex-wrap items-center gap-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              <LegendDot color="var(--accent)" label="created" />
              <LegendDot color="var(--ink-soft)" label="strengthened" dashed />
            </div>
          </section>
        </div>

        {/* RIGHT — AI Analysis */}
        <aside className="space-y-4">
          <div className="rounded-[14px] border border-border bg-surface p-5 shadow-soft">
            <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              AI analysis
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2">
              <Stat label="Facts" value={String(derivedFacts.length)} />
              <Stat
                label="Accuracy"
                value={
                  interview.status === "pending"
                    ? "—"
                    : `${Math.round(interview.accuracy * 100)}%`
                }
              />
              <Stat
                label="Conflicts"
                value={String(interview.conflictsFound)}
                tone={interview.conflictsFound > 0 ? "warning" : "default"}
              />
            </div>
          </div>

          <div className="rounded-[14px] border border-border bg-surface p-5 shadow-soft">
            <div className="mb-2 flex items-center gap-1.5">
              <CheckCircle2 size={12} style={{ color: "var(--accent)" }} />
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                Auto-added ({autoAdded.length})
              </div>
            </div>
            {autoAdded.length === 0 ? (
              <p className="text-[12px] italic text-ink-soft">
                Nothing crossed the auto-add threshold (≥85% confidence, no
                conflict).
              </p>
            ) : (
              <ul className="space-y-2">
                {autoAdded.map((f) => (
                  <FactRow key={f.id} fact={f} />
                ))}
              </ul>
            )}
          </div>

          <div className="rounded-[14px] border border-border bg-surface p-5 shadow-soft">
            <div className="mb-2 flex items-center gap-1.5">
              <AlertTriangle size={12} style={{ color: "var(--warning)" }} />
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                Flagged ({flagged.length})
              </div>
            </div>
            {flagged.length === 0 ? (
              <p className="text-[12px] italic text-ink-soft">
                Nothing flagged. Clean run.
              </p>
            ) : (
              <ul className="space-y-2">
                {flagged.map((f) => (
                  <FactRow key={f.id} fact={f} flagged />
                ))}
              </ul>
            )}
          </div>

          {touchedEntities.length > 0 && (
            <div className="rounded-[14px] border border-border bg-surface p-5 shadow-soft">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                Entities touched
              </div>
              <ul className="space-y-1">
                {touchedEntities.map((e) => (
                  <li key={e.id}>
                    <div className="flex items-center justify-between rounded-md px-2 py-1.5 text-[12px] text-ink">
                      <span className="truncate">{e.name}</span>
                      <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                        {e.type}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </div>
    </main>
  );
}

// ---------- pieces ----------

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

function Stat({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "warning";
}) {
  const color = tone === "warning" ? "var(--warning)" : "var(--ink)";
  return (
    <div className="rounded-[10px] border border-border bg-surface-2 px-2.5 py-2">
      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div className="mt-1 font-mono text-[18px] tabular-nums leading-none" style={{ color }}>
        {value}
      </div>
    </div>
  );
}

function VoiceTranscript({
  interviewee,
  turns,
}: {
  interviewee: AdminInterview["interviewee"];
  turns: ReturnType<typeof useMemoryStore>["questions"];
}) {
  return (
    <ul className="space-y-4">
      {turns.map((q, i) => (
        <li key={q.id} className="space-y-2">
          <div className="flex items-end gap-2">
            <div
              className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
            >
              <Bot size={12} />
            </div>
            <div
              className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13px] text-ink"
              style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
            >
              {q.question}
            </div>
            <span className="font-mono text-[9px] tabular-nums text-ink-soft">
              {String(i + 1).padStart(2, "0")}
            </span>
          </div>
          {q.status === "resolved" && q.resolution && (
            <div className="flex items-end justify-end gap-2">
              <div className="max-w-[80%] rounded-2xl rounded-br-md border border-border bg-surface-2 px-4 py-2.5 text-[13px] text-ink">
                {q.resolution.choice}
              </div>
              <div
                className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]"
                style={{ backgroundColor: "var(--surface-2)", color: "var(--ink)" }}
              >
                {interviewee.initials}
              </div>
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}

function SwipeReplay({
  interviewee,
  turns,
}: {
  interviewee: AdminInterview["interviewee"];
  turns: ReturnType<typeof useMemoryStore>["questions"];
}) {
  return (
    <ol className="grid gap-3 sm:grid-cols-2">
      {turns.map((q, i) => {
        const answered = q.status === "resolved" && q.resolution;
        return (
          <li
            key={q.id}
            className="rounded-[12px] border border-border bg-surface-2 p-4"
          >
            <div className="mb-2 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-ink-soft">
              <span>card {String(i + 1).padStart(2, "0")}</span>
              <span
                className="rounded-full px-1.5 py-0.5 text-[9px]"
                style={{
                  backgroundColor: answered ? "var(--accent-soft)" : "var(--surface)",
                  color: answered ? "var(--accent-ink)" : "var(--ink-soft)",
                }}
              >
                {answered ? "answered" : "skipped"}
              </span>
            </div>
            <div className="text-[13px] text-ink">{q.question}</div>
            {answered && q.resolution && (
              <div className="mt-3 flex items-center gap-2 border-t border-border pt-3">
                <div
                  className="grid h-6 w-6 shrink-0 place-items-center rounded-md font-mono text-[9px]"
                  style={{ backgroundColor: "var(--surface)", color: "var(--ink)" }}
                >
                  {interviewee.initials}
                </div>
                <div className="text-[12px] italic text-ink">“{q.resolution.choice}”</div>
              </div>
            )}
          </li>
        );
      })}
    </ol>
  );
}

function FactRow({ fact, flagged = false }: { fact: Fact; flagged?: boolean }) {
  const subject = allEntities.find((e) => e.id === fact.subject);
  const pct = Math.round(fact.confidence * 100);
  const conflict = !!fact.conflictingFactId;
  return (
    <li className="rounded-md border border-border bg-surface-2 px-2.5 py-2">
      <div className="text-[12px] text-ink">
        <span className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          {subject?.name ?? fact.subject}
        </span>
        <span className="text-ink-soft"> · </span>
        <span>{fact.predicate}</span>
        <span className="text-ink-soft">: </span>
        <span className="italic">“{fact.object}”</span>
      </div>
      <div className="mt-1.5 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5">
          <div className="h-1 w-12 overflow-hidden rounded-full bg-surface">
            <div
              className="h-full rounded-full"
              style={{
                width: `${pct}%`,
                backgroundColor: flagged ? "var(--warning)" : "var(--accent)",
              }}
            />
          </div>
          <span
            className="font-mono text-[10px] tabular-nums"
            style={{ color: flagged ? "var(--warning)" : "var(--ink-muted)" }}
          >
            {pct}%
          </span>
        </div>
        {conflict && (
          <span
            className="rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wider"
            style={{ backgroundColor: "var(--warning-soft)", color: "var(--warning)" }}
          >
            conflict
          </span>
        )}
      </div>
    </li>
  );
}

function LegendDot({
  color,
  label,
  dashed = false,
}: {
  color: string;
  label: string;
  dashed?: boolean;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      <span
        className="inline-block h-0 w-5"
        style={{
          borderTop: `2px ${dashed ? "dashed" : "solid"} ${color}`,
        }}
      />
      {label}
    </span>
  );
}

function SubgraphView({
  interviewee,
  entities,
  facts,
}: {
  interviewee: AdminInterview["interviewee"];
  entities: Entity[];
  facts: Fact[];
}) {
  // Place interviewee on the left, entities arranged vertically on the right.
  const W = 700;
  const H = Math.max(180, 60 + entities.length * 56);
  const personX = 80;
  const personY = H / 2;
  const entX = W - 130;

  const points = entities.map((e, i) => {
    const y = entities.length === 1 ? H / 2 : 40 + (i * (H - 80)) / (entities.length - 1);
    return { id: e.id, name: e.name, type: e.type, x: entX, y };
  });

  return (
    <div className="overflow-x-auto rounded-[10px] border border-border bg-surface-2 p-4">
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} className="block">
        {/* edges */}
        {points.map((p) => {
          const eFacts = facts.filter((f) => f.subject === p.id);
          if (eFacts.length === 0) return null;
          // strengthened if any fact is older than 30 days, else created
          const created = eFacts.some(
            (f) => Date.now() - new Date(f.verifiedAt).getTime() < 30 * 86400000,
          );
          const stroke = created ? "var(--accent)" : "var(--ink-soft)";
          const dash = created ? undefined : "5 4";
          const midX = (personX + p.x) / 2;
          const path = `M ${personX + 28} ${personY} C ${midX} ${personY}, ${midX} ${p.y}, ${p.x - 8} ${p.y}`;
          return (
            <g key={`edge-${p.id}`}>
              <path d={path} fill="none" stroke={stroke} strokeWidth={1.5} strokeDasharray={dash} />
              <text
                x={midX}
                y={(personY + p.y) / 2 - 6}
                textAnchor="middle"
                style={{ fontSize: 9, fontFamily: "var(--font-mono, monospace)", fill: "var(--ink-soft)" }}
              >
                {eFacts.length} {eFacts.length === 1 ? "fact" : "facts"}
              </text>
            </g>
          );
        })}

        {/* interviewee */}
        <g>
          <circle cx={personX} cy={personY} r={26} fill="var(--accent-soft)" stroke="var(--accent)" strokeWidth={1.5} />
          <text
            x={personX}
            y={personY + 4}
            textAnchor="middle"
            style={{ fontSize: 11, fontFamily: "var(--font-mono, monospace)", fill: "var(--accent-ink)" }}
          >
            {interviewee.initials}
          </text>
          <text
            x={personX}
            y={personY + 44}
            textAnchor="middle"
            style={{ fontSize: 10, fill: "var(--ink-muted)" }}
          >
            {interviewee.name.split(" ")[0]}
          </text>
        </g>

        {/* entities */}
        {points.map((p) => (
          <g key={p.id}>
            <rect
              x={p.x - 8}
              y={p.y - 14}
              width={120}
              height={28}
              rx={6}
              fill="var(--surface)"
              stroke="var(--border)"
              strokeWidth={1}
            />
            <text
              x={p.x + 4}
              y={p.y + 4}
              style={{ fontSize: 11, fill: "var(--ink)" }}
            >
              {p.name.length > 18 ? p.name.slice(0, 17) + "…" : p.name}
            </text>
            <text
              x={p.x + 4}
              y={p.y - 18}
              style={{ fontSize: 8, fontFamily: "var(--font-mono, monospace)", fill: "var(--ink-soft)", textTransform: "uppercase", letterSpacing: 0.5 }}
            >
              {p.type}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}
