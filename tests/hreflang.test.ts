import { describe, it, expect } from "vitest";
import { routing, prefixedLocales } from "@/lib/i18n/routing";
import { localeHome, localeHomeLanguages } from "@/lib/i18n/alternates";
import { toolEntries } from "@/lib/sitemapUrls";
import { SITE_URL } from "@/lib/seo";

/**
 * hreflang reciprocity guard.
 *
 * The four translated homepages (/hi, /es, /pt-BR, /id) shipped live and fully
 * rendered, each naming / as its English counterpart -- but / advertised only
 * `en-US` and `x-default`. hreflang is only honoured when the annotations point
 * both ways, so Google had no return link and dropped the cluster: four real
 * pages, indexed as nothing.
 *
 * They were also in no sitemap at all, reachable only through the footer locale
 * switcher.
 *
 * These tests pin both halves. They assert the shape of the shared cluster
 * rather than a hard-coded list, so adding a locale to `routing.locales` is
 * picked up automatically instead of silently escaping the guard.
 */
describe("homepage hreflang cluster", () => {
  const languages = localeHomeLanguages();

  it("names every configured locale plus x-default", () => {
    for (const locale of routing.locales) {
      expect(languages[locale], `missing hreflang for ${locale}`).toBe(
        localeHome(locale)
      );
    }
    expect(languages["x-default"]).toBe(localeHome(routing.defaultLocale));
    expect(Object.keys(languages)).toHaveLength(routing.locales.length + 1);
  });

  it("uses the bare `en` code, matching what the localized pages emit", () => {
    // The localized homepages build their map from routing.locales, so the
    // English entry is `en`. If the hub advertised `en-US` for the same URL the
    // two sides would name the same page under different codes.
    expect(languages).toHaveProperty("en");
    expect(languages).not.toHaveProperty("en-US");
  });

  it("keeps the default locale unprefixed and the rest prefixed", () => {
    expect(localeHome("en")).toBe(`${SITE_URL}/`);
    for (const locale of prefixedLocales) {
      expect(localeHome(locale)).toBe(`${SITE_URL}/${locale}`);
    }
  });

  it("is reciprocal: every alternate URL is itself a page in the cluster", () => {
    // Each localized homepage renders the identical map, so every href in it
    // must be one of the cluster's own canonical URLs.
    const canonicals = new Set(routing.locales.map(localeHome));
    for (const [code, href] of Object.entries(languages)) {
      expect(canonicals.has(href), `${code} -> ${href} is outside the cluster`).toBe(
        true
      );
    }
  });
});

describe("translated homepages in the sitemap", () => {
  const urls = new Set(toolEntries().map((e) => e.url));

  it("lists every prefixed locale homepage", () => {
    for (const locale of prefixedLocales) {
      expect(urls.has(`${SITE_URL}/${locale}`), `/${locale} missing`).toBe(true);
    }
  });

  it("still lists the English homepage exactly once", () => {
    const home = toolEntries().filter((e) => e.url === SITE_URL);
    expect(home).toHaveLength(1);
  });
});
