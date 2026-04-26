import { Bot, Layers, Mic, User2 } from "lucide-react";
import type { Fact } from "@/lib/types";
import { adminInterviews, factInterviewIndex } from "@/lib/mock-data";

type Activate = { kind: "source"; id: string } | { kind: "interview"; id: string };

interface Props {
  fact: Fact;
  onActivate: (target: Activate) => void;
  active?: { kind: "source" | "interview"; id: string } | null;
}

const baseClass =
  "inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 font-mono text-[10px] uppercase tracking-wide transition-colors";

function shortName(full: string): string {
  const parts = full.trim().split(/\s+/);
  if (parts.length === 1) return parts[0];
  return `${parts[0]} ${parts[parts.length - 1][0]}.`;
}

export function SourceOfFactChip({ fact, onActivate, active }: Props) {
  const interviewIds = factInterviewIndex[fact.id] ?? [];
  const interview = interviewIds.length
    ? adminInterviews.find((i) => i.id === interviewIds[0])
    : undefined;

  if (fact.factSource === "human") {
    const target: Activate | null = interview ? { kind: "interview", id: interview.id } : null;
    const isActive = active && target && active.kind === target.kind && active.id === target.id;
    return (
      <button
        type="button"
        onClick={() => target && onActivate(target)}
        disabled={!target}
        className={`${baseClass} ${
          isActive ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--accent-soft)]"
        } disabled:cursor-default disabled:opacity-100`}
        style={{
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)",
        }}
        title={
          interview
            ? `Taught by ${interview.interviewee.name} · ${interview.id}`
            : `Taught by ${fact.taughtBy ?? "human"}`
        }
      >
        <User2 size={10} />
        <span>
          {interview ? shortName(interview.interviewee.name) : (fact.taughtBy ?? "human")}
        </span>
        {interview && (
          <>
            <span className="opacity-60">·</span>
            <span className="lowercase">{interview.id}</span>
          </>
        )}
      </button>
    );
  }

  if (interview) {
    const Icon = interview.mode === "voice" ? Mic : Layers;
    const target: Activate = { kind: "interview", id: interview.id };
    const isActive = active && active.kind === "interview" && active.id === interview.id;
    return (
      <button
        type="button"
        onClick={() => onActivate(target)}
        className={`${baseClass} ${
          isActive ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--accent-soft)]"
        }`}
        style={{
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-ink)",
        }}
        title={`Via ${interview.mode} interview with ${interview.interviewee.name}`}
      >
        <Icon size={10} />
        <span>{shortName(interview.interviewee.name)}</span>
        <span className="opacity-60">·</span>
        <span className="lowercase">{interview.id}</span>
      </button>
    );
  }

  const target: Activate = { kind: "source", id: fact.sourceId };
  const isActive = active && active.kind === "source" && active.id === fact.sourceId;
  return (
    <button
      type="button"
      onClick={() => onActivate(target)}
      className={`${baseClass} ${
        isActive ? "ring-1 ring-[color:var(--accent)]" : "hover:bg-[color:var(--surface)]"
      }`}
      style={{
        backgroundColor: "var(--surface-2)",
        color: "var(--ink-muted)",
      }}
      title={`AI extraction from ${fact.sourceId}`}
    >
      <Bot size={10} />
      <span>AI</span>
      <span className="opacity-60">·</span>
      <span className="lowercase">{fact.sourceId}</span>
    </button>
  );
}
