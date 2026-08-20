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

  // New OCR cluster head (languages, accuracy guidance, tool routing).
  "/ocr-tools": "2026-08-07",

  // New privacy/metadata cluster head (what EXIF leaks, check-strip-verify flow).
  "/privacy-tools": "2026-08-07",

  // New chat-mockup generators.
  "/fun/fake-whatsapp": "2026-08-07",
  "/fun/fake-instagram-dm": "2026-08-08",
  "/fun/fake-discord": "2026-08-08",

  // New prank / post-mockup generators.
  "/fun/fake-reddit": "2026-08-19",
  "/fun/fake-chatgpt": "2026-08-19",
  "/fun/fake-windows-update": "2026-08-19",

  // India-finance flagships: rates verified + authoritative sources cited
  // (Week 2 E-E-A-T pass). Bump these whenever statutory figures change.
  "/calculators/income-tax": "2026-07-26",
  "/calculators/ppf": "2026-07-26",
  "/calculators/epf": "2026-07-26",
  "/calculators/hra": "2026-07-26",
  "/calculators/gratuity": "2026-07-26",
  "/calculators/gst": "2026-07-26",

  // Small-savings calculators gained a real year-by-year / payout schedule
  // (genuine new on-page content, not a template tweak).
  "/calculators/ssy": "2026-08-07",
  "/calculators/nsc": "2026-08-07",
  "/calculators/scss": "2026-08-07",
};

/** Resolve the honest last-modified date for a pathname. */
export function lastmodFor(path: string): string {
  return LASTMOD[path] ?? DEFAULT_LASTMOD;
}
