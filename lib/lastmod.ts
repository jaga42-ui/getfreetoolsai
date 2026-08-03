/**
 * Single source of truth for page "last modified" dates. Consumed by BOTH the
 * XML sitemap (<lastmod>) and the SoftwareApplication `dateModified` field so
 * the two never disagree.
 *
 * Rule: only add or bump a date here when a page's *content* genuinely changes
 * — new copy, updated statutory figures, a reworked tool. Do NOT bump dates for
 * sitewide template changes (nav, footer, a shared cross-link strip). Fabricated
 * or template-driven freshness trains Google to ignore `lastmod` entirely, which
 * is worse than a stale-but-honest date.
 */

/** Baseline for pages without a tracked content change. */
export const DEFAULT_LASTMOD = "2026-06-04";

/**
 * Per-path overrides, keyed by pathname (no origin, no trailing slash).
 * Add an entry the moment you meaningfully revise a page's content.
 */
export const LASTMOD: Record<string, string> = {
  // New browser-based video tools hub.
  "/video-tools": "2026-07-26",

  // India-finance flagships: rates verified + authoritative sources cited
  // (Week 2 E-E-A-T pass). Bump these whenever statutory figures change.
  "/calculators/income-tax": "2026-07-26",
  "/calculators/ppf": "2026-07-26",
  "/calculators/epf": "2026-07-26",
  "/calculators/hra": "2026-07-26",
  "/calculators/gratuity": "2026-07-26",
  "/calculators/gst": "2026-07-26",
  "/calculators/ssy": "2026-07-26",
};

/** Resolve the honest last-modified date for a pathname. */
export function lastmodFor(path: string): string {
  return LASTMOD[path] ?? DEFAULT_LASTMOD;
}
