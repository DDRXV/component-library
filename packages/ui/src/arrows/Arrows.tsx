import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { cn } from "@/utils/cn";
import { GSAP_DURATIONS, GSAP_EASINGS } from "@/tokens/tokens";
import { resolveColor, useReducedMotion } from "./arrow-utils";

// ── Shared primitives ─────────────────────────────────────────────────────────

interface MarkerProps {
  id: string;
  color: string;
  orient?: string;
}

function ArrowMarker({ id, color, orient = "auto" }: MarkerProps) {
  return (
    <marker
      id={id}
      markerWidth="8"
      markerHeight="6"
      refX="7"
      refY="3"
      orient={orient}
      markerUnits="strokeWidth"
    >
      <path d="M0,0 L0,6 L8,3 z" fill={color} />
    </marker>
  );
}

function mkId(name: string) {
  return `${name}-${Math.random().toString(36).slice(2, 6)}`;
}

interface BaseArrowProps extends React.SVGAttributes<SVGSVGElement> {
  color?: string;
  strokeWidth?: number;
  "aria-label"?: string;
}

// ── 1. StraightArrow ──────────────────────────────────────────────────────────

interface StraightArrowProps extends BaseArrowProps {
  direction?: "right" | "left" | "up" | "down";
  length?: number;
}

export function StraightArrow({
  direction = "right",
  length = 120,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "StraightArrow",
  ...props
}: StraightArrowProps) {
  const id = mkId("sa");
  const c = resolveColor(color);
  const isHorizontal = direction === "right" || direction === "left";
  const w = isHorizontal ? length + 16 : 40;
  const h = isHorizontal ? 40 : length + 16;

  const x1 = direction === "right" ? 8 : direction === "left" ? w - 8 : w / 2;
  const y1 = direction === "down" ? 8 : direction === "up" ? h - 8 : h / 2;
  const x2 = direction === "right" ? w - 8 : direction === "left" ? 8 : w / 2;
  const y2 = direction === "down" ? h - 8 : direction === "up" ? 8 : h / 2;

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
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={c}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 2. CurvedArrow ────────────────────────────────────────────────────────────

interface CurvedArrowProps extends BaseArrowProps {
  curvature?: number;
  width?: number;
  height?: number;
}

export function CurvedArrow({
  curvature = 60,
  width = 160,
  height = 80,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "CurvedArrow",
  ...props
}: CurvedArrowProps) {
  const id = mkId("ca");
  const c = resolveColor(color);
  const d = `M 16 ${height / 2} Q ${width / 2} ${height / 2 - curvature} ${width - 16} ${height / 2}`;

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <path data-arrow="curve" d={d} fill="none" stroke={c} strokeWidth={strokeWidth} markerEnd={`url(#${id})`} />
    </svg>
  );
}

// ── 3. BidirectionalArrow ─────────────────────────────────────────────────────

export function BidirectionalArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "BidirectionalArrow",
  ...props
}: BaseArrowProps) {
  const idEnd = mkId("bda-e");
  const idStart = mkId("bda-s");
  const c = resolveColor(color);

  return (
    <svg
      width={136}
      height={40}
      viewBox="0 0 136 40"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={idEnd} color={c} orient="auto" />
        <ArrowMarker id={idStart} color={c} orient="auto-start-reverse" />
      </defs>
      <line
        x1={16}
        y1={20}
        x2={120}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${idEnd})`}
        markerStart={`url(#${idStart})`}
      />
    </svg>
  );
}

// ── 4. DashedArrow ────────────────────────────────────────────────────────────

interface DashedArrowProps extends BaseArrowProps {
  dashArray?: string;
}

export function DashedArrow({
  dashArray = "6 4",
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "DashedArrow",
  ...props
}: DashedArrowProps) {
  const id = mkId("da");
  const c = resolveColor(color);

  return (
    <svg
      width={136}
      height={40}
      viewBox="0 0 136 40"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        x1={8}
        y1={20}
        x2={120}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeDasharray={dashArray}
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 5. LabeledArrow ───────────────────────────────────────────────────────────

interface LabeledArrowProps extends BaseArrowProps {
  label?: string;
  width?: number;
}

export function LabeledArrow({
  label,
  width = 160,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "LabeledArrow",
  ...props
}: LabeledArrowProps) {
  const id = mkId("la");
  const c = resolveColor(color);

  return (
    <svg
      width={width}
      height={52}
      viewBox={`0 0 ${width} 52`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        x1={8}
        y1={32}
        x2={width - 8}
        y2={32}
        stroke={c}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${id})`}
      />
      {label && (
        <text
          x={width / 2}
          y={18}
          textAnchor="middle"
          fill={c}
          fontSize="11"
          fontFamily="var(--font-mono)"
        >
          {label}
        </text>
      )}
    </svg>
  );
}

// ── 6. ElbowArrow ─────────────────────────────────────────────────────────────

export function ElbowArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "ElbowArrow",
  ...props
}: BaseArrowProps) {
  const id = mkId("ea");
  const c = resolveColor(color);

  return (
    <svg
      width={100}
      height={80}
      viewBox="0 0 100 80"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <path
        d="M 16 16 L 16 64 L 84 64"
        fill="none"
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinejoin="round"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 7. GradientArrow ──────────────────────────────────────────────────────────

interface GradientArrowProps extends BaseArrowProps {
  fromColor?: string;
  toColor?: string;
  width?: number;
}

export function GradientArrow({
  fromColor = "data",
  toColor = "neuron",
  width = 160,
  strokeWidth = 2.5,
  className,
  "aria-label": ariaLabel = "GradientArrow",
  ...props
}: GradientArrowProps) {
  const gradId = mkId("grad");
  const markId = mkId("gam");
  const from = resolveColor(fromColor);
  const to = resolveColor(toColor);

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={from} />
          <stop offset="100%" stopColor={to} />
        </linearGradient>
        <ArrowMarker id={markId} color={to} />
      </defs>
      <line
        x1={8}
        y1={20}
        x2={width - 8}
        y2={20}
        stroke={`url(#${gradId})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${markId})`}
      />
    </svg>
  );
}

// ── 8. AnimatedFlowArrow ──────────────────────────────────────────────────────

interface AnimatedFlowArrowProps extends BaseArrowProps {
  animated?: boolean;
  width?: number;
}

export function AnimatedFlowArrow({
  animated = true,
  width = 160,
  color = "data",
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel = "AnimatedFlowArrow",
  ...props
}: AnimatedFlowArrowProps) {
  const pathRef = useRef<SVGLineElement>(null);
  const reducedMotion = useReducedMotion();
  const c = resolveColor(color);

  useEffect(() => {
    if (!animated || reducedMotion || !pathRef.current) return;
    const el = pathRef.current;
    gsap.set(el, { strokeDasharray: "20 10", strokeDashoffset: 0 });
    gsap.to(el, {
      strokeDashoffset: -30,
      duration: GSAP_DURATIONS.flow,
      ease: "none",
      repeat: -1,
    });
    return () => { gsap.killTweensOf(el); };
  }, [animated, reducedMotion]);

  const id = mkId("afa");

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        ref={pathRef}
        x1={8}
        y1={20}
        x2={width - 8}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 9. DataFlowPipe ───────────────────────────────────────────────────────────

interface DataFlowPipeProps extends BaseArrowProps {
  width?: number;
}

export function DataFlowPipe({
  width = 200,
  color = "data",
  strokeWidth = 10,
  className,
  "aria-label": ariaLabel = "DataFlowPipe",
  ...props
}: DataFlowPipeProps) {
  const pipeRef = useRef<SVGRectElement>(null);
  const flowRef = useRef<SVGRectElement>(null);
  const reducedMotion = useReducedMotion();
  const c = resolveColor(color);

  useEffect(() => {
    if (reducedMotion || !flowRef.current) return;
    gsap.to(flowRef.current, {
      x: width,
      duration: GSAP_DURATIONS.flow,
      ease: "none",
      repeat: -1,
    });
    return () => { gsap.killTweensOf(flowRef.current); };
  }, [reducedMotion, width]);

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      overflow="hidden"
      {...props}
    >
      {/* pipe background */}
      <rect
        ref={pipeRef}
        x={8}
        y={20 - strokeWidth / 2}
        width={width - 16}
        height={strokeWidth}
        rx={strokeWidth / 2}
        fill={c}
        opacity={0.2}
      />
      {/* flowing highlight */}
      <rect
        ref={flowRef}
        x={-60}
        y={20 - strokeWidth / 2}
        width={40}
        height={strokeWidth}
        rx={strokeWidth / 2}
        fill={c}
        opacity={0.8}
      />
    </svg>
  );
}

// ── 10. GradientFlowArrow ─────────────────────────────────────────────────────

export function GradientFlowArrow({
  width = 160,
  color = "gradient",
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel = "GradientFlowArrow",
  ...props
}: AnimatedFlowArrowProps) {
  const pathRef = useRef<SVGLineElement>(null);
  const reducedMotion = useReducedMotion();
  const c = resolveColor(color);

  useEffect(() => {
    if (reducedMotion || !pathRef.current) return;
    const el = pathRef.current;
    gsap.set(el, { strokeDasharray: "20 10", strokeDashoffset: 0 });
    gsap.to(el, {
      strokeDashoffset: 30, // positive = backward flow
      duration: GSAP_DURATIONS.flow,
      ease: "none",
      repeat: -1,
    });
    return () => { gsap.killTweensOf(el); };
  }, [reducedMotion]);

  const id = mkId("gfa");

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} orient="auto-start-reverse" />
      </defs>
      <line
        ref={pathRef}
        x1={width - 8}
        y1={20}
        x2={8}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 11. TwoPhaseArrow ─────────────────────────────────────────────────────────

interface TwoPhaseArrowProps extends BaseArrowProps {
  forwardLabel?: string;
  backwardLabel?: string;
  width?: number;
}

export function TwoPhaseArrow({
  forwardLabel,
  backwardLabel,
  width = 160,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "TwoPhaseArrow",
  ...props
}: TwoPhaseArrowProps) {
  const fwdId = mkId("tpa-f");
  const bwdId = mkId("tpa-b");
  const fwdColor = resolveColor(color ?? "data");
  const bwdColor = resolveColor(color ?? "gradient");

  return (
    <svg
      width={width}
      height={60}
      viewBox={`0 0 ${width} 60`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={fwdId} color={fwdColor} />
        <ArrowMarker id={bwdId} color={bwdColor} orient="auto-start-reverse" />
      </defs>
      {/* forward */}
      <line x1={8} y1={20} x2={width - 8} y2={20} stroke={fwdColor} strokeWidth={strokeWidth} markerEnd={`url(#${fwdId})`} />
      {forwardLabel && (
        <text x={width / 2} y={14} textAnchor="middle" fill={fwdColor} fontSize="10" fontFamily="var(--font-mono)">{forwardLabel}</text>
      )}
      {/* backward */}
      <line x1={width - 8} y1={40} x2={8} y2={40} stroke={bwdColor} strokeWidth={strokeWidth} strokeDasharray="5 3" markerEnd={`url(#${bwdId})`} />
      {backwardLabel && (
        <text x={width / 2} y={54} textAnchor="middle" fill={bwdColor} fontSize="10" fontFamily="var(--font-mono)">{backwardLabel}</text>
      )}
    </svg>
  );
}

// ── 12. WeightedArrow ─────────────────────────────────────────────────────────

interface WeightedArrowProps extends BaseArrowProps {
  weight?: number; // 0–1
  width?: number;
}

export function WeightedArrow({
  weight = 0.5,
  width = 160,
  color,
  className,
  "aria-label": ariaLabel = "WeightedArrow",
  ...props
}: WeightedArrowProps) {
  const id = mkId("wa");
  const c = resolveColor(color ?? "weight");
  const sw = 0.5 + weight * 5;

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        data-arrow="weighted"
        x1={8}
        y1={20}
        x2={width - 8}
        y2={20}
        stroke={c}
        strokeWidth={sw}
        strokeLinecap="round"
        opacity={0.4 + weight * 0.6}
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 13. ProbabilityArrow ──────────────────────────────────────────────────────

interface ProbabilityArrowProps extends BaseArrowProps {
  probability?: number; // 0–1
  width?: number;
}

export function ProbabilityArrow({
  probability = 0.5,
  width = 160,
  color,
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel = "ProbabilityArrow",
  ...props
}: ProbabilityArrowProps) {
  const id = mkId("pa");
  const c = resolveColor(color ?? "inference");

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      style={{ opacity: probability }}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line
        x1={8}
        y1={20}
        x2={width - 8}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 14. AnnotationLine ────────────────────────────────────────────────────────

interface AnnotationLineProps extends BaseArrowProps {
  x1?: number;
  y1?: number;
  x2?: number;
  y2?: number;
  width?: number;
  height?: number;
}

export function AnnotationLine({
  x1 = 10,
  y1 = 40,
  x2 = 90,
  y2 = 10,
  width = 100,
  height = 50,
  color,
  strokeWidth = 1,
  className,
  "aria-label": ariaLabel = "AnnotationLine",
  ...props
}: AnnotationLineProps) {
  const c = resolveColor(color ?? "text-secondary");

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <line
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeDasharray="3 3"
        strokeLinecap="round"
      />
      <circle cx={x1} cy={y1} r={2} fill={c} />
    </svg>
  );
}

// ── 15. TimelineArrow ─────────────────────────────────────────────────────────

interface TimelineArrowProps extends BaseArrowProps {
  progress?: number; // 0–1
  width?: number;
}

export function TimelineArrow({
  progress = 0.5,
  width = 200,
  color,
  strokeWidth = 3,
  className,
  "aria-label": ariaLabel = "TimelineArrow",
  ...props
}: TimelineArrowProps) {
  const id = mkId("ta");
  const c = resolveColor(color ?? "accuracy");
  const trackColor = "var(--color-surface-3)";
  const fillWidth = (width - 16) * Math.min(1, Math.max(0, progress));

  return (
    <svg
      width={width}
      height={40}
      viewBox={`0 0 ${width} 40`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      {/* track */}
      <line x1={8} y1={20} x2={width - 8} y2={20} stroke={trackColor} strokeWidth={strokeWidth} strokeLinecap="round" />
      {/* fill */}
      <line
        x1={8}
        y1={20}
        x2={8 + fillWidth}
        y2={20}
        stroke={c}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        markerEnd={`url(#${id})`}
        data-fill
      />
    </svg>
  );
}

// ── 16. ResidualArrow ─────────────────────────────────────────────────────────

export function ResidualArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "ResidualArrow",
  ...props
}: BaseArrowProps) {
  const id = mkId("ra");
  const c = resolveColor(color ?? "neuron");

  return (
    <svg
      width={80}
      height={120}
      viewBox="0 0 80 120"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      {/* main path down */}
      <line x1={40} y1={8} x2={40} y2={112} stroke={c} strokeWidth={strokeWidth} />
      {/* bypass arc */}
      <path
        data-arrow="bypass"
        d="M 40 24 A 30 30 0 0 1 40 96"
        fill="none"
        stroke={c}
        strokeWidth={strokeWidth}
        strokeDasharray="4 3"
      />
      {/* add node */}
      <circle cx={40} cy={96} r={8} fill="var(--color-surface-2)" stroke={c} strokeWidth={strokeWidth} />
      <text x={40} y={100} textAnchor="middle" fill={c} fontSize="10">+</text>
      <line x1={40} y1={96} x2={40} y2={112} stroke={c} strokeWidth={strokeWidth} markerEnd={`url(#${id})`} />
    </svg>
  );
}

// ── 17. MatrixConnector ───────────────────────────────────────────────────────

interface MatrixConnectorProps extends BaseArrowProps {
  sources?: number;
  targets?: number;
  width?: number;
  height?: number;
}

export function MatrixConnector({
  sources = 4,
  targets = 4,
  width = 160,
  height = 120,
  color,
  strokeWidth = 0.8,
  className,
  "aria-label": ariaLabel = "MatrixConnector",
  ...props
}: MatrixConnectorProps) {
  const c = resolveColor(color ?? "attention");
  const pad = 16;
  const srcSpacing = (height - pad * 2) / (sources - 1 || 1);
  const tgtSpacing = (height - pad * 2) / (targets - 1 || 1);

  const lines: React.ReactNode[] = [];
  for (let s = 0; s < sources; s++) {
    for (let t = 0; t < targets; t++) {
      const opacity = 0.15 + Math.random() * 0.6;
      lines.push(
        <line
          key={`${s}-${t}`}
          x1={pad}
          y1={pad + s * srcSpacing}
          x2={width - pad}
          y2={pad + t * tgtSpacing}
          stroke={c}
          strokeWidth={strokeWidth}
          opacity={opacity}
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {lines}
      {Array.from({ length: sources }, (_, i) => (
        <circle key={`s${i}`} cx={pad} cy={pad + i * srcSpacing} r={3} fill={c} />
      ))}
      {Array.from({ length: targets }, (_, i) => (
        <circle key={`t${i}`} cx={width - pad} cy={pad + i * tgtSpacing} r={3} fill={c} />
      ))}
    </svg>
  );
}

// ── 18. TreeConnector ─────────────────────────────────────────────────────────

interface TreeConnectorProps extends BaseArrowProps {
  children?: number;
  width?: number;
  height?: number;
}

export function TreeConnector({
  children: childCount = 3,
  width = 200,
  height = 80,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "TreeConnector",
  ...props
}: TreeConnectorProps) {
  const id = mkId("tc");
  const c = resolveColor(color ?? "data");
  const pad = 16;
  const spacing = (width - pad * 2) / (childCount - 1 || 1);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      {/* parent node */}
      <circle cx={width / 2} cy={12} r={6} fill={c} />
      {Array.from({ length: childCount }, (_, i) => {
        const cx = pad + i * spacing;
        return (
          <path
            key={i}
            d={`M ${width / 2} 18 L ${cx} ${height - 12}`}
            fill="none"
            stroke={c}
            strokeWidth={strokeWidth}
            markerEnd={`url(#${id})`}
          />
        );
      })}
      {Array.from({ length: childCount }, (_, i) => (
        <circle key={`c${i}`} cx={pad + i * spacing} cy={height - 8} r={5} fill="var(--color-surface-2)" stroke={c} strokeWidth={1} />
      ))}
    </svg>
  );
}

// ── 19. BracketConnector ──────────────────────────────────────────────────────

interface BracketConnectorProps extends BaseArrowProps {
  side?: "left" | "right";
  height?: number;
}

export function BracketConnector({
  side = "left",
  height = 80,
  color,
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel = "BracketConnector",
  ...props
}: BracketConnectorProps) {
  const c = resolveColor(color ?? "embedding");
  const w = 30;
  const d =
    side === "left"
      ? `M 22 8 Q 8 8 8 ${height / 2} Q 8 ${height - 8} 22 ${height - 8}`
      : `M 8 8 Q 22 8 22 ${height / 2} Q 22 ${height - 8} 8 ${height - 8}`;

  return (
    <svg
      width={w}
      height={height}
      viewBox={`0 0 ${w} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <path d={d} fill="none" stroke={c} strokeWidth={strokeWidth} strokeLinecap="round" />
    </svg>
  );
}

// ── 20. FeedbackArrow ─────────────────────────────────────────────────────────

export function FeedbackArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "FeedbackArrow",
  ...props
}: BaseArrowProps) {
  const id = mkId("fa");
  const c = resolveColor(color ?? "loss");

  return (
    <svg
      width={160}
      height={60}
      viewBox="0 0 160 60"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <path
        data-arrow="loop"
        d="M 16 30 L 16 50 Q 16 55 22 55 L 138 55 Q 144 55 144 50 L 144 30"
        fill="none"
        stroke={c}
        strokeWidth={strokeWidth}
        strokeDasharray="5 3"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 21. SelfAttentionArc ──────────────────────────────────────────────────────

interface SelfAttentionArcProps extends BaseArrowProps {
  tokens?: number;
  width?: number;
  height?: number;
}

export function SelfAttentionArc({
  tokens = 5,
  width = 200,
  height = 80,
  color,
  strokeWidth = 1,
  className,
  "aria-label": ariaLabel = "SelfAttentionArc",
  ...props
}: SelfAttentionArcProps) {
  const c = resolveColor(color ?? "attention");
  const pad = 20;
  const spacing = (width - pad * 2) / (tokens - 1 || 1);

  const arcs: React.ReactNode[] = [];
  for (let i = 0; i < tokens - 1; i++) {
    for (let j = i + 1; j < tokens; j++) {
      const x1 = pad + i * spacing;
      const x2 = pad + j * spacing;
      const midX = (x1 + x2) / 2;
      const span = x2 - x1;
      const cy = height - 16 - span * 0.4;
      arcs.push(
        <path
          key={`${i}-${j}`}
          d={`M ${x1} ${height - 16} Q ${midX} ${cy} ${x2} ${height - 16}`}
          fill="none"
          stroke={c}
          strokeWidth={strokeWidth}
          opacity={0.3 + 0.4 / (j - i)}
        />
      );
    }
  }

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {arcs}
      {Array.from({ length: tokens }, (_, i) => (
        <rect key={i} x={pad + i * spacing - 8} y={height - 16} width={16} height={10} rx={2} fill={c} opacity={0.5} />
      ))}
    </svg>
  );
}

// ── 22. CrossAttentionArc ─────────────────────────────────────────────────────

interface CrossAttentionArcProps extends BaseArrowProps {
  encoderTokens?: number;
  decoderTokens?: number;
  width?: number;
  height?: number;
}

export function CrossAttentionArc({
  encoderTokens = 4,
  decoderTokens = 3,
  width = 200,
  height = 80,
  color,
  strokeWidth = 1,
  className,
  "aria-label": ariaLabel = "CrossAttentionArc",
  ...props
}: CrossAttentionArcProps) {
  const c = resolveColor(color ?? "attention");
  const pad = 20;
  const encSpacing = (width - pad * 2) / (encoderTokens - 1 || 1);
  const decSpacing = (width - pad * 2) / (decoderTokens - 1 || 1);

  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      {/* sample arcs from each decoder token to each encoder token */}
      {Array.from({ length: decoderTokens }, (_, d) =>
        Array.from({ length: encoderTokens }, (_, e) => (
          <path
            key={`${d}-${e}`}
            d={`M ${pad + d * decSpacing} ${height - 12} Q ${(pad + d * decSpacing + pad + e * encSpacing) / 2} ${height / 2} ${pad + e * encSpacing} 12`}
            fill="none"
            stroke={c}
            strokeWidth={strokeWidth}
            opacity={0.15 + Math.random() * 0.4}
          />
        ))
      )}
      {/* encoder row */}
      {Array.from({ length: encoderTokens }, (_, i) => (
        <rect key={`e${i}`} x={pad + i * encSpacing - 7} y={4} width={14} height={8} rx={1} fill={c} opacity={0.4} />
      ))}
      {/* decoder row */}
      {Array.from({ length: decoderTokens }, (_, i) => (
        <rect key={`d${i}`} x={pad + i * decSpacing - 7} y={height - 12} width={14} height={8} rx={1} fill={c} opacity={0.7} />
      ))}
    </svg>
  );
}

// ── 23. MemoryReadArrow ───────────────────────────────────────────────────────

export function MemoryReadArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "MemoryReadArrow",
  ...props
}: BaseArrowProps) {
  const id = mkId("mra");
  const c = resolveColor(color ?? "agent");

  return (
    <svg
      width={120}
      height={60}
      viewBox="0 0 120 60"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <path
        d="M 16 16 Q 16 44 60 44 Q 104 44 104 16"
        fill="none"
        stroke={c}
        strokeWidth={strokeWidth}
        strokeDasharray="5 3"
        markerEnd={`url(#${id})`}
      />
    </svg>
  );
}

// ── 24. ToolCallArrow ─────────────────────────────────────────────────────────

interface SemanticArrowProps extends BaseArrowProps {
  label?: string;
  width?: number;
}

export function ToolCallArrow({
  label = "call",
  width = 160,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "ToolCallArrow",
  ...props
}: SemanticArrowProps) {
  const id = mkId("tca");
  const c = resolveColor(color ?? "agent");

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line x1={8} y1={30} x2={width - 8} y2={30} stroke={c} strokeWidth={strokeWidth} markerEnd={`url(#${id})`} />
      <text x={width / 2} y={18} textAnchor="middle" fill={c} fontSize="10" fontFamily="var(--font-mono)">{label}</text>
    </svg>
  );
}

// ── 25. ToolReturnArrow ───────────────────────────────────────────────────────

export function ToolReturnArrow({
  label = "return",
  width = 160,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "ToolReturnArrow",
  ...props
}: SemanticArrowProps) {
  const id = mkId("tra");
  const c = resolveColor(color ?? "token");

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} orient="auto-start-reverse" />
      </defs>
      <line x1={width - 8} y1={30} x2={8} y2={30} stroke={c} strokeWidth={strokeWidth} strokeDasharray="5 3" markerEnd={`url(#${id})`} />
      <text x={width / 2} y={18} textAnchor="middle" fill={c} fontSize="10" fontFamily="var(--font-mono)">{label}</text>
    </svg>
  );
}

// ── 26. ChainArrow ────────────────────────────────────────────────────────────

export function ChainArrow({
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "ChainArrow",
  ...props
}: BaseArrowProps) {
  const id = mkId("cha");
  const c = resolveColor(color ?? "inference");

  return (
    <svg
      width={136}
      height={40}
      viewBox="0 0 136 40"
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line x1={8} y1={20} x2={120} y2={20} stroke={c} strokeWidth={strokeWidth} markerEnd={`url(#${id})`} />
      {/* chain links */}
      <ellipse cx={44} cy={20} rx={8} ry={5} fill="none" stroke={c} strokeWidth={1} />
      <ellipse cx={68} cy={20} rx={8} ry={5} fill="none" stroke={c} strokeWidth={1} />
      <ellipse cx={92} cy={20} rx={8} ry={5} fill="none" stroke={c} strokeWidth={1} />
    </svg>
  );
}

// ── 27. RAGRetrievalArrow ─────────────────────────────────────────────────────

export function RAGRetrievalArrow({
  label = "retrieve",
  width = 160,
  color,
  strokeWidth = 1.5,
  className,
  "aria-label": ariaLabel = "RAGRetrievalArrow",
  ...props
}: SemanticArrowProps) {
  const id = mkId("rra");
  const c = resolveColor(color ?? "embedding");

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line x1={8} y1={30} x2={width - 8} y2={30} stroke={c} strokeWidth={strokeWidth} strokeDasharray="8 3" markerEnd={`url(#${id})`} />
      <text x={width / 2} y={18} textAnchor="middle" fill={c} fontSize="10" fontFamily="var(--font-mono)">{label}</text>
    </svg>
  );
}

// ── 28. RAGAugmentArrow ───────────────────────────────────────────────────────

export function RAGAugmentArrow({
  label = "augment",
  width = 160,
  color,
  strokeWidth = 2,
  className,
  "aria-label": ariaLabel = "RAGAugmentArrow",
  ...props
}: SemanticArrowProps) {
  const id = mkId("raa");
  const c = resolveColor(color ?? "data");

  return (
    <svg
      width={width}
      height={48}
      viewBox={`0 0 ${width} 48`}
      role="img"
      aria-label={ariaLabel}
      className={cn("shrink-0", className)}
      {...props}
    >
      <defs>
        <ArrowMarker id={id} color={c} />
      </defs>
      <line x1={8} y1={30} x2={width - 8} y2={30} stroke={c} strokeWidth={strokeWidth} markerEnd={`url(#${id})`} />
      <text x={width / 2} y={18} textAnchor="middle" fill={c} fontSize="10" fontFamily="var(--font-mono)">{label}</text>
    </svg>
  );
}
