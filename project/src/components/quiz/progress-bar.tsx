type Props = { value: number; total: number };

export function ProgressBar({ value, total }: Props) {
  const pct = total === 0 ? 0 : (value / total) * 100;
  return (
    <div className="w-full">
      <div className="h-[3px] w-full bg-muted rounded-full overflow-hidden">
        <div
          className="h-full bg-foreground transition-[width] duration-300 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
