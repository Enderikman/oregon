import { Keyboard, MousePointerClick } from "lucide-react";
import type { UIMode } from "@/hooks/use-ui-mode";

type Props = {
  mode: UIMode;
  onToggle: () => void;
};

export function ModeSwitch({ mode, onToggle }: Props) {
  return (
    <div className="hidden md:inline-flex items-center rounded-full border border-border bg-card p-0.5 text-[11px] font-medium">
      <button
        onClick={mode === "easy" ? onToggle : undefined}
        aria-pressed={mode === "pro"}
        className={
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition " +
          (mode === "pro"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground")
        }
        title="Shortcut-first interface"
      >
        <Keyboard className="w-3.5 h-3.5" />
        Pro
      </button>
      <button
        onClick={mode === "pro" ? onToggle : undefined}
        aria-pressed={mode === "easy"}
        className={
          "inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full transition " +
          (mode === "easy"
            ? "bg-foreground text-background"
            : "text-muted-foreground hover:text-foreground")
        }
        title="Explicit, button-driven interface"
      >
        <MousePointerClick className="w-3.5 h-3.5" />
        Easy
      </button>
    </div>
  );
}
