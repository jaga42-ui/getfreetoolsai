import {
  FileArchive,
  Combine,
  Scissors,
  FileImage,
  FileUp,
  LockOpen,
  RotateCw,
  FileType2,
  ScanText,
  ImageDown,
  Smartphone,
  Eraser,
  Replace,
  Maximize2,
  Crop,
  ShieldOff,
  TextCursorInput,
  ScanSearch,
  Images,
  ShieldCheck,
  FileType,
  Signature,
  FormInput,
  Hash,
  Stamp,
  Expand,
  Droplets,
  FlipHorizontal,
  Aperture,
  SlidersHorizontal,
  Frame,
  Pipette,
  Smile,
  Landmark,
  Scale,
  Flame,
  Percent,
  CalendarDays,
  HandCoins,
  ReceiptIndianRupee,
  TrendingUp,
  Tag,
  Banknote,
  LineChart,
  Wallet,
  Type,
  Ruler,
  CalendarClock,
  Captions,
  CaseSensitive,
  Pilcrow,
  WrapText,
  ArrowDownAZ,
  Link2,
  Minimize2,
  Music,
  Clapperboard,
  Receipt,
  PiggyBank,
  Repeat,
  Vault,
  Award,
  type LucideIcon,
} from "lucide-react";

export type Tool = {
  name: string;
  description: string;
  href: string;
  icon: LucideIcon;
  /** Whether the tool has a working page built. */
  ready: boolean;
};

export const pdfTools: Tool[] = [
  { name: "Compress PDF", description: "Shrink PDF without quality loss", href: "/pdf/compress", icon: FileArchive, ready: true },
  { name: "Merge PDF", description: "Combine multiple PDFs into one", href: "/pdf/merge", icon: Combine, ready: true },
  { name: "Split PDF", description: "Extract pages from any PDF", href: "/pdf/split", icon: Scissors, ready: true },
  { name: "PDF to JPG", description: "Convert PDF pages to images", href: "/pdf/pdf-to-jpg", icon: FileImage, ready: true },
  { name: "JPG to PDF", description: "Convert images to PDF document", href: "/pdf/jpg-to-pdf", icon: FileUp, ready: true },
  { name: "PNG to PDF", description: "Convert PNG images to PDF", href: "/pdf/png-to-pdf", icon: Images, ready: true },
  { name: "Unlock PDF", description: "Remove PDF password protection", href: "/pdf/unlock", icon: LockOpen, ready: true },
  { name: "Protect PDF", description: "Add a password to your PDF", href: "/pdf/protect", icon: ShieldCheck, ready: true },
  { name: "Rotate PDF", description: "Rotate PDF pages instantly", href: "/pdf/rotate", icon: RotateCw, ready: true },
  { name: "PDF to Word", description: "Convert PDF to editable Word doc", href: "/pdf/pdf-to-word", icon: FileType2, ready: true },
  { name: "Word to PDF", description: "Convert Word documents to PDF", href: "/pdf/word-to-pdf", icon: FileType, ready: true },
  { name: "Sign PDF", description: "Draw, type or upload a signature", href: "/pdf/sign", icon: Signature, ready: true },
  { name: "Fill PDF", description: "Fill out PDF forms online", href: "/pdf/fill", icon: FormInput, ready: true },
  { name: "PDF OCR", description: "Extract text from scanned PDFs", href: "/pdf/ocr", icon: ScanText, ready: true },
  { name: "Add Page Numbers", description: "Number your PDF pages", href: "/pdf/number-pages", icon: Hash, ready: true },
  { name: "Add Watermark", description: "Add a watermark to your PDF", href: "/pdf/watermark", icon: Stamp, ready: true },
];

export const imageTools: Tool[] = [
  { name: "Compress Image", description: "Compress to exact KB size", href: "/image/compress", icon: ImageDown, ready: true },
  { name: "HEIC to JPG", description: "Convert iPhone photos to JPG", href: "/image/heic-to-jpg", icon: Smartphone, ready: true },
  { name: "Background Remover", description: "Remove image background", href: "/image/background-remover", icon: Eraser, ready: true },
  { name: "Convert Image", description: "JPG PNG WebP conversion", href: "/image/convert", icon: Replace, ready: true },
  { name: "Resize Image", description: "Resize to exact dimensions", href: "/image/resize", icon: Maximize2, ready: true },
  { name: "Crop Image", description: "Crop images in browser", href: "/image/crop", icon: Crop, ready: true },
  { name: "Flip & Rotate", description: "Rotate and flip images", href: "/image/flip-rotate", icon: FlipHorizontal, ready: true },
  { name: "Image Upscaler", description: "Enhance & upscale resolution", href: "/image/upscale", icon: Expand, ready: true },
  { name: "Image Filters", description: "Filters, brightness & contrast", href: "/image/filters", icon: SlidersHorizontal, ready: true },
  { name: "Blur Background", description: "Blur the background with AI", href: "/image/blur-background", icon: Aperture, ready: true },
  { name: "Add Watermark", description: "Add a text watermark to images", href: "/image/watermark", icon: Droplets, ready: true },
  { name: "Round Corners", description: "Add rounded corners to images", href: "/image/rounded-corners", icon: Frame, ready: true },
  { name: "Color Picker", description: "Pick colors from any image", href: "/image/color-picker", icon: Pipette, ready: true },
  { name: "Meme Maker", description: "Create memes, no watermark", href: "/image/meme-maker", icon: Smile, ready: true },
  { name: "Remove EXIF", description: "Strip photo metadata & GPS", href: "/image/remove-exif", icon: ShieldOff, ready: true },
  { name: "Image to Text", description: "Extract text from any image", href: "/image/image-to-text", icon: TextCursorInput, ready: true },
  { name: "Metadata Viewer", description: "See hidden EXIF, GPS & metadata", href: "/image/metadata-viewer", icon: ScanSearch, ready: true },
];

export const calculatorTools: Tool[] = [
  { name: "EMI Calculator", description: "Loan EMI, interest & schedule", href: "/calculators/emi", icon: Landmark, ready: true },
  { name: "Loan Calculator", description: "Monthly payment & amortization", href: "/calculators/loan", icon: Banknote, ready: true },
  { name: "SIP Calculator", description: "Mutual fund SIP returns", href: "/calculators/sip", icon: TrendingUp, ready: true },
  { name: "Compound Interest", description: "Investment growth over time", href: "/calculators/compound-interest", icon: LineChart, ready: true },
  { name: "GST Calculator", description: "Add or remove GST", href: "/calculators/gst", icon: ReceiptIndianRupee, ready: true },
  { name: "Salary Calculator", description: "CTC to in-hand salary", href: "/calculators/salary", icon: Wallet, ready: true },
  { name: "BMI Calculator", description: "Body mass index & range", href: "/calculators/bmi", icon: Scale, ready: true },
  { name: "Calorie Calculator", description: "BMR, TDEE & macros", href: "/calculators/calorie", icon: Flame, ready: true },
  { name: "Percentage Calculator", description: "7 percentage calculations", href: "/calculators/percentage", icon: Percent, ready: true },
  { name: "Age Calculator", description: "Exact age in years, days", href: "/calculators/age", icon: CalendarDays, ready: true },
  { name: "Tip Calculator", description: "Tip & split the bill", href: "/calculators/tip", icon: HandCoins, ready: true },
  { name: "Discount Calculator", description: "Sale price & savings", href: "/calculators/discount", icon: Tag, ready: true },
  { name: "Word Counter", description: "Words, characters & reading time", href: "/calculators/word-counter", icon: Type, ready: true },
  { name: "Unit Converter", description: "Length, weight, temperature", href: "/calculators/unit-converter", icon: Ruler, ready: true },
  { name: "Date Calculator", description: "Days between dates", href: "/calculators/date", icon: CalendarClock, ready: true },
  { name: "Income Tax Calculator", description: "Old vs new regime, FY 2025-26", href: "/calculators/income-tax", icon: Receipt, ready: true },
  { name: "FD Calculator", description: "Fixed deposit maturity & interest", href: "/calculators/fd", icon: PiggyBank, ready: true },
  { name: "RD Calculator", description: "Recurring deposit maturity", href: "/calculators/rd", icon: Repeat, ready: true },
  { name: "PPF Calculator", description: "PPF maturity over 15 years", href: "/calculators/ppf", icon: Vault, ready: true },
  { name: "Gratuity Calculator", description: "Gratuity from years of service", href: "/calculators/gratuity", icon: Award, ready: true },
];

export const audioTools: Tool[] = [
  { name: "Transcribe Audio & Video", description: "Speech to text + subtitles, on-device", href: "/audio/transcribe", icon: Captions, ready: true },
];

export const videoTools: Tool[] = [
  { name: "Compress Video", description: "Shrink video size, no upload", href: "/video/compress", icon: Minimize2, ready: true },
  { name: "Video to MP3", description: "Extract audio from any video", href: "/video/to-mp3", icon: Music, ready: true },
  { name: "Video to GIF", description: "Turn a clip into an animated GIF", href: "/video/to-gif", icon: Clapperboard, ready: true },
];

export const textTools: Tool[] = [
  { name: "Case Converter", description: "UPPER, lower, Title, camelCase & more", href: "/text/case-converter", icon: CaseSensitive, ready: true },
  { name: "Lorem Ipsum Generator", description: "Placeholder text by words or paragraphs", href: "/text/lorem-ipsum", icon: Pilcrow, ready: true },
  { name: "Remove Line Breaks", description: "Flatten text & clean up spacing", href: "/text/remove-line-breaks", icon: WrapText, ready: true },
  { name: "Remove Duplicate Lines", description: "Dedupe, sort & trim lines", href: "/text/remove-duplicate-lines", icon: ArrowDownAZ, ready: true },
  { name: "Slug Generator", description: "Turn any text into a URL slug", href: "/text/slug-generator", icon: Link2, ready: true },
];

export const allTools = [...pdfTools, ...imageTools, ...calculatorTools, ...audioTools, ...videoTools, ...textTools];

/**
 * Hand-tuned topical clusters. Each tool points first at its strongest
 * neighbours (inverse converters, adjacent workflows, cross-category bridges)
 * so authority flows along genuinely related paths instead of by list order.
 */
const relatedOverrides: Record<string, string[]> = {
  // PDF cluster + image bridges
  "/pdf/compress": ["/pdf/merge", "/pdf/split", "/image/compress", "/pdf/pdf-to-word"],
  "/pdf/merge": ["/pdf/split", "/pdf/compress", "/pdf/jpg-to-pdf", "/pdf/number-pages"],
  "/pdf/split": ["/pdf/merge", "/pdf/compress", "/pdf/rotate", "/pdf/pdf-to-jpg"],
  "/pdf/pdf-to-jpg": ["/pdf/jpg-to-pdf", "/image/compress", "/pdf/compress", "/pdf/split"],
  "/pdf/jpg-to-pdf": ["/pdf/pdf-to-jpg", "/pdf/png-to-pdf", "/image/compress", "/pdf/merge"],
  "/pdf/png-to-pdf": ["/pdf/jpg-to-pdf", "/pdf/pdf-to-jpg", "/image/convert", "/pdf/merge"],
  "/pdf/pdf-to-word": ["/pdf/ocr", "/pdf/word-to-pdf", "/pdf/compress", "/pdf/pdf-to-jpg"],
  "/pdf/word-to-pdf": ["/pdf/pdf-to-word", "/pdf/compress", "/pdf/merge", "/pdf/png-to-pdf"],
  "/pdf/ocr": ["/image/image-to-text", "/pdf/pdf-to-word", "/pdf/compress", "/pdf/split"],
  "/pdf/unlock": ["/pdf/protect", "/pdf/compress", "/pdf/merge", "/pdf/rotate"],
  "/pdf/protect": ["/pdf/unlock", "/pdf/sign", "/pdf/watermark", "/pdf/compress"],
  "/pdf/sign": ["/pdf/fill", "/pdf/protect", "/pdf/watermark", "/pdf/merge"],
  "/pdf/fill": ["/pdf/sign", "/pdf/pdf-to-word", "/pdf/merge", "/pdf/compress"],
  "/pdf/rotate": ["/pdf/split", "/pdf/merge", "/pdf/compress", "/image/flip-rotate"],
  "/pdf/number-pages": ["/pdf/merge", "/pdf/watermark", "/pdf/split", "/pdf/compress"],
  "/pdf/watermark": ["/pdf/number-pages", "/image/watermark", "/pdf/compress", "/pdf/merge"],
  // Image cluster + pdf bridges
  "/image/compress": ["/image/resize", "/image/convert", "/pdf/compress", "/image/crop"],
  "/image/resize": ["/image/crop", "/image/compress", "/image/convert", "/image/upscale"],
  "/image/crop": ["/image/resize", "/image/rounded-corners", "/image/flip-rotate", "/image/compress"],
  "/image/convert": ["/image/compress", "/image/heic-to-jpg", "/pdf/jpg-to-pdf", "/image/resize"],
  "/image/heic-to-jpg": ["/image/convert", "/image/compress", "/image/resize", "/pdf/jpg-to-pdf"],
  "/image/background-remover": ["/image/blur-background", "/image/crop", "/image/rounded-corners", "/image/resize"],
  "/image/blur-background": ["/image/background-remover", "/image/filters", "/image/crop", "/image/resize"],
  "/image/upscale": ["/image/resize", "/image/compress", "/image/convert", "/image/filters"],
  "/image/flip-rotate": ["/image/crop", "/image/resize", "/pdf/rotate", "/image/filters"],
  "/image/filters": ["/image/upscale", "/image/crop", "/image/convert", "/image/rounded-corners"],
  "/image/rounded-corners": ["/image/crop", "/image/background-remover", "/image/resize", "/image/filters"],
  "/image/color-picker": ["/image/filters", "/image/convert", "/image/compress", "/image/crop"],
  "/image/remove-exif": ["/image/metadata-viewer", "/image/compress", "/image/convert", "/image/resize"],
  "/image/metadata-viewer": ["/image/remove-exif", "/image/compress", "/image/convert", "/image/color-picker"],
  "/image/image-to-text": ["/pdf/ocr", "/pdf/pdf-to-word", "/image/convert", "/image/compress"],
  // Text cluster
  "/text/case-converter": ["/text/slug-generator", "/text/remove-line-breaks", "/text/remove-duplicate-lines", "/calculators/word-counter"],
  "/text/lorem-ipsum": ["/text/case-converter", "/text/slug-generator", "/text/remove-line-breaks", "/calculators/word-counter"],
  "/text/remove-line-breaks": ["/text/remove-duplicate-lines", "/text/case-converter", "/text/slug-generator", "/calculators/word-counter"],
  "/text/remove-duplicate-lines": ["/text/remove-line-breaks", "/text/case-converter", "/text/slug-generator", "/calculators/word-counter"],
  "/text/slug-generator": ["/text/case-converter", "/text/remove-line-breaks", "/text/lorem-ipsum", "/calculators/word-counter"],
  // Video/audio cluster
  "/video/compress": ["/video/to-mp3", "/video/to-gif", "/audio/transcribe", "/image/compress"],
  "/video/to-mp3": ["/video/compress", "/video/to-gif", "/audio/transcribe", "/image/compress"],
  "/video/to-gif": ["/video/compress", "/video/to-mp3", "/image/convert", "/audio/transcribe"],
  "/audio/transcribe": ["/video/to-mp3", "/video/compress", "/video/to-gif", "/image/image-to-text"],
};

/** Pick related tools: curated cluster first, then same-category, then anything. */
export function relatedTools(currentHref: string, count = 4): Tool[] {
  const byHref = (href: string) =>
    allTools.find((t) => t.href === href && t.ready);

  const result: Tool[] = [];
  for (const href of relatedOverrides[currentHref] ?? []) {
    const t = byHref(href);
    if (t && !result.includes(t)) result.push(t);
  }

  if (result.length < count) {
    const category = currentHref.startsWith("/pdf")
      ? pdfTools
      : currentHref.startsWith("/image")
      ? imageTools
      : currentHref.startsWith("/calculators")
      ? calculatorTools
      : currentHref.startsWith("/audio")
      ? audioTools
      : currentHref.startsWith("/video")
      ? videoTools
      : currentHref.startsWith("/text")
      ? textTools
      : allTools;
    for (const t of category) {
      if (t.ready && t.href !== currentHref && !result.includes(t)) result.push(t);
      if (result.length >= count) break;
    }
  }

  if (result.length < count) {
    for (const t of allTools) {
      if (t.ready && t.href !== currentHref && !result.includes(t)) result.push(t);
      if (result.length >= count) break;
    }
  }

  return result.slice(0, count);
}

/** Pick related calculators for a calculator page, excluding itself. */
export function relatedCalculators(currentHref: string, count = 4): Tool[] {
  return calculatorTools
    .filter((t) => t.href !== currentHref && t.ready)
    .slice(0, count);
}
