import type { MemoryBacklink } from "@/lib/api";

interface Props {
  backlinks: MemoryBacklink[];
  onSelectEntity: (id: string) => void;
}

export function BacklinksPanel({ backlinks, onSelectEntity }: Props) {
  return (
    <aside>
      <section className="rounded-[14px] border border-border bg-surface p-4 shadow-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Mentioned by ({backlinks.length})
        </div>
        {backlinks.length === 0 ? (
          <p className="mt-2 text-[12px] italic text-ink-soft">
            Nothing links here yet.
          </p>
        ) : (
          <ul className="mt-2 space-y-1">
            {backlinks.map((b) => (
              <li key={b.id}>
                <button
                  type="button"
                  onClick={() => onSelectEntity(b.id)}
                  className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-[12px] text-ink hover:bg-surface-2"
                >
                  <span className="truncate">{b.name ?? b.id}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                    {b.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
