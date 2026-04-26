import { useEffect, useRef, useState } from "react";
import { Pencil } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

interface Props {
  /** The current transcript text shown to the user. */
  value: string;
  /** Whether the value has already been edited from the original STT output. */
  edited?: boolean;
  /** Called when the user commits an edit (Cmd/Ctrl+Enter or Save). */
  onCommit: (text: string) => void;
}

/**
 * Read-only view of the STT transcript with an inline edit affordance.
 * In edit mode, the text becomes a textarea pre-filled with the current
 * value. Cmd/Ctrl+Enter commits, Escape cancels and reverts.
 *
 * Plain Enter inserts a newline (no submit-on-Enter hijack), so the
 * textarea behaves the way users expect.
 */
export function EditableTranscript({ value, edited, onCommit }: Props) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Keep the draft in sync if the parent value changes while we're not editing
  // (e.g. a fresh dictation result arrives between confirmations).
  useEffect(() => {
    if (!isEditing) setDraft(value);
  }, [value, isEditing]);

  // Auto-focus and select-all when entering edit mode.
  useEffect(() => {
    if (!isEditing) return;
    const el = textareaRef.current;
    if (!el) return;
    el.focus();
    el.select();
  }, [isEditing]);

  // Click-outside cancels the edit.
  useEffect(() => {
    if (!isEditing) return;
    const onPointerDown = (e: MouseEvent) => {
      const root = containerRef.current;
      if (!root) return;
      if (root.contains(e.target as Node)) return;
      cancelEdit();
    };
    window.addEventListener("mousedown", onPointerDown);
    return () => window.removeEventListener("mousedown", onPointerDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing]);

  const startEdit = () => {
    setDraft(value);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setDraft(value);
    setIsEditing(false);
  };

  const commitEdit = () => {
    const next = draft.trim();
    if (next.length === 0) {
      cancelEdit();
      return;
    }
    setIsEditing(false);
    if (next !== value) onCommit(next);
  };

  const onTextareaKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Don't let global Space-to-toggle-mic listeners catch keystrokes typed
    // in this field. The window-level handler already excludes textareas,
    // but stopping propagation makes that contract explicit.
    e.stopPropagation();
    if (e.key === "Escape") {
      e.preventDefault();
      cancelEdit();
      return;
    }
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
      e.preventDefault();
      commitEdit();
    }
    // Plain Enter: default behavior (newline). No hijack.
  };

  return (
    <div ref={containerRef}>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: "var(--accent)" }} />
          <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
            What I understood
          </span>
          {edited && !isEditing && (
            <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-ink-muted">
              · edited
            </span>
          )}
        </div>
        {!isEditing && (
          <button
            type="button"
            onClick={startEdit}
            className="inline-flex items-center gap-1 rounded-full px-2 py-1 text-[11px] text-ink-muted hover:bg-surface-2 hover:text-ink"
          >
            <Pencil size={11} />
            Edit
          </button>
        )}
      </div>

      {isEditing ? (
        <Textarea
          ref={textareaRef}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onTextareaKeyDown}
          onBlur={commitEdit}
          rows={3}
          aria-label="Edit transcript"
          className="mt-3 min-h-[88px] resize-none rounded-[12px] border-border bg-surface-2 text-[15px] leading-snug text-ink shadow-none focus-visible:ring-[color:var(--accent)]"
        />
      ) : (
        <p className="mt-3 whitespace-pre-wrap text-[15px] leading-snug text-ink">{value}</p>
      )}

      {isEditing && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.18em] text-ink-soft">
          Cmd+Enter to save · Esc to cancel
        </p>
      )}
    </div>
  );
}
