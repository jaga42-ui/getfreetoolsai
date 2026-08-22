/**
 * Line and word diff for the text compare tool.
 *
 * Pure logic, no DOM: the component renders whatever this returns, and the
 * tests exercise it directly.
 */

export type DiffOp = "equal" | "insert" | "delete";

/** One rendered row of a side-by-side diff. */
export type DiffRow = {
  op: DiffOp;
  /** 1-based line number in the left document; null for inserted lines. */
  leftNumber: number | null;
  /** 1-based line number in the right document; null for deleted lines. */
  rightNumber: number | null;
  left: string | null;
  right: string | null;
};

export type DiffStats = {
  added: number;
  removed: number;
  unchanged: number;
  /**
   * True when the inputs were too large for an exact diff and the cheap
   * fallback ran instead. The UI surfaces this rather than quietly presenting
   * an approximate result as exact.
   */
  approximate: boolean;
};

export type DiffResult = { rows: DiffRow[]; stats: DiffStats };

export type DiffOptions = {
  /** Treat "Cat" and "cat" as the same line. */
  ignoreCase?: boolean;
  /** Ignore leading/trailing whitespace and collapse internal runs. */
  ignoreWhitespace?: boolean;
};

/**
 * Largest LCS table we are willing to allocate, in cells.
 *
 * The table is Uint32Array, so 4M cells is 16MB — near the ceiling of what is
 * reasonable to hold on a mid-range phone, which is where most of this site's
 * traffic is. Past that we degrade to the block fallback rather than freezing
 * the tab or triggering an allocation failure.
 */
const MAX_LCS_CELLS = 4_000_000;

/** Normalize a line for *comparison only*. The original is still displayed. */
function normalize(line: string, opts: DiffOptions): string {
  let s = line;
  if (opts.ignoreWhitespace) s = s.trim().replace(/\s+/g, " ");
  if (opts.ignoreCase) s = s.toLowerCase();
  return s;
}

/**
 * Split text into lines.
 *
 * Normalizes CRLF and lone CR first so a file saved on Windows does not report
 * every single line as changed against the same file saved on Linux — which is
 * the single most common false positive in a diff tool.
 *
 * Empty input is zero lines, not one. `"".split("\n")` returns `[""]`, which
 * would make an empty textarea diff as "1 line removed" against any input — a
 * phantom change the user never made. A trailing newline still produces a real
 * empty final line, because there the emptiness is genuinely in the document.
 */
export function splitLines(text: string): string[] {
  if (text === "") return [];
  return text.replace(/\r\n?/g, "\n").split("\n");
}

/**
 * Diff two blocks of text line by line.
 *
 * Common prefix and suffix are stripped before the expensive step, which is
 * what makes the usual case (a large document with a small edit) fast: the LCS
 * only ever runs over the genuinely differing middle.
 */
export function diffLines(
  leftText: string,
  rightText: string,
  opts: DiffOptions = {}
): DiffResult {
  const left = splitLines(leftText);
  const right = splitLines(rightText);
  const a = left.map((l) => normalize(l, opts));
  const b = right.map((l) => normalize(l, opts));

  let start = 0;
  while (start < a.length && start < b.length && a[start] === b[start]) start++;

  let endA = a.length;
  let endB = b.length;
  while (endA > start && endB > start && a[endA - 1] === b[endB - 1]) {
    endA--;
    endB--;
  }

  const midA = a.slice(start, endA);
  const midB = b.slice(start, endB);

  const approximate = (midA.length + 1) * (midB.length + 1) > MAX_LCS_CELLS;
  const ops = approximate
    ? blockFallback(midA.length, midB.length)
    : lcsOps(midA, midB);

  const rows: DiffRow[] = [];
  const stats: DiffStats = { added: 0, removed: 0, unchanged: 0, approximate };

  const push = (op: DiffOp, li: number | null, ri: number | null) => {
    rows.push({
      op,
      leftNumber: li === null ? null : li + 1,
      rightNumber: ri === null ? null : ri + 1,
      left: li === null ? null : left[li],
      right: ri === null ? null : right[ri],
    });
    if (op === "equal") stats.unchanged++;
    else if (op === "insert") stats.added++;
    else stats.removed++;
  };

  for (let i = 0; i < start; i++) push("equal", i, i);

  let ai = start;
  let bi = start;
  for (const op of ops) {
    if (op === "equal") push("equal", ai++, bi++);
    else if (op === "delete") push("delete", ai++, null);
    else push("insert", null, bi++);
  }

  for (let i = 0; endA + i < a.length; i++) push("equal", endA + i, endB + i);

  return { rows, stats };
}

/**
 * Classic Longest Common Subsequence over lines, returned as an op list.
 *
 * Lines are hashed to integers first so the inner loop compares numbers rather
 * than strings — on a few thousand lines that is the difference between
 * instant and visibly laggy.
 */
function lcsOps(a: string[], b: string[]): DiffOp[] {
  const n = a.length;
  const m = b.length;
  if (n === 0) return new Array<DiffOp>(m).fill("insert");
  if (m === 0) return new Array<DiffOp>(n).fill("delete");

  const ids = new Map<string, number>();
  const id = (s: string) => {
    let v = ids.get(s);
    if (v === undefined) {
      v = ids.size;
      ids.set(s, v);
    }
    return v;
  };
  const av = a.map(id);
  const bv = b.map(id);

  const width = m + 1;
  const table = new Uint32Array((n + 1) * width);
  for (let i = n - 1; i >= 0; i--) {
    const rowBase = i * width;
    const nextBase = (i + 1) * width;
    for (let j = m - 1; j >= 0; j--) {
      table[rowBase + j] =
        av[i] === bv[j]
          ? table[nextBase + j + 1] + 1
          : Math.max(table[nextBase + j], table[rowBase + j + 1]);
    }
  }

  const ops: DiffOp[] = [];
  let i = 0;
  let j = 0;
  while (i < n && j < m) {
    if (av[i] === bv[j]) {
      ops.push("equal");
      i++;
      j++;
    } else if (table[(i + 1) * width + j] >= table[i * width + j + 1]) {
      ops.push("delete");
      i++;
    } else {
      ops.push("insert");
      j++;
    }
  }
  while (i++ < n) ops.push("delete");
  while (j++ < m) ops.push("insert");
  return ops;
}

/**
 * Fallback for inputs too large to diff exactly: report the whole differing
 * middle as removed-then-added. Crude, but honest — `stats.approximate` is set
 * so the UI can say so instead of implying line-level precision it does not
 * have.
 */
function blockFallback(n: number, m: number): DiffOp[] {
  return [
    ...new Array<DiffOp>(n).fill("delete"),
    ...new Array<DiffOp>(m).fill("insert"),
  ];
}

/* -------------------------------------------------------------------------- */
/*  Word-level diff, used to highlight what changed inside a modified line     */
/* -------------------------------------------------------------------------- */

export type WordPart = { text: string; changed: boolean };

/**
 * Split into word tokens, each carrying its own trailing whitespace.
 *
 * Attaching the space to the preceding word — rather than emitting it as its
 * own token — matters for how the highlighting reads. With separate whitespace
 * tokens, the LCS happily matches a space in one line against a space in a
 * completely different line, so "delete me" against "brand new line" comes back
 * as three disconnected highlights split around a matched space instead of one
 * clean run. Joining the tokens still reproduces the original line exactly.
 */
function splitWords(s: string): string[] {
  return s.match(/\S+\s*|\s+/g) ?? [];
}

/**
 * Comparison key for a word token.
 *
 * Trailing whitespace is stripped so the last word on a line still matches the
 * same word mid-line, where it carries a trailing space.
 */
function wordKey(token: string, opts: DiffOptions): string {
  return normalize(token.trim(), opts);
}

/**
 * Diff two versions of a single line at word granularity.
 *
 * Only called for lines already known to differ, and lines are short, so the
 * quadratic table here is never a problem in practice.
 */
export function diffWords(
  leftLine: string,
  rightLine: string,
  opts: DiffOptions = {}
): { left: WordPart[]; right: WordPart[] } {
  const a = splitWords(leftLine);
  const b = splitWords(rightLine);
  const na = a.map((w) => wordKey(w, opts));
  const nb = b.map((w) => wordKey(w, opts));

  const ops = lcsOps(na, nb);
  const left: WordPart[] = [];
  const right: WordPart[] = [];
  let i = 0;
  let j = 0;

  for (const op of ops) {
    if (op === "equal") {
      left.push({ text: a[i++], changed: false });
      right.push({ text: b[j++], changed: false });
    } else if (op === "delete") {
      left.push({ text: a[i++], changed: true });
    } else {
      right.push({ text: b[j++], changed: true });
    }
  }

  return { left: merge(left), right: merge(right) };
}

/** Collapse adjacent parts with the same changed flag, for fewer DOM nodes. */
function merge(parts: WordPart[]): WordPart[] {
  const out: WordPart[] = [];
  for (const p of parts) {
    const last = out[out.length - 1];
    if (last && last.changed === p.changed) last.text += p.text;
    else out.push({ ...p });
  }
  return out;
}

/**
 * Pair up delete/insert runs so a "changed" line can be shown as one row with
 * word-level highlighting, instead of a separate removed row and added row.
 *
 * Runs are paired positionally: the first deleted line in a run is treated as
 * the previous version of the first inserted line. That is what a person means
 * by "this line changed", and it is what every side-by-side diff viewer does.
 */
export function pairRows(rows: DiffRow[]): DiffRow[] {
  const out: DiffRow[] = [];
  let i = 0;

  while (i < rows.length) {
    if (rows[i].op !== "delete") {
      out.push(rows[i++]);
      continue;
    }

    const deletes: DiffRow[] = [];
    while (i < rows.length && rows[i].op === "delete") deletes.push(rows[i++]);
    const inserts: DiffRow[] = [];
    while (i < rows.length && rows[i].op === "insert") inserts.push(rows[i++]);

    const paired = Math.min(deletes.length, inserts.length);
    for (let k = 0; k < paired; k++) {
      out.push({
        op: "delete",
        leftNumber: deletes[k].leftNumber,
        rightNumber: inserts[k].rightNumber,
        left: deletes[k].left,
        right: inserts[k].right,
      });
    }
    for (let k = paired; k < deletes.length; k++) out.push(deletes[k]);
    for (let k = paired; k < inserts.length; k++) out.push(inserts[k]);
  }

  return out;
}
