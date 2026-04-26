import { useCallback, useRef, useState } from "react";
import { aiEndpoints } from "@/lib/quiz-api";
import type { ChatMsg, Question } from "@/lib/quiz-types";

export type { ChatMsg };

export function useClarify(question: Question | undefined) {
  const [messages, setMessages] = useState<ChatMsg[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  const reset = useCallback(() => {
    abortRef.current?.abort();
    setMessages([]);
    setError(null);
    setLoading(false);
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    setLoading(false);
  }, []);

  const send = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || loading || !question) return;
      setError(null);
      const next: ChatMsg[] = [...messages, { role: "user", content: trimmed }];
      setMessages(next);
      setLoading(true);

      abortRef.current?.abort();
      const ctrl = new AbortController();
      abortRef.current = ctrl;

      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        setMessages((prev) => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        });
      };

      try {
        const resp = await fetch(aiEndpoints.clarify, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.question,
            context: question.context,
            why: question.why,
            clarify: question.clarify,
            history: messages,
            userMessage: trimmed,
          }),
          signal: ctrl.signal,
        });

        if (!resp.ok || !resp.body) {
          if (resp.status === 429) throw new Error("Too many requests. Please wait a moment.");
          if (resp.status === 402) throw new Error("AI credits exhausted.");
          throw new Error("Failed to reach the AI assistant.");
        }

        const reader = resp.body.getReader();
        const decoder = new TextDecoder();
        let buf = "";
        let done = false;

        while (!done) {
          const r = await reader.read();
          if (r.done) break;
          buf += decoder.decode(r.value, { stream: true });
          let nl: number;
          while ((nl = buf.indexOf("\n")) !== -1) {
            let line = buf.slice(0, nl);
            buf = buf.slice(nl + 1);
            if (line.endsWith("\r")) line = line.slice(0, -1);
            if (line.startsWith(":") || line.trim() === "") continue;
            if (!line.startsWith("data: ")) continue;
            const json = line.slice(6).trim();
            if (json === "[DONE]") {
              done = true;
              break;
            }
            try {
              const parsed = JSON.parse(json);
              const content = parsed.choices?.[0]?.delta?.content;
              if (content) upsert(content);
            } catch {
              buf = line + "\n" + buf;
              break;
            }
          }
        }
      } catch (e) {
        if ((e as Error).name === "AbortError") return;
        setMessages((prev) => {
          const out = [...prev];
          if (out[out.length - 1]?.role === "assistant" && !out[out.length - 1].content) out.pop();
          if (out[out.length - 1]?.role === "user" && out[out.length - 1].content === trimmed) out.pop();
          return out;
        });
        setError(e instanceof Error ? e.message : "Something went wrong.");
      } finally {
        setLoading(false);
      }
    },
    [loading, messages, question],
  );

  return { messages, loading, error, send, reset, cancel };
}
