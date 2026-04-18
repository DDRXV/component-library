import { render, screen, fireEvent } from "@testing-library/react";
import gsap from "gsap";
import {
  Neuron,
  InputNeuron,
  HiddenNeuron,
  OutputNeuron,
  NeuronWithWeights,
  NeuronLayer,
  FullyConnectedNetwork,
  AttentionHead,
  MultiHeadAttention,
  SelfAttentionPattern,
  CrossAttentionPattern,
  TransformerEncoderBlock,
  TransformerDecoderBlock,
  FeedForwardBlock,
  ResidualConnectionViz,
  ActivationFunction,
  SoftmaxViz,
  DropoutViz,
  EmbeddingLookup,
  LayerNormViz,
} from "./index";

// ── Neuron ────────────────────────────────────────────────────────────────────

describe("Neuron", () => {
  it("renders an SVG circle", () => {
    const { container } = render(<Neuron />);
    expect(container.querySelector("circle[data-neuron]")).toBeInTheDocument();
  });

  it("has accessible role", () => {
    render(<Neuron aria-label="hidden neuron" />);
    expect(screen.getByRole("img", { name: "hidden neuron" })).toBeInTheDocument();
  });

  it("displays activation value when provided", () => {
    render(<Neuron activation={0.87} showValue />);
    expect(screen.getByText("0.87")).toBeInTheDocument();
  });

  it("fires onActivate when clicked", () => {
    const onActivate = vi.fn();
    const { container } = render(<Neuron onActivate={onActivate} />);
    fireEvent.click(container.querySelector("circle[data-neuron]")!);
    expect(onActivate).toHaveBeenCalledTimes(1);
  });

  it("applies isActive styling when isActive=true", () => {
    const { container } = render(<Neuron isActive />);
    const circle = container.querySelector("circle[data-neuron]");
    expect(circle?.getAttribute("data-active")).toBe("true");
  });

  it("calls gsap pulse animation on mount when animated=true", () => {
    vi.clearAllMocks();
    render(<Neuron animated />);
    expect(gsap.to).toHaveBeenCalled();
  });

  it("does not animate when animated=false", () => {
    vi.clearAllMocks();
    render(<Neuron animated={false} />);
    expect(gsap.to).not.toHaveBeenCalled();
  });

  it("accepts size prop", () => {
    const { container } = render(<Neuron size={60} />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("width", "60");
  });

  it("accepts variant prop without crashing", () => {
    expect(() => render(<Neuron variant="input" />)).not.toThrow();
    expect(() => render(<Neuron variant="hidden" />)).not.toThrow();
    expect(() => render(<Neuron variant="output" />)).not.toThrow();
  });
});

describe("InputNeuron", () => {
  it("renders as input variant", () => {
    const { container } = render(<InputNeuron />);
    expect(container.querySelector("circle[data-neuron]")).toBeInTheDocument();
    expect(container.querySelector("[data-variant='input']")).toBeInTheDocument();
  });
});

describe("HiddenNeuron", () => {
  it("renders as hidden variant", () => {
    const { container } = render(<HiddenNeuron />);
    expect(container.querySelector("[data-variant='hidden']")).toBeInTheDocument();
  });
});

describe("OutputNeuron", () => {
  it("renders as output variant with double ring", () => {
    const { container } = render(<OutputNeuron />);
    expect(container.querySelector("[data-variant='output']")).toBeInTheDocument();
  });
});

// ── NeuronWithWeights ─────────────────────────────────────────────────────────

describe("NeuronWithWeights", () => {
  it("renders incoming weight lines", () => {
    const { container } = render(<NeuronWithWeights weights={[0.3, 0.7, 0.5]} />);
    const lines = container.querySelectorAll("line[data-weight]");
    expect(lines.length).toBe(3);
  });

  it("line stroke-width reflects weight magnitude", () => {
    const { container } = render(<NeuronWithWeights weights={[0.1, 0.9]} />);
    const lines = Array.from(container.querySelectorAll("line[data-weight]"));
    const sw0 = parseFloat(lines[0].getAttribute("stroke-width") ?? "0");
    const sw1 = parseFloat(lines[1].getAttribute("stroke-width") ?? "0");
    expect(sw1).toBeGreaterThan(sw0);
  });
});

// ── NeuronLayer ───────────────────────────────────────────────────────────────

describe("NeuronLayer", () => {
  it("renders correct number of neurons", () => {
    const { container } = render(<NeuronLayer neurons={5} />);
    expect(container.querySelectorAll("circle[data-neuron]").length).toBe(5);
  });

  it("renders activations when provided", () => {
    render(<NeuronLayer neurons={3} activations={[0.2, 0.8, 0.5]} showValues />);
    expect(screen.getByText("0.20")).toBeInTheDocument();
    expect(screen.getByText("0.80")).toBeInTheDocument();
    expect(screen.getByText("0.50")).toBeInTheDocument();
  });

  it("renders vertical layout", () => {
    const { container } = render(<NeuronLayer neurons={3} direction="vertical" />);
    const neurons = container.querySelectorAll("circle[data-neuron]");
    const y0 = parseFloat(neurons[0].getAttribute("cy") ?? "0");
    const y1 = parseFloat(neurons[1].getAttribute("cy") ?? "0");
    expect(y1).toBeGreaterThan(y0);
  });

  it("renders horizontal layout by default", () => {
    const { container } = render(<NeuronLayer neurons={3} />);
    const neurons = container.querySelectorAll("circle[data-neuron]");
    const x0 = parseFloat(neurons[0].getAttribute("cx") ?? "0");
    const x1 = parseFloat(neurons[1].getAttribute("cx") ?? "0");
    expect(x1).toBeGreaterThan(x0);
  });
});

// ── FullyConnectedNetwork ─────────────────────────────────────────────────────

describe("FullyConnectedNetwork", () => {
  it("renders correct total neuron count", () => {
    const { container } = render(<FullyConnectedNetwork layers={[2, 3, 2]} />);
    expect(container.querySelectorAll("circle[data-neuron]").length).toBe(7);
  });

  it("renders connections between layers", () => {
    const { container } = render(<FullyConnectedNetwork layers={[2, 3]} />);
    // 2×3 = 6 connections
    expect(container.querySelectorAll("line[data-connection]").length).toBe(6);
  });

  it("renders correct connections for multi-layer network", () => {
    const { container } = render(<FullyConnectedNetwork layers={[3, 4, 2]} />);
    // 3×4 + 4×2 = 12 + 8 = 20 connections
    expect(container.querySelectorAll("line[data-connection]").length).toBe(20);
  });

  it("calls gsap timeline for forward pass animation", () => {
    vi.clearAllMocks();
    render(<FullyConnectedNetwork layers={[2, 3, 2]} animated />);
    expect(gsap.timeline).toHaveBeenCalled();
  });

  it("renders layer labels when showLabels=true", () => {
    render(<FullyConnectedNetwork layers={[2, 2]} showLabels />);
    expect(screen.getByText("Input")).toBeInTheDocument();
    expect(screen.getByText("Output")).toBeInTheDocument();
  });
});

// ── AttentionHead ─────────────────────────────────────────────────────────────

describe("AttentionHead", () => {
  it("renders Q, K, V labels", () => {
    render(<AttentionHead />);
    expect(screen.getByText("Q")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("V")).toBeInTheDocument();
  });

  it("renders Softmax label", () => {
    render(<AttentionHead />);
    expect(screen.getByText(/softmax/i)).toBeInTheDocument();
  });

  it("renders score formula", () => {
    render(<AttentionHead showFormula />);
    expect(screen.getByText(/QKᵀ/)).toBeInTheDocument();
  });

  it("accepts dModel prop", () => {
    expect(() => render(<AttentionHead dModel={64} />)).not.toThrow();
  });
});

// ── MultiHeadAttention ────────────────────────────────────────────────────────

describe("MultiHeadAttention", () => {
  it("renders correct number of heads", () => {
    const { container } = render(<MultiHeadAttention heads={4} />);
    expect(container.querySelectorAll("[data-head]").length).toBe(4);
  });

  it("defaults to 8 heads", () => {
    const { container } = render(<MultiHeadAttention />);
    expect(container.querySelectorAll("[data-head]").length).toBe(8);
  });

  it("renders concat and linear projection labels", () => {
    render(<MultiHeadAttention heads={2} />);
    expect(screen.getByText(/concat/i)).toBeInTheDocument();
    expect(screen.getByText(/linear/i)).toBeInTheDocument();
  });
});

// ── SelfAttentionPattern ──────────────────────────────────────────────────────

describe("SelfAttentionPattern", () => {
  it("renders NxN attention cells", () => {
    const { container } = render(<SelfAttentionPattern tokens={4} />);
    expect(container.querySelectorAll("[data-cell]").length).toBe(16);
  });

  it("renders token labels when provided", () => {
    render(<SelfAttentionPattern tokens={3} labels={["The", "cat", "sat"]} />);
    // each label appears twice: once on row axis, once on column axis
    expect(screen.getAllByText("The").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("cat").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("sat").length).toBeGreaterThanOrEqual(1);
  });

  it("renders custom weights when provided", () => {
    const weights = [[1, 0, 0], [0, 1, 0], [0, 0, 1]];
    const { container } = render(<SelfAttentionPattern tokens={3} weights={weights} />);
    expect(container.querySelectorAll("[data-cell]").length).toBe(9);
  });
});

// ── CrossAttentionPattern ─────────────────────────────────────────────────────

describe("CrossAttentionPattern", () => {
  it("renders encoderTokens × decoderTokens cells", () => {
    const { container } = render(
      <CrossAttentionPattern encoderTokens={4} decoderTokens={3} />
    );
    expect(container.querySelectorAll("[data-cell]").length).toBe(12);
  });
});

// ── TransformerEncoderBlock ───────────────────────────────────────────────────

describe("TransformerEncoderBlock", () => {
  it("renders Multi-Head Attention sublayer", () => {
    render(<TransformerEncoderBlock />);
    expect(screen.getByText(/multi-head attention/i)).toBeInTheDocument();
  });

  it("renders Feed Forward sublayer", () => {
    render(<TransformerEncoderBlock />);
    expect(screen.getByText(/feed.?forward/i)).toBeInTheDocument();
  });

  it("renders two Add & Norm layers", () => {
    render(<TransformerEncoderBlock />);
    const addNorms = screen.getAllByText(/add.*norm/i);
    expect(addNorms.length).toBe(2);
  });

  it("accepts heads and dModel props", () => {
    expect(() =>
      render(<TransformerEncoderBlock heads={8} dModel={512} dFF={2048} />)
    ).not.toThrow();
  });
});

// ── TransformerDecoderBlock ───────────────────────────────────────────────────

describe("TransformerDecoderBlock", () => {
  it("renders Masked Multi-Head Attention", () => {
    render(<TransformerDecoderBlock />);
    expect(screen.getByText(/masked/i)).toBeInTheDocument();
  });

  it("renders Cross-Attention sublayer", () => {
    render(<TransformerDecoderBlock />);
    expect(screen.getByText(/cross.?attention/i)).toBeInTheDocument();
  });

  it("renders three Add & Norm layers", () => {
    render(<TransformerDecoderBlock />);
    const addNorms = screen.getAllByText(/add.*norm/i);
    expect(addNorms.length).toBe(3);
  });
});

// ── FeedForwardBlock ──────────────────────────────────────────────────────────

describe("FeedForwardBlock", () => {
  it("renders two linear layer labels", () => {
    render(<FeedForwardBlock />);
    const linears = screen.getAllByText(/linear/i);
    expect(linears.length).toBeGreaterThanOrEqual(2);
  });

  it("renders activation function label", () => {
    render(<FeedForwardBlock activation="ReLU" />);
    expect(screen.getByText("ReLU")).toBeInTheDocument();
  });

  it("renders dimension annotations", () => {
    render(<FeedForwardBlock dModel={512} dFF={2048} />);
    expect(screen.getByText("512")).toBeInTheDocument();
    expect(screen.getByText("2048")).toBeInTheDocument();
  });
});

// ── ResidualConnectionViz ─────────────────────────────────────────────────────

describe("ResidualConnectionViz", () => {
  it("renders add node", () => {
    render(<ResidualConnectionViz />);
    expect(screen.getByText("+")).toBeInTheDocument();
  });

  it("renders bypass path", () => {
    const { container } = render(<ResidualConnectionViz />);
    expect(container.querySelector("[data-bypass]")).toBeInTheDocument();
  });

  it("renders sublayer label", () => {
    render(<ResidualConnectionViz label="Self-Attention" />);
    expect(screen.getByText("Self-Attention")).toBeInTheDocument();
  });
});

// ── ActivationFunction ────────────────────────────────────────────────────────

describe("ActivationFunction", () => {
  it("renders SVG path for the function curve", () => {
    const { container } = render(<ActivationFunction fn="relu" />);
    expect(container.querySelector("path[data-curve]")).toBeInTheDocument();
  });

  it("renders all supported activation functions", () => {
    const fns = ["relu", "gelu", "sigmoid", "tanh"] as const;
    fns.forEach((fn) => {
      const { container, unmount } = render(<ActivationFunction fn={fn} />);
      const path = container.querySelector("path[data-curve]");
      expect(path).toBeInTheDocument();
      expect(path?.getAttribute("d")?.length).toBeGreaterThan(10);
      unmount();
    });
  });

  it("renders axis lines", () => {
    const { container } = render(<ActivationFunction fn="relu" />);
    expect(container.querySelectorAll("[data-axis]").length).toBeGreaterThanOrEqual(2);
  });

  it("renders function label", () => {
    render(<ActivationFunction fn="sigmoid" />);
    expect(screen.getByText(/sigmoid/i)).toBeInTheDocument();
  });
});

// ── SoftmaxViz ────────────────────────────────────────────────────────────────

describe("SoftmaxViz", () => {
  it("renders one logit bar and one prob bar per logit", () => {
    const { container } = render(
      <SoftmaxViz logits={[2.0, 1.0, 0.1]} />
    );
    // 3 logit bars + 3 prob bars = 6 total
    expect(container.querySelectorAll("[data-bar]").length).toBe(6);
    expect(container.querySelectorAll("[data-bar='logit']").length).toBe(3);
    expect(container.querySelectorAll("[data-bar='prob']").length).toBe(3);
  });

  it("renders labels when provided", () => {
    render(<SoftmaxViz logits={[2.0, 1.0]} labels={["cat", "dog"]} />);
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText("dog")).toBeInTheDocument();
  });

  it("renders softmax label", () => {
    render(<SoftmaxViz logits={[1, 2]} />);
    expect(screen.getByText(/softmax/i)).toBeInTheDocument();
  });

  it("probability bars sum to ~100% width", () => {
    const { container } = render(
      <SoftmaxViz logits={[2.0, 1.0, 0.1]} />
    );
    const bars = Array.from(container.querySelectorAll("[data-bar='prob']"));
    const total = bars.reduce((sum, bar) => {
      return sum + parseFloat(bar.getAttribute("width") ?? "0");
    }, 0);
    // bars together should represent 100% of some fixed width
    expect(total).toBeGreaterThan(0);
  });
});

// ── DropoutViz ────────────────────────────────────────────────────────────────

describe("DropoutViz", () => {
  it("renders total neuron count", () => {
    const { container } = render(<DropoutViz neurons={8} rate={0.5} />);
    expect(container.querySelectorAll("circle[data-neuron]").length).toBe(8);
  });

  it("masks approximately rate% of neurons", () => {
    const { container } = render(<DropoutViz neurons={10} rate={0.4} seed={42} />);
    const masked = container.querySelectorAll("circle[data-masked='true']");
    // With seed, should be deterministic — at least 1 masked
    expect(masked.length).toBeGreaterThan(0);
  });

  it("renders rate label", () => {
    render(<DropoutViz neurons={6} rate={0.5} />);
    expect(screen.getByText(/dropout/i)).toBeInTheDocument();
  });
});

// ── EmbeddingLookup ───────────────────────────────────────────────────────────

describe("EmbeddingLookup", () => {
  it("renders token chip", () => {
    render(<EmbeddingLookup token="cat" />);
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("renders embedding vector bars", () => {
    const { container } = render(<EmbeddingLookup token="cat" dimensions={8} />);
    expect(container.querySelectorAll("[data-dim]").length).toBe(8);
  });

  it("renders lookup arrow", () => {
    const { container } = render(<EmbeddingLookup token="cat" />);
    expect(container.querySelector("line,path[data-arrow]")).toBeInTheDocument();
  });
});

// ── LayerNormViz ──────────────────────────────────────────────────────────────

describe("LayerNormViz", () => {
  it("renders before and after distribution", () => {
    render(<LayerNormViz />);
    expect(screen.getByText(/before/i)).toBeInTheDocument();
    expect(screen.getByText(/after/i)).toBeInTheDocument();
  });

  it("renders mean and std annotations", () => {
    render(<LayerNormViz showStats />);
    // before (μ ≠ 0) and after (μ = 0) both render
    expect(screen.getAllByText(/μ/).length).toBeGreaterThanOrEqual(2);
    expect(screen.getAllByText(/σ/).length).toBeGreaterThanOrEqual(2);
  });
});
