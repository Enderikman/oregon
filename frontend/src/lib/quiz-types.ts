export type Decision = "yes" | "no" | "skip" | "dont_know" | string;

export type ChatMsg = { role: "user" | "assistant"; content: string };

export type QuestionBase = {
  id: string;
  question: string;
  context?: string;
  why?: string;
  clarify?: string;
  examples?: string[];
  data?: Record<string, unknown>;
  followup?: { prompt: string };
};

export type YesNoQuestion = QuestionBase & { type: "yesno" };
export type ChoiceQuestion = QuestionBase & { type: "choice"; options: string[] };
export type TextQuestion = QuestionBase & { type: "text" };

export type Question = YesNoQuestion | ChoiceQuestion | TextQuestion;

export type HistoryEntry = {
  questionId: string;
  decision: Decision;
  durationMs: number;
  at: number;
  followupText?: string;
};

export type QuizSummary = {
  sessionId: string;
  total: number;
  answered: number;
  skipped: number;
  durationMs: number;
  decisions: HistoryEntry[];
};
