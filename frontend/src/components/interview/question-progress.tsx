import { Progress } from "@/components/ui/progress";
import { QuestionTypeChip } from "@/components/questions/question-type-chip";
import type { AIQuestion } from "@/lib/types";

interface Props {
  questions: AIQuestion[];
  currentIndex: number;
}

export function QuestionProgress({ questions, currentIndex }: Props) {
  const total = Math.max(questions.length, 1);
  const safeIndex = Math.min(currentIndex, questions.length - 1);
  const current = questions[safeIndex];
  const value = Math.min(100, Math.max(0, ((safeIndex + 1) / total) * 100));

  return (
    <div className="rounded-[14px] border border-border bg-surface px-5 py-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Question {safeIndex + 1} of {questions.length}
          </span>
          {current && <QuestionTypeChip type={current.type} />}
          {current && (
            <span className="hidden shrink-0 text-ink-soft sm:inline">·</span>
          )}
          {current && (
            <p className="hidden min-w-0 truncate text-[12px] leading-snug text-ink-muted sm:block">
              {current.question}
            </p>
          )}
        </div>
        <span className="shrink-0 font-mono text-[11px] text-ink-soft">
          {Math.round(value)}%
        </span>
      </div>
      <Progress
        value={value}
        className="mt-3 h-1 bg-surface-2"
        style={{ backgroundColor: "var(--surface-2)" }}
      />
      {current && (
        <p className="mt-3 truncate text-[12px] leading-snug text-ink-muted sm:hidden">
          {current.question}
        </p>
      )}
    </div>
  );
}