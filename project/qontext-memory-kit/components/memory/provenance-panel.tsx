import { useMemo } from "react";
import { FileText, Mic, Layers, ExternalLink } from "lucide-react";
import type { Entity, Fact, Source } from "@/lib/types";
import {
  adminInterviews,
  factInterviewIndex,
  type AdminInterview,
} from "@/lib/mock-data";

interface Props {
  entity: Entity;
  entityFacts: Fact[];
  sources: Source[];
  allEntities: Entity[];
  focus: { kind: "source" | "interview"; id: string } | null;
  onSelectEntity: (id: string) => void;
  onOpenInterview: (interviewId: string) => void;
}

export function ProvenancePanel({
  entity,
  entityFacts,
  sources,
  allEntities,
  focus,
  onSelectEntity,
  onOpenInterview,
}: Props) {
  // Backlinks
  const backlinks = useMemo(
    () =>
      entity.backlinks
        .map((id) => allEntities.find((e) => e.id === id))
        .filter((e): e is Entity => Boolean(e)),
    [entity, allEntities],
  );

  // Aggregate sources + interviews from this entity's facts
  const { linkedSources, linkedInterviews } = useMemo(() => {
    const srcIds = new Set<string>();
    const ivIds = new Set<string>();
    for (const f of entityFacts) {
      srcIds.add(f.sourceId);
      for (const id of factInterviewIndex[f.id] ?? []) ivIds.add(id);
    }
    return {
      linkedSources: Array.from(srcIds)
        .map((id) => sources.find((s) => s.id === id))
        .filter((s): s is Source => Boolean(s)),
      linkedInterviews: Array.from(ivIds)
        .map((id) => adminInterviews.find((i) => i.id === id))
        .filter((i): i is AdminInterview => Boolean(i)),
    };
  }, [entityFacts, sources]);

  return (
    <aside className="space-y-4">
      {/* Backlinks */}
      <section className="rounded-[14px] border border-border bg-surface p-4 shadow-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Backlinks ({backlinks.length})
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
                  <span className="truncate">{b.name}</span>
                  <span className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                    {b.type}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Provenance */}
      <section className="rounded-[14px] border border-border bg-surface p-4 shadow-soft">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Provenance
        </div>
        <p className="mt-1.5 text-[11px] text-ink-soft">
          Every fact above traces to one of these.
        </p>

        {/* Sources */}
        <div className="mt-3">
          <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Source records ({linkedSources.length})
          </div>
          {linkedSources.length === 0 ? (
            <p className="mt-1 text-[11px] italic text-ink-soft">None.</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5">
              {linkedSources.map((s) => {
                const active =
                  focus?.kind === "source" && focus.id === s.id;
                return (
                  <li
                    key={s.id}
                    className="rounded-[10px] border bg-background p-2.5 transition-colors"
                    style={{
                      borderColor: active
                        ? "var(--accent)"
                        : "var(--border)",
                      backgroundColor: active
                        ? "var(--accent-soft)"
                        : undefined,
                    }}
                  >
                    <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                      <FileText size={10} />
                      <span>{s.kind.replace("_", " ")}</span>
                      <span className="ml-auto truncate normal-case lowercase">
                        {s.id}
                      </span>
                    </div>
                    <div className="mt-1 text-[12px] text-ink">{s.label}</div>
                    <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-ink-muted">
                      “{s.excerpt}”
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Interviews */}
        <div className="mt-4">
          <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
            Interviews ({linkedInterviews.length})
          </div>
          {linkedInterviews.length === 0 ? (
            <p className="mt-1 text-[11px] italic text-ink-soft">None.</p>
          ) : (
            <ul className="mt-1.5 space-y-1.5">
              {linkedInterviews.map((iv) => {
                const active =
                  focus?.kind === "interview" && focus.id === iv.id;
                const Icon = iv.mode === "voice" ? Mic : Layers;
                return (
                  <li
                    key={iv.id}
                    className="rounded-[10px] border p-2.5 transition-colors"
                    style={{
                      borderColor: active ? "var(--accent)" : "var(--border)",
                      backgroundColor: active
                        ? "var(--accent-soft)"
                        : "var(--background)",
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className="grid h-7 w-7 shrink-0 place-items-center rounded-full font-mono text-[10px]"
                        style={{
                          backgroundColor: "var(--surface-2)",
                          color: "var(--ink)",
                        }}
                      >
                        {iv.interviewee.initials}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-[12px] text-ink">
                          {iv.interviewee.name}
                        </div>
                        <div className="font-mono text-[9px] uppercase tracking-wider text-ink-soft">
                          {iv.id}
                        </div>
                      </div>
                      <span
                        className="inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-wide"
                        style={{
                          backgroundColor:
                            iv.mode === "voice"
                              ? "var(--accent-soft)"
                              : "var(--surface-2)",
                          color:
                            iv.mode === "voice"
                              ? "var(--accent-ink)"
                              : "var(--ink-muted)",
                        }}
                      >
                        <Icon size={9} />
                        {iv.mode === "voice" ? "voice" : "swipe"}
                      </span>
                    </div>
                    <div className="mt-1.5 text-[11px] text-ink-muted">
                      {iv.topic}
                    </div>
                    <button
                      type="button"
                      onClick={() => onOpenInterview(iv.id)}
                      className="mt-2 inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-ink hover:text-[color:var(--accent-ink)]"
                    >
                      Open transcript
                      <ExternalLink size={9} />
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>
    </aside>
  );
}
