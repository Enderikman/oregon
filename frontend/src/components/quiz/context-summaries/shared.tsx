import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Sparkles, X } from "lucide-react";
import type { ChatMsg } from "@/lib/quiz-types";

export type Pair = { q: string; a: string };

export function pairsFromMessages(messages: ChatMsg[]): Pair[] {
  const out: Pair[] = [];
  for (let i = 0; i < messages.length; i++) {
    if (messages[i].role === "user") {
      const next = messages[i + 1];
      out.push({
        q: messages[i].content,
        a: next?.role === "assistant" ? next.content : "",
      });
    }
  }
  return out;
}

export function gist(text: string, max = 90): string {
  const cleaned = text
    .replace(/^#+\s*/gm, "")
    .replace(/\*\*|__|`/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!cleaned) return "";
  const stop = cleaned.search(/[.!?](\s|$)/);
  const sliced = stop > 0 && stop < max ? cleaned.slice(0, stop + 1) : cleaned;
  return sliced.length > max ? sliced.slice(0, max - 1).trimEnd() + "…" : sliced;
}

export function shortQ(text: string, max = 38): string {
  const t = text.trim().replace(/\s+/g, " ");
  return t.length > max ? t.slice(0, max - 1) + "…" : t;
}

export function ContextModal({ pair, onClose }: { pair: Pair | null; onClose: () => void }) {
  useEffect(() => {
    if (!pair) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [pair, onClose]);

  return (
    <AnimatePresence>
      {pair && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 12 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 12 }}
            transition={{ type: "spring", damping: 24, stiffness: 240 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-[560px] max-h-[85vh] flex flex-col bg-card border border-border rounded-2xl shadow-soft overflow-hidden"
          >
            <div className="flex items-start gap-3 px-5 py-4 border-b border-border">
              <Sparkles className="w-4 h-4 text-primary mt-0.5 shrink-0" />
              <div className="flex-1 text-sm font-semibold text-foreground leading-snug">
                {pair.q}
              </div>
              <button
                onClick={onClose}
                className="p-1 -m-1 rounded-md hover:bg-muted text-muted-foreground"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div
              className="flex-1 overflow-auto px-5 py-4 text-sm leading-relaxed text-foreground
                [&>*:first-child]:mt-0 [&>*:last-child]:mb-0
                [&_p]:my-2 [&_strong]:font-semibold
                [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2
                [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2
                [&_li]:my-1
                [&_code]:px-1 [&_code]:py-0.5 [&_code]:rounded [&_code]:bg-muted [&_code]:font-mono [&_code]:text-[12.5px]
                [&_pre]:bg-muted [&_pre]:p-3 [&_pre]:rounded-lg [&_pre]:my-2 [&_pre]:overflow-x-auto
                [&_blockquote]:border-l-2 [&_blockquote]:border-border [&_blockquote]:pl-3 [&_blockquote]:italic [&_blockquote]:text-muted-foreground
                [&_a]:text-primary [&_a]:underline [&_a]:underline-offset-2"
            >
              {pair.a ? (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    a: ({ node: _node, ...props }) => (
                      <a {...props} target="_blank" rel="noopener noreferrer" />
                    ),
                  }}
                >
                  {pair.a}
                </ReactMarkdown>
              ) : (
                <span className="italic text-muted-foreground">no answer yet</span>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function useContextModal(messages: ChatMsg[]) {
  const pairs = useMemo(() => pairsFromMessages(messages), [messages]);
  const [openIdx, setOpenIdx] = useState<number | null>(null);
  useEffect(() => {
    if (openIdx !== null && openIdx >= pairs.length) setOpenIdx(null);
  }, [openIdx, pairs.length]);
  return {
    pairs,
    openIdx,
    open: (i: number) => setOpenIdx(i),
    close: () => setOpenIdx(null),
    openPair: openIdx !== null ? (pairs[openIdx] ?? null) : null,
  };
}
