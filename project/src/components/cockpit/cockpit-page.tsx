import { useMemo, useState } from "react";
import { useMemoryStore } from "@/lib/memory-context";
import { greeting } from "@/lib/format";
import { api } from "@/lib/api";
import { AIQuestionCard } from "@/components/questions/ai-question-card";
import { EmptyZen } from "@/components/shared/empty-zen";
import type { QuestionType } from "@/lib/types";
import { ResolveQueuePanel } from "./resolve-queue-panel";
import finaleLandscape from "@/assets/finale-landscape.jpg";

const filters: Array<{ key: "all" | QuestionType; label: string }> = [
  { key: "all", label: "All" },
  { key: "disambiguation", label: "Disambiguation" },
  { key: "conflict", label: "Conflicts" },
  { key: "gap", label: "Gaps" },
  { key: "low_confidence", label: "Low confidence" },
];

export function CockpitPage() {
  const { questions } = useMemoryStore();
  const user = api.getCurrentUser();
  const [filter, setFilter] = useState<"all" | QuestionType>("all");

  const totalOpen = useMemo(
    () => questions.filter((q) => q.status === "open").length,
    [questions],
  );

  const open = useMemo(() => {
    return questions
      .filter((q) => q.status === "open")
      .filter((q) => filter === "all" || q.type === filter)
      .sort((a, b) => {
        const ai = a.affectedFactIds.length + a.unblocksQuestionIds.length * 2;
        const bi = b.affectedFactIds.length + b.unblocksQuestionIds.length * 2;
        return bi - ai;
      });
  }, [questions, filter]);

  if (totalOpen === 0) {
    return (
      <main className="fixed inset-0 overflow-hidden">
        <img
          src={finaleLandscape}
          alt=""
          aria-hidden
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/30 to-black/10" />
        <div className="relative z-10 flex h-full w-full items-end px-6 pb-12 sm:px-12 sm:pb-16">
          <div className="max-w-[640px] text-white">
            <div className="font-mono text-[11px] uppercase tracking-[0.3em] text-white/70">
              All clear
            </div>
            <h1 className="mt-2 text-4xl sm:text-5xl font-light tracking-tight">
              {greeting()}, {user.name.split(" ")[0]}.
            </h1>
            <p className="mt-3 text-sm sm:text-base text-white/80 max-w-md">
              The AI has no questions for you. The memory is current.
            </p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[980px] px-6 py-10">
      <header className="mb-8">
        <h1 className="text-[26px] font-normal text-ink">
          {greeting()}, {user.name.split(" ")[0]}.
        </h1>
        <p className="mt-1 text-[14px] text-ink-muted">
          The AI is asking you to teach it where it's unsure.
        </p>
      </header>

      <section className="mt-10" aria-label="Today's queue">
        {totalOpen > 0 && (
          <ResolveQueuePanel count={totalOpen} />
        )}
        <div className="mb-4 flex items-center justify-between">
          <div className="font-mono text-[11px] uppercase tracking-wide text-ink-soft">
            Today's queue
          </div>
          <div className="flex flex-wrap gap-1">
            {filters.map((f) => {
              const active = filter === f.key;
              return (
                <button
                  key={f.key}
                  onClick={() => setFilter(f.key)}
                  className={`rounded-full px-3 py-1 text-[12px] transition-colors ${active ? "text-ink" : "text-ink-muted hover:text-ink"}`}
                  style={active ? { backgroundColor: "var(--accent-soft)", color: "var(--accent-ink)" } : undefined}
                >
                  {f.label}
                </button>
              );
            })}
          </div>
        </div>

        {open.length === 0 ? (
          <EmptyZen />
        ) : (
          <div className="space-y-3">
            {open.map((q) => (
              <AIQuestionCard key={q.id} q={q} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
}