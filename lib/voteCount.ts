/**
 * Forum-style vote count formatting: 12400 -> "12.4k".
 *
 * Extracted from the fake Reddit generator so it can be tested in Node — it is
 * the only piece of that component that is not canvas drawing, and the rounding
 * boundaries are exactly the sort of thing that looks right until someone posts
 * a screenshot reading "1000k".
 *
 * One decimal is kept at every magnitude, because that is what the real thing
 * does — 12.4k and 87.6k, not 12k and 88k. A trailing ".0" is dropped so 2000
 * renders as "2k" rather than "2.0k".
 */
export function formatVotes(n: number): string {
  if (!Number.isFinite(n)) return "0";

  // Promote before formatting, not after: 999,999 is 999.999k, which rounds to
  // "1000.0k". Deciding the unit from the *rounded* value is what stops that.
  const k = n / 1000;
  if (Math.abs(round1(k)) >= 1000) return `${trim(round1(n / 1_000_000))}m`;
  if (Math.abs(n) >= 1_000_000) return `${trim(round1(n / 1_000_000))}m`;
  if (Math.abs(n) >= 1000) return `${trim(round1(k))}k`;

  return String(Math.round(n));
}

const round1 = (v: number) => Math.round(v * 10) / 10;

/** One decimal, minus a trailing ".0" so 12.0k renders as 12k. */
function trim(v: number): string {
  const s = v.toFixed(1);
  return s.endsWith(".0") ? s.slice(0, -2) : s;
}
