import { Sparkles, Loader2 } from "lucide-react";

/**
 * Engaging "the AI is working" state for the in-browser model tools
 * (Background Remover, Blur Background). Instead of a flat skeleton, it shows
 * a subject silhouette under a sweeping scan beam with a focus reticle and
 * twinkling sparkles — communicating "analyzing your photo" while the model
 * loads on first use. Pure CSS/SVG, on-brand, no asset loading.
 */
export function AiLoader({ status }: { status?: string }) {
  return (
    <div className="flex w-full animate-fade-in flex-col items-center gap-3.5 p-5">
      <div className="relative h-32 w-full max-w-[12rem] overflow-hidden rounded-xl border border-border bg-gradient-to-b from-background to-surface">
        {/* subject silhouette, gently pulsing */}
        <svg
          viewBox="0 0 120 110"
          className="absolute inset-0 h-full w-full animate-pulse text-border"
          aria-hidden="true"
        >
          <circle cx="60" cy="40" r="19" fill="currentColor" />
          <path d="M26 110 a34 30 0 0 1 68 0 Z" fill="currentColor" />
        </svg>

        {/* sweeping scan beam + crisp leading line */}
        <div className="absolute inset-x-0 top-0 h-10 animate-ai-scan bg-gradient-to-b from-transparent via-primary/30 to-transparent">
          <span className="absolute inset-x-0 bottom-0 h-px bg-primary/70" />
        </div>

        {/* focus reticle corners */}
        <span className="absolute left-2 top-2 h-3.5 w-3.5 rounded-tl-sm border-l-2 border-t-2 border-primary/70" />
        <span className="absolute right-2 top-2 h-3.5 w-3.5 rounded-tr-sm border-r-2 border-t-2 border-primary/70" />
        <span className="absolute bottom-2 left-2 h-3.5 w-3.5 rounded-bl-sm border-b-2 border-l-2 border-primary/70" />
        <span className="absolute bottom-2 right-2 h-3.5 w-3.5 rounded-br-sm border-b-2 border-r-2 border-primary/70" />

        {/* twinkling sparkles */}
        <Sparkles
          className="absolute right-3 top-5 h-3 w-3 animate-ping text-secondary"
          style={{ animationDuration: "1.4s" }}
          aria-hidden="true"
        />
        <Sparkles
          className="absolute bottom-6 left-4 h-2.5 w-2.5 animate-ping text-primary"
          style={{ animationDuration: "1.9s", animationDelay: "0.4s" }}
          aria-hidden="true"
        />
      </div>

      <div className="flex items-center justify-center gap-1.5 text-center text-xs text-text-muted">
        <Loader2 className="h-3.5 w-3.5 shrink-0 animate-spin text-primary" aria-hidden="true" />
        <span aria-live="polite">{status || "Working…"}</span>
      </div>
    </div>
  );
}
