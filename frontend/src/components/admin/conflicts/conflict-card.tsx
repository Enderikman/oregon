import { ArrowRight, ChevronRight } from "lucide-react";
import { relativeTime } from "@/lib/format";
import type {
  AdminConflict,
  ConflictKind,
  ConflictRespondent,
  ConflictStatus,
  ConflictEscalationStep,
  RecommendedAction,
} from "@/lib/mock-data";

interface Props {
  conflict: AdminConflict;
  
}

const KIND_LABEL: Record<ConflictKind, string> = {
  consensus: "Consensus",
  escalation: "Escalation",
  override: "Override",
};

const STATUS_LABEL: Record<ConflictStatus, string> = {
  open: "Open",
  escalated: "Escalated",
  resolved: "Resolved",
};

function KindChip({ kind }: { kind: ConflictKind }) {
  const map: Record<ConflictKind, { bg: string; fg: string }> = {
    consensus: { bg: "var(--surface-2)", fg: "var(--ink-muted)" },
    escalation: { bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
    override: { bg: "var(--warning-soft)", fg: "var(--warning)" },
  };
  const c = map[kind];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {KIND_LABEL[kind]}
    </span>
  );
}

function StatusChip({ status }: { status: ConflictStatus }) {
  const map: Record<ConflictStatus, { bg: string; fg: string }> = {
    open: { bg: "var(--surface-2)", fg: "var(--ink)" },
    escalated: { bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
    resolved: { bg: "var(--surface-2)", fg: "var(--ink-soft)" },
  };
  const c = map[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ backgroundColor: c.bg, color: c.fg }}
    >
      {STATUS_LABEL[status]}
    </span>
  );
}

function RespondentColumn({ r }: { r: ConflictRespondent }) {
  return (
    <div className="flex w-[180px] shrink-0 flex-col gap-2 rounded-[12px] border border-border bg-surface p-3">
      <div className="flex items-center gap-2">
        <div
          className="grid h-8 w-8 shrink-0 place-items-center rounded-md font-mono text-[11px]"
          style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
        >
          {r.initials}
        </div>
        <div className="min-w-0 flex-1">
          <div className="truncate text-[12px] text-ink">{r.name}</div>
          <div className="flex items-center gap-1.5 text-[10px] text-ink-muted">
            <span className="truncate">{r.role}</span>
            <span className="font-mono uppercase tracking-wider text-ink-soft">{r.level}</span>
          </div>
        </div>
      </div>
      <div
        className="rounded-md bg-surface-2 px-2.5 py-2 text-[12px] italic text-ink"
        style={{ lineHeight: 1.35 }}
      >
        “{r.answer}”
      </div>
      <div className="flex items-center justify-between font-mono text-[10px] tabular-nums text-ink-soft">
        <span>{Math.round(r.confidence * 100)}% conf</span>
        <span>{relativeTime(r.answeredAt)}</span>
      </div>
    </div>
  );
}

function ChainStep({ step }: { step: ConflictEscalationStep }) {
  if (step.status === "asked") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[11px]"
        style={{
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)",
        }}
      >
        <span className="line-through opacity-70">{step.name}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider opacity-80">{step.level}</span>
      </span>
    );
  }
  if (step.status === "next") {
    return (
      <span
        className="inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] text-ink"
        style={{ borderColor: "var(--accent)", backgroundColor: "var(--surface)" }}
      >
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
        <span>{step.name}</span>
        <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">{step.level}</span>
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-2 px-2.5 py-1 text-[11px] text-ink-muted">
      <span>{step.name}</span>
      <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">{step.level}</span>
    </span>
  );
}

function actionLabel(c: AdminConflict): string {
  switch (c.recommendedAction) {
    case "pick_canonical":
      return c.recommendedChoice ? `Pick “${c.recommendedChoice}”` : "Pick canonical";
    case "escalate": {
      const next = c.escalationChain.find((s) => s.status === "next");
      return next ? `Send to ${next.name} (${next.level})` : "Escalate";
    }
    case "override":
      return "Override manually";
  }
}

function actionTone(action: RecommendedAction): "accent" | "warning" {
  return action === "override" ? "warning" : "accent";
}

function chainSummary(c: AdminConflict): string {
  const asked = c.escalationChain.filter((s) => s.status === "asked");
  const next = c.escalationChain.find((s) => s.status === "next");
  if (c.recommendedAction === "pick_canonical" && c.recommendedChoice) {
    return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} answered. Recommendation: pick “${c.recommendedChoice}”.`;
  }
  if (c.recommendedAction === "escalate" && next) {
    return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} agreed. Escalating to ${next.name} (${next.level}) for confirmation.`;
  }
  return `${asked.map((s) => `${s.name} (${s.level})`).join(" + ")} disagree across functions. Manual override required.`;
}

export function ConflictCard({ conflict }: Props) {
  const tone = actionTone(conflict.recommendedAction);
  const leftBorder =
    conflict.status === "escalated"
      ? "var(--accent)"
      : conflict.kind === "override"
        ? "var(--warning)"
        : "transparent";

  const [aId, bId] = conflict.factPairIds;
  const aFact = conflict.respondents.find((r) => r.factId === aId);
  const bFact = conflict.respondents.find((r) => r.factId === bId) ?? conflict.respondents.find((r) => r.factId !== aId);
  const valueA = aFact?.answer ?? conflict.respondents[0]?.answer ?? "";
  const valueB = bFact?.answer ?? conflict.respondents[1]?.answer ?? "";

  return (
    <article
      className="relative overflow-hidden rounded-[16px] border border-border bg-surface shadow-soft"
      style={{ borderLeft: `2px solid ${leftBorder}` }}
    >
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-border px-5 py-4">
        <div className="min-w-0">
          <div className="flex items-baseline gap-2">
            <h2 className="text-[15px] text-ink">{conflict.entityName}</h2>
            <span className="text-[13px] text-ink-muted">· {conflict.predicate}</span>
          </div>
          <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
            {conflict.id}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <KindChip kind={conflict.kind} />
          <StatusChip status={conflict.status} />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <div className="rounded-[10px] border border-border bg-surface-2 px-3.5 py-2.5">
          <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Fact in dispute
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-2 text-[13px] text-ink">
            <span className="italic">“{valueA}”</span>
            <span className="text-ink-soft">↔</span>
            <span className="italic">“{valueB}”</span>
          </div>
          <div className="mt-1 font-mono text-[10px] tabular-nums text-ink-soft">
            {conflict.affectedFactCount} downstream fact{conflict.affectedFactCount === 1 ? "" : "s"} affected · open for {Math.round(conflict.ageMs / 3_600_000)}h
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Respondents
          </div>
          <div className="flex gap-3 overflow-x-auto pb-1">
            {conflict.respondents.map((r) => (
              <RespondentColumn key={`${r.factId}-${r.interviewId}`} r={r} />
            ))}
          </div>
        </div>

        <div>
          <div className="mb-2 font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Escalation chain
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            {conflict.escalationChain.map((step, i) => (
              <span key={`${step.name}-${i}`} className="flex items-center gap-1.5">
                <ChainStep step={step} />
                {i < conflict.escalationChain.length - 1 && (
                  <ChevronRight size={12} className="text-ink-soft" />
                )}
              </span>
            ))}
          </div>
          <p className="mt-2 text-[12px] text-ink-muted">{chainSummary(conflict)}</p>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-border bg-surface-2/40 px-5 py-3">
        <p className="max-w-[55%] text-[11px] italic text-ink-soft">
          System: {conflict.recommendedReason}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-[12px] font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: tone === "warning" ? "var(--warning)" : "var(--accent)",
              color: tone === "warning" ? "var(--warning-soft)" : "var(--accent-ink)",
            }}
          >
            {actionLabel(conflict)}
            <ArrowRight size={12} />
          </button>
        </div>
      </div>
    </article>
  );
}
