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
import compoundInterest from "./how-to-calculate-compound-interest";
import inHandSalary from "./how-to-calculate-in-hand-salary-from-ctc";
import calorieNeeds from "./how-to-calculate-daily-calorie-needs";
import discount from "./how-to-calculate-a-discount";
import blurBackground from "./how-to-blur-the-background-of-a-photo";
import addWatermark from "./how-to-add-a-watermark-to-a-photo";
import pngToPdf from "./how-to-convert-png-to-pdf";
import fillPdfForm from "./how-to-fill-out-a-pdf-form";
import loanAmortization from "./how-to-read-a-loan-amortization-schedule";
import exactAge from "./how-to-calculate-your-exact-age";
import calculateTip from "./how-to-calculate-a-tip";
import wordCount from "./how-to-count-words-and-characters";
import convertUnits from "./how-to-convert-units-of-measurement";
import daysBetweenDates from "./how-to-calculate-days-between-two-dates";
import flipRotateImage from "./how-to-flip-or-rotate-an-image";
import brightnessContrast from "./how-to-adjust-brightness-and-contrast";
import roundCorners from "./how-to-round-the-corners-of-an-image";
import colorCode from "./how-to-get-the-color-code-from-an-image";
import makeMeme from "./how-to-make-a-meme";
import viewMetadata from "./how-to-view-photo-metadata";
import pdfPageNumbers from "./how-to-add-page-numbers-to-a-pdf";
import pdfWatermark from "./how-to-add-a-watermark-to-a-pdf";
import mortgagePayment from "./how-to-calculate-a-mortgage-payment";
import carPayment from "./how-to-calculate-a-car-payment";
import k401Match from "./how-a-401k-match-works";
import payoffCreditCard from "./how-to-pay-off-credit-card-debt-faster";
import salesTax from "./how-to-calculate-sales-tax";

/** Newest first. Add new guide modules here — nothing else needs to change. */
export const guides: Guide[] = [
  mortgagePayment,
  carPayment,
  k401Match,
  payoffCreditCard,
  salesTax,
  pdfWatermark,
  pdfPageNumbers,
  viewMetadata,
  makeMeme,
  colorCode,
  roundCorners,
  brightnessContrast,
  flipRotateImage,
  daysBetweenDates,
  convertUnits,
  wordCount,
  calculateTip,
  exactAge,
  loanAmortization,
  fillPdfForm,
  pngToPdf,
  addWatermark,
  blurBackground,
  discount,
  calorieNeeds,
  inHandSalary,
  compoundInterest,
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
