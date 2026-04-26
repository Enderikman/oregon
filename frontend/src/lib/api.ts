import {
  acmeGraph,
  activityEvents as initialActivity,
  aiQuestions as initialQuestions,
  currentUser,
  entities,
  facts,
  sourceStreams,
  sources,
  testAnswers,
} from "./mock-data";
import type {
  ActivityEvent,
  AIQuestion,
  Entity,
  Fact,
  MemoryHealth,
  Source,
  SourceStream,
} from "./types";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

export const api = {
  getCurrentUser: () => currentUser,
  listEntities: (): Entity[] => entities,
  getEntity: (id: string): Entity | undefined => entities.find((e) => e.id === id),
  listFacts: (): Fact[] => facts,
  getFact: (id: string): Fact | undefined => facts.find((f) => f.id === id),
  getFactsForEntity: (entityId: string): Fact[] =>
    facts.filter((f) => f.subject === entityId),
  listSources: (): Source[] => sources,
  getSource: (id: string): Source | undefined => sources.find((s) => s.id === id),
  listQuestions: (): AIQuestion[] => initialQuestions,
  getQuestion: (id: string): AIQuestion | undefined =>
    initialQuestions.find((q) => q.id === id),
  listActivity: (): ActivityEvent[] => initialActivity,
  listSourceStreams: (): SourceStream[] => sourceStreams,
  getGraph: () => acmeGraph,
  getTestAnswers: () => testAnswers,
};

export interface MemoryTreeEntry {
  id: string;
  type: string;
  name: string;
}

export interface MemoryBacklink {
  id: string;
  type: string;
  name: string | null;
}

export interface MemoryPage {
  id: string;
  type: string;
  name: string;
  frontmatter: Record<string, string>;
  body: string;
  backlinks: MemoryBacklink[];
}

export const memoryApi = {
  fetchTree: async (): Promise<MemoryTreeEntry[]> => {
    const res = await fetch(`${API_BASE}/api/v1/admin/memory/tree`);
    if (!res.ok) throw new Error(`Failed to fetch memory tree: ${res.status}`);
    return res.json();
  },
  fetchPage: async (id: string): Promise<MemoryPage> => {
    const res = await fetch(`${API_BASE}/api/v1/admin/memory/page/${id}`);
    if (!res.ok) throw new Error(`Failed to fetch page ${id}: ${res.status}`);
    return res.json();
  },
};

export function computeHealth(
  questions: AIQuestion[],
  factsList: Fact[],
  streams: SourceStream[],
): MemoryHealth {
  const open = questions.filter((q) => q.status === "open");
  const conflicts = open.filter((q) => q.type === "conflict").length;
  const confSum = factsList.reduce((acc, f) => acc + f.confidence, 0);
  return {
    factsLearned: factsList.length + 220, // pretend the 30 we ship are part of a bigger graph
    confidenceAvg: factsList.length > 0 ? confSum / factsList.length : 0,
    openQuestions: open.length,
    conflicts,
    sourcesIngested: streams.filter((s) => s.status === "up_to_date").length,
    sourcesTotal: streams.length,
  };
}
