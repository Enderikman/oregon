import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, X } from "lucide-react";
import type { Question } from "@/lib/quiz-types";

type Props = {
  question: Question;
  pendingDecision: string;
  onSubmit: (text: string) => void;
  onSkip: () => void;
};

export function FollowupPrompt({ question, pendingDecision, onSubmit, onSkip }: Props) {
  const [text, setText] = useState("");
  const prompt = question.followup?.prompt ?? "Add a quick note.";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-background/70 backdrop-blur-sm"
    >
      <motion.div
        initial={{ scale: 0.96 }}
        animate={{ scale: 1 }}
        className="w-full max-w-[460px] rounded-[var(--radius)] border border-border bg-card p-6 shadow-soft"
      >
        <div className="flex items-center justify-between">
          <div className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground font-mono">
            Quick follow-up · {pendingDecision}
          </div>
          <button
            type="button"
            onClick={onSkip}
            className="p-1 rounded-md text-muted-foreground hover:bg-muted hover:text-foreground transition"
            aria-label="Skip follow-up"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <h3 className="mt-3 text-xl font-semibold tracking-tight text-foreground text-balance">
          {question.question}
        </h3>
        <p className="mt-2 text-sm text-muted-foreground">{prompt}</p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (text.trim()) onSubmit(text.trim());
          }}
          className="mt-5 flex items-center gap-2"
        >
          <input
            autoFocus
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Type and press Enter…"
            className="flex-1 px-4 py-3 rounded-xl border border-border bg-secondary/60 text-foreground outline-none focus:ring-2 focus:ring-ring/30"
          />
          <button
            type="submit"
            disabled={!text.trim()}
            className="p-3 rounded-xl bg-foreground text-background disabled:opacity-30 hover:opacity-90 transition"
            aria-label="Submit follow-up"
          >
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <button
          type="button"
          onClick={onSkip}
          className="mt-3 w-full text-center text-xs text-muted-foreground hover:text-foreground transition"
        >
          Skip — keep the answer without a note
        </button>
      </motion.div>
    </motion.div>
  );
}
