import { useEffect, useState } from "react";
import { relativeTime } from "@/lib/format";

interface Props {
  iso: string;
  className?: string;
}

/**
 * Renders a relative timestamp without causing SSR hydration mismatches.
 * On the server (and first client render) we emit a stable placeholder, then
 * swap to the live relative string after mount. This avoids the case where
 * `Date.now()` differs between the SSR pass and client hydration.
 */
export function RelativeTime({ iso, className }: Props) {
  const [label, setLabel] = useState<string | null>(null);

  useEffect(() => {
    setLabel(relativeTime(iso));
    const id = window.setInterval(() => setLabel(relativeTime(iso)), 30_000);
    return () => window.clearInterval(id);
  }, [iso]);

  return (
    <span className={className} suppressHydrationWarning>
      {label ?? "—"}
    </span>
  );
}
