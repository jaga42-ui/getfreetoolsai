/**
 * Shared 2D-canvas drawing primitives for the image-generating fun tools
 * (fake chat/tweet/error screenshots).
 *
 * These were previously copy-pasted into each generator with small, accidental
 * differences — one dropped blank lines, one collapsed runs of whitespace. That
 * is the kind of drift that makes two tools render the same input differently
 * for no stated reason, so the canonical versions live here.
 */

/**
 * Word-wrap `text` to `maxWidth` using the context's *current* font.
 *
 * Set `ctx.font` before calling — measurement is font-dependent, and a mismatch
 * here is the usual cause of bubbles that are slightly too small for their text.
 *
 * Newlines are honoured as hard breaks and blank lines are preserved, so
 * deliberate paragraph spacing survives.
 */
export function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  maxWidth: number
): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    if (para === "") {
      lines.push("");
      continue;
    }
    let line = "";
    for (const word of para.split(" ")) {
      const test = line ? `${line} ${word}` : word;
      if (ctx.measureText(test).width > maxWidth && line) {
        lines.push(line);
        line = word;
      } else {
        line = test;
      }
    }
    lines.push(line);
  }
  return lines;
}

/**
 * Trace a rounded rectangle as the current path. Does not fill or stroke — the
 * caller chooses, so the same path can be filled and then stroked.
 *
 * The radius is clamped to half the shorter side so an oversized radius
 * degrades to a pill rather than producing inverted arcs.
 */
export function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  const rr = Math.max(0, Math.min(r, Math.min(w, h) / 2));
  ctx.beginPath();
  ctx.moveTo(x + rr, y);
  ctx.arcTo(x + w, y, x + w, y + h, rr);
  ctx.arcTo(x + w, y + h, x, y + h, rr);
  ctx.arcTo(x, y + h, x, y, rr);
  ctx.arcTo(x, y, x + w, y, rr);
  ctx.closePath();
}

/** Trigger a PNG download of a canvas. */
export function downloadCanvas(canvas: HTMLCanvasElement, filename: string) {
  const a = document.createElement("a");
  a.href = canvas.toDataURL("image/png");
  a.download = filename;
  a.click();
}

/* ------------------------------------------------------------ randomness */

/**
 * Seeded PRNG (mulberry32).
 *
 * Generated texture — torn edges, paper grain, the tilt of a cut-out letter —
 * must be stable across redraws. An unseeded `Math.random` makes that texture
 * crawl on every keystroke, which reads as a rendering bug rather than as
 * texture, so every generator seeds from its own content instead.
 */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** FNV-1a. Derives a stable numeric seed from a string of content. */
export function seedFrom(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
