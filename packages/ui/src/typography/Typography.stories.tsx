import type { Meta, StoryObj } from "@storybook/react";
import { DisplayHeading, SectionHeading, SubHeading, BodyText, CaptionText, CodeInline, Label, Badge, Tag, MonoValue, UnitLabel, GradientText } from "./Typography";

const meta: Meta = { title: "Typography", parameters: { layout: "padded" }, tags: ["autodocs"] };
export default meta;

export const AllTypography: StoryObj = {
  render: () => (
    <div className="space-y-6 p-6 bg-[var(--color-bg)] min-h-screen">
      <DisplayHeading>Attention Is All You Need</DisplayHeading>
      <SectionHeading>Transformer Architecture</SectionHeading>
      <SubHeading>Multi-Head Attention</SubHeading>
      <BodyText>The transformer model relies entirely on attention mechanisms, dispensing with recurrence and convolutions entirely.</BodyText>
      <BodyText variant="muted">Originally published at NeurIPS 2017.</BodyText>
      <CaptionText>Figure 1: Scaled dot-product attention mechanism.</CaptionText>
      <div className="flex flex-wrap gap-3 items-center">
        <Label>Parameters</Label>
        <CodeInline>model.fit(X, y)</CodeInline>
        <Badge variant="neuron">Transformer</Badge>
        <Badge variant="attention">Attention</Badge>
        <Badge variant="data">Input</Badge>
        <Tag>NLP</Tag>
        <Tag>Self-Supervised</Tag>
      </div>
      <div className="flex flex-wrap gap-4 items-baseline">
        <MonoValue>0.9234</MonoValue>
        <UnitLabel value="175" unit="B params" />
        <UnitLabel value="32k" unit="context" />
      </div>
      <div className="text-3xl">
        <GradientText from="neuron" to="attention">Neural Networks</GradientText>
      </div>
    </div>
  ),
};

export const Badges: StoryObj = {
  render: () => (
    <div className="flex flex-wrap gap-2 p-4">
      {(["default", "neuron", "data", "attention", "loss", "accuracy", "agent", "token"] as const).map(v => (
        <Badge key={v} variant={v}>{v}</Badge>
      ))}
    </div>
  ),
};
