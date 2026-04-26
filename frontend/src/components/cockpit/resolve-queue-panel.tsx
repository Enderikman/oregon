import { Mic, Layers } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface Props {
  count: number;
}

export function ResolveQueuePanel({ count }: Props) {
  return (
    <div
      className="mb-8 rounded-[18px] border border-border p-6 shadow-soft"
      style={{ background: "linear-gradient(180deg, var(--accent-soft) 0%, var(--surface) 100%)" }}
    >
      <div className="flex flex-wrap items-center justify-between gap-5">
        <div>
          <div className="text-[18px] text-ink">Resolve your queue</div>
          <p className="mt-1 text-[13px] text-ink-muted">
            Walk through all {count} {count === 1 ? "question" : "questions"} in one sitting. Pause whenever — saved answers stay saved.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/interview/$id"
            params={{ id: "queue" }}
            className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[13px] font-medium"
            style={{ backgroundColor: "var(--accent)", color: "white" }}
          >
            <Mic size={15} />
            Voice Call
          </Link>
          <Link
            to="/quiz/$id"
            params={{ id: "queue" }}
            className="inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[13px] font-medium text-ink transition-colors hover:bg-surface-2"
            style={{ borderColor: "var(--border)", backgroundColor: "var(--surface)" }}
          >
            <Layers size={15} />
            Quiz Mode
          </Link>
        </div>
      </div>
    </div>
  );
}