import { useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useMemoryStore } from "@/lib/memory-context";
import { EntityTree } from "./entity-tree";
import { EntityDetail } from "./entity-detail";
import { ProvenancePanel } from "./provenance-panel";
import { InterviewTranscriptDrawer } from "./interview-transcript-drawer";

type Focus = { kind: "source" | "interview"; id: string } | null;

export function MemoryBrowserPage() {
  const entities = useMemo(() => api.listEntities(), []);
  const sources = useMemo(() => api.listSources(), []);
  const { facts } = useMemoryStore();

  const [entityId, setEntityId] = useState<string>(entities[0]?.id ?? "acme-corp");
  const [focus, setFocus] = useState<Focus>(null);
  const [drawerInterviewId, setDrawerInterviewId] = useState<string | null>(null);

  const entity = useMemo(
    () => entities.find((e) => e.id === entityId) ?? entities[0],
    [entities, entityId],
  );

  const entityFacts = useMemo(
    () => facts.filter((f) => entity?.factIds.includes(f.id)),
    [facts, entity],
  );

  const handleSelectEntity = (id: string) => {
    setEntityId(id);
    setFocus(null);
  };

  const handleFocusChange = (target: { kind: "source" | "interview"; id: string }) => {
    setFocus(target);
    if (target.kind === "interview") {
      setDrawerInterviewId(target.id);
    }
  };

  const handleOpenInterview = (id: string) => {
    setDrawerInterviewId(id);
    setFocus({ kind: "interview", id });
  };

  if (!entity) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-12 text-center text-ink-muted">
        No entities loaded.
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-[1400px] px-6 py-8">
      <header className="mb-6">
        <div className="font-mono text-[10px] uppercase tracking-wider text-ink-soft">
          Admin · Memory
        </div>
        <h1 className="mt-1 text-[26px] font-normal text-ink">Memory browser</h1>
        <p className="mt-1 text-[13px] text-ink-muted">
          Every fact traces back to a source — a record or a person.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        {/* Left — entity tree */}
        <div className="self-start lg:sticky lg:top-4">
          <div className="rounded-[14px] border border-border bg-surface p-3 shadow-soft">
            <EntityTree
              entities={entities}
              selectedId={entity.id}
              onSelect={handleSelectEntity}
            />
          </div>
        </div>

        {/* Middle — entity detail */}
        <div>
          <EntityDetail
            entity={entity}
            facts={entityFacts}
            allEntities={entities}
            focus={focus}
            onFocusChange={handleFocusChange}
            onSelectEntity={handleSelectEntity}
          />
        </div>

        {/* Right — provenance */}
        <div className="self-start lg:sticky lg:top-4">
          <ProvenancePanel
            entity={entity}
            entityFacts={entityFacts}
            sources={sources}
            allEntities={entities}
            focus={focus}
            onSelectEntity={handleSelectEntity}
            onOpenInterview={handleOpenInterview}
          />
        </div>
      </div>

      <InterviewTranscriptDrawer
        interviewId={drawerInterviewId}
        open={Boolean(drawerInterviewId)}
        onOpenChange={(o) => {
          if (!o) setDrawerInterviewId(null);
        }}
      />
    </main>
  );
}
