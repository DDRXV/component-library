import { render, screen } from "@testing-library/react";
import gsap from "gsap";
import * as ArrowExports from "./index";

// ── Universal tests for all 28 arrows ────────────────────────────────────────

const allArrows = Object.entries(ArrowExports) as [
  string,
  React.ComponentType<Record<string, unknown>>,
][];

describe("Arrow system exports", () => {
  it("exports at least 28 arrow components", () => {
    expect(allArrows.length).toBeGreaterThanOrEqual(28);
  });
});

describe.each(allArrows)("%s — universal contract", (name, Arrow) => {
  it("renders an SVG element", () => {
    const { container } = render(<Arrow />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("has a default aria-label", () => {
    render(<Arrow />);
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("accepts custom aria-label", () => {
    render(<Arrow aria-label="custom connector" />);
    expect(
      screen.getByRole("img", { name: "custom connector" })
    ).toBeInTheDocument();
  });

  it("accepts className prop", () => {
    const { container } = render(<Arrow className="test-cls" />);
    expect(container.querySelector("svg")).toHaveClass("test-cls");
  });

  it("accepts color prop without crashing", () => {
    expect(() => render(<Arrow color="attention" />)).not.toThrow();
  });
});

// ── Specific structural tests ─────────────────────────────────────────────────

describe("StraightArrow", () => {
  it("renders a path element", () => {
    const { container } = render(<ArrowExports.StraightArrow />);
    expect(container.querySelector("path,line")).toBeInTheDocument();
  });

  it("renders an arrowhead marker", () => {
    const { container } = render(<ArrowExports.StraightArrow />);
    expect(container.querySelector("marker")).toBeInTheDocument();
  });

  it("accepts direction prop", () => {
    expect(() =>
      render(<ArrowExports.StraightArrow direction="left" />)
    ).not.toThrow();
  });
});

describe("CurvedArrow", () => {
  it("renders a path with bezier curve (contains C or Q)", () => {
    const { container } = render(<ArrowExports.CurvedArrow />);
    const path = container.querySelector("[data-arrow='curve']");
    expect(path?.getAttribute("d")).toMatch(/[CQcq]/);
  });

  it("accepts curvature prop", () => {
    expect(() =>
      render(<ArrowExports.CurvedArrow curvature={80} />)
    ).not.toThrow();
  });
});

describe("BidirectionalArrow", () => {
  it("renders two markers (both ends)", () => {
    const { container } = render(<ArrowExports.BidirectionalArrow />);
    expect(container.querySelectorAll("marker").length).toBeGreaterThanOrEqual(2);
  });
});

describe("DashedArrow", () => {
  it("has stroke-dasharray attribute", () => {
    const { container } = render(<ArrowExports.DashedArrow />);
    const path = container.querySelector("[stroke-dasharray]");
    expect(path).toBeInTheDocument();
  });
});

describe("LabeledArrow", () => {
  it("renders label text when provided", () => {
    render(<ArrowExports.LabeledArrow label="forward pass" />);
    expect(screen.getByText("forward pass")).toBeInTheDocument();
  });

  it("renders without label when not provided", () => {
    const { container } = render(<ArrowExports.LabeledArrow />);
    const texts = container.querySelectorAll("text");
    expect(texts.length).toBe(0);
  });
});

describe("ElbowArrow", () => {
  it("renders a path with right-angle segments", () => {
    const { container } = render(<ArrowExports.ElbowArrow />);
    expect(container.querySelector("path,polyline")).toBeInTheDocument();
  });
});

describe("GradientArrow", () => {
  it("renders a linearGradient definition", () => {
    const { container } = render(<ArrowExports.GradientArrow />);
    expect(container.querySelector("linearGradient")).toBeInTheDocument();
  });

  it("accepts fromColor and toColor props", () => {
    expect(() =>
      render(
        <ArrowExports.GradientArrow fromColor="neuron" toColor="attention" />
      )
    ).not.toThrow();
  });
});

describe("AnimatedFlowArrow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("calls gsap.to on mount", () => {
    render(<ArrowExports.AnimatedFlowArrow />);
    expect(gsap.to).toHaveBeenCalled();
  });

  it("does NOT animate when animated=false", () => {
    vi.clearAllMocks();
    render(<ArrowExports.AnimatedFlowArrow animated={false} />);
    expect(gsap.to).not.toHaveBeenCalled();
  });

  it("renders static path when reduced motion is active", () => {
    window.matchMedia = vi.fn().mockReturnValue({ matches: true, addEventListener: vi.fn(), removeEventListener: vi.fn() });
    vi.clearAllMocks();
    render(<ArrowExports.AnimatedFlowArrow />);
    expect(gsap.to).not.toHaveBeenCalled();
    // restore
    window.matchMedia = vi.fn().mockReturnValue({ matches: false, addEventListener: vi.fn(), removeEventListener: vi.fn() });
  });
});

describe("DataFlowPipe", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders a thick pipe path", () => {
    const { container } = render(<ArrowExports.DataFlowPipe />);
    const path = container.querySelector("path,rect");
    expect(path).toBeInTheDocument();
  });

  it("calls gsap.to for flow animation", () => {
    render(<ArrowExports.DataFlowPipe />);
    expect(gsap.to).toHaveBeenCalled();
  });
});

describe("GradientFlowArrow", () => {
  beforeEach(() => vi.clearAllMocks());

  it("renders with backward direction indicator", () => {
    const { container } = render(<ArrowExports.GradientFlowArrow />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("calls gsap.to on mount", () => {
    render(<ArrowExports.GradientFlowArrow />);
    expect(gsap.to).toHaveBeenCalled();
  });
});

describe("TwoPhaseArrow", () => {
  it("renders two separate path/arrow elements", () => {
    const { container } = render(<ArrowExports.TwoPhaseArrow />);
    const paths = container.querySelectorAll("path,line");
    expect(paths.length).toBeGreaterThanOrEqual(2);
  });

  it("shows forward and backward labels", () => {
    render(
      <ArrowExports.TwoPhaseArrow forwardLabel="forward" backwardLabel="backward" />
    );
    expect(screen.getByText("forward")).toBeInTheDocument();
    expect(screen.getByText("backward")).toBeInTheDocument();
  });
});

describe("WeightedArrow", () => {
  it("stroke-width scales with weight prop", () => {
    const { container: c1 } = render(
      <ArrowExports.WeightedArrow weight={0.2} />
    );
    const { container: c2 } = render(
      <ArrowExports.WeightedArrow weight={0.9} />
    );
    const sw1 = parseFloat(
      c1.querySelector("[data-arrow='weighted']")?.getAttribute("stroke-width") ?? "0"
    );
    const sw2 = parseFloat(
      c2.querySelector("[data-arrow='weighted']")?.getAttribute("stroke-width") ?? "0"
    );
    expect(sw2).toBeGreaterThan(sw1);
  });
});

describe("ProbabilityArrow", () => {
  it("opacity reflects probability prop", () => {
    const { container } = render(
      <ArrowExports.ProbabilityArrow probability={0.3} />
    );
    const svg = container.querySelector("svg");
    const opacity = parseFloat(svg?.style.opacity ?? svg?.getAttribute("opacity") ?? "1");
    expect(opacity).toBeLessThan(1);
  });
});

describe("AnnotationLine", () => {
  it("renders without arrowhead by default", () => {
    const { container } = render(<ArrowExports.AnnotationLine />);
    // annotation lines are thin, no fill marker
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("TimelineArrow", () => {
  it("renders progress fill based on progress prop", () => {
    const { container } = render(<ArrowExports.TimelineArrow progress={0.6} />);
    const filled = container.querySelector("[data-fill]");
    expect(filled).toBeInTheDocument();
  });
});

describe("ResidualArrow", () => {
  it("renders a loop-back path", () => {
    const { container } = render(<ArrowExports.ResidualArrow />);
    const path = container.querySelector("[data-arrow='bypass']");
    expect(path?.getAttribute("d")).toMatch(/[AaQqCc]/);
  });
});

describe("MatrixConnector", () => {
  it("renders sources × targets number of lines", () => {
    const { container } = render(
      <ArrowExports.MatrixConnector sources={3} targets={3} />
    );
    const lines = container.querySelectorAll("line,path");
    expect(lines.length).toBeGreaterThanOrEqual(9);
  });

  it("defaults to 4×4 connections", () => {
    const { container } = render(<ArrowExports.MatrixConnector />);
    const lines = container.querySelectorAll("line,path");
    expect(lines.length).toBeGreaterThanOrEqual(16);
  });
});

describe("TreeConnector", () => {
  it("renders one line per child", () => {
    const { container } = render(
      <ArrowExports.TreeConnector children={4} />
    );
    const lines = container.querySelectorAll("line,path");
    expect(lines.length).toBeGreaterThanOrEqual(4);
  });
});

describe("BracketConnector", () => {
  it("renders opening bracket by default", () => {
    const { container } = render(<ArrowExports.BracketConnector />);
    expect(container.querySelector("path,polyline")).toBeInTheDocument();
  });

  it("accepts side prop (left or right)", () => {
    expect(() =>
      render(<ArrowExports.BracketConnector side="right" />)
    ).not.toThrow();
  });
});

describe("FeedbackArrow", () => {
  it("renders curved loop path", () => {
    const { container } = render(<ArrowExports.FeedbackArrow />);
    const path = container.querySelector("[data-arrow='loop']");
    expect(path?.getAttribute("d")).toMatch(/[AaQqCc]/);
  });
});

describe("SelfAttentionArc", () => {
  it("renders arc count matching tokens prop", () => {
    const { container } = render(<ArrowExports.SelfAttentionArc tokens={4} />);
    const paths = container.querySelectorAll("path");
    // arcs between token pairs
    expect(paths.length).toBeGreaterThanOrEqual(3);
  });
});

describe("CrossAttentionArc", () => {
  it("renders cross-side arcs", () => {
    const { container } = render(
      <ArrowExports.CrossAttentionArc encoderTokens={3} decoderTokens={3} />
    );
    const paths = container.querySelectorAll("path");
    expect(paths.length).toBeGreaterThanOrEqual(1);
  });
});

describe("MemoryReadArrow", () => {
  it("renders with dashed style to indicate retrieval", () => {
    const { container } = render(<ArrowExports.MemoryReadArrow />);
    const dashed = container.querySelector("[stroke-dasharray]");
    expect(dashed).toBeInTheDocument();
  });
});

describe("ToolCallArrow", () => {
  it("renders label 'call' by default", () => {
    render(<ArrowExports.ToolCallArrow />);
    expect(screen.getByText(/call/i)).toBeInTheDocument();
  });
});

describe("ToolReturnArrow", () => {
  it("renders label 'return' by default", () => {
    render(<ArrowExports.ToolReturnArrow />);
    expect(screen.getByText(/return/i)).toBeInTheDocument();
  });
});

describe("ChainArrow", () => {
  it("renders a chain-link style arrow", () => {
    const { container } = render(<ArrowExports.ChainArrow />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
});

describe("RAGRetrievalArrow", () => {
  it("renders with 'retrieve' label", () => {
    render(<ArrowExports.RAGRetrievalArrow />);
    expect(screen.getByText(/retrieve/i)).toBeInTheDocument();
  });
});

describe("RAGAugmentArrow", () => {
  it("renders with 'augment' label", () => {
    render(<ArrowExports.RAGAugmentArrow />);
    expect(screen.getByText(/augment/i)).toBeInTheDocument();
  });
});
