import { useCallback, useState } from "react";
import { aiEndpoints } from "@/lib/quiz-api";
import type { ChatMsg, Question } from "@/lib/quiz-types";

export function useDraft(question: Question | undefined, history: ChatMsg[] = []) {
  const [drafting, setDrafting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draft = useCallback(
    async (partial?: string): Promise<string | null> => {
      if (!question || drafting) return null;
      setDrafting(true);
      setError(null);
      try {
        const resp = await fetch(aiEndpoints.draft, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            question: question.question,
            context: question.context,
            why: question.why,
            clarify: question.clarify,
            history,
            partial,
          }),
        });
        if (!resp.ok) {
          if (resp.status === 429) throw new Error("Slow down a sec.");
          if (resp.status === 402) throw new Error("AI credits exhausted.");
          throw new Error("Couldn't draft.");
        }
        const data = await resp.json();
        return typeof data.draft === "string" && data.draft.length > 0 ? data.draft : null;
      } catch (e) {
        setError(e instanceof Error ? e.message : "Draft failed");
        return null;
      } finally {
        setDrafting(false);
      }
    },
    [question, history, drafting],
  );

  return { draft, drafting, error };
}
