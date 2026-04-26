import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, Sparkles } from "lucide-react";
import type { ChatMsg } from "@/lib/quiz-types";
import { ContextModal, gist, shortQ, useContextModal } from "./shared";

export function ContextSummaryRail({
  messages,
  loading,
}: {
  messages: ChatMsg[];
  loading?: boolean;
}) {
  const { pairs, open, close, openPair } = useContextModal(messages);
  const [expanded, setExpanded] = useState(true);
  if (pairs.length === 0) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 8 }}
        animate={{ opacity: 1, x: 0 }}
        className="hidden md:block fixed top-1/2 -translate-y-1/2 right-4 z-30 w-[220px]"
        data-stop-clarify
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={() => setExpanded((v) => !v)}
          className="w-full flex items-center justify-between gap-2 px-3 py-2 rounded-t-xl bg-card border border-border border-b-0 text-[10px] uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground transition font-mono"
        >
          <span className="flex items-center gap-1.5">
            <Sparkles className="w-3 h-3" />
            Notes · {pairs.length}
          </span>
          <ChevronDown
            className={`w-3 h-3 transition-transform ${expanded ? "rotate-0" : "-rotate-90"}`}
          />
        </button>
        <AnimatePresence initial={false}>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden bg-card border border-border rounded-b-xl"
            >
              <div className="max-h-[60vh] overflow-y-auto p-2 flex flex-col gap-1.5">
                {pairs.map((p, i) => {
                  const isStreaming = loading && i === pairs.length - 1 && !p.a;
                  return (
                    <button
                      key={i}
                      type="button"
                      onClick={() => open(i)}
                      className="text-left p-2 rounded-md hover:bg-muted/60 transition relative pl-4"
                    >
                      <span
                        className="absolute left-0 top-2 bottom-2 w-[2px] rounded-full bg-primary/60"
                        aria-hidden
                      />
                      <div className="text-[11px] font-semibold text-foreground leading-snug">
                        {shortQ(p.q, 30)}
                      </div>
                      <div className="mt-0.5 text-[11px] leading-snug text-muted-foreground line-clamp-2">
                        {isStreaming ? (
                          <span className="italic opacity-70">thinking…</span>
                        ) : (
                          gist(p.a, 70) || <span className="italic opacity-60">…</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="md:hidden mt-5 flex flex-wrap gap-1.5"
        data-stop-clarify
        onPointerDownCapture={(e) => e.stopPropagation()}
      >
        {pairs.map((p, i) => (
          <button
            key={i}
            type="button"
            onClick={() => open(i)}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-secondary border border-border text-[11px] hover:border-primary/40 transition"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            <span className="text-foreground/90 truncate max-w-[160px]">{shortQ(p.q, 24)}</span>
          </button>
        ))}
      </motion.div>

      <ContextModal pair={openPair} onClose={close} />
    </>
  );
}
