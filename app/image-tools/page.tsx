import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { FaqSection } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { imageTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Free Image Tools Online — Compress, Resize, Convert & Remove BG | GetFreeToolsAI",
  description:
    "Free image tools that run 100% in your browser — compress to exact KB, resize, crop, convert, remove background, HEIC to JPG, remove EXIF/GPS and more. No signup, no watermark, no upload.",
  keywords:
    "free image tools, image compressor free, resize image online, convert image, remove background free, heic to jpg, crop image online, remove exif data, tinypng alternative, remove.bg alternative",
  path: "/image-tools",
});

const faqs = [
  {
    q: "Are these image tools free?",
    a: "Yes — every image tool is completely free with no daily limits, no signup, and no watermark on your images.",
  },
  {
    q: "Are my photos uploaded anywhere?",
    a: "No. All image processing happens locally in your browser on your own device. Your photos are never uploaded to us or anyone else, which is ideal for personal and sensitive images.",
  },
  {
    q: "Can I compress an image to an exact size like 200KB?",
    a: "Yes. The image compressor lets you target an exact file size in KB — perfect for government forms, exam portals and job applications that enforce a size limit.",
  },
  {
    q: "Which image formats are supported?",
    a: "The tools work with JPG, PNG, WebP, BMP and HEIC depending on the task, covering nearly every everyday image format.",
  },
  {
    q: "Do these tools work on mobile?",
    a: "Yes. Every image tool works in mobile browsers on Android and iPhone, with no app to install.",
  },
];

export default function ImageToolsHub() {
  const ready = imageTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Image Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Image Tools",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Image Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Image Tools Online
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        Everything you need to work with images, free and private. Compress a
        photo to an exact size in KB for a form, resize or crop to precise
        dimensions, convert between JPG, PNG and WebP, convert iPhone HEIC
        photos, remove a background with AI, strip hidden EXIF and GPS metadata
        before sharing, pull text out of an image with OCR, and more. Unlike
        TinyPNG or Remove.bg, there are no daily limits and no watermark.
        Everything runs locally in your browser, so your photos never leave your
        device.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <FaqSection items={faqs} />
    </div>
  );
}
