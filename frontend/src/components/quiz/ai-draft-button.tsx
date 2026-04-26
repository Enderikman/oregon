import { Loader2, Wand2 } from "lucide-react";
import { useState } from "react";
import { useDraft } from "@/hooks/use-draft";
import type { ChatMsg, Question } from "@/lib/quiz-types";

type Props = {
  question: Question | undefined;
  history?: ChatMsg[];
  current: string;
  onDraft: (text: string) => void;
  className?: string;
  typewriter?: boolean;
  title?: string;
};

export function AIDraftButton({
  question,
  history = [],
  current,
  onDraft,
  className = "",
  typewriter = true,
  title = "Let AI draft this",
}: Props) {
  const { draft, drafting } = useDraft(question, history);
  const [typing, setTyping] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const text = await draft(current);
    if (!text) return;
    if (!typewriter) {
      onDraft(text);
      return;
    }
    setTyping(true);
    let i = 0;
    const step = () => {
      i += 1;
      onDraft(text.slice(0, i));
      if (i < text.length) {
        setTimeout(step, 14);
      } else {
        setTyping(false);
      }
    };
    step();
  }

  const busy = drafting || typing;

  return (
    <button
      type="button"
      onMouseDown={(e) => e.preventDefault()}
      onClick={handleClick}
      disabled={busy || !question}
      title={title}
      aria-label={title}
      className={
        "p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition disabled:opacity-50 " +
        className
      }
    >
      {busy ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
    </button>
  );
}
