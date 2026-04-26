import { useCallback, useEffect, useState } from "react";
import { memoryApi, type MemoryTreeEntry, type MemoryPage } from "@/lib/api";
import { EntityTree } from "./entity-tree";
import { EntityDetail } from "./entity-detail";
import { BacklinksPanel } from "./backlinks-panel";

export function MemoryBrowserPage() {
  const [tree, setTree] = useState<MemoryTreeEntry[]>([]);
  const [page, setPage] = useState<MemoryPage | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    memoryApi
      .fetchTree()
      .then((entries) => {
        setTree(entries);
        if (entries.length > 0) setSelectedId(entries[0].id);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedId) return;
    setPage(null);
    memoryApi
      .fetchPage(selectedId)
      .then(setPage)
      .catch((e) => setError(e.message));
  }, [selectedId]);

  const handleSelectEntity = useCallback((id: string) => {
    setSelectedId(id);
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-12 text-center text-ink-muted">
        Loading entities...
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-[1200px] px-6 py-12 text-center text-ink-muted">
        <p>Error: {error}</p>
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
          Browse the knowledge graph — every entity links to related pages.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[240px_minmax(0,1fr)_320px]">
        <div className="self-start lg:sticky lg:top-4">
          <div className="rounded-[14px] border border-border bg-surface p-3 shadow-soft">
            <EntityTree
              entries={tree}
              selectedId={selectedId ?? ""}
              onSelect={handleSelectEntity}
            />
          </div>
        </div>

        <div>
          {page ? (
            <EntityDetail page={page} onSelectEntity={handleSelectEntity} tree={tree} />
          ) : (
            <div className="rounded-[14px] border border-border bg-surface p-6 text-center text-[13px] text-ink-muted shadow-soft">
              Select an entity to view its page.
            </div>
          )}
        </div>

        <div className="self-start lg:sticky lg:top-4">
          {page ? (
            <BacklinksPanel
              backlinks={page.backlinks}
              onSelectEntity={handleSelectEntity}
            />
          ) : null}
        </div>
      </div>
    </main>
  );
}
