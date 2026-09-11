/**
 * Newspaper-clipping generator.
 *
 * Layout maths and shareable state live here so they can be unit-tested
 * without a canvas; only `drawClipping` needs a real 2D context.
 *
 * The incumbents on this SERP render the clipping on a server and delete the
 * image after a short time, so a shared link goes dead and nothing is
 * mobile-friendly. Everything here happens in the browser: the PNG is the
 * user's file, and the query string reopens the exact clipping they made.
 */

import { mulberry32, seedFrom } from "@/lib/canvasDraw";

// Re-exported so this module stays the single import for the clipping's
// callers and its test, while the implementation lives in the shared module.
export { mulberry32, seedFrom };

export type ClippingContent = {
  /** Masthead — the newspaper's name. */
  paper: string;
  date: string;
  headline: string;
  body: string;
  /** Degrees of rotation, clamped to a believable slant. */
  tilt: number;
  /** Coffee-stained, yellowed paper rather than clean newsprint. */
  aged: boolean;
};

export const clippingDefaults: ClippingContent = {
  paper: "The Daily Herald",
  date: "Monday, 7 September 2026",
  headline: "Local Developer Ships Tool Before Lunch",
  body:
    "In a turn of events that has stunned absolutely nobody, a developer has shipped a working tool in a single afternoon.\n\nWitnesses report the browser did all of the work, that no files were uploaded anywhere, and that the resulting image was saved immediately and never expired.",
  tilt: -2,
  aged: true,
};

export const TILT_LIMIT = 6;

/** Clamp a tilt to the range the renderer is willing to draw. */
export function clampTilt(deg: number): number {
  if (!Number.isFinite(deg)) return 0;
  return Math.max(-TILT_LIMIT, Math.min(TILT_LIMIT, deg));
}

/* ---------------------------------------------------------------- layout */

/** Split wrapped body lines into two balanced columns. */
export function splitColumns(lines: string[]): [string[], string[]] {
  const per = Math.ceil(lines.length / 2);
  return [lines.slice(0, per), lines.slice(per)];
}

/**
 * Largest font size at or below `start` that fits `text` on one line.
 * Used for the masthead, which must never wrap — a two-line masthead stops
 * looking like a newspaper.
 */
export function fitFontSize(
  measure: (size: number) => number,
  maxWidth: number,
  start: number,
  min = 18
): number {
  let size = start;
  while (size > min && measure(size) > maxWidth) size -= 1;
  return size;
}

/* ------------------------------------------------------- shareable state */

/**
 * Round-trip the clipping through the query string, so posting the PNG and
 * its link brings people back to an editable copy. Keys are single letters to
 * survive chat apps that truncate long URLs.
 */
export function encodeClippingState(c: ClippingContent): string {
  const p = new URLSearchParams();
  if (c.paper) p.set("p", c.paper);
  if (c.date) p.set("d", c.date);
  if (c.headline) p.set("h", c.headline);
  if (c.body) p.set("b", c.body);
  if (c.tilt !== clippingDefaults.tilt) p.set("r", String(c.tilt));
  if (!c.aged) p.set("a", "0");
  return p.toString();
}

/** Parse shared state, falling back to `defaults` for anything absent or invalid. */
export function decodeClippingState(
  query: string,
  defaults: ClippingContent = clippingDefaults
): ClippingContent {
  const p = new URLSearchParams(query);
  const tilt = p.get("r");
  const parsed = tilt === null ? NaN : Number(tilt);
  return {
    paper: p.get("p") ?? defaults.paper,
    date: p.get("d") ?? defaults.date,
    headline: p.get("h") ?? defaults.headline,
    body: p.get("b") ?? defaults.body,
    tilt: Number.isFinite(parsed) ? clampTilt(parsed) : defaults.tilt,
    aged: p.get("a") === "0" ? false : defaults.aged,
  };
}

/* --------------------------------------------------------------- drawing */

const SERIF = "Georgia, 'Times New Roman', Times, serif";

const EDGE = 18; // room for the torn outline
const PAD = 34; // printed margin inside the paper
const GUTTER = 26;
const W = 720;

/**
 * Vertical rhythm, in the order the clipping is set down the page.
 *
 * The canvas has to be sized before anything is drawn, so the total height and
 * the draw positions are two readings of the same layout. Deriving both from
 * these constants keeps them honest: the first version tallied the height by
 * hand, under-counted by ~21px, and ran the last line of the story into the
 * bottom margin.
 */
const MAST_BASELINE = 0.82; // of the masthead font size
const AFTER_MAST = 14; // masthead baseline -> double rule
const AFTER_RULES = 22; // double rule -> dateline baseline
const AFTER_DATE = 8; // dateline baseline -> rule
const AFTER_DATE_RULE = 30; // rule -> first headline baseline
const HEAD_LINE_H = 42;
const AFTER_HEAD = 4; // end of headline block -> rule
const AFTER_HEAD_RULE = 22; // rule -> first body baseline
const BODY_LINE_H = 21;

/**
 * Masthead tracking for a given size.
 *
 * Proportional rather than a flat 2px so it shrinks with the font: a flat
 * value was added at draw time but not at measure time, and on a long paper
 * name the extra 2px per character pushed the masthead off both edges of the
 * paper. Measuring and drawing must use the same value.
 */
export function mastTracking(size: number): string {
  return `${(size * 0.04).toFixed(2)}px`;
}

/** Trace the ragged outline of a hand-torn clipping. */
function tornPath(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  rnd: () => number,
  amp: number
) {
  const step = 15;
  const pts: Array<[number, number]> = [];
  for (let x = 0; x < w; x += step) pts.push([x, amp * rnd()]);
  for (let y = 0; y < h; y += step) pts.push([w - amp * rnd(), y]);
  for (let x = w; x > 0; x -= step) pts.push([x, h - amp * rnd()]);
  for (let y = h; y > 0; y -= step) pts.push([amp * rnd(), y]);
  ctx.beginPath();
  ctx.moveTo(pts[0][0], pts[0][1]);
  for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i][0], pts[i][1]);
  ctx.closePath();
}

/**
 * Draw one line of body text stretched to `width`.
 *
 * Justification is skipped on the last line of a column and whenever the
 * required word gap grows past three spaces — forcing those produces the
 * rivers of white space that make faked newsprint look wrong.
 */
function drawJustified(
  ctx: CanvasRenderingContext2D,
  line: string,
  x: number,
  y: number,
  width: number,
  last: boolean
) {
  const words = line.split(" ").filter(Boolean);
  if (last || words.length < 2) {
    ctx.fillText(line, x, y);
    return;
  }
  let wordsW = 0;
  for (const w of words) wordsW += ctx.measureText(w).width;
  const gap = (width - wordsW) / (words.length - 1);
  if (gap > ctx.measureText(" ").width * 3 || gap < 0) {
    ctx.fillText(line, x, y);
    return;
  }
  let cx = x;
  for (const w of words) {
    ctx.fillText(w, cx, y);
    cx += ctx.measureText(w).width + gap;
  }
}

/** Render the clipping. Returns nothing; the canvas is resized to fit. */
export function drawClipping(canvas: HTMLCanvasElement, c: ClippingContent) {
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  const contentX = EDGE + PAD;
  const contentW = W - (EDGE + PAD) * 2;
  const colW = (contentW - GUTTER) / 2;

  // ---- measuring pass (canvas state is reset by the resize below) --------
  const mastText = c.paper.toUpperCase();
  const mast = fitFontSize(
    (size) => {
      ctx.font = `700 ${size}px ${SERIF}`;
      // letterSpacing is reflected in measureText where it is supported, and
      // is a no-op in both places where it is not — so the two stay in step.
      ctx.letterSpacing = mastTracking(size);
      const w = ctx.measureText(mastText).width;
      ctx.letterSpacing = "0px";
      return w;
    },
    contentW,
    52,
    14
  );

  ctx.font = `700 34px ${SERIF}`;
  const headLines = wrapLines(ctx, c.headline, contentW);

  ctx.font = `400 14px ${SERIF}`;
  const bodyLines = wrapLines(ctx, c.body, colW);
  const [colA, colB] = splitColumns(bodyLines);

  // One pass over the rhythm above yields every draw position and the height.
  const mastBaseline = EDGE + PAD + mast * MAST_BASELINE;
  const rulesY = mastBaseline + AFTER_MAST;
  const dateBaseline = rulesY + AFTER_RULES;
  const dateRuleY = dateBaseline + AFTER_DATE;
  const headBaseline = dateRuleY + AFTER_DATE_RULE;
  const headEnd = headBaseline + headLines.length * HEAD_LINE_H;
  const headRuleY = headEnd + AFTER_HEAD;
  const bodyBaseline = headRuleY + AFTER_HEAD_RULE;
  const bodyEnd =
    bodyBaseline + Math.max(colA.length, colB.length) * BODY_LINE_H;
  const H = bodyEnd + PAD + EDGE;

  // ---- size for the rotated bounding box ---------------------------------
  const rad = (clampTilt(c.tilt) * Math.PI) / 180;
  const cos = Math.abs(Math.cos(rad));
  const sin = Math.abs(Math.sin(rad));
  const outW = W * cos + H * sin;
  const outH = W * sin + H * cos;

  const scale = 2;
  canvas.width = Math.ceil(outW * scale);
  canvas.height = Math.ceil(outH * scale);
  canvas.style.aspectRatio = `${outW} / ${outH}`;
  ctx.scale(scale, scale);

  const rnd = mulberry32(seedFrom(c.paper + c.headline + c.body));

  ctx.translate(outW / 2, outH / 2);
  ctx.rotate(rad);
  ctx.translate(-W / 2, -H / 2);

  // ---- paper -------------------------------------------------------------
  ctx.save();
  ctx.shadowColor = "rgba(0,0,0,0.28)";
  ctx.shadowBlur = 14;
  ctx.shadowOffsetY = 5;
  tornPath(ctx, W, H, rnd, 7);
  ctx.fillStyle = c.aged ? "#f2e8cf" : "#f7f5ef";
  ctx.fill();
  ctx.restore();

  // Clip everything that follows to the torn outline.
  ctx.save();
  tornPath(ctx, W, H, mulberry32(seedFrom(c.paper + c.headline + c.body)), 7);
  ctx.clip();

  if (c.aged) {
    // Blotches first, then a fine grain — together they stop the fill from
    // reading as flat digital cream.
    for (let i = 0; i < 26; i++) {
      const r = 30 + rnd() * 90;
      ctx.fillStyle = `rgba(160,120,60,${0.02 + rnd() * 0.04})`;
      ctx.beginPath();
      ctx.arc(rnd() * W, rnd() * H, r, 0, Math.PI * 2);
      ctx.fill();
    }
    for (let i = 0; i < 1600; i++) {
      ctx.fillStyle = `rgba(90,70,40,${rnd() * 0.07})`;
      ctx.fillRect(rnd() * W, rnd() * H, 1, 1);
    }
  }

  const ink = c.aged ? "#241d12" : "#15141a";
  const faint = c.aged ? "#6b5d45" : "#5b5a63";
  ctx.fillStyle = ink;
  ctx.textAlign = "center";
  ctx.textBaseline = "alphabetic";

  // ---- masthead ----------------------------------------------------------
  ctx.font = `700 ${mast}px ${SERIF}`;
  ctx.letterSpacing = mastTracking(mast);
  ctx.fillText(mastText, W / 2, mastBaseline);
  ctx.letterSpacing = "0px";

  // Double rule under the masthead.
  ctx.fillRect(contentX, rulesY, contentW, 2);
  ctx.fillRect(contentX, rulesY + 4, contentW, 1);

  // ---- dateline ----------------------------------------------------------
  ctx.font = `400 11px ${SERIF}`;
  ctx.fillStyle = faint;
  ctx.letterSpacing = "1px";
  ctx.textAlign = "left";
  ctx.fillText(c.date.toUpperCase(), contentX, dateBaseline);
  ctx.textAlign = "right";
  ctx.fillText("PRICE 25c", contentX + contentW, dateBaseline);
  ctx.letterSpacing = "0px";
  ctx.fillStyle = ink;
  ctx.fillRect(contentX, dateRuleY, contentW, 1);

  // ---- headline ----------------------------------------------------------
  ctx.textAlign = "center";
  ctx.font = `700 34px ${SERIF}`;
  for (let i = 0; i < headLines.length; i++)
    ctx.fillText(headLines[i], W / 2, headBaseline + i * HEAD_LINE_H);

  ctx.fillRect(contentX, headRuleY, contentW, 1);

  // ---- body in two justified columns -------------------------------------
  ctx.textAlign = "left";
  ctx.font = `400 14px ${SERIF}`;
  const cols: Array<[string[], number]> = [
    [colA, contentX],
    [colB, contentX + colW + GUTTER],
  ];
  for (const [lines, x] of cols) {
    let cy = bodyBaseline;
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      // A blank line is a paragraph break, and the line before it ends a
      // paragraph — neither should be stretched.
      const last = i === lines.length - 1 || lines[i + 1] === "";
      if (line !== "") drawJustified(ctx, line, x, cy, colW, last);
      cy += BODY_LINE_H;
    }
  }

  ctx.restore();
}

/**
 * Wrap `text` to `maxWidth` with the context's current font.
 *
 * This mirrors `wrapText` in lib/canvasDraw, but a clipping needs the blank
 * lines that mark paragraph breaks to survive into the justification pass,
 * so the two are kept separate rather than one growing a flag.
 */
function wrapLines(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const out: string[] = [];
  for (const para of text.split("\n")) {
    if (para === "") {
      out.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        out.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    out.push(line);
  }
  return out;
}
