import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { api, computeHealth } from "./api";
import type { ActivityEvent, AIQuestion, Fact, MemoryHealth } from "./types";

const STORAGE_KEY = "qontext.v2.resolutions";
const ACTIVITY_KEY = "qontext.v2.activity";
const SESSIONS_KEY = "qontext.v2.sessions";

interface Resolution {
  questionId: string;
  choice: string;
  resolvedAt: string;
}

export type SessionMode = "voice" | "quiz";

export interface InterviewSession {
  id: string;
  mode: SessionMode;
  startedAt: string;
  endedAt: string;
  durationMs: number;
  questionsAnswered: number;
  questionsSkipped: number;
  topic: string;
  questionIds: string[];
}

interface MemoryState {
  questions: AIQuestion[];
  facts: Fact[];
  activity: ActivityEvent[];
  health: MemoryHealth;
  sessions: InterviewSession[];
  resolveQuestion: (questionId: string, choice: string) => void;
  isResolved: (questionId: string) => boolean;
  recordSession: (session: InterviewSession) => void;
}

const MemoryContext = createContext<MemoryState | null>(null);

function loadResolutions(): Resolution[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Resolution[]) : [];
  } catch {
    return [];
  }
}
function saveResolutions(r: Resolution[]) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(r));
  } catch {
    /* ignore */
  }
}
function loadExtraActivity(): ActivityEvent[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACTIVITY_KEY);
    return raw ? (JSON.parse(raw) as ActivityEvent[]) : [];
  } catch {
    return [];
  }
}
function saveExtraActivity(a: ActivityEvent[]) {
  try {
    window.localStorage.setItem(ACTIVITY_KEY, JSON.stringify(a));
  } catch {
    /* ignore */
  }
}
function loadSessions(): InterviewSession[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(SESSIONS_KEY);
    return raw ? (JSON.parse(raw) as InterviewSession[]) : [];
  } catch {
    return [];
  }
}
function saveSessions(s: InterviewSession[]) {
  try {
    window.localStorage.setItem(SESSIONS_KEY, JSON.stringify(s));
  } catch {
    /* ignore */
  }
}

export function MemoryProvider({ children }: { children: ReactNode }) {
  const [resolutions, setResolutions] = useState<Resolution[]>([]);
  const [extraActivity, setExtraActivity] = useState<ActivityEvent[]>([]);
  const [sessions, setSessions] = useState<InterviewSession[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setResolutions(loadResolutions());
    setExtraActivity(loadExtraActivity());
    setSessions(loadSessions());
    setHydrated(true);
  }, []);

  const baseQuestions = api.listQuestions();
  const baseFacts = api.listFacts();
  const baseActivity = api.listActivity();
  const streams = api.listSourceStreams();

  const questions = useMemo<AIQuestion[]>(
    () =>
      baseQuestions.map((q) => {
        const r = resolutions.find((x) => x.questionId === q.id);
        if (!r) return q;
        return {
          ...q,
          status: "resolved",
          resolution: { choice: r.choice, resolvedBy: "niko", resolvedAt: r.resolvedAt },
        };
      }),
    [baseQuestions, resolutions],
  );

  const facts = useMemo<Fact[]>(() => {
    // For each resolved question, mark its affected facts as human-taught.
    const taughtFactIds = new Set<string>();
    const taughtAtMap: Record<string, string> = {};
    for (const r of resolutions) {
      const q = baseQuestions.find((x) => x.id === r.questionId);
      if (!q) continue;
      for (const fid of q.affectedFactIds) {
        taughtFactIds.add(fid);
        taughtAtMap[fid] = r.resolvedAt;
      }
    }
    return baseFacts.map((f) =>
      taughtFactIds.has(f.id)
        ? {
            ...f,
            factSource: "human" as const,
            taughtBy: "niko",
            taughtAt: taughtAtMap[f.id],
            confidence: Math.max(f.confidence, 0.99),
          }
        : f,
    );
  }, [baseFacts, baseQuestions, resolutions]);

  const activity = useMemo<ActivityEvent[]>(() => {
    return [...extraActivity, ...baseActivity].sort((a, b) => (a.ts < b.ts ? 1 : -1));
  }, [baseActivity, extraActivity]);

  const health = useMemo(() => computeHealth(questions, facts, streams), [questions, facts, streams]);

  const resolveQuestion = useCallback(
    (questionId: string, choice: string) => {
      const q = baseQuestions.find((x) => x.id === questionId);
      if (!q) return;
      const ts = new Date().toISOString();
      setResolutions((prev) => {
        if (prev.some((p) => p.questionId === questionId)) return prev;
        const next = [...prev, { questionId, choice, resolvedAt: ts }];
        saveResolutions(next);
        return next;
      });
      const event: ActivityEvent = {
        id: `a-resolve-${questionId}-${Date.now()}`,
        kind: "resolved_question",
        actor: "niko",
        summary: `Resolved: '${q.question.replace(/^[^a-zA-Z0-9]+/, "").slice(0, 80)}' — ${choice} (propagated to ${q.affectedFactIds.length} facts)`,
        ts,
        refIds: [questionId, ...q.affectedFactIds],
      };
      setExtraActivity((prev) => {
        const next = [event, ...prev];
        saveExtraActivity(next);
        return next;
      });
    },
    [baseQuestions],
  );

  const isResolved = useCallback(
    (questionId: string) => resolutions.some((r) => r.questionId === questionId),
    [resolutions],
  );

  const recordSession = useCallback((session: InterviewSession) => {
    setSessions((prev) => {
      if (prev.some((s) => s.id === session.id)) return prev;
      const next = [session, ...prev];
      saveSessions(next);
      return next;
    });
  }, []);

  // Pre-hydration we render with empty state to avoid flicker; once loaded we render real values.
  const value: MemoryState = hydrated
    ? { questions, facts, activity, health, sessions, resolveQuestion, isResolved, recordSession }
    : { questions: baseQuestions, facts: baseFacts, activity: baseActivity, health: computeHealth(baseQuestions, baseFacts, streams), sessions: [], resolveQuestion, isResolved, recordSession };

  return <MemoryContext.Provider value={value}>{children}</MemoryContext.Provider>;
}

export function useMemoryStore(): MemoryState {
  const ctx = useContext(MemoryContext);
  if (!ctx) throw new Error("useMemoryStore must be used inside MemoryProvider");
  return ctx;
}
