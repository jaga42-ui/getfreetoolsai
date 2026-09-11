import { describe, it, expect } from "vitest";
import {
  clampTilt,
  clippingDefaults,
  decodeClippingState,
  encodeClippingState,
  fitFontSize,
  mastTracking,
  mulberry32,
  seedFrom,
  splitColumns,
  TILT_LIMIT,
  type ClippingContent,
} from "@/lib/newspaperClipping";

describe("shareable clipping state", () => {
  it("round-trips a clipping through the query string", () => {
    const c: ClippingContent = {
      paper: "The Evening Star",
      date: "3 March 1974",
      headline: "Man Bites Dog, Again",
      body: "First para.\n\nSecond para, with a comma & an ampersand.",
      tilt: 4,
      aged: false,
    };
    expect(decodeClippingState(encodeClippingState(c))).toEqual(c);
  });

  it("preserves paragraph breaks and punctuation that need escaping", () => {
    const c = { ...clippingDefaults, body: "a=1 & b=2\n\nnext?para#here" };
    expect(decodeClippingState(encodeClippingState(c)).body).toBe(c.body);
  });

  it("falls back to defaults for anything absent", () => {
    expect(decodeClippingState("")).toEqual(clippingDefaults);
  });

  it("keeps the URL short by omitting values that match the defaults", () => {
    // The link gets pasted into chat apps that truncate, so unchanged fields
    // must not be spent on the query string.
    const q = encodeClippingState({ ...clippingDefaults, paper: "" });
    expect(q).not.toContain("r=");
    expect(q).not.toContain("a=");
    expect(q).not.toContain("p=");
  });

  it("ignores a non-numeric tilt rather than rendering NaN", () => {
    expect(decodeClippingState("r=banana").tilt).toBe(clippingDefaults.tilt);
  });

  it("clamps a tilt supplied out of range in a hand-edited link", () => {
    expect(decodeClippingState("r=90").tilt).toBe(TILT_LIMIT);
    expect(decodeClippingState("r=-90").tilt).toBe(-TILT_LIMIT);
  });
});

describe("clampTilt", () => {
  it("passes through in-range values and rejects non-finite ones", () => {
    expect(clampTilt(3)).toBe(3);
    expect(clampTilt(Number.NaN)).toBe(0);
    expect(clampTilt(Number.POSITIVE_INFINITY)).toBe(0);
  });
});

describe("splitColumns", () => {
  it("balances lines across two columns, left column taking the odd one", () => {
    expect(splitColumns(["a", "b", "c", "d", "e"])).toEqual([
      ["a", "b", "c"],
      ["d", "e"],
    ]);
  });

  it("handles an empty story", () => {
    expect(splitColumns([])).toEqual([[], []]);
  });
});

describe("fitFontSize", () => {
  it("shrinks the masthead until it fits on one line", () => {
    // Stand-in for canvas measurement: width grows linearly with font size.
    const measure = (size: number) => size * 10;
    expect(fitFontSize(measure, 300, 52)).toBe(30);
  });

  it("keeps the starting size when it already fits", () => {
    expect(fitFontSize((s) => s, 1000, 52)).toBe(52);
  });

  it("never shrinks past the floor, even for an absurd masthead", () => {
    expect(fitFontSize(() => 99999, 10, 52, 18)).toBe(18);
  });
});

describe("seeded texture", () => {
  it("produces the same torn edge for the same clipping", () => {
    // Unseeded randomness would make the outline crawl on every keystroke.
    const a = mulberry32(seedFrom("The Herald|Headline"));
    const b = mulberry32(seedFrom("The Herald|Headline"));
    const seqA = [a(), a(), a()];
    const seqB = [b(), b(), b()];
    expect(seqA).toEqual(seqB);
  });

  it("produces a different edge for different text", () => {
    expect(seedFrom("The Herald")).not.toBe(seedFrom("The Gazette"));
  });

  it("stays within [0,1)", () => {
    const r = mulberry32(seedFrom("x"));
    for (let i = 0; i < 500; i++) {
      const v = r();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});

describe("masthead fitting", () => {
  it("shrinks tracking with the font so a long masthead can converge", () => {
    // Regression: tracking was a flat 2px applied at draw time but not at
    // measure time, so a 56-character paper name was fitted as if it were
    // ~112px narrower and ran off both edges of the paper.
    expect(mastTracking(52)).toBe("2.08px");
    expect(Number.parseFloat(mastTracking(14))).toBeLessThan(
      Number.parseFloat(mastTracking(52))
    );
  });

  it("fits a long masthead once tracking is measured with the glyphs", () => {
    const CHARS = 56;
    const CONTENT_W = 616; // 720 - 2 * (EDGE + PAD)
    // Same shape as the canvas measurement: glyph width plus tracking per
    // character, both scaling with the font size.
    const measure = (size: number) =>
      CHARS * (size * 0.55 + Number.parseFloat(mastTracking(size)));

    const fitted = fitFontSize(measure, CONTENT_W, 52, 14);
    expect(measure(fitted)).toBeLessThanOrEqual(CONTENT_W);
    // It should shrink, but not collapse to the floor for a merely long name.
    expect(fitted).toBeGreaterThan(14);
    expect(fitted).toBeLessThan(52);
  });

  it("ignoring tracking at measure time overflows — the bug this guards", () => {
    const CHARS = 56;
    const CONTENT_W = 616;
    const naive = (size: number) => CHARS * (size * 0.55);
    const real = (size: number) =>
      CHARS * (size * 0.55 + Number.parseFloat(mastTracking(size)));
    const fitted = fitFontSize(naive, CONTENT_W, 52, 14);
    expect(real(fitted)).toBeGreaterThan(CONTENT_W);
  });
});
