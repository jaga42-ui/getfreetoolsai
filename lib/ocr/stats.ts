/**
 * Small statistics helpers shared by layout and table analysis.
 *
 * Lives in its own module to break the import cycle that would otherwise form:
 * layout needs table detection, and table detection needs the same summary
 * statistics layout uses.
 */

/** Median of a list. Returns 0 for an empty list rather than NaN. */
export function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = nums.slice().sort((a, b) => a - b);
  const m = Math.floor(s.length / 2);
  return s.length % 2 ? s[m] : (s[m - 1] + s[m]) / 2;
}

/** Most frequently occurring value. Returns 0 for an empty list. */
export function mode(nums: number[]): number {
  if (!nums.length) return 0;
  const counts = new Map<number, number>();
  let best = nums[0];
  let bestCount = 0;
  for (const n of nums) {
    const c = (counts.get(n) ?? 0) + 1;
    counts.set(n, c);
    if (c > bestCount) {
      bestCount = c;
      best = n;
    }
  }
  return best;
}
