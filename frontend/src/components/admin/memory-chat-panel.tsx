import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowUpIcon,
  Briefcase,
  HelpCircle,
  Activity,
  ShieldCheck,
  Paperclip,
  PlusIcon,
} from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

type ChatMsg = { id: string; role: "user" | "assistant"; text: string };

const SUGGESTIONS: { label: string; prompt: string; icon: React.ReactNode }[] = [
  { label: "User's role", prompt: "What is this user's role?", icon: <Briefcase className="w-4 h-4" /> },
  { label: "What they own", prompt: "What does the user own?", icon: <ShieldCheck className="w-4 h-4" /> },
  { label: "This week's activity", prompt: "How engaged has the user been this week?", icon: <Activity className="w-4 h-4" /> },
  { label: "Open questions", prompt: "What's the user unsure about right now?", icon: <HelpCircle className="w-4 h-4" /> },
];

function useAutoResizeTextarea({ minHeight, maxHeight }: { minHeight: number; maxHeight?: number }) {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const adjustHeight = useCallback(
    (reset?: boolean) => {
      const ta = textareaRef.current;
      if (!ta) return;
      if (reset) {
        ta.style.height = `${minHeight}px`;
        return;
      }
      ta.style.height = `${minHeight}px`;
      const newHeight = Math.max(minHeight, Math.min(ta.scrollHeight, maxHeight ?? Number.POSITIVE_INFINITY));
      ta.style.height = `${newHeight}px`;
    },
    [minHeight, maxHeight],
  );
  useEffect(() => {
    if (textareaRef.current) textareaRef.current.style.height = `${minHeight}px`;
  }, [minHeight]);
  useEffect(() => {
    const onResize = () => adjustHeight();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [adjustHeight]);
  return { textareaRef, adjustHeight };
}

export function MemoryChatPanel() {
  const [value, setValue] = useState("");
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [pending, setPending] = useState(false);
  const convIdRef = useRef<string | null>(null);
  const idRef = useRef(0);
  const endRef = useRef<HTMLDivElement>(null);
  const { textareaRef, adjustHeight } = useAutoResizeTextarea({ minHeight: 60, maxHeight: 200 });

  const nextId = () => `m-${++idRef.current}`;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, pending]);

  const submit = async (raw: string) => {
    const text = raw.trim();
    if (!text || pending) return;
    setMessages((m) => [...m, { id: nextId(), role: "user", text }]);
    setValue("");
    adjustHeight(true);
    setPending(true);
    try {
      const res = await fetch(`${API_BASE}/api/v1/admin/memory/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: text, conversationId: convIdRef.current }),
      });
      const data = await res.json();
      convIdRef.current = data.conversationId;
      setMessages((m) => [...m, { id: nextId(), role: "assistant", text: data.reply }]);
    } catch {
      setMessages((m) => [...m, { id: nextId(), role: "assistant", text: "Failed to reach the backend. Is the server running?" }]);
    } finally {
      setPending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit(value);
    }
  };

  const isEmpty = messages.length === 0;
  const canSend = value.trim().length > 0 && !pending;

  return (
    <div className="flex flex-col items-center w-full">
      <h2 className="text-[20px] sm:text-[22px] font-normal text-ink text-center mb-6">
        What do you want to know about this user?
      </h2>

      {/* Transcript (only when there are messages) */}
      {!isEmpty && (
        <div
          role="log"
          aria-live="polite"
          className="w-full max-h-[360px] overflow-y-auto mb-4 space-y-3"
        >
          {messages.map((m) =>
            m.role === "user" ? (
              <div key={m.id} className="flex justify-end">
                <div
                  className="max-w-[78%] whitespace-pre-line rounded-[12px] px-3.5 py-2 text-[13.5px] text-ink"
                  style={{ backgroundColor: "var(--accent-soft)" }}
                >
                  {m.text}
                </div>
              </div>
            ) : (
              <div key={m.id} className="flex items-start gap-2">
                <span
                  aria-hidden
                  className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-white"
                  style={{ backgroundColor: "var(--accent)" }}
                >
                  Q
                </span>
                <div className="max-w-[78%] whitespace-pre-line rounded-[12px] border border-border bg-surface-2 px-3.5 py-2 text-[13.5px] text-ink">
                  {m.text}
                </div>
              </div>
            ),
          )}
          {pending && (
            <div className="flex items-start gap-2">
              <span
                aria-hidden
                className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-mono text-[10px] text-white"
                style={{ backgroundColor: "var(--accent)" }}
              >
                Q
              </span>
              <div className="rounded-[12px] border border-border bg-surface-2 px-3.5 py-2.5">
                <span className="inline-flex items-center gap-1">
                  <Dot delay={0} />
                  <Dot delay={150} />
                  <Dot delay={300} />
                </span>
              </div>
            </div>
          )}
          <div ref={endRef} />
        </div>
      )}

      {/* Composer card */}
      <div className="w-full bg-surface-2 rounded-[14px] border border-border shadow-soft">
        <div className="overflow-y-auto">
          <Textarea
            ref={textareaRef}
            value={value}
            onChange={(e) => {
              setValue(e.target.value);
              adjustHeight();
            }}
            onKeyDown={handleKeyDown}
            placeholder="Ask about role, ownership, activity…"
            className={cn(
              "w-full px-4 py-3",
              "resize-none bg-transparent border-none",
              "text-ink text-sm",
              "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
              "placeholder:text-ink-soft placeholder:text-sm",
              "min-h-[60px]",
            )}
            style={{ overflow: "hidden" }}
          />
        </div>

        <div className="flex items-center justify-between p-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="group p-2 hover:bg-surface rounded-lg transition-colors flex items-center gap-1 text-ink-muted"
            >
              <Paperclip className="w-4 h-4" />
              <span className="text-xs hidden group-hover:inline transition-opacity">
                Attach
              </span>
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              className="px-2 py-1 rounded-lg text-sm text-ink-muted transition-colors border border-dashed border-border hover:border-ink-soft hover:bg-surface flex items-center justify-between gap-1"
            >
              <PlusIcon className="w-4 h-4" />
              Context
            </button>
            <button
              type="button"
              onClick={() => submit(value)}
              disabled={!canSend}
              aria-label="Send"
              className={cn(
                "px-1.5 py-1.5 rounded-lg text-sm transition-colors border flex items-center justify-center gap-1",
                canSend
                  ? "border-transparent text-white"
                  : "border-border text-ink-soft",
              )}
              style={canSend ? { backgroundColor: "var(--accent)" } : undefined}
            >
              <ArrowUpIcon className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Suggested actions */}
      <div className="flex flex-wrap items-center justify-center gap-2 mt-4">
        {SUGGESTIONS.map((s) => (
          <button
            key={s.label}
            type="button"
            onClick={() => submit(s.prompt)}
            disabled={pending}
            className="flex items-center gap-2 px-3.5 py-2 bg-surface-2 hover:bg-surface rounded-full border border-border text-ink-muted hover:text-ink transition-colors disabled:opacity-50"
          >
            {s.icon}
            <span className="text-xs">{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function Dot({ delay }: { delay: number }) {
  return (
    <span
      className="block h-1.5 w-1.5 rounded-full bg-ink-soft"
      style={{ animation: "pulse 1.2s ease-in-out infinite", animationDelay: `${delay}ms` }}
    />
  );
}
