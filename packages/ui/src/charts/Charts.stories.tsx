import type { Meta, StoryObj } from "@storybook/react";
import { LossChart, AccuracyChart, ConfusionMatrix, ROCCurve, BenchmarkRadar, ModelLeaderboard, EvalScoreCard, DeltaIndicator, MetricGauge, ParameterCountBar, FeatureImportanceBar, VersionTimeline, CapabilityMatrix, ProConsList, TradeoffDiagram, ScalingLawChart, PaperHighlight, SparklineInline, SideBySideComparison } from "./Charts";

const meta: Meta = { title: "Charts & Comparisons", parameters: { layout: "padded", backgrounds: { default: "dark" } }, tags: ["autodocs"] };
export default meta;

const lossData = Array.from({ length: 20 }, (_, i) => ({
  epoch: i + 1,
  train: 2.5 * Math.exp(-i * 0.18) + 0.3 + Math.random() * 0.05,
  val:   2.5 * Math.exp(-i * 0.15) + 0.45 + Math.random() * 0.08,
}));

export const TrainingCharts: StoryObj = {
  render: () => (
    <div className="flex gap-6 flex-wrap p-4">
      <LossChart data={lossData} width={340} height={200} />
      <AccuracyChart data={lossData.map(d => ({ epoch: d.epoch, train: 1 - d.train / 3, val: 1 - d.val / 3 }))} width={340} height={200} />
    </div>
  ),
};

export const ConfusionMatrixStory: StoryObj = {
  name: "Confusion Matrix",
  render: () => (
    <ConfusionMatrix
      matrix={[[89, 6, 5], [3, 92, 5], [2, 4, 94]]}
      labels={["Cat", "Dog", "Bird"]}
    />
  ),
};

export const ROC: StoryObj = {
  name: "ROC Curve",
  render: () => (
    <ROCCurve
      points={[{fpr:0,tpr:0},{fpr:0.05,tpr:0.5},{fpr:0.1,tpr:0.75},{fpr:0.2,tpr:0.88},{fpr:0.4,tpr:0.95},{fpr:1,tpr:1}]}
      auc={0.931}
    />
  ),
};

export const Radar: StoryObj = {
  render: () => (
    <BenchmarkRadar
      metrics={["MMLU", "GSM8K", "HumanEval", "BBH", "HellaSwag"]}
      models={[
        { name: "GPT-4",     scores: [0.86, 0.92, 0.87, 0.83, 0.95] },
        { name: "Claude-3",  scores: [0.88, 0.89, 0.91, 0.86, 0.93] },
      ]}
    />
  ),
};

export const Leaderboard: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <ModelLeaderboard models={[
        { rank: 1, name: "GPT-4o",     score: 94.2, delta: 1.8 },
        { rank: 2, name: "Claude-3.7", score: 93.8, delta: 0.6 },
        { rank: 3, name: "Gemini 2",   score: 92.1, delta: -0.4 },
        { rank: 4, name: "Llama-3",    score: 88.6, delta: 3.2 },
      ]} />
      <div className="flex gap-4 flex-wrap">
        <EvalScoreCard metric="MMLU" value={88.4} unit="%" delta={2.1} />
        <EvalScoreCard metric="HumanEval" value={91.2} unit="%" delta={-0.3} />
        <EvalScoreCard metric="GSM8K" value={96.7} unit="%" delta={1.5} />
      </div>
    </div>
  ),
};

export const Gauges: StoryObj = {
  render: () => (
    <div className="flex gap-6 p-4 items-start">
      <MetricGauge value={0.923} label="Accuracy" />
      <MetricGauge value={0.654} label="F1 Score" color="attention" />
      <MetricGauge value={0.312} label="Loss" color="loss" />
    </div>
  ),
};

export const ModelSizes: StoryObj = {
  render: () => (
    <ParameterCountBar
      models={[
        { name: "GPT-4",     params: 1800 },
        { name: "Claude-3",  params: 200  },
        { name: "GPT-3.5",   params: 175  },
        { name: "Llama-3",   params: 70   },
        { name: "GPT-2",     params: 1.5  },
      ]}
      unit="B"
    />
  ),
};

export const Timeline: StoryObj = {
  render: () => (
    <VersionTimeline
      versions={[
        { name: "GPT-2",    year: 2019, params: "1.5B"  },
        { name: "GPT-3",    year: 2020, params: "175B"  },
        { name: "InstructGPT", year: 2022, params: "175B" },
        { name: "GPT-4",    year: 2023, params: "~1.8T" },
        { name: "GPT-4o",   year: 2024, params: "?"     },
      ]}
      width={560}
    />
  ),
};

export const ScalingLaws: StoryObj = {
  render: () => (
    <ScalingLawChart
      points={[
        { compute: 1e19, loss: 3.8 },
        { compute: 1e20, loss: 3.3 },
        { compute: 1e21, loss: 2.9 },
        { compute: 1e22, loss: 2.6 },
        { compute: 1e23, loss: 2.35 },
        { compute: 1e24, loss: 2.15 },
      ]}
    />
  ),
};

export const Comparisons: StoryObj = {
  render: () => (
    <div className="space-y-6 p-4">
      <CapabilityMatrix
        models={["GPT-4", "Claude-3", "Gemini", "Llama-3"]}
        tasks={["Coding", "Math", "Writing", "Reasoning", "Vision"]}
        scores={[
          [0.92, 0.95, 0.88, 0.91, 0.90],
          [0.90, 0.91, 0.92, 0.93, 0.88],
          [0.88, 0.90, 0.89, 0.89, 0.94],
          [0.85, 0.83, 0.88, 0.86, 0.00],
        ]}
      />
      <ProConsList
        pros={["State-of-the-art reasoning", "Large context window", "Multimodal"]}
        cons={["High API cost", "Closed weights", "Rate limits"]}
      />
    </div>
  ),
};

export const TradeoffViz: StoryObj = {
  render: () => (
    <div className="flex gap-8 p-4">
      <div>
        <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">GPT-4 (quality-focused)</p>
        <TradeoffDiagram quality={0.95} speed={0.30} cost={0.10} />
      </div>
      <div>
        <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">Llama-3 (balanced)</p>
        <TradeoffDiagram quality={0.75} speed={0.80} cost={0.90} />
      </div>
    </div>
  ),
};

export const Paper: StoryObj = {
  render: () => (
    <PaperHighlight
      title="Attention Is All You Need"
      authors={["Vaswani", "Shazeer", "Parmar", "Uszkoreit", "Jones", "Gomez", "Kaiser", "Polosukhin"]}
      year={2017}
      venue="NeurIPS"
      abstract="We propose a new simple network architecture, the Transformer, based solely on attention mechanisms, dispensing with recurrence and convolutions entirely."
      tags={["transformer", "attention", "self-supervised", "nlp"]}
    />
  ),
};
