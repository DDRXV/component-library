import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { GSAP_DURATIONS, GSAP_EASINGS } from "@/tokens/tokens";
import { useReducedMotion } from "@/arrows/arrow-utils";

function mkId(b: string) {
  return `${b}-${Math.random().toString(36).slice(2, 6)}`;
}

// ── Token type palette ────────────────────────────────────────────────────────

type TokenType = "word" | "subword" | "special" | "number" | "punctuation";

const TOKEN_STYLES: Record<TokenType, string> = {
  word:        "bg-[var(--color-data)]/20 border-[var(--color-data)]/40 text-[var(--color-data)]",
  subword:     "bg-[var(--color-embedding)]/20 border-[var(--color-embedding)]/40 text-[var(--color-embedding)]",
  special:     "bg-[var(--color-attention)]/20 border-[var(--color-attention)]/40 text-[var(--color-attention)]",
  number:      "bg-[var(--color-token)]/20 border-[var(--color-token)]/40 text-[var(--color-token)]",
  punctuation: "bg-[var(--color-surface-3)] border-[var(--color-border)] text-[var(--color-text-muted)]",
};

// ── 1. TokenChip ──────────────────────────────────────────────────────────────

interface TokenChipProps {
  text: string;
  type?: TokenType;
  id?: number;
  selected?: boolean;
  className?: string;
}

export function TokenChip({ text, type = "word", id, selected, className }: TokenChipProps) {
  return (
    <span
      data-type={type}
      className={cn(
        "inline-flex flex-col items-center gap-0.5 px-2 py-1 rounded border font-mono text-xs select-none",
        TOKEN_STYLES[type],
        selected && "ring-2 ring-offset-1 ring-[var(--color-attention)]",
        className
      )}
    >
      <span>{text}</span>
      {id !== undefined && <span className="text-[9px] opacity-60">{id}</span>}
    </span>
  );
}

// ── 2. TokenSequence ──────────────────────────────────────────────────────────

interface TokenSequenceProps {
  tokens: string[];
  types?: TokenType[];
  ids?: number[];
  showIds?: boolean;
  showCount?: boolean;
  className?: string;
}

export function TokenSequence({ tokens, types, ids, showIds, showCount, className }: TokenSequenceProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex flex-wrap gap-1.5 items-end">
        {tokens.map((t, i) => (
          <TokenChip
            key={i}
            text={t}
            type={types?.[i] ?? "word"}
            id={showIds ? ids?.[i] : undefined}
          />
        ))}
      </div>
      {showCount && (
        <span className="text-xs text-[var(--color-text-muted)] font-mono">{tokens.length} tokens</span>
      )}
    </div>
  );
}

// ── 3. TokenizationAnimation ──────────────────────────────────────────────────

interface TokenizationAnimationProps {
  text: string;
  tokens: string[];
  types?: TokenType[];
  className?: string;
}

export function TokenizationAnimation({ text, tokens, types, className }: TokenizationAnimationProps) {
  return (
    <div className={cn("flex flex-col gap-3 font-mono", className)}>
      <div className="text-sm text-[var(--color-text-secondary)] px-3 py-2 rounded border border-[var(--color-border)] bg-[var(--color-surface-1)]">
        {text}
      </div>
      <div className="text-[var(--color-text-muted)] text-xs text-center">↓ tokenize</div>
      <div className="flex flex-col gap-2">
        <div className="flex flex-wrap gap-1.5">
          {tokens.map((t, i) => (
            <TokenChip key={i} text={t} type={types?.[i] ?? "word"} />
          ))}
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">{tokens.length} tokens</span>
      </div>
    </div>
  );
}

// ── 4. ContextWindow ──────────────────────────────────────────────────────────

interface ContextWindowProps extends React.SVGAttributes<SVGSVGElement> {
  totalTokens?: number;
  windowSize?: number;
  position?: number;
  label?: string;
  "aria-label"?: string;
}

export function ContextWindow({
  totalTokens = 16,
  windowSize = 4,
  position = 0,
  label,
  className,
  "aria-label": ariaLabel = "ContextWindow",
  ...props
}: ContextWindowProps) {
  const blockW = 20;
  const blockH = 28;
  const gap = 3;
  const w = totalTokens * (blockW + gap) + 20;
  const h = blockH + 40;

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
      {label && (
        <text x={w / 2} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{label}</text>
      )}
      {Array.from({ length: totalTokens }, (_, i) => {
        const inWindow = i >= position && i < position + windowSize;
        const x = 10 + i * (blockW + gap);
        return (
          <rect
            key={i}
            data-pos={i}
            data-active={inWindow ? "true" : "false"}
            x={x}
            y={label ? 18 : 8}
            width={blockW}
            height={blockH}
            rx={2}
            fill={inWindow ? "var(--color-data)" : "var(--color-surface-3)"}
            fillOpacity={inWindow ? 0.5 : 0.3}
            stroke={inWindow ? "var(--color-data)" : "var(--color-border)"}
            strokeWidth={inWindow ? 1.5 : 0.5}
          />
        );
      })}
      {/* window bracket */}
      <rect
        x={10 + position * (blockW + gap) - 2}
        y={label ? 16 : 6}
        width={windowSize * (blockW + gap) - gap + 4}
        height={blockH + 4}
        rx={3}
        fill="none"
        stroke="var(--color-data)"
        strokeWidth={1.5}
        strokeDasharray="4 2"
      />
      <text
        x={10 + position * (blockW + gap) + (windowSize * (blockW + gap)) / 2}
        y={h - 4}
        textAnchor="middle"
        fill="var(--color-data)"
        fontSize="8"
        fontFamily="var(--font-mono)"
      >
        window
      </text>
    </svg>
  );
}

// ── 5. KVCache ────────────────────────────────────────────────────────────────

interface KVCacheProps extends React.SVGAttributes<SVGSVGElement> {
  layers?: number;
  seqLen?: number;
  filledLen?: number;
  "aria-label"?: string;
}

export function KVCache({
  layers = 4,
  seqLen = 8,
  filledLen = 5,
  className,
  "aria-label": ariaLabel = "KVCache",
  ...props
}: KVCacheProps) {
  const cellW = 14;
  const cellH = 12;
  const rowH = cellH + 4;
  const colW = cellW + 2;
  const padL = 28;
  const padT = 24;
  const sectionGap = 10;
  const w = padL + seqLen * colW * 2 + sectionGap + 20;
  const h = padT + layers * rowH + 20;

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
      {/* Section headers */}
      <text x={padL + seqLen * colW / 2} y={14} textAnchor="middle" fill="var(--color-attention)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">K</text>
      <text x={padL + seqLen * colW + sectionGap + seqLen * colW / 2} y={14} textAnchor="middle" fill="var(--color-data)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">V</text>

      {Array.from({ length: layers }, (_, li) => (
        <g key={li} data-layer={li}>
          <text x={padL - 4} y={padT + li * rowH + cellH / 2 + 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">L{li + 1}</text>
          {Array.from({ length: seqLen }, (_, si) => {
            const filled = si < filledLen;
            return (
              <React.Fragment key={si}>
                {/* K cell */}
                <rect
                  data-filled={filled ? "true" : "false"}
                  x={padL + si * colW}
                  y={padT + li * rowH}
                  width={cellW}
                  height={cellH}
                  rx={1}
                  fill={filled ? "var(--color-attention)" : "var(--color-surface-3)"}
                  fillOpacity={filled ? 0.5 : 0.2}
                  stroke="var(--color-border)"
                  strokeWidth={0.5}
                />
                {/* V cell */}
                <rect
                  data-filled={filled ? "true" : "false"}
                  x={padL + seqLen * colW + sectionGap + si * colW}
                  y={padT + li * rowH}
                  width={cellW}
                  height={cellH}
                  rx={1}
                  fill={filled ? "var(--color-data)" : "var(--color-surface-3)"}
                  fillOpacity={filled ? 0.5 : 0.2}
                  stroke="var(--color-border)"
                  strokeWidth={0.5}
                />
              </React.Fragment>
            );
          })}
        </g>
      ))}
    </svg>
  );
}

// ── 6. NextTokenPrediction ────────────────────────────────────────────────────

interface TokenCandidate { token: string; prob: number; }

interface NextTokenPredictionProps extends React.SVGAttributes<SVGSVGElement> {
  topTokens?: TokenCandidate[];
  temperature?: number;
  "aria-label"?: string;
}

export function NextTokenPrediction({
  topTokens = [{ token: "the", prob: 0.45 }, { token: "a", prob: 0.25 }, { token: "this", prob: 0.15 }],
  temperature,
  className,
  "aria-label": ariaLabel = "NextTokenPrediction",
  ...props
}: NextTokenPredictionProps) {
  const barMaxW = 120;
  const rowH = 28;
  const labelW = 52;
  const h = topTokens.length * rowH + 36;
  const w = labelW + barMaxW + 60;

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
      <text x={w / 2} y={13} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">
        Next token{temperature !== undefined ? ` (T=${temperature})` : ""}
      </text>
      {topTokens.map(({ token, prob }, i) => {
        const isTop = i === 0;
        const barW = prob * barMaxW;
        const y = 18 + i * rowH;
        const c = isTop ? "var(--color-attention)" : "var(--color-weight)";
        return (
          <g key={i} data-selected={isTop ? "true" : "false"}>
            <text x={labelW - 4} y={y + 16} textAnchor="end" fill={c} fontSize="11" fontFamily="var(--font-mono)" fontWeight={isTop ? "700" : "400"}>{token}</text>
            <rect x={labelW} y={y + 4} width={Math.max(2, barW)} height={16} rx={3} fill={c} fillOpacity={isTop ? 0.7 : 0.3} />
            <text x={labelW + barW + 5} y={y + 16} fill={c} fontSize="10" fontFamily="var(--font-mono)">{Math.round(prob * 100)}%</text>
            {isTop && <text x={w - 4} y={y + 16} textAnchor="end" fill={c} fontSize="11">▲</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── 7. AutoregressiveLoop ─────────────────────────────────────────────────────

interface AutoregressiveLoopProps extends React.SVGAttributes<SVGSVGElement> {
  generatedTokens?: string[];
  "aria-label"?: string;
}

export function AutoregressiveLoop({
  generatedTokens = [],
  className,
  "aria-label": ariaLabel = "AutoregressiveLoop",
  ...props
}: AutoregressiveLoopProps) {
  const w = 280;
  const h = 140;
  const c = "var(--color-inference)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* Input tokens */}
      <rect x={10} y={50} width={60} height={32} rx={4} fill="var(--color-data)" fillOpacity={0.15} stroke="var(--color-data)" strokeWidth={1} />
      <text x={40} y={70} textAnchor="middle" fill="var(--color-data)" fontSize="10" fontFamily="var(--font-mono)">Input</text>

      {/* Model box */}
      <rect x={100} y={44} width={80} height={44} rx={6} fill={c} fillOpacity={0.15} stroke={c} strokeWidth={1.5} />
      <text x={140} y={65} textAnchor="middle" fill={c} fontSize="11" fontFamily="var(--font-body)" fontWeight="600">Model</text>
      <text x={140} y={79} textAnchor="middle" fill={c} fontSize="9" fontFamily="var(--font-mono)" opacity={0.7}>LLM</text>

      {/* Output */}
      <rect x={210} y={50} width={60} height={32} rx={4} fill="var(--color-accuracy)" fillOpacity={0.15} stroke="var(--color-accuracy)" strokeWidth={1} />
      <text x={240} y={70} textAnchor="middle" fill="var(--color-accuracy)" fontSize="10" fontFamily="var(--font-mono)">Output</text>

      {/* arrows */}
      <line x1={70} y1={66} x2={98} y2={66} stroke={c} strokeWidth={1.5} />
      <line x1={180} y1={66} x2={208} y2={66} stroke={c} strokeWidth={1.5} />
      <path d="M 84 66 L 92 62 L 92 70 Z" fill={c} />
      <path d="M 194 66 L 202 62 L 202 70 Z" fill={c} />

      {/* loop-back arrow */}
      <path data-loop d="M 240 82 Q 240 115 140 115 Q 40 115 40 82" fill="none" stroke={c} strokeWidth={1} strokeDasharray="5 3" />
      <path d="M 36 78 L 40 86 L 44 78" fill="none" stroke={c} strokeWidth={1.5} />

      {/* generated tokens */}
      {generatedTokens.slice(0, 4).map((t, i) => (
        <text key={i} x={10 + i * 34} y={130} fill="var(--color-accuracy)" fontSize="10" fontFamily="var(--font-mono)">{t}</text>
      ))}
    </svg>
  );
}

// ── 8. SystemPrompt ───────────────────────────────────────────────────────────

interface MessageProps { children: React.ReactNode; className?: string; }

export function SystemPrompt({ children, className }: MessageProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-warning)]/30 bg-[var(--color-warning)]/5 p-3", className)}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--color-warning)] px-1.5 py-0.5 rounded bg-[var(--color-warning)]/15">System</span>
      </div>
      <p className="text-sm font-mono text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 9. UserMessage ────────────────────────────────────────────────────────────

export function UserMessage({ children, className }: MessageProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-data)]/30 bg-[var(--color-data)]/5 p-3 ml-8", className)}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--color-data)]">User</span>
      </div>
      <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 10. AssistantMessage ──────────────────────────────────────────────────────

interface AssistantMessageProps extends MessageProps { thinking?: string; }

export function AssistantMessage({ children, thinking, className }: AssistantMessageProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-neuron)]/30 bg-[var(--color-neuron)]/5 p-3 mr-8", className)}>
      <div className="flex items-center gap-2 mb-1.5">
        <span className="text-[9px] font-mono font-semibold uppercase tracking-widest text-[var(--color-neuron)]">Assistant</span>
      </div>
      {thinking && (
        <div className="mb-2 px-2 py-1.5 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)] text-xs font-mono text-[var(--color-text-muted)] italic">
          {thinking}
        </div>
      )}
      <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 11. PromptTemplate ────────────────────────────────────────────────────────

interface PromptTemplateProps {
  template: string;
  slots: string[];
  values?: Record<string, string>;
  className?: string;
}

export function PromptTemplate({ template, slots, values, className }: PromptTemplateProps) {
  // split template into parts, highlighting slot placeholders
  const parts: { text: string; isSlot: boolean }[] = [];
  let remaining = template;

  slots.forEach((slot) => {
    const placeholder = `{${slot}}`;
    const idx = remaining.indexOf(placeholder);
    if (idx === -1) return;
    if (idx > 0) parts.push({ text: remaining.slice(0, idx), isSlot: false });
    parts.push({ text: placeholder, isSlot: true });
    remaining = remaining.slice(idx + placeholder.length);
  });
  if (remaining) parts.push({ text: remaining, isSlot: false });

  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-3 font-mono text-sm", className)}>
      <div className="text-[9px] uppercase tracking-widest text-[var(--color-text-muted)] mb-2">Prompt Template</div>
      <p className="leading-relaxed text-[var(--color-text-secondary)]">
        {parts.map((part, i) =>
          part.isSlot ? (
            <span key={i} className="px-1 py-0.5 rounded bg-[var(--color-attention)]/20 text-[var(--color-attention)] border border-[var(--color-attention)]/30">
              {values?.[part.text.slice(1, -1)] ?? part.text}
            </span>
          ) : (
            <span key={i}>{part.text}</span>
          )
        )}
      </p>
    </div>
  );
}

// ── 12. ChainOfThought ────────────────────────────────────────────────────────

interface ChainOfThoughtProps {
  steps: string[];
  className?: string;
}

export function ChainOfThought({ steps, className }: ChainOfThoughtProps) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div
            key={i}
            data-conclusion={isLast ? "" : undefined}
            className={cn(
              "flex gap-3 p-2.5 rounded-lg border text-sm",
              isLast
                ? "bg-[var(--color-accuracy)]/10 border-[var(--color-accuracy)]/30 text-[var(--color-text-primary)]"
                : "bg-[var(--color-surface-2)] border-[var(--color-border)] text-[var(--color-text-secondary)]"
            )}
          >
            <span className={cn("w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 mt-0.5",
              isLast ? "bg-[var(--color-accuracy)] text-black" : "bg-[var(--color-surface-3)] text-[var(--color-text-muted)]"
            )}>
              {i + 1}
            </span>
            <p className="leading-relaxed">{step}</p>
          </div>
        );
      })}
    </div>
  );
}

// ── 13. BeamSearchTree ────────────────────────────────────────────────────────

interface BeamSearchTreeProps extends React.SVGAttributes<SVGSVGElement> {
  beams?: number;
  depth?: number;
  "aria-label"?: string;
}

export function BeamSearchTree({
  beams = 3,
  depth = 4,
  className,
  "aria-label": ariaLabel = "BeamSearchTree",
  ...props
}: BeamSearchTreeProps) {
  const nodeR = 10;
  const colSpacing = 60;
  const rowSpacing = 32;
  const w = depth * colSpacing + 40;
  const h = beams * rowSpacing + 40;
  const c = "var(--color-inference)";

  // nodes: depth columns, beams rows at each level
  const nodes = Array.from({ length: depth }, (_, d) =>
    Array.from({ length: beams }, (_, b) => ({
      x: 20 + d * colSpacing,
      y: 20 + b * rowSpacing + (beams * rowSpacing * (depth - 1 - d)) / (depth * 4),
    }))
  );

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* edges */}
      {nodes.slice(0, -1).map((col, d) =>
        col.map((src, b) =>
          nodes[d + 1].map((dst, b2) => (
            <line key={`${d}-${b}-${b2}`} x1={src.x + nodeR} y1={src.y} x2={dst.x - nodeR} y2={dst.y} stroke={c} strokeWidth={0.7} opacity={0.3} />
          ))
        )
      )}
      {/* nodes */}
      {nodes.map((col, d) =>
        col.map((node, b) => (
          <g key={`${d}-${b}`} data-beam-node>
            <circle cx={node.x} cy={node.y} r={nodeR} fill={c} fillOpacity={d === depth - 1 ? 0.7 : 0.2} stroke={c} strokeWidth={1} />
            <text x={node.x} y={node.y + 4} textAnchor="middle" fill="var(--color-text-primary)" fontSize="8" fontFamily="var(--font-mono)">
              {d === 0 ? "▶" : String.fromCharCode(65 + b)}
            </text>
          </g>
        ))
      )}
    </svg>
  );
}

// ── 14. RAGPipeline ───────────────────────────────────────────────────────────

interface RAGPipelineProps extends React.SVGAttributes<SVGSVGElement> {
  "aria-label"?: string;
}

export function RAGPipeline({ className, "aria-label": ariaLabel = "RAGPipeline", ...props }: RAGPipelineProps) {
  const w = 480;
  const h = 120;

  type Node = { x: number; y: number; w: number; h: number; label: string; color: string };
  const nodes: Node[] = [
    { x: 10,  y: 44, w: 56, h: 32, label: "Query",     color: "var(--color-data)" },
    { x: 90,  y: 44, w: 72, h: 32, label: "Retriever", color: "var(--color-embedding)" },
    { x: 186, y: 44, w: 72, h: 32, label: "Vector DB", color: "var(--color-attention)" },
    { x: 282, y: 44, w: 40, h: 32, label: "LLM",       color: "var(--color-neuron)" },
    { x: 346, y: 44, w: 56, h: 32, label: "Answer",    color: "var(--color-accuracy)" },
  ];

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* Retrieved docs arc */}
      <path d="M 222 44 Q 262 10 282 44" fill="none" stroke="var(--color-embedding)" strokeWidth={1} strokeDasharray="4 2" />
      <text x={252} y={20} textAnchor="middle" fill="var(--color-embedding)" fontSize="8" fontFamily="var(--font-mono)">docs</text>

      {nodes.map(({ x, y, w: nw, h: nh, label, color }, i) => (
        <g key={i}>
          <rect x={x} y={y} width={nw} height={nh} rx={5} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={1.5} />
          <text x={x + nw / 2} y={y + nh / 2 + 4} textAnchor="middle" fill={color} fontSize="10" fontFamily="var(--font-body)" fontWeight="600">{label}</text>
        </g>
      ))}

      {/* arrows between nodes */}
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        return (
          <line key={`arr-${i}`} x1={n.x + n.w} y1={n.y + n.h / 2} x2={next.x - 1} y2={next.y + next.h / 2}
            stroke="var(--color-text-muted)" strokeWidth={1.5} markerEnd="none" />
        );
      })}
      {nodes.slice(0, -1).map((n, i) => {
        const next = nodes[i + 1];
        const mx = next.x - 6;
        const my = next.y + next.h / 2;
        return <path key={`head-${i}`} d={`M ${mx - 5} ${my - 4} L ${mx} ${my} L ${mx - 5} ${my + 4}`} fill="none" stroke="var(--color-text-muted)" strokeWidth={1.5} />;
      })}
    </svg>
  );
}

// ── 15. AgentLoop ─────────────────────────────────────────────────────────────

interface AgentLoopProps extends React.SVGAttributes<SVGSVGElement> {
  animated?: boolean;
  "aria-label"?: string;
}

export function AgentLoop({ animated = false, className, "aria-label": ariaLabel = "AgentLoop", ...props }: AgentLoopProps) {
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const reducedMotion = useReducedMotion();
  const w = 300;
  const h = 200;

  type LoopNode = { cx: number; cy: number; label: string; color: string };
  const loopNodes: LoopNode[] = [
    { cx: 150, cy: 40,  label: "Think",   color: "var(--color-neuron)" },
    { cx: 260, cy: 120, label: "Act",     color: "var(--color-agent)" },
    { cx: 150, cy: 175, label: "Observe", color: "var(--color-data)" },
    { cx: 40,  cy: 120, label: "Tool",    color: "var(--color-token)" },
  ];

  useEffect(() => {
    if (!animated || reducedMotion) return;
    const tl = gsap.timeline({ repeat: -1 });
    nodeRefs.current.forEach((n) => {
      if (n) tl.to(n, { opacity: 1, scale: 1.08, duration: GSAP_DURATIONS.normal, ease: GSAP_EASINGS.spring, transformOrigin: "center center" }, ">")
                .to(n, { opacity: 0.6, scale: 1, duration: GSAP_DURATIONS.fast }, ">");
    });
    return () => { tl.kill(); };
  }, [animated, reducedMotion]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* loop path */}
      <path d="M 150 58 Q 230 60 242 120 Q 250 175 150 165 Q 50 175 58 120 Q 70 60 150 58" fill="none" stroke="var(--color-surface-3)" strokeWidth={1.5} />
      {/* arcs between nodes */}
      {loopNodes.map((n, i) => {
        const next = loopNodes[(i + 1) % loopNodes.length];
        return <line key={i} x1={n.cx} y1={n.cy + 18} x2={next.cx} y2={next.cy + 18} stroke={n.color} strokeWidth={1} opacity={0.3} strokeDasharray="4 3" />;
      })}
      {/* nodes */}
      {loopNodes.map((n, i) => (
        <g key={i} ref={(el) => { nodeRefs.current[i] = el; }} opacity={0.6}>
          <circle cx={n.cx} cy={n.cy + 14} r={22} fill={n.color} fillOpacity={0.15} stroke={n.color} strokeWidth={1.5} />
          <text x={n.cx} y={n.cy + 18} textAnchor="middle" fill={n.color} fontSize="11" fontFamily="var(--font-body)" fontWeight="600">{n.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── 16. ToolCallBlock ─────────────────────────────────────────────────────────

interface ToolCallBlockProps {
  name: string;
  args: Record<string, unknown>;
  result?: string;
  status?: "pending" | "success" | "error";
  className?: string;
}

export function ToolCallBlock({ name, args, result, status = "success", className }: ToolCallBlockProps) {
  const statusColor = status === "success" ? "var(--color-accuracy)" : status === "error" ? "var(--color-loss)" : "var(--color-warning)";

  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden font-mono text-xs", className)}>
      <div className="flex items-center gap-2 px-3 py-2 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <span style={{ color: "var(--color-agent)" }} className="text-[10px] uppercase tracking-wider font-semibold">Tool Call</span>
        <span className="flex-1" />
        <span className="w-2 h-2 rounded-full" style={{ background: statusColor }} />
      </div>
      <div className="p-3 space-y-1">
        <div className="text-[var(--color-agent)] font-semibold"><span>{name}</span><span>(</span></div>
        {Object.entries(args).map(([k, v]) => (
          <div key={k} className="pl-4 text-[var(--color-text-secondary)]">
            <span className="text-[var(--color-attention)]">{k}</span>
            <span className="text-[var(--color-text-muted)]">: </span>
            <span className="text-[var(--color-token)]">{JSON.stringify(v)}</span>
          </div>
        ))}
        <div className="text-[var(--color-agent)]">)</div>
      </div>
      {result && (
        <div className="px-3 pb-3 pt-1 border-t border-[var(--color-border)] text-[var(--color-text-secondary)]">
          <span className="text-[var(--color-text-muted)] text-[10px]">→ </span>{result}
        </div>
      )}
    </div>
  );
}
