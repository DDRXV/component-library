import "@testing-library/jest-dom";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

expect.extend(toHaveNoViolations);

// Suppress GSAP warnings in tests
const mockTween = { kill: vi.fn(), pause: vi.fn(), play: vi.fn() };
const mockTimeline = () => ({
  to: vi.fn().mockReturnThis(),
  from: vi.fn().mockReturnThis(),
  fromTo: vi.fn().mockReturnThis(),
  set: vi.fn().mockReturnThis(),
  play: vi.fn().mockReturnThis(),
  pause: vi.fn().mockReturnThis(),
  kill: vi.fn().mockReturnThis(),
  repeat: vi.fn().mockReturnThis(),
});

vi.mock("gsap", () => ({
  default: {
    to: vi.fn(() => mockTween),
    from: vi.fn(() => mockTween),
    fromTo: vi.fn(() => mockTween),
    set: vi.fn(() => mockTween),
    killTweensOf: vi.fn(),
    registerPlugin: vi.fn(),
    timeline: vi.fn(mockTimeline),
    matchMedia: vi.fn(() => ({
      add: vi.fn(),
      revert: vi.fn(),
      kill: vi.fn(),
    })),
  },
  gsap: {
    to: vi.fn(() => mockTween),
    from: vi.fn(() => mockTween),
    set: vi.fn(),
    killTweensOf: vi.fn(),
    timeline: vi.fn(mockTimeline),
  },
}));

// Mock window.matchMedia for reduced-motion tests
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
