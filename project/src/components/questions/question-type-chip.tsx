import type { QuestionType } from "@/lib/types";

const labels: Record<QuestionType, string> = {
  disambiguation: "disambiguation",
  conflict: "conflict",
  gap: "gap",
  low_confidence: "low confidence",
  categorization: "categorization",
};

export function QuestionTypeChip({ type }: { type: QuestionType }) {
  const isConflict = type === "conflict";
  const isLow = type === "low_confidence";
  return (
    <span
      className="inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide"
      style={{
        backgroundColor: isConflict
          ? "var(--danger-soft)"
          : isLow
            ? "var(--warning-soft)"
            : "var(--accent-soft)",
        color: isConflict
          ? "var(--danger)"
          : isLow
            ? "var(--warning)"
            : "var(--accent-ink)",
      }}
    >
      {labels[type]}
    </span>
  );
}