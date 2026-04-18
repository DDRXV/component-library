export const colors = {
  neuron: "var(--color-neuron)",
  data: "var(--color-data)",
  gradient: "var(--color-gradient)",
  loss: "var(--color-loss)",
  accuracy: "var(--color-accuracy)",
  attention: "var(--color-attention)",
  embedding: "var(--color-embedding)",
  weight: "var(--color-weight)",
  token: "var(--color-token)",
  inference: "var(--color-inference)",
  agent: "var(--color-agent)",
  warning: "var(--color-warning)",
} as const;

export type ColorName = keyof typeof colors;

export const durations = {
  instant: "var(--duration-instant)",
  fast: "var(--duration-fast)",
  normal: "var(--duration-normal)",
  slow: "var(--duration-slow)",
  slower: "var(--duration-slower)",
  flow: "var(--duration-flow)",
} as const;

export const easings = {
  flow: "var(--ease-flow)",
  spring: "var(--ease-spring)",
  outExpo: "var(--ease-out-expo)",
  inExpo: "var(--ease-in-expo)",
} as const;

export const GSAP_EASINGS = {
  flow: "power2.inOut",
  spring: "back.out(1.7)",
  outExpo: "expo.out",
  inExpo: "expo.in",
} as const;

export const GSAP_DURATIONS = {
  instant: 0.05,
  fast: 0.15,
  normal: 0.3,
  slow: 0.5,
  slower: 0.8,
  flow: 1.2,
} as const;
