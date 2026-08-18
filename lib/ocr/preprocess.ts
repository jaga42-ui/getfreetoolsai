/**
 * Image preprocessing.
 *
 * OCR accuracy is decided far more by the input than by any engine setting, so
 * this is where the largest practical gains live. Everything here operates on a
 * plain RGBA buffer rather than a canvas, which keeps it pure, unit-testable in
 * Node, and reusable server-side later. `lib/ocr/preprocessCanvas.ts` holds the
 * thin browser adapter.
 *
 * The pipeline is deliberately NOT "apply everything". Each operation costs
 * quality somewhere: thresholding destroys anti-aliasing, denoising erodes thin
 * strokes, rotation resamples. So `analyzeRaster` measures the page first and
 * `planPreprocessing` selects only what the measurements justify. The original
 * buffer is never mutated.
 */

/** A plain RGBA raster. Matches ImageData's layout without needing the DOM. */
export interface Raster {
  data: Uint8ClampedArray;
  width: number;
  height: number;
}

export function createRaster(width: number, height: number, fill = 255): Raster {
  const data = new Uint8ClampedArray(width * height * 4);
  data.fill(fill);
  // fill() also sets alpha; force it opaque so a fill of 0 is black, not clear.
  for (let i = 3; i < data.length; i += 4) data[i] = 255;
  return { data, width, height };
}

export function cloneRaster(src: Raster): Raster {
  return {
    data: new Uint8ClampedArray(src.data),
    width: src.width,
    height: src.height,
  };
}

/** Rec. 709 luma at a pixel index (in pixels, not bytes). */
export function lumaAt(r: Raster, i: number): number {
  const o = i * 4;
  return 0.2126 * r.data[o] + 0.7152 * r.data[o + 1] + 0.0722 * r.data[o + 2];
}

/** Single-channel luma plane — the working format for every analysis below. */
export function toGrayPlane(r: Raster): Uint8ClampedArray {
  const out = new Uint8ClampedArray(r.width * r.height);
  for (let i = 0; i < out.length; i++) out[i] = lumaAt(r, i);
  return out;
}

/** Convert to grey in place of colour, keeping RGBA layout. */
export function toGrayscale(src: Raster): Raster {
  const out = cloneRaster(src);
  for (let i = 0; i < src.width * src.height; i++) {
    const v = lumaAt(src, i);
    const o = i * 4;
    out.data[o] = v;
    out.data[o + 1] = v;
    out.data[o + 2] = v;
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Histogram + thresholding                                            */
/* ------------------------------------------------------------------ */

export function histogram(plane: Uint8ClampedArray): number[] {
  const h = new Array<number>(256).fill(0);
  for (let i = 0; i < plane.length; i++) h[plane[i]]++;
  return h;
}

/**
 * Otsu's method: the threshold maximising between-class variance.
 *
 * Chosen over a fixed midpoint because scans are rarely centred on 128 — a grey
 * photocopy might have all its ink at 90 and all its paper at 160.
 *
 * Returns an EXCLUSIVE threshold, i.e. `luma < t` means ink. Otsu's search
 * yields the highest level still in the dark class, so a perfectly bimodal
 * 0/255 image yields 0 — and `luma < 0` is never true, which silently reports
 * an image as having no ink at all. Everything downstream (ink ratio, content
 * bounds, the skew projection) then measures nothing. Returning level + 1 makes
 * the comparison used everywhere else correct by construction.
 */
export function otsuThreshold(plane: Uint8ClampedArray): number {
  const hist = histogram(plane);
  const total = plane.length;
  if (!total) return 128;

  let sum = 0;
  for (let t = 0; t < 256; t++) sum += t * hist[t];

  let sumB = 0;
  let wB = 0;
  let best = 0;
  let bestVariance = -1;

  for (let t = 0; t < 256; t++) {
    wB += hist[t];
    if (wB === 0) continue;
    const wF = total - wB;
    if (wF === 0) break;
    sumB += t * hist[t];
    const mB = sumB / wB;
    const mF = (sum - sumB) / wF;
    const variance = wB * wF * (mB - mF) * (mB - mF);
    if (variance > bestVariance) {
      bestVariance = variance;
      best = t;
    }
  }
  return Math.min(255, best + 1);
}

/** Hard binarisation at a threshold. Below → black, at/above → white. */
export function binarize(src: Raster, threshold: number): Raster {
  const out = cloneRaster(src);
  for (let i = 0; i < src.width * src.height; i++) {
    const v = lumaAt(src, i) < threshold ? 0 : 255;
    const o = i * 4;
    out.data[o] = v;
    out.data[o + 1] = v;
    out.data[o + 2] = v;
  }
  return out;
}

/**
 * Percentile contrast stretch.
 *
 * Uses the 2nd/98th percentiles rather than absolute min/max so a single dust
 * speck or specular highlight cannot define the range and flatten everything
 * else — the usual failure of naive normalisation on photographed pages.
 */
export function stretchContrast(src: Raster, lowPct = 0.02, highPct = 0.98): Raster {
  const plane = toGrayPlane(src);
  const hist = histogram(plane);
  const total = plane.length;
  if (!total) return cloneRaster(src);

  let acc = 0;
  let lo = 0;
  let hi = 255;
  for (let t = 0; t < 256; t++) {
    acc += hist[t];
    if (acc >= total * lowPct) {
      lo = t;
      break;
    }
  }
  acc = 0;
  for (let t = 255; t >= 0; t--) {
    acc += hist[t];
    if (acc >= total * (1 - highPct)) {
      hi = t;
      break;
    }
  }
  if (hi <= lo) return cloneRaster(src);

  const scale = 255 / (hi - lo);
  const out = cloneRaster(src);
  for (let i = 0; i < total; i++) {
    const o = i * 4;
    for (let c = 0; c < 3; c++) {
      out.data[o + c] = (src.data[o + c] - lo) * scale;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Denoise                                                             */
/* ------------------------------------------------------------------ */

/** 3x3 median over a single-channel plane. */
export function medianPlane3(
  plane: Uint8ClampedArray,
  w: number,
  h: number
): Uint8ClampedArray {
  const out = new Uint8ClampedArray(plane.length);
  const win: number[] = new Array(9);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          win[n++] = plane[yy * w + xx];
        }
      }
      win.sort((a, b) => a - b);
      out[y * w + x] = win[4];
    }
  }
  return out;
}

/**
 * 3x3 median filter — removes salt-and-pepper speckle while preserving edges,
 * which a blur would soften. Applied only when noise is actually measured,
 * because it erodes hairline strokes.
 */
export function medianFilter3(src: Raster): Raster {
  const { width: w, height: h } = src;
  const plane = toGrayPlane(src);
  const out = cloneRaster(src);
  const window: number[] = new Array(9);

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      let n = 0;
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const yy = Math.min(h - 1, Math.max(0, y + dy));
          const xx = Math.min(w - 1, Math.max(0, x + dx));
          window[n++] = plane[yy * w + xx];
        }
      }
      window.sort((a, b) => a - b);
      const v = window[4];
      const o = (y * w + x) * 4;
      out.data[o] = v;
      out.data[o + 1] = v;
      out.data[o + 2] = v;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Skew                                                                */
/* ------------------------------------------------------------------ */

/**
 * Score how "horizontal" text lines are at a given shear.
 *
 * Projects ink onto the y axis and sums squared differences between adjacent
 * rows. When lines are level, rows alternate sharply between dense text and
 * empty leading, so the score peaks. When skewed, ink smears across rows and
 * the profile flattens.
 */
function projectionScore(
  plane: Uint8ClampedArray,
  w: number,
  h: number,
  threshold: number,
  slope: number
): number {
  const rows = new Float64Array(h);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (plane[y * w + x] < threshold) {
        // Shear instead of rotate: far cheaper, and equivalent for the small
        // angles that matter here.
        const ty = Math.round(y + (x - w / 2) * slope);
        if (ty >= 0 && ty < h) rows[ty]++;
      }
    }
  }
  let score = 0;
  for (let y = 1; y < h; y++) {
    const d = rows[y] - rows[y - 1];
    score += d * d;
  }
  return score;
}

export interface SkewEstimate {
  /**
   * Degrees the page IS rotated by, in the same sense as `rotateRaster`.
   *
   * The contract is a round trip: for any image, `rotateRaster(img, -angle)`
   * levels it. Stated this way because the shear search below naturally
   * produces the opposite sign — the shear that straightens the page is the
   * negation of the page's own rotation — and leaving that implicit made the
   * correction apply double the skew in the wrong direction.
   */
  angle: number;
  /** 0..1, how much better the best angle scored than the median candidate. */
  confidence: number;
}

/**
 * Estimate page skew by projection profile.
 *
 * Deliberately limited to +/- `maxAngle` (default 10 degrees). Beyond that the
 * cause is usually a 90-degree orientation error rather than skew, and a wider
 * search invites false positives on sparse pages.
 */
export function estimateSkew(src: Raster, maxAngle = 10, step = 0.25): SkewEstimate {
  const { width: w, height: h } = src;
  if (w < 8 || h < 8) return { angle: 0, confidence: 0 };

  const plane = toGrayPlane(src);
  const threshold = otsuThreshold(plane);

  let bestAngle = 0;
  let bestScore = -1;
  const scores: number[] = [];

  for (let a = -maxAngle; a <= maxAngle + 1e-9; a += step) {
    const score = projectionScore(plane, w, h, threshold, Math.tan((a * Math.PI) / 180));
    scores.push(score);
    if (score > bestScore) {
      bestScore = score;
      bestAngle = a;
    }
  }

  const sorted = scores.slice().sort((x, y) => x - y);
  const medianScore = sorted[Math.floor(sorted.length / 2)] || 0;
  const confidence =
    bestScore > 0 && medianScore > 0
      ? Math.max(0, Math.min(1, 1 - medianScore / bestScore))
      : 0;

  // Negate: `bestAngle` is the straightening shear, the caller wants the
  // page's own rotation. Rounding clears drift from the accumulating counter.
  return { angle: -Math.round(bestAngle * 100) / 100, confidence };
}

/**
 * Rotate by `degrees` about the centre, expanding the canvas so nothing is
 * clipped. Bilinear sampling; areas outside the source become white, which is
 * the right background for a document.
 */
export function rotateRaster(src: Raster, degrees: number): Raster {
  const rad = (degrees * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  const { width: sw, height: sh } = src;

  const dw = Math.max(1, Math.ceil(Math.abs(sw * cos) + Math.abs(sh * sin)));
  const dh = Math.max(1, Math.ceil(Math.abs(sw * sin) + Math.abs(sh * cos)));
  const out = createRaster(dw, dh, 255);

  const scx = sw / 2;
  const scy = sh / 2;
  const dcx = dw / 2;
  const dcy = dh / 2;

  for (let y = 0; y < dh; y++) {
    for (let x = 0; x < dw; x++) {
      // Inverse-map the destination pixel back into the source.
      const rx = x - dcx;
      const ry = y - dcy;
      const sx = rx * cos + ry * sin + scx;
      const sy = -rx * sin + ry * cos + scy;

      if (sx < 0 || sy < 0 || sx >= sw - 1 || sy >= sh - 1) continue;

      const x0 = Math.floor(sx);
      const y0 = Math.floor(sy);
      const fx = sx - x0;
      const fy = sy - y0;
      const o = (y * dw + x) * 4;

      for (let c = 0; c < 3; c++) {
        const p00 = src.data[(y0 * sw + x0) * 4 + c];
        const p10 = src.data[(y0 * sw + x0 + 1) * 4 + c];
        const p01 = src.data[((y0 + 1) * sw + x0) * 4 + c];
        const p11 = src.data[((y0 + 1) * sw + x0 + 1) * 4 + c];
        out.data[o + c] =
          p00 * (1 - fx) * (1 - fy) +
          p10 * fx * (1 - fy) +
          p01 * (1 - fx) * fy +
          p11 * fx * fy;
      }
      out.data[o + 3] = 255;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Borders                                                             */
/* ------------------------------------------------------------------ */

export interface ContentBounds {
  x0: number;
  y0: number;
  x1: number;
  y1: number;
}

/**
 * Tightest box containing ink, plus a margin.
 *
 * Used to strip the black scanner borders and page-edge shadows that otherwise
 * dominate the histogram and drag every threshold the wrong way.
 */
export function detectContentBounds(src: Raster, marginPx = 8): ContentBounds {
  const { width: w, height: h } = src;
  const plane = toGrayPlane(src);
  const threshold = otsuThreshold(plane);

  let x0 = w;
  let y0 = h;
  let x1 = -1;
  let y1 = -1;

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (plane[y * w + x] < threshold) {
        if (x < x0) x0 = x;
        if (x > x1) x1 = x;
        if (y < y0) y0 = y;
        if (y > y1) y1 = y;
      }
    }
  }
  // No ink at all — treat the whole image as content rather than returning an
  // empty box a caller might crop to nothing.
  if (x1 < 0) return { x0: 0, y0: 0, x1: w, y1: h };

  return {
    x0: Math.max(0, x0 - marginPx),
    y0: Math.max(0, y0 - marginPx),
    x1: Math.min(w, x1 + 1 + marginPx),
    y1: Math.min(h, y1 + 1 + marginPx),
  };
}

export function cropRaster(src: Raster, b: ContentBounds): Raster {
  const w = Math.max(1, b.x1 - b.x0);
  const h = Math.max(1, b.y1 - b.y0);
  const out = createRaster(w, h, 255);
  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      const so = ((y + b.y0) * src.width + (x + b.x0)) * 4;
      const dofs = (y * w + x) * 4;
      out.data[dofs] = src.data[so];
      out.data[dofs + 1] = src.data[so + 1];
      out.data[dofs + 2] = src.data[so + 2];
      out.data[dofs + 3] = 255;
    }
  }
  return out;
}

/* ------------------------------------------------------------------ */
/* Analysis + planning                                                 */
/* ------------------------------------------------------------------ */

export interface RasterAnalysis {
  width: number;
  height: number;
  /** True when R, G and B are already equal everywhere sampled. */
  isGrayscale: boolean;
  /** Mean luma, 0..255. */
  meanLuma: number;
  /** Spread between the 2nd and 98th luma percentiles, 0..255. */
  contrastRange: number;
  /** Fraction of pixels darker than the Otsu threshold. */
  inkRatio: number;
  /** Rough salt-and-pepper estimate: isolated pixels differing from neighbours. */
  noiseRatio: number;
  skew: SkewEstimate;
  /** Fraction of the frame outside the ink bounding box. */
  borderRatio: number;
}

export function analyzeRaster(src: Raster): RasterAnalysis {
  const { width: w, height: h } = src;
  const plane = toGrayPlane(src);
  const total = plane.length || 1;

  let isGrayscale = true;
  // Sampling every 97th pixel (a prime) avoids aligning with row stride and
  // is ample to detect a colour image.
  for (let i = 0; i < w * h; i += 97) {
    const o = i * 4;
    if (src.data[o] !== src.data[o + 1] || src.data[o + 1] !== src.data[o + 2]) {
      isGrayscale = false;
      break;
    }
  }

  let sum = 0;
  for (let i = 0; i < total; i++) sum += plane[i];
  const meanLuma = sum / total;

  // Noise first: pixels differing sharply from BOTH horizontal neighbours,
  // which is the signature of speckle rather than of a stroke edge.
  let noisy = 0;
  let sampled = 0;
  for (let y = 1; y < h - 1; y += 2) {
    for (let x = 1; x < w - 1; x += 2) {
      const c = plane[y * w + x];
      const l = plane[y * w + x - 1];
      const r = plane[y * w + x + 1];
      sampled++;
      if (Math.abs(c - l) > 60 && Math.abs(c - r) > 60 && Math.abs(l - r) < 40) noisy++;
    }
  }
  const noiseRatio = sampled ? noisy / sampled : 0;

  /*
   * Contrast is measured on a DENOISED plane when speckle is present.
   *
   * Salt-and-pepper noise contributes pure 0 and 255 pixels, so once its
   * density exceeds the percentile cutoff it defines both tails and the page
   * measures as full-range no matter how washed out the actual content is. A
   * crushed 30-level scan with 6% speckle reported a 255-level range and the
   * planner therefore skipped the contrast stretch it most needed.
   */
  const contrastPlane =
    noiseRatio >= DEFAULT_PLAN_THRESHOLDS.minNoiseRatio
      ? medianPlane3(plane, w, h)
      : plane;

  const hist = histogram(contrastPlane);
  let acc = 0;
  let lo = 0;
  let hi = 255;
  for (let t = 0; t < 256; t++) {
    acc += hist[t];
    if (acc >= total * 0.02) {
      lo = t;
      break;
    }
  }
  acc = 0;
  for (let t = 255; t >= 0; t--) {
    acc += hist[t];
    if (acc >= total * 0.02) {
      hi = t;
      break;
    }
  }

  const threshold = otsuThreshold(plane);
  let ink = 0;
  for (let i = 0; i < total; i++) if (plane[i] < threshold) ink++;

  const bounds = detectContentBounds(src, 0);
  const contentArea = Math.max(1, (bounds.x1 - bounds.x0) * (bounds.y1 - bounds.y0));
  const borderRatio = 1 - contentArea / Math.max(1, w * h);

  return {
    width: w,
    height: h,
    isGrayscale,
    meanLuma,
    contrastRange: Math.max(0, hi - lo),
    inkRatio: ink / total,
    noiseRatio,
    skew: estimateSkew(src),
    borderRatio: Math.max(0, borderRatio),
  };
}

export type PreprocessOp =
  | "grayscale"
  | "cropBorder"
  | "denoise"
  | "stretchContrast"
  | "deskew";

export interface PreprocessPlan {
  ops: PreprocessOp[];
  /** Degrees to rotate, when "deskew" is included. */
  deskewAngle: number;
  /** Human-readable justification per op, surfaced in the UI. */
  reasons: string[];
}

export interface PlanThresholds {
  minSkewDegrees: number;
  minSkewConfidence: number;
  maxContrastRange: number;
  minNoiseRatio: number;
  minBorderRatio: number;
}

export const DEFAULT_PLAN_THRESHOLDS: PlanThresholds = {
  // Below about half a degree, resampling costs more than the skew does.
  minSkewDegrees: 0.5,
  minSkewConfidence: 0.15,
  // A well-exposed page spans most of the range; below this it is washed out.
  maxContrastRange: 160,
  minNoiseRatio: 0.02,
  minBorderRatio: 0.12,
};

/**
 * Choose preprocessing from measurements.
 *
 * Every operation is destructive in some way, so each must be justified by the
 * analysis rather than applied on principle. Order matters: crop before
 * measuring contrast, deskew last so it resamples once.
 */
export function planPreprocessing(
  a: RasterAnalysis,
  t: PlanThresholds = DEFAULT_PLAN_THRESHOLDS
): PreprocessPlan {
  const ops: PreprocessOp[] = [];
  const reasons: string[] = [];

  if (!a.isGrayscale) {
    ops.push("grayscale");
    reasons.push("Colour image — converting to grey removes chroma noise.");
  }
  if (a.borderRatio >= t.minBorderRatio) {
    ops.push("cropBorder");
    reasons.push(
      `${Math.round(a.borderRatio * 100)}% of the frame is blank border — cropping it stops it skewing the threshold.`
    );
  }
  if (a.noiseRatio >= t.minNoiseRatio) {
    ops.push("denoise");
    reasons.push("Speckle detected — applying a median filter.");
  }
  if (a.contrastRange < t.maxContrastRange) {
    ops.push("stretchContrast");
    reasons.push(
      `Contrast spans only ${Math.round(a.contrastRange)} levels — stretching to the full range.`
    );
  }

  let deskewAngle = 0;
  if (
    Math.abs(a.skew.angle) >= t.minSkewDegrees &&
    a.skew.confidence >= t.minSkewConfidence
  ) {
    ops.push("deskew");
    deskewAngle = -a.skew.angle;
    reasons.push(`Page is skewed by ${a.skew.angle.toFixed(2)}° — straightening it.`);
  }

  return { ops, deskewAngle, reasons };
}

/** Apply a plan. The source is never mutated. */
export function applyPlan(src: Raster, plan: PreprocessPlan): Raster {
  let cur = src;
  for (const op of plan.ops) {
    switch (op) {
      case "grayscale":
        cur = toGrayscale(cur);
        break;
      case "cropBorder":
        cur = cropRaster(cur, detectContentBounds(cur));
        break;
      case "denoise":
        cur = medianFilter3(cur);
        break;
      case "stretchContrast":
        cur = stretchContrast(cur);
        break;
      case "deskew":
        cur = rotateRaster(cur, plan.deskewAngle);
        break;
    }
  }
  // Guarantee a distinct buffer even when the plan was empty, so callers can
  // treat the result as owned.
  return cur === src ? cloneRaster(src) : cur;
}

/** Analyse, plan and apply in one step. */
export function preprocess(src: Raster): {
  raster: Raster;
  analysis: RasterAnalysis;
  plan: PreprocessPlan;
} {
  const analysis = analyzeRaster(src);
  const plan = planPreprocessing(analysis);
  return { raster: applyPlan(src, plan), analysis, plan };
}
