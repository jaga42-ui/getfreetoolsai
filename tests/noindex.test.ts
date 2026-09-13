import { describe, expect, it } from "vitest";
import { NOINDEX_PATHS, isNoindexed } from "@/lib/noindex";
import { toolMeta } from "@/lib/seo";
import { guideEntries, toolEntries } from "@/lib/sitemapUrls";
import { allTools, calculatorTools } from "@/lib/tools";

/**
 * Pages that were earning as of the 2026-09-11 GSC export. Withdrawing any of
 * these would throw away real rankings, so they are pinned here by hand: the
 * list in lib/noindex.ts is re-derived from each new export, and this is the
 * guard that a bad derivation cannot ship.
 */
const EARNING = [
  "/how-to/resize-image-for-kindle-ebook-cover", // 5 clicks, pos 12.3
  "/how-to/resize-photo-and-signature-for-neet-pg", // 1 click, pos 23.3
  "/how-to/resize-image-for-behance-project-cover", // 68 impr, pos 19.0
  "/how-to/compress-pdf-for-college-admission", // pos 9.4
  "/how-to/compress-pdf-for-gst-registration", // pos 7.8
  "/how-to/resize-image-for-github-social-preview", // pos 5.0
  "/guides/calculator/how-to-calculate-daily-calorie-needs", // pos 7.0
  "/guides/pdf/how-to-add-a-watermark-to-a-pdf", // pos 7.0
  // Restored on the 2026-09-13 re-derivation after taking their first click.
  // Pinned so a later re-derivation cannot silently withdraw them again while
  // that click is still inside the rolling window.
  "/guides/image/how-to-upscale-an-image", // 1 click, 18 impr
  "/guides/audio/transcribe-audio-without-uploading", // 1 click, 22 impr
];

describe("noindex list", () => {
  it("never withdraws a page that was earning", () => {
    const wrong = EARNING.filter((p) => isNoindexed(p));
    expect(wrong).toEqual([]);
  });

  it("only ever withdraws guide and how-to leaf articles", () => {
    const stray = NOINDEX_PATHS.filter((p) => {
      const seg = p.replace(/^\/|\/$/g, "").split("/");
      const guideLeaf = p.startsWith("/guides/") && seg.length === 3;
      const howToLeaf = p.startsWith("/how-to/") && seg.length === 2;
      return !guideLeaf && !howToLeaf;
    });
    expect(stray).toEqual([]);
  });

  it("never withdraws a tool page", () => {
    // Tool pages stuck at position 80 are waiting on authority, not on being
    // removed — they are the pages meant to recover later.
    const hrefs = allTools.concat(calculatorTools).map((t) => t.href);
    expect(NOINDEX_PATHS.filter((p) => hrefs.indexOf(p) !== -1)).toEqual([]);
  });

  it("never withdraws a category hub", () => {
    for (const hub of ["/guides", "/how-to", "/guides/pdf", "/guides/image"]) {
      expect(isNoindexed(hub)).toBe(false);
    }
  });

  it("has no duplicate entries", () => {
    expect(NOINDEX_PATHS.length).toBe(new Set(NOINDEX_PATHS).size);
  });
});

describe("toolMeta robots", () => {
  const meta = (path: string) =>
    toolMeta({ title: "t", description: "d", path });

  it("marks a withdrawn page noindex but still follow", () => {
    expect(NOINDEX_PATHS.length).toBeGreaterThan(0);
    // follow matters: the page stays live and keeps passing equity to the tools
    // it links to.
    expect(meta(NOINDEX_PATHS[0]).robots).toEqual({ index: false, follow: true });
  });

  it("leaves every other page's robots untouched", () => {
    expect(meta("/fun/fake-error").robots).toBeUndefined();
    expect(meta("/pdf/merge").robots).toBeUndefined();
  });

  it("still emits a canonical for a withdrawn page", () => {
    expect(meta(NOINDEX_PATHS[0]).alternates?.canonical).toContain(
      NOINDEX_PATHS[0]
    );
  });
});

describe("sitemap", () => {
  it("lists no withdrawn URL", () => {
    // A noindexed URL in a sitemap asks Google to crawl a page it is
    // simultaneously told not to index.
    const urls = guideEntries()
      .concat(toolEntries())
      .map((e) => e.url.replace("https://www.getfreetoolsai.com", ""));
    const leaked = urls.filter((u) => isNoindexed(u));
    expect(leaked).toEqual([]);
  });

  it("still lists the pages that were earning", () => {
    const urls = guideEntries()
      .concat(toolEntries())
      .map((e) => e.url.replace("https://www.getfreetoolsai.com", ""));
    for (const p of EARNING) {
      expect(urls, `${p} should stay in the sitemap`).toContain(p);
    }
  });
});
