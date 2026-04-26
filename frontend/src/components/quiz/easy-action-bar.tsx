import { Check, HelpCircle, SkipForward, Sparkles, X } from "lucide-react";
import type { Decision, Question } from "@/lib/quiz-types";

type Props = {
  question: Question;
  onDecide: (d: Decision) => void;
  onClarify: () => void;
};

export function EasyActionBar({ question, onDecide, onClarify }: Props) {
  const isYesNo = question.type === "yesno";

  return (
    <div className="w-full max-w-[460px] mx-auto mt-3 sm:mt-4 space-y-2 shrink-0">
      {isYesNo && (
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => onDecide("no")}
            className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-border bg-card hover:border-swipe-no hover:bg-swipe-no/5 active:scale-[0.98] transition"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted group-hover:bg-swipe-no/15 text-foreground group-hover:text-swipe-no transition">
              <X className="w-4 h-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-foreground">No</span>
          </button>
          <button
            type="button"
            onClick={() => onDecide("yes")}
            className="group flex items-center justify-center gap-2 px-4 py-3 rounded-xl border-2 border-border bg-card hover:border-swipe-yes hover:bg-swipe-yes/5 active:scale-[0.98] transition"
          >
            <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted group-hover:bg-swipe-yes/15 text-foreground group-hover:text-swipe-yes transition">
              <Check className="w-4 h-4" strokeWidth={2.5} />
            </span>
            <span className="text-sm font-semibold text-foreground">Yes</span>
          </button>
        </div>
      )}

      <div className="grid grid-cols-3 gap-1.5">
        <button
          type="button"
          onClick={onClarify}
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-medium text-foreground transition"
        >
          <Sparkles className="w-3 h-3" />
          Ask AI
        </button>
        <button
          type="button"
          onClick={() => onDecide("skip")}
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-medium text-foreground transition"
        >
          <SkipForward className="w-3 h-3" />
          Skip
        </button>
        <button
          type="button"
          onClick={() => onDecide("dont_know")}
          className="flex items-center justify-center gap-1 px-2 py-2 rounded-lg border border-border bg-card hover:bg-muted text-[11px] font-medium text-muted-foreground transition"
        >
          <HelpCircle className="w-3 h-3" />
          Can't answer
        </button>
      </div>
    </div>
  );
}
