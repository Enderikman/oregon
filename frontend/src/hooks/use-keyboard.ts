import { useEffect } from "react";

export function useKeyboard(combo: { key: string; meta?: boolean }, handler: () => void) {
  useEffect(() => {
    const fn = (e: KeyboardEvent) => {
      const metaOk = combo.meta ? e.metaKey || e.ctrlKey : true;
      if (metaOk && e.key.toLowerCase() === combo.key.toLowerCase()) {
        e.preventDefault();
        handler();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [combo.key, combo.meta, handler]);
}
