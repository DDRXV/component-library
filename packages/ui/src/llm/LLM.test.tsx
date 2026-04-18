import { render, screen } from "@testing-library/react";
import gsap from "gsap";
import {
  TokenChip,
  TokenSequence,
  TokenizationAnimation,
  ContextWindow,
  KVCache,
  NextTokenPrediction,
  AutoregressiveLoop,
  SystemPrompt,
  UserMessage,
  AssistantMessage,
  PromptTemplate,
  ChainOfThought,
  BeamSearchTree,
  RAGPipeline,
  AgentLoop,
  ToolCallBlock,
} from "./index";

import {
  TrainValTestSplit,
  TrainingLoop,
  LearningRateSchedule,
  WarmupSchedule,
  CheckpointMarker,
  BatchLoader,
  DataSourceNode,
  PreprocessingStep,
} from "../pipeline/index";

// ── TokenChip ─────────────────────────────────────────────────────────────────

describe("TokenChip", () => {
  it("renders token text", () => {
    render(<TokenChip text="transformer" />);
    expect(screen.getByText("transformer")).toBeInTheDocument();
  });

  it("marks type via data attribute", () => {
    const { container } = render(<TokenChip text="[CLS]" type="special" />);
    expect(container.querySelector("[data-type='special']")).toBeInTheDocument();
  });

  it("renders all types without crashing", () => {
    const types = ["word", "subword", "special", "number", "punctuation"] as const;
    types.forEach((t) => {
      expect(() => render(<TokenChip text="x" type={t} />)).not.toThrow();
    });
  });

  it("accepts id prop", () => {
    render(<TokenChip text="cat" id={42} />);
    expect(screen.getByText("42")).toBeInTheDocument();
  });
});

// ── TokenSequence ─────────────────────────────────────────────────────────────

describe("TokenSequence", () => {
  it("renders correct number of chips", () => {
    render(<TokenSequence tokens={["The", "cat", "sat"]} />);
    expect(screen.getByText("The")).toBeInTheDocument();
    expect(screen.getByText("cat")).toBeInTheDocument();
    expect(screen.getByText("sat")).toBeInTheDocument();
  });

  it("renders token ids when showIds=true", () => {
    render(<TokenSequence tokens={["hi"]} ids={[101]} showIds />);
    expect(screen.getByText("101")).toBeInTheDocument();
  });

  it("renders count badge", () => {
    render(<TokenSequence tokens={["a", "b", "c"]} showCount />);
    expect(screen.getByText(/3 tokens/i)).toBeInTheDocument();
  });
});

// ── TokenizationAnimation ─────────────────────────────────────────────────────

describe("TokenizationAnimation", () => {
  it("renders original text", () => {
    render(<TokenizationAnimation text="Hello world" tokens={["Hello", " world"]} />);
    expect(screen.getByText("Hello world")).toBeInTheDocument();
  });

  it("renders each token", () => {
    render(<TokenizationAnimation text="Hi" tokens={["H", "##i"]} />);
    expect(screen.getByText("H")).toBeInTheDocument();
    expect(screen.getByText("##i")).toBeInTheDocument();
  });

  it("shows token count", () => {
    render(<TokenizationAnimation text="Hi" tokens={["H", "##i"]} />);
    expect(screen.getByText(/2 tokens/i)).toBeInTheDocument();
  });
});

// ── ContextWindow ─────────────────────────────────────────────────────────────

describe("ContextWindow", () => {
  it("renders totalTokens position blocks", () => {
    const { container } = render(
      <ContextWindow totalTokens={8} windowSize={4} position={2} />
    );
    expect(container.querySelectorAll("[data-pos]").length).toBe(8);
  });

  it("highlights exactly windowSize tokens", () => {
    const { container } = render(
      <ContextWindow totalTokens={10} windowSize={4} position={3} />
    );
    expect(container.querySelectorAll("[data-active='true']").length).toBe(4);
  });

  it("renders capacity label", () => {
    render(<ContextWindow totalTokens={8} windowSize={4} position={0} label="4k context" />);
    expect(screen.getByText(/4k context/i)).toBeInTheDocument();
  });
});

// ── KVCache ───────────────────────────────────────────────────────────────────

describe("KVCache", () => {
  it("renders K and V sections", () => {
    render(<KVCache />);
    expect(screen.getByText("K")).toBeInTheDocument();
    expect(screen.getByText("V")).toBeInTheDocument();
  });

  it("renders correct layer count", () => {
    const { container } = render(<KVCache layers={4} />);
    expect(container.querySelectorAll("[data-layer]").length).toBe(4);
  });

  it("shows filled vs empty slots", () => {
    // layers=1 to keep counts simple: 1 layer × (seqLen K + seqLen V) = 16 cells
    const { container } = render(<KVCache layers={1} seqLen={8} filledLen={5} />);
    // 5 K-filled + 5 V-filled = 10 filled
    expect(container.querySelectorAll("[data-filled='true']").length).toBe(10);
    // 3 K-empty + 3 V-empty = 6 empty
    expect(container.querySelectorAll("[data-filled='false']").length).toBe(6);
  });
});

// ── NextTokenPrediction ───────────────────────────────────────────────────────

describe("NextTokenPrediction", () => {
  const tokens = [
    { token: "the",  prob: 0.45 },
    { token: "a",    prob: 0.25 },
    { token: "this", prob: 0.15 },
  ];

  it("renders each candidate token", () => {
    render(<NextTokenPrediction topTokens={tokens} />);
    expect(screen.getByText("the")).toBeInTheDocument();
    expect(screen.getByText("a")).toBeInTheDocument();
    expect(screen.getByText("this")).toBeInTheDocument();
  });

  it("highlights the top token", () => {
    const { container } = render(<NextTokenPrediction topTokens={tokens} />);
    expect(container.querySelector("[data-selected='true']")).toBeInTheDocument();
  });

  it("renders probability values", () => {
    render(<NextTokenPrediction topTokens={tokens} />);
    expect(screen.getByText("45%")).toBeInTheDocument();
  });

  it("accepts temperature prop", () => {
    expect(() =>
      render(<NextTokenPrediction topTokens={tokens} temperature={0.7} />)
    ).not.toThrow();
  });
});

// ── AutoregressiveLoop ────────────────────────────────────────────────────────

describe("AutoregressiveLoop", () => {
  it("renders model and output boxes", () => {
    render(<AutoregressiveLoop />);
    expect(screen.getByText(/model/i)).toBeInTheDocument();
    expect(screen.getByText(/output/i)).toBeInTheDocument();
  });

  it("shows generated tokens", () => {
    render(<AutoregressiveLoop generatedTokens={["The", "cat"]} />);
    expect(screen.getByText("The")).toBeInTheDocument();
    expect(screen.getByText("cat")).toBeInTheDocument();
  });

  it("renders loop arrow", () => {
    const { container } = render(<AutoregressiveLoop />);
    expect(container.querySelector("[data-loop]")).toBeInTheDocument();
  });
});

// ── Chat components ───────────────────────────────────────────────────────────

describe("SystemPrompt", () => {
  it("renders content", () => {
    render(<SystemPrompt>You are a helpful assistant.</SystemPrompt>);
    expect(screen.getByText("You are a helpful assistant.")).toBeInTheDocument();
  });

  it("shows system label", () => {
    render(<SystemPrompt>test</SystemPrompt>);
    expect(screen.getByText(/system/i)).toBeInTheDocument();
  });
});

describe("UserMessage", () => {
  it("renders message text", () => {
    render(<UserMessage>What is attention?</UserMessage>);
    expect(screen.getByText("What is attention?")).toBeInTheDocument();
  });

  it("shows user label", () => {
    render(<UserMessage>hi</UserMessage>);
    expect(screen.getByText(/user/i)).toBeInTheDocument();
  });
});

describe("AssistantMessage", () => {
  it("renders message text", () => {
    render(<AssistantMessage>Attention is...</AssistantMessage>);
    expect(screen.getByText("Attention is...")).toBeInTheDocument();
  });

  it("shows assistant label", () => {
    render(<AssistantMessage>hi</AssistantMessage>);
    expect(screen.getByText(/assistant/i)).toBeInTheDocument();
  });

  it("renders thinking block when provided", () => {
    render(<AssistantMessage thinking="Let me reason...">Answer</AssistantMessage>);
    expect(screen.getByText(/Let me reason.../)).toBeInTheDocument();
  });
});

// ── PromptTemplate ────────────────────────────────────────────────────────────

describe("PromptTemplate", () => {
  it("renders template text", () => {
    render(<PromptTemplate template="Answer {question} given {context}" slots={["question", "context"]} />);
    expect(screen.getByText(/Answer/)).toBeInTheDocument();
  });

  it("renders slot names as distinct elements", () => {
    render(<PromptTemplate template="Hello {name}" slots={["name"]} />);
    expect(screen.getByText("{name}")).toBeInTheDocument();
  });

  it("renders all slots", () => {
    render(<PromptTemplate template="{a} and {b}" slots={["a", "b"]} />);
    expect(screen.getByText("{a}")).toBeInTheDocument();
    expect(screen.getByText("{b}")).toBeInTheDocument();
  });
});

// ── ChainOfThought ────────────────────────────────────────────────────────────

describe("ChainOfThought", () => {
  const steps = ["First, identify the variables.", "Then apply the formula.", "Therefore the answer is 42."];

  it("renders all steps", () => {
    render(<ChainOfThought steps={steps} />);
    steps.forEach((s) => expect(screen.getByText(s)).toBeInTheDocument());
  });

  it("numbers each step", () => {
    render(<ChainOfThought steps={steps} />);
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(screen.getByText("2")).toBeInTheDocument();
    expect(screen.getByText("3")).toBeInTheDocument();
  });

  it("renders conclusion marker on last step", () => {
    const { container } = render(<ChainOfThought steps={steps} />);
    expect(container.querySelector("[data-conclusion]")).toBeInTheDocument();
  });
});

// ── BeamSearchTree ────────────────────────────────────────────────────────────

describe("BeamSearchTree", () => {
  it("renders beam nodes", () => {
    const { container } = render(<BeamSearchTree beams={3} depth={3} />);
    expect(container.querySelectorAll("[data-beam-node]").length).toBeGreaterThanOrEqual(3);
  });

  it("renders edges connecting nodes", () => {
    const { container } = render(<BeamSearchTree beams={2} depth={3} />);
    // 2 beams × 2 beams × (depth-1) levels = 8 edges for beams=2,depth=3
    expect(container.querySelectorAll("line").length).toBeGreaterThan(0);
  });
});

// ── RAGPipeline ───────────────────────────────────────────────────────────────

describe("RAGPipeline", () => {
  it("renders Query node", () => {
    render(<RAGPipeline />);
    expect(screen.getByText(/query/i)).toBeInTheDocument();
  });

  it("renders Retriever node", () => {
    render(<RAGPipeline />);
    expect(screen.getByText(/retriev/i)).toBeInTheDocument();
  });

  it("renders Vector DB node", () => {
    render(<RAGPipeline />);
    expect(screen.getByText(/vector/i)).toBeInTheDocument();
  });

  it("renders LLM node", () => {
    render(<RAGPipeline />);
    expect(screen.getByText(/LLM/i)).toBeInTheDocument();
  });

  it("renders Answer node", () => {
    render(<RAGPipeline />);
    expect(screen.getByText(/answer/i)).toBeInTheDocument();
  });
});

// ── AgentLoop ─────────────────────────────────────────────────────────────────

describe("AgentLoop", () => {
  it("renders Think node", () => {
    render(<AgentLoop />);
    expect(screen.getByText(/think/i)).toBeInTheDocument();
  });

  it("renders Act node", () => {
    render(<AgentLoop />);
    expect(screen.getByText(/act/i)).toBeInTheDocument();
  });

  it("renders Observe node", () => {
    render(<AgentLoop />);
    expect(screen.getByText(/observ/i)).toBeInTheDocument();
  });

  it("renders Tool node", () => {
    render(<AgentLoop />);
    expect(screen.getByText(/tool/i)).toBeInTheDocument();
  });

  it("calls gsap timeline on mount when animated", () => {
    vi.clearAllMocks();
    render(<AgentLoop animated />);
    expect(gsap.timeline).toHaveBeenCalled();
  });
});

// ── ToolCallBlock ─────────────────────────────────────────────────────────────

describe("ToolCallBlock", () => {
  it("renders function name", () => {
    render(<ToolCallBlock name="web_search" args={{ query: "attention" }} />);
    expect(screen.getByText("web_search")).toBeInTheDocument();
  });

  it("renders argument keys", () => {
    render(<ToolCallBlock name="fn" args={{ query: "test", limit: 5 }} />);
    expect(screen.getByText(/query/)).toBeInTheDocument();
    expect(screen.getByText(/limit/)).toBeInTheDocument();
  });

  it("renders result when provided", () => {
    render(<ToolCallBlock name="fn" args={{}} result="found 3 results" />);
    expect(screen.getByText(/found 3 results/)).toBeInTheDocument();
  });
});

// ── Pipeline components ───────────────────────────────────────────────────────

describe("TrainValTestSplit", () => {
  it("renders three split sections", () => {
    const { container } = render(
      <TrainValTestSplit train={0.7} val={0.15} test={0.15} />
    );
    expect(container.querySelectorAll("[data-split]").length).toBe(3);
  });

  it("renders split labels", () => {
    render(<TrainValTestSplit train={0.7} val={0.15} test={0.15} />);
    expect(screen.getByText(/train/i)).toBeInTheDocument();
    expect(screen.getByText(/val/i)).toBeInTheDocument();
    expect(screen.getByText(/test/i)).toBeInTheDocument();
  });

  it("renders percentage annotations", () => {
    render(<TrainValTestSplit train={0.7} val={0.15} test={0.15} />);
    expect(screen.getByText("70%")).toBeInTheDocument();
  });
});

describe("TrainingLoop", () => {
  it("renders Forward Pass node", () => {
    render(<TrainingLoop />);
    expect(screen.getByText(/forward/i)).toBeInTheDocument();
  });

  it("renders Loss node", () => {
    render(<TrainingLoop />);
    expect(screen.getByText(/loss/i)).toBeInTheDocument();
  });

  it("renders Backward node", () => {
    render(<TrainingLoop />);
    expect(screen.getByText(/backward/i)).toBeInTheDocument();
  });

  it("renders Update Weights node", () => {
    render(<TrainingLoop />);
    expect(screen.getByText(/update/i)).toBeInTheDocument();
  });

  it("calls gsap timeline when animated", () => {
    vi.clearAllMocks();
    render(<TrainingLoop animated />);
    expect(gsap.timeline).toHaveBeenCalled();
  });
});

describe("LearningRateSchedule", () => {
  it("renders SVG curve", () => {
    const { container } = render(<LearningRateSchedule />);
    expect(container.querySelector("path[data-curve]")).toBeInTheDocument();
  });

  it("renders type label", () => {
    render(<LearningRateSchedule type="cosine" />);
    expect(screen.getByText(/cosine/i)).toBeInTheDocument();
  });

  it("renders all supported schedule types", () => {
    const types = ["cosine", "linear", "constant", "step"] as const;
    types.forEach((t) => {
      const { unmount } = render(<LearningRateSchedule type={t} />);
      unmount();
    });
  });
});

describe("WarmupSchedule", () => {
  it("renders warmup region", () => {
    const { container } = render(<WarmupSchedule warmupSteps={100} totalSteps={1000} />);
    expect(container.querySelector("[data-warmup]")).toBeInTheDocument();
  });

  it("renders decay region", () => {
    const { container } = render(<WarmupSchedule warmupSteps={100} totalSteps={1000} />);
    expect(container.querySelector("[data-decay]")).toBeInTheDocument();
  });
});

describe("CheckpointMarker", () => {
  it("renders step label", () => {
    render(<CheckpointMarker step={500} totalSteps={1000} />);
    expect(screen.getByText(/500/)).toBeInTheDocument();
  });

  it("renders save icon marker", () => {
    const { container } = render(<CheckpointMarker step={500} totalSteps={1000} />);
    expect(container.querySelector("[data-checkpoint]")).toBeInTheDocument();
  });
});

describe("BatchLoader", () => {
  it("renders batch size label", () => {
    render(<BatchLoader batchSize={32} datasetSize={1000} />);
    expect(screen.getByText(/32/)).toBeInTheDocument();
  });

  it("renders batch blocks", () => {
    const { container } = render(<BatchLoader batchSize={8} datasetSize={64} />);
    expect(container.querySelectorAll("[data-batch]").length).toBeGreaterThan(0);
  });
});

describe("DataSourceNode", () => {
  it("renders label", () => {
    render(<DataSourceNode label="Training Data" />);
    expect(screen.getByText("Training Data")).toBeInTheDocument();
  });

  it("renders all source types without crashing", () => {
    const types = ["database", "csv", "api", "s3"] as const;
    types.forEach((t) => {
      expect(() => render(<DataSourceNode type={t} label="src" />)).not.toThrow();
    });
  });
});

describe("PreprocessingStep", () => {
  it("renders step label", () => {
    render(<PreprocessingStep label="Tokenize" />);
    expect(screen.getByText("Tokenize")).toBeInTheDocument();
  });

  it("renders input and output ports", () => {
    const { container } = render(<PreprocessingStep label="Normalize" />);
    expect(container.querySelector("[data-port='in']")).toBeInTheDocument();
    expect(container.querySelector("[data-port='out']")).toBeInTheDocument();
  });
});
