import { SITE_URL } from "@/lib/seo";
import { isNoindexed } from "@/lib/noindex";
import { DEFAULT_LASTMOD, lastmodFor } from "@/lib/lastmod";
import { pdfTools, imageTools, calculatorTools, audioTools, videoTools, textTools, funTools } from "@/lib/tools";
import { readyDevTools } from "@/lib/devtools";
import { guides, GUIDE_CATEGORIES, guidesByCategory } from "@/lib/guides";
import { comparisons } from "@/lib/comparisons";
import { howtos } from "@/lib/howto";
import { sizePresets } from "@/lib/sizePresets";
import { errorStyles } from "@/lib/errorStyles";
import { convertPresets } from "@/lib/convertPresets";
import { convertI18n } from "@/lib/convertPresetsI18n";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export type SitemapEntry = { url: string; lastModified: string; changeFrequency: ChangeFreq; priority: number };

// Index-level fallback only. Per-URL <lastmod> comes from the central registry
// (lib/lastmod.ts) so freshness is honest and page-specific.
const SITE_LASTMOD = DEFAULT_LASTMOD;
const abs = (path: string) => `${SITE_URL}${path}`;

/** Tools, hubs, calculators, dev tools, and core/legal pages — built from the registries so new tools auto-appear. */
export function toolEntries(): SitemapEntry[] {
  // Hubs + core pages, path-driven so <lastmod> flows from the registry.
  const core: { path: string; changeFrequency: ChangeFreq; priority: number }[] = [
    { path: "/", changeFrequency: "weekly", priority: 1.0 },
    { path: "/tags", changeFrequency: "weekly", priority: 0.6 },
    { path: "/passport-photo-sizes", changeFrequency: "monthly", priority: 0.7 },
    { path: "/pdf-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/image-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/calculators", changeFrequency: "weekly", priority: 0.9 },
    { path: "/dev-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/audio-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/video-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/text-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/fun-tools", changeFrequency: "weekly", priority: 0.9 },
    // Cross-category topic hubs. These curate tools that live under different
    // sections (OCR spans /image + /pdf) and act as the cluster head for their
    // topic, so they carry hub-level priority.
    { path: "/ocr-tools", changeFrequency: "weekly", priority: 0.9 },
    { path: "/privacy-tools", changeFrequency: "weekly", priority: 0.9 },
  ];
  const e: SitemapEntry[] = core.map((c) => ({
    url: c.path === "/" ? SITE_URL : abs(c.path),
    lastModified: lastmodFor(c.path),
    changeFrequency: c.changeFrequency,
    priority: c.priority,
  }));

  for (const t of [...pdfTools, ...imageTools, ...calculatorTools, ...audioTools, ...videoTools, ...textTools, ...funTools].filter((t) => t.ready))
    e.push({ url: abs(t.href), lastModified: lastmodFor(t.href), changeFrequency: "monthly", priority: 0.8 });
  for (const t of readyDevTools)
    e.push({ url: abs(t.href), lastModified: lastmodFor(t.href), changeFrequency: "monthly", priority: 0.8 });

  // Comparison / "free alternative" pages
  e.push({ url: abs("/compare"), lastModified: lastmodFor("/compare"), changeFrequency: "weekly", priority: 0.7 });
  for (const c of comparisons)
    e.push({ url: abs(`/compare/${c.slug}`), lastModified: lastmodFor(`/compare/${c.slug}`), changeFrequency: "monthly", priority: 0.7 });

  // Niche how-to pages (exam/visa/platform/pdf size requirements)
  e.push({ url: abs("/how-to"), lastModified: lastmodFor("/how-to"), changeFrequency: "weekly", priority: 0.7 });
  for (const h of howtos) {
    const path = `/how-to/${h.slug}`;
    if (isNoindexed(path)) continue;
    e.push({ url: abs(path), lastModified: lastmodFor(path), changeFrequency: "monthly", priority: 0.7 });
  }

  // Long-tail "compress to exact size" landing pages
  for (const p of sizePresets) {
    const base = p.kind === "pdf" ? "/pdf/compress" : "/image/compress";
    const path = `${base}/${p.slug}`;
    e.push({ url: abs(path), lastModified: lastmodFor(path), changeFrequency: "monthly", priority: 0.7 });
  }

  // Per-OS variants of the error dialog generator (/fun/fake-error/windows-xp, …)
  for (const st of errorStyles) {
    const path = `/fun/fake-error/${st.slug}`;
    e.push({ url: abs(path), lastModified: lastmodFor(path), changeFrequency: "monthly", priority: 0.7 });
  }

  // Long-tail "convert X to Y" image-format landing pages
  for (const p of convertPresets)
    e.push({ url: abs(`/image/convert/${p.slug}`), lastModified: lastmodFor(`/image/convert/${p.slug}`), changeFrequency: "monthly", priority: 0.7 });

  // Localized versions of the convert landing pages (only those with translations)
  for (const slug of Object.keys(convertI18n))
    for (const locale of Object.keys(convertI18n[slug]))
      e.push({ url: abs(`/${locale}/image/convert/${slug}`), lastModified: lastmodFor(`/${locale}/image/convert/${slug}`), changeFrequency: "monthly", priority: 0.6 });

  for (const p of ["/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"])
    e.push({ url: abs(p), lastModified: lastmodFor(p), changeFrequency: "yearly", priority: 0.4 });

  return e;
}

/** Guides hub, category pages (only non-empty), and every guide article. */
export function guideEntries(): SitemapEntry[] {
  const e: SitemapEntry[] = [
    { url: abs("/guides"), lastModified: lastmodFor("/guides"), changeFrequency: "weekly", priority: 0.8 },
  ];
  for (const c of GUIDE_CATEGORIES)
    if (guidesByCategory(c.id).length)
      e.push({ url: abs(`/guides/${c.id}`), lastModified: lastmodFor(`/guides/${c.id}`), changeFrequency: "weekly", priority: 0.7 });
  // A noindexed URL in a sitemap is a contradictory signal — it asks Google to
  // crawl a page it is simultaneously told not to index.
  for (const g of guides) {
    const path = `/guides/${g.category}/${g.slug}`;
    if (isNoindexed(path)) continue;
    e.push({ url: abs(path), lastModified: g.dateModified, changeFrequency: "monthly", priority: 0.7 });
  }
  return e;
}

export function urlsetXml(entries: SitemapEntry[]): string {
  const urls = entries
    .map(
      (e) =>
        `  <url>\n    <loc>${e.url}</loc>\n    <lastmod>${e.lastModified}</lastmod>\n    <changefreq>${e.changeFrequency}</changefreq>\n    <priority>${e.priority.toFixed(1)}</priority>\n  </url>`
    )
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}

/**
 * Which entry set backs each child sitemap, so the index can advertise a
 * truthful <lastmod> for it.
 */
const CHILD_ENTRIES: Record<string, () => SitemapEntry[]> = {
  "/sitemap-tools.xml": toolEntries,
  "/sitemap-guides.xml": guideEntries,
};

/** Newest per-URL lastmod inside a child sitemap, or the site baseline. */
function newestLastmod(path: string): string {
  const entries = CHILD_ENTRIES[path]?.() ?? [];
  // Dates are ISO (YYYY-MM-DD), so a string compare is a date compare.
  return entries.reduce(
    (max, e) => (e.lastModified > max ? e.lastModified : max),
    SITE_LASTMOD
  );
}

export function indexXml(paths: string[]): string {
  // Previously every child was stamped with SITE_LASTMOD, so the index claimed
  // 2026-06-04 for sitemaps whose contents had changed days earlier. A crawler
  // reading that has no reason to re-fetch them, which delays discovery of new
  // tools and of the noindex tags on withdrawn pages.
  const items = paths
    .map((p) => `  <sitemap>\n    <loc>${abs(p)}</loc>\n    <lastmod>${newestLastmod(p)}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}
