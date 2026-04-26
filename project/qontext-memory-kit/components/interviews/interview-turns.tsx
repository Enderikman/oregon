import { Bot } from "lucide-react";
import type { AIQuestion } from "@/lib/types";

interface Interviewee {
  name: string;
  initials: string;
}

interface Props {
  interviewee: Interviewee;
  turns: AIQuestion[];
}

export function VoiceTranscript({ interviewee, turns }: Props) {
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
              className="max-w-[80%] rounded-2xl rounded-bl-md px-4 py-2.5 text-[13px]"
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

export function SwipeReplay({ interviewee, turns }: Props) {
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
