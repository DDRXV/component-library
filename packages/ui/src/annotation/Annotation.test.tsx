import { render, screen, fireEvent } from "@testing-library/react";
import {
  KeyTakeaway,
  DefinitionCard,
  WarnBox,
  TipBox,
  NoteBox,
  QuoteBlock,
  AnalogyCard,
  CommonMistake,
  SourceCitation,
  IntuitiveExplanation,
  GlossaryTerm,
  DeepDiveLink,
  Callout,
  FloatingLabel,
  MathAnnotation,
  CodeAnnotation,
  StepBubble,
  FormulaBreakdown,
  PseudoCode,
  Highlight,
} from "./index";

// ── KeyTakeaway ───────────────────────────────────────────────────────────────
describe("KeyTakeaway", () => {
  it("renders content", () => {
    render(<KeyTakeaway>Attention scales as O(n²)</KeyTakeaway>);
    expect(screen.getByText("Attention scales as O(n²)")).toBeInTheDocument();
  });
  it("renders key takeaway label", () => {
    render(<KeyTakeaway>content</KeyTakeaway>);
    expect(screen.getByText(/key takeaway/i)).toBeInTheDocument();
  });
  it("renders all variants without crashing", () => {
    const variants = ["default", "success", "warning", "info"] as const;
    variants.forEach(v => {
      expect(() => render(<KeyTakeaway variant={v}>x</KeyTakeaway>)).not.toThrow();
    });
  });
});

// ── DefinitionCard ────────────────────────────────────────────────────────────
describe("DefinitionCard", () => {
  it("renders the term", () => {
    render(<DefinitionCard term="Attention" definition="A mechanism that weighs token importance." />);
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });
  it("renders the definition", () => {
    render(<DefinitionCard term="Attention" definition="A mechanism that weighs token importance." />);
    expect(screen.getByText("A mechanism that weighs token importance.")).toBeInTheDocument();
  });
  it("renders optional example", () => {
    render(<DefinitionCard term="T" definition="D" example="e.g. self-attention" />);
    expect(screen.getByText(/e\.g\. self-attention/)).toBeInTheDocument();
  });
});

// ── WarnBox ───────────────────────────────────────────────────────────────────
describe("WarnBox", () => {
  it("renders content", () => {
    render(<WarnBox>Don't use bias in LayerNorm</WarnBox>);
    expect(screen.getByText("Don't use bias in LayerNorm")).toBeInTheDocument();
  });
  it("renders warning label", () => {
    render(<WarnBox>content</WarnBox>);
    expect(screen.getByText(/warn|caution|pitfall/i)).toBeInTheDocument();
  });
  it("renders custom label", () => {
    render(<WarnBox label="Common Pitfall">content</WarnBox>);
    expect(screen.getByText("Common Pitfall")).toBeInTheDocument();
  });
});

// ── TipBox ────────────────────────────────────────────────────────────────────
describe("TipBox", () => {
  it("renders content", () => {
    render(<TipBox>Use gradient checkpointing for large batches.</TipBox>);
    expect(screen.getByText("Use gradient checkpointing for large batches.")).toBeInTheDocument();
  });
  it("renders tip label", () => {
    render(<TipBox>content</TipBox>);
    expect(screen.getByText(/tip|pro tip/i)).toBeInTheDocument();
  });
});

// ── NoteBox ───────────────────────────────────────────────────────────────────
describe("NoteBox", () => {
  it("renders content", () => {
    render(<NoteBox>Original transformer used 512 dimensions.</NoteBox>);
    expect(screen.getByText("Original transformer used 512 dimensions.")).toBeInTheDocument();
  });
  it("renders note label", () => {
    render(<NoteBox>content</NoteBox>);
    expect(screen.getByText(/note/i)).toBeInTheDocument();
  });
});

// ── QuoteBlock ────────────────────────────────────────────────────────────────
describe("QuoteBlock", () => {
  it("renders quote text", () => {
    const { container } = render(<QuoteBlock citation="Vaswani et al.">Attention is all you need.</QuoteBlock>);
    // text is wrapped in curly quotes by the component
    expect(container.textContent).toContain("Attention is all you need.");
  });
  it("renders citation", () => {
    render(<QuoteBlock citation="Vaswani et al., 2017">quote</QuoteBlock>);
    expect(screen.getByText(/Vaswani et al., 2017/)).toBeInTheDocument();
  });
});

// ── AnalogyCard ───────────────────────────────────────────────────────────────
describe("AnalogyCard", () => {
  it("renders concept", () => {
    render(<AnalogyCard concept="Attention" analogy="Like a search engine query over values." />);
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });
  it("renders analogy text", () => {
    render(<AnalogyCard concept="Attention" analogy="Like a search engine query over values." />);
    expect(screen.getByText("Like a search engine query over values.")).toBeInTheDocument();
  });
  it("renders 'is like' connector", () => {
    render(<AnalogyCard concept="A" analogy="B" />);
    expect(screen.getByText(/is like/i)).toBeInTheDocument();
  });
});

// ── CommonMistake ─────────────────────────────────────────────────────────────
describe("CommonMistake", () => {
  it("renders mistake description", () => {
    render(<CommonMistake>Forgetting to scale dot products by √dₖ.</CommonMistake>);
    expect(screen.getByText("Forgetting to scale dot products by √dₖ.")).toBeInTheDocument();
  });
  it("renders mistake label", () => {
    render(<CommonMistake>x</CommonMistake>);
    expect(screen.getByText(/common mistake|anti-pattern/i)).toBeInTheDocument();
  });
  it("renders fix when provided", () => {
    render(<CommonMistake fix="Divide by √dₖ">Don't forget scaling.</CommonMistake>);
    expect(screen.getByText(/√dₖ/)).toBeInTheDocument();
    expect(screen.getByText(/fix/i)).toBeInTheDocument();
  });
});

// ── SourceCitation ────────────────────────────────────────────────────────────
describe("SourceCitation", () => {
  it("renders title", () => {
    render(<SourceCitation title="Attention Is All You Need" url="https://arxiv.org/abs/1706.03762" />);
    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument();
  });
  it("renders authors when provided", () => {
    render(<SourceCitation title="T" authors="Vaswani et al." url="#" />);
    expect(screen.getByText(/Vaswani et al\./)).toBeInTheDocument();
  });
  it("renders year when provided", () => {
    render(<SourceCitation title="T" year={2017} url="#" />);
    expect(screen.getByText("2017")).toBeInTheDocument();
  });
});

// ── IntuitiveExplanation ──────────────────────────────────────────────────────
describe("IntuitiveExplanation", () => {
  it("renders content", () => {
    render(<IntuitiveExplanation>Attention lets each word look at all other words.</IntuitiveExplanation>);
    expect(screen.getByText("Attention lets each word look at all other words.")).toBeInTheDocument();
  });
  it("renders 'in plain english' heading", () => {
    render(<IntuitiveExplanation>content</IntuitiveExplanation>);
    expect(screen.getByText(/plain english|intuition/i)).toBeInTheDocument();
  });
  it("accepts technical label override", () => {
    render(<IntuitiveExplanation label="Intuition">content</IntuitiveExplanation>);
    expect(screen.getByText("Intuition")).toBeInTheDocument();
  });
});

// ── GlossaryTerm ──────────────────────────────────────────────────────────────
describe("GlossaryTerm", () => {
  it("renders term text", () => {
    render(<GlossaryTerm term="softmax" definition="Normalises a vector to sum to 1." />);
    expect(screen.getByText("softmax")).toBeInTheDocument();
  });
  it("renders definition", () => {
    render(<GlossaryTerm term="softmax" definition="Normalises a vector to sum to 1." />);
    expect(screen.getByText("Normalises a vector to sum to 1.")).toBeInTheDocument();
  });
});

// ── DeepDiveLink ──────────────────────────────────────────────────────────────
describe("DeepDiveLink", () => {
  it("renders title", () => {
    render(<DeepDiveLink title="How GELU works">Detailed explanation here...</DeepDiveLink>);
    expect(screen.getByText("How GELU works")).toBeInTheDocument();
  });
  it("hides content by default", () => {
    render(<DeepDiveLink title="T">Hidden content</DeepDiveLink>);
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
  it("reveals content on click", () => {
    render(<DeepDiveLink title="T">Hidden content</DeepDiveLink>);
    fireEvent.click(screen.getByText("T"));
    expect(screen.getByText("Hidden content")).toBeInTheDocument();
  });
  it("hides content again on second click", () => {
    render(<DeepDiveLink title="T">Hidden content</DeepDiveLink>);
    fireEvent.click(screen.getByText("T"));
    fireEvent.click(screen.getByText("T"));
    expect(screen.queryByText("Hidden content")).not.toBeInTheDocument();
  });
});

// ── Callout ───────────────────────────────────────────────────────────────────
describe("Callout", () => {
  it("renders callout text", () => {
    render(<Callout>This is important!</Callout>);
    expect(screen.getByText("This is important!")).toBeInTheDocument();
  });
  it("renders SVG arrow when direction is set", () => {
    const { container } = render(<Callout direction="right">Note</Callout>);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });
  it("renders all directions without crashing", () => {
    const dirs = ["up", "down", "left", "right"] as const;
    dirs.forEach(d => {
      expect(() => render(<Callout direction={d}>x</Callout>)).not.toThrow();
    });
  });
});

// ── FloatingLabel ─────────────────────────────────────────────────────────────
describe("FloatingLabel", () => {
  it("renders label text", () => {
    render(<FloatingLabel>dₖ = 64</FloatingLabel>);
    expect(screen.getByText("dₖ = 64")).toBeInTheDocument();
  });
  it("renders with connector line", () => {
    const { container } = render(<FloatingLabel showLine>label</FloatingLabel>);
    expect(container.querySelector("line,svg")).toBeInTheDocument();
  });
});

// ── MathAnnotation ────────────────────────────────────────────────────────────
describe("MathAnnotation", () => {
  it("renders the explanation label", () => {
    render(<MathAnnotation formula="\\frac{QK^T}{\\sqrt{d_k}}" label="Scaled dot-product" />);
    expect(screen.getByText("Scaled dot-product")).toBeInTheDocument();
  });
  it("renders formula container", () => {
    const { container } = render(<MathAnnotation formula="x^2" />);
    expect(container.querySelector("[data-formula]")).toBeInTheDocument();
  });
  it("renders without label", () => {
    expect(() => render(<MathAnnotation formula="x^2" />)).not.toThrow();
  });
});

// ── CodeAnnotation ────────────────────────────────────────────────────────────
describe("CodeAnnotation", () => {
  it("renders code snippet", () => {
    render(<CodeAnnotation code="model.fit(X, y)" annotation="Trains on the full dataset." />);
    expect(screen.getByText("model.fit(X, y)")).toBeInTheDocument();
  });
  it("renders annotation text", () => {
    render(<CodeAnnotation code="x" annotation="Trains on the full dataset." />);
    expect(screen.getByText("Trains on the full dataset.")).toBeInTheDocument();
  });
  it("renders language label when provided", () => {
    render(<CodeAnnotation code="import torch" language="python" annotation="x" />);
    expect(screen.getByText("python")).toBeInTheDocument();
  });
});

// ── StepBubble ────────────────────────────────────────────────────────────────
describe("StepBubble", () => {
  it("renders step number", () => {
    render(<StepBubble step={3} label="Compute attention scores" />);
    expect(screen.getByText("3")).toBeInTheDocument();
  });
  it("renders label", () => {
    render(<StepBubble step={1} label="Compute attention scores" />);
    expect(screen.getByText("Compute attention scores")).toBeInTheDocument();
  });
  it("renders description when provided", () => {
    render(<StepBubble step={1} label="Forward pass" description="Run data through all layers" />);
    expect(screen.getByText("Run data through all layers")).toBeInTheDocument();
  });
});

// ── FormulaBreakdown ──────────────────────────────────────────────────────────
describe("FormulaBreakdown", () => {
  const terms = [
    { symbol: "Q", label: "Query matrix", color: "attention" },
    { symbol: "K", label: "Key matrix",   color: "data" },
    { symbol: "V", label: "Value matrix", color: "accuracy" },
  ];
  it("renders formula string", () => {
    render(<FormulaBreakdown formula="Attention(Q,K,V)" terms={terms} />);
    expect(screen.getByText("Attention(Q,K,V)")).toBeInTheDocument();
  });
  it("renders each term label", () => {
    render(<FormulaBreakdown formula="f(Q,K,V)" terms={terms} />);
    expect(screen.getByText("Query matrix")).toBeInTheDocument();
    expect(screen.getByText("Key matrix")).toBeInTheDocument();
    expect(screen.getByText("Value matrix")).toBeInTheDocument();
  });
  it("renders each symbol", () => {
    render(<FormulaBreakdown formula="f(Q,K,V)" terms={terms} />);
    expect(screen.getByText("Q")).toBeInTheDocument();
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("V")).toBeInTheDocument();
  });
});

// ── PseudoCode ────────────────────────────────────────────────────────────────
describe("PseudoCode", () => {
  const steps = [
    "for each query q in Q:",
    "  scores = dot(q, K.T) / sqrt(d_k)",
    "  weights = softmax(scores)",
    "  output = sum(weights * V)",
  ];
  it("renders each step", () => {
    const { container } = render(<PseudoCode title="Attention" steps={steps} />);
    // keyword "for" is split into its own span — check full textContent
    expect(container.textContent).toContain("for each query");
    expect(container.textContent).toContain("softmax");
  });
  it("renders title", () => {
    render(<PseudoCode title="Attention" steps={steps} />);
    expect(screen.getByText("Attention")).toBeInTheDocument();
  });
  it("renders line numbers", () => {
    render(<PseudoCode title="T" steps={steps} showLineNumbers />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("4")).toBeInTheDocument();
  });
});

// ── Highlight ─────────────────────────────────────────────────────────────────
describe("Highlight", () => {
  it("renders text content", () => {
    render(<Highlight>softmax</Highlight>);
    expect(screen.getByText("softmax")).toBeInTheDocument();
  });
  it("renders label when provided", () => {
    render(<Highlight label="normalisation step">softmax</Highlight>);
    expect(screen.getByText(/normalisation step/)).toBeInTheDocument();
  });
  it("renders all color variants", () => {
    const colors = ["neuron", "data", "attention", "loss", "accuracy"] as const;
    colors.forEach(c => {
      expect(() => render(<Highlight color={c}>text</Highlight>)).not.toThrow();
    });
  });
});
