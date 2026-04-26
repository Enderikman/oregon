import { motion, AnimatePresence } from "framer-motion";
import { Check, Pencil, X } from "lucide-react";
import type { AIQuestion } from "@/lib/types";

type Phase = "idle" | "speaking" | "listening" | "confirming" | "processing" | "done";

interface Props {
  q: AIQuestion;
  phase: Phase;
  pendingAnswer?: string;
  onConfirm?: () => void;
  onEdit?: () => void;
  onDismiss?: () => void;
  onCandidate: (choice: string) => void;
}

export function VoiceStage({
  q,
  phase,
  pendingAnswer,
  onConfirm,
  onEdit,
  onDismiss,
  onCandidate,
}: Props) {
  const phaseLabel =
    phase === "speaking"
      ? "Speaking…"
      : phase === "listening"
        ? "Listening…"
        : phase === "confirming"
          ? "Confirm"
          : phase === "processing"
            ? "Got it."
            : phase === "done"
              ? "Done."
              : "Ready.";

  const isConfirming = phase === "confirming" && !!pendingAnswer;

  return (
    <div
      className="flex h-full min-h-[560px] flex-col items-center justify-center rounded-[24px] border border-border px-8 py-16 text-center shadow-soft"
      style={{
        background:
          "radial-gradient(ellipse at 50% 25%, var(--accent-soft) 0%, var(--surface) 70%)",
      }}
    >
      <SiriOrb phase={phase} />

      <div className="mt-12 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
        {phaseLabel}
      </div>

      {/* Live caption — shows what the AI is saying */}
      <div className="mt-4 min-h-[80px] max-w-[42ch]">
        <h2 className="text-[26px] leading-[1.3] text-ink">{q.question}</h2>
      </div>

      <AnimatePresence>
        {isConfirming && (
          <motion.div
            initial={{ opacity: 0, y: 16, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.98 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="mt-10 w-full max-w-[440px] rounded-[20px] border border-border bg-surface p-5 text-left shadow-soft"
          >
            <div className="flex items-center gap-2">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--accent)" }}
              />
              <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
                What I understood
              </span>
            </div>
            <p className="mt-3 text-[15px] leading-snug text-ink">
              {pendingAnswer}
            </p>

            <div className="mt-5 flex items-center gap-2">
              <button
                onClick={onConfirm}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium text-white transition-opacity hover:opacity-90"
                style={{
                  background:
                    "linear-gradient(135deg, var(--accent) 0%, color-mix(in oklab, var(--accent) 70%, white) 100%)",
                  boxShadow:
                    "0 8px 24px -8px color-mix(in oklab, var(--accent) 60%, transparent)",
                }}
              >
                <Check size={14} /> Confirm
              </button>
              <button
                onClick={onEdit}
                className="inline-flex items-center justify-center gap-1.5 rounded-full border border-border bg-surface-2 px-4 py-2.5 text-[13px] text-ink hover:bg-surface"
              >
                <Pencil size={13} /> Edit
              </button>
              <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className="grid h-9 w-9 place-items-center rounded-full text-ink-soft hover:bg-surface-2 hover:text-ink"
              >
                <X size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SiriOrb({ phase }: { phase: Phase }) {
  const active = phase === "speaking" || phase === "listening";
  const intensity = phase === "speaking" ? 1 : phase === "listening" ? 0.7 : 0.3;

  return (
    <div className="relative grid h-[220px] w-[220px] place-items-center">
      {/* Outer glow */}
      <motion.div
        className="absolute inset-0 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, var(--accent) 0%, transparent 65%)",
          filter: "blur(24px)",
        }}
        animate={
          active
            ? { scale: [1, 1.12, 1], opacity: [0.35 * intensity, 0.6 * intensity, 0.35 * intensity] }
            : { scale: 1, opacity: 0.2 }
        }
        transition={{ duration: phase === "speaking" ? 2.2 : 3.4, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Mid ring */}
      <motion.div
        className="absolute h-[180px] w-[180px] rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 30%, color-mix(in oklab, var(--accent) 60%, white) 0%, var(--accent) 45%, color-mix(in oklab, var(--accent) 70%, black) 100%)",
          boxShadow: "inset 0 -20px 40px color-mix(in oklab, var(--accent) 60%, black), inset 0 20px 40px color-mix(in oklab, var(--accent) 30%, white)",
        }}
        animate={
          active
            ? { scale: [1, 1.04, 0.98, 1], rotate: [0, 8, -4, 0] }
            : { scale: 1, rotate: 0 }
        }
        transition={{ duration: phase === "speaking" ? 3 : 5, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Highlight */}
      <motion.div
        className="absolute h-[80px] w-[80px] rounded-full"
        style={{
          top: "30px",
          left: "55px",
          background:
            "radial-gradient(circle, color-mix(in oklab, white 75%, var(--accent)) 0%, transparent 70%)",
          filter: "blur(6px)",
        }}
        animate={active ? { opacity: [0.7, 0.95, 0.7] } : { opacity: 0.5 }}
        transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut" }}
      />
    </div>
  );
}