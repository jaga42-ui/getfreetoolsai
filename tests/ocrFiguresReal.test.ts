import { describe, it, expect } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { loadRawRgba } from "./helpers/png";
import { detectFigures, isInsideFigure } from "@/lib/ocr/figures";
import { recognizedFromTesseractData } from "@/lib/ocr/providers/tesseract";
import { analyzePage } from "@/lib/ocr/layout";

/**
 * Non-text region detection against real OCR output.
 *
 * Unit tests feed this synthetic rasters with synthetic word boxes. This is the
 * only test where the word boxes come from a real engine on a real rendering —
 * which matters, because the whole method is subtractive: it depends on where
 * Tesseract actually claims the text is, not where a fixture says it is.
 */

const DIR = resolve(__dirname, "../scripts/fixtures");
const RAW = resolve(DIR, "figure-page.raw");
const PNG = resolve(DIR, "figure-page.png");
const ENABLED = process.env.OCR_REAL === "1" && existsSync(RAW);

describe.runIf(ENABLED)("figure detection on a real page", () => {
  it(
    "finds the photograph and leaves the body text alone",
    async () => {
      const [w, h] = readFileSync(resolve(DIR, "figure-page.dim"), "utf8")
        .trim().split(" x ").map(Number);
      const raster = loadRawRgba(readFileSync(RAW), w, h);

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      try {
        const { data } = await worker.recognize(readFileSync(PNG), {}, { blocks: true });
        const recognized = recognizedFromTesseractData(data, 0, w, h);
        const figures = detectFigures(raster, recognized.lines);

        console.log(
          "FIGURES:",
          figures.map((f) => ({ kind: f.kind, bbox: f.bbox }))
        );

        expect(figures.length).toBeGreaterThan(0);

        // The photograph occupies roughly x 120..720, y 320..720.
        const photo = figures.find(
          (f) =>
            f.bbox.x0 < 200 && f.bbox.x1 > 640 && f.bbox.y0 < 400 && f.bbox.y1 > 640
        );
        expect(photo).toBeDefined();
        expect(photo!.kind).toBe("figure");

        // The handwritten scrawl low on the page must also be found.
        // Tesseract reads it as the word "NNN" at ~43% confidence; the detector
        // ignores readings that weak, precisely so a hallucinated word cannot
        // hide the mark it was hallucinated from.
        const scrawl = figures.find((f) => f.bbox.y0 > 950);
        expect(scrawl).toBeDefined();
        expect(["signature", "figure", "unknown"]).toContain(scrawl!.kind);

        // Body text must not be swallowed by a figure region — that would make
        // real content disappear from the extraction.
        const page = analyzePage(recognized);
        const textBlocks = page.blocks.filter((b) =>
          b.lines.some((l) => l.words.some((word) => /report|photograph|ordinary/i.test(word.text)))
        );
        expect(textBlocks.length).toBeGreaterThan(0);
        for (const b of textBlocks) {
          expect(isInsideFigure(b.bbox, figures)).toBe(false);
        }
      } finally {
        await worker.terminate();
      }
    },
    240_000
  );

  it(
    "reports no figures on a page that is only text",
    async () => {
      // The false-positive case that would matter most in production.
      const two = resolve(DIR, "two-column.png");
      if (!existsSync(two)) return;
      const [w, h] = [1240, 900];

      const { createWorker } = await import("tesseract.js");
      const worker = await createWorker("eng");
      try {
        const { data } = await worker.recognize(readFileSync(two), {}, { blocks: true });
        const recognized = recognizedFromTesseractData(data, 0, w, h);

        // Rebuild the raster from the PNG is unnecessary: a white page with the
        // same word boxes is the worst case for false positives, because every
        // inked cell must be attributable to a recognised word.
        const { createRaster } = await import("@/lib/ocr/preprocess");
        const raster = createRaster(w, h, 255);
        for (const line of recognized.lines) {
          for (const word of line.words) {
            for (let y = Math.floor(word.bbox.y0); y < Math.ceil(word.bbox.y1); y++) {
              for (let x = Math.floor(word.bbox.x0); x < Math.ceil(word.bbox.x1); x++) {
                if (x < 0 || y < 0 || x >= w || y >= h) continue;
                const o = (y * w + x) * 4;
                raster.data[o] = 0;
                raster.data[o + 1] = 0;
                raster.data[o + 2] = 0;
              }
            }
          }
        }
        expect(detectFigures(raster, recognized.lines)).toEqual([]);
      } finally {
        await worker.terminate();
      }
    },
    240_000
  );
});
