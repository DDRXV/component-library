import React, { useState } from "react";
import { cn } from "@/utils/cn";
import { resolveColor } from "@/arrows/arrow-utils";

// ── 1. KeyTakeaway ────────────────────────────────────────────────────────────

type TakeawayVariant = "default" | "success" | "warning" | "info";

const TAKEAWAY_STYLES: Record<TakeawayVariant, { border: string; bg: string; text: string; label: string }> = {
  default: { border: "border-[var(--color-neuron)]/30",  bg: "bg-[var(--color-neuron)]/8",  text: "text-[var(--color-neuron)]",  label: "Key Takeaway" },
  success: { border: "border-[var(--color-accuracy)]/30", bg: "bg-[var(--color-accuracy)]/8", text: "text-[var(--color-accuracy)]", label: "Key Takeaway" },
  warning: { border: "border-[var(--color-warning)]/30",  bg: "bg-[var(--color-warning)]/8",  text: "text-[var(--color-warning)]",  label: "Key Takeaway" },
  info:    { border: "border-[var(--color-data)]/30",     bg: "bg-[var(--color-data)]/8",     text: "text-[var(--color-data)]",     label: "Key Takeaway" },
};

interface KeyTakeawayProps { variant?: TakeawayVariant; children: React.ReactNode; className?: string; }

export function KeyTakeaway({ variant = "default", children, className }: KeyTakeawayProps) {
  const s = TAKEAWAY_STYLES[variant];
  return (
    <div className={cn("rounded-xl border p-4", s.border, s.bg, className)}>
      <div className={cn("flex items-center gap-2 mb-2 text-[10px] font-mono font-semibold uppercase tracking-widest", s.text)}>
        <span>★</span><span>Key Takeaway</span>
      </div>
      <p className="text-sm text-[var(--color-text-primary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 2. DefinitionCard ─────────────────────────────────────────────────────────

interface DefinitionCardProps { term: string; definition: string; example?: string; className?: string; }

export function DefinitionCard({ term, definition, example, className }: DefinitionCardProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-1)] p-3 space-y-2", className)}>
      <div className="flex items-baseline gap-2">
        <span className="font-mono font-bold text-[var(--color-embedding)] text-sm">{term}</span>
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">definition</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{definition}</p>
      {example && (
        <p className="text-xs font-mono text-[var(--color-text-muted)] italic border-l-2 border-[var(--color-border)] pl-2">{example}</p>
      )}
    </div>
  );
}

// ── 3. WarnBox ────────────────────────────────────────────────────────────────

interface CalloutBoxProps { label?: string; children: React.ReactNode; className?: string; }

export function WarnBox({ label = "Pitfall", children, className }: CalloutBoxProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-loss)]/30 bg-[var(--color-loss)]/6 p-3", className)}>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-loss)]">
        <span>⚠</span><span>{label}</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 4. TipBox ─────────────────────────────────────────────────────────────────

export function TipBox({ label = "Pro Tip", children, className }: CalloutBoxProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-accuracy)]/30 bg-[var(--color-accuracy)]/6 p-3", className)}>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-accuracy)]">
        <span>💡</span><span>{label}</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 5. NoteBox ────────────────────────────────────────────────────────────────

export function NoteBox({ label = "Note", children, className }: CalloutBoxProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-data)]/30 bg-[var(--color-data)]/6 p-3", className)}>
      <div className="flex items-center gap-1.5 mb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-data)]">
        <span>ℹ</span><span>{label}</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 6. QuoteBlock ─────────────────────────────────────────────────────────────

interface QuoteBlockProps { citation?: string; children: React.ReactNode; className?: string; }

export function QuoteBlock({ citation, children, className }: QuoteBlockProps) {
  return (
    <figure className={cn("border-l-4 border-[var(--color-neuron)] pl-4 py-1 space-y-2", className)}>
      <blockquote className="text-sm italic text-[var(--color-text-secondary)] leading-relaxed">
        &ldquo;{children}&rdquo;
      </blockquote>
      {citation && (
        <figcaption className="text-xs font-mono text-[var(--color-text-muted)]">— {citation}</figcaption>
      )}
    </figure>
  );
}

// ── 7. AnalogyCard ────────────────────────────────────────────────────────────

interface AnalogyCardProps { concept: string; analogy: string; className?: string; }

export function AnalogyCard({ concept, analogy, className }: AnalogyCardProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-token)]/30 bg-[var(--color-token)]/6 p-4", className)}>
      <div className="text-[10px] font-mono uppercase tracking-widest text-[var(--color-token)] mb-3">Analogy</div>
      <div className="flex items-center gap-3 flex-wrap">
        <span className="font-mono font-bold text-[var(--color-text-primary)] text-sm px-2 py-1 rounded bg-[var(--color-surface-2)] border border-[var(--color-border)]">{concept}</span>
        <span className="text-xs text-[var(--color-text-muted)] italic">is like</span>
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed flex-1">{analogy}</p>
      </div>
    </div>
  );
}

// ── 8. CommonMistake ──────────────────────────────────────────────────────────

interface CommonMistakeProps { fix?: string; children: React.ReactNode; className?: string; }

export function CommonMistake({ fix, children, className }: CommonMistakeProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-loss)]/40 bg-[var(--color-surface-1)] overflow-hidden", className)}>
      <div className="px-3 py-2 bg-[var(--color-loss)]/10 border-b border-[var(--color-loss)]/20 flex items-center gap-2">
        <span className="text-[var(--color-loss)]">✗</span>
        <span className="text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-loss)]">Common Mistake</span>
      </div>
      <div className="p-3 space-y-2">
        <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
        {fix && (
          <div className="flex gap-2 pt-1 border-t border-[var(--color-border)]">
            <span className="text-[var(--color-accuracy)] text-xs font-mono font-semibold mt-0.5">Fix:</span>
            <p className="text-xs text-[var(--color-accuracy)] leading-relaxed">{fix}</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ── 9. SourceCitation ─────────────────────────────────────────────────────────

interface SourceCitationProps { title: string; authors?: string; year?: number; url?: string; venue?: string; className?: string; }

export function SourceCitation({ title, authors, year, url, venue, className }: SourceCitationProps) {
  const content = (
    <div className={cn("inline-flex items-start gap-2 px-2.5 py-1.5 rounded border border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs font-mono", className)}>
      <span className="text-[var(--color-text-muted)] shrink-0">[↗]</span>
      <span>
        <span className="text-[var(--color-text-primary)] font-semibold">{title}</span>
        {(authors || year) && (
          <span className="text-[var(--color-text-muted)] ml-1">
            {authors && `· ${authors}`}
            {year && ` · `}<span>{year}</span>
            {venue && ` · ${venue}`}
          </span>
        )}
      </span>
    </div>
  );
  return url ? <a href={url} target="_blank" rel="noopener noreferrer">{content}</a> : content;
}

// ── 10. IntuitiveExplanation ──────────────────────────────────────────────────

interface IntuitiveExplanationProps { label?: string; children: React.ReactNode; className?: string; }

export function IntuitiveExplanation({ label = "In Plain English", children, className }: IntuitiveExplanationProps) {
  return (
    <div className={cn("rounded-xl border border-[var(--color-agent)]/30 bg-[var(--color-agent)]/6 p-4", className)}>
      <div className="flex items-center gap-2 mb-2 text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--color-agent)]">
        <span>💬</span><span>{label}</span>
      </div>
      <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">{children}</p>
    </div>
  );
}

// ── 11. GlossaryTerm ──────────────────────────────────────────────────────────

interface GlossaryTermProps { term: string; definition: string; className?: string; }

export function GlossaryTerm({ term, definition, className }: GlossaryTermProps) {
  return (
    <span className={cn("group relative inline-block", className)}>
      <span className="font-mono text-[var(--color-embedding)] border-b border-dotted border-[var(--color-embedding)] cursor-help">{term}</span>
      <span className="hidden group-hover:block absolute bottom-full left-0 z-10 w-56 p-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-xs text-[var(--color-text-secondary)] shadow-[var(--shadow-card)] leading-relaxed">
        {definition}
      </span>
    </span>
  );
}

// ── 12. DeepDiveLink ──────────────────────────────────────────────────────────

interface DeepDiveLinkProps { title: string; children: React.ReactNode; className?: string; }

export function DeepDiveLink({ title, children, className }: DeepDiveLinkProps) {
  const [open, setOpen] = useState(false);
  return (
    <div className={cn("border border-[var(--color-border)] rounded-lg overflow-hidden", className)}>
      <button
        onClick={() => setOpen(o => !o)}
        className="w-full flex items-center justify-between px-4 py-2.5 bg-[var(--color-surface-2)] text-sm font-mono text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-3)] transition-colors text-left"
      >
        <span className="flex items-center gap-2">
          <span className="text-[var(--color-data)]">▶ Deep Dive</span>
          <span className="text-[var(--color-text-primary)] font-semibold">{title}</span>
        </span>
        <span className={cn("text-[var(--color-text-muted)] transition-transform duration-150", open && "rotate-90")}>›</span>
      </button>
      {open && (
        <div className="px-4 py-3 bg-[var(--color-surface-1)] text-sm text-[var(--color-text-secondary)] leading-relaxed border-t border-[var(--color-border)]">
          {children}
        </div>
      )}
    </div>
  );
}

// ── 13. Callout ───────────────────────────────────────────────────────────────

type CalloutDirection = "up" | "down" | "left" | "right";

interface CalloutProps { direction?: CalloutDirection; color?: string; children: React.ReactNode; className?: string; }

const ARROW_PATHS: Record<CalloutDirection, string> = {
  right: "M 0 8 L 12 8 M 8 4 L 12 8 L 8 12",
  left:  "M 12 8 L 0 8 M 4 4 L 0 8 L 4 12",
  down:  "M 8 0 L 8 12 M 4 8 L 8 12 L 12 8",
  up:    "M 8 12 L 8 0 M 4 4 L 8 0 L 12 4",
};

export function Callout({ direction = "right", color, children, className }: CalloutProps) {
  const c = resolveColor(color ?? "attention");
  return (
    <div className={cn("inline-flex items-center gap-1.5", direction === "up" || direction === "down" ? "flex-col" : "flex-row", className)}>
      {(direction === "left" || direction === "up") && (
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
          <path d={ARROW_PATHS[direction]} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )}
      <div className="px-3 py-2 rounded-lg border text-xs font-mono leading-relaxed" style={{ borderColor: `color-mix(in srgb, ${c} 30%, transparent)`, background: `color-mix(in srgb, ${c} 8%, transparent)`, color: c }}>
        {children}
      </div>
      {(direction === "right" || direction === "down") && (
        <svg width={16} height={16} viewBox="0 0 16 16" aria-hidden>
          <path d={ARROW_PATHS[direction]} fill="none" stroke={c} strokeWidth={1.5} strokeLinecap="round" />
        </svg>
      )}
    </div>
  );
}

// ── 14. FloatingLabel ─────────────────────────────────────────────────────────

interface FloatingLabelProps { showLine?: boolean; color?: string; children: React.ReactNode; className?: string; }

export function FloatingLabel({ showLine, color, children, className }: FloatingLabelProps) {
  const c = resolveColor(color ?? "text-secondary");
  return (
    <div className={cn("inline-flex flex-col items-center gap-0.5", className)}>
      <span className="text-xs font-mono px-1.5 py-0.5 rounded border bg-[var(--color-surface-2)] text-[var(--color-text-secondary)] border-[var(--color-border)]">{children}</span>
      {showLine && (
        <svg width={2} height={16} viewBox="0 0 2 16" aria-hidden>
          <line x1={1} y1={0} x2={1} y2={16} stroke={c} strokeWidth={1} strokeDasharray="3 2" />
        </svg>
      )}
    </div>
  );
}

// ── 15. MathAnnotation ────────────────────────────────────────────────────────

interface MathAnnotationProps { formula: string; label?: string; className?: string; }

export function MathAnnotation({ formula, label, className }: MathAnnotationProps) {
  // Render formula as preformatted text — KaTeX CSS is a consumer concern
  // In a full setup, replace innerHTML with katex.renderToString(formula)
  return (
    <div className={cn("space-y-1", className)}>
      <div data-formula className="px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] font-mono text-sm text-[var(--color-text-primary)] overflow-x-auto">
        <code>{formula}</code>
      </div>
      {label && (
        <div className="flex items-center gap-1.5 text-xs text-[var(--color-text-muted)] font-mono">
          <span className="text-[var(--color-attention)]">≡</span>
          <span>{label}</span>
        </div>
      )}
    </div>
  );
}

// ── 16. CodeAnnotation ────────────────────────────────────────────────────────

interface CodeAnnotationProps { code: string; annotation: string; language?: string; className?: string; }

export function CodeAnnotation({ code, annotation, language, className }: CodeAnnotationProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] overflow-hidden", className)}>
      <div className="flex items-center justify-between px-3 py-1.5 bg-[var(--color-surface-2)] border-b border-[var(--color-border)]">
        <span className="text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">Code</span>
        {language && <span className="text-[10px] font-mono text-[var(--color-data)]">{language}</span>}
      </div>
      <pre className="px-3 py-2.5 text-xs font-mono text-[var(--color-text-code)] bg-[var(--color-surface-1)] overflow-x-auto"><code>{code}</code></pre>
      <div className="px-3 py-2 border-t border-[var(--color-border)] bg-[var(--color-surface-2)] flex items-start gap-2">
        <span className="text-[var(--color-attention)] text-xs mt-0.5">↳</span>
        <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{annotation}</p>
      </div>
    </div>
  );
}

// ── 17. StepBubble ────────────────────────────────────────────────────────────

interface StepBubbleProps { step: number; label: string; description?: string; color?: string; active?: boolean; className?: string; }

export function StepBubble({ step, label, description, color, active, className }: StepBubbleProps) {
  const c = resolveColor(color ?? "inference");
  return (
    <div className={cn("flex items-start gap-3", className)}>
      <div
        className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-mono font-bold shrink-0 border-2"
        style={{
          background: active ? c : "var(--color-surface-2)",
          borderColor: c,
          color: active ? "var(--color-bg)" : c,
        }}
      >
        {step}
      </div>
      <div className="flex-1 pt-0.5 space-y-0.5">
        <p className="text-sm font-semibold text-[var(--color-text-primary)]">{label}</p>
        {description && <p className="text-xs text-[var(--color-text-muted)] leading-relaxed">{description}</p>}
      </div>
    </div>
  );
}

// ── 18. FormulaBreakdown ──────────────────────────────────────────────────────

interface FormulaTerm { symbol: string; label: string; color?: string; }

interface FormulaBreakdownProps { formula: string; terms: FormulaTerm[]; className?: string; }

export function FormulaBreakdown({ formula, terms, className }: FormulaBreakdownProps) {
  return (
    <div className={cn("space-y-4", className)}>
      <div className="px-4 py-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-2)] text-center font-mono text-base text-[var(--color-text-primary)]">
        {formula}
      </div>
      <div className="flex flex-wrap gap-3">
        {terms.map(({ symbol, label, color }, i) => {
          const c = resolveColor(color ?? "text-secondary");
          return (
            <div key={i} className="flex items-center gap-2 text-xs">
              <span className="font-mono font-bold text-sm" style={{ color: c }}>{symbol}</span>
              <span className="text-[var(--color-text-muted)]">→</span>
              <span className="text-[var(--color-text-secondary)]">{label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 19. PseudoCode ────────────────────────────────────────────────────────────

interface PseudoCodeProps { title: string; steps: string[]; showLineNumbers?: boolean; className?: string; }

export function PseudoCode({ title, steps, showLineNumbers, className }: PseudoCodeProps) {
  return (
    <div className={cn("rounded-lg border border-[var(--color-border)] overflow-hidden font-mono", className)}>
      <div className="px-4 py-2 bg-[var(--color-surface-3)] border-b border-[var(--color-border)] flex items-center gap-2">
        <span className="text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">Algorithm</span>
        <span className="text-xs text-[var(--color-text-primary)] font-semibold">{title}</span>
      </div>
      <div className="bg-[var(--color-surface-1)] p-3 space-y-0.5">
        {steps.map((step, i) => {
          const indent = step.match(/^(\s+)/)?.[1]?.length ?? 0;
          const trimmed = step.trimStart();
          return (
            <div key={i} className="flex gap-3 items-baseline text-xs leading-relaxed">
              {showLineNumbers && (
                <span className="text-[var(--color-text-muted)] w-4 shrink-0 select-none tabular-nums text-right">{i + 1}</span>
              )}
              <span style={{ paddingLeft: indent * 8 }} className="text-[var(--color-text-secondary)]">
                {trimmed.startsWith("for ") || trimmed.startsWith("while ") || trimmed.startsWith("if ") || trimmed.startsWith("return ") ? (
                  <>
                    <span className="text-[var(--color-neuron)]">{trimmed.split(" ")[0]} </span>
                    <span>{trimmed.slice(trimmed.indexOf(" ") + 1)}</span>
                  </>
                ) : (
                  trimmed
                )}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── 20. Highlight ─────────────────────────────────────────────────────────────

type HighlightColor = "neuron" | "data" | "attention" | "loss" | "accuracy" | "token" | "agent";

interface HighlightProps { color?: HighlightColor; label?: string; children: React.ReactNode; className?: string; }

export function Highlight({ color = "attention", label, children, className }: HighlightProps) {
  const c = `var(--color-${color})`;
  return (
    <span className={cn("relative inline-block group", className)}>
      <mark
        className="px-0.5 rounded-sm"
        style={{ background: `color-mix(in srgb, ${c} 22%, transparent)`, color: c }}
      >
        {children}
      </mark>
      {label && (
        <span className="ml-1 text-[10px] font-mono opacity-60">[{label}]</span>
      )}
    </span>
  );
}
