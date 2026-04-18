import React from "react";
import { cn } from "@/utils/cn";
import type { ColorName } from "@/tokens/tokens";

type HeadingTag = "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

interface DisplayHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag;
  children: React.ReactNode;
}

export function DisplayHeading({ as: Tag = "h1", className, children, ...props }: DisplayHeadingProps) {
  return (
    <Tag
      className={cn(
        "font-display font-bold tracking-tight text-[var(--color-text-primary)]",
        "text-5xl leading-tight",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface SectionHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  icon?: React.ReactNode;
  children: React.ReactNode;
}

export function SectionHeading({ icon, className, children, ...props }: SectionHeadingProps) {
  return (
    <h2
      className={cn(
        "flex items-center gap-2 font-display font-semibold tracking-tight",
        "text-2xl text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </h2>
  );
}

interface SubHeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
}

export function SubHeading({ className, children, ...props }: SubHeadingProps) {
  return (
    <h3
      className={cn(
        "font-display font-semibold text-xl text-[var(--color-text-primary)]",
        className
      )}
      {...props}
    >
      {children}
    </h3>
  );
}

type BodyVariant = "default" | "muted" | "secondary";

interface BodyTextProps extends React.HTMLAttributes<HTMLParagraphElement> {
  variant?: BodyVariant;
  as?: "p" | "span" | "div";
  children: React.ReactNode;
}

export function BodyText({ variant = "default", as: Tag = "p", className, children, ...props }: BodyTextProps) {
  return (
    <Tag
      className={cn(
        "font-body text-base leading-relaxed",
        variant === "default" && "text-[var(--color-text-primary)]",
        variant === "secondary" && "text-[var(--color-text-secondary)]",
        variant === "muted" && "text-[var(--color-text-muted)]",
        className
      )}
      {...props}
    >
      {children}
    </Tag>
  );
}

interface CaptionTextProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function CaptionText({ className, children, ...props }: CaptionTextProps) {
  return (
    <figcaption
      className={cn(
        "text-sm text-[var(--color-text-muted)] leading-snug",
        className
      )}
      {...props}
    >
      {children}
    </figcaption>
  );
}

interface CodeInlineProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
}

export function CodeInline({ className, children, ...props }: CodeInlineProps) {
  return (
    <code
      className={cn(
        "font-mono text-sm px-1.5 py-0.5 rounded",
        "bg-[var(--color-surface-2)] text-[var(--color-text-code)]",
        "border border-[var(--color-border)]",
        className
      )}
      {...props}
    >
      {children}
    </code>
  );
}

interface LabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Label({ className, children, ...props }: LabelProps) {
  return (
    <span
      className={cn(
        "text-xs font-semibold uppercase tracking-widest text-[var(--color-text-secondary)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

type BadgeVariant = "default" | "neuron" | "data" | "attention" | "loss" | "accuracy" | "agent" | "token";

const badgeVariantStyles: Record<BadgeVariant, string> = {
  default: "bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)]",
  neuron: "bg-purple-950/50 text-purple-300 border-purple-800/50",
  data: "bg-sky-950/50 text-sky-300 border-sky-800/50",
  attention: "bg-pink-950/50 text-pink-300 border-pink-800/50",
  loss: "bg-red-950/50 text-red-300 border-red-800/50",
  accuracy: "bg-green-950/50 text-green-300 border-green-800/50",
  agent: "bg-emerald-950/50 text-emerald-300 border-emerald-800/50",
  token: "bg-orange-950/50 text-orange-300 border-orange-800/50",
};

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
  children: React.ReactNode;
}

export function Badge({ variant = "default", className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium border",
        badgeVariantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface TagProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function Tag({ className, children, ...props }: TagProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium",
        "bg-[var(--color-surface-3)] text-[var(--color-text-secondary)]",
        "border border-[var(--color-border)]",
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}

interface MonoValueProps extends React.HTMLAttributes<HTMLSpanElement> {
  children: React.ReactNode;
}

export function MonoValue({ className, children, ...props }: MonoValueProps) {
  return (
    <span
      className={cn("font-mono tabular-nums text-[var(--color-text-primary)]", className)}
      {...props}
    >
      {children}
    </span>
  );
}

interface UnitLabelProps extends React.HTMLAttributes<HTMLSpanElement> {
  value: string;
  unit: string;
}

export function UnitLabel({ value, unit, className, ...props }: UnitLabelProps) {
  return (
    <span className={cn("inline-flex items-baseline gap-1", className)} {...props}>
      <MonoValue className="text-[var(--color-text-primary)]">{value}</MonoValue>
      <span className="text-xs text-[var(--color-text-muted)]">{unit}</span>
    </span>
  );
}

type GradientFrom = ColorName;
type GradientTo = ColorName;

interface GradientTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  from?: GradientFrom;
  to?: GradientTo;
  children: React.ReactNode;
}

export function GradientText({ from = "neuron", to = "attention", className, children, ...props }: GradientTextProps) {
  return (
    <span
      className={cn("bg-clip-text text-transparent bg-gradient-to-r inline-block", className)}
      style={{
        backgroundImage: `linear-gradient(to right, var(--color-${from}), var(--color-${to}))`,
      }}
      {...props}
    >
      {children}
    </span>
  );
}
