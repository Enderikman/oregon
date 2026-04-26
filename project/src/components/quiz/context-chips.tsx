import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Braces, Search, X } from "lucide-react";

type Props = {
  data?: Record<string, unknown>;
  inlineLimit?: number;
};

function previewValue(v: unknown): string {
  if (v === null) return "null";
  if (v === undefined) return "—";
  if (typeof v === "string") return v.length > 32 ? v.slice(0, 30) + "…" : v;
  if (typeof v === "number" || typeof v === "boolean") return String(v);
  if (Array.isArray(v)) return `[${v.length}]`;
  if (typeof v === "object") return `{${Object.keys(v as object).length}}`;
  return String(v);
}

function humanizeKey(k: string): string {
  return k.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function ContextChips({ data, inlineLimit = 4 }: Props) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const entries = useMemo(() => Object.entries(data ?? {}), [data]);
  const inline = useMemo(() => {
    const scalars = entries.filter(([, v]) => typeof v !== "object" || v === null);
    return scalars.slice(0, inlineLimit);
  }, [entries, inlineLimit]);

  const hiddenCount = entries.length - inline.length;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  if (!data || entries.length === 0) return null;

  return (
    <>
      <div className="flex flex-wrap gap-1.5">
        {inline.map(([k, v]) => (
          <button
            key={k}
            type="button"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="group inline-flex items-center gap-1.5 max-w-full px-2 py-1 rounded-md bg-secondary/70 border border-border text-[11px] hover:border-primary/40 hover:bg-secondary transition"
            title={`${k}: ${String(v)}`}
          >
            <span className="text-muted-foreground/70 uppercase tracking-wider text-[9px] font-mono">
              {humanizeKey(k)}
            </span>
            <span className="text-foreground font-medium truncate max-w-[160px]">
              {previewValue(v)}
            </span>
          </button>
        ))}
        {hiddenCount > 0 && (
          <button
            type="button"
            onPointerDownCapture={(e) => e.stopPropagation()}
            onClick={(e) => {
              e.stopPropagation();
              setOpen(true);
            }}
            className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-foreground/5 border border-dashed border-border text-[11px] text-muted-foreground hover:text-foreground hover:border-primary/40 transition"
          >
            <Braces className="w-3 h-3" />+{hiddenCount} more
          </button>
        )}
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-sm flex items-stretch sm:items-center justify-center p-0 sm:p-4"
            onClick={() => setOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.96, y: 12 }}
              transition={{ type: "spring", damping: 24, stiffness: 240 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full sm:w-auto sm:max-w-[1400px] h-full sm:h-auto sm:max-h-[92vh] flex flex-col bg-card border border-border sm:rounded-2xl shadow-soft overflow-hidden"
            >
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border">
                <Braces className="w-4 h-4 text-muted-foreground" />
                <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground font-medium font-mono">
                  Context data
                </div>
                <div className="ml-auto flex items-center gap-2">
                  <div className="relative">
                    <Search className="absolute left-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
                    <input
                      autoFocus
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                      placeholder="Filter…"
                      className="pl-7 pr-2 py-1.5 text-xs rounded-md bg-secondary border border-border outline-none focus:ring-2 focus:ring-ring/30 w-32 sm:w-72"
                    />
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-1.5 rounded-md hover:bg-muted text-muted-foreground"
                    aria-label="Close"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex-1 overflow-auto no-scrollbar p-3 sm:p-6 font-mono text-xs sm:text-sm">
                <JsonTree value={data} filter={query.trim().toLowerCase()} />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

function JsonTree({
  value,
  filter,
  depth = 0,
}: {
  value: unknown;
  filter: string;
  depth?: number;
}) {
  if (value === null) return <span className="text-muted-foreground">null</span>;
  if (typeof value === "string")
    return <span className="text-[var(--swipe-yes)] break-all">"{value}"</span>;
  if (typeof value === "number") return <span className="text-primary">{value}</span>;
  if (typeof value === "boolean") return <span className="text-warning">{String(value)}</span>;
  if (Array.isArray(value)) {
    return (
      <div className={depth === 0 ? "" : "pl-4 border-l border-border/60"}>
        <span className="text-muted-foreground">[</span>
        {value.map((v, i) => (
          <div key={i} className="pl-4">
            <span className="text-muted-foreground/70 mr-2">{i}:</span>
            <JsonTree value={v} filter={filter} depth={depth + 1} />
          </div>
        ))}
        <span className="text-muted-foreground">]</span>
      </div>
    );
  }
  if (typeof value === "object") {
    const obj = value as Record<string, unknown>;
    const keys = Object.keys(obj).filter((k) =>
      filter
        ? k.toLowerCase().includes(filter) ||
          JSON.stringify(obj[k]).toLowerCase().includes(filter)
        : true,
    );
    return (
      <div className={depth === 0 ? "space-y-1" : "pl-4 border-l border-border/60 space-y-1"}>
        {keys.length === 0 && (
          <span className="text-muted-foreground italic">no matches</span>
        )}
        {keys.map((k) => (
          <div key={k} className="flex flex-col sm:flex-row sm:gap-2">
            <span className="text-foreground font-medium shrink-0">{k}:</span>
            <div className="min-w-0 flex-1">
              <JsonTree value={obj[k]} filter={filter} depth={depth + 1} />
            </div>
          </div>
        ))}
      </div>
    );
  }
  return <span>{String(value)}</span>;
}
