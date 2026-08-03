import { ShieldCheck } from "lucide-react";
import { CALC_REVIEWER } from "@/lib/guides/authors";

export type CalcSource = { label: string; href: string };

/**
 * Trust/freshness byline for calculator pages: who maintains it, when it was
 * last updated, and the authoritative sources for its rates and rules. This is
 * the visible E-E-A-T signal Google reads for YMYL finance content — kept
 * honest (real sources, real date, real reviewer or "the team", never a
 * fabricated persona).
 */
export function CalcMeta({
  updated,
  sources,
}: {
  /** ISO date (YYYY-MM-DD), typically from the central lastmod registry. */
  updated: string;
  sources?: CalcSource[];
}) {
  const dateLabel = new Date(`${updated}T00:00:00Z`).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
  const maintainer = CALC_REVIEWER
    ? `Reviewed by ${CALC_REVIEWER.name}, ${CALC_REVIEWER.credential}`
    : "Maintained & fact-checked by the GetFreeToolsAI team";

  return (
    <div className="mt-4 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-text-muted">
      <span className="inline-flex items-center gap-1.5">
        <ShieldCheck className="h-3.5 w-3.5 text-secondary" aria-hidden="true" />
        {maintainer}
      </span>
      <span aria-hidden="true">·</span>
      <span>
        Updated <time dateTime={updated}>{dateLabel}</time>
      </span>
      {sources && sources.length > 0 && (
        <>
          <span aria-hidden="true">·</span>
          <span>
            {sources.length > 1 ? "Sources" : "Source"}:{" "}
            {sources.map((s, i) => (
              <span key={s.href}>
                {i > 0 && ", "}
                <a
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-primary/40 underline-offset-2 hover:text-primary"
                >
                  {s.label}
                </a>
              </span>
            ))}
          </span>
        </>
      )}
    </div>
  );
}
