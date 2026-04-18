import React, { useEffect, useRef, useMemo } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { GSAP_DURATIONS, GSAP_EASINGS } from "@/tokens/tokens";
import { useReducedMotion } from "@/arrows/arrow-utils";

// ── 1. TrainValTestSplit ──────────────────────────────────────────────────────

interface TrainValTestSplitProps extends React.SVGAttributes<SVGSVGElement> {
  train?: number;
  val?: number;
  test?: number;
  total?: number;
  height?: number;
  width?: number;
  "aria-label"?: string;
}

export function TrainValTestSplit({
  train = 0.7,
  val = 0.15,
  test = 0.15,
  total,
  width: w = 320,
  height: h = 72,
  className,
  "aria-label": ariaLabel = "TrainValTestSplit",
  ...props
}: TrainValTestSplitProps) {
  const barH = 28;
  const barY = 14;
  const barW = w - 20;
  const sections = [
    { key: "train", pct: train, color: "var(--color-accuracy)", label: "Train" },
    { key: "val",   pct: val,   color: "var(--color-data)",     label: "Val" },
    { key: "test",  pct: test,  color: "var(--color-attention)", label: "Test" },
  ];
  let offset = 10;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {sections.map(({ key, pct, color, label }) => {
        const sw = pct * barW;
        const x = offset;
        offset += sw;
        return (
          <g key={key}>
            <rect data-split={key} x={x} y={barY} width={sw} height={barH} rx={0}
              fill={color} fillOpacity={0.4} stroke={color} strokeWidth={0} />
            <text x={x + sw / 2} y={barY + barH / 2 + 4} textAnchor="middle"
              fill={color} fontSize="10" fontFamily="var(--font-body)" fontWeight="600">
              {label}
            </text>
            <text x={x + sw / 2} y={barY + barH + 14} textAnchor="middle"
              fill={color} fontSize="9" fontFamily="var(--font-mono)">
              {Math.round(pct * 100)}%{total ? ` (${Math.round(pct * total).toLocaleString()})` : ""}
            </text>
          </g>
        );
      })}
      {/* borders */}
      <rect x={10} y={barY} width={barW} height={barH} rx={4} fill="none" stroke="var(--color-border)" strokeWidth={1} />
    </svg>
  );
}

// ── 2. TrainingLoop ───────────────────────────────────────────────────────────

interface TrainingLoopProps extends React.SVGAttributes<SVGSVGElement> {
  animated?: boolean;
  "aria-label"?: string;
}

export function TrainingLoop({ animated = false, className, "aria-label": ariaLabel = "TrainingLoop", ...props }: TrainingLoopProps) {
  const reducedMotion = useReducedMotion();
  const nodeRefs = useRef<(SVGGElement | null)[]>([]);
  const w = 340;
  const h = 130;

  type StepNode = { x: number; label: string; color: string };
  const steps: StepNode[] = [
    { x: 20,  label: "Batch",    color: "var(--color-data)" },
    { x: 90,  label: "Forward",  color: "var(--color-inference)" },
    { x: 170, label: "Loss",     color: "var(--color-loss)" },
    { x: 240, label: "Backward", color: "var(--color-gradient)" },
    { x: 310, label: "Update",   color: "var(--color-accuracy)" },
  ];

  useEffect(() => {
    if (!animated || reducedMotion) return;
    const tl = gsap.timeline({ repeat: -1 });
    nodeRefs.current.forEach((n) => {
      if (n) tl.to(n, { opacity: 1, duration: GSAP_DURATIONS.normal, ease: GSAP_EASINGS.flow }, ">0.1")
                .to(n, { opacity: 0.35, duration: GSAP_DURATIONS.normal }, ">0.3");
    });
    return () => { tl.kill(); };
  }, [animated, reducedMotion]);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* connecting arrows */}
      {steps.slice(0, -1).map((s, i) => (
        <line key={i} x1={s.x + 30} y1={55} x2={steps[i + 1].x - 1} y2={55} stroke="var(--color-border)" strokeWidth={1.5} />
      ))}
      {steps.slice(0, -1).map((s, i) => (
        <path key={`h-${i}`} d={`M ${steps[i + 1].x - 6} 51 L ${steps[i + 1].x} 55 L ${steps[i + 1].x - 6} 59`} fill="none" stroke="var(--color-border)" strokeWidth={1.5} />
      ))}
      {/* loop-back */}
      <path d="M 340 55 Q 340 105 180 105 Q 20 105 20 75" fill="none" stroke="var(--color-text-muted)" strokeWidth={1} strokeDasharray="4 3" opacity={0.5} />

      {steps.map((s, i) => (
        <g key={i} ref={(el) => { nodeRefs.current[i] = el; }} opacity={0.45}>
          <rect x={s.x} y={34} width={60} height={42} rx={5} fill={s.color} fillOpacity={0.15} stroke={s.color} strokeWidth={1.5} />
          <text x={s.x + 30} y={52} textAnchor="middle" fill={s.color} fontSize={s.label.length > 7 ? "8" : "10"} fontFamily="var(--font-body)" fontWeight="600">{s.label}</text>
        </g>
      ))}
    </svg>
  );
}

// ── 3. LearningRateSchedule ───────────────────────────────────────────────────

type ScheduleType = "cosine" | "linear" | "constant" | "step";

function buildSchedulePath(type: ScheduleType, w: number, h: number, warmup = 0.1): string {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;
  const steps = 80;
  const pts: string[] = [];

  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    let lr: number;
    if (t < warmup) {
      lr = t / warmup;
    } else {
      const p = (t - warmup) / (1 - warmup);
      switch (type) {
        case "cosine":   lr = 0.5 * (1 + Math.cos(Math.PI * p)); break;
        case "linear":   lr = 1 - p; break;
        case "constant": lr = 1; break;
        case "step":     lr = p < 0.33 ? 1 : p < 0.66 ? 0.5 : 0.25; break;
      }
    }
    const svgX = pad + t * pw;
    const svgY = pad + ph - lr * ph;
    pts.push(`${i === 0 ? "M" : "L"} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`);
  }
  return pts.join(" ");
}

interface LearningRateScheduleProps extends React.SVGAttributes<SVGSVGElement> {
  type?: ScheduleType;
  warmupFraction?: number;
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function LearningRateSchedule({
  type = "cosine",
  warmupFraction = 0.1,
  width: w = 220,
  height: h = 110,
  className,
  "aria-label": ariaLabel,
  ...props
}: LearningRateScheduleProps) {
  const pad = 24;
  const d = buildSchedulePath(type, w, h, warmupFraction);
  const labels: Record<ScheduleType, string> = { cosine: "Cosine", linear: "Linear", constant: "Constant", step: "Step" };

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel ?? type} className={cn("shrink-0", className)} {...props}>
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--color-border)" strokeWidth={1} />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--color-border)" strokeWidth={1} />
      {warmupFraction > 0 && (
        <rect x={pad} y={pad} width={(w - pad * 2) * warmupFraction} height={h - pad * 2} fill="var(--color-warning)" fillOpacity={0.06} />
      )}
      <path data-curve d={d} fill="none" stroke="var(--color-accuracy)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      <text x={w - pad + 2} y={pad + 10} textAnchor="end" fill="var(--color-accuracy)" fontSize="10" fontFamily="var(--font-mono)" fontWeight="600">{labels[type]}</text>
      <text x={pad + 4} y={h - 8} fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">steps →</text>
      <text x={pad - 4} y={pad + 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)" transform={`rotate(-90 ${pad - 4} ${(h) / 2})`}>lr</text>
    </svg>
  );
}

// ── 4. WarmupSchedule ─────────────────────────────────────────────────────────

interface WarmupScheduleProps extends React.SVGAttributes<SVGSVGElement> {
  warmupSteps?: number;
  totalSteps?: number;
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function WarmupSchedule({
  warmupSteps = 200,
  totalSteps = 2000,
  width: w = 220,
  height: h = 110,
  className,
  "aria-label": ariaLabel = "WarmupSchedule",
  ...props
}: WarmupScheduleProps) {
  const pad = 24;
  const pw = w - pad * 2;
  const ph = h - pad * 2;
  const warmupFrac = warmupSteps / totalSteps;
  const warmupX = pad + warmupFrac * pw;

  const pts: string[] = [];
  for (let i = 0; i <= 80; i++) {
    const t = i / 80;
    const lr = t < warmupFrac ? t / warmupFrac : 0.5 * (1 + Math.cos(Math.PI * (t - warmupFrac) / (1 - warmupFrac)));
    pts.push(`${i === 0 ? "M" : "L"} ${(pad + t * pw).toFixed(1)} ${(pad + ph - lr * ph).toFixed(1)}`);
  }

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      <line x1={pad} y1={pad} x2={pad} y2={h - pad} stroke="var(--color-border)" strokeWidth={1} />
      <line x1={pad} y1={h - pad} x2={w - pad} y2={h - pad} stroke="var(--color-border)" strokeWidth={1} />

      <rect data-warmup x={pad} y={pad} width={warmupX - pad} height={ph} fill="var(--color-warning)" fillOpacity={0.08} />
      <rect data-decay x={warmupX} y={pad} width={w - pad - warmupX} height={ph} fill="var(--color-data)" fillOpacity={0.04} />

      <path d={pts.join(" ")} fill="none" stroke="var(--color-accuracy)" strokeWidth={2} strokeLinecap="round" />

      <line x1={warmupX} y1={pad} x2={warmupX} y2={h - pad} stroke="var(--color-warning)" strokeWidth={1} strokeDasharray="3 2" opacity={0.6} />
      <text x={pad + (warmupX - pad) / 2} y={h - 8} textAnchor="middle" fill="var(--color-warning)" fontSize="8" fontFamily="var(--font-mono)">warmup</text>
      <text x={warmupX + (w - pad - warmupX) / 2} y={h - 8} textAnchor="middle" fill="var(--color-data)" fontSize="8" fontFamily="var(--font-mono)">decay</text>
    </svg>
  );
}

// ── 5. CheckpointMarker ───────────────────────────────────────────────────────

interface CheckpointMarkerProps extends React.SVGAttributes<SVGSVGElement> {
  step?: number;
  totalSteps?: number;
  label?: string;
  "aria-label"?: string;
}

export function CheckpointMarker({
  step = 500,
  totalSteps = 1000,
  label,
  className,
  "aria-label": ariaLabel = "CheckpointMarker",
  ...props
}: CheckpointMarkerProps) {
  const w = 260;
  const h = 60;
  const trackY = 32;
  const pad = 16;
  const trackW = w - pad * 2;
  const pct = step / totalSteps;
  const markerX = pad + pct * trackW;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* track */}
      <line x1={pad} y1={trackY} x2={w - pad} y2={trackY} stroke="var(--color-surface-3)" strokeWidth={4} strokeLinecap="round" />
      {/* progress */}
      <line x1={pad} y1={trackY} x2={markerX} y2={trackY} stroke="var(--color-accuracy)" strokeWidth={4} strokeLinecap="round" />
      {/* marker */}
      <g data-checkpoint>
        <circle cx={markerX} cy={trackY} r={8} fill="var(--color-accuracy)" />
        <text x={markerX} y={trackY + 4} textAnchor="middle" fill="var(--color-bg)" fontSize="9" fontFamily="var(--font-mono)" fontWeight="700">✓</text>
        <line x1={markerX} y1={trackY - 8} x2={markerX} y2={trackY - 18} stroke="var(--color-accuracy)" strokeWidth={1} />
        <text x={markerX} y={trackY - 22} textAnchor="middle" fill="var(--color-accuracy)" fontSize="9" fontFamily="var(--font-mono)">
          {label ?? `step ${step}`}
        </text>
      </g>
      {/* start/end labels */}
      <text x={pad} y={h - 4} fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">0</text>
      <text x={w - pad} y={h - 4} textAnchor="end" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">{totalSteps}</text>
    </svg>
  );
}

// ── 6. BatchLoader ────────────────────────────────────────────────────────────

interface BatchLoaderProps extends React.SVGAttributes<SVGSVGElement> {
  batchSize?: number;
  datasetSize?: number;
  "aria-label"?: string;
}

export function BatchLoader({
  batchSize = 32,
  datasetSize = 320,
  className,
  "aria-label": ariaLabel = "BatchLoader",
  ...props
}: BatchLoaderProps) {
  const numBatches = Math.min(10, Math.ceil(datasetSize / batchSize));
  const cellW = 18;
  const cellH = 18;
  const gap = 3;
  const cols = Math.min(numBatches, 8);
  const rows = Math.ceil(numBatches / cols);
  const w = cols * (cellW + gap) + 60;
  const h = rows * (cellH + gap) + 40;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      <text x={w / 2} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">batch_size={batchSize}</text>
      {Array.from({ length: numBatches }, (_, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        return (
          <rect
            key={i}
            data-batch={i}
            x={10 + col * (cellW + gap)}
            y={18 + row * (cellH + gap)}
            width={cellW}
            height={cellH}
            rx={2}
            fill={i === 0 ? "var(--color-data)" : "var(--color-surface-3)"}
            fillOpacity={i === 0 ? 0.7 : 0.4}
            stroke={i === 0 ? "var(--color-data)" : "var(--color-border)"}
            strokeWidth={i === 0 ? 1.5 : 0.5}
          />
        );
      })}
      <text x={w - 4} y={h - 8} textAnchor="end" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">{datasetSize} samples</text>
    </svg>
  );
}

// ── 7. DataSourceNode ─────────────────────────────────────────────────────────

type DataSourceType = "database" | "csv" | "api" | "s3";

const SOURCE_ICONS: Record<DataSourceType, React.ReactNode> = {
  database: <><ellipse cx={28} cy={20} rx={14} ry={5} /><rect x={14} y={20} width={28} height={16} /><ellipse cx={28} cy={36} rx={14} ry={5} /></>,
  csv:      <><rect x={14} y={12} width={24} height={28} rx={2} /><line x1={19} y1={20} x2={37} y2={20} /><line x1={19} y1={26} x2={34} y2={26} /><line x1={19} y1={32} x2={31} y2={32} /></>,
  api:      <><rect x={12} y={16} width={32} height={20} rx={4} /><text x={28} y={30} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="currentColor">API</text></>,
  s3:       <><rect x={14} y={14} width={28} height={24} rx={3} /><line x1={14} y1={22} x2={42} y2={22} /><text x={28} y={34} textAnchor="middle" fontSize="8" fontFamily="var(--font-mono)" fill="currentColor">S3</text></>,
};

interface DataSourceNodeProps extends React.SVGAttributes<SVGSVGElement> {
  type?: DataSourceType;
  label?: string;
  "aria-label"?: string;
}

export function DataSourceNode({
  type = "database",
  label = "Data Source",
  className,
  "aria-label": ariaLabel = "DataSourceNode",
  ...props
}: DataSourceNodeProps) {
  const w = 80;
  const h = 80;
  const c = "var(--color-data)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      <g fill="none" stroke={c} strokeWidth={1.5} opacity={0.8}>
        {SOURCE_ICONS[type]}
      </g>
      <text x={w / 2} y={h - 6} textAnchor="middle" fill={c} fontSize="9" fontFamily="var(--font-body)">{label}</text>
    </svg>
  );
}

// ── 8. PreprocessingStep ──────────────────────────────────────────────────────

interface PreprocessingStepProps extends React.SVGAttributes<SVGSVGElement> {
  label?: string;
  sublabel?: string;
  color?: string;
  "aria-label"?: string;
}

export function PreprocessingStep({
  label = "Preprocess",
  sublabel,
  color,
  className,
  "aria-label": ariaLabel = "PreprocessingStep",
  ...props
}: PreprocessingStepProps) {
  const c = color ?? "var(--color-embedding)";
  const w = 120;
  const h = 60;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={ariaLabel} className={cn("shrink-0", className)} {...props}>
      {/* in port */}
      <circle data-port="in" cx={8} cy={h / 2} r={5} fill={c} opacity={0.5} />
      <line x1={13} y1={h / 2} x2={20} y2={h / 2} stroke={c} strokeWidth={1} opacity={0.5} />

      {/* body */}
      <rect x={20} y={10} width={80} height={40} rx={6} fill={c} fillOpacity={0.12} stroke={c} strokeWidth={1.5} />
      <text x={60} y={sublabel ? 28 : 34} textAnchor="middle" fill={c} fontSize="10" fontFamily="var(--font-body)" fontWeight="600">{label}</text>
      {sublabel && <text x={60} y={42} textAnchor="middle" fill={c} fontSize="8" fontFamily="var(--font-mono)" opacity={0.7}>{sublabel}</text>}

      {/* out port */}
      <line x1={100} y1={h / 2} x2={112} y2={h / 2} stroke={c} strokeWidth={1} opacity={0.5} />
      <circle data-port="out" cx={116} cy={h / 2} r={5} fill={c} opacity={0.5} />
    </svg>
  );
}
