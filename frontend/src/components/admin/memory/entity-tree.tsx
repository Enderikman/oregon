import { useMemo, useState } from "react";
import { FileText, Folder as FolderIcon, FolderOpen as FolderOpenIcon, Search } from "lucide-react";
import type { Entity, EntityType } from "@/lib/types";

interface Props {
  entities: Entity[];
  selectedId: string;
  onSelect: (id: string) => void;
}

const FOLDER_ORDER: EntityType[] = [
  "client",
  "employee",
  "policy",
  "product",
  "project",
  "decision",
];

const FOLDER_LABELS: Record<EntityType, string> = {
  client: "clients",
  employee: "employees",
  policy: "policies",
  product: "products",
  project: "projects",
  decision: "decisions",
};

export function EntityTree({ entities, selectedId, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const grouped = useMemo(() => {
    const q = query.trim().toLowerCase();
    const out: Record<EntityType, Entity[]> = {
      client: [],
      employee: [],
      policy: [],
      product: [],
      project: [],
      decision: [],
    };
    for (const e of entities) {
      if (q && !e.name.toLowerCase().includes(q)) continue;
      out[e.type].push(e);
    }
    for (const t of FOLDER_ORDER) {
      out[t].sort((a, b) => a.name.localeCompare(b.name));
    }
    return out;
  }, [entities, query]);

  const isSearching = query.trim().length > 0;
  const allEmpty = FOLDER_ORDER.every((t) => grouped[t].length === 0);

  return (
    <div className="flex flex-col">
      <div className="relative mb-3">
        <Search
          size={12}
          className="pointer-events-none absolute left-2.5 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search entities…"
          className="w-full rounded-[8px] border border-border bg-background py-1.5 pl-7 pr-2 text-[12px] text-ink outline-none placeholder:text-ink-soft focus:border-[color:var(--accent)]"
        />
      </div>

      <nav className="space-y-1">
        {FOLDER_ORDER.map((type) => {
          const list = grouped[type];
          if (list.length === 0) return null;
          return (
            <FolderGroup
              key={type}
              label={FOLDER_LABELS[type]}
              count={list.length}
              defaultOpen={isSearching || list.some((e) => e.id === selectedId)}
            >
              <ul className="ml-4 mt-0.5 space-y-px border-l border-border pl-2">
                {list.map((e) => {
                  const active = e.id === selectedId;
                  return (
                    <li key={e.id}>
                      <button
                        type="button"
                        onClick={() => onSelect(e.id)}
                        className={`flex w-full items-center gap-1.5 rounded-md px-1.5 py-1 text-left font-mono text-[11px] transition-colors ${
                          active
                            ? "bg-[color:var(--accent-soft)] text-ink"
                            : "text-ink-muted hover:bg-surface-2 hover:text-ink"
                        }`}
                      >
                        <FileText size={11} className="shrink-0 opacity-70" />
                        <span className="truncate">{e.name}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </FolderGroup>
          );
        })}
        {allEmpty && (
          <p className="px-2 py-4 text-center text-[11px] italic text-ink-soft">
            No entities match "{query}".
          </p>
        )}
      </nav>
    </div>
  );
}

function FolderGroup({
  label,
  count,
  defaultOpen,
  children,
}: {
  label: string;
  count: number;
  defaultOpen: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between rounded-md px-1.5 py-1 text-left text-ink-muted hover:bg-surface-2 hover:text-ink"
      >
        <span className="flex items-center gap-1.5">
          {open ? (
            <FolderOpenIcon size={12} className="text-ink-soft" />
          ) : (
            <FolderIcon size={12} className="text-ink-soft" />
          )}
          <span className="font-mono text-[11px]">{label}/</span>
        </span>
        <span className="font-mono text-[10px] text-ink-soft">{count}</span>
      </button>
      {open && children}
    </div>
  );
}
