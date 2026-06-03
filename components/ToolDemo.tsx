import type { ReactNode } from "react";

/**
 * Honest, diagrammatic "what this tool does" illustrations (inline SVG — no
 * asset loading, scales crisply, on-brand). These are explanatory graphics,
 * not photographic "result" claims.
 */

const ink = "#211f1a";
const muted = "#6c675c";
const rust = "#b25733";
const forest = "#4b6b4e";
const border = "#e4ddcd";
const cream = "#f4efe4";

function Panel({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div>
      <p className="mb-2 font-mono text-[11px] uppercase tracking-widest text-text-muted">
        {label}
      </p>
      {children}
    </div>
  );
}

export function ToolDemo({
  title = "What you’ll get",
  caption,
  children,
}: {
  title?: string;
  caption?: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-14">
      <h2 className="font-display text-2xl font-medium text-text-primary">
        {title}
      </h2>
      {caption && (
        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
          {caption}
        </p>
      )}
      <div className="mt-5 rounded-xl border border-border bg-surface/50 p-4 sm:p-6">
        {children}
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- */

function Subject() {
  // Simple, friendly bust silhouette used in the before/after panels.
  return (
    <>
      <circle cx="100" cy="58" r="24" fill={forest} />
      <path d="M58 132 a42 42 0 0 1 84 0 Z" fill={forest} />
    </>
  );
}

export function BackgroundRemoverDemo() {
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <Panel label="Before">
        <svg
          viewBox="0 0 200 150"
          role="img"
          aria-label="Original photo with a cluttered background"
          className="h-auto w-full rounded-lg border border-border"
        >
          <defs>
            <linearGradient id="bgClutter" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0" stopColor="#d9c9a6" />
              <stop offset="1" stopColor="#c2a98a" />
            </linearGradient>
          </defs>
          <rect width="200" height="150" fill="url(#bgClutter)" />
          <circle cx="40" cy="30" r="18" fill="#ffffff" opacity="0.35" />
          <rect x="150" y="90" width="40" height="40" rx="6" fill="#ffffff" opacity="0.3" />
          <Subject />
        </svg>
      </Panel>
      <Panel label="After — transparent PNG">
        <svg
          viewBox="0 0 200 150"
          role="img"
          aria-label="Same subject on a transparent background"
          className="h-auto w-full rounded-lg border border-border"
        >
          <defs>
            <pattern id="checker" width="20" height="20" patternUnits="userSpaceOnUse">
              <rect width="20" height="20" fill="#ffffff" />
              <rect width="10" height="10" fill={border} />
              <rect x="10" y="10" width="10" height="10" fill={border} />
            </pattern>
          </defs>
          <rect width="200" height="150" fill="url(#checker)" />
          <Subject />
        </svg>
      </Panel>
    </div>
  );
}

export function CompressDemo({
  kind = "image",
}: {
  kind?: "image" | "pdf";
}) {
  const beforeLabel = kind === "pdf" ? "Original PDF" : "Original photo";
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <svg
        viewBox="0 0 120 150"
        role="img"
        aria-label={`${beforeLabel}, large file size`}
        className="h-auto w-28"
      >
        <rect x="10" y="10" width="100" height="130" rx="8" fill={cream} stroke={border} strokeWidth="2" />
        <rect x="24" y="30" width="72" height="8" rx="4" fill={muted} opacity="0.5" />
        <rect x="24" y="46" width="72" height="8" rx="4" fill={muted} opacity="0.5" />
        <rect x="24" y="62" width="48" height="8" rx="4" fill={muted} opacity="0.5" />
        <rect x="24" y="92" width="72" height="36" rx="4" fill={rust} opacity="0.25" />
        <text x="60" y="148" textAnchor="middle" fontSize="0" >file</text>
      </svg>

      <div className="flex flex-col items-center text-center">
        <svg viewBox="0 0 60 24" className="h-6 w-16" role="img" aria-label="compresses to">
          <line x1="4" y1="12" x2="48" y2="12" stroke={rust} strokeWidth="3" />
          <path d="M48 4 L58 12 L48 20 Z" fill={rust} />
        </svg>
        <span className="mt-1 text-xs font-medium text-secondary">smaller file</span>
      </div>

      <svg
        viewBox="0 0 120 150"
        role="img"
        aria-label="Compressed file, much smaller size"
        className="h-auto w-20"
      >
        <rect x="20" y="40" width="80" height="100" rx="7" fill={cream} stroke={border} strokeWidth="2" />
        <rect x="32" y="56" width="56" height="6" rx="3" fill={muted} opacity="0.5" />
        <rect x="32" y="68" width="56" height="6" rx="3" fill={muted} opacity="0.5" />
        <rect x="32" y="92" width="56" height="28" rx="3" fill={forest} opacity="0.25" />
      </svg>
    </div>
  );
}

export function ResizeDemo() {
  return (
    <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
      <div className="text-center">
        <svg viewBox="0 0 160 120" className="h-auto w-40" role="img" aria-label="Large image dimensions">
          <rect x="2" y="2" width="156" height="116" rx="6" fill={cream} stroke={border} strokeWidth="2" />
          <circle cx="50" cy="78" r="16" fill={forest} opacity="0.4" />
          <path d="M2 100 L60 60 L96 86 L130 56 L158 78 L158 118 L2 118 Z" fill={rust} opacity="0.2" />
        </svg>
        <span className="mt-1 block text-xs text-text-muted">e.g. 4000 × 3000</span>
      </div>

      <svg viewBox="0 0 60 24" className="h-6 w-16" role="img" aria-label="resizes to">
        <line x1="4" y1="12" x2="48" y2="12" stroke={rust} strokeWidth="3" />
        <path d="M48 4 L58 12 L48 20 Z" fill={rust} />
      </svg>

      <div className="text-center">
        <svg viewBox="0 0 160 120" className="h-auto w-24" role="img" aria-label="Resized smaller image, exact dimensions">
          <rect x="42" y="32" width="76" height="56" rx="5" fill={cream} stroke={ink} strokeWidth="2" strokeDasharray="5 4" />
          <circle cx="66" cy="66" r="8" fill={forest} opacity="0.4" />
          <path d="M42 78 L70 58 L88 70 L106 54 L118 66 L118 88 L42 88 Z" fill={rust} opacity="0.2" />
        </svg>
        <span className="mt-1 block text-xs text-text-muted">exact size you set</span>
      </div>
    </div>
  );
}
