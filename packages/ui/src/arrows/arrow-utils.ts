import { useEffect, useState } from "react";

export function resolveColor(color?: string): string {
  if (!color) return "var(--color-text-secondary)";
  if (
    color.startsWith("var(") ||
    color.startsWith("#") ||
    color.startsWith("rgb")
  )
    return color;
  return `var(--color-${color})`;
}

export function useReducedMotion(): boolean {
  // Lazy init reads matchMedia synchronously so first render is correct
  const [reduced, setReduced] = useState(
    () => window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

// Compute a unique-enough ID prefix from a base name
export function useArrowId(base: string): string {
  // stable across renders, unique per mount via counter
  return `${base}-${Math.random().toString(36).slice(2, 7)}`;
}
