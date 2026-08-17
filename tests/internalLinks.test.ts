import { describe, it, expect } from "vitest";
import { relatedTools, relatedCalculators, allTools, calculatorTools } from "@/lib/tools";

const readyTools = allTools.filter((t) => t.ready);

/**
 * Build the contextual internal link graph the way the pages render it: every
 * ready tool page emits `relatedTools()`, and calculator pages additionally go
 * through `relatedCalculators()` (they share the same resolver, but assert both
 * so a future divergence is caught).
 *
 * Returns href -> the set of pages linking to it, as a plain record so the test
 * compiles under the project's default ES5 target.
 */
function inboundLinks(): Record<string, string[]> {
  const inbound: Record<string, string[]> = {};
  for (const t of readyTools) inbound[t.href] = [];

  const record = (from: string, to: string) => {
    const list = inbound[to];
    if (list && !list.includes(from)) list.push(from);
  };

  for (const t of readyTools)
    for (const r of relatedTools(t.href)) record(t.href, r.href);

  for (const t of calculatorTools.filter((c) => c.ready))
    for (const r of relatedCalculators(t.href)) record(t.href, r.href);

  return inbound;
}

describe("contextual internal link graph", () => {
  it("leaves no ready tool page orphaned", () => {
    const inbound = inboundLinks();
    const orphans = Object.keys(inbound).filter((href) => inbound[href].length === 0);
    expect(orphans).toEqual([]);
  });

  it("spreads link equity instead of concentrating it in a few pages", () => {
    const inbound = inboundLinks();
    const total = Object.keys(inbound).reduce((n, href) => n + inbound[href].length, 0);

    // The bug this guards: `calculatorTools.slice(0, 4)` gave four pages a link
    // from every calculator on the site while the rest got none. No single page
    // should hold more than 15% of all contextual links.
    const hogs = Object.keys(inbound)
      .filter((href) => inbound[href].length / total > 0.15)
      .map((href) => `${href} (${((inbound[href].length / total) * 100).toFixed(1)}%)`);
    expect(hogs).toEqual([]);
  });

  it("keeps the India small-savings cluster mutually linked", () => {
    // These are the site's highest-impression pages and previously received no
    // sibling links at all.
    const cluster = [
      "/calculators/ssy",
      "/calculators/nsc",
      "/calculators/scss",
      "/calculators/ppf",
      "/calculators/fd",
      "/calculators/rd",
    ];

    for (const href of cluster) {
      const related = relatedCalculators(href).map((t) => t.href);
      const siblings = related.filter((r) => cluster.indexOf(r) !== -1);
      expect(siblings.length, `${href} should link to its scheme siblings`).toBeGreaterThanOrEqual(3);
    }
  });

  it("never returns the current page, duplicates, or unready tools", () => {
    for (const t of readyTools) {
      const related = relatedTools(t.href);
      const hrefs = related.map((r) => r.href);
      expect(hrefs).not.toContain(t.href);
      expect(hrefs.filter((h, i) => hrefs.indexOf(h) !== i)).toEqual([]);
      expect(related.every((r) => r.ready)).toBe(true);
    }
  });

  it("always fills the requested number of slots", () => {
    for (const t of readyTools) expect(relatedTools(t.href)).toHaveLength(4);
  });
});
