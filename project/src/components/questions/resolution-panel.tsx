import { useState } from "react";
import type { AIQuestion } from "@/lib/types";

interface Props {
  q: AIQuestion;
  onResolve: (choice: string) => void;
}

export function ResolutionPanel({ q, onResolve }: Props) {
  const [choice, setChoice] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [editing, setEditing] = useState(false);

  const submit = () => {
    if (choice === "Edit and confirm" && text.trim()) {
      onResolve(text.trim());
    } else if (choice && choice !== "Edit and confirm") {
      onResolve(choice);
    } else if (text.trim()) {
      onResolve(text.trim());
    }
  };

  if (q.type === "gap") {
    return (
      <div className="space-y-3">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Type the answer (e.g. an entity name)…"
          className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] text-ink placeholder:text-ink-soft focus:border-ink-muted focus:outline-none"
        />
        <SubmitRow disabled={!text.trim()} onClick={submit} q={q} />
      </div>
    );
  }

  if (q.type === "categorization") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(q.candidates ?? []).map((c) => {
            const active = choice === c;
            return (
              <button
                key={c}
                onClick={() => setChoice(c)}
                className="rounded-full border px-4 py-2 text-[13px] transition-colors"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--border)",
                  backgroundColor: active ? "var(--accent-soft)" : "var(--surface)",
                  color: active ? "var(--accent-ink)" : "var(--ink)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        <SubmitRow disabled={!choice} onClick={submit} q={q} />
      </div>
    );
  }

  if (q.type === "low_confidence") {
    return (
      <div className="space-y-3">
        <div className="flex flex-wrap gap-2">
          {(q.candidates ?? []).map((c) => {
            const active = choice === c;
            return (
              <button
                key={c}
                onClick={() => { setChoice(c); setEditing(c === "Edit and confirm"); }}
                className="rounded-full border px-4 py-2 text-[13px] transition-colors"
                style={{
                  borderColor: active ? "var(--accent)" : "var(--border)",
                  backgroundColor: active ? "var(--accent-soft)" : "var(--surface)",
                  color: active ? "var(--accent-ink)" : "var(--ink)",
                }}
              >
                {c}
              </button>
            );
          })}
        </div>
        {editing && (
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Edit the fact, then confirm…"
            className="w-full rounded-xl border border-border bg-background px-4 py-3 text-[14px] text-ink focus:border-ink-muted focus:outline-none"
            rows={3}
          />
        )}
        <SubmitRow
          disabled={!choice || (editing && !text.trim())}
          onClick={submit}
          q={q}
        />
      </div>
    );
  }

  // disambiguation + conflict — radios
  return (
    <div className="space-y-3">
      <div className="space-y-2">
        {(q.candidates ?? []).map((c) => {
          const active = choice === c;
          return (
            <button
              key={c}
              onClick={() => setChoice(c)}
              className="flex w-full items-center gap-3 rounded-xl border px-4 py-3 text-left transition-colors"
              style={{
                borderColor: active ? "var(--accent)" : "var(--border)",
                backgroundColor: active ? "var(--accent-soft)" : "var(--surface)",
              }}
            >
              <span
                className="grid h-4 w-4 place-items-center rounded-full border"
                style={{ borderColor: active ? "var(--accent)" : "var(--ink-soft)" }}
              >
                {active && (
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: "var(--accent)" }}
                  />
                )}
              </span>
              <span className="text-[14px] text-ink">{c}</span>
            </button>
          );
        })}
      </div>
      {q.type === "conflict" && (
        <div>
          <div className="mb-1 font-mono text-[10px] uppercase tracking-wide text-ink-soft">
            Or — neither, here's the truth
          </div>
          <textarea
            value={text}
            onChange={(e) => { setText(e.target.value); if (e.target.value) setChoice(null); }}
            placeholder="Type the canonical value…"
            rows={2}
            className="w-full rounded-xl border border-border bg-background px-4 py-2 text-[13px] text-ink focus:border-ink-muted focus:outline-none"
          />
        </div>
      )}
      <SubmitRow
        disabled={!choice && !text.trim()}
        onClick={submit}
        q={q}
      />
    </div>
  );
}

function SubmitRow({ disabled, onClick, q }: { disabled: boolean; onClick: () => void; q: AIQuestion }) {
  return (
    <div className="mt-4 flex items-center justify-between">
      <div className="font-mono text-[11px] text-ink-muted">
        Resolving will update {q.affectedFactIds.length} {q.affectedFactIds.length === 1 ? "fact" : "facts"}
        {q.unblocksQuestionIds.length > 0 && (
          <> and unblock {q.unblocksQuestionIds.length} {q.unblocksQuestionIds.length === 1 ? "question" : "questions"}</>
        )}
        .
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className="rounded-full px-5 py-2.5 text-[13px] font-medium transition-opacity disabled:opacity-40"
        style={{ backgroundColor: "var(--accent)", color: "white" }}
      >
        Teach the AI
      </button>
    </div>
  );
}