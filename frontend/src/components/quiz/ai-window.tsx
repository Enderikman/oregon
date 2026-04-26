import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Loader2, Sparkles } from "lucide-react";
import { useSharedClarify } from "@/hooks/use-clarify";
import type { Question } from "@/lib/quiz-types";
import { AIDraftButton } from "./ai-draft-button";

type Props = {
  question: Question;
  open: boolean;
  onClose: () => void;
};

const SUGGESTIONS = [
  "Why does this matter?",
  "Give me an example",
  "What's the catch?",
  "Explain like I'm new",
];

export function AIWindow({ question, open, onClose }: Props) {
  const { messages, loading, error, send } = useSharedClarify(question);
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) return;
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, [open, loading, messages.length]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, loading]);

  const submit = () => {
    const text = input.trim();
    if (!text || loading) return;
    send(text);
    setInput("");
    requestAnimationFrame(() => inputRef.current?.focus());
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 40, opacity: 0 }}
          transition={{ type: "spring", damping: 22, stiffness: 220 }}
          className="fixed bottom-0 inset-x-0 z-50 pointer-events-none"
        >
          <div className="max-w-[560px] mx-auto p-3 pointer-events-auto">
            <div className="bg-card/95 backdrop-blur-xl border border-border rounded-2xl shadow-soft overflow-hidden">
              {messages.length > 0 && (
                <div ref={scrollRef} className="max-h-[36vh] overflow-y-auto p-4 space-y-3">
                  {messages.map((m, i) => (
                    <div
                      key={i}
                      className={m.role === "user" ? "flex justify-end" : "flex justify-start"}
                    >
                      <div
                        className={
                          m.role === "user"
                            ? "max-w-[85%] bg-primary text-primary-foreground text-sm rounded-2xl rounded-br-md px-3.5 py-2"
                            : "max-w-[90%] text-sm leading-relaxed text-foreground"
                        }
                      >
                        {m.content || (loading ? "…" : "")}
                      </div>
                    </div>
                  ))}
                  {loading && messages[messages.length - 1]?.role === "user" && (
                    <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                  )}
                  {error && <div className="text-xs text-destructive">{error}</div>}
                </div>
              )}

              {messages.length === 0 && (
                <div className="px-4 pt-3 pb-1 flex gap-1.5 flex-wrap">
                  <div className="w-full text-[10px] uppercase tracking-[0.2em] text-muted-foreground mb-1 flex items-center gap-1 font-mono">
                    <Sparkles className="w-3 h-3" /> Try asking
                  </div>
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-xs px-2.5 py-1 rounded-full border border-border bg-background hover:bg-muted hover:border-primary/40 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              )}

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  submit();
                }}
                className="flex items-center gap-2 p-2 border-t border-border"
              >
                <input
                  ref={inputRef}
                  autoFocus
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about this card…"
                  className="flex-1 bg-transparent text-sm outline-none px-2"
                />
                <AIDraftButton
                  question={question}
                  history={messages}
                  current={input}
                  onDraft={setInput}
                />
                <button
                  type="submit"
                  disabled={!input.trim() || loading}
                  className="p-2 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
              </form>
            </div>
            <p className="text-center text-[10px] uppercase tracking-[0.2em] text-muted-foreground/60 mt-1.5 font-mono">
              esc to close
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
