import { render, screen } from "@testing-library/react";
import * as Icons from "./index";

const allIcons = Object.entries(Icons) as [string, React.ComponentType<{ size?: number; "aria-label"?: string; className?: string }>][];

describe("Icon system", () => {
  it("exports at least 40 icons", () => {
    expect(allIcons.length).toBeGreaterThanOrEqual(40);
  });

  describe.each(allIcons)("%s", (name, IconComponent) => {
    it("renders an SVG element", () => {
      const { container } = render(<IconComponent />);
      expect(container.querySelector("svg")).toBeInTheDocument();
    });

    it("has a default aria-label", () => {
      render(<IconComponent />);
      expect(screen.getByRole("img")).toBeInTheDocument();
    });

    it("accepts custom aria-label", () => {
      render(<IconComponent aria-label="custom label" />);
      expect(screen.getByRole("img", { name: "custom label" })).toBeInTheDocument();
    });

    it("accepts size prop", () => {
      const { container } = render(<IconComponent size={32} />);
      const svg = container.querySelector("svg");
      expect(svg).toHaveAttribute("width", "32");
      expect(svg).toHaveAttribute("height", "32");
    });

    it("forwards className", () => {
      const { container } = render(<IconComponent className="test-class" />);
      expect(container.querySelector("svg")).toHaveClass("test-class");
    });
  });
});
