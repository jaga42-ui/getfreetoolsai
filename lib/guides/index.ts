import type { Guide, GuideCategory } from "./types";
import { GUIDE_CATEGORIES } from "./types";

import removeBackground from "./remove-background-from-images";
import compressImages from "./compress-images-without-losing-quality";
import pdfToWord from "./convert-pdf-to-word";
import whatIsOcr from "./what-is-ocr-and-how-does-it-work";
import sipReturns from "./how-to-calculate-sip-returns";
import compressPdfToSize from "./compress-pdf-to-a-specific-size";
import mergePdfFiles from "./merge-pdf-files-free";
import heicToJpg from "./convert-heic-to-jpg";
import passportPhoto from "./resize-image-for-passport-photo";
import extractText from "./extract-text-from-an-image";
import removeExif from "./remove-exif-metadata-from-photos";
import splitPdf from "./split-pdf-into-separate-pages";
import transcribeWithoutUploading from "./transcribe-audio-without-uploading";
import signPdf from "./how-to-sign-a-pdf-online-free";
import protectPdf from "./how-to-password-protect-a-pdf";
import unlockPdf from "./unlock-a-pdf-without-the-password";
import jpgToPdf from "./convert-jpg-to-pdf";
import pngToJpg from "./convert-png-to-jpg";
import resizeImage from "./how-to-resize-an-image";
import calculateEmi from "./how-to-calculate-emi";
import pdfToJpg from "./how-to-convert-pdf-to-jpg";
import wordToPdf from "./convert-word-to-pdf";
import rotatePdf from "./how-to-rotate-a-pdf";
import cropImage from "./how-to-crop-an-image";
import upscaleImage from "./how-to-upscale-an-image";
import calculatePercentage from "./how-to-calculate-percentage";
import calculateGst from "./how-to-calculate-gst";
import calculateBmi from "./how-to-calculate-bmi";

/** Newest first. Add new guide modules here — nothing else needs to change. */
export const guides: Guide[] = [
  calculateBmi,
  calculateGst,
  calculatePercentage,
  upscaleImage,
  cropImage,
  rotatePdf,
  wordToPdf,
  pdfToJpg,
  calculateEmi,
  resizeImage,
  pngToJpg,
  jpgToPdf,
  unlockPdf,
  protectPdf,
  signPdf,
  transcribeWithoutUploading,
  splitPdf,
  compressPdfToSize,
  mergePdfFiles,
  heicToJpg,
  passportPhoto,
  extractText,
  removeExif,
  removeBackground,
  compressImages,
  pdfToWord,
  whatIsOcr,
  sipReturns,
];

export { GUIDE_CATEGORIES };
export type { Guide, GuideCategory };

export const getCategory = (id: string) => GUIDE_CATEGORIES.find((c) => c.id === id);
export const getGuide = (category: string, slug: string) =>
  guides.find((g) => g.category === category && g.slug === slug);
export const getGuideBySlug = (slug: string) => guides.find((g) => g.slug === slug);
export const guidesByCategory = (category: GuideCategory) =>
  guides.filter((g) => g.category === category);

/** Guides that support a given tool (inverse of a guide's relatedTools). */
export function guidesForTool(toolHref: string, count = 2): Guide[] {
  return guides.filter((g) => g.relatedTools.includes(toolHref)).slice(0, count);
}

/** Related guides: explicit picks first, then same category, then anything. */
export function relatedGuides(slug: string, count = 3): Guide[] {
  const g = getGuideBySlug(slug);
  if (!g) return [];
  const result: Guide[] = [];
  for (const s of g.relatedGuides) {
    const r = getGuideBySlug(s);
    if (r && !result.includes(r)) result.push(r);
  }
  for (const o of guidesByCategory(g.category)) if (o.slug !== slug && !result.includes(o)) result.push(o);
  for (const o of guides) if (o.slug !== slug && !result.includes(o)) result.push(o);
  return result.slice(0, count);
}
