import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";
import { describe, it, expect } from "vitest";
import { guides, GUIDE_CATEGORIES } from "@/lib/guides";
import { comparisons } from "@/lib/comparisons";
import { howtos } from "@/lib/howto";
import { sizePresets } from "@/lib/sizePresets";
import { convertI18n } from "@/lib/convertPresetsI18n";

/**
 * SERP truncation guard.
 *
 * Google clips titles around 60 characters and descriptions around 155-160 on
 * desktop (less on mobile, which is where over half this site's clicks come
 * from). A clipped title loses its tail, which on the /compare/* pages is the
 * most persuasive half -- "...No Signup, No Watermark, No Daily Limit".
 *
 * These are display limits, not ranking factors, so the cap is enforced on the
 * strings the registries feed to <title> and <meta name="description">, not on
 * body copy.
 *
 * Two sources have to be covered, because metadata enters the site two ways:
 * the content registries (imported below), and per-route `toolMeta({...})`
 * literals in app/**\/page.tsx (scanned from source). The first version of this
 * test only did the registries, and the two hub pages shipped in #55 slipped
 * straight past it -- both went live over the limit.
 */
const TITLE_MAX = 60;
const DESC_MAX = 160;

type Entry = { where: string; title?: string; description?: string };

function allEntries(): Entry[] {
  const out: Entry[] = [];

  for (const g of guides)
    out.push({ where: `guide:${g.slug}`, title: g.title, description: g.description });

  for (const c of GUIDE_CATEGORIES)
    out.push({ where: `guideCategory:${c.id}`, title: c.title, description: c.description });

  for (const c of comparisons)
    out.push({ where: `compare:${c.slug}`, title: c.title, description: c.description });

  for (const h of howtos)
    out.push({ where: `howto:${h.slug}`, title: h.title, description: h.description });

  // HOWTO_NICHES carries label/blurb for hub cards, not <title>/<meta>, so it is
  // deliberately not length-checked here.

  for (const p of sizePresets)
    out.push({ where: `sizePreset:${p.kind}/${p.slug}`, title: p.title, description: p.description });

  // Localised convert pages are template-generated, so they are easy to miss in
  // a source grep -- assert the built strings instead.
  for (const pair of Object.keys(convertI18n))
    for (const locale of Object.keys(convertI18n[pair])) {
      const c = convertI18n[pair][locale];
      out.push({ where: `convert:${locale}/${pair}`, title: c.title, description: c.description });
    }

  out.push(...routeMetaEntries());

  return out;
}

/** Every page.tsx under app/, recursively. */
function pageFiles(dir: string, found: string[] = []): string[] {
  for (const e of readdirSync(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) pageFiles(p, found);
    else if (e.name === "page.tsx") found.push(p);
  }
  return found;
}

/**
 * Pull `title:` / `description:` string literals out of the route metadata
 * blocks. Scanned from source rather than imported because importing 200+ route
 * modules would drag in every client component they render.
 *
 * Only single-quoted/double-quoted literals are matched. A template literal or
 * a computed value is skipped -- those are dynamic routes whose length depends
 * on the parameter, and the registries behind them are checked above.
 */
function routeMetaEntries(): Entry[] {
  const META = /(?:export const metadata|generateMetadata)[\s\S]*?$/;
  const FIELD = /\b(title|description):\s*\n?\s*"((?:[^"\\]|\\.)*)"/g;
  const out: Entry[] = [];

  for (const file of pageFiles("app")) {
    const src = readFileSync(file, "utf8");
    const block = META.exec(src);
    if (!block) continue;
    const route = file.replace(/\\/g, "/").replace(/^app/, "").replace(/\/page\.tsx$/, "") || "/";

    // One entry per route, so the "never empty" check sees a title/description
    // pair rather than two half-populated entries. Only the first of each field
    // is taken -- later matches belong to nested FAQ/schema objects, not <head>.
    const entry: Entry = { where: `route:${route}` };
    let m: RegExpExecArray | null;
    FIELD.lastIndex = 0;
    while ((m = FIELD.exec(block[0]))) {
      const value = m[2].replace(/\\"/g, '"');
      if (m[1] === "title" && entry.title === undefined) entry.title = value;
      if (m[1] === "description" && entry.description === undefined) entry.description = value;
      if (entry.title !== undefined && entry.description !== undefined) break;
    }
    if (entry.title !== undefined || entry.description !== undefined) out.push(entry);
  }
  return out;
}

describe("SERP metadata length", () => {
  const entries = allEntries();

  it("checks both the registries and the app route metadata", () => {
    expect(entries.length).toBeGreaterThan(150);
    // The hub pages that slipped through the registry-only version.
    const routes = entries.filter((e) => e.where.startsWith("route:"));
    expect(routes.length).toBeGreaterThan(100);
    expect(routes.some((e) => e.where === "route:/ocr-tools")).toBe(true);
    expect(routes.some((e) => e.where === "route:/privacy-tools")).toBe(true);
  });

  it(`keeps every title at or under ${TITLE_MAX} characters`, () => {
    const over = entries
      .filter((e) => e.title && e.title.length > TITLE_MAX)
      .map((e) => `${e.where} (${e.title!.length}): ${e.title}`);
    expect(over).toEqual([]);
  });

  it(`keeps every meta description at or under ${DESC_MAX} characters`, () => {
    const over = entries
      .filter((e) => e.description && e.description.length > DESC_MAX)
      .map((e) => `${e.where} (${e.description!.length}): ${e.description}`);
    expect(over).toEqual([]);
  });

  it("never ships an empty title or description", () => {
    // Registry entries only. A route can legitimately have no *literal* here --
    // /calculators builds its description from a template literal and /tags
    // writes `title: { absolute: ... }` -- and a missing match means the source
    // scan could not read it statically, not that the page ships without one.
    const missing = entries
      .filter((e) => !e.where.startsWith("route:"))
      .filter((e) => !e.title?.trim() || !e.description?.trim())
      .map((e) => e.where);
    expect(missing).toEqual([]);
  });
});
