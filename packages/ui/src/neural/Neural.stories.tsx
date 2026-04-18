import type { Meta, StoryObj } from "@storybook/react";
import { Neuron, NeuronLayer, FullyConnectedNetwork, AttentionHead, MultiHeadAttention, SelfAttentionPattern, TransformerEncoderBlock, TransformerDecoderBlock, FeedForwardBlock, ResidualConnectionViz, ActivationFunction, SoftmaxViz, DropoutViz, EmbeddingLookup, LayerNormViz } from "./Neural";

const meta: Meta = { title: "Neural Network", parameters: { layout: "centered", backgrounds: { default: "dark" } }, tags: ["autodocs"] };
export default meta;

export const NeuronVariants: StoryObj = {
  render: () => (
    <div className="flex gap-4 items-center p-4">
      <Neuron variant="input" activation={0.8} showValue animated />
      <Neuron variant="hidden" activation={0.4} showValue />
      <Neuron variant="output" activation={0.95} showValue />
      <Neuron isActive />
    </div>
  ),
};

export const Layer: StoryObj = {
  render: () => (
    <NeuronLayer neurons={6} activations={[0.1, 0.9, 0.3, 0.8, 0.5, 0.7]} showValues />
  ),
};

export const Network: StoryObj = {
  render: () => (
    <FullyConnectedNetwork layers={[3, 5, 5, 2]} showLabels animated />
  ),
};

export const Attention: StoryObj = {
  render: () => (
    <div className="flex gap-8 items-start p-4">
      <AttentionHead showFormula />
      <MultiHeadAttention heads={8} dModel={512} />
    </div>
  ),
};

export const AttentionPatterns: StoryObj = {
  render: () => (
    <div className="flex gap-6 items-start p-4">
      <div>
        <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">Self-Attention</p>
        <SelfAttentionPattern tokens={6} labels={["The", "cat", "sat", "on", "the", "mat"]} />
      </div>
    </div>
  ),
};

export const TransformerBlocks: StoryObj = {
  render: () => (
    <div className="flex gap-6 items-start p-4">
      <TransformerEncoderBlock heads={8} dModel={512} dFF={2048} />
      <TransformerDecoderBlock heads={8} dModel={512} dFF={2048} />
    </div>
  ),
};

export const ActivationFunctions: StoryObj = {
  render: () => (
    <div className="grid grid-cols-2 gap-4 p-4">
      {(["relu", "gelu", "sigmoid", "tanh"] as const).map(fn => (
        <ActivationFunction key={fn} fn={fn} />
      ))}
    </div>
  ),
};

export const Softmax: StoryObj = {
  render: () => (
    <SoftmaxViz logits={[3.0, 1.5, 0.8, -0.2]} labels={["cat", "dog", "bird", "fish"]} />
  ),
};

export const EmbeddingAndNorm: StoryObj = {
  render: () => (
    <div className="flex gap-6 items-start p-4">
      <EmbeddingLookup token="transformer" dimensions={12} />
      <LayerNormViz showStats />
    </div>
  ),
};

export const Dropout: StoryObj = {
  render: () => (
    <div className="flex gap-6 items-start p-4">
      <div>
        <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">rate=0.3</p>
        <DropoutViz neurons={12} rate={0.3} />
      </div>
      <div>
        <p className="text-xs font-mono text-[var(--color-text-muted)] mb-2">rate=0.5</p>
        <DropoutViz neurons={12} rate={0.5} />
      </div>
    </div>
  ),
};
