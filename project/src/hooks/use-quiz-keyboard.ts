import { useEffect } from "react";

type Handlers = {
  onYes?: () => void;
  onNo?: () => void;
  onSkip?: () => void;
  onClarify?: () => void;
  onUndo?: () => void;
};

export function useQuizKeyboard(handlers: Handlers, enabled = true) {
  useEffect(() => {
    if (!enabled) return;
    const fn = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement | null;
      if (
        t &&
        (t.tagName === "INPUT" || t.tagName === "TEXTAREA" || t.isContentEditable)
      )
        return;
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          handlers.onYes?.();
          break;
        case "ArrowLeft":
          e.preventDefault();
          handlers.onNo?.();
          break;
        case "ArrowUp":
        case "ArrowDown":
          e.preventDefault();
          handlers.onSkip?.();
          break;
        case " ":
          e.preventDefault();
          handlers.onClarify?.();
          break;
        case "z":
        case "Z":
          e.preventDefault();
          handlers.onUndo?.();
          break;
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [handlers, enabled]);
}
