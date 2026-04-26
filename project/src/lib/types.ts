export type EntityType =
  | "client"
  | "employee"
  | "product"
  | "policy"
  | "project"
  | "decision";

export type SourceKind =
  | "email"
  | "crm_row"
  | "ticket"
  | "pdf_excerpt"
  | "doc"
  | "human_reply";

export type QuestionType =
  | "disambiguation"
  | "conflict"
  | "gap"
  | "low_confidence"
  | "categorization";

export type FactSource = "ai" | "human";

export interface Source {
  id: string;
  kind: SourceKind;
  label: string;
  excerpt: string;
  highlight?: string; // substring to highlight inside excerpt
  url?: string;
  contributor?: string;
}

export interface Fact {
  id: string;
  subject: string; // entity id
  predicate: string;
  object: string;
  confidence: number;
  verifiedAt: string;
  sourceId: string;
  factSource: FactSource;
  conflictingFactId?: string;
  taughtBy?: string;
  taughtAt?: string;
}

export interface Entity {
  id: string;
  type: EntityType;
  name: string;
  summary: string;
  body: string;
  factIds: string[];
  backlinks: string[];
  updatedAt: string;
}

export interface AIQuestion {
  id: string;
  type: QuestionType;
  question: string;
  reasoning: string;
  sourceIds: string[];
  affectedFactIds: string[];
  affectedEntityIds: string[];
  unblocksQuestionIds: string[];
  candidates?: string[];
  raisedAt: string;
  status: "open" | "resolved";
  resolution?: { choice: string; resolvedBy: string; resolvedAt: string };
}

export interface ActivityEvent {
  id: string;
  kind:
    | "extracted"
    | "raised_question"
    | "resolved_question"
    | "edited_fact"
    | "ingested_source";
  actor: "ai" | string; // "ai" or entity id of human
  summary: string;
  ts: string;
  refIds?: string[];
}

export interface SourceStream {
  id: string;
  name: string;
  status: "up_to_date" | "pending" | "error";
  lastIngestedAt: string;
  factCount: number;
}

export interface User {
  id: string;
  name: string;
  role: string;
  initials: string;
}

export interface GraphNode {
  id: string;
  label: string;
  kind: "entity" | "fact";
  entityType?: EntityType;
}

export interface GraphEdge {
  id: string;
  source: string;
  target: string;
  label: string;
}

export interface MemoryHealth {
  factsLearned: number;
  confidenceAvg: number; // 0..1
  openQuestions: number;
  conflicts: number;
  sourcesIngested: number;
  sourcesTotal: number;
}
