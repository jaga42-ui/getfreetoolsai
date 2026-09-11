/**
 * Ransom-note generator — every letter is drawn as its own cut-out scrap of
 * paper, with its own typeface, tilt and colour.
 *
 * Layout maths and shareable state live here so they can be unit-tested
 * without a canvas; only `drawRansomNote` needs a real 2D context.
 *
 * The incumbent on this SERP is desktop-only with no clear way to save what
 * you made. Everything here happens in the browser: the note reflows to a
 * phone, the PNG is the user's file, and the query string reopens the exact
 * note so a shared link stays alive.
 *
 * MEASURE/DRAW PARITY: a scrap's `font` string is computed once and used for
 * *both* measuring and drawing. Measuring a glyph under a different font than
 * it is drawn with is what makes cut-out letters overlap or drift outside the
 * page, and it is invisible to tsc, lint and the build.
 */

import { mulberry32, seedFrom } from "@/lib/canvasDraw";

export type RansomBackground = "newsprint" | "plain" | "dark";

export type RansomContent = {
  text: string;
  background: RansomBackground;
  /** Re-roll counter. Changing it reshuffles every scrap without new text. */
  variation: number;
  /** Tilt the scraps. Off gives a tidier, more legible note. */
  jitter: boolean;
};

export const ransomDefaults: RansomContent = {
  text: "I have your attention now",
  background: "newsprint",
  variation: 0,
  jitter: true,
};

/* --------------------------------------------------------------- palette */

/**
 * Typefaces are deliberately a clash of genres — that mismatch *is* the ransom
 * note effect. Each entry is a full CSS font-family list so the scrap still
 * renders if the first choice is missing.
 */
const FAMILIES = [
  '"Times New Roman", Times, serif',
  "Georgia, serif",
  '"Courier New", Courier, monospace',
  "Impact, Haettenschweiler, sans-serif",
  '"Arial Black", Arial, sans-serif',
  "Verdana, Geneva, sans-serif",
  "Tahoma, Geneva, sans-serif",
  '"Comic Sans MS", cursive, sans-serif',
  '"Palatino Linotype", Palatino, serif',
  '"Trebuchet MS", Helvetica, sans-serif',
];

/** Torn-out paper stock: newsprint greys, magazine whites, a little colour. */
const PAPERS = [
  "#f4f1e8",
  "#ffffff",
  "#efe7d2",
  "#f7e9c6",
  "#e8eef3",
  "#f6dfe0",
  "#e6efe2",
  "#fdf6d8",
];

/** Ink is mostly near-black; the odd coloured glyph keeps it from flattening. */
const INKS = ["#141414", "#1c1c1c", "#101820", "#7a1414", "#13324b"];

export const BASE_FONT_SIZE = 44;
/** Half-range of the per-glyph size wobble, in px. */
export const SIZE_JITTER = 7;
/** Half-range of the per-glyph tilt, in degrees. */
export const TILT_JITTER = 7;

const PAD_X = 6;
const PAD_Y = 4;
const SPACE_W = 16;
const LINE_GAP = 12;
export const MARGIN = 34;
export const MAX_TEXT_WIDTH = 880;

/* ---------------------------------------------------------------- scraps */

export type Scrap = {
  ch: string;
  /** Full CSS font shorthand. Set on the context for measuring AND drawing. */
  font: string;
  size: number;
  paper: string;
  ink: string;
  /** Tilt in radians. */
  rotate: number;
  /** Glyph advance width under `font`, filled in by `measureScraps`. */
  advance: number;
  /** Scrap rectangle before rotation. */
  boxW: number;
  boxH: number;
  /** Axis-aligned bounds of the scrap once rotated. */
  outerW: number;
  outerH: number;
  /** Inverted scrap: dark paper, pale letter. */
  invert: boolean;
};

/** Pick one item from a list using the supplied PRNG. */
function pick<T>(rand: () => number, xs: readonly T[]): T {
  return xs[Math.floor(rand() * xs.length) % xs.length];
}

/**
 * The axis-aligned bounding box of a `w`x`h` rectangle rotated by `rad`.
 *
 * The canvas height is derived from these, never tallied by hand — a tilted
 * scrap is taller than its own box, and forgetting that is what runs the last
 * line off the bottom edge.
 */
export function rotatedBounds(
  w: number,
  h: number,
  rad: number
): { w: number; h: number } {
  const s = Math.abs(Math.sin(rad));
  const c = Math.abs(Math.cos(rad));
  return { w: w * c + h * s, h: w * s + h * c };
}

/**
 * Build the per-glyph styling for `text`. Deterministic for a given
 * (text, variation, jitter): the same note always looks the same.
 *
 * Whitespace is not a scrap — it becomes a gap between words during layout —
 * so it is dropped here.
 */
export function buildScraps(c: RansomContent): Scrap[] {
  const rand = mulberry32(seedFrom(`${c.text}|${c.variation}`));
  const out: Scrap[] = [];
  for (const ch of Array.from(c.text)) {
    if (/\s/.test(ch)) continue;
    const size = Math.round(
      BASE_FONT_SIZE + (rand() * 2 - 1) * SIZE_JITTER
    );
    const family = pick(rand, FAMILIES);
    const bold = rand() < 0.45 ? "bold " : "";
    const italic = rand() < 0.18 ? "italic " : "";
    const invert = rand() < 0.12;
    const rotate = c.jitter
      ? ((rand() * 2 - 1) * TILT_JITTER * Math.PI) / 180
      : 0;
    out.push({
      ch,
      font: `${italic}${bold}${size}px ${family}`,
      size,
      paper: invert ? "#1d1d1d" : pick(rand, PAPERS),
      ink: invert ? "#f2f2f2" : pick(rand, INKS),
      rotate,
      advance: 0,
      boxW: 0,
      boxH: 0,
      outerW: 0,
      outerH: 0,
      invert,
    });
  }
  return out;
}

/**
 * Fill in each scrap's measured width and its rotated bounds.
 *
 * `measure` must apply the scrap's own `font` — that is the whole point of
 * carrying the font string on the scrap. In the browser this is
 * `(s) => { ctx.font = s.font; return ctx.measureText(s.ch).width; }`.
 */
export function measureScraps(
  scraps: Scrap[],
  measure: (s: Scrap) => number
): Scrap[] {
  for (const s of scraps) {
    s.advance = measure(s);
    s.boxW = s.advance + PAD_X * 2;
    // Cap height off the nominal size rather than the glyph's own ascent, so a
    // line of scraps has a consistent stock height and reads as cut paper.
    s.boxH = s.size * 1.22 + PAD_Y * 2;
    const r = rotatedBounds(s.boxW, s.boxH, s.rotate);
    s.outerW = r.w;
    s.outerH = r.h;
  }
  return scraps;
}

/* ---------------------------------------------------------------- layout */

/** A scrap placed at its x offset from the start of its line. */
export type PlacedScrap = { s: Scrap; x: number };

export type RansomLine = {
  items: PlacedScrap[];
  width: number;
  height: number;
};

/**
 * Group measured scraps into lines that fit `maxWidth`, breaking on the word
 * boundaries of the original text.
 *
 * Word gaps are resolved here, into each scrap's x offset, rather than being
 * re-derived while drawing — the renderer has no way to tell which scrap began
 * a word once the whitespace has been dropped.
 *
 * A single word longer than `maxWidth` overflows its line rather than being
 * split mid-word: a word broken across lines reads as a bug, and the canvas is
 * sized from the returned widths, so nothing is clipped.
 */
export function layoutLines(
  text: string,
  scraps: Scrap[],
  maxWidth = MAX_TEXT_WIDTH
): RansomLine[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: RansomLine[] = [];
  let cur: PlacedScrap[] = [];
  let curW = 0;
  let i = 0;

  const flush = () => {
    if (!cur.length) return;
    lines.push({
      items: cur,
      width: curW,
      height: Math.max(...cur.map((p) => p.s.outerH)),
    });
    cur = [];
    curW = 0;
  };

  const place = (glyphs: Scrap[], startAt: number) => {
    let x = startAt;
    for (const s of glyphs) {
      cur.push({ s, x });
      x += s.outerW;
    }
    return x;
  };

  for (const word of words) {
    const glyphs = scraps.slice(i, i + Array.from(word).length);
    i += glyphs.length;
    if (!glyphs.length) continue;
    const wordW = glyphs.reduce((a, s) => a + s.outerW, 0);
    const gap = cur.length ? SPACE_W : 0;

    if (cur.length && curW + gap + wordW > maxWidth) {
      flush();
      curW = place(glyphs, 0);
    } else {
      curW = place(glyphs, curW + gap);
    }
  }
  flush();
  return lines;
}

/**
 * Canvas size for a laid-out note, derived entirely from the line boxes and
 * the margin constants.
 */
export function canvasSize(lines: RansomLine[]): { w: number; h: number } {
  if (!lines.length) {
    return { w: MARGIN * 2 + SPACE_W, h: MARGIN * 2 + BASE_FONT_SIZE };
  }
  const w = MARGIN * 2 + Math.max(...lines.map((l) => l.width));
  const h =
    MARGIN * 2 +
    lines.reduce((a, l) => a + l.height, 0) +
    LINE_GAP * (lines.length - 1);
  return { w: Math.ceil(w), h: Math.ceil(h) };
}

/* ------------------------------------------------------- shareable state */

/** Encode a note into a query string so a shared link reopens it. */
export function encodeRansomState(c: RansomContent): string {
  const p = new URLSearchParams();
  p.set("t", c.text);
  p.set("bg", c.background);
  if (c.variation) p.set("v", String(c.variation));
  if (!c.jitter) p.set("j", "0");
  return p.toString();
}

/** Decode a query string back into a note, falling back to the defaults. */
export function decodeRansomState(qs: string): RansomContent {
  const p = new URLSearchParams(qs);
  const bg = p.get("bg");
  return {
    text: p.get("t") || ransomDefaults.text,
    background:
      bg === "plain" || bg === "dark" || bg === "newsprint"
        ? bg
        : ransomDefaults.background,
    variation: Number(p.get("v")) || 0,
    jitter: p.get("j") !== "0",
  };
}

/* --------------------------------------------------------------- drawing */

const BACKDROPS: Record<RansomBackground, string> = {
  newsprint: "#d9d4c7",
  plain: "#ffffff",
  dark: "#15161a",
};

/** Speckle the backdrop so it reads as paper rather than a flat fill. */
function speckle(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rand: () => number,
  dark: boolean
) {
  ctx.save();
  ctx.fillStyle = dark ? "rgba(255,255,255,0.05)" : "rgba(60,50,40,0.07)";
  const n = Math.floor((w * h) / 2600);
  for (let i = 0; i < n; i++) {
    ctx.fillRect(rand() * w, rand() * h, 1.4, 1.4);
  }
  ctx.restore();
}

/**
 * Render the note onto `canvas` at 2x for a crisp download.
 *
 * Measurement happens against this same context, with each scrap's own font,
 * before any size is committed — see the note at the top of the file.
 */
export function drawRansomNote(
  canvas: HTMLCanvasElement,
  c: RansomContent
): void {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const scraps = measureScraps(buildScraps(c), (s) => {
    ctx.font = s.font;
    return ctx.measureText(s.ch).width;
  });
  const lines = layoutLines(c.text, scraps);
  const { w, h } = canvasSize(lines);

  const dpr = 2;
  canvas.width = w * dpr;
  canvas.height = h * dpr;
  canvas.style.aspectRatio = `${w} / ${h}`;
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

  const rand = mulberry32(seedFrom(`${c.text}|${c.variation}|bg`));
  ctx.fillStyle = BACKDROPS[c.background];
  ctx.fillRect(0, 0, w, h);
  speckle(ctx, w, h, rand, c.background === "dark");

  let y = MARGIN;
  for (const line of lines) {
    // Centre each line within the widest line, so a ragged note still sits on
    // a common axis.
    const originX = (w - line.width) / 2;
    for (const { s, x } of line.items) {
      const cx = originX + x + s.outerW / 2;
      const cy = y + line.height / 2;

      ctx.save();
      ctx.translate(cx, cy);
      ctx.rotate(s.rotate);

      // Scrap shadow, so the cut-outs sit above the page.
      ctx.shadowColor = "rgba(0,0,0,0.32)";
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1.5;
      ctx.fillStyle = s.paper;
      ctx.fillRect(-s.boxW / 2, -s.boxH / 2, s.boxW, s.boxH);
      ctx.shadowColor = "transparent";
      ctx.shadowBlur = 0;
      ctx.shadowOffsetX = 0;
      ctx.shadowOffsetY = 0;

      // Same font string the glyph was measured with.
      ctx.font = s.font;
      ctx.fillStyle = s.ink;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(s.ch, 0, 1);
      ctx.restore();
    }
    y += line.height + LINE_GAP;
  }
}

/** Word gap, exported for the layout test. */
export const SPACE_WIDTH = SPACE_W;
