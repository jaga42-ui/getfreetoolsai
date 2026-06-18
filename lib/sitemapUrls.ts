import { SITE_URL } from "@/lib/seo";
import { pdfTools, imageTools, calculatorTools } from "@/lib/tools";
import { readyDevTools } from "@/lib/devtools";
import { guides, GUIDE_CATEGORIES, guidesByCategory } from "@/lib/guides";
import { comparisons } from "@/lib/comparisons";
import { sizePresets } from "@/lib/sizePresets";

export type ChangeFreq = "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
export type SitemapEntry = { url: string; lastModified: string; changeFrequency: ChangeFreq; priority: number };

const SITE_LASTMOD = "2026-06-04";
const abs = (path: string) => `${SITE_URL}${path}`;

/** Tools, hubs, calculators, dev tools, and core/legal pages — built from the registries so new tools auto-appear. */
export function toolEntries(): SitemapEntry[] {
  const e: SitemapEntry[] = [
    { url: SITE_URL, lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 1.0 },
    { url: abs("/tags"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.6 },
    { url: abs("/pdf-tools"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/image-tools"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/calculators"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
    { url: abs("/dev-tools"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.9 },
  ];

  for (const t of [...pdfTools, ...imageTools, ...calculatorTools].filter((t) => t.ready))
    e.push({ url: abs(t.href), lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.8 });
  for (const t of readyDevTools)
    e.push({ url: abs(t.href), lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.8 });

  // Standalone audio/video tools (not yet in a category registry).
  e.push({ url: abs("/audio/transcribe"), lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.8 });

  // Comparison / "free alternative" pages
  e.push({ url: abs("/compare"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.7 });
  for (const c of comparisons)
    e.push({ url: abs(`/compare/${c.slug}`), lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.7 });

  // Long-tail "compress to exact size" landing pages
  for (const p of sizePresets) {
    const base = p.kind === "pdf" ? "/pdf/compress" : "/image/compress";
    e.push({ url: abs(`${base}/${p.slug}`), lastModified: SITE_LASTMOD, changeFrequency: "monthly", priority: 0.7 });
  }

  for (const p of ["/about", "/contact", "/privacy-policy", "/terms", "/disclaimer"])
    e.push({ url: abs(p), lastModified: SITE_LASTMOD, changeFrequency: "yearly", priority: 0.4 });

  return e;
}

/** Guides hub, category pages (only non-empty), and every guide article. */
export function guideEntries(): SitemapEntry[] {
  const e: SitemapEntry[] = [
    { url: abs("/guides"), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.8 },
  ];
  for (const c of GUIDE_CATEGORIES)
    if (guidesByCategory(c.id).length)
      e.push({ url: abs(`/guides/${c.id}`), lastModified: SITE_LASTMOD, changeFrequency: "weekly", priority: 0.7 });
  for (const g of guides)
    e.push({ url: abs(`/guides/${g.category}/${g.slug}`), lastModified: g.dateModified, changeFrequency: "monthly", priority: 0.7 });
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

export function indexXml(paths: string[]): string {
  const items = paths
    .map((p) => `  <sitemap>\n    <loc>${abs(p)}</loc>\n    <lastmod>${SITE_LASTMOD}</lastmod>\n  </sitemap>`)
    .join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${items}\n</sitemapindex>\n`;
}
