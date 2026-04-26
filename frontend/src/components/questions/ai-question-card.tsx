import { motion } from "framer-motion";
import { Link } from "@tanstack/react-router";
import type { AIQuestion } from "@/lib/types";
import { relativeTime } from "@/lib/format";
import { QuestionTypeChip } from "./question-type-chip";

export function AIQuestionCard({ q }: { q: AIQuestion }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: "easeOut" }}
    >
      <Link
        to="/quiz/$id"
        params={{ id: q.id }}
        className="block rounded-[14px] border border-border bg-surface p-5 shadow-soft transition-colors hover:bg-surface-2"
      >
        <div className="flex flex-wrap items-center gap-2">
          <QuestionTypeChip type={q.type} />
          <span className="font-mono text-[11px] text-ink-soft">
            {relativeTime(q.raisedAt)}
          </span>
        </div>
        <h3 className="mt-3 text-[16px] leading-snug text-ink">{q.question}</h3>
      </Link>
    </motion.div>
  );
}