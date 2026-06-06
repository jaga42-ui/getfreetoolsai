import {
  FileArchive,
  Combine,
  Scissors,
  Braces,
  KeyRound,
  Hash,
  Eraser,
  ImageMinus,
  Lock,
  type LucideIcon,
} from "lucide-react";

/**
 * Hero product showcase (right column). A glass "browser window" foundation
 * surfacing PDF tools, with two smaller floating cards (Image + Developer)
 * overlapping its edges. Pure CSS motion (entrance rise + gentle float + hover
 * lift) — zero JS, reduced-motion safe — so it stays lightweight with minimal
 * CLS. Decorative only, hidden from assistive tech.
 */

type Row = {
  icon: LucideIcon;
  name: string;
  sub: string;
  tint: "primary" | "secondary" | "ink";
};

const tintMap = {
  primary: "bg-primary/10 text-primary",
  secondary: "bg-secondary/10 text-secondary",
  ink: "bg-text-primary/[0.06] text-text-primary",
} as const;

function ToolRow({ icon: Icon, name, sub, tint }: Row) {
  return (
    <div className="group/row flex items-center gap-3 rounded-lg px-2 py-2 transition-colors hover:bg-background/70">
      <span
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${tintMap[tint]}`}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={1.75} />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[13.5px] font-medium leading-tight text-text-primary">
          {name}
        </span>
        <span className="block truncate text-[11.5px] leading-tight text-text-muted">
          {sub}
        </span>
      </span>
    </div>
  );
}

export function HeroShowcase() {
  return (
    <div
      aria-hidden
      className="relative mt-14 h-[440px] select-none sm:h-[480px] lg:mt-0 lg:h-[540px]"
    >
      {/* Soft warm depth glows (give the glass something to refract) */}
      <div className="pointer-events-none absolute -right-10 top-2 h-56 w-56 rounded-full bg-primary/15 blur-3xl" />
      <div className="pointer-events-none absolute bottom-0 -left-12 h-52 w-52 rounded-full bg-secondary/15 blur-3xl" />

      {/* ── Foundation: browser-window mockup (PDF Tools) ── */}
      <div
        className="hero-rise absolute inset-x-[3%] top-[12%] z-10"
        style={{ animationDelay: "60ms" }}
      >
        <div className="overflow-hidden rounded-2xl border border-border/80 bg-surface/80 shadow-[0_28px_70px_-26px_rgba(33,31,26,0.45)] backdrop-blur-xl transition-shadow duration-500 hover:shadow-[0_34px_80px_-26px_rgba(33,31,26,0.5)]">
          {/* window chrome */}
          <div className="flex items-center gap-2 border-b border-border/70 bg-background/50 px-4 py-3">
            <span className="flex gap-1.5">
              <span className="h-2.5 w-2.5 rounded-full bg-primary/50" />
              <span className="h-2.5 w-2.5 rounded-full bg-[#d6a94e]/60" />
              <span className="h-2.5 w-2.5 rounded-full bg-secondary/50" />
            </span>
            <span className="ml-2 flex flex-1 items-center gap-1.5 rounded-md border border-border/70 bg-surface/70 px-2.5 py-1">
              <Lock className="h-3 w-3 text-secondary" strokeWidth={2} />
              <span className="text-[11px] font-medium text-text-muted">
                getfreetoolsai.com
              </span>
            </span>
          </div>

          {/* window body */}
          <div className="p-3.5">
            <div className="mb-1 flex items-center justify-between px-2">
              <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text-muted">
                PDF Tools
              </span>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[10.5px] font-medium text-primary">
                9 tools
              </span>
            </div>

            <ToolRow
              icon={FileArchive}
              name="Compress PDF"
              sub="Reduce file size"
              tint="primary"
            />

            {/* active task — realistic in-progress state */}
            <div className="mx-2 my-1 rounded-lg border border-primary/20 bg-primary/[0.06] px-3 py-2.5">
              <div className="flex items-center justify-between text-[11.5px]">
                <span className="font-medium text-text-primary">
                  report-final.pdf
                </span>
                <span className="font-medium text-primary">−68%</span>
              </div>
              <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-primary/15">
                <div className="h-full w-[72%] rounded-full bg-primary" />
              </div>
            </div>

            <ToolRow
              icon={Combine}
              name="Merge PDF"
              sub="Combine into one document"
              tint="primary"
            />
            <ToolRow
              icon={Scissors}
              name="Split PDF"
              sub="Extract or separate pages"
              tint="primary"
            />

            <div className="mt-1.5 flex items-center gap-1.5 border-t border-border/60 px-2 pt-2.5">
              <Lock className="h-3 w-3 text-secondary" strokeWidth={2} />
              <span className="text-[11px] text-text-muted">
                Processed in your browser — never uploaded
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating card: Image Tools (top-right, overlapping) ── */}
      <div
        className="hero-rise absolute -top-1 right-0 z-20 w-[230px] sm:-right-3"
        style={{ animationDelay: "220ms" }}
      >
        <div className="hero-float">
          <div className="rounded-xl border border-border/70 bg-surface/85 p-3 shadow-[0_18px_44px_-18px_rgba(33,31,26,0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
            <span className="mb-2 block px-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Image Tools
            </span>
            <ToolRow
              icon={Eraser}
              name="Background Remover"
              sub="One-click, AI-powered"
              tint="secondary"
            />
            <div className="flex items-center gap-3 rounded-lg px-2 py-2">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary/10 text-secondary">
                <ImageMinus className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[13.5px] font-medium leading-tight text-text-primary">
                  Image Compressor
                </span>
                <span className="block text-[11.5px] leading-tight text-text-muted">
                  <span className="text-text-muted/80">2.4 MB</span>
                  <span className="mx-1 text-secondary">→</span>
                  <span className="font-medium text-secondary">380 KB</span>
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── Floating card: Developer Tools (bottom-left, overlapping) ── */}
      <div
        className="hero-rise absolute bottom-1 left-0 z-20 w-[236px] sm:-left-4"
        style={{ animationDelay: "360ms" }}
      >
        <div className="hero-float-slow">
          <div className="rounded-xl border border-border/70 bg-surface/85 p-3 shadow-[0_18px_44px_-18px_rgba(33,31,26,0.45)] backdrop-blur-xl transition-transform duration-300 hover:-translate-y-1">
            <span className="mb-2 block px-1 text-[10.5px] font-semibold uppercase tracking-[0.14em] text-text-muted">
              Developer Tools
            </span>
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-text-primary/[0.06] text-text-primary">
                <Braces className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium leading-tight text-text-primary">
                  JSON Formatter
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10.5px] leading-tight text-text-muted">
                  {'{ "ok": true }'}
                </span>
              </span>
            </div>
            <ToolRow
              icon={KeyRound}
              name="JWT Decoder"
              sub="Inspect token claims"
              tint="ink"
            />
            <div className="flex items-center gap-3 rounded-lg px-2 py-1.5">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-text-primary/[0.06] text-text-primary">
                <Hash className="h-[18px] w-[18px]" strokeWidth={1.75} />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-medium leading-tight text-text-primary">
                  Hash Generator
                </span>
                <span className="mt-0.5 block truncate font-mono text-[10.5px] leading-tight text-text-muted">
                  a1f9…c3 · SHA-256
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
