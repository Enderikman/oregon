import { Progress } from "@/components/ui/progress";

interface Props {
  current: number; // 1-based
  total: number;
}

export function ProgressBar({ current, total }: Props) {
  const safeTotal = Math.max(total, 1);
  const value = Math.min(100, Math.max(0, ((current - 1) / safeTotal) * 100));
  return (
    <div className="flex items-center gap-3">
      <Progress
        value={value}
        className="h-1 w-40 bg-surface-2"
        style={{ backgroundColor: "var(--surface-2)" }}
      />
      <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
        {Math.min(current, total)} / {total}
      </span>
    </div>
  );
}