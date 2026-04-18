import React from "react";
import { cn } from "@/utils/cn";
import { resolveColor } from "@/arrows/arrow-utils";

// ── Shared SVG helpers ────────────────────────────────────────────────────────

const PAD = { t: 28, r: 20, b: 32, l: 40 };

function Axes({ w, h, xLabel, yLabel }: { w: number; h: number; xLabel?: string; yLabel?: string }) {
  return (
    <>
      <line x1={PAD.l} y1={PAD.t} x2={PAD.l} y2={h - PAD.b} stroke="var(--color-border)" strokeWidth={1} />
      <line x1={PAD.l} y1={h - PAD.b} x2={w - PAD.r} y2={h - PAD.b} stroke="var(--color-border)" strokeWidth={1} />
      {xLabel && <text x={(PAD.l + w - PAD.r) / 2} y={h - 4} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{xLabel}</text>}
      {yLabel && <text x={10} y={(PAD.t + h - PAD.b) / 2} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)" transform={`rotate(-90 10 ${(PAD.t + h - PAD.b) / 2})`}>{yLabel}</text>}
    </>
  );
}

function buildLinePath(points: [number, number][], w: number, h: number, minX: number, maxX: number, minY: number, maxY: number): string {
  const pw = w - PAD.l - PAD.r;
  const ph = h - PAD.t - PAD.b;
  return points.map(([x, y], i) => {
    const sx = PAD.l + ((x - minX) / (maxX - minX || 1)) * pw;
    const sy = h - PAD.b - ((y - minY) / (maxY - minY || 1)) * ph;
    return `${i === 0 ? "M" : "L"} ${sx.toFixed(1)} ${sy.toFixed(1)}`;
  }).join(" ");
}

// ── 1. LossChart ──────────────────────────────────────────────────────────────

interface EpochData { epoch: number; train: number; val?: number; }

interface LossChartProps extends React.SVGAttributes<SVGSVGElement> {
  data: EpochData[];
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function LossChart({ data, width: w = 320, height: h = 180, className, "aria-label": al = "LossChart", ...p }: LossChartProps) {
  const trainC = "var(--color-loss)";
  const valC   = "var(--color-data)";
  const epochs = data.map(d => d.epoch);
  const allVals = data.flatMap(d => [d.train, ...(d.val !== undefined ? [d.val] : [])]);
  const minX = Math.min(...epochs), maxX = Math.max(...epochs);
  const minY = 0, maxY = Math.max(...allVals) * 1.1;

  const trainPath = buildLinePath(data.map(d => [d.epoch, d.train]), w, h, minX, maxX, minY, maxY);
  const valPath   = data[0].val !== undefined
    ? buildLinePath(data.filter(d => d.val !== undefined).map(d => [d.epoch, d.val!]), w, h, minX, maxX, minY, maxY)
    : null;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <Axes w={w} h={h} xLabel="Epoch" yLabel="Loss" />
      <path data-series="train" d={trainPath} fill="none" stroke={trainC} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {valPath && <path data-series="val" d={valPath} fill="none" stroke={valC} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />}
      {/* legend */}
      <circle cx={PAD.l + 8} cy={PAD.t - 10} r={4} fill={trainC} />
      <text x={PAD.l + 15} y={PAD.t - 6} fill={trainC} fontSize="9" fontFamily="var(--font-mono)">train</text>
      {valPath && <>
        <line x1={PAD.l + 55} y1={PAD.t - 10} x2={PAD.l + 63} y2={PAD.t - 10} stroke={valC} strokeWidth={2} strokeDasharray="3 2" />
        <text x={PAD.l + 66} y={PAD.t - 6} fill={valC} fontSize="9" fontFamily="var(--font-mono)">val</text>
      </>}
    </svg>
  );
}

// ── 2. AccuracyChart ──────────────────────────────────────────────────────────

export function AccuracyChart({ data, width: w = 320, height: h = 180, className, "aria-label": al = "AccuracyChart", ...p }: LossChartProps) {
  const trainC = "var(--color-accuracy)";
  const valC   = "var(--color-data)";
  const epochs = data.map(d => d.epoch);
  const allVals = data.flatMap(d => [d.train, ...(d.val !== undefined ? [d.val] : [])]);
  const minX = Math.min(...epochs), maxX = Math.max(...epochs);
  const minY = 0, maxY = Math.min(1, Math.max(...allVals) * 1.1);

  const trainPath = buildLinePath(data.map(d => [d.epoch, d.train]), w, h, minX, maxX, minY, maxY);
  const valPath   = data[0].val !== undefined
    ? buildLinePath(data.filter(d => d.val !== undefined).map(d => [d.epoch, d.val!]), w, h, minX, maxX, minY, maxY)
    : null;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <Axes w={w} h={h} xLabel="Epoch" yLabel="Accuracy" />
      <path data-series="train" d={trainPath} fill="none" stroke={trainC} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
      {valPath && <path data-series="val" d={valPath} fill="none" stroke={valC} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" strokeDasharray="5 3" />}
      <circle cx={PAD.l + 8} cy={PAD.t - 10} r={4} fill={trainC} />
      <text x={PAD.l + 15} y={PAD.t - 6} fill={trainC} fontSize="9" fontFamily="var(--font-mono)">train</text>
      {valPath && <>
        <line x1={PAD.l + 55} y1={PAD.t - 10} x2={PAD.l + 63} y2={PAD.t - 10} stroke={valC} strokeWidth={2} strokeDasharray="3 2" />
        <text x={PAD.l + 66} y={PAD.t - 6} fill={valC} fontSize="9" fontFamily="var(--font-mono)">val</text>
      </>}
    </svg>
  );
}

// ── 3. ConfusionMatrix ────────────────────────────────────────────────────────

interface ConfusionMatrixProps extends React.SVGAttributes<SVGSVGElement> {
  matrix: number[][];
  labels: string[];
  "aria-label"?: string;
}

export function ConfusionMatrix({ matrix, labels, className, "aria-label": al = "ConfusionMatrix", ...p }: ConfusionMatrixProps) {
  const n = labels.length;
  const cellSize = 52;
  const labelW = 48;
  const w = labelW + n * cellSize + 16;
  const h = labelW + n * cellSize + 16;
  const maxVal = Math.max(...matrix.flat());

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      {/* col labels (predicted) */}
      {labels.map((l, i) => (
        <text key={`cl-${i}`} x={labelW + i * cellSize + cellSize / 2} y={labelW - 8} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">{l}</text>
      ))}
      {/* row labels (actual) */}
      {labels.map((l, i) => (
        <text key={`rl-${i}`} x={labelW - 4} y={labelW + i * cellSize + cellSize / 2 + 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize="10" fontFamily="var(--font-mono)">{l}</text>
      ))}
      {/* cells */}
      {matrix.map((row, ri) =>
        row.map((val, ci) => {
          const isDiag = ri === ci;
          const intensity = maxVal > 0 ? val / maxVal : 0;
          const fill = isDiag ? "var(--color-accuracy)" : "var(--color-loss)";
          return (
            <g key={`${ri}-${ci}`}>
              <rect
                data-cell
                data-diagonal={isDiag ? "true" : "false"}
                x={labelW + ci * cellSize}
                y={labelW + ri * cellSize}
                width={cellSize - 1}
                height={cellSize - 1}
                rx={2}
                fill={fill}
                fillOpacity={0.08 + intensity * 0.72}
              />
              <text
                x={labelW + ci * cellSize + cellSize / 2}
                y={labelW + ri * cellSize + cellSize / 2 + 4}
                textAnchor="middle"
                fill={intensity > 0.5 ? "var(--color-text-primary)" : "var(--color-text-secondary)"}
                fontSize="12"
                fontFamily="var(--font-mono)"
                fontWeight={isDiag ? "700" : "400"}
              >
                {val}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}

// ── 4. ROCCurve ───────────────────────────────────────────────────────────────

interface ROCPoint { fpr: number; tpr: number; }

interface ROCCurveProps extends React.SVGAttributes<SVGSVGElement> {
  points: ROCPoint[];
  auc?: number;
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function ROCCurve({ points, auc, width: w = 220, height: h = 200, className, "aria-label": al = "ROCCurve", ...p }: ROCCurveProps) {
  const pw = w - PAD.l - PAD.r;
  const ph = h - PAD.t - PAD.b;
  const toSVG = (fpr: number, tpr: number) => ({
    x: PAD.l + fpr * pw,
    y: h - PAD.b - tpr * ph,
  });

  const curvePath = points.map(({ fpr, tpr }, i) => {
    const { x, y } = toSVG(fpr, tpr);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${y.toFixed(1)}`;
  }).join(" ");

  const { x: bx0, y: by0 } = toSVG(0, 0);
  const { x: bx1, y: by1 } = toSVG(1, 1);

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <Axes w={w} h={h} xLabel="FPR" yLabel="TPR" />
      {/* baseline */}
      <line data-baseline x1={bx0} y1={by0} x2={bx1} y2={by1} stroke="var(--color-border)" strokeWidth={1} strokeDasharray="4 3" />
      {/* ROC curve */}
      <path data-curve="roc" d={curvePath} fill="none" stroke="var(--color-neuron)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
      {/* fill under curve */}
      <path d={`${curvePath} L ${bx1} ${by1} L ${bx0} ${by0} Z`} fill="var(--color-neuron)" fillOpacity={0.07} />
      {/* AUC label */}
      {auc !== undefined && (
        <>
          <text x={PAD.l + pw * 0.6} y={PAD.t + ph * 0.35} fill="var(--color-neuron)" fontSize="11" fontFamily="var(--font-mono)" fontWeight="600">AUC</text>
          <text x={PAD.l + pw * 0.6} y={PAD.t + ph * 0.35 + 14} fill="var(--color-neuron)" fontSize="13" fontFamily="var(--font-mono)" fontWeight="700">{auc.toFixed(2)}</text>
        </>
      )}
    </svg>
  );
}

// ── 5. FeatureImportanceBar ───────────────────────────────────────────────────

interface Feature { name: string; importance: number; }

interface FeatureImportanceBarProps extends React.SVGAttributes<SVGSVGElement> {
  features: Feature[];
  width?: number;
  "aria-label"?: string;
}

export function FeatureImportanceBar({ features, width: w = 280, className, "aria-label": al = "FeatureImportanceBar", ...p }: FeatureImportanceBarProps) {
  const sorted = [...features].sort((a, b) => b.importance - a.importance);
  const maxImp = sorted[0]?.importance ?? 1;
  const labelW = 120;
  const barMaxW = w - labelW - 60;
  const rowH = 22;
  const h = sorted.length * rowH + 24;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <text x={w / 2} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">Feature Importance</text>
      {sorted.map(({ name, importance }, i) => {
        const barW = (importance / maxImp) * barMaxW;
        const y = 18 + i * rowH;
        const opacity = 0.4 + (importance / maxImp) * 0.5;
        return (
          <g key={i}>
            <text x={labelW - 4} y={y + 14} textAnchor="end" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{name}</text>
            <rect data-bar x={labelW} y={y + 2} width={Math.max(2, barW)} height={rowH - 6} rx={2} fill="var(--color-neuron)" fillOpacity={opacity} />
            <text x={labelW + barW + 4} y={y + 14} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{(importance * 100).toFixed(0)}%</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 6. BenchmarkRadar ─────────────────────────────────────────────────────────

interface RadarModel { name: string; scores: number[]; }

interface BenchmarkRadarProps extends React.SVGAttributes<SVGSVGElement> {
  metrics: string[];
  models: RadarModel[];
  size?: number;
  "aria-label"?: string;
}

const RADAR_COLORS = ["var(--color-neuron)", "var(--color-data)", "var(--color-attention)", "var(--color-accuracy)"];

export function BenchmarkRadar({ metrics, models, size = 200, className, "aria-label": al = "BenchmarkRadar", ...p }: BenchmarkRadarProps) {
  const n = metrics.length;
  const cx = size / 2;
  const cy = size / 2 + 10;
  const r = size * 0.36;
  const labelR = r + 18;

  const angleFor = (i: number) => (2 * Math.PI * i) / n - Math.PI / 2;
  const pointFor = (i: number, score: number) => {
    const a = angleFor(i);
    return { x: cx + Math.cos(a) * r * score, y: cy + Math.sin(a) * r * score };
  };
  const axisFor = (i: number) => {
    const a = angleFor(i);
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  };
  const labelFor = (i: number) => {
    const a = angleFor(i);
    return { x: cx + Math.cos(a) * labelR, y: cy + Math.sin(a) * labelR };
  };

  // grid rings
  const gridLevels = [0.25, 0.5, 0.75, 1];
  const gridPolygon = (level: number) =>
    Array.from({ length: n }, (_, i) => {
      const a = angleFor(i);
      return `${cx + Math.cos(a) * r * level},${cy + Math.sin(a) * r * level}`;
    }).join(" ");

  return (
    <svg width={size} height={size + 32} viewBox={`0 0 ${size} ${size + 32}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      {/* grid */}
      {gridLevels.map((l, gi) => (
        <polygon key={gi} points={gridPolygon(l)} fill="none" stroke="var(--color-border)" strokeWidth={0.5} />
      ))}
      {/* axes */}
      {Array.from({ length: n }, (_, i) => {
        const ax = axisFor(i);
        return <line key={i} x1={cx} y1={cy} x2={ax.x} y2={ax.y} stroke="var(--color-border)" strokeWidth={0.8} />;
      })}
      {/* model polygons */}
      {models.map(({ scores }, mi) => {
        const pts = scores.map((s, i) => pointFor(i, s));
        const polygonPts = pts.map(({ x, y }) => `${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
        const c = RADAR_COLORS[mi % RADAR_COLORS.length];
        return (
          <polygon
            key={mi}
            data-model={mi}
            points={polygonPts}
            fill={c}
            fillOpacity={0.12}
            stroke={c}
            strokeWidth={2}
          />
        );
      })}
      {/* metric labels */}
      {metrics.map((m, i) => {
        const { x, y } = labelFor(i);
        return (
          <text key={i} x={x} y={y + 3} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{m}</text>
        );
      })}
      {/* legend */}
      {models.map(({ name }, mi) => {
        const c = RADAR_COLORS[mi % RADAR_COLORS.length];
        return (
          <g key={mi}>
            <rect x={8 + mi * 80} y={size + 8} width={8} height={8} rx={1} fill={c} fillOpacity={0.6} />
            <text x={20 + mi * 80} y={size + 16} fill={c} fontSize="9" fontFamily="var(--font-mono)">{name}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 7. ModelLeaderboard ───────────────────────────────────────────────────────

interface LeaderboardEntry { rank: number; name: string; score: number; delta?: number; }

interface ModelLeaderboardProps {
  models: LeaderboardEntry[];
  title?: string;
  className?: string;
}

export function ModelLeaderboard({ models, title = "Leaderboard", className }: ModelLeaderboardProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] overflow-hidden", className)}>
      <div className="px-4 py-2.5 border-b border-[var(--color-border)] text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">{title}</div>
      <table className="w-full text-sm font-mono">
        <tbody>
          {models.map(({ rank, name, score, delta }) => (
            <tr key={rank} className="border-b border-[var(--color-border-subtle)] last:border-0 hover:bg-[var(--color-surface-2)] transition-colors">
              <td className="px-3 py-2 text-[var(--color-text-muted)] w-8">{rank}</td>
              <td className="px-3 py-2 text-[var(--color-text-primary)] font-semibold">{name}</td>
              <td className="px-3 py-2 text-[var(--color-text-primary)] tabular-nums">{score}</td>
              {delta !== undefined && (
                <td className={cn("px-3 py-2 tabular-nums text-xs", delta >= 0 ? "text-[var(--color-accuracy)]" : "text-[var(--color-loss)]")}>
                  {delta >= 0 ? `+${delta}` : `${delta}`}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── 8. EvalScoreCard ──────────────────────────────────────────────────────────

interface EvalScoreCardProps {
  metric: string;
  value: number;
  unit?: string;
  delta?: number;
  description?: string;
  className?: string;
}

export function EvalScoreCard({ metric, value, unit, delta, description, className }: EvalScoreCardProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 flex flex-col gap-1", className)}>
      <span className="text-xs font-mono uppercase tracking-widest text-[var(--color-text-muted)]">{metric}</span>
      <div className="flex items-baseline gap-1.5">
        <span className="text-3xl font-mono font-bold text-[var(--color-text-primary)] tabular-nums">{value}</span>
        {unit && <span className="text-sm text-[var(--color-text-muted)]">{unit}</span>}
      </div>
      {delta !== undefined && (
        <DeltaIndicator value={delta} className="text-xs" />
      )}
      {description && <span className="text-xs text-[var(--color-text-muted)]">{description}</span>}
    </div>
  );
}

// ── 9. DeltaIndicator ─────────────────────────────────────────────────────────

interface DeltaIndicatorProps {
  value: number;
  unit?: string;
  className?: string;
}

export function DeltaIndicator({ value, unit, className }: DeltaIndicatorProps) {
  const isPos = value >= 0;
  return (
    <span className={cn("inline-flex items-center gap-0.5 font-mono font-semibold", isPos ? "text-[var(--color-accuracy)]" : "text-[var(--color-loss)]", className)}>
      <span>{isPos ? "▲" : "▼"}</span>
      <span>{isPos ? `+${value}` : `${value}`}{unit ?? ""}</span>
    </span>
  );
}

// ── 10. SparklineInline ───────────────────────────────────────────────────────

interface SparklineInlineProps extends React.SVGAttributes<SVGSVGElement> {
  data: number[];
  color?: string;
  width?: number;
  height?: number;
}

export function SparklineInline({ data, color, width: w = 60, height: h = 20, className, ...p }: SparklineInlineProps) {
  if (data.length < 2) return <svg width={w} height={h} className={cn("shrink-0", className)} {...p} />;
  const c = resolveColor(color ?? "data");
  const minY = Math.min(...data), maxY = Math.max(...data);
  const pts = data.map((v, i) => {
    const x = (i / (data.length - 1)) * (w - 4) + 2;
    const y = h - 2 - ((v - minY) / (maxY - minY || 1)) * (h - 4);
    return `${x.toFixed(1)},${y.toFixed(1)}`;
  }).join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} className={cn("shrink-0 inline-block", className)} {...p}>
      <polyline points={pts} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

// ── 11. MetricGauge ───────────────────────────────────────────────────────────

interface MetricGaugeProps extends React.SVGAttributes<SVGSVGElement> {
  value: number; // 0–1
  label: string;
  color?: string;
  size?: number;
  "aria-label"?: string;
}

export function MetricGauge({ value, label, color, size = 120, className, "aria-label": al, ...p }: MetricGaugeProps) {
  const c = resolveColor(color ?? "accuracy");
  const cx = size / 2, cy = size * 0.58;
  const r = size * 0.38;
  const startAngle = Math.PI;
  const endAngle = 2 * Math.PI;
  const fillAngle = startAngle + value * Math.PI;

  const arcPath = (from: number, to: number) => {
    const x1 = cx + r * Math.cos(from), y1 = cy + r * Math.sin(from);
    const x2 = cx + r * Math.cos(to),   y2 = cy + r * Math.sin(to);
    const large = to - from > Math.PI ? 1 : 0;
    return `M ${x1.toFixed(1)} ${y1.toFixed(1)} A ${r} ${r} 0 ${large} 1 ${x2.toFixed(1)} ${y2.toFixed(1)}`;
  };

  return (
    <svg width={size} height={size * 0.72} viewBox={`0 0 ${size} ${size * 0.72}`} role="img" aria-label={al ?? label} className={cn("shrink-0", className)} {...p}>
      <path data-track d={arcPath(startAngle, endAngle)} fill="none" stroke="var(--color-surface-3)" strokeWidth={8} strokeLinecap="round" />
      {value > 0 && <path data-fill d={arcPath(startAngle, fillAngle)} fill="none" stroke={c} strokeWidth={8} strokeLinecap="round" />}
      <text x={cx} y={cy - 4} textAnchor="middle" fill={c} fontSize={size * 0.18} fontFamily="var(--font-mono)" fontWeight="700">{Math.round(value * 100)}%</text>
      <text x={cx} y={cy + 14} textAnchor="middle" fill="var(--color-text-muted)" fontSize={size * 0.09} fontFamily="var(--font-body)">{label}</text>
    </svg>
  );
}

// ── 12. ParameterCountBar ─────────────────────────────────────────────────────

interface ParamModel { name: string; params: number; }

interface ParameterCountBarProps extends React.SVGAttributes<SVGSVGElement> {
  models: ParamModel[];
  unit?: string;
  "aria-label"?: string;
}

export function ParameterCountBar({ models, unit = "B", className, "aria-label": al = "ParameterCountBar", ...p }: ParameterCountBarProps) {
  const sorted = [...models].sort((a, b) => b.params - a.params);
  const maxP = sorted[0]?.params ?? 1;
  const labelW = 72;
  const barMaxW = 160;
  const rowH = 24;
  const h = sorted.length * rowH + 24;
  const w = labelW + barMaxW + 60;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <text x={w / 2} y={12} textAnchor="middle" fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">Parameters ({unit})</text>
      {sorted.map(({ name, params }, i) => {
        const barW = (params / maxP) * barMaxW;
        const y = 18 + i * rowH;
        return (
          <g key={i}>
            <text x={labelW - 4} y={y + 15} textAnchor="end" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{name}</text>
            <rect data-bar x={labelW} y={y + 2} width={Math.max(2, barW)} height={rowH - 6} rx={2} fill="var(--color-neuron)" fillOpacity={0.35 + (i === 0 ? 0.4 : 0)} />
            <text x={labelW + barW + 4} y={y + 15} fill="var(--color-text-muted)" fontSize="9" fontFamily="var(--font-mono)">{params}{unit}</text>
          </g>
        );
      })}
    </svg>
  );
}

// ── 13. SideBySideComparison ──────────────────────────────────────────────────

interface ComparisonPanel { label: string; content: React.ReactNode; }

interface SideBySideComparisonProps {
  left: ComparisonPanel;
  right: ComparisonPanel;
  className?: string;
}

export function SideBySideComparison({ left, right, className }: SideBySideComparisonProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-0 rounded-xl overflow-hidden border border-[var(--color-border)]", className)}>
      {[left, right].map((panel, i) => (
        <div key={i} className={cn("flex flex-col", i === 0 ? "border-r border-[var(--color-border)]" : "")}>
          <div className="px-3 py-2 text-xs font-mono font-semibold uppercase tracking-wider text-[var(--color-text-muted)] border-b border-[var(--color-border)] bg-[var(--color-surface-2)]">
            {panel.label}
          </div>
          <div className="p-3 bg-[var(--color-surface-1)] flex-1">{panel.content}</div>
        </div>
      ))}
    </div>
  );
}

// ── 14. VersionTimeline ───────────────────────────────────────────────────────

interface Version { name: string; year: number; params?: string; description?: string; }

interface VersionTimelineProps extends React.SVGAttributes<SVGSVGElement> {
  versions: Version[];
  width?: number;
  "aria-label"?: string;
}

export function VersionTimeline({ versions, width: w = 400, className, "aria-label": al = "VersionTimeline", ...p }: VersionTimelineProps) {
  const h = 100;
  const pad = 32;
  const trackY = 48;
  const n = versions.length;
  const spacing = n > 1 ? (w - pad * 2) / (n - 1) : 0;
  const c = "var(--color-neuron)";

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      {/* timeline track */}
      <line data-timeline x1={pad} y1={trackY} x2={w - pad} y2={trackY} stroke="var(--color-surface-3)" strokeWidth={3} strokeLinecap="round" />

      {versions.map(({ name, year, params }, i) => {
        const x = pad + i * spacing;
        const isFirst = i === 0;
        const isLast = i === n - 1;
        return (
          <g key={i}>
            {/* progress fill up to this node */}
            {i > 0 && <line x1={pad + (i - 1) * spacing} y1={trackY} x2={x} y2={trackY} stroke={c} strokeWidth={3} strokeLinecap="round" />}
            <circle cx={x} cy={trackY} r={8} fill={c} fillOpacity={isLast ? 1 : 0.5} stroke={c} strokeWidth={1.5} />
            <text x={x} y={trackY - 14} textAnchor="middle" fill={c} fontSize="11" fontFamily="var(--font-body)" fontWeight="700">{name}</text>
            <text x={x} y={trackY - 3} textAnchor="middle" fill="var(--color-bg)" fontSize="8" fontFamily="var(--font-mono)" fontWeight="700">{year.toString().slice(2)}</text>
            <text x={x} y={trackY + 20} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{year}</text>
            {params && <text x={x} y={trackY + 32} textAnchor="middle" fill="var(--color-text-muted)" fontSize="8" fontFamily="var(--font-mono)">{params}</text>}
          </g>
        );
      })}
    </svg>
  );
}

// ── 15. ParameterComparisonTable ──────────────────────────────────────────────

interface ParameterComparisonTableProps {
  models: string[];
  specs: string[];
  data: Record<string, Record<string, string>>;
  highlight?: string; // model name to highlight
  className?: string;
}

export function ParameterComparisonTable({ models, specs, data, highlight, className }: ParameterComparisonTableProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] overflow-hidden", className)}>
      <table className="w-full text-xs font-mono">
        <thead>
          <tr className="bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
            <th className="px-3 py-2 text-left text-[var(--color-text-muted)] font-normal"></th>
            {models.map(m => (
              <th key={m} className={cn("px-3 py-2 text-center font-semibold", m === highlight ? "text-[var(--color-neuron)]" : "text-[var(--color-text-secondary)]")}>{m}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((spec, si) => (
            <tr key={spec} className={cn("border-b border-[var(--color-border-subtle)] last:border-0", si % 2 === 0 ? "bg-[var(--color-surface-1)]" : "bg-[var(--color-surface-2)]")}>
              <td className="px-3 py-2 text-[var(--color-text-muted)]">{spec}</td>
              {models.map(m => (
                <td key={m} className={cn("px-3 py-2 text-center tabular-nums", m === highlight ? "text-[var(--color-neuron)] font-semibold" : "text-[var(--color-text-primary)]")}>
                  {data[m]?.[spec] ?? "—"}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

// ── 16. CapabilityMatrix ──────────────────────────────────────────────────────

interface CapabilityMatrixProps extends React.SVGAttributes<SVGSVGElement> {
  models: string[];
  tasks: string[];
  scores: number[][];
  "aria-label"?: string;
}

export function CapabilityMatrix({ models, tasks, scores, className, "aria-label": al = "CapabilityMatrix", ...p }: CapabilityMatrixProps) {
  const cellW = 48;
  const cellH = 32;
  const labelW = 64;
  const labelH = 28;
  const w = labelW + tasks.length * cellW + 12;
  const h = labelH + models.length * cellH + 12;

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      {/* column (task) labels */}
      {tasks.map((t, ci) => (
        <text key={ci} x={labelW + ci * cellW + cellW / 2} y={labelH - 8} textAnchor="middle" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{t}</text>
      ))}
      {/* row (model) labels */}
      {models.map((m, ri) => (
        <text key={ri} x={labelW - 4} y={labelH + ri * cellH + cellH / 2 + 4} textAnchor="end" fill="var(--color-text-secondary)" fontSize="9" fontFamily="var(--font-mono)">{m}</text>
      ))}
      {/* cells */}
      {models.map((_, ri) =>
        tasks.map((_, ci) => {
          const score = scores[ri]?.[ci] ?? 0;
          return (
            <g key={`${ri}-${ci}`}>
              <rect
                data-cell
                x={labelW + ci * cellW}
                y={labelH + ri * cellH}
                width={cellW - 1}
                height={cellH - 1}
                rx={2}
                fill="var(--color-accuracy)"
                fillOpacity={0.06 + score * 0.74}
              />
              <text
                x={labelW + ci * cellW + cellW / 2}
                y={labelH + ri * cellH + cellH / 2 + 4}
                textAnchor="middle"
                fill={score > 0.6 ? "var(--color-text-primary)" : "var(--color-text-muted)"}
                fontSize="9"
                fontFamily="var(--font-mono)"
              >
                {Math.round(score * 100)}
              </text>
            </g>
          );
        })
      )}
    </svg>
  );
}

// ── 17. ProConsList ───────────────────────────────────────────────────────────

interface ProsConsListProps {
  pros: string[];
  cons: string[];
  className?: string;
}

export function ProConsList({ pros, cons, className }: ProsConsListProps) {
  return (
    <div className={cn("grid grid-cols-2 gap-3", className)}>
      <div className="rounded-lg border border-[var(--color-accuracy)]/30 bg-[var(--color-accuracy)]/5 p-3">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-accuracy)] mb-2">Pros</div>
        <ul className="space-y-1.5">
          {pros.map((p, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-accuracy)] shrink-0">✓</span>
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </div>
      <div className="rounded-lg border border-[var(--color-loss)]/30 bg-[var(--color-loss)]/5 p-3">
        <div className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-loss)] mb-2">Cons</div>
        <ul className="space-y-1.5">
          {cons.map((c, i) => (
            <li key={i} className="flex gap-2 text-sm text-[var(--color-text-secondary)]">
              <span className="text-[var(--color-loss)] shrink-0">✗</span>
              <span>{c}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

// ── 18. TradeoffDiagram ───────────────────────────────────────────────────────

interface TradeoffDiagramProps extends React.SVGAttributes<SVGSVGElement> {
  quality: number;
  speed: number;
  cost: number;
  size?: number;
  "aria-label"?: string;
}

export function TradeoffDiagram({ quality, speed, cost, size = 200, className, "aria-label": al = "TradeoffDiagram", ...p }: TradeoffDiagramProps) {
  const cx = size / 2;
  const topY = 20;
  const botY = size - 24;
  const botL = 12;
  const botR = size - 12;
  const r = (size - 60) / 2;

  // equilateral triangle vertices
  const A = { x: cx,    y: topY };           // Quality (top)
  const B = { x: botL,  y: botY };           // Speed (bottom-left)
  const C = { x: botR,  y: botY };           // Cost (bottom-right)

  // interpolate position on the triangle based on scores
  const px = A.x * quality + B.x * speed + C.x * cost;
  const py = A.y * quality + B.y * speed + C.y * cost;

  const triPts = `${A.x},${A.y} ${B.x},${B.y} ${C.x},${C.y}`;
  const markerPts = [
    `${A.x},${A.y}`,
    `${A.x * quality + B.x * (1 - quality)},${A.y * quality + B.y * (1 - quality)}`,
    `${A.x * quality + C.x * (1 - quality)},${A.y * quality + C.y * (1 - quality)}`,
  ].join(" ");

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      {/* outer triangle */}
      <polygon points={triPts} fill="var(--color-surface-2)" stroke="var(--color-border)" strokeWidth={1.5} />
      {/* filled area */}
      <polygon data-tradeoff points={triPts} fill="var(--color-neuron)" fillOpacity={0.08} stroke="none" />
      {/* score polygon */}
      <polygon
        points={`${A.x},${A.y + (botY - topY) * (1 - quality)} ${B.x + (cx - botL) * (1 - speed)},${botY - (botY - topY) * speed * 0.5} ${C.x - (botR - cx) * (1 - cost)},${botY - (botY - topY) * cost * 0.5}`}
        fill="var(--color-neuron)"
        fillOpacity={0.3}
        stroke="var(--color-neuron)"
        strokeWidth={1.5}
      />
      {/* labels */}
      <text x={A.x} y={A.y - 6} textAnchor="middle" fill="var(--color-accuracy)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600">Quality</text>
      <text x={B.x - 4} y={B.y + 14} textAnchor="middle" fill="var(--color-data)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600">Speed</text>
      <text x={C.x + 4} y={C.y + 14} textAnchor="middle" fill="var(--color-loss)" fontSize="11" fontFamily="var(--font-body)" fontWeight="600">Cost</text>
    </svg>
  );
}

// ── 19. ScalingLawChart ───────────────────────────────────────────────────────

interface ScalingPoint { compute: number; loss: number; }

interface ScalingLawChartProps extends React.SVGAttributes<SVGSVGElement> {
  points: ScalingPoint[];
  width?: number;
  height?: number;
  "aria-label"?: string;
}

export function ScalingLawChart({ points, width: w = 260, height: h = 180, className, "aria-label": al = "ScalingLawChart", ...p }: ScalingLawChartProps) {
  const logPoints = points.map(({ compute, loss }) => ({
    x: Math.log10(compute),
    y: loss,
  }));
  const minX = Math.min(...logPoints.map(p => p.x));
  const maxX = Math.max(...logPoints.map(p => p.x));
  const minY = Math.min(...logPoints.map(p => p.y)) * 0.95;
  const maxY = Math.max(...logPoints.map(p => p.y)) * 1.05;
  const pw = w - PAD.l - PAD.r;
  const ph = h - PAD.t - PAD.b;

  const toSVG = (lx: number, y: number) => ({
    svgX: PAD.l + ((lx - minX) / (maxX - minX || 1)) * pw,
    svgY: h - PAD.b - ((y - minY) / (maxY - minY || 1)) * ph,
  });

  const curvePath = logPoints.map(({ x, y }, i) => {
    const { svgX, svgY } = toSVG(x, y);
    return `${i === 0 ? "M" : "L"} ${svgX.toFixed(1)} ${svgY.toFixed(1)}`;
  }).join(" ");

  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} role="img" aria-label={al} className={cn("shrink-0", className)} {...p}>
      <Axes w={w} h={h} xLabel="Compute (log)" yLabel="Loss" />
      <path data-curve d={curvePath} fill="none" stroke="var(--color-neuron)" strokeWidth={2} strokeLinecap="round" />
      {logPoints.map(({ x, y }, i) => {
        const { svgX, svgY } = toSVG(x, y);
        return <circle key={i} data-point cx={svgX} cy={svgY} r={4} fill="var(--color-neuron)" fillOpacity={0.8} />;
      })}
    </svg>
  );
}

// ── 20. PaperHighlight ────────────────────────────────────────────────────────

interface PaperHighlightProps {
  title: string;
  authors: string[];
  year: number;
  venue?: string;
  abstract: string;
  tags?: string[];
  className?: string;
}

export function PaperHighlight({ title, authors, year, venue, abstract, tags, className }: PaperHighlightProps) {
  const truncated = abstract.length > 140 ? abstract.slice(0, 140) + "…" : abstract;
  return (
    <div className={cn("rounded-xl border border-[var(--color-border)] bg-[var(--color-surface-1)] p-4 space-y-2 max-w-md", className)}>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-[var(--color-text-primary)] leading-snug">{title}</h3>
        <span className="text-xs font-mono text-[var(--color-text-muted)] shrink-0">{year}</span>
      </div>
      <div className="text-xs text-[var(--color-text-muted)] font-mono">
        {authors.slice(0, 3).join(", ")}{authors.length > 3 ? " et al." : ""}
        {venue && <span className="ml-2 text-[var(--color-data)]">· {venue}</span>}
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{truncated}</p>
      {tags && tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 pt-1">
          {tags.map(t => (
            <span key={t} className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-[var(--color-surface-3)] text-[var(--color-text-muted)] border border-[var(--color-border)]">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}
