import { Link } from "@tanstack/react-router";
import { Check, Clipboard, ArrowLeft } from "lucide-react";
import { useState } from "react";
import type { AIQuestion } from "@/lib/types";
import type { TranscriptEntry } from "./transcript-stream";

interface ResolvedPair {
  question: AIQuestion;
  answer: string;
}

interface Props {
  resolved: ResolvedPair[];
  skipped: AIQuestion[];
  transcript: TranscriptEntry[];
}

export function InterviewSummary({ resolved, skipped, transcript }: Props) {
  const [copied, setCopied] = useState(false);
  const factsTouched = resolved.reduce((n, r) => n + r.question.affectedFactIds.length, 0);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(JSON.stringify({ resolved, transcript }, null, 2));
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-[860px] px-6 py-12">
      <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        Interview complete
      </div>
      <h1 className="mt-2 text-[28px] text-ink">
        {resolved.length} {resolved.length === 1 ? "question" : "questions"} answered
        {skipped.length > 0 ? `, ${skipped.length} skipped` : ""}.
      </h1>
      <p className="mt-1 text-[14px] text-ink-muted">
        {factsTouched} {factsTouched === 1 ? "fact" : "facts"} updated in memory.
      </p>

      <section className="mt-10">
        <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          Transcript summary
        </div>
        {resolved.length === 0 ? (
          <p className="text-[13px] text-ink-muted">No answers captured.</p>
        ) : (
          <ol className="space-y-4">
            {resolved.map((r, i) => (
              <li key={r.question.id} className="rounded-[14px] border border-border bg-surface p-5">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  <span>{String(i + 1).padStart(2, "0")}</span>
                  <span>·</span>
                  <span>{r.question.type.replace("_", " ")}</span>
                </div>
                <p className="mt-2 text-[15px] text-ink">{r.question.question}</p>
                <div className="mt-3 flex items-start gap-2">
                  <Check size={14} className="mt-1 shrink-0" style={{ color: "var(--accent)" }} />
                  <p className="text-[14px] text-ink">{r.answer}</p>
                </div>
              </li>
            ))}
          </ol>
        )}
      </section>

      {skipped.length > 0 && (
        <section className="mt-8">
          <div className="mb-3 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Skipped — still in queue
          </div>
          <ul className="space-y-2">
            {skipped.map((q) => (
              <li key={q.id} className="rounded-[12px] border border-border bg-background px-4 py-3 text-[13px] text-ink-muted">
                {q.question}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2.5 text-[13px] font-medium"
          style={{ backgroundColor: "var(--accent)", color: "white" }}
        >
          <ArrowLeft size={14} />
          Back to cockpit
        </Link>
        <button
          onClick={copy}
          className="inline-flex items-center gap-1.5 rounded-full border border-border bg-surface px-5 py-2.5 text-[13px] text-ink hover:bg-surface-2"
        >
          {copied ? <Check size={14} /> : <Clipboard size={14} />}
          {copied ? "Copied" : "Copy transcript"}
        </button>
      </div>
    </div>
  );
}