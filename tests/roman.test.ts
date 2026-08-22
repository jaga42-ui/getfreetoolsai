import { describe, it, expect } from "vitest";

import { toRoman, fromRoman, explain, ROMAN_MAX } from "@/lib/roman";

const roman = (n: number) => {
  const r = toRoman(n);
  if (!r.ok) throw new Error(r.error);
  return r.value;
};

describe("toRoman", () => {
  it.each([
    [1, "I"],
    [4, "IV"],
    [9, "IX"],
    [14, "XIV"],
    [40, "XL"],
    [90, "XC"],
    [400, "CD"],
    [900, "CM"],
    [1987, "MCMLXXXVII"],
    [2024, "MMXXIV"],
    [3999, "MMMCMXCIX"],
  ])("converts %i to %s", (n, expected) => {
    expect(roman(n)).toBe(expected);
  });

  it("rejects zero with an explanation rather than a generic error", () => {
    const r = toRoman(0);
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/no symbol for zero/i);
  });

  it("rejects negatives", () => {
    expect(toRoman(-5).ok).toBe(false);
  });

  it("rejects values above the standard maximum", () => {
    expect(toRoman(4000).ok).toBe(false);
    expect(toRoman(ROMAN_MAX).ok).toBe(true);
  });

  it("rejects non-integers", () => {
    expect(toRoman(1.5).ok).toBe(false);
    expect(toRoman(NaN).ok).toBe(false);
  });
});

describe("fromRoman", () => {
  it.each([
    ["I", "1"],
    ["IV", "4"],
    ["MCMLXXXVII", "1987"],
    ["MMMCMXCIX", "3999"],
  ])("converts %s to %s", (input, expected) => {
    const r = fromRoman(input);
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe(expected);
  });

  it("accepts lowercase and surrounding whitespace", () => {
    const r = fromRoman("  mcmxc  ");
    expect(r.ok).toBe(true);
    if (r.ok) expect(r.value).toBe("1990");
  });

  it("rejects symbols outside the Roman set", () => {
    const r = fromRoman("MCMA");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/not a Roman numeral symbol/i);
  });

  it("rejects non-canonical repetition like IIII", () => {
    // Parses to 4, but 4 is written IV — accepting it would defeat the point
    // of using this to check an answer.
    const r = fromRoman("IIII");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/IV/);
  });

  it("rejects invalid subtractive pairs like IC", () => {
    const r = fromRoman("IC");
    expect(r.ok).toBe(false);
  });

  it("rejects an empty string", () => {
    expect(fromRoman("   ").ok).toBe(false);
  });

  it("round-trips every value in range", () => {
    // The strongest guarantee available: encode then decode all 3999 values.
    for (let n = 1; n <= ROMAN_MAX; n++) {
      const r = fromRoman(roman(n));
      expect(r.ok, `failed at ${n}`).toBe(true);
      if (r.ok) expect(r.value).toBe(String(n));
    }
  });
});

describe("explain", () => {
  it("breaks a numeral into its additive parts", () => {
    expect(explain(2024)).toEqual([
      { symbol: "M", value: 1000 },
      { symbol: "M", value: 1000 },
      { symbol: "X", value: 10 },
      { symbol: "X", value: 10 },
      { symbol: "IV", value: 4 },
    ]);
  });

  it("parts always sum back to the original number", () => {
    for (const n of [1, 49, 444, 1987, 3999]) {
      const sum = explain(n).reduce((t, p) => t + p.value, 0);
      expect(sum).toBe(n);
    }
  });

  it("parts joined together spell the numeral", () => {
    for (const n of [4, 49, 1987, 3999]) {
      expect(explain(n).map((p) => p.symbol).join("")).toBe(roman(n));
    }
  });
});
