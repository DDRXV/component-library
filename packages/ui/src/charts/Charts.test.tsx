import { render, screen } from "@testing-library/react";
import {
  LossChart,
  AccuracyChart,
  ConfusionMatrix,
  ROCCurve,
  FeatureImportanceBar,
  BenchmarkRadar,
  ModelLeaderboard,
  EvalScoreCard,
  DeltaIndicator,
  SparklineInline,
  MetricGauge,
  ParameterCountBar,
  SideBySideComparison,
  VersionTimeline,
  ParameterComparisonTable,
  CapabilityMatrix,
  ProConsList,
  TradeoffDiagram,
  ScalingLawChart,
  PaperHighlight,
} from "./index";

// ── LossChart ─────────────────────────────────────────────────────────────────

describe("LossChart", () => {
  const data = [
    { epoch: 1, train: 2.3, val: 2.5 },
    { epoch: 2, train: 1.8, val: 2.1 },
    { epoch: 3, train: 1.4, val: 1.7 },
  ];

  it("renders SVG with aria-label", () => {
    const { container } = render(<LossChart data={data} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(screen.getByRole("img")).toBeInTheDocument();
  });

  it("renders train series path", () => {
    const { container } = render(<LossChart data={data} />);
    expect(container.querySelector("[data-series='train']")).toBeInTheDocument();
  });

  it("renders val series path", () => {
    const { container } = render(<LossChart data={data} />);
    expect(container.querySelector("[data-series='val']")).toBeInTheDocument();
  });

  it("renders axis labels", () => {
    render(<LossChart data={data} />);
    expect(screen.getByText(/epoch/i)).toBeInTheDocument();
    expect(screen.getByText(/loss/i)).toBeInTheDocument();
  });

  it("renders legend", () => {
    render(<LossChart data={data} />);
    expect(screen.getByText(/train/i)).toBeInTheDocument();
    expect(screen.getByText(/val/i)).toBeInTheDocument();
  });
});

// ── AccuracyChart ─────────────────────────────────────────────────────────────

describe("AccuracyChart", () => {
  const data = [
    { epoch: 1, train: 0.6, val: 0.55 },
    { epoch: 2, train: 0.75, val: 0.70 },
  ];

  it("renders SVG", () => {
    const { container } = render(<AccuracyChart data={data} />);
    expect(container.querySelector("svg")).toBeInTheDocument();
  });

  it("renders both series", () => {
    const { container } = render(<AccuracyChart data={data} />);
    expect(container.querySelector("[data-series='train']")).toBeInTheDocument();
    expect(container.querySelector("[data-series='val']")).toBeInTheDocument();
  });

  it("renders accuracy axis label", () => {
    render(<AccuracyChart data={data} />);
    expect(screen.getByText(/accuracy/i)).toBeInTheDocument();
  });
});

// ── ConfusionMatrix ───────────────────────────────────────────────────────────

describe("ConfusionMatrix", () => {
  const matrix = [[50, 2], [3, 45]];
  const labels = ["Cat", "Dog"];

  it("renders NxN cells", () => {
    const { container } = render(<ConfusionMatrix matrix={matrix} labels={labels} />);
    expect(container.querySelectorAll("[data-cell]").length).toBe(4);
  });

  it("renders class labels", () => {
    render(<ConfusionMatrix matrix={matrix} labels={labels} />);
    expect(screen.getAllByText("Cat").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText("Dog").length).toBeGreaterThanOrEqual(1);
  });

  it("renders cell values", () => {
    render(<ConfusionMatrix matrix={matrix} labels={labels} />);
    expect(screen.getByText("50")).toBeInTheDocument();
    expect(screen.getByText("45")).toBeInTheDocument();
  });

  it("highlights diagonal cells", () => {
    const { container } = render(<ConfusionMatrix matrix={matrix} labels={labels} />);
    expect(container.querySelectorAll("[data-diagonal='true']").length).toBe(2);
  });
});

// ── ROCCurve ──────────────────────────────────────────────────────────────────

describe("ROCCurve", () => {
  const points = [
    { fpr: 0, tpr: 0 },
    { fpr: 0.1, tpr: 0.7 },
    { fpr: 0.3, tpr: 0.9 },
    { fpr: 1, tpr: 1 },
  ];

  it("renders curve path", () => {
    const { container } = render(<ROCCurve points={points} auc={0.88} />);
    expect(container.querySelector("path[data-curve='roc']")).toBeInTheDocument();
  });

  it("renders random baseline diagonal", () => {
    const { container } = render(<ROCCurve points={points} auc={0.88} />);
    expect(container.querySelector("[data-baseline]")).toBeInTheDocument();
  });

  it("renders AUC annotation", () => {
    render(<ROCCurve points={points} auc={0.88} />);
    expect(screen.getByText(/AUC/i)).toBeInTheDocument();
    expect(screen.getByText(/0.88/)).toBeInTheDocument();
  });

  it("renders axis labels", () => {
    render(<ROCCurve points={points} auc={0.88} />);
    expect(screen.getByText(/FPR/i)).toBeInTheDocument();
    expect(screen.getByText(/TPR/i)).toBeInTheDocument();
  });
});

// ── FeatureImportanceBar ──────────────────────────────────────────────────────

describe("FeatureImportanceBar", () => {
  const features = [
    { name: "attention_weight", importance: 0.45 },
    { name: "position",         importance: 0.30 },
    { name: "token_type",       importance: 0.15 },
  ];

  it("renders one bar per feature", () => {
    const { container } = render(<FeatureImportanceBar features={features} />);
    expect(container.querySelectorAll("[data-bar]").length).toBe(3);
  });

  it("renders feature names", () => {
    render(<FeatureImportanceBar features={features} />);
    expect(screen.getByText("attention_weight")).toBeInTheDocument();
    expect(screen.getByText("position")).toBeInTheDocument();
  });

  it("top feature has largest bar width", () => {
    const { container } = render(<FeatureImportanceBar features={features} />);
    const bars = Array.from(container.querySelectorAll("[data-bar]"));
    const w0 = parseFloat(bars[0].getAttribute("width") ?? "0");
    const w1 = parseFloat(bars[1].getAttribute("width") ?? "0");
    expect(w0).toBeGreaterThan(w1);
  });
});

// ── BenchmarkRadar ────────────────────────────────────────────────────────────

describe("BenchmarkRadar", () => {
  const metrics = ["MMLU", "GSM8K", "HumanEval"];
  const models = [
    { name: "GPT-4",   scores: [0.86, 0.92, 0.87] },
    { name: "Claude",  scores: [0.88, 0.89, 0.91] },
  ];

  it("renders one polygon per model", () => {
    const { container } = render(<BenchmarkRadar metrics={metrics} models={models} />);
    expect(container.querySelectorAll("[data-model]").length).toBe(2);
  });

  it("renders metric axis labels", () => {
    render(<BenchmarkRadar metrics={metrics} models={models} />);
    expect(screen.getByText("MMLU")).toBeInTheDocument();
    expect(screen.getByText("GSM8K")).toBeInTheDocument();
    expect(screen.getByText("HumanEval")).toBeInTheDocument();
  });

  it("renders model names in legend", () => {
    render(<BenchmarkRadar metrics={metrics} models={models} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Claude")).toBeInTheDocument();
  });
});

// ── ModelLeaderboard ──────────────────────────────────────────────────────────

describe("ModelLeaderboard", () => {
  const models = [
    { rank: 1, name: "GPT-4",    score: 92.3, delta: 2.1  },
    { rank: 2, name: "Claude-3", score: 91.8, delta: 0.5  },
    { rank: 3, name: "Gemini",   score: 90.1, delta: -0.3 },
  ];

  it("renders each model name", () => {
    render(<ModelLeaderboard models={models} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Claude-3")).toBeInTheDocument();
    expect(screen.getByText("Gemini")).toBeInTheDocument();
  });

  it("renders rank numbers", () => {
    render(<ModelLeaderboard models={models} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
  });

  it("renders scores", () => {
    render(<ModelLeaderboard models={models} />);
    expect(screen.getByText("92.3")).toBeInTheDocument();
  });

  it("renders positive delta with + sign", () => {
    render(<ModelLeaderboard models={models} />);
    expect(screen.getByText("+2.1")).toBeInTheDocument();
  });

  it("renders negative delta with - sign", () => {
    render(<ModelLeaderboard models={models} />);
    expect(screen.getByText("-0.3")).toBeInTheDocument();
  });
});

// ── EvalScoreCard ─────────────────────────────────────────────────────────────

describe("EvalScoreCard", () => {
  it("renders metric name", () => {
    render(<EvalScoreCard metric="MMLU" value={87.3} unit="%" />);
    expect(screen.getByText("MMLU")).toBeInTheDocument();
  });

  it("renders value", () => {
    render(<EvalScoreCard metric="MMLU" value={87.3} unit="%" />);
    expect(screen.getByText("87.3")).toBeInTheDocument();
  });

  it("renders unit", () => {
    render(<EvalScoreCard metric="MMLU" value={87.3} unit="%" />);
    expect(screen.getByText("%")).toBeInTheDocument();
  });

  it("renders delta when provided", () => {
    render(<EvalScoreCard metric="GSM8K" value={92.1} delta={1.5} />);
    expect(screen.getByText(/\+1\.5/)).toBeInTheDocument();
  });
});

// ── DeltaIndicator ────────────────────────────────────────────────────────────

describe("DeltaIndicator", () => {
  it("shows + prefix for positive value", () => {
    render(<DeltaIndicator value={2.3} />);
    expect(screen.getByText(/\+2\.3/)).toBeInTheDocument();
  });

  it("shows - prefix for negative value", () => {
    render(<DeltaIndicator value={-1.5} />);
    expect(screen.getByText(/-1\.5/)).toBeInTheDocument();
  });

  it("renders unit when provided", () => {
    render(<DeltaIndicator value={2.3} unit="%" />);
    expect(screen.getByText(/%/)).toBeInTheDocument();
  });
});

// ── SparklineInline ───────────────────────────────────────────────────────────

describe("SparklineInline", () => {
  it("renders SVG polyline", () => {
    const { container } = render(<SparklineInline data={[1, 2, 1.5, 3, 2.8]} />);
    expect(container.querySelector("polyline,path")).toBeInTheDocument();
  });

  it("renders without crashing for single point", () => {
    expect(() => render(<SparklineInline data={[1]} />)).not.toThrow();
  });

  it("accepts color prop", () => {
    expect(() => render(<SparklineInline data={[1, 2, 3]} color="accuracy" />)).not.toThrow();
  });
});

// ── MetricGauge ───────────────────────────────────────────────────────────────

describe("MetricGauge", () => {
  it("renders semicircle arc", () => {
    const { container } = render(<MetricGauge value={0.87} label="Accuracy" />);
    expect(container.querySelector("path[data-track]")).toBeInTheDocument();
    expect(container.querySelector("path[data-fill]")).toBeInTheDocument();
  });

  it("renders label", () => {
    render(<MetricGauge value={0.87} label="Accuracy" />);
    expect(screen.getByText("Accuracy")).toBeInTheDocument();
  });

  it("renders percentage value", () => {
    render(<MetricGauge value={0.87} label="Acc" />);
    expect(screen.getByText("87%")).toBeInTheDocument();
  });
});

// ── ParameterCountBar ─────────────────────────────────────────────────────────

describe("ParameterCountBar", () => {
  const models = [
    { name: "GPT-4",   params: 1800 },
    { name: "GPT-3.5", params: 175  },
    { name: "GPT-2",   params: 1.5  },
  ];

  it("renders one bar per model", () => {
    const { container } = render(<ParameterCountBar models={models} unit="B" />);
    expect(container.querySelectorAll("[data-bar]").length).toBe(3);
  });

  it("renders model names", () => {
    render(<ParameterCountBar models={models} unit="B" />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("GPT-3.5")).toBeInTheDocument();
  });

  it("largest model has longest bar", () => {
    const { container } = render(<ParameterCountBar models={models} unit="B" />);
    const bars = Array.from(container.querySelectorAll("[data-bar]"));
    const w0 = parseFloat(bars[0].getAttribute("width") ?? "0");
    const w1 = parseFloat(bars[1].getAttribute("width") ?? "0");
    expect(w0).toBeGreaterThan(w1);
  });
});

// ── SideBySideComparison ──────────────────────────────────────────────────────

describe("SideBySideComparison", () => {
  it("renders left label", () => {
    render(
      <SideBySideComparison
        left={{ label: "Before", content: <p>old</p> }}
        right={{ label: "After", content: <p>new</p> }}
      />
    );
    expect(screen.getByText("Before")).toBeInTheDocument();
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("renders both content panels", () => {
    render(
      <SideBySideComparison
        left={{ label: "L", content: <p>left content</p> }}
        right={{ label: "R", content: <p>right content</p> }}
      />
    );
    expect(screen.getByText("left content")).toBeInTheDocument();
    expect(screen.getByText("right content")).toBeInTheDocument();
  });
});

// ── VersionTimeline ───────────────────────────────────────────────────────────

describe("VersionTimeline", () => {
  const versions = [
    { name: "GPT-2", year: 2019, params: "1.5B" },
    { name: "GPT-3", year: 2020, params: "175B" },
    { name: "GPT-4", year: 2023, params: "~1.8T" },
  ];

  it("renders each version name", () => {
    render(<VersionTimeline versions={versions} />);
    expect(screen.getByText("GPT-2")).toBeInTheDocument();
    expect(screen.getByText("GPT-3")).toBeInTheDocument();
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
  });

  it("renders year labels", () => {
    render(<VersionTimeline versions={versions} />);
    expect(screen.getByText("2019")).toBeInTheDocument();
    expect(screen.getByText("2023")).toBeInTheDocument();
  });

  it("renders param counts", () => {
    render(<VersionTimeline versions={versions} />);
    expect(screen.getByText("1.5B")).toBeInTheDocument();
    expect(screen.getByText("175B")).toBeInTheDocument();
  });

  it("renders SVG timeline line", () => {
    const { container } = render(<VersionTimeline versions={versions} />);
    expect(container.querySelector("line[data-timeline]")).toBeInTheDocument();
  });
});

// ── ParameterComparisonTable ──────────────────────────────────────────────────

describe("ParameterComparisonTable", () => {
  const models = ["GPT-4", "Claude-3"];
  const specs  = ["Params", "Context", "MMLU"];
  const data = {
    "GPT-4":   { Params: "~1.8T", Context: "128k", MMLU: "86.4" },
    "Claude-3":{ Params: "~200B", Context: "200k", MMLU: "88.7" },
  };

  it("renders model names in header", () => {
    render(<ParameterComparisonTable models={models} specs={specs} data={data} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Claude-3")).toBeInTheDocument();
  });

  it("renders spec row labels", () => {
    render(<ParameterComparisonTable models={models} specs={specs} data={data} />);
    expect(screen.getByText("Params")).toBeInTheDocument();
    expect(screen.getByText("Context")).toBeInTheDocument();
    expect(screen.getByText("MMLU")).toBeInTheDocument();
  });

  it("renders cell values", () => {
    render(<ParameterComparisonTable models={models} specs={specs} data={data} />);
    expect(screen.getByText("128k")).toBeInTheDocument();
    expect(screen.getByText("200k")).toBeInTheDocument();
  });
});

// ── CapabilityMatrix ──────────────────────────────────────────────────────────

describe("CapabilityMatrix", () => {
  const models = ["GPT-4", "Claude-3"];
  const tasks  = ["Coding", "Math", "Writing"];
  const scores = [[0.9, 0.85, 0.88], [0.88, 0.89, 0.91]];

  it("renders models × tasks cells", () => {
    const { container } = render(
      <CapabilityMatrix models={models} tasks={tasks} scores={scores} />
    );
    expect(container.querySelectorAll("[data-cell]").length).toBe(6);
  });

  it("renders model and task labels", () => {
    render(<CapabilityMatrix models={models} tasks={tasks} scores={scores} />);
    expect(screen.getByText("GPT-4")).toBeInTheDocument();
    expect(screen.getByText("Coding")).toBeInTheDocument();
    expect(screen.getByText("Math")).toBeInTheDocument();
  });
});

// ── ProConsList ───────────────────────────────────────────────────────────────

describe("ProConsList", () => {
  it("renders pros", () => {
    render(<ProConsList pros={["Fast inference", "Low cost"]} cons={["Context limit"]} />);
    expect(screen.getByText("Fast inference")).toBeInTheDocument();
    expect(screen.getByText("Low cost")).toBeInTheDocument();
  });

  it("renders cons", () => {
    render(<ProConsList pros={[]} cons={["Context limit", "Hallucinations"]} />);
    expect(screen.getByText("Context limit")).toBeInTheDocument();
    expect(screen.getByText("Hallucinations")).toBeInTheDocument();
  });

  it("renders Pros and Cons section headers", () => {
    render(<ProConsList pros={["a"]} cons={["b"]} />);
    expect(screen.getByText(/pros/i)).toBeInTheDocument();
    expect(screen.getByText(/cons/i)).toBeInTheDocument();
  });
});

// ── TradeoffDiagram ───────────────────────────────────────────────────────────

describe("TradeoffDiagram", () => {
  it("renders the three axis labels", () => {
    render(<TradeoffDiagram quality={0.9} speed={0.4} cost={0.5} />);
    expect(screen.getByText(/quality/i)).toBeInTheDocument();
    expect(screen.getByText(/speed/i)).toBeInTheDocument();
    expect(screen.getByText(/cost/i)).toBeInTheDocument();
  });

  it("renders a triangle polygon", () => {
    const { container } = render(<TradeoffDiagram quality={0.9} speed={0.4} cost={0.5} />);
    expect(container.querySelector("polygon[data-tradeoff]")).toBeInTheDocument();
  });
});

// ── ScalingLawChart ───────────────────────────────────────────────────────────

describe("ScalingLawChart", () => {
  const points = [
    { compute: 1e20, loss: 3.0 },
    { compute: 1e21, loss: 2.7 },
    { compute: 1e23, loss: 2.3 },
  ];

  it("renders SVG with curve path", () => {
    const { container } = render(<ScalingLawChart points={points} />);
    expect(container.querySelector("path[data-curve]")).toBeInTheDocument();
  });

  it("renders axis labels", () => {
    render(<ScalingLawChart points={points} />);
    expect(screen.getByText(/compute/i)).toBeInTheDocument();
    expect(screen.getByText(/loss/i)).toBeInTheDocument();
  });

  it("renders data point markers", () => {
    const { container } = render(<ScalingLawChart points={points} />);
    expect(container.querySelectorAll("circle[data-point]").length).toBe(3);
  });
});

// ── PaperHighlight ────────────────────────────────────────────────────────────

describe("PaperHighlight", () => {
  const paper = {
    title: "Attention Is All You Need",
    authors: ["Vaswani", "Shazeer", "Parmar"],
    year: 2017,
    venue: "NeurIPS",
    abstract: "We propose a new simple network architecture...",
    tags: ["transformer", "attention"],
  };

  it("renders title", () => {
    render(<PaperHighlight {...paper} />);
    expect(screen.getByText("Attention Is All You Need")).toBeInTheDocument();
  });

  it("renders first author", () => {
    render(<PaperHighlight {...paper} />);
    expect(screen.getByText(/Vaswani/)).toBeInTheDocument();
  });

  it("renders year and venue", () => {
    render(<PaperHighlight {...paper} />);
    expect(screen.getByText(/2017/)).toBeInTheDocument();
    expect(screen.getByText(/NeurIPS/)).toBeInTheDocument();
  });

  it("renders abstract excerpt", () => {
    render(<PaperHighlight {...paper} />);
    expect(screen.getByText(/We propose/)).toBeInTheDocument();
  });

  it("renders tags", () => {
    render(<PaperHighlight {...paper} />);
    expect(screen.getByText("transformer")).toBeInTheDocument();
    expect(screen.getByText("attention")).toBeInTheDocument();
  });
});
