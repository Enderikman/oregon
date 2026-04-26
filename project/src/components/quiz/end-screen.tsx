import { motion } from "framer-motion";
import type { HistoryEntry } from "@/lib/quiz-types";
import finaleLandscape from "@/assets/finale-landscape.jpg";

type Props = {
  history: HistoryEntry[];
  total: number;
  onReset: () => void;
};

export function EndScreen({ history, total, onReset }: Props) {
  const yes = history.filter((h) => h.decision === "yes").length;
  const no = history.filter((h) => h.decision === "no").length;
  const skip = history.filter((h) => h.decision === "skip").length;
  const dunno = history.filter((h) => h.decision === "dont_know").length;
  const avgMs = history.length
    ? Math.round(history.reduce((a, h) => a + h.durationMs, 0) / history.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="fixed inset-0 z-[60] overflow-hidden"
    >
      <img
        src={finaleLandscape}
        alt=""
        aria-hidden
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.6 }}
        className="absolute inset-x-0 bottom-0 p-6 sm:p-12"
      >
        <div className="max-w-[640px] mx-auto text-white">
          <div className="text-[11px] uppercase tracking-[0.3em] text-white/70 font-mono">
            Session complete
          </div>
          <h2 className="mt-2 text-4xl sm:text-5xl font-light tracking-tight">
            Take a breath.
          </h2>
          <p className="mt-3 text-white/80 text-sm sm:text-base max-w-md">
            You resolved {history.length} of {total} questions
            {avgMs > 0 && <> · avg {(avgMs / 1000).toFixed(1)}s per decision</>}.
          </p>

          <div className="mt-6 flex flex-wrap gap-2">
            <Pill label="Yes" value={yes} />
            <Pill label="No" value={no} />
            <Pill label="Skip" value={skip} />
            <Pill label="Can't" value={dunno} />
          </div>

          <button
            onClick={onReset}
            className="mt-8 px-6 py-3 rounded-full bg-white text-black text-sm font-medium hover:opacity-90 transition active:scale-[0.98]"
          >
            Start a new round
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function Pill({ label, value }: { label: string; value: number }) {
  return (
    <div className="px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-xs text-white">
      <span className="font-semibold">{value}</span>
      <span className="ml-1.5 text-white/70 uppercase tracking-wider text-[10px] font-mono">
        {label}
      </span>
    </div>
  );
}
