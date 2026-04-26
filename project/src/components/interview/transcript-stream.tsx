import { useEffect, useRef } from "react";

export interface TranscriptEntry {
  id: string;
  speaker: "agent" | "you";
  text: string;
  ts: number;
}

interface Props {
  entries: TranscriptEntry[];
  interim?: string;
}

function relTime(ts: number) {
  const d = new Date(ts);
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

export function TranscriptStream({ entries, interim }: Props) {
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [entries.length, interim]);

  return (
    <div className="flex h-full flex-col rounded-[18px] border border-border bg-surface">
      <div className="flex items-center justify-between border-b border-border px-5 py-3">
        <span className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
          Live transcript
        </span>
        <span className="font-mono text-[11px] text-ink-soft">
          {entries.length} {entries.length === 1 ? "turn" : "turns"}
        </span>
      </div>

      <div className="flex-1 overflow-y-auto px-5 py-4">
        {entries.length === 0 && !interim && (
          <div className="grid h-full place-items-center text-center text-[12px] text-ink-soft">
            The transcript will appear here as you speak.
          </div>
        )}
        <ul className="space-y-3">
          {entries.map((e) => (
            <li key={e.id} className="flex gap-3">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{
                  backgroundColor:
                    e.speaker === "agent" ? "var(--accent)" : "var(--ink)",
                }}
              />
              <div className="min-w-0 flex-1">
                <div className="flex items-baseline gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                    {e.speaker === "agent" ? "Agent" : "You"}
                  </span>
                  <span className="font-mono text-[10px] text-ink-soft">
                    {relTime(e.ts)}
                  </span>
                </div>
                <p className="mt-0.5 text-[13px] leading-snug text-ink">{e.text}</p>
              </div>
            </li>
          ))}
          {interim && (
            <li className="flex gap-3 opacity-70">
              <span
                className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: "var(--ink-soft)" }}
              />
              <div className="min-w-0 flex-1">
                <div className="font-mono text-[10px] uppercase tracking-wide text-ink-soft">
                  You · interim
                </div>
                <p className="mt-0.5 text-[13px] italic leading-snug text-ink-muted">
                  {interim}
                </p>
              </div>
            </li>
          )}
        </ul>
        <div ref={endRef} />
      </div>
    </div>
  );
}