import { describe, it, expect } from "vitest";

import {
  diffLines,
  diffWords,
  pairRows,
  splitLines,
  type DiffRow,
} from "@/lib/diff";

/** Compact view of a diff: one "op:left|right" string per row. */
const shape = (rows: DiffRow[]) =>
  rows.map((r) => `${r.op}:${r.left ?? ""}|${r.right ?? ""}`);

describe("splitLines", () => {
  it("normalizes CRLF so a Windows file does not read as fully changed", () => {
    expect(splitLines("a\r\nb\r\nc")).toEqual(["a", "b", "c"]);
  });

  it("normalizes lone CR (classic Mac line endings)", () => {
    expect(splitLines("a\rb")).toEqual(["a", "b"]);
  });

  it("keeps trailing empty lines", () => {
    expect(splitLines("a\n\n")).toEqual(["a", "", ""]);
  });

  it("treats empty input as zero lines, not one blank line", () => {
    // Otherwise an empty textarea diffs as "1 line removed" against anything.
    expect(splitLines("")).toEqual([]);
  });
});

describe("diffLines", () => {
  it("reports identical text as entirely unchanged", () => {
    const { rows, stats } = diffLines("a\nb\nc", "a\nb\nc");
    expect(rows.every((r) => r.op === "equal")).toBe(true);
    expect(stats).toMatchObject({ added: 0, removed: 0, unchanged: 3 });
  });

  it("finds a single inserted line", () => {
    const { rows, stats } = diffLines("a\nc", "a\nb\nc");
    expect(shape(rows)).toEqual(["equal:a|a", "insert:|b", "equal:c|c"]);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(0);
  });

  it("finds a single deleted line", () => {
    const { rows, stats } = diffLines("a\nb\nc", "a\nc");
    expect(shape(rows)).toEqual(["equal:a|a", "delete:b|", "equal:c|c"]);
    expect(stats.removed).toBe(1);
  });

  it("represents a changed line as a delete plus an insert", () => {
    const { rows } = diffLines("a\nb\nc", "a\nB\nc");
    expect(shape(rows)).toEqual([
      "equal:a|a",
      "delete:b|",
      "insert:|B",
      "equal:c|c",
    ]);
  });

  it("numbers lines independently on each side", () => {
    const { rows } = diffLines("a\nb\nc", "a\nc");
    const del = rows.find((r) => r.op === "delete")!;
    expect(del.leftNumber).toBe(2);
    expect(del.rightNumber).toBeNull();
    const last = rows[rows.length - 1];
    expect(last.leftNumber).toBe(3);
    expect(last.rightNumber).toBe(2);
  });

  it("handles one side being empty", () => {
    // Both lines count, and no phantom removal for the empty side.
    expect(diffLines("", "a\nb").stats).toMatchObject({ added: 2, removed: 0 });
    expect(diffLines("a\nb", "").stats).toMatchObject({ added: 0, removed: 2 });
  });

  it("ignores case when asked", () => {
    const strict = diffLines("Hello", "hello");
    expect(strict.stats.unchanged).toBe(0);
    const loose = diffLines("Hello", "hello", { ignoreCase: true });
    expect(loose.stats.unchanged).toBe(1);
    // The row still shows the ORIGINAL text, not the normalized form.
    expect(loose.rows[0].left).toBe("Hello");
    expect(loose.rows[0].right).toBe("hello");
  });

  it("ignores whitespace when asked", () => {
    const loose = diffLines("  a   b  ", "a b", { ignoreWhitespace: true });
    expect(loose.stats.unchanged).toBe(1);
    expect(loose.rows[0].left).toBe("  a   b  ");
  });

  it("stays exact for a small edit inside a large document", () => {
    const big = Array.from({ length: 5000 }, (_, i) => `line ${i}`).join("\n");
    const edited = big.replace("line 2500", "line 2500 CHANGED");
    const { stats } = diffLines(big, edited);
    // Prefix/suffix trimming means the LCS never sees 5000x5000.
    expect(stats.approximate).toBe(false);
    expect(stats.added).toBe(1);
    expect(stats.removed).toBe(1);
  });

  it("falls back and flags approximate when the differing middle is huge", () => {
    const a = Array.from({ length: 2200 }, (_, i) => `a${i}`).join("\n");
    const b = Array.from({ length: 2200 }, (_, i) => `b${i}`).join("\n");
    const { stats } = diffLines(a, b);
    expect(stats.approximate).toBe(true);
    expect(stats.added).toBe(2200);
    expect(stats.removed).toBe(2200);
  });
});

describe("diffWords", () => {
  it("marks only the words that changed", () => {
    const { left, right } = diffWords(
      "the quick brown fox",
      "the slow brown fox"
    );
    // Tokens carry their trailing space, so the highlight covers "quick " —
    // that is deliberate: it keeps a multi-word change as one unbroken run.
    expect(left.filter((p) => p.changed).map((p) => p.text)).toEqual(["quick "]);
    expect(right.filter((p) => p.changed).map((p) => p.text)).toEqual(["slow "]);
  });

  it("round-trips: joining the parts rebuilds each original line", () => {
    const a = "one  two\tthree";
    const b = "one two three four";
    const { left, right } = diffWords(a, b);
    expect(left.map((p) => p.text).join("")).toBe(a);
    expect(right.map((p) => p.text).join("")).toBe(b);
  });

  it("merges adjacent parts with the same state", () => {
    const { right } = diffWords("a", "a b c");
    // "b c" should be one changed part, not two split around a space.
    expect(right.filter((p) => p.changed).length).toBe(1);
  });

  it("does not let a matched space fragment an otherwise-complete change", () => {
    // Regression: with whitespace as its own token the LCS matched the space in
    // "delete me" against a space in "brand new line", splitting both sides
    // into disconnected highlights.
    const { left, right } = diffWords("delete me", "brand new line");
    expect(left.filter((p) => p.changed).map((p) => p.text)).toEqual([
      "delete me",
    ]);
    expect(right.filter((p) => p.changed).map((p) => p.text)).toEqual([
      "brand new line",
    ]);
  });

  it("matches a trailing word against the same word mid-line", () => {
    // "fox" ends the left line (no trailing space) but is followed by one on
    // the right; they must still compare as equal.
    const { left } = diffWords("the brown fox", "the brown fox jumps");
    expect(left.every((p) => !p.changed)).toBe(true);
  });

  it("handles an empty side", () => {
    const { left, right } = diffWords("", "hello");
    expect(left).toEqual([]);
    expect(right.map((p) => p.text).join("")).toBe("hello");
  });
});

describe("pairRows", () => {
  it("pairs a delete run with the following insert run", () => {
    const { rows } = diffLines("a\nb\nc", "a\nB\nc");
    const paired = pairRows(rows);
    expect(paired).toHaveLength(3);
    expect(paired[1]).toMatchObject({
      op: "delete",
      left: "b",
      right: "B",
      leftNumber: 2,
      rightNumber: 2,
    });
  });

  it("leaves unmatched deletes and inserts on their own rows", () => {
    const { rows } = diffLines("a\nb\nc\nd", "a\nX");
    const paired = pairRows(rows);
    // b,c,d deleted against X inserted: one paired row, two lone deletes.
    const lone = paired.filter((r) => r.right === null);
    expect(lone).toHaveLength(2);
  });

  it("is a no-op on an all-equal diff", () => {
    const { rows } = diffLines("a\nb", "a\nb");
    expect(pairRows(rows)).toEqual(rows);
  });

  it("does not pair an insert run that has no preceding delete", () => {
    const { rows } = diffLines("a\nc", "a\nb\nc");
    const paired = pairRows(rows);
    expect(paired.find((r) => r.op === "insert")).toMatchObject({
      left: null,
      right: "b",
    });
  });
});
