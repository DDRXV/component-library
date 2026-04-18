import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { GSAP_DURATIONS, GSAP_EASINGS } from "@/tokens/tokens";
import { resolveColor, useReducedMotion } from "@/arrows/arrow-utils";

// ── Shared helpers ────────────────────────────────────────────────────────────

function mkId(base: string) {
  return `${base}-${Math.random().toString(36).slice(2, 6)}`;
}

type NeuronVariant = "input" | "hidden" | "output";

const VARIANT_COLORS: Record<NeuronVariant, string> = {
  input:  "var(--color-data)",
  hidden: "var(--color-neuron)",
  output: "var(--color-accuracy)",
};

// ── 1. Neuron ─────────────────────────────────────────────────────────────────

interface NeuronProps extends React.SVGAttributes<SVGSVGElement> {
  size?: number;
  activation?: number;
  showValue?: boolean;
  variant?: NeuronVariant;
  color?: string;
  isActive?: boolean;
  animated?: boolean;
  onActivate?: () => void;
  "aria-label"?: string;
}

export function Neuron({
  size = 44,
  activation,
  showValue = false,
  variant = "hidden",
  color,
  isActive = false,
  animated = false,
  onActivate,
  className,
  "aria-label": ariaLabel = "Neuron",
  ...props
}: NeuronProps) {
  const circleRef = useRef<SVGCircleElement>(null);
  const reducedMotion = useReducedMotion();
  const c = color ? resolveColor(color) : VARIANT_COLORS[variant];
  const r = size / 2 - 4;
  const fillOpacity = activation !== undefined ? 0.1 + activation * 0.7 : 0.15;

  useEffect(() => {
    if (!animated || reducedMotion || !circleRef.current) return;
    gsap.to(circleRef.current, {
      scale: 1.12,
      duration: GSAP_DURATIONS.slow,
      ease: GSAP_EASINGS.spring,
      yoyo: true,
      repeat: -1,
      transformOrigin: "center center",
    });
    return () => { gsap.killTweensOf(circleRef.current); };
  }, [animated, reducedMotion]);

  return (
    <svg
      width={size}
      height={size}
      viewBox={`0 0 ${size} ${size}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0 cursor-pointer", className)}
      {...props}
    >
      {/* outer ring for output variant */}
      {variant === "output" && (
        <circle cx={size / 2} cy={size / 2} r={r + 4} fill="none" stroke={c} strokeWidth={0.75} opacity={0.4} />
      )}
      <circle
        ref={circleRef}
        data-neuron
        data-variant={variant}
        data-active={isActive ? "true" : "false"}
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill={c}
        fillOpacity={isActive ? 0.85 : fillOpacity}
        stroke={c}
        strokeWidth={isActive ? 2 : 1.5}
        onClick={onActivate}
      />
      {showValue && activation !== undefined && (
        <text
          x={size / 2}
          y={size / 2 + 4}
          textAnchor="middle"
          fill={c}
          fontSize={Math.max(8, size * 0.22)}
          fontFamily="var(--font-mono)"
        >
          {activation.toFixed(2)}
        </text>
      )}
    </svg>
  );
}

export function InputNeuron(props: NeuronProps) {
  return <Neuron variant="input" aria-label="InputNeuron" {...props} />;
}

export function HiddenNeuron(props: NeuronProps) {
  return <Neuron variant="hidden" aria-label="HiddenNeuron" {...props} />;
}

export function OutputNeuron(props: NeuronProps) {
  return <Neuron variant="output" aria-label="OutputNeuron" {...props} />;
}

// ── 2. NeuronWithWeights ──────────────────────────────────────────────────────

interface NeuronWithWeightsProps extends React.SVGAttributes<SVGSVGElement> {
  weights?: number[];
  neuronSize?: number;
  "aria-label"?: string;
}

export function NeuronWithWeights({
  weights = [0.5, 0.3, 0.8],
  neuronSize = 44,
  className,
  "aria-label": ariaLabel = "NeuronWithWeights",
  ...props
}: NeuronWithWeightsProps) {
  const n = weights.length;
  const w = 160;
  const h = Math.max(neuronSize * 2, n * 28 + 20);
  const cx = w - neuronSize / 2;
  const cy = h / 2;
  const inputXs = Array.from({ length: n }, () => 12);
  const inputYs = Array.from({ length: n }, (_, i) => 10 + i * ((h - 20) / (n - 1 || 1)));

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {weights.map((wt, i) => (
        <line
          key={i}
          data-weight
          x1={inputXs[i] + 4}
          y1={inputYs[i]}
          x2={cx - neuronSize / 2 + 4}
          y2={cy}
          stroke="var(--color-weight)"
          strokeWidth={0.5 + Math.abs(wt) * 3}
          opacity={0.3 + Math.abs(wt) * 0.7}
        />
      ))}
      {weights.map((_, i) => (
        <circle key={`src-${i}`} cx={12} cy={inputYs[i]} r={4} fill="var(--color-data)" opacity={0.6} />
      ))}
      <Neuron
        size={neuronSize}
        x={cx - neuronSize / 2}
        y={cy - neuronSize / 2}
        className="overflow-visible"
      />
    </svg>
  );
}

// ── 3. NeuronLayer ────────────────────────────────────────────────────────────

interface NeuronLayerProps extends React.SVGAttributes<SVGSVGElement> {
  neurons?: number;
  activations?: number[];
  showValues?: boolean;
  variant?: NeuronVariant;
  spacing?: number;
  neuronSize?: number;
  direction?: "horizontal" | "vertical";
  "aria-label"?: string;
}

export function NeuronLayer({
  neurons = 4,
  activations,
  showValues = false,
  variant = "hidden",
  spacing = 56,
  neuronSize = 40,
  direction = "horizontal",
  className,
  "aria-label": ariaLabel = "NeuronLayer",
  ...props
}: NeuronLayerProps) {
  const isH = direction === "horizontal";
  const total = neurons;
  const w = isH ? total * spacing : neuronSize + 20;
  const h = isH ? neuronSize + 20 : total * spacing;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0 overflow-visible", className)}
      {...props}
    >
      {Array.from({ length: total }, (_, i) => {
        const cx = isH ? spacing / 2 + i * spacing : neuronSize / 2 + 10;
        const cy = isH ? neuronSize / 2 + 10 : spacing / 2 + i * spacing;
        const activation = activations?.[i];
        const c = VARIANT_COLORS[variant];
        const fillOpacity = activation !== undefined ? 0.1 + activation * 0.7 : 0.15;
        return (
          <g key={i}>
            <circle
              data-neuron
              data-variant={variant}
              data-active="false"
              cx={cx}
              cy={cy}
              r={neuronSize / 2 - 2}
              fill={c}
              fillOpacity={fillOpacity}
              stroke={c}
              strokeWidth={1.5}
            />
            {showValues && activation !== undefined && (
              <text
                x={cx}
                y={cy + 4}
                textAnchor="middle"
                fill={c}
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {activation.toFixed(2)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// ── 4. FullyConnectedNetwork ──────────────────────────────────────────────────

interface FullyConnectedNetworkProps extends React.SVGAttributes<SVGSVGElement> {
  layers?: number[];
  activations?: number[][];
  animated?: boolean;
  showLabels?: boolean;
  layerSpacing?: number;
  neuronSpacing?: number;
  neuronSize?: number;
  "aria-label"?: string;
}

export function FullyConnectedNetwork({
  layers = [3, 4, 3],
  activations,
  animated = false,
  showLabels = false,
  layerSpacing = 100,
  neuronSpacing = 52,
  neuronSize = 32,
  className,
  "aria-label": ariaLabel = "FullyConnectedNetwork",
  ...props
}: FullyConnectedNetworkProps) {
  const reducedMotion = useReducedMotion();
  const connectionGroupRefs = useRef<(SVGGElement | null)[]>([]);

  const maxNeurons = Math.max(...layers);
  const w = (layers.length - 1) * layerSpacing + neuronSize + 40;
  const h = maxNeurons * neuronSpacing + 20;

  const neuronPositions = layers.map((count, li) => {
    const x = 20 + li * layerSpacing + neuronSize / 2;
    return Array.from({ length: count }, (_, ni) => {
      const y = h / 2 + (ni - (count - 1) / 2) * neuronSpacing;
      return { x, y };
    });
  });

  const LAYER_LABELS = (li: number, total: number) => {
    if (li === 0) return "Input";
    if (li === total - 1) return "Output";
    return `Hidden ${li}`;
  };

  useEffect(() => {
    if (!animated || reducedMotion) return;
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 });
    connectionGroupRefs.current.forEach((g) => {
      if (g) tl.to(g, { opacity: 1, duration: GSAP_DURATIONS.normal, ease: GSAP_EASINGS.flow }, ">");
    });
    return () => { tl.kill(); };
  }, [animated, reducedMotion, layers.join(",")]);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0 overflow-visible", className)}
      {...props}
    >
      {/* connections */}
      {layers.slice(0, -1).map((_, li) => (
        <g
          key={`conn-${li}`}
          ref={(el) => { connectionGroupRefs.current[li] = el; }}
          opacity={animated ? 0.2 : 0.25}
        >
          {neuronPositions[li].map((src, si) =>
            neuronPositions[li + 1].map((dst, di) => (
              <line
                key={`${si}-${di}`}
                data-connection
                x1={src.x + neuronSize / 2 - 2}
                y1={src.y}
                x2={dst.x - neuronSize / 2 + 2}
                y2={dst.y}
                stroke="var(--color-weight)"
                strokeWidth={0.7}
                opacity={0.5}
              />
            ))
          )}
        </g>
      ))}

      {/* neurons */}
      {neuronPositions.map((positions, li) => {
        const variant: NeuronVariant = li === 0 ? "input" : li === layers.length - 1 ? "output" : "hidden";
        const c = VARIANT_COLORS[variant];
        return positions.map((pos, ni) => {
          const activation = activations?.[li]?.[ni];
          const fillOpacity = activation !== undefined ? 0.1 + activation * 0.7 : 0.2;
          return (
            <circle
              key={`${li}-${ni}`}
              data-neuron
              data-variant={variant}
              data-active="false"
              cx={pos.x}
              cy={pos.y}
              r={neuronSize / 2 - 2}
              fill={c}
              fillOpacity={fillOpacity}
              stroke={c}
              strokeWidth={1.5}
            />
          );
        });
      })}

      {/* layer labels */}
      {showLabels && neuronPositions.map((positions, li) => {
        const topY = Math.min(...positions.map((p) => p.y)) - neuronSize / 2 - 10;
        return (
          <text
            key={`lbl-${li}`}
            x={positions[0].x}
            y={topY}
            textAnchor="middle"
            fill="var(--color-text-secondary)"
            fontSize="10"
            fontFamily="var(--font-body)"
          >
            {LAYER_LABELS(li, layers.length)}
          </text>
        );
      })}
    </svg>
  );
}

// ── 5. AttentionHead ──────────────────────────────────────────────────────────

interface AttentionHeadProps extends React.SVGAttributes<SVGSVGElement> {
  dModel?: number;
  showFormula?: boolean;
  "aria-label"?: string;
}

export function AttentionHead({
  dModel = 64,
  showFormula = false,
  className,
  "aria-label": ariaLabel = "AttentionHead",
  ...props
}: AttentionHeadProps) {
  const attColor = "var(--color-attention)";
  const dataColor = "var(--color-data)";

  return (
    <svg
      width={220}
      height={200}
      viewBox="0 0 220 200"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Q, K, V input boxes */}
      {[["Q", 30], ["K", 80], ["V", 130]].map(([label, y]) => (
        <g key={label}>
          <rect x={10} y={y as number} width={36} height={24} rx={4} fill={attColor} fillOpacity={0.15} stroke={attColor} strokeWidth={1} />
          <text x={28} y={(y as number) + 16} textAnchor="middle" fill={attColor} fontSize="13" fontFamily="var(--font-mono)" fontWeight="600">{label}</text>
          <line x1={46} y1={(y as number) + 12} x2={80} y2={(y as number) + 12} stroke={attColor} strokeWidth={1} opacity={0.6} />
        </g>
      ))}

      {/* Score box */}
      <rect x={80} y={44} width={60} height={54} rx={4} fill={attColor} fillOpacity={0.1} stroke={attColor} strokeWidth={1} />
      <text x={110} y={68} textAnchor="middle" fill={attColor} fontSize="9" fontFamily="var(--font-mono)">Score</text>
      {showFormula
        ? <text x={110} y={86} textAnchor="middle" fill={attColor} fontSize="9" fontFamily="var(--font-mono)">QKᵀ/√d</text>
        : <text x={110} y={84} textAnchor="middle" fill={attColor} fontSize="9" fontFamily="var(--font-mono)">QKᵀ/√d</text>
      }

      {/* Softmax box */}
      <rect x={80} y={112} width={60} height={24} rx={4} fill={dataColor} fillOpacity={0.1} stroke={dataColor} strokeWidth={1} />
      <text x={110} y={128} textAnchor="middle" fill={dataColor} fontSize="10" fontFamily="var(--font-mono)">Softmax</text>

      {/* V line to multiply */}
      <line x1={46} y1={142} x2={140} y2={142} stroke={attColor} strokeWidth={1} opacity={0.5} />
      <line x1={140} y1={124} x2={140} y2={158} stroke={attColor} strokeWidth={1} opacity={0.5} />

      {/* × multiply node */}
      <circle cx={140} cy={160} r={10} fill="var(--color-surface-2)" stroke={attColor} strokeWidth={1} />
      <text x={140} y={164} textAnchor="middle" fill={attColor} fontSize="11">×</text>

      {/* Output */}
      <line x1={140} y1={170} x2={140} y2={188} stroke={dataColor} strokeWidth={1.5} />
      <text x={140} y={198} textAnchor="middle" fill={dataColor} fontSize="10" fontFamily="var(--font-mono)">Output</text>

      {/* dModel label */}
      <text x={200} y={100} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">d={dModel}</text>
    </svg>
  );
}

// ── 6. MultiHeadAttention ─────────────────────────────────────────────────────

interface MultiHeadAttentionProps extends React.SVGAttributes<SVGSVGElement> {
  heads?: number;
  dModel?: number;
  animated?: boolean;
  "aria-label"?: string;
}

export function MultiHeadAttention({
  heads = 8,
  dModel = 512,
  className,
  "aria-label": ariaLabel = "MultiHeadAttention",
  ...props
}: MultiHeadAttentionProps) {
  const attColor = "var(--color-attention)";
  const headW = Math.min(28, Math.floor(300 / heads) - 4);
  const headSpacing = headW + 6;
  const totalW = heads * headSpacing + 40;
  const h = 120;

  return (
    <svg
      width={totalW}
      height={h}
      viewBox={`0 0 ${totalW} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* heads */}
      {Array.from({ length: heads }, (_, i) => (
        <g key={i} data-head={i}>
          <rect
            x={20 + i * headSpacing}
            y={20}
            width={headW}
            height={50}
            rx={3}
            fill={attColor}
            fillOpacity={0.12 + (i % 3) * 0.05}
            stroke={attColor}
            strokeWidth={1}
          />
          <text
            x={20 + i * headSpacing + headW / 2}
            y={48}
            textAnchor="middle"
            fill={attColor}
            fontSize="8"
            fontFamily="var(--font-mono)"
          >
            h{i + 1}
          </text>
        </g>
      ))}

      {/* concat label */}
      <rect x={10} y={78} width={totalW - 20} height={18} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={totalW / 2} y={91} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Concat</text>

      {/* linear label */}
      <rect x={10} y={100} width={totalW - 20} height={16} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={totalW / 2} y={112} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Linear (W^O)</text>

      {/* d_model label */}
      <text x={totalW - 4} y={14} textAnchor="end" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">d={dModel}</text>
    </svg>
  );
}

// ── 7. SelfAttentionPattern ───────────────────────────────────────────────────

interface SelfAttentionPatternProps extends React.SVGAttributes<SVGSVGElement> {
  tokens?: number;
  weights?: number[][];
  labels?: string[];
  "aria-label"?: string;
}

export function SelfAttentionPattern({
  tokens = 5,
  weights,
  labels,
  className,
  "aria-label": ariaLabel = "SelfAttentionPattern",
  ...props
}: SelfAttentionPatternProps) {
  const attColor = "var(--color-attention)";
  const cellSize = 28;
  const labelW = labels ? 40 : 0;
  const totalW = tokens * cellSize + labelW + 20;
  const totalH = tokens * cellSize + (labels ? 28 : 0) + 16;

  // default: identity-ish attention for visual interest
  const defaultWeights = useMemo(() =>
    Array.from({ length: tokens }, (_, i) =>
      Array.from({ length: tokens }, (_, j) =>
        i === j ? 0.9 : Math.max(0, 0.4 - Math.abs(i - j) * 0.12)
      )
    ), [tokens]);

  const w = weights ?? defaultWeights;

  return (
    <svg
      width={totalW}
      height={totalH}
      viewBox={`0 0 ${totalW} ${totalH}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {w.map((row, ri) =>
        row.map((val, ci) => (
          <rect
            key={`${ri}-${ci}`}
            data-cell
            x={labelW + 10 + ci * cellSize}
            y={8 + ri * cellSize}
            width={cellSize - 1}
            height={cellSize - 1}
            rx={1}
            fill={attColor}
            fillOpacity={Math.max(0.04, val)}
          />
        ))
      )}
      {labels?.map((lbl, i) => (
        <text
          key={`rlbl-${i}`}
          x={labelW + 4}
          y={8 + i * cellSize + cellSize / 2 + 4}
          textAnchor="end"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          {lbl}
        </text>
      ))}
      {labels?.map((lbl, i) => (
        <text
          key={`clbl-${i}`}
          x={labelW + 10 + i * cellSize + cellSize / 2}
          y={totalH - 2}
          textAnchor="middle"
          fill="var(--color-text-secondary)"
          fontSize="9"
          fontFamily="var(--font-mono)"
        >
          {lbl}
        </text>
      ))}
    </svg>
  );
}

// ── 8. CrossAttentionPattern ──────────────────────────────────────────────────

interface CrossAttentionPatternProps extends React.SVGAttributes<SVGSVGElement> {
  encoderTokens?: number;
  decoderTokens?: number;
  "aria-label"?: string;
}

export function CrossAttentionPattern({
  encoderTokens = 5,
  decoderTokens = 4,
  className,
  "aria-label": ariaLabel = "CrossAttentionPattern",
  ...props
}: CrossAttentionPatternProps) {
  const cellSize = 28;
  const w = encoderTokens * cellSize + 20;
  const h = decoderTokens * cellSize + 20;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {Array.from({ length: decoderTokens }, (_, ri) =>
        Array.from({ length: encoderTokens }, (_, ci) => {
          const val = Math.max(0.05, 0.6 - Math.abs(ri - ci) * 0.15 + Math.random() * 0.2);
          return (
            <rect
              key={`${ri}-${ci}`}
              data-cell
              x={10 + ci * cellSize}
              y={10 + ri * cellSize}
              width={cellSize - 1}
              height={cellSize - 1}
              rx={1}
              fill="var(--color-attention)"
              fillOpacity={Math.min(1, val)}
            />
          );
        })
      )}
    </svg>
  );
}

// ── 9. TransformerEncoderBlock ────────────────────────────────────────────────

interface TransformerBlockProps extends React.SVGAttributes<SVGSVGElement> {
  heads?: number;
  dModel?: number;
  dFF?: number;
  label?: string;
  "aria-label"?: string;
}

export function TransformerEncoderBlock({
  heads = 8,
  dModel = 512,
  dFF = 2048,
  label,
  className,
  "aria-label": ariaLabel = "TransformerEncoderBlock",
  ...props
}: TransformerBlockProps) {
  const w = 200;
  const h = 260;
  const blockW = 160;
  const x0 = (w - blockW) / 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Input arrow */}
      <line x1={w / 2} y1={0} x2={w / 2} y2={16} stroke="var(--color-data)" strokeWidth={1.5} />

      {/* Multi-Head Attention */}
      <rect x={x0} y={18} width={blockW} height={44} rx={4} fill="var(--color-attention)" fillOpacity={0.12} stroke="var(--color-attention)" strokeWidth={1} />
      <text x={w / 2} y={38} textAnchor="middle" fill="var(--color-attention)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Multi-Head Attention</text>
      <text x={w / 2} y={52} textAnchor="middle" fill="var(--color-attention)" fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>h={heads}, d={dModel}</text>

      {/* Add & Norm 1 */}
      <line x1={w / 2} y1={62} x2={w / 2} y2={76} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={76} width={blockW} height={22} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={w / 2} y={91} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Add & Norm</text>

      {/* Feed Forward */}
      <line x1={w / 2} y1={98} x2={w / 2} y2={112} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={112} width={blockW} height={44} rx={4} fill="var(--color-inference)" fillOpacity={0.1} stroke="var(--color-inference)" strokeWidth={1} />
      <text x={w / 2} y={132} textAnchor="middle" fill="var(--color-inference)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Feed Forward</text>
      <text x={w / 2} y={146} textAnchor="middle" fill="var(--color-inference)" fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>d_ff={dFF}</text>

      {/* Add & Norm 2 */}
      <line x1={w / 2} y1={156} x2={w / 2} y2={170} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={170} width={blockW} height={22} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={w / 2} y={185} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Add & Norm</text>

      {/* Output arrow */}
      <line x1={w / 2} y1={192} x2={w / 2} y2={h} stroke="var(--color-data)" strokeWidth={1.5} />

      {/* Residual connection arcs */}
      <path d={`M ${x0} 20 Q ${x0 - 20} 108 ${x0} 192`} fill="none" stroke="var(--color-neuron)" strokeWidth={1} strokeDasharray="3 2" opacity={0.5} />

      {label && (
        <text x={w / 2} y={h - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-body)">{label}</text>
      )}
    </svg>
  );
}

// ── 10. TransformerDecoderBlock ───────────────────────────────────────────────

export function TransformerDecoderBlock({
  heads = 8,
  dModel = 512,
  dFF = 2048,
  label,
  className,
  "aria-label": ariaLabel = "TransformerDecoderBlock",
  ...props
}: TransformerBlockProps) {
  const w = 200;
  const h = 330;
  const blockW = 160;
  const x0 = (w - blockW) / 2;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <line x1={w / 2} y1={0} x2={w / 2} y2={16} stroke="var(--color-data)" strokeWidth={1.5} />

      {/* Masked Multi-Head Attention */}
      <rect x={x0} y={18} width={blockW} height={48} rx={4} fill="var(--color-neuron)" fillOpacity={0.1} stroke="var(--color-neuron)" strokeWidth={1} />
      <text x={w / 2} y={38} textAnchor="middle" fill="var(--color-neuron)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Masked</text>
      <text x={w / 2} y={52} textAnchor="middle" fill="var(--color-neuron)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Multi-Head Attention</text>

      <line x1={w / 2} y1={66} x2={w / 2} y2={78} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={78} width={blockW} height={22} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={w / 2} y={93} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Add & Norm</text>

      {/* Cross-Attention */}
      <line x1={w / 2} y1={100} x2={w / 2} y2={112} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={112} width={blockW} height={44} rx={4} fill="var(--color-attention)" fillOpacity={0.12} stroke="var(--color-attention)" strokeWidth={1} />
      <text x={w / 2} y={132} textAnchor="middle" fill="var(--color-attention)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Cross-Attention</text>
      <text x={w / 2} y={146} textAnchor="middle" fill="var(--color-attention)" fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>h={heads}, d={dModel}</text>

      <line x1={w / 2} y1={156} x2={w / 2} y2={168} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={168} width={blockW} height={22} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={w / 2} y={183} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Add & Norm</text>

      {/* Feed Forward */}
      <line x1={w / 2} y1={190} x2={w / 2} y2={202} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={202} width={blockW} height={44} rx={4} fill="var(--color-inference)" fillOpacity={0.1} stroke="var(--color-inference)" strokeWidth={1} />
      <text x={w / 2} y={222} textAnchor="middle" fill="var(--color-inference)" fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Feed Forward</text>
      <text x={w / 2} y={236} textAnchor="middle" fill="var(--color-inference)" fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>d_ff={dFF}</text>

      <line x1={w / 2} y1={246} x2={w / 2} y2={258} stroke="var(--color-text-muted)" strokeWidth={1} />
      <rect x={x0} y={258} width={blockW} height={22} rx={3} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={w / 2} y={273} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">Add & Norm</text>

      <line x1={w / 2} y1={280} x2={w / 2} y2={h} stroke="var(--color-data)" strokeWidth={1.5} />
    </svg>
  );
}

// ── 11. FeedForwardBlock ──────────────────────────────────────────────────────

interface FeedForwardBlockProps extends React.SVGAttributes<SVGSVGElement> {
  dModel?: number;
  dFF?: number;
  activation?: string;
  "aria-label"?: string;
}

export function FeedForwardBlock({
  dModel = 512,
  dFF = 2048,
  activation = "ReLU",
  className,
  "aria-label": ariaLabel = "FeedForwardBlock",
  ...props
}: FeedForwardBlockProps) {
  const c = "var(--color-inference)";
  const w = 180;
  const h = 160;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <line x1={w / 2} y1={0} x2={w / 2} y2={16} stroke={c} strokeWidth={1.5} />

      {/* Linear 1 */}
      <rect x={20} y={18} width={140} height={32} rx={4} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} />
      <text x={w / 2} y={32} textAnchor="middle" fill={c} fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Linear</text>
      <text x={w / 2} y={44} textAnchor="middle" fill={c} fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>{dModel} → {dFF}</text>

      <line x1={w / 2} y1={50} x2={w / 2} y2={64} stroke={c} strokeWidth={1} />

      {/* Activation */}
      <rect x={40} y={64} width={100} height={24} rx={12} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1} />
      <text x={w / 2} y={80} textAnchor="middle" fill={c} fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">{activation}</text>

      <line x1={w / 2} y1={88} x2={w / 2} y2={102} stroke={c} strokeWidth={1} />

      {/* Linear 2 */}
      <rect x={20} y={102} width={140} height={32} rx={4} fill={c} fillOpacity={0.1} stroke={c} strokeWidth={1} />
      <text x={w / 2} y={116} textAnchor="middle" fill={c} fontSize="10" fontWeight="600" fontFamily="var(--font-body)">Linear</text>
      <text x={w / 2} y={128} textAnchor="middle" fill={c} fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>{dFF} → {dModel}</text>

      <line x1={w / 2} y1={134} x2={w / 2} y2={h} stroke={c} strokeWidth={1.5} />

      {/* dimension labels */}
      <text x={8} y={36} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{dModel}</text>
      <text x={8} y={80} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{dFF}</text>
    </svg>
  );
}

// ── 12. ResidualConnectionViz ─────────────────────────────────────────────────

interface ResidualConnectionVizProps extends React.SVGAttributes<SVGSVGElement> {
  label?: string;
  "aria-label"?: string;
}

export function ResidualConnectionViz({
  label,
  className,
  "aria-label": ariaLabel = "ResidualConnectionViz",
  ...props
}: ResidualConnectionVizProps) {
  const c = "var(--color-neuron)";
  const w = 160;
  const h = 160;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* main path */}
      <line x1={80} y1={0} x2={80} y2={60} stroke={c} strokeWidth={1.5} />

      {/* sublayer box */}
      <rect x={20} y={30} width={120} height={36} rx={4} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1} />
      <text x={80} y={52} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-body)">{label ?? "Sublayer"}</text>

      {/* bypass arc */}
      <path
        data-bypass
        d="M 80 8 Q 148 8 148 80 Q 148 150 80 150"
        fill="none"
        stroke={c}
        strokeWidth={1}
        strokeDasharray="4 3"
        opacity={0.6}
      />

      {/* add node */}
      <line x1={80} y1={66} x2={80} y2={96} stroke={c} strokeWidth={1.5} />
      <circle cx={80} cy={108} r={12} fill="var(--color-surface-2)" stroke={c} strokeWidth={1.5} />
      <text x={80} y={112} textAnchor="middle" fill={c} fontSize="14" fontWeight="600">+</text>
      <line x1={80} y1={120} x2={80} y2={h} stroke={c} strokeWidth={1.5} />

      {/* bypass input line into add node */}
      <line x1={136} y1={108} x2={92} y2={108} stroke={c} strokeWidth={1} opacity={0.6} />
    </svg>
  );
}

// ── 13. ActivationFunction ────────────────────────────────────────────────────

type ActivationFn = "relu" | "gelu" | "sigmoid" | "tanh";

const activationFns: Record<ActivationFn, (x: number) => number> = {
  relu: (x) => Math.max(0, x),
  gelu: (x) => 0.5 * x * (1 + Math.tanh(Math.sqrt(2 / Math.PI) * (x + 0.044715 * x ** 3))),
  sigmoid: (x) => 1 / (1 + Math.exp(-x)),
  tanh: (x) => Math.tanh(x),
};

const FN_COLORS: Record<ActivationFn, string> = {
  relu:    "var(--color-neuron)",
  gelu:    "var(--color-attention)",
  sigmoid: "var(--color-data)",
  tanh:    "var(--color-accuracy)",
};

function buildCurvePath(fn: ActivationFn, w: number, h: number, domain: [number, number]): string {
  const [xMin, xMax] = domain;
  const steps = 80;
  const pad = 24;
  const plotW = w - pad * 2;
  const plotH = h - pad * 2;
  const midY = pad + plotH / 2;

  const pts: string[] = [];
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = xMin + t * (xMax - xMin);
    const y = activationFns[fn](x);
    const svgX = pad + t * plotW;
    const svgY = midY - y * (plotH / 2.4);
    pts.push(`${i === 0 ? "M" : "L"} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
  }
  return pts.join(" ");
}

interface ActivationFunctionProps extends React.SVGAttributes<SVGSVGElement> {
  fn?: ActivationFn;
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function ActivationFunction({
  fn = "relu",
  width: w = 200,
  height: h = 120,
  className,
  "aria-label": ariaLabel,
  ...props
}: ActivationFunctionProps) {
  const c = FN_COLORS[fn];
  const pad = 24;
  const midX = w / 2;
  const midY = h / 2;
  const d = buildCurvePath(fn, w, h, [-3.5, 3.5]);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel ?? fn}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* axes */}
      <line data-axis x1={pad} y1={midY} x2={w - pad} y2={midY} stroke="var(--color-border)" strokeWidth={1} />
      <line data-axis x1={midX} y1={pad - 4} x2={midX} y2={h - pad + 4} stroke="var(--color-border)" strokeWidth={1} />

      {/* curve */}
      <path data-curve d={d} fill="none" stroke={c} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

      {/* label */}
      <text x={w - pad + 2} y={pad} textAnchor="end" fill={c} fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">
        {fn === "relu" ? "ReLU" : fn === "gelu" ? "GELU" : fn === "sigmoid" ? "Sigmoid" : "Tanh"}
      </text>
    </svg>
  );
}

// ── 14. SoftmaxViz ────────────────────────────────────────────────────────────

interface SoftmaxVizProps extends React.SVGAttributes<SVGSVGElement> {
  logits?: number[];
  labels?: string[];
  animated?: boolean;
  "aria-label"?: string;
}

function softmax(logits: number[]): number[] {
  const max = Math.max(...logits);
  const exps = logits.map((l) => Math.exp(l - max));
  const sum = exps.reduce((a, b) => a + b, 0);
  return exps.map((e) => e / sum);
}

export function SoftmaxViz({
  logits = [2.0, 1.0, 0.1],
  labels,
  className,
  "aria-label": ariaLabel = "SoftmaxViz",
  ...props
}: SoftmaxVizProps) {
  const probs = softmax(logits);
  const n = logits.length;
  const barH = 22;
  const spacing = barH + 8;
  const maxLogit = Math.max(...logits);
  const labelW = 40;
  const barMaxW = 100;
  const probBarMaxW = 100;
  const w = labelW + barMaxW + 60 + probBarMaxW + 44;
  const h = n * spacing + 40;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Softmax label */}
      <text x={w / 2} y={14} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-mono)">Softmax</text>

      {logits.map((logit, i) => {
        const logitW = (logit / maxLogit) * barMaxW;
        const probW = probs[i] * probBarMaxW;
        const y = 24 + i * spacing;
        const lbl = labels?.[i] ?? `z${i}`;

        return (
          <g key={i}>
            {/* label */}
            <text x={labelW - 4} y={y + barH / 2 + 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{lbl}</text>

            {/* logit bar */}
            <rect
              data-bar="logit"
              x={labelW}
              y={y}
              width={Math.max(2, logitW)}
              height={barH}
              rx={3}
              fill="var(--color-weight)"
              fillOpacity={0.5}
            />
            <text x={labelW + logitW + 4} y={y + barH / 2 + 4} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{logit.toFixed(1)}</text>

            {/* arrow */}
            <text x={labelW + barMaxW + 28} y={y + barH / 2 + 4} textAnchor="middle" fill="var(--color-attention)" fontSize="10">→</text>

            {/* prob bar */}
            <rect
              data-bar="prob"
              x={labelW + barMaxW + 56}
              y={y}
              width={Math.max(2, probW)}
              height={barH}
              rx={3}
              fill="var(--color-attention)"
              fillOpacity={0.6}
            />
            <text x={labelW + barMaxW + 56 + probW + 4} y={y + barH / 2 + 4} fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{(probs[i] * 100).toFixed(0)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 15. DropoutViz ────────────────────────────────────────────────────────────

interface DropoutVizProps extends React.SVGAttributes<SVGSVGElement> {
  neurons?: number;
  rate?: number;
  seed?: number;
  "aria-label"?: string;
}

function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function DropoutViz({
  neurons = 8,
  rate = 0.5,
  seed = 1234,
  className,
  "aria-label": ariaLabel = "DropoutViz",
  ...props
}: DropoutVizProps) {
  const rng = seededRandom(seed);
  const masked = Array.from({ length: neurons }, () => rng() < rate);
  const cols = Math.ceil(Math.sqrt(neurons));
  const rows = Math.ceil(neurons / cols);
  const cellSize = 36;
  const w = cols * cellSize + 20;
  const h = rows * cellSize + 40;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <text x={w / 2} y={14} textAnchor="middle" fill="var(--color-text-muted)" fontSize="10" fontFamily="var(--font-mono)">Dropout ({(rate * 100).toFixed(0)}%)</text>
      {Array.from({ length: neurons }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const cx = 10 + col * cellSize + cellSize / 2;
        const cy = 22 + row * cellSize + cellSize / 2;
        const isMasked = masked[i];
        return (
          <circle
            key={i}
            data-neuron
            data-masked={isMasked ? "true" : "false"}
            cx={cx}
            cy={cy}
            r={cellSize / 2 - 6}
            fill={isMasked ? "var(--color-surface-3)" : "var(--color-neuron)"}
            fillOpacity={isMasked ? 0.2 : 0.6}
            stroke={isMasked ? "var(--color-border)" : "var(--color-neuron)"}
            strokeWidth={1}
            strokeDasharray={isMasked ? "3 2" : undefined}
          />
        );
      })}
    </svg>
  );
}

// ── 16. EmbeddingLookup ───────────────────────────────────────────────────────

interface EmbeddingLookupProps extends React.SVGAttributes<SVGSVGElement> {
  token?: string;
  dimensions?: number;
  "aria-label"?: string;
}

export function EmbeddingLookup({
  token = "cat",
  dimensions = 8,
  className,
  "aria-label": ariaLabel = "EmbeddingLookup",
  ...props
}: EmbeddingLookupProps) {
  const c = "var(--color-embedding)";
  const dimH = 12;
  const h = Math.max(80, dimensions * (dimH + 2) + 24);
  const w = 220;

  // deterministic fake embedding values
  const rng = seededRandom(token.charCodeAt(0) ?? 99);
  const values = Array.from({ length: dimensions }, () => rng() * 2 - 1);

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* token chip */}
      <rect x={4} y={h / 2 - 14} width={56} height={28} rx={6} fill={c} fillOpacity={0.2} stroke={c} strokeWidth={1.5} />
      <text x={32} y={h / 2 + 4} textAnchor="middle" fill={c} fontSize="12" fontFamily="var(--font-mono)" fontWeight="600">{token}</text>

      {/* lookup arrow */}
      <line data-arrow x1={62} y1={h / 2} x2={88} y2={h / 2} stroke={c} strokeWidth={1.5} />
      <path d={`M 86 ${h / 2 - 4} L 92 ${h / 2} L 86 ${h / 2 + 4}`} fill="none" stroke={c} strokeWidth={1.5} />

      {/* dimension bars */}
      {values.map((val, i) => {
        const y = 10 + i * (dimH + 2);
        const barW = Math.abs(val) * 50;
        const x = val >= 0 ? 112 : 112 - barW;
        return (
          <g key={i}>
            <rect data-dim x={x} y={y} width={barW} height={dimH} rx={2} fill={c} fillOpacity={0.5 + Math.abs(val) * 0.4} />
            <text x={168} y={y + dimH - 2} fill="var(--color-text-muted)" fontSize="7" fontFamily="var(--font-mono)">{val.toFixed(2)}</text>
          </g>
        );
      })}

      {/* center line */}
      <line x1={112} y1={8} x2={112} y2={h - 8} stroke="var(--color-border)" strokeWidth={0.5} />
    </svg>
  );
}

// ── 17. LayerNormViz ──────────────────────────────────────────────────────────

interface LayerNormVizProps extends React.SVGAttributes<SVGSVGElement> {
  showStats?: boolean;
  "aria-label"?: string;
}

export function LayerNormViz({
  showStats = false,
  className,
  "aria-label": ariaLabel = "LayerNormViz",
  ...props
}: LayerNormVizProps) {
  const w = 280;
  const h = 100;

  // before: skewed distribution bars
  const beforeVals = [0.1, 0.3, 0.7, 1.0, 0.8, 0.4, 0.2, 0.1];
  // after: roughly normal
  const afterVals  = [0.1, 0.4, 0.8, 1.0, 1.0, 0.8, 0.4, 0.1];

  const barW = 10;
  const barSpacing = 13;
  const maxH = 40;

  return (
    <svg
      width={w}
      height={h}
      viewBox={`0 0 ${w} ${h}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* Before label */}
      <text x={50} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">Before</text>

      {/* Before bars */}
      {beforeVals.map((v, i) => (
        <rect
          key={`b${i}`}
          x={10 + i * barSpacing}
          y={18 + maxH - v * maxH}
          width={barW}
          height={v * maxH}
          rx={1}
          fill="var(--color-weight)"
          fillOpacity={0.5}
        />
      ))}

      {/* arrow */}
      <text x={140} y={46} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="16">→</text>
      <text x={140} y={60} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">LayerNorm</text>

      {/* After label */}
      <text x={220} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">After</text>

      {/* After bars */}
      {afterVals.map((v, i) => (
        <rect
          key={`a${i}`}
          x={172 + i * barSpacing}
          y={18 + maxH - v * maxH}
          width={barW}
          height={v * maxH}
          rx={1}
          fill="var(--color-accuracy)"
          fillOpacity={0.5}
        />
      ))}

      {/* base lines */}
      <line x1={8} y1={58} x2={115} y2={58} stroke="var(--color-border)" strokeWidth={0.5} />
      <line x1={168} y1={58} x2={276} y2={58} stroke="var(--color-border)" strokeWidth={0.5} />

      {/* stats */}
      {showStats && (
        <>
          <text x={50} y={74} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">μ ≠ 0</text>
          <text x={50} y={86} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">σ ≠ 1</text>
          <text x={220} y={74} textAnchor="middle" fill="var(--color-accuracy)" fontSize="8" fontFamily="var(--font-mono)">μ = 0</text>
          <text x={220} y={86} textAnchor="middle" fill="var(--color-accuracy)" fontSize="8" fontFamily="var(--font-mono)">σ = 1</text>
        </>
      )}
    </svg>
  );
}
