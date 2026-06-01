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
  {
    name: "Compress PDF",
    description: "Shrink PDF without quality loss",
    href: "/pdf/compress",
    icon: FileArchive,
    ready: true,
  },
  {
    name: "Merge PDF",
    description: "Combine multiple PDFs into one",
    href: "/pdf/merge",
    icon: Combine,
    ready: true,
  },
  {
    name: "Split PDF",
    description: "Extract pages from any PDF",
    href: "/pdf/split",
    icon: Scissors,
    ready: true,
  },
  {
    name: "PDF to JPG",
    description: "Convert PDF pages to images",
    href: "/pdf/pdf-to-jpg",
    icon: FileImage,
    ready: true,
  },
  {
    name: "JPG to PDF",
    description: "Convert images to PDF document",
    href: "/pdf/jpg-to-pdf",
    icon: FileUp,
    ready: true,
  },
  {
    name: "Unlock PDF",
    description: "Remove PDF password protection",
    href: "/pdf/unlock",
    icon: LockOpen,
    ready: true,
  },
  {
    name: "Rotate PDF",
    description: "Rotate PDF pages instantly",
    href: "/pdf/rotate",
    icon: RotateCw,
    ready: true,
  },
  {
    name: "PDF to Word",
    description: "Convert PDF to editable Word doc",
    href: "/pdf/pdf-to-word",
    icon: FileType2,
    ready: true,
  },
  {
    name: "PDF OCR",
    description: "Extract text from scanned PDFs",
    href: "/pdf/ocr",
    icon: ScanText,
    ready: true,
  },
];

export const imageTools: Tool[] = [
  {
    name: "Compress Image",
    description: "Compress to exact KB size",
    href: "/image/compress",
    icon: ImageDown,
    ready: true,
  },
  {
    name: "HEIC to JPG",
    description: "Convert iPhone photos to JPG",
    href: "/image/heic-to-jpg",
    icon: Smartphone,
    ready: true,
  },
  {
    name: "Background Remover",
    description: "Remove image background",
    href: "/image/background-remover",
    icon: Eraser,
    ready: true,
  },
  {
    name: "Convert Image",
    description: "JPG PNG WebP conversion",
    href: "/image/convert",
    icon: Replace,
    ready: true,
  },
  {
    name: "Resize Image",
    description: "Resize to exact dimensions",
    href: "/image/resize",
    icon: Maximize2,
    ready: true,
  },
  {
    name: "Crop Image",
    description: "Crop images in browser",
    href: "/image/crop",
    icon: Crop,
    ready: true,
  },
  {
    name: "Remove EXIF",
    description: "Strip photo metadata & GPS",
    href: "/image/remove-exif",
    icon: ShieldOff,
    ready: true,
  },
  {
    name: "Image to Text",
    description: "Extract text from any image",
    href: "/image/image-to-text",
    icon: TextCursorInput,
    ready: true,
  },
];

export const allTools = [...pdfTools, ...imageTools];

/** Pick a few related tools for a given tool href, excluding itself. */
export function relatedTools(currentHref: string, count = 4): Tool[] {
  const pool = allTools.filter((t) => t.href !== currentHref && t.ready);
  return pool.slice(0, count);
}
