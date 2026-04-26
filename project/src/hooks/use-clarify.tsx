import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { aiEndpoints } from "@/lib/quiz-api";
import { clarifyFetch, useOpenRouter } from "@/lib/openrouter";
import type { ChatMsg, Question } from "@/lib/quiz-types";

export type { ChatMsg };

type Store = {
  getMessages: (id: string) => ChatMsg[];
  setMessages: (id: string, updater: (prev: ChatMsg[]) => ChatMsg[]) => void;
  resetQuestion: (id: string) => void;
  loadingId: string | null;
  setLoadingId: (id: string | null) => void;
  errorById: Record<string, string | null>;
  setError: (id: string, error: string | null) => void;
  abortFor: (id: string) => AbortController;
};

const Ctx = createContext<Store | null>(null);

export function ClarifyStoreProvider({ children }: { children: ReactNode }) {
  const [messagesById, setMessagesById] = useState<Record<string, ChatMsg[]>>({});
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [errorById, setErrorById] = useState<Record<string, string | null>>({});
  const abortRefs = useRef<Record<string, AbortController>>({});

  const getMessages = useCallback((id: string) => messagesById[id] ?? [], [messagesById]);

  const setMessages = useCallback((id: string, updater: (prev: ChatMsg[]) => ChatMsg[]) => {
    setMessagesById((prev) => ({ ...prev, [id]: updater(prev[id] ?? []) }));
  }, []);

  const resetQuestion = useCallback((id: string) => {
    abortRefs.current[id]?.abort();
    setMessagesById((prev) => {
      const { [id]: _drop, ...rest } = prev;
      return rest;
    });
    setErrorById((prev) => ({ ...prev, [id]: null }));
  }, []);

  const setError = useCallback((id: string, error: string | null) => {
    setErrorById((prev) => ({ ...prev, [id]: error }));
  }, []);

  const abortFor = useCallback((id: string) => {
    abortRefs.current[id]?.abort();
    const ctrl = new AbortController();
    abortRefs.current[id] = ctrl;
    return ctrl;
  }, []);

  const value = useMemo<Store>(
    () => ({
      getMessages,
      setMessages,
      resetQuestion,
      loadingId,
      setLoadingId,
      errorById,
      setError,
      abortFor,
    }),
    [getMessages, setMessages, resetQuestion, loadingId, errorById, setError, abortFor],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

function buildBody(q: Question, history: ChatMsg[], userMessage: string) {
  return {
    question: q.question,
    context: q.context,
    why: q.why,
    clarify: q.clarify,
    history,
    userMessage,
  };
}

async function streamClarify(
  question: Question,
  history: ChatMsg[],
  userMessage: string,
  signal: AbortSignal,
): Promise<Response> {
  if (useOpenRouter) {
    return clarifyFetch({ question, history, userMessage }, signal);
  }
  return fetch(aiEndpoints.clarify, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(buildBody(question, history, userMessage)),
    signal,
  });
}

export function useSharedClarify(question: Question | undefined) {
  const store = useContext(Ctx);

  // Local fallback when no provider mounted.
  const [localMsgs, setLocalMsgs] = useState<ChatMsg[]>([]);
  const [localLoading, setLocalLoading] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const localAbort = useRef<AbortController | null>(null);

  const id = question?.id ?? "__none__";
  const messages = store ? store.getMessages(id) : localMsgs;
  const loading = store ? store.loadingId === id : localLoading;
  const error = store ? (store.errorById[id] ?? null) : localError;

  const reset = useCallback(() => {
    if (store) {
      store.resetQuestion(id);
      if (store.loadingId === id) store.setLoadingId(null);
    } else {
      localAbort.current?.abort();
      setLocalMsgs([]);
      setLocalError(null);
      setLocalLoading(false);
    }
  }, [store, id]);

  const cancel = useCallback(() => {
    if (store) {
      if (store.loadingId === id) store.setLoadingId(null);
    } else {
      localAbort.current?.abort();
      setLocalLoading(false);
    }
  }, [store, id]);

  const send = useCallback(
    async (userText: string) => {
      const trimmed = userText.trim();
      if (!trimmed || !question) return;
      if (store ? store.loadingId !== null : localLoading) return;

      const prevMessages = store ? store.getMessages(id) : localMsgs;
      const nextMessages: ChatMsg[] = [...prevMessages, { role: "user", content: trimmed }];

      if (store) {
        store.setError(id, null);
        store.setMessages(id, () => nextMessages);
        store.setLoadingId(id);
      } else {
        setLocalError(null);
        setLocalMsgs(nextMessages);
        setLocalLoading(true);
      }

      const ctrl = store
        ? store.abortFor(id)
        : (() => {
            localAbort.current?.abort();
            const c = new AbortController();
            localAbort.current = c;
            return c;
          })();

      let assistantSoFar = "";
      const upsert = (chunk: string) => {
        assistantSoFar += chunk;
        const apply = (prev: ChatMsg[]): ChatMsg[] => {
          const last = prev[prev.length - 1];
          if (last?.role === "assistant") {
            return prev.map((m, i) =>
              i === prev.length - 1 ? { ...m, content: assistantSoFar } : m,
            );
          }
          return [...prev, { role: "assistant", content: assistantSoFar }];
        };
        if (store) store.setMessages(id, apply);
        else setLocalMsgs(apply);
      };

      try {
        const resp = await streamClarify(question, prevMessages, trimmed, ctrl.signal);

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
        const rollback = (prev: ChatMsg[]) => {
          const out = [...prev];
          if (out[out.length - 1]?.role === "assistant" && !out[out.length - 1].content) out.pop();
          if (out[out.length - 1]?.role === "user" && out[out.length - 1].content === trimmed)
            out.pop();
          return out;
        };
        if (store) {
          store.setMessages(id, rollback);
          store.setError(id, e instanceof Error ? e.message : "Something went wrong.");
        } else {
          setLocalMsgs(rollback);
          setLocalError(e instanceof Error ? e.message : "Something went wrong.");
        }
      } finally {
        if (store) store.setLoadingId(null);
        else setLocalLoading(false);
      }
    },
    [store, id, question, localMsgs, localLoading],
  );

  return { messages, loading, error, send, reset, cancel };
}

// Backwards-compat name for existing call sites.
export const useClarify = useSharedClarify;

export function useClarifyMessages(questionId: string | undefined): ChatMsg[] {
  const store = useContext(Ctx);
  if (!store || !questionId) return [];
  return store.getMessages(questionId);
}
