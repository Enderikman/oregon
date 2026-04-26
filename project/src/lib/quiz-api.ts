import { useCallback, useEffect, useMemo, useState } from "react";
import { api } from "./api";
import { useMemoryStore, type InterviewSession } from "./memory-context";
import type { AIQuestion } from "./types";
import type { HistoryEntry, Question, QuizSummary } from "./quiz-types";
import { extraQuizDeck } from "./extra-quiz-deck";

/**
 * Backend contract (set VITE_API_BASE_URL to use real backend, otherwise mock
 * impl wraps the local memory store).
 *
 * Open questions:
 *
 *   GET    {base}/open-questions?userId={uuid}
 *          → Array<{
 *              question: { id: string; text: string };
 *              poi: string[];                // point-of-interest entity ids
 *            }>
 *
 * Ingest a single answer:
 *
 *   POST   {base}/ingest-answer
 *          body: {
 *            userId: string;
 *            questionId: string;             // id from /open-questions
 *            answer: string;                 // "yes" | "no" | "skip" | "dont_know" | free text
 *            durationMs?: number;
 *            followupText?: string;          // for conflict/gap follow-ups
 *            clarifications?: ChatMsg[];     // optional clarify transcript
 *          }
 *          → { success: boolean }
 *
 * AI assist (optional, Lovable-style edge fns or our own):
 *
 *   POST   {base}/ai/clarify   (SSE)
 *          body: { question, context?, why?, clarify?, history, userMessage }
 *          → text/event-stream of OpenAI-style chunks
 *
 *   POST   {base}/ai/draft
 *          body: { question, context?, why?, clarify?, history?, partial? }
 *          → { draft: string }
 */

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? "";

export const useHttpQuizApi = !!API_BASE;

export const quizEndpoints = {
  openQuestions: `${API_BASE}/open-questions`,
  ingestAnswer: `${API_BASE}/ingest-answer`,
};

export const aiEndpoints = {
  clarify: `${API_BASE}/ai/clarify`,
  draft: `${API_BASE}/ai/draft`,
};

type BackendQuestion = {
  question: { id: string; text: string };
  poi: string[];
};

export function aiQuestionToQuestion(q: AIQuestion): Question {
  const cands = q.candidates ?? [];
  const isBinaryYesNo =
    cands.length === 0 ||
    (cands.length === 2 && /^yes$/i.test(cands[0]) && /^no$/i.test(cands[1]));

  const followupTypes: AIQuestion["type"][] = ["conflict", "gap"];
  const needsFollowup = followupTypes.includes(q.type);

  const data: Record<string, unknown> = { type: q.type };
  if (q.affectedFactIds.length > 0) data.affectedFacts = q.affectedFactIds;
  if (q.affectedEntityIds.length > 0) data.affectedEntities = q.affectedEntityIds;
  if (q.sourceIds.length > 0) data.sources = q.sourceIds;
  if (q.unblocksQuestionIds.length > 0) data.unblocks = q.unblocksQuestionIds;

  const base = {
    id: q.id,
    question: q.question,
    why: q.reasoning,
    data,
    followup: needsFollowup
      ? {
          prompt:
            q.type === "conflict"
              ? "Add the canonical form or note."
              : "Fill in the missing detail.",
        }
      : undefined,
  };

  if (isBinaryYesNo) return { ...base, type: "yesno" };
  if (cands.length > 0) return { ...base, type: "choice", options: cands };
  return { ...base, type: "text" };
}

function backendToQuestion(b: BackendQuestion): Question {
  return {
    id: b.question.id,
    type: "yesno",
    question: b.question.text,
    data: b.poi.length > 0 ? { poi: b.poi } : undefined,
  };
}

type DecisionInput = {
  questionId: string;
  decision: string;
  durationMs: number;
  followupText?: string;
  clarifications?: { role: "user" | "assistant"; content: string }[];
};

type SessionState = {
  questions: Question[];
  loading: boolean;
  error: string | null;
};

export function useQuizSession(sessionId: string) {
  const memory = useMemoryStore();
  const userId = api.getCurrentUser().id;

  const [state, setState] = useState<SessionState>({
    questions: [],
    loading: true,
    error: null,
  });

  const mockQuestions = useMemo<Question[]>(() => {
    const aiOpen = memory.questions
      .filter((q) => q.status === "open")
      .sort((a, b) => {
        const ai = a.affectedFactIds.length + a.unblocksQuestionIds.length * 2;
        const bi = b.affectedFactIds.length + b.unblocksQuestionIds.length * 2;
        return bi - ai;
      })
      .map(aiQuestionToQuestion);
    const extras = extraQuizDeck.filter((q) => !memory.isResolved(q.id));
    return [...aiOpen, ...extras];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  useEffect(() => {
    let cancelled = false;
    if (!useHttpQuizApi) {
      setState({ questions: mockQuestions, loading: false, error: null });
      return;
    }
    setState((s) => ({ ...s, loading: true, error: null }));
    const url = `${quizEndpoints.openQuestions}?userId=${encodeURIComponent(userId)}`;
    fetch(url)
      .then(async (r) => {
        if (!r.ok) throw new Error(`Failed to load questions (${r.status})`);
        return (await r.json()) as BackendQuestion[];
      })
      .then((items) => {
        if (cancelled) return;
        setState({ questions: items.map(backendToQuestion), loading: false, error: null });
      })
      .catch((e: Error) => {
        if (cancelled) return;
        setState({ questions: [], loading: false, error: e.message });
      });
    return () => {
      cancelled = true;
    };
  }, [sessionId, userId, mockQuestions]);

  const submitDecision = useCallback(
    async (input: DecisionInput) => {
      if (useHttpQuizApi) {
        await fetch(quizEndpoints.ingestAnswer, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            questionId: input.questionId,
            answer: input.decision,
            durationMs: input.durationMs,
            followupText: input.followupText,
            clarifications: input.clarifications,
          }),
        });
        return;
      }
      const choice = input.followupText
        ? `${input.decision} — ${input.followupText}`
        : input.decision;
      memory.resolveQuestion(input.questionId, choice);
    },
    [userId, memory],
  );

  const finalizeSession = useCallback(
    (history: HistoryEntry[], startedAt: string): QuizSummary => {
      const endedAt = new Date().toISOString();
      const durationMs = new Date(endedAt).getTime() - new Date(startedAt).getTime();
      const answered = history.filter((h) => h.decision !== "skip").length;
      const skipped = history.filter((h) => h.decision === "skip").length;

      const summary: QuizSummary = {
        sessionId,
        total: state.questions.length,
        answered,
        skipped,
        durationMs,
        decisions: history,
      };

      if (!useHttpQuizApi) {
        const topic =
          history[0] && state.questions.find((q) => q.id === history[0].questionId)?.question;
        const session: InterviewSession = {
          id: sessionId,
          mode: "quiz",
          startedAt,
          endedAt,
          durationMs,
          questionsAnswered: answered,
          questionsSkipped: skipped,
          topic: topic ?? "Quiz session",
          questionIds: state.questions.map((q) => q.id),
        };
        memory.recordSession(session);
      }
      return summary;
    },
    [sessionId, state.questions, memory],
  );

  return {
    questions: state.questions,
    loading: state.loading,
    error: state.error,
    submitDecision,
    finalizeSession,
  };
}
