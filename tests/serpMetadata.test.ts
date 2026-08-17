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

  return out;
}

describe("SERP metadata length", () => {
  const entries = allEntries();

  it("has entries to check", () => {
    expect(entries.length).toBeGreaterThan(150);
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
    const missing = entries
      .filter((e) => !e.title?.trim() || !e.description?.trim())
      .map((e) => e.where);
    expect(missing).toEqual([]);
  });
});
