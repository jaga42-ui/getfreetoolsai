import { describe, it, expect } from "vitest";
import {
  analyzeRaster,
  applyPlan,
  binarize,
  cloneRaster,
  createRaster,
  cropRaster,
  detectContentBounds,
  estimateSkew,
  histogram,
  medianFilter3,
  otsuThreshold,
  planPreprocessing,
  preprocess,
  rotateRaster,
  stretchContrast,
  toGrayPlane,
  toGrayscale,
  type Raster,
} from "@/lib/ocr/preprocess";

/* ---------------------------- helpers ---------------------------- */

function setPixel(r: Raster, x: number, y: number, v: number) {
  if (x < 0 || y < 0 || x >= r.width || y >= r.height) return;
  const o = (y * r.width + x) * 4;
  r.data[o] = v;
  r.data[o + 1] = v;
  r.data[o + 2] = v;
  r.data[o + 3] = 255;
}
function getPixel(r: Raster, x: number, y: number): number {
  return r.data[(y * r.width + x) * 4];
}
function fillRect(r: Raster, x0: number, y0: number, w: number, h: number, v: number) {
  for (let y = y0; y < y0 + h; y++) for (let x = x0; x < x0 + w; x++) setPixel(r, x, y, v);
}

/** A synthetic page: white, with dark horizontal "text lines". */
function textPage(
  width = 300,
  height = 200,
  opts: { lineHeight?: number; pitch?: number; margin?: number; ink?: number } = {}
): Raster {
  const { lineHeight = 6, pitch = 16, margin = 20, ink = 0 } = opts;
  const r = createRaster(width, height, 255);
  for (let y = margin; y + lineHeight < height - margin; y += pitch) {
    fillRect(r, margin, y, width - margin * 2, lineHeight, ink);
  }
  return r;
}

/* ---------------------------- basics ---------------------------- */

describe("raster basics", () => {
  it("createRaster produces opaque pixels", () => {
    const r = createRaster(4, 4, 0);
    expect(r.data[3]).toBe(255);
    expect(getPixel(r, 0, 0)).toBe(0);
  });

  it("cloneRaster copies rather than aliases", () => {
    const a = createRaster(4, 4, 255);
    const b = cloneRaster(a);
    setPixel(b, 0, 0, 0);
    expect(getPixel(a, 0, 0)).toBe(255);
  });

  it("toGrayscale collapses colour to luma", () => {
    const r = createRaster(2, 1, 0);
    // Pure red: Rec.709 luma is 0.2126 * 255 ≈ 54.
    r.data[0] = 255;
    r.data[1] = 0;
    r.data[2] = 0;
    const g = toGrayscale(r);
    expect(g.data[0]).toBe(g.data[1]);
    expect(g.data[1]).toBe(g.data[2]);
    expect(g.data[0]).toBeCloseTo(54, -1);
  });

  it("toGrayPlane has one sample per pixel", () => {
    expect(toGrayPlane(createRaster(5, 3)).length).toBe(15);
  });
});

/* ---------------------------- histogram / otsu ---------------------------- */

describe("otsuThreshold", () => {
  it("separates a clean bimodal image", () => {
    const r = createRaster(100, 100, 255);
    fillRect(r, 0, 0, 100, 50, 30);
    const t = otsuThreshold(toGrayPlane(r));
    expect(t).toBeGreaterThan(30);
    expect(t).toBeLessThan(255);
  });

  it("handles a page whose ink and paper are both mid-grey", () => {
    // The case a fixed 128 threshold gets wrong: ink at 90, paper at 160.
    const r = createRaster(100, 100, 160);
    fillRect(r, 0, 0, 100, 30, 90);
    const t = otsuThreshold(toGrayPlane(r));
    expect(t).toBeGreaterThan(90);
    expect(t).toBeLessThan(160);
  });

  it("returns a usable value for a uniform image", () => {
    const t = otsuThreshold(toGrayPlane(createRaster(10, 10, 200)));
    expect(t).toBeGreaterThanOrEqual(0);
    expect(t).toBeLessThanOrEqual(255);
  });

  it("histogram sums to the pixel count", () => {
    const h = histogram(toGrayPlane(createRaster(10, 10, 128)));
    expect(h.reduce((a, b) => a + b, 0)).toBe(100);
  });
});

describe("binarize", () => {
  it("splits at the threshold", () => {
    const r = createRaster(2, 1, 255);
    setPixel(r, 0, 0, 50);
    const b = binarize(r, 128);
    expect(getPixel(b, 0, 0)).toBe(0);
    expect(getPixel(b, 1, 0)).toBe(255);
  });
});

/* ---------------------------- contrast ---------------------------- */

describe("stretchContrast", () => {
  it("expands a washed-out image toward the full range", () => {
    const r = createRaster(100, 100, 130);
    fillRect(r, 0, 0, 100, 50, 110);
    const before = analyzeRaster(r).contrastRange;
    const after = analyzeRaster(stretchContrast(r)).contrastRange;
    expect(after).toBeGreaterThan(before);
  });

  it("is not defined by a single outlier pixel", () => {
    // One black speck must not anchor the range and flatten everything else —
    // the classic failure of min/max normalisation.
    const r = createRaster(100, 100, 200);
    fillRect(r, 0, 0, 100, 50, 180);
    setPixel(r, 99, 99, 0);
    const out = stretchContrast(r);
    // The two real tones must still be far apart.
    expect(Math.abs(getPixel(out, 0, 0) - getPixel(out, 0, 99))).toBeGreaterThan(60);
  });

  it("leaves a degenerate image alone rather than dividing by zero", () => {
    const out = stretchContrast(createRaster(10, 10, 128));
    expect(Number.isFinite(getPixel(out, 0, 0))).toBe(true);
  });
});

/* ---------------------------- denoise ---------------------------- */

describe("medianFilter3", () => {
  it("removes an isolated speck", () => {
    const r = createRaster(20, 20, 255);
    setPixel(r, 10, 10, 0);
    expect(getPixel(medianFilter3(r), 10, 10)).toBe(255);
  });

  it("preserves a solid edge", () => {
    // A median filter must not soften a real stroke the way a blur would.
    const r = createRaster(20, 20, 255);
    fillRect(r, 0, 0, 10, 20, 0);
    const out = medianFilter3(r);
    expect(getPixel(out, 2, 10)).toBe(0);
    expect(getPixel(out, 17, 10)).toBe(255);
  });
});

/* ---------------------------- skew ---------------------------- */

describe("estimateSkew", () => {
  it("reports no skew for a level page", () => {
    const s = estimateSkew(textPage());
    expect(Math.abs(s.angle)).toBeLessThan(0.5);
  });

  it("RECOVERS a known rotation angle", () => {
    // The round trip that matters: rotate a page by a known amount and check
    // the estimator finds it back.
    for (const applied of [-4, -2, 3, 5]) {
      const rotated = rotateRaster(textPage(360, 260), applied);
      const { angle } = estimateSkew(rotated);
      expect(Math.abs(angle - applied)).toBeLessThan(1.0);
    }
  });

  it("is confident on a page full of text lines", () => {
    expect(estimateSkew(rotateRaster(textPage(360, 260), 3)).confidence).toBeGreaterThan(0.1);
  });

  it("returns zero for a degenerate image", () => {
    expect(estimateSkew(createRaster(4, 4, 255))).toEqual({ angle: 0, confidence: 0 });
  });
});

describe("rotateRaster", () => {
  it("expands the canvas so nothing is clipped", () => {
    const out = rotateRaster(createRaster(100, 50, 0), 45);
    expect(out.width).toBeGreaterThan(100);
    expect(out.height).toBeGreaterThan(50);
  });

  it("is near-identity at zero degrees", () => {
    const src = textPage(60, 40);
    const out = rotateRaster(src, 0);
    expect(out.width).toBe(60);
    expect(out.height).toBe(40);
    expect(getPixel(out, 30, 20)).toBe(getPixel(src, 30, 20));
  });

  it("fills exposed corners with white, not black", () => {
    // Black corners would be read as ink and wreck the threshold.
    const out = rotateRaster(textPage(100, 100), 10);
    expect(getPixel(out, 0, 0)).toBeGreaterThan(200);
  });
});

/* ---------------------------- borders ---------------------------- */

describe("detectContentBounds", () => {
  it("finds the ink box inside a wide margin", () => {
    const r = createRaster(200, 200, 255);
    fillRect(r, 80, 90, 40, 20, 0);
    const b = detectContentBounds(r, 0);
    expect(b.x0).toBe(80);
    expect(b.y0).toBe(90);
    expect(b.x1).toBe(120);
    expect(b.y1).toBe(110);
  });

  it("applies the requested margin without leaving the image", () => {
    const r = createRaster(50, 50, 255);
    fillRect(r, 0, 0, 5, 5, 0);
    const b = detectContentBounds(r, 8);
    expect(b.x0).toBe(0);
    expect(b.y0).toBe(0);
  });

  it("returns the whole frame when there is no ink", () => {
    // Must not return an empty box a caller might crop to nothing.
    const b = detectContentBounds(createRaster(40, 30, 255));
    expect(b).toEqual({ x0: 0, y0: 0, x1: 40, y1: 30 });
  });
});

describe("cropRaster", () => {
  it("extracts the requested region", () => {
    const r = createRaster(100, 100, 255);
    fillRect(r, 40, 40, 10, 10, 0);
    const out = cropRaster(r, { x0: 40, y0: 40, x1: 50, y1: 50 });
    expect(out.width).toBe(10);
    expect(getPixel(out, 0, 0)).toBe(0);
  });
});

/* ---------------------------- analysis + planning ---------------------------- */

describe("analyzeRaster", () => {
  it("detects a colour image", () => {
    const r = createRaster(50, 50, 255);
    r.data[0] = 255;
    r.data[1] = 0;
    r.data[2] = 0;
    expect(analyzeRaster(r).isGrayscale).toBe(false);
  });

  it("detects a greyscale image", () => {
    expect(analyzeRaster(textPage()).isGrayscale).toBe(true);
  });

  it("measures a low contrast range on a washed-out page", () => {
    const r = createRaster(100, 100, 130);
    fillRect(r, 0, 0, 100, 40, 115);
    expect(analyzeRaster(r).contrastRange).toBeLessThan(60);
  });

  it("reports a large border ratio for a small image on a big frame", () => {
    const r = createRaster(200, 200, 255);
    fillRect(r, 90, 90, 20, 20, 0);
    expect(analyzeRaster(r).borderRatio).toBeGreaterThan(0.5);
  });

  it("measures ink ratio", () => {
    const r = createRaster(100, 100, 255);
    fillRect(r, 0, 0, 100, 25, 0);
    const a = analyzeRaster(r);
    expect(a.inkRatio).toBeGreaterThan(0.2);
    expect(a.inkRatio).toBeLessThan(0.3);
  });
});

describe("planPreprocessing", () => {
  const base = analyzeRaster(textPage(300, 200));

  it("does nothing to an already clean page", () => {
    const plan = planPreprocessing({
      ...base,
      isGrayscale: true,
      contrastRange: 240,
      noiseRatio: 0,
      borderRatio: 0.02,
      skew: { angle: 0, confidence: 0 },
    });
    expect(plan.ops).toEqual([]);
  });

  it("adds grayscale for a colour page", () => {
    const plan = planPreprocessing({ ...base, isGrayscale: false, contrastRange: 240, borderRatio: 0 });
    expect(plan.ops).toContain("grayscale");
  });

  it("ignores skew below the threshold", () => {
    // Resampling for a tenth of a degree costs more than it gains.
    const plan = planPreprocessing({
      ...base,
      contrastRange: 240,
      borderRatio: 0,
      skew: { angle: 0.2, confidence: 0.9 },
    });
    expect(plan.ops).not.toContain("deskew");
  });

  it("ignores a large angle reported with low confidence", () => {
    const plan = planPreprocessing({
      ...base,
      contrastRange: 240,
      borderRatio: 0,
      skew: { angle: 6, confidence: 0.01 },
    });
    expect(plan.ops).not.toContain("deskew");
  });

  it("deskews by the NEGATIVE of the measured angle", () => {
    const plan = planPreprocessing({
      ...base,
      contrastRange: 240,
      borderRatio: 0,
      skew: { angle: 3, confidence: 0.9 },
    });
    expect(plan.ops).toContain("deskew");
    expect(plan.deskewAngle).toBe(-3);
  });

  it("explains every operation it selects", () => {
    // Nothing should happen to a user's scan without a stated reason.
    const plan = planPreprocessing({
      ...base,
      isGrayscale: false,
      contrastRange: 40,
      noiseRatio: 0.3,
      borderRatio: 0.5,
      skew: { angle: 4, confidence: 0.9 },
    });
    expect(plan.ops.length).toBe(5);
    expect(plan.reasons.length).toBe(plan.ops.length);
  });

  it("crops before stretching contrast", () => {
    // A black scanner border would otherwise define the range.
    const plan = planPreprocessing({
      ...base,
      contrastRange: 40,
      borderRatio: 0.5,
      skew: { angle: 0, confidence: 0 },
    });
    expect(plan.ops.indexOf("cropBorder")).toBeLessThan(plan.ops.indexOf("stretchContrast"));
  });

  it("deskews last so the image is resampled once", () => {
    const plan = planPreprocessing({
      ...base,
      isGrayscale: false,
      contrastRange: 40,
      noiseRatio: 0.3,
      borderRatio: 0.5,
      skew: { angle: 4, confidence: 0.9 },
    });
    expect(plan.ops[plan.ops.length - 1]).toBe("deskew");
  });
});

describe("applyPlan / preprocess", () => {
  it("never mutates the source", () => {
    const src = textPage(120, 90);
    const before = new Uint8ClampedArray(src.data);
    preprocess(src);
    expect(src.data).toEqual(before);
  });

  it("returns an owned buffer even for an empty plan", () => {
    const src = textPage(60, 40);
    const out = applyPlan(src, { ops: [], deskewAngle: 0, reasons: [] });
    expect(out).not.toBe(src);
  });

  it("straightens a skewed page end to end", () => {
    const skewed = rotateRaster(textPage(360, 260), 4);
    const { raster, plan } = preprocess(skewed);
    expect(plan.ops).toContain("deskew");
    // Residual skew after correction should be far smaller than we started.
    expect(Math.abs(estimateSkew(raster).angle)).toBeLessThan(1.5);
  });

  it("leaves a clean page essentially untouched", () => {
    const clean = textPage(300, 200);
    const { plan } = preprocess(clean);
    expect(plan.ops).not.toContain("deskew");
    expect(plan.ops).not.toContain("denoise");
  });
});
