import { U as jsxRuntimeExports } from "./worker-entry-CmnI0TLV.js";
const labels = {
  disambiguation: "disambiguation",
  conflict: "conflict",
  gap: "gap",
  low_confidence: "low confidence",
  categorization: "categorization"
};
function QuestionTypeChip({ type }) {
  const isConflict = type === "conflict";
  const isLow = type === "low_confidence";
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    "span",
    {
      className: "inline-flex items-center rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide",
      style: {
        backgroundColor: isConflict ? "var(--danger-soft)" : isLow ? "var(--warning-soft)" : "var(--accent-soft)",
        color: isConflict ? "var(--danger)" : isLow ? "var(--warning)" : "var(--accent-ink)"
      },
      children: labels[type]
    }
  );
}
export {
  QuestionTypeChip as Q
};
