import { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUp, Command, Loader2, X } from "lucide-react";
import { useClarify } from "@/hooks/use-clarify";
import type { Question } from "@/lib/quiz-types";
import { AIDraftButton } from "./ai-draft-button";

type Props = {
  question: Question;
  open: boolean;
  onClose: () => void;
};

const SUGGESTIONS = [
  { icon: "?", label: "What does this actually mean?" },
  { icon: "*", label: "Why should I care?" },
  { icon: "!", label: "Give me a concrete example" },
  { icon: "=", label: "What are the tradeoffs?" },
  { icon: "/", label: "Break this down step by step" },
  { icon: "~", label: "What would change my answer?" },
];

const COLORS = [
  { bg: "#FEF3B0", text: "#1f1700", rot: -2 },
  { bg: "#C8F0D8", text: "#062b18", rot: 1.5 },
  { bg: "#FFD0CD", text: "#3a0a08", rot: -1 },
  { bg: "#CFE0FF", text: "#0a1d40", rot: 1.8 },
];

const SLOTS = [
  { top: "8%", left: "2%" },
  { top: "8%", right: "2%" },
  { bottom: "20%", left: "2%" },
  { bottom: "20%", right: "2%" },
  { top: "44%", left: "1%" },
  { top: "44%", right: "1%" },
];

function useIsMobile() {
  const [mobile, setMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setMobile(mq.matches);
    setMobile(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return mobile;
}

export function AIWindow({ question, open, onClose }: Props) {
  const { messages, loading, error, send, reset } = useClarify(question);
  const [input, setInput] = useState("");
  const [highlight, setHighlight] = useState(0);
  const [dismissed, setDismissed] = useState<Set<number>>(new Set());
  const inputRef = useRef<HTMLInputElement>(null);
  const isMobile = useIsMobile();

  useEffect(() => {
    reset();
    setInput("");
    setHighlight(0);
    setDismissed(new Set());
  }, [question.id, reset]);

  useEffect(() => {
    if (!open) {
      setInput("");
      setHighlight(0);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      const t = e.target as HTMLElement | null;
      if (t && (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)) {
        return;
      }
      if (!input) {
        if (e.key === "ArrowDown") {
          e.preventDefault();
          setHighlight((h) => (h + 1) % SUGGESTIONS.length);
        } else if (e.key === "ArrowUp") {
          e.preventDefault();
          setHighlight((h) => (h - 1 + SUGGESTIONS.length) % SUGGESTIONS.length);
        } else if (e.key === "Enter") {
          e.preventDefault();
          send(SUGGESTIONS[highlight].label);
        }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose, input, highlight, send]);

  const pairs = useMemo(() => {
    const out: { q: string; a: string }[] = [];
    for (let i = 0; i < messages.length; i++) {
      if (messages[i].role === "user") {
        const a = messages[i + 1]?.role === "assistant" ? messages[i + 1].content : "";
        out.push({ q: messages[i].content, a });
      }
    }
    return out;
  }, [messages]);

  const visible = pairs.map((p, i) => ({ ...p, i })).filter((p) => !dismissed.has(p.i));

  const renderNote = (p: { i: number; q: string; a: string }, rotate?: number) => {
    const color = COLORS[p.i % COLORS.length];
    const isStreaming = !p.a && loading && p.i === pairs.length - 1;
    return (
      <motion.div
        key={p.i}
        initial={{ scale: 0.6, opacity: 0, rotate: 0, y: -10 }}
        animate={{ scale: 1, opacity: 1, rotate: rotate ?? color.rot, y: 0 }}
        exit={{ scale: 0.7, opacity: 0, y: 30 }}
        transition={{ type: "spring", damping: 16 }}
        style={{
          backgroundColor: color.bg,
          color: color.text,
          boxShadow:
            "0 18px 36px -14px rgba(0,0,0,0.45), 0 4px 8px rgba(0,0,0,0.12), inset 0 -1px 0 rgba(0,0,0,0.06)",
          backgroundImage:
            "radial-gradient(circle at 0 0, rgba(255,255,255,0.5) 0%, transparent 40%), repeating-linear-gradient(0deg, transparent 0 22px, rgba(0,0,0,0.04) 22px 23px)",
        }}
        className="pointer-events-auto w-full sm:w-[270px] pt-4 pb-4 px-4 rounded-[3px] relative font-sans overflow-hidden"
      >
        <button
          onClick={() => setDismissed((s) => new Set(s).add(p.i))}
          className="absolute top-1.5 right-1.5 p-1 rounded-full hover:bg-black/10 active:bg-black/15 transition"
          aria-label="Dismiss note"
        >
          <X className="w-3.5 h-3.5" />
        </button>

        <div className="text-[12px] font-semibold leading-snug mb-2 pr-6 opacity-80">{p.q}</div>
        <div className="h-px w-full mb-2.5 bg-current opacity-15" />
        <div className="text-[14.5px] leading-relaxed font-medium break-words pl-0.5 whitespace-pre-wrap">
          {p.a}
          {isStreaming && <span className="opacity-60 italic text-xs">thinking…</span>}
        </div>
      </motion.div>
    );
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-30 bg-foreground/20 sm:bg-foreground/10"
            onClick={onClose}
          />

          {!isMobile ? (
            <div className="fixed inset-0 z-40 pointer-events-none">
              {visible.slice(0, SLOTS.length).map((p, idx) => (
                <div key={p.i} style={{ position: "absolute", ...SLOTS[idx] }}>
                  {renderNote(p)}
                </div>
              ))}
              {visible.length > SLOTS.length && (
                <div className="absolute bottom-32 left-1/2 -translate-x-1/2 text-[10px] uppercase tracking-widest text-muted-foreground bg-card/80 backdrop-blur px-3 py-1 rounded-full pointer-events-auto font-mono">
                  +{visible.length - SLOTS.length} more — dismiss to see
                </div>
              )}
            </div>
          ) : (
            visible.length > 0 && (
              <div
                className="fixed left-0 right-0 z-40 px-3 pointer-events-none flex flex-col gap-3 overflow-y-auto"
                style={{ top: "5vh", bottom: "calc(var(--palette-h, 280px) + 1rem)" }}
              >
                {visible.map((p) => renderNote(p, 0))}
              </div>
            )
          )}

          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 30, opacity: 0 }}
            className="fixed bottom-0 sm:bottom-6 left-0 sm:left-1/2 right-0 sm:right-auto sm:-translate-x-1/2 z-50 sm:w-[min(560px,calc(100vw-2rem))]"
          >
            <div className="bg-card border border-border sm:rounded-2xl rounded-t-2xl shadow-soft overflow-hidden max-h-[85vh] flex flex-col">
              {!input && (
                <div className="py-2 border-b border-border">
                  <div className="px-4 py-1 text-[10px] uppercase tracking-[0.2em] text-muted-foreground flex items-center justify-between font-mono">
                    <span className="hidden sm:inline">Quick prompts · ↑↓ ↵</span>
                    <span className="sm:hidden">Quick prompts</span>
                    {pairs.length > 0 && (
                      <span className="text-primary normal-case tracking-normal">
                        {pairs.length} pinned
                      </span>
                    )}
                  </div>
                  <div className="max-h-[40vh] overflow-y-auto">
                    {SUGGESTIONS.map((s, i) => {
                      const color = COLORS[i % COLORS.length];
                      return (
                        <button
                          key={s.label}
                          onMouseEnter={() => setHighlight(i)}
                          onClick={() => send(s.label)}
                          className={
                            "w-full flex items-center gap-3 px-4 py-3 sm:py-2.5 text-left text-sm transition " +
                            (i === highlight
                              ? "bg-muted/80 text-foreground"
                              : "text-foreground/80 hover:bg-muted/40 active:bg-muted/60")
                          }
                        >
                          <span
                            className="w-7 h-7 sm:w-6 sm:h-6 flex items-center justify-center rounded text-base shrink-0 font-mono"
                            style={{ backgroundColor: color.bg, color: color.text }}
                          >
                            {s.icon}
                          </span>
                          <span className="flex-1">{s.label}</span>
                          {i === highlight && (
                            <span className="hidden sm:inline text-[10px] uppercase tracking-widest text-primary font-mono">
                              ↵
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const text = input.trim();
                  if (!text) return;
                  setInput("");
                  await send(text);
                }}
                className="flex items-center gap-2 px-4 py-3"
              >
                <Command className="w-4 h-4 text-muted-foreground shrink-0" />
                <input
                  ref={inputRef}
                  autoFocus={!isMobile}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && !e.nativeEvent.isComposing) {
                      e.preventDefault();
                      e.stopPropagation();
                      const text = input.trim();
                      if (!text || loading) return;
                      setInput("");
                      send(text);
                    }
                  }}
                  placeholder="Pin a custom note…"
                  className="flex-1 bg-transparent outline-none text-sm min-w-0"
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
                  className="p-1.5 rounded-lg bg-primary text-primary-foreground disabled:opacity-30 hover:opacity-90 transition shrink-0"
                >
                  {loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <ArrowUp className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={onClose}
                  className="sm:hidden p-1.5 rounded-lg text-muted-foreground hover:bg-muted transition shrink-0"
                  aria-label="Close"
                >
                  <X className="w-4 h-4" />
                </button>
              </form>
              {error && (
                <div className="text-xs text-destructive text-center pb-2 px-4">{error}</div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
