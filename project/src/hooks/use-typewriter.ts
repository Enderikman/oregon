import { useEffect, useState } from "react";

export function useTypewriter(text: string, msPerChunk = 28, chunkSize = 3): string {
  const [out, setOut] = useState("");

  useEffect(() => {
    setOut("");
    if (!text) return;
    let i = 0;
    const id = window.setInterval(() => {
      i += chunkSize;
      setOut(text.slice(0, i));
      if (i >= text.length) {
        window.clearInterval(id);
        setOut(text);
      }
    }, msPerChunk);
    return () => window.clearInterval(id);
  }, [text, msPerChunk, chunkSize]);

  return out;
}
