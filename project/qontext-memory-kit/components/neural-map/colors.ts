import type { EntityType } from "@/lib/types";

/**
 * Read a CSS variable from :root and return its current value.
 * SSR-safe: returns a sensible fallback when window is not available.
 */
export function cssVar(name: string, fallback = "#888"): string {
  if (typeof window === "undefined") return fallback;
  const v = getComputedStyle(document.documentElement)
    .getPropertyValue(name)
    .trim();
  return v || fallback;
}

export function entityColor(type: EntityType): string {
  return cssVar(`--graph-${type}`);
}

/** Edge color based on whether the underlying fact is in conflict / human / ai. */
export function edgeColor(opts: {
  inConflict?: boolean;
  factSource?: "ai" | "human";
}): string {
  if (opts.inConflict) return cssVar("--graph-conflict");
  if (opts.factSource === "human") return cssVar("--graph-human");
  return cssVar("--graph-ai");
}

/** Apply alpha to a hex/oklch color via CSS color-mix; falls back to hex+alpha-byte if hex. */
export function withAlpha(color: string, alpha: number): string {
  // If color is a hex, append alpha byte for a fast path.
  const hex = color.match(/^#([0-9a-f]{6})$/i);
  if (hex) {
    const a = Math.round(alpha * 255).toString(16).padStart(2, "0");
    return `#${hex[1]}${a}`;
  }
  return `color-mix(in oklab, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}
