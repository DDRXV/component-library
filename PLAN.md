# AI Tech Education Component Library — Master Plan

## Vision

A React component library purpose-built for explaining AI/ML/tech concepts visually.
Not a UI kit. Not a charting library. A *pedagogical* toolbox — every component exists
to make a concept click faster than text alone.

---

## OSS Stack

### Framework & Build
| Tool | Why |
|---|---|
| **React 18 + TypeScript** | Standard, great ecosystem, RSC-ready |
| **Vite** | Fast dev, native ESM, zero config |
| **tsup** | Zero-config library bundling (ESM + CJS) |
| **Storybook 8** | Component explorer + docs in one |

### Styling
| Tool | Why |
|---|---|
| **Tailwind CSS v4** | Utility-first, purge-safe, dark mode trivial |
| **CSS custom properties** | Design tokens that Tailwind can't own (animation curves, radii) |
| **tailwind-variants** | Variant API without CVA boilerplate |

### Animation (non-negotiable for this library)
| Tool | Why |
|---|---|
| **GSAP (core + ScrollTrigger)** | Best-in-class, handles SVG paths, timelines |
| **Framer Motion** | React-native, layout animations, exit animations |
| **Use GSAP for**: data flow, neural net forward pass, training loops | |
| **Use Framer for**: component mount/unmount, state transitions | |

### Diagrams & Math
| Tool | Why |
|---|---|
| **SVG (hand-written)** | Full control, animatable, no runtime overhead |
| **KaTeX** | Math formulas (loss functions, attention equations) |
| **Shiki** | Code syntax highlighting (zero flash, accurate themes) |
| **Recharts** | Loss curves, accuracy charts (lightweight, composable) |

### Icons
| Tool | Why |
|---|---|
| **Lucide React** | Base icon set (clean, consistent stroke weight) |
| **Custom SVG icons** | AI-specific (neuron, transformer, GPU, token, embedding) |

### Dev Quality
| Tool | Why |
|---|---|
| **Vitest** | Fast unit tests, runs in Vite pipeline |
| **@testing-library/react** | Behavior-driven component tests (no implementation details) |
| **@testing-library/user-event** | Realistic user interaction simulation |
| **Chromatic** | Visual regression snapshots on every PR |
| **Storybook interactions** | In-browser interaction tests (play functions) |
| **axe-core / @axe-core/react** | Automated a11y assertions in tests |
| **ESLint + Prettier** | Consistent code |
| **Changesets** | Versioning and changelogs |

---

## TDD Workflow (Red → Green → Refactor for Every Component)

### The Rule: Test File Ships Before Component File

No component is started without a failing test. The sequence is rigid:

```
1. Write the test (it fails — red)
2. Write the minimum component to pass (green)
3. Refactor for elegance (still green)
4. Add Storybook story
5. Run Chromatic baseline snapshot
```

### Three Test Layers Per Component

#### Layer 1 — Unit Tests (Vitest + Testing Library)
Tests live at `src/<category>/<Component>.test.tsx`, next to the component.

What to test:
- **Props contract** — does the component render correctly for each prop variant?
- **Semantic output** — does it produce the right ARIA roles, labels, SVG structure?
- **Interaction behavior** — click, hover, keyboard triggers correct state
- **Edge cases** — zero values, empty arrays, missing optional props
- **Reduced motion** — animations disabled when `prefers-reduced-motion: reduce`

What NOT to test:
- CSS class names (implementation detail)
- Internal state unless it affects output
- Animation timing values (test that animation runs, not that it takes 300ms)

Example test structure for `Neuron`:
```typescript
describe('Neuron', () => {
  it('renders an SVG circle', () => { ... })
  it('displays activation value when provided', () => { ... })
  it('applies active variant class when isActive=true', () => { ... })
  it('fires onActivate when clicked', () => { ... })
  it('skips animation when prefers-reduced-motion', () => { ... })
  it('has accessible label from aria-label prop', () => { ... })
})
```

#### Layer 2 — Storybook Interaction Tests (play functions)
Each story has a `play` function that simulates user behavior using `@storybook/test`:
- Hover, click, focus interactions
- Verifies DOM state after interaction
- Runs in Chromatic CI so visual + behavior regressions are caught together

```typescript
export const ActiveState: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await userEvent.click(canvas.getByRole('img', { name: /neuron/i }))
    await expect(canvas.getByText('0.87')).toBeInTheDocument()
  }
}
```

#### Layer 3 — Visual Regression (Chromatic)
- Every story auto-snapshotted on each PR
- Diff threshold: 0.2% pixel change = flagged for review
- Dark mode + light mode both snapshotted
- Mobile (375px) + desktop (1280px) viewports

### TDD for Animated Components

GSAP and Framer Motion animations need special handling:

```typescript
// Mock GSAP in tests — test the DOM outcome, not the animation engine
vi.mock('gsap', () => ({
  to: vi.fn(),
  from: vi.fn(),
  timeline: vi.fn(() => ({ to: vi.fn(), from: vi.fn() }))
}))

// Test that animation is INITIATED, not that it runs
it('starts flow animation on mount', () => {
  render(<AnimatedFlowArrow />)
  expect(gsap.to).toHaveBeenCalledWith(
    expect.any(Element),
    expect.objectContaining({ duration: expect.any(Number) })
  )
})
```

### TDD for SVG Components

SVG components are tested via ARIA and DOM structure:
```typescript
it('renders correct SVG path count for multi-head attention', () => {
  const { container } = render(<MultiHeadAttention heads={8} />)
  expect(container.querySelectorAll('[data-head]')).toHaveLength(8)
})
```

### CI Pipeline (GitHub Actions)

```
PR opened →
  ├── vitest run (unit tests, ~30s)
  ├── vitest --coverage (coverage gate: 80% lines)
  ├── axe a11y scan on all stories
  ├── Chromatic snapshot diff
  └── type check (tsc --noEmit)
```

Coverage gates:
- Icons: 100% (pure rendering, no excuse)
- Arrows/Connectors: 90%
- Neural/LLM components: 80%
- Chart components: 80%
- Layout/Typography: 95%

---

## Design Principles (What Separates Good from Slop)

1. **Test first** — failing test before first line of component code
2. **Tokens first** — colors, spacing, animation durations live in CSS vars, not hardcoded
3. **Dark-mode native** — AI aesthetic is dark; light mode is an override, not default
4. **Animated by default** — entry animations, data-flow animations, state transitions
5. **Composable** — small atoms combine into complex molecules (neuron → layer → network)
6. **Semantic props** — `variant="attention"` not `color="#7C3AED"`
7. **Accessible** — ARIA labels on all interactive elements, reduced-motion respected
8. **No runtime dependencies** beyond React, GSAP, Framer Motion, KaTeX
9. **Storybook-first** — every component has a story before it ships

---

## Component Inventory (280 components across 12 categories)

---

### 1. DESIGN TOKENS (not components, but foundation)
- Color palette: `--color-neuron`, `--color-data`, `--color-gradient-start`, `--color-loss`, `--color-accuracy`, `--color-attention`
- Motion: `--ease-flow`, `--ease-spring`, `--duration-fast`, `--duration-slow`
- Typography: `--font-mono`, `--font-display`, `--font-body`
- Border radius, shadow levels

---

### 2. ICON SYSTEM (45 icons)

#### AI Model Icons
- `IconNeuron` — single neuron with dendrites
- `IconLayer` — stacked horizontal bars
- `IconTransformer` — encoder+decoder block shape
- `IconAttention` — radial connection pattern
- `IconEmbedding` — vector/arrow bundle
- `IconToken` — small rectangular chip
- `IconVocabulary` — grid of chips
- `IconPositionalEncoding` — wave + position marker
- `IconEncoderBlock`
- `IconDecoderBlock`
- `IconFeedForward`
- `IconResidualConnection` — loop-back arrow
- `IconLayerNorm`
- `IconSoftmax`
- `IconActivation` — ReLU curve shape

#### Process Icons
- `IconTraining` — circular arrow with weight symbol
- `IconInference` — right-pointing bolt
- `IconFineTuning` — wrench on model shape
- `IconRAG` — document + brain connection
- `IconAgent` — robot head with decision branches
- `IconTool` — wrench icon
- `IconMemory` — brain with storage symbol
- `IconPrompt` — speech bubble with code
- `IconChain` — linked rings
- `IconBackprop` — reverse arrow with gradient

#### Data Icons
- `IconDataset` — stacked papers
- `IconBatch` — subset of stacked papers
- `IconEpoch` — circular loop around dataset
- `IconAugmentation` — branching transforms
- `IconPreprocessing` — funnel
- `IconLabeling` — tag on data point
- `IconSplit` — fork (train/val/test)
- `IconFeature` — column highlight in table

#### Infrastructure Icons
- `IconGPU` — chip with parallel lanes
- `IconCPU` — chip
- `IconTPU` — stylized chip
- `IconVRAM` — memory bars
- `IconDistributed` — connected nodes
- `IconCheckpoint` — save marker on timeline
- `IconAPI` — plug symbol
- `IconCloud` — standard cloud

#### Metric Icons
- `IconAccuracy` — target with bullseye
- `IconLoss` — downward curve
- `IconF1Score` — overlapping circles
- `IconPrecision` — high accuracy pointer
- `IconRecall` — net catching dots
- `IconPerplexity` — question mark with chart

---

### 3. ARROW & CONNECTOR COMPONENTS (28)

```
StraightArrow         — clean directional arrow, label prop
CurvedArrow           — bezier arc, configurable curvature
BidirectionalArrow    — double-headed
DashedArrow           — for "optional" or "skip" connections
AnimatedFlowArrow     — particle flowing along path (GSAP)
GradientArrow         — color transitions along length
ElbowArrow            — right-angle connector
LabeledArrow          — arrow + floating label mid-path
AnnotationLine        — thin line from callout to element
BracketConnector      — { or } bracket linking items
MatrixConnector       — lines from all-to-all (attention pattern)
TreeConnector         — parent to children
ResidualArrow         — loop-back (skip connection)
DataFlowPipe          — thick pipe with flow animation
TwoPhaseArrow         — forward + backward (backprop)
WeightedArrow         — thickness = weight magnitude
ProbabilityArrow      — fades based on probability
SelfAttentionArc      — curved arc within same sequence
CrossAttentionArc     — arc crossing encoder/decoder gap
GradientFlowArrow     — animated gradient backward
MemoryReadArrow       — from memory store to attention
ToolCallArrow         — agent → tool
ToolReturnArrow       — tool → agent
ChainArrow            — chain step connector
RAGRetrievalArrow     — query → document
RAGAugmentArrow       — document → context
FeedbackArrow         — output looping back to input
TimelineArrow         — horizontal progress arrow
```

---

### 4. NEURAL NETWORK COMPONENTS (35)

```
Neuron                     — circle with activation value, pulse animation
NeuronWithWeights          — neuron + incoming weight lines
InputNeuron
OutputNeuron
HiddenNeuron
NeuronLayer                — row of neurons with spacing control
FullyConnectedNetwork      — configurable depth/width, animated forward pass
ConvolutionalFilter        — sliding window on input grid
ConvolutionalLayer         — filter + feature map
PoolingLayer               — max/avg pool visualization
ActivationMap              — heatmap on feature grid
AttentionHead              — Q/K/V boxes → scores → output
MultiHeadAttention         — parallel attention heads
SelfAttentionPattern       — sequence × sequence heatmap
CrossAttentionPattern      — encoder × decoder heatmap
TransformerEncoderBlock    — full block diagram
TransformerDecoderBlock    — full block diagram
TransformerStack           — N stacked encoder blocks
EmbeddingLookup            — token → embedding vector animation
PositionalEncodingViz      — sine waves per dimension
FeedForwardBlock           — two linear layers + activation
ResidualConnectionViz      — addition node + bypass
LayerNormViz               — normalization animation
GradientFlowViz            — color-coded gradient magnitude
BackpropAnimation          — chain rule step by step
ForwardPassAnimation       — data flowing through layers
WeightUpdateViz            — weight matrix cell updates
LossSurfaceViz             — 3D-style loss landscape (2D projection)
GradientDescentPath        — path on loss surface
LearningRateEffect         — step size on loss surface
BatchNormViz               — batch statistics normalization
DropoutViz                 — random neuron masking animation
ActivationFunction         — ReLU/GELU/Sigmoid curve plotter
SoftmaxViz                 — logits → probabilities bars
```

---

### 5. TRANSFORMER & LLM COMPONENTS (25)

```
TokenChip                  — single token, color by type
TokenSequence              — row of TokenChips
TokenizationAnimation      — text → tokens animation
VocabularyGrid             — token vocabulary grid
EmbeddingVector            — visual vector with magnitude bars
EmbeddingSpace2D           — 2D scatter of word embeddings
ContextWindow              — sliding window on token sequence
AttentionScoreMatrix       — full NxN attention heatmap
AttentionWeightBar         — per-token attention weight
KVCache                    — key/value cache visualization
BeamSearchTree             — branching generation paths
GreedyDecoding             — argmax selection per step
SamplingAnimation          — temperature-scaled probability sampling
TopKSampling               — top-k cutoff visualization
TopPSampling               — nucleus sampling visualization
NextTokenPrediction        — logit bar → softmax → token
AutoregressiveLoop         — generation loop animation
SystemPrompt               — styled prompt box
UserMessage                — chat bubble
AssistantMessage           — chat bubble
FewShotExample             — labeled in-context example
ChainOfThought             — reasoning step sequence
PromptTemplate             — template with slot highlighting
RAGContext                 — retrieved documents + query
InstructionFollowing       — instruction → action mapping
```

---

### 6. ML PIPELINE COMPONENTS (30)

```
DataSourceNode             — database/CSV/API origin
DataIngestionPipeline      — source → preprocessing → model
PreprocessingStep          — transform block
AugmentationStep           — branching variations
TrainValTestSplit          — bar showing proportions
BatchLoader                — batch extraction animation
TrainingLoop               — epoch → batch → forward → loss → backward → update
ValidationLoop             — parallel eval process
CheckpointMarker           — save point on training timeline
EarlyStoppingIndicator     — stop signal on metric plateau
HyperparameterGrid         — grid search visualization
LearningRateSchedule       — LR curve over epochs
WarmupSchedule             — warmup + decay curve
CosineAnnealingCurve
GradientAccumulation       — N steps before update
MixedPrecisionViz          — FP16 + FP32 split
DataParallelism            — data split across GPUs
ModelParallelism            — model split across GPUs
PipelineParallelism        — stage split across GPUs
FineTuningPhase            — pretrained → fine-tuned flow
LoRAViz                    — low-rank adaptation matrix overlay
RLHFLoop                   — human feedback → reward → PPO loop
DPODiagram                 — chosen/rejected pairs flow
EvalHarness                — model → benchmark → metrics
ModelCard                  — structured model info display
DataCard                   — dataset metadata display
ExperimentTracker          — runs comparison table
ABTestComparison           — two models side by side
DeploymentPipeline         — train → eval → deploy flow
InferencePipeline          — request → tokenize → model → decode → response
```

---

### 7. AGENT & TOOL-USE COMPONENTS (20)

```
AgentLoop                  — think → act → observe cycle
ReActStep                  — Thought / Action / Observation block
ToolRegistry               — list of available tools
ToolCallBlock              — structured tool invocation
ToolResponseBlock          — tool output
PlanningStep               — goal decomposition tree
MemoryStore                — short/long-term memory boxes
MemoryRetrieval            — query → memory → result
VectorDatabase             — document chunks + similarity search
RAGPipeline                — full retrieval-augmented generation flow
MultiAgentSystem           — orchestrator + worker agents
AgentHandoff               — one agent passing to another
CodeInterpreter            — code block + execution result
BrowserUseViz              — agent navigating webpage
ComputerUseViz             — desktop automation steps
GuardrailLayer             — safety filter on input/output
StructuredOutput           — JSON schema + model output
FunctionCallingViz         — function spec → model → call
MCPServerViz               — MCP server connection diagram
AgentEvaluation            — task → trajectory → scoring
```

---

### 8. CHART & METRIC COMPONENTS (25)

```
LossChart                  — training + validation loss over epochs (Recharts)
AccuracyChart              — accuracy over epochs
LearningCurve              — train vs val gap animation
ConfusionMatrix            — NxN heatmap with labels
ROCCurve                   — with AUC annotation
PRCurve                    — precision-recall curve
CalibrationPlot            — predicted vs actual probability
FeatureImportanceBar       — horizontal bar chart
AttentionHeatmap           — 2D color heatmap (generic)
ActivationHistogram        — layer activation distribution
GradientMagnitudeBar       — per-layer gradient norms
ParameterCountBar          — model size comparison
BenchmarkRadar             — multi-metric radar chart
ModelLeaderboard           — ranked table with sparklines
TokensPerSecond            — throughput gauge
CostPerToken               — cost comparison bar
ContextLengthComparison    — timeline bar per model
MemoryUsageStack           — VRAM breakdown stack bar
ThroughputLatencyScatter   — scatter of models
EvalScoreCard              — single metric big number display
DeltaIndicator             — +/- change with arrow
SparklineInline            — tiny trend line in text
ProgressBar                — training progress
MetricGauge                — speedometer-style
LiveMetricTicker           — animated counting up
```

---

### 9. COMPARISON & LAYOUT COMPONENTS (20)

```
SideBySideComparison       — two columns with diff highlighting
BeforeAfterSlider          — draggable reveal
VersionTimeline            — GPT-2 → GPT-3 → GPT-4 timeline
ModelFamilyTree            — branching genealogy
ParameterComparisonTable   — models × specs matrix
CapabilityMatrix           — model × task heatmap
ProConsList                — structured pros/cons
TradoffDiagram             — triangle trade-off (speed/quality/cost)
ScalingLawChart            — log-log compute vs performance
EmergenceTimeline          — capability appearing at scale
ArchitectureComparison     — two arch diagrams side by side
PaperHighlight             — arxiv-style paper summary card
ConceptEvolution           — idea evolving across versions
ResearchLineage            — citing papers chain
TechStack                  — layer stack diagram
InfrastructureDiagram      — cloud + on-prem layout
CostBreakdown              — pie or treemap
LatencyStack               — time breakdown waterfall
ErrorAnalysis              — error categories donut
AblationTable              — component contribution table
```

---

### 10. ANNOTATION & EXPLANATION COMPONENTS (25)

```
Callout                    — box with directional arrow pointing to element
FloatingLabel              — label attached to a diagram element
MathAnnotation             — KaTeX formula with explanation
CodeAnnotation             — highlighted code + side note
StepBubble                 — numbered circle with label
ProcessStep                — step N of M with progress bar
KeyTakeaway                — highlighted insight box
DefinitionCard             — term + definition
WarnBox                    — caution/pitfall callout
TipBox                     — pro tip callout
NoteBox                    — supplemental info
QuoteBlock                 — paper quote with citation
FormulaBreakdown           — equation with labeled parts
PseudoCode                 — styled algorithm block
Highlight                  — inline text highlight with label
GlossaryTerm               — term + hover definition
IntuitiveExplanation       — "in plain English" box
MathIntuition              — geometric/visual math explanation
AnalogyCard                — concept mapped to real-world analogy
CommonMistake              — anti-pattern warning
DeepDiveLink               — "learn more" expandable
SourceCitation             — paper/blog reference
ContributorNote            — expert voice callout
InteractiveHint            — "try clicking X" prompt
RevealAnswer               — hidden answer toggle
```

---

### 11. TYPOGRAPHY COMPONENTS (15)

```
DisplayHeading             — hero-size concept title
SectionHeading             — H2 with optional icon
SubHeading                 — H3
BodyText                   — optimized reading text
CaptionText                — figure captions
CodeInline                 — `monospace` styled
CodeBlock                  — Shiki-powered syntax highlight
MathBlock                  — KaTeX display math
MathInline                 — KaTeX inline math
Label                      — small all-caps label
Badge                      — colored category badge
Tag                        — topic tag chip
MonoValue                  — numeric readout in mono
UnitLabel                  — value + unit pair
GradientText               — text with gradient fill
```

---

### 12. LAYOUT & CONTAINER COMPONENTS (17)

```
SlideContainer             — 16:9 presentation frame
InfographicCanvas          — free-layout canvas with grid snap
ConceptCard                — bordered concept unit
StepSequence               — numbered horizontal or vertical steps
TimelineLayout             — horizontal or vertical timeline
HierarchyLayout            — tree layout wrapper
GridLayout                 — n-column grid container
FlowLayout                 — auto-connected flow diagram wrapper
TwoColumnLayout            — split panel
ThreeColumnLayout
DiagramPanel               — titled panel with border
TabContainer               — tabbed diagram switcher
AccordionSection           — expand/collapse content
ProgressiveReveal          — step-by-step disclosure
StickyAnnotation           — annotation that stays on scroll
ResponsiveScale            — auto-scales to container width
DarkBackground             — dark canvas for light components
```

---

## Implementation Phases

Each phase follows the same TDD loop per component:
`write test → fail → write component → pass → refactor → story → snapshot`

### Phase 1 — Foundation (Week 1–2)
- Repo scaffold: pnpm workspace, Vite, tsup, Vitest, Testing Library, Storybook 8
- GitHub Actions CI pipeline (test + coverage + Chromatic)
- Design tokens (CSS vars) with token tests asserting correct CSS var presence
- Typography components — tests first (renders correct HTML tag, font-size token applied)
- Icon system — 45 icons, each tested for: SVG output, `aria-label`, `size` prop, `className` forwarding

### Phase 2 — Arrows & Connectors (Week 3)
- Test harness for SVG path components (path `d` attribute assertions)
- 28 arrow/connector components — tests cover: renders path, label prop, direction variants
- GSAP mock utility shared across animated component tests
- Storybook play functions for interactive arrows

### Phase 3 — Neural Network Core (Week 4–5)
- Neuron: tests for activation display, click handler, pulse animation init
- NeuronLayer: tests for neuron count rendering, spacing prop
- FullyConnectedNetwork: tests for layer count, connection line count
- Attention components: tests for head count, score matrix cell count
- Transformer blocks: tests for structural composition (encoder has attention + FFN + norm)
- Forward/backprop animations: test animation initiation, not timing

### Phase 4 — LLM & Pipeline (Week 6–7)
- Token + TokenSequence: tests for token count, type coloring
- EmbeddingVector: tests for dimension count rendering
- Generation components: tests for autoregressive step render
- ML pipeline components: each pipeline step tested for input/output connection points
- Agent/tool components: tests for tool registry rendering, call/response display

### Phase 5 — Charts & Comparisons (Week 8)
- Recharts wrapper tests: data prop renders correct number of data points
- Comparison layouts: tests for both-columns rendered, diff highlighting
- Annotation components: tests for callout arrow direction, tooltip trigger

### Phase 6 — Polish & Publish (Week 9–10)
- Coverage audit — close any gaps to meet thresholds
- Chromatic baseline locked (all stories pass)
- axe a11y scan — zero violations gate
- Storybook docs site deploy
- npm publish with changesets
- README + component gallery

---

## File Structure

```
component-library/
├── packages/
│   └── ui/
│       ├── src/
│       │   ├── tokens/
│       │   │   └── tokens.test.ts         # CSS var presence tests
│       │   ├── icons/
│       │   │   ├── IconNeuron.tsx
│       │   │   ├── IconNeuron.test.tsx    # test-first, always co-located
│       │   │   └── IconNeuron.stories.tsx
│       │   ├── arrows/                    # same pattern: .tsx + .test.tsx + .stories.tsx
│       │   ├── neural/
│       │   ├── llm/
│       │   ├── pipeline/        # ML pipeline components
│       │   ├── agents/          # Agent/tool components
│       │   ├── charts/          # Metric chart components
│       │   ├── comparison/      # Comparison layouts
│       │   ├── annotation/      # Callouts, labels
│       │   ├── typography/      # Text components
│       │   ├── layout/          # Container components
│       │   └── index.ts         # Barrel export
│       ├── package.json
│       └── tsup.config.ts
├── apps/
│   └── storybook/               # Storybook explorer
├── .storybook/
├── package.json                 # pnpm workspace root
└── PLAN.md
```

---

## What Makes This World-Class (Not Slop)

1. **Every animation has a semantic reason** — particle flow = data moving, not decoration
2. **Reduced motion respected** — `prefers-reduced-motion` disables all GSAP animations
3. **Composable to arbitrary complexity** — Neuron → NeuronLayer → FullyConnectedNetwork → TransformerBlock
4. **Props mirror the math** — `heads={8}` `dModel={512}` `dFF={2048}` match the paper
5. **Consistent visual language** — same color = same concept across all components
6. **No mystery defaults** — every visual encoding is documented (why blue = gradient, orange = loss)
7. **Works in dark AND light** — CSS var swap, not component variants
8. **Built Storybook-first** — if you can't tell the story in isolation, the component is wrong
