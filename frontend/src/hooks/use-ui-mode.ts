import { useEffect, useState } from "react";

export type UIMode = "pro" | "easy";

const KEY = "qontext.ui-mode";

function detectDefault(): UIMode {
  if (typeof window === "undefined") return "pro";
  const isCoarse = window.matchMedia?.("(pointer: coarse)").matches;
  const isNarrow = window.innerWidth < 768;
  return isCoarse || isNarrow ? "easy" : "pro";
}

export function useUIMode(): [UIMode, (m: UIMode) => void, () => void] {
  const [mode, setMode] = useState<UIMode>("pro");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY);
    if (stored === "pro" || stored === "easy") {
      setMode(stored);
    } else {
      setMode(detectDefault());
    }
  }, []);

  useEffect(() => {
    try {
      window.localStorage.setItem(KEY, mode);
    } catch {
      /* ignore */
    }
  }, [mode]);

  return [mode, setMode, () => setMode((m) => (m === "pro" ? "easy" : "pro"))];
}
