import { colors, durations, easings, GSAP_DURATIONS, GSAP_EASINGS } from "./tokens";

describe("Design tokens", () => {
  describe("colors", () => {
    const expectedColors = [
      "neuron", "data", "gradient", "loss", "accuracy",
      "attention", "embedding", "weight", "token", "inference",
      "agent", "warning",
    ];

    it.each(expectedColors)("exports %s color as a CSS variable", (name) => {
      expect(colors[name as keyof typeof colors]).toBe(`var(--color-${name})`);
    });

    it("exports all 12 semantic colors", () => {
      expect(Object.keys(colors)).toHaveLength(12);
    });
  });

  describe("durations", () => {
    const expectedDurations = ["instant", "fast", "normal", "slow", "slower", "flow"];

    it.each(expectedDurations)("exports %s duration as a CSS variable", (name) => {
      expect(durations[name as keyof typeof durations]).toBe(`var(--duration-${name})`);
    });
  });

  describe("easings", () => {
    it("exports all easing CSS variables", () => {
      expect(Object.keys(easings)).toHaveLength(4);
      expect(easings.flow).toBe("var(--ease-flow)");
      expect(easings.spring).toBe("var(--ease-spring)");
    });
  });

  describe("GSAP tokens", () => {
    it("GSAP_DURATIONS are numeric seconds", () => {
      Object.values(GSAP_DURATIONS).forEach((v) => {
        expect(typeof v).toBe("number");
        expect(v).toBeGreaterThan(0);
      });
    });

    it("GSAP_EASINGS are non-empty strings", () => {
      Object.values(GSAP_EASINGS).forEach((v) => {
        expect(typeof v).toBe("string");
        expect(v.length).toBeGreaterThan(0);
      });
    });

    it("GSAP_DURATIONS has same keys as durations", () => {
      expect(Object.keys(GSAP_DURATIONS).sort()).toEqual(Object.keys(durations).sort());
    });
  });
});
