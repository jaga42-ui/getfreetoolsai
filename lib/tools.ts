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
  { name: "Protect PDF", description: "Add a password to your PDF", href: "/pdf/protect", icon: ShieldCheck, ready: false },
  { name: "Rotate PDF", description: "Rotate PDF pages instantly", href: "/pdf/rotate", icon: RotateCw, ready: true },
  { name: "PDF to Word", description: "Convert PDF to editable Word doc", href: "/pdf/pdf-to-word", icon: FileType2, ready: true },
  { name: "Word to PDF", description: "Convert Word documents to PDF", href: "/pdf/word-to-pdf", icon: FileType, ready: true },
  { name: "Sign PDF", description: "Draw, type or upload a signature", href: "/pdf/sign", icon: Signature, ready: false },
  { name: "Fill PDF", description: "Fill out PDF forms online", href: "/pdf/fill", icon: FormInput, ready: false },
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
  { name: "Blur Background", description: "Blur the background with AI", href: "/image/blur-background", icon: Aperture, ready: false },
  { name: "Add Watermark", description: "Add text or logo watermark", href: "/image/watermark", icon: Droplets, ready: false },
  { name: "Round Corners", description: "Add rounded corners to images", href: "/image/rounded-corners", icon: Frame, ready: true },
  { name: "Color Picker", description: "Pick colors from any image", href: "/image/color-picker", icon: Pipette, ready: true },
  { name: "Meme Maker", description: "Create memes, no watermark", href: "/image/meme-maker", icon: Smile, ready: false },
  { name: "Remove EXIF", description: "Strip photo metadata & GPS", href: "/image/remove-exif", icon: ShieldOff, ready: true },
  { name: "Image to Text", description: "Extract text from any image", href: "/image/image-to-text", icon: TextCursorInput, ready: true },
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
];

export const allTools = [...pdfTools, ...imageTools, ...calculatorTools];

/** Pick related tools from the SAME category, falling back to others if short. */
export function relatedTools(currentHref: string, count = 4): Tool[] {
  const category = currentHref.startsWith("/pdf")
    ? pdfTools
    : currentHref.startsWith("/image")
    ? imageTools
    : currentHref.startsWith("/calculators")
    ? calculatorTools
    : allTools;
  const sameCat = category.filter((t) => t.href !== currentHref && t.ready);
  if (sameCat.length >= count) return sameCat.slice(0, count);
  const fill = allTools.filter(
    (t) => t.ready && t.href !== currentHref && !sameCat.includes(t)
  );
  return [...sameCat, ...fill].slice(0, count);
}

/** Pick related calculators for a calculator page, excluding itself. */
export function relatedCalculators(currentHref: string, count = 4): Tool[] {
  return calculatorTools
    .filter((t) => t.href !== currentHref && t.ready)
    .slice(0, count);
}
