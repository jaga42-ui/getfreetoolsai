import { describe, expect, it } from "vitest";
import {
  BASE_FONT_SIZE,
  MARGIN,
  MAX_TEXT_WIDTH,
  SIZE_JITTER,
  SPACE_WIDTH,
  buildScraps,
  canvasSize,
  decodeRansomState,
  encodeRansomState,
  layoutLines,
  measureScraps,
  ransomDefaults,
  rotatedBounds,
  type RansomContent,
  type Scrap,
} from "@/lib/ransomNote";

/**
 * Stand-in for `ctx.measureText`. Deliberately font-dependent: a wider glyph
 * for a bigger size, so a test that measured under the wrong font would show
 * up as a wrong width rather than silently passing.
 */
const measure = (s: Scrap) => s.size * 0.62;

function laid(c: RansomContent, maxWidth = MAX_TEXT_WIDTH) {
  const scraps = measureScraps(buildScraps(c), measure);
  return { scraps, lines: layoutLines(c.text, scraps, maxWidth) };
}

describe("buildScraps", () => {
  it("makes one scrap per non-space character", () => {
    const c = { ...ransomDefaults, text: "ab cd" };
    expect(buildScraps(c).map((s) => s.ch).join("")).toBe("abcd");
  });

  it("is deterministic for the same text and variation", () => {
    const c = { ...ransomDefaults, text: "pay up" };
    const a = buildScraps(c);
    const b = buildScraps(c);
    expect(a.map((s) => s.font)).toEqual(b.map((s) => s.font));
    expect(a.map((s) => s.rotate)).toEqual(b.map((s) => s.rotate));
  });

  it("reshuffles when the variation changes", () => {
    const base = { ...ransomDefaults, text: "pay up" };
    const a = buildScraps(base).map((s) => s.font).join("|");
    const b = buildScraps({ ...base, variation: 1 }).map((s) => s.font).join("|");
    expect(a).not.toBe(b);
  });

  it("keeps every glyph upright when jitter is off", () => {
    const c = { ...ransomDefaults, text: "steady hands", jitter: false };
    expect(buildScraps(c).every((s) => s.rotate === 0)).toBe(true);
  });

  it("keeps sizes within the declared jitter band", () => {
    const c = { ...ransomDefaults, text: "the quick brown fox jumps over it" };
    for (const s of buildScraps(c)) {
      expect(s.size).toBeGreaterThanOrEqual(BASE_FONT_SIZE - SIZE_JITTER);
      expect(s.size).toBeLessThanOrEqual(BASE_FONT_SIZE + SIZE_JITTER);
    }
  });

  it("names the scrap's own size in its font string", () => {
    // Measure/draw parity depends on this: the renderer sets ctx.font from the
    // scrap, so the string must describe the scrap it belongs to.
    for (const s of buildScraps({ ...ransomDefaults, text: "parity" })) {
      expect(s.font).toContain(`${s.size}px `);
    }
  });
});

describe("rotatedBounds", () => {
  it("is the identity for an untilted box", () => {
    const r = rotatedBounds(40, 20, 0);
    expect(r.w).toBeCloseTo(40);
    expect(r.h).toBeCloseTo(20);
  });

  it("grows a box in both axes once it is tilted", () => {
    const r = rotatedBounds(40, 20, Math.PI / 12);
    expect(r.w).toBeGreaterThan(40);
    expect(r.h).toBeGreaterThan(20);
  });

  it("swaps the axes at a quarter turn", () => {
    const r = rotatedBounds(40, 20, Math.PI / 2);
    expect(r.w).toBeCloseTo(20);
    expect(r.h).toBeCloseTo(40);
  });
});

describe("measureScraps", () => {
  it("measures each glyph under its own font", () => {
    const seen: string[] = [];
    const scraps = buildScraps({ ...ransomDefaults, text: "abc" });
    measureScraps(scraps, (s) => {
      seen.push(s.font);
      return measure(s);
    });
    expect(seen).toEqual(scraps.map((s) => s.font));
  });

  it("gives a tilted scrap outer bounds at least its box size", () => {
    const scraps = measureScraps(
      buildScraps({ ...ransomDefaults, text: "tilted" }),
      measure
    );
    for (const s of scraps) {
      expect(s.outerW).toBeGreaterThanOrEqual(s.boxW - 1e-9);
      expect(s.outerH).toBeGreaterThanOrEqual(s.boxH - 1e-9);
    }
  });
});

describe("layoutLines", () => {
  it("keeps a short note on one line", () => {
    const { lines } = laid({ ...ransomDefaults, text: "pay up" });
    expect(lines).toHaveLength(1);
  });

  it("places every non-space glyph exactly once", () => {
    const c = { ...ransomDefaults, text: "meet me at the old pier at midnight" };
    const { scraps, lines } = laid(c, 300);
    const placed = lines.flatMap((l) => l.items.map((p) => p.s.ch)).join("");
    expect(placed).toBe(scraps.map((s) => s.ch).join(""));
  });

  it("never exceeds the max width unless a single word does", () => {
    const c = { ...ransomDefaults, text: "meet me at the old pier at midnight" };
    const { lines } = laid(c, 320);
    expect(lines.length).toBeGreaterThan(1);
    for (const l of lines) {
      const singleWord = l.items.length && l.items[0].x === 0 && l.width > 320;
      if (!singleWord) expect(l.width).toBeLessThanOrEqual(320);
    }
  });

  it("opens each line at x=0 and advances monotonically", () => {
    const c = { ...ransomDefaults, text: "one two three four five six seven" };
    const { lines } = laid(c, 300);
    for (const l of lines) {
      expect(l.items[0].x).toBe(0);
      for (let i = 1; i < l.items.length; i++) {
        expect(l.items[i].x).toBeGreaterThan(l.items[i - 1].x);
      }
    }
  });

  it("inserts a word gap between words but not within one", () => {
    const { lines } = laid({ ...ransomDefaults, text: "ab cd" });
    const [a, b, c2, d] = lines[0].items;
    expect(b.x - a.x).toBeCloseTo(a.s.outerW);
    // The gap lands between the two words.
    expect(c2.x - (b.x + b.s.outerW)).toBeCloseTo(SPACE_WIDTH);
    expect(d.x - c2.x).toBeCloseTo(c2.s.outerW);
  });

  it("reports a width that matches the last scrap's right edge", () => {
    const { lines } = laid({ ...ransomDefaults, text: "hello there friend" }, 300);
    for (const l of lines) {
      const last = l.items[l.items.length - 1];
      expect(l.width).toBeCloseTo(last.x + last.s.outerW);
    }
  });

  it("returns nothing for empty or whitespace-only text", () => {
    expect(laid({ ...ransomDefaults, text: "   " }).lines).toHaveLength(0);
  });
});

describe("canvasSize", () => {
  it("derives height from the line boxes rather than a fixed tally", () => {
    // The regression this guards: hand-counted heights that ignore how tall a
    // tilted scrap actually is, which runs the last line off the bottom.
    const c = { ...ransomDefaults, text: "meet me at the old pier at midnight" };
    const { lines } = laid(c, 300);
    const { h } = canvasSize(lines);
    const content = lines.reduce((a, l) => a + l.height, 0);
    expect(h).toBeGreaterThanOrEqual(content + MARGIN * 2);
  });

  it("leaves a full margin on both sides of the widest line", () => {
    const { lines } = laid({ ...ransomDefaults, text: "pay up or else" });
    const { w } = canvasSize(lines);
    const widest = Math.max(...lines.map((l) => l.width));
    // canvasSize rounds the width up, so the slack is the two margins plus
    // under a pixel of rounding — never less than the margins.
    expect(w - widest).toBeGreaterThanOrEqual(MARGIN * 2);
    expect(w - widest).toBeLessThan(MARGIN * 2 + 1);
  });

  it("every line fits inside the canvas once centred", () => {
    const c = { ...ransomDefaults, text: "we have your stapler and we are serious" };
    const { lines } = laid(c, 320);
    const { w, h } = canvasSize(lines);
    let y = MARGIN;
    for (const l of lines) {
      const originX = (w - l.width) / 2;
      expect(originX).toBeGreaterThanOrEqual(MARGIN - 1e-6);
      const last = l.items[l.items.length - 1];
      expect(originX + last.x + last.s.outerW).toBeLessThanOrEqual(w - MARGIN + 1e-6);
      y += l.height;
    }
    expect(y).toBeLessThanOrEqual(h - MARGIN + 1e-6);
  });

  it("stays positive for an empty note", () => {
    const { w, h } = canvasSize([]);
    expect(w).toBeGreaterThan(0);
    expect(h).toBeGreaterThan(0);
  });
});

describe("share state", () => {
  it("round-trips a note", () => {
    const c: RansomContent = {
      text: "bring the money",
      background: "dark",
      variation: 3,
      jitter: false,
    };
    expect(decodeRansomState(encodeRansomState(c))).toEqual(c);
  });

  it("round-trips text that needs escaping", () => {
    const c = { ...ransomDefaults, text: "50% & rising — now?" };
    expect(decodeRansomState(encodeRansomState(c)).text).toBe(c.text);
  });

  it("falls back to the defaults for junk input", () => {
    expect(decodeRansomState("bg=neon&v=abc")).toEqual(ransomDefaults);
  });

  it("defaults an absent jitter flag to on", () => {
    expect(decodeRansomState("t=hi").jitter).toBe(true);
  });
});
