import { Link } from "@tanstack/react-router";
import { CheckCircle2, Circle, Layers, Mic } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useMemoryStore } from "@/lib/memory-context";
import { relativeTime } from "@/lib/format";
import type { AdminInterview } from "@/lib/mock-data";

interface Props {
  interview: AdminInterview | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatDuration(ms: number): string {
  if (ms <= 0) return "—";
  const s = Math.round(ms / 1000);
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  return rs === 0 ? `${m}m` : `${m}m ${rs}s`;
}

export function InterviewDetailDrawer({ interview, open, onOpenChange }: Props) {
  const { questions } = useMemoryStore();

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full overflow-y-auto bg-surface p-0 sm:max-w-[520px]"
      >
        {interview && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border p-6 text-left">
              <div className="flex items-start gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-[14px]"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" }}
                >
                  {interview.interviewee.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-[16px] text-ink">
                    {interview.interviewee.name}
                  </SheetTitle>
                  <div className="mt-0.5 text-[12px] text-ink-muted">
                    {interview.interviewee.role}
                    <span
                      className="ml-2 font-mono text-[10px] uppercase tracking-wider"
                      style={{ color: "var(--ink-soft)" }}
                    >
                      {interview.interviewee.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                {interview.id}
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <ModeChip mode={interview.mode} />
                <StatusChip status={interview.status} />
                <span className="text-[11px] text-ink-soft">
                  {relativeTime(interview.startedAt)} · {formatDuration(interview.durationMs)}
                </span>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-6 p-6">
              <div className="grid grid-cols-3 gap-3">
                <Stat label="Facts added" value={String(interview.factsAdded)} />
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

              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  Topic
                </div>
                <div className="mt-1.5 text-[14px] text-ink">{interview.topic}</div>
                <div className="mt-0.5 font-mono text-[11px] text-ink-soft">
                  {interview.topicId}
                </div>
              </div>

              <div>
                <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  Questions covered
                </div>
                {interview.questionIds.length === 0 ? (
                  <p className="mt-2 text-[12px] italic text-ink-soft">
                    No linked questions for this session.
                  </p>
                ) : (
                  <ul className="mt-2 space-y-2">
                    {interview.questionIds.map((qid) => {
                      const q = questions.find((x) => x.id === qid);
                      if (!q) return null;
                      return (
                        <li
                          key={qid}
                          className="rounded-[10px] border border-border bg-surface-2 px-3 py-2.5"
                        >
                          <div className="flex items-start gap-2">
                            {q.status === "resolved" ? (
                              <CheckCircle2
                                size={13}
                                className="mt-0.5 shrink-0"
                                style={{ color: "var(--accent)" }}
                              />
                            ) : (
                              <Circle
                                size={13}
                                className="mt-0.5 shrink-0 text-ink-soft"
                              />
                            )}
                            <div className="min-w-0">
                              <div className="text-[12px] text-ink">{q.question}</div>
                              {q.status === "resolved" && q.resolution && (
                                <div className="mt-1 text-[11px] text-ink-muted">
                                  → {q.resolution.choice}
                                </div>
                              )}
                            </div>
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 border-t border-border p-4">
              <Link
                to="/admin/map"
                className="flex-1 rounded-full px-4 py-2 text-center text-[12px] font-medium transition-opacity hover:opacity-90"
                style={{ backgroundColor: "var(--accent)", color: "var(--accent-ink)" }}
              >
                View in Neural Map
              </Link>
              <button
                type="button"
                disabled
                title="Transcripts coming soon"
                className="rounded-full border border-border px-4 py-2 text-[12px] text-ink-soft"
              >
                Open transcript
              </button>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
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
    <div className="rounded-[10px] border border-border bg-surface-2 px-3 py-2.5">
      <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
        {label}
      </div>
      <div className="mt-1 font-mono text-[18px] tabular-nums" style={{ color }}>
        {value}
      </div>
    </div>
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

function StatusChip({ status }: { status: AdminInterview["status"] }) {
  const map = {
    pending: { label: "Pending", bg: "var(--surface-2)", fg: "var(--ink-muted)" },
    live: { label: "Live", bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
    completed: { label: "Completed", bg: "var(--surface-2)", fg: "var(--ink)" },
    consolidated: { label: "Consolidated", bg: "var(--accent-soft)", fg: "var(--accent-ink)" },
  } as const;
  const cfg = map[status];
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{ backgroundColor: cfg.bg, color: cfg.fg }}
    >
      {cfg.label}
    </span>
  );
}
