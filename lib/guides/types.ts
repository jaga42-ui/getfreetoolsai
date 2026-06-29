import type { ReactNode } from "react";

export type GuideCategory = "image" | "pdf" | "ocr" | "calculator" | "developer" | "audio";

export interface GuideCategoryMeta {
  id: GuideCategory;
  label: string;
  /** SEO title for the category landing page */
  title: string;
  description: string;
}

export const GUIDE_CATEGORIES: GuideCategoryMeta[] = [
  { id: "image", label: "Image Guides", title: "Image Guides — Compress, Resize & Edit Photos", description: "Practical guides for compressing, resizing, converting and editing images — all with free, private, in-browser tools." },
  { id: "pdf", label: "PDF Guides", title: "PDF Guides — Compress, Convert & Edit PDFs", description: "How-to guides for compressing, merging, converting and editing PDF files for free, entirely in your browser." },
  { id: "ocr", label: "OCR Guides", title: "OCR Guides — Extract & Reconstruct Text", description: "Understand OCR and learn how to turn scans and photos into editable, searchable documents — privately, in your browser." },
  { id: "calculator", label: "Calculator Guides", title: "Calculator Guides — Money, Health & Everyday Maths", description: "Clear explanations and worked examples for EMI, SIP, salary, GST, BMI and more, with free calculators." },
  { id: "developer", label: "Developer Guides", title: "Developer Guides — Formats, Encoding & Tools", description: "Concise developer explainers — JSON, JWT, Base64, UUID, regex and more — with free in-browser tools." },
  { id: "audio", label: "Audio & Video Guides", title: "Audio & Video Guides — Transcribe & Caption", description: "Guides for transcribing audio and video and generating subtitles — free, private, and entirely in your browser." },
];

export interface Guide {
  slug: string;
  category: GuideCategory;
  /** SEO + H1 title */
  title: string;
  description: string;
  keywords: string;
  /** one-line summary for cards/listings */
  excerpt: string;
  datePublished: string; // ISO yyyy-mm-dd
  dateModified: string; // ISO yyyy-mm-dd
  authorId: string;
  readingTime: number; // minutes
  tags: string[];
  /** tool hrefs this guide funnels users to */
  relatedTools: string[];
  /** slugs of related guides */
  relatedGuides: string[];
  /** in-page anchor table of contents */
  toc: { id: string; label: string }[];
  body: ReactNode;
}
