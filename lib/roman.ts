/**
 * Roman numeral conversion, both directions.
 *
 * Standard (subtractive) notation only, 1–3999. There is no zero and no
 * negative in the system, and 3999 (MMMCMXCIX) is the largest value
 * expressible without the vinculum overline notation that plain text cannot
 * represent.
 */

export const ROMAN_MIN = 1;
export const ROMAN_MAX = 3999;

const VALUES: [number, string][] = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

const SYMBOL_VALUE: Record<string, number> = {
  I: 1,
  V: 5,
  X: 10,
  L: 50,
  C: 100,
  D: 500,
  M: 1000,
};

export type ConversionResult =
  | { ok: true; value: string }
  | { ok: false; error: string };

/** Convert an integer (1–3999) to a Roman numeral. */
export function toRoman(n: number): ConversionResult {
  if (!Number.isFinite(n) || !Number.isInteger(n)) {
    return { ok: false, error: "Enter a whole number." };
  }
  if (n < ROMAN_MIN) {
    return {
      ok: false,
      error:
        n === 0
          ? "Roman numerals have no symbol for zero."
          : "Roman numerals cannot represent negative numbers.",
    };
  }
  if (n > ROMAN_MAX) {
    return {
      ok: false,
      error: `The largest standard Roman numeral is ${ROMAN_MAX} (MMMCMXCIX).`,
    };
  }

  let remaining = n;
  let out = "";
  for (const [value, symbol] of VALUES) {
    while (remaining >= value) {
      out += symbol;
      remaining -= value;
    }
  }
  return { ok: true, value: out };
}

/**
 * Convert a Roman numeral to an integer.
 *
 * Validates strictly rather than accepting anything parseable: "IIII" and
 * "IC" both have an obvious intended reading, but neither is valid notation,
 * and silently accepting them would make this useless for checking homework —
 * which is most of what a converter like this gets used for. The round-trip
 * check at the end is what enforces that.
 */
export function fromRoman(input: string): ConversionResult {
  const s = input.trim().toUpperCase();
  if (!s) return { ok: false, error: "Enter a Roman numeral." };

  for (const ch of s) {
    if (!(ch in SYMBOL_VALUE)) {
      return {
        ok: false,
        error: `"${ch}" is not a Roman numeral symbol. Use only I, V, X, L, C, D and M.`,
      };
    }
  }

  let total = 0;
  for (let i = 0; i < s.length; i++) {
    const current = SYMBOL_VALUE[s[i]];
    const next = i + 1 < s.length ? SYMBOL_VALUE[s[i + 1]] : 0;
    // A smaller symbol before a larger one is subtracted (IV, IX, XL...).
    total += current < next ? -current : current;
  }

  if (total < ROMAN_MIN || total > ROMAN_MAX) {
    return { ok: false, error: "That is outside the range 1–3999." };
  }

  // Canonical form check: if re-encoding the total does not reproduce the
  // input, the input was not valid notation even though it parsed.
  const canonical = toRoman(total);
  if (!canonical.ok || canonical.value !== s) {
    return {
      ok: false,
      error: `Not valid Roman notation. Did you mean ${
        canonical.ok ? canonical.value : ""
      }?`,
    };
  }

  return { ok: true, value: String(total) };
}

/** Break a numeral into its place-value parts, for the explanation panel. */
export function explain(n: number): { symbol: string; value: number }[] {
  const parts: { symbol: string; value: number }[] = [];
  let remaining = n;
  for (const [value, symbol] of VALUES) {
    while (remaining >= value) {
      parts.push({ symbol, value });
      remaining -= value;
    }
  }
  return parts;
}
