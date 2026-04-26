import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight, Layers, Mic, Pause, Play } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { VoiceTranscript, SwipeReplay } from "@/components/admin/interviews/interview-turns";
import { adminInterviews, aiQuestions } from "@/lib/mock-data";
import { RelativeTime } from "@/components/shared/relative-time";
import type { AIQuestion } from "@/lib/types";

interface Props {
  interviewId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatMs(ms: number): string {
  if (ms <= 0) return "0:00";
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, "0")}`;
}

function waveform(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  const out: number[] = [];
  for (let i = 0; i < 60; i++) {
    h = (h * 1664525 + 1013904223) >>> 0;
    out.push(0.25 + ((h % 1000) / 1000) * 0.75);
  }
  return out;
}

export function InterviewTranscriptDrawer({ interviewId, open, onOpenChange }: Props) {
  const interview = interviewId ? adminInterviews.find((i) => i.id === interviewId) : null;

  const turns: AIQuestion[] = useMemo(() => {
    if (!interview) return [];
    return interview.questionIds
      .map((qid) => aiQuestions.find((q) => q.id === qid))
      .filter((q): q is AIQuestion => Boolean(q));
  }, [interview]);

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto bg-surface p-0 sm:max-w-[560px]">
        {interview && (
          <div className="flex h-full flex-col">
            <SheetHeader className="border-b border-border p-6 text-left">
              <div className="flex items-start gap-3">
                <div
                  className="grid h-11 w-11 shrink-0 place-items-center rounded-lg font-mono text-[14px]"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent-ink)",
                  }}
                >
                  {interview.interviewee.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <SheetTitle className="text-[16px] text-ink">
                    {interview.interviewee.name}
                  </SheetTitle>
                  <div className="mt-0.5 text-[12px] text-ink-muted">
                    {interview.interviewee.role}
                    <span className="ml-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                      {interview.interviewee.level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] text-ink-soft">
                <span className="font-mono uppercase tracking-wider">{interview.id}</span>
                <span>·</span>
                <ModeChip mode={interview.mode} />
                <span>·</span>
                <RelativeTime iso={interview.startedAt} />
              </div>
              <div className="mt-2 text-[12px] text-ink-muted">
                Topic: <span className="text-ink">{interview.topic}</span>
              </div>
            </SheetHeader>

            <div className="flex-1 space-y-5 p-6">
              {interview.mode === "voice" ? (
                <AudioPlayer durationMs={interview.durationMs} seed={interview.id} />
              ) : (
                <div className="rounded-[10px] border border-dashed border-border bg-surface-2 px-3 py-2 text-center font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  Swipe replay — no audio
                </div>
              )}

              <div>
                <div className="mb-2 font-mono text-[10px] uppercase tracking-wider text-ink-soft">
                  {interview.mode === "voice" ? "Voice transcript" : "Swipe replay"}
                </div>
                {turns.length === 0 ? (
                  <p className="rounded-md border border-dashed border-border px-4 py-6 text-center text-[12px] italic text-ink-soft">
                    No transcript captured for this session.
                  </p>
                ) : interview.mode === "voice" ? (
                  <VoiceTranscript interviewee={interview.interviewee} turns={turns} />
                ) : (
                  <SwipeReplay interviewee={interview.interviewee} turns={turns} />
                )}
              </div>
            </div>

            <div className="border-t border-border p-4">
              <Link
                to="/admin/interviews/$id"
                params={{ id: interview.id }}
                className="inline-flex w-full items-center justify-center gap-1.5 rounded-full px-4 py-2 text-[12px] font-medium transition-opacity hover:opacity-90"
                style={{
                  backgroundColor: "var(--accent)",
                  color: "var(--accent-ink)",
                }}
              >
                View full interview
                <ArrowRight size={12} />
              </Link>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function AudioPlayer({ durationMs, seed }: { durationMs: number; seed: string }) {
  const [playing, setPlaying] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const tickRef = useRef<number | null>(null);
  const bars = useMemo(() => waveform(seed), [seed]);
  const total = Math.max(1000, durationMs);

  useEffect(() => {
    if (!playing) return;
    const start = Date.now() - elapsed;
    tickRef.current = window.setInterval(() => {
      const next = Date.now() - start;
      if (next >= total) {
        setElapsed(total);
        setPlaying(false);
        if (tickRef.current) window.clearInterval(tickRef.current);
        return;
      }
      setElapsed(next);
    }, 100);
    return () => {
      if (tickRef.current) window.clearInterval(tickRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  const pct = Math.min(1, elapsed / total);

  return (
    <div className="rounded-[12px] border border-border bg-background px-3 py-2.5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => setPlaying((v) => !v)}
          className="grid h-8 w-8 place-items-center rounded-full transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--accent)",
            color: "var(--accent-ink)",
          }}
          aria-label={playing ? "Pause" : "Play"}
        >
          {playing ? <Pause size={13} /> : <Play size={13} />}
        </button>
        <div className="flex flex-1 items-end gap-[2px]" aria-hidden>
          {bars.map((h, i) => {
            const filled = i / bars.length <= pct;
            return (
              <span
                key={i}
                className="block w-[3px] rounded-full"
                style={{
                  height: `${Math.round(h * 22)}px`,
                  backgroundColor: filled ? "var(--accent)" : "var(--ink-soft)",
                  opacity: filled ? 1 : 0.4,
                }}
              />
            );
          })}
        </div>
        <span className="w-[80px] text-right font-mono text-[10px] tabular-nums text-ink-soft">
          {formatMs(elapsed)} / {formatMs(total)}
        </span>
      </div>
    </div>
  );
}

function ModeChip({ mode }: { mode: "voice" | "swipe" }) {
  const Icon = mode === "voice" ? Mic : Layers;
  const isVoice = mode === "voice";
  return (
    <span
      className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{
        backgroundColor: isVoice ? "var(--accent-soft)" : "var(--surface-2)",
        color: isVoice ? "var(--accent-ink)" : "var(--ink-muted)",
      }}
    >
      <Icon size={10} />
      {isVoice ? "voice" : "swipe"}
    </span>
  );
}
