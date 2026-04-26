export function ImpactBadge({ touches, unblocks }: { touches: number; unblocks?: number }) {
  return (
    <div className="flex flex-wrap items-center gap-2 font-mono text-[11px] text-ink-muted">
      <span>touches {touches} {touches === 1 ? "fact" : "facts"}</span>
      {unblocks && unblocks > 0 ? (
        <>
          <span className="text-ink-soft">·</span>
          <span>unblocks {unblocks} {unblocks === 1 ? "question" : "questions"}</span>
        </>
      ) : null}
    </div>
  );
}