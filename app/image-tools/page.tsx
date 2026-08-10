import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { imageTools } from "@/lib/tools";
import { sizePresetsByKind } from "@/lib/sizePresets";
import { convertPresets } from "@/lib/convertPresets";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

const readyImageTools = imageTools.filter((t) => t.ready);

/**
 * Grouping for the hub.
 *
 * This page ranks around position 5 — the best hub position on the site — so
 * the title, H1 and intro are deliberately left exactly as they are. The only
 * change is structure: 20 cards in one flat grid gave the page no headings, so
 * nothing described what the category covers.
 *
 * As on /calculators, anything missing from a group falls through to a "More"
 * bucket automatically. Since the footer no longer lists every tool, this hub
 * is the crawl path to each image tool.
 */
const GROUPS: { id: string; title: string; blurb: string; hrefs: string[] }[] = [
  {
    id: "resize-compress",
    title: "Resize & compress",
    blurb:
      "Hit an exact pixel size or an exact file size — the two things upload forms actually check.",
    hrefs: [
      "/image/compress",
      "/image/resize",
      "/image/crop",
      "/image/upscale",
    ],
  },
  {
    id: "convert",
    title: "Convert formats",
    blurb:
      "Move between JPG, PNG, WebP and BMP, unpack iPhone HEIC photos, or export an icon set.",
    hrefs: [
      "/image/convert",
      "/image/heic-to-jpg",
      "/image/favicon",
      "/image/to-base64",
    ],
  },
  {
    id: "edit",
    title: "Edit & enhance",
    blurb:
      "Cut out a background with AI, apply filters, add a watermark, or make a quick meme — all client-side.",
    hrefs: [
      "/image/background-remover",
      "/image/blur-background",
      "/image/filters",
      "/image/watermark",
      "/image/rounded-corners",
      "/image/flip-rotate",
      "/image/meme-maker",
      "/image/color-picker",
    ],
  },
  {
    id: "privacy",
    title: "Privacy & metadata",
    blurb:
      "Photos carry more than the picture. Inspect the hidden EXIF, then strip camera details and GPS coordinates before you share.",
    hrefs: ["/image/remove-exif", "/image/metadata-viewer"],
  },
  {
    id: "documents",
    title: "Documents & ID photos",
    blurb:
      "Build a compliant passport or visa photo, or pull the text out of a screenshot or scan with OCR.",
    hrefs: ["/image/passport-photo", "/image/image-to-text"],
  },
];

const byHref = new Map(readyImageTools.map((t) => [t.href, t]));
const claimed = new Set(GROUPS.flatMap((g) => g.hrefs));
const leftover = readyImageTools.filter((t) => !claimed.has(t.href));

const grouped = [
  ...GROUPS.map((g) => ({
    ...g,
    tools: g.hrefs.map((h) => byHref.get(h)).filter(Boolean),
  })),
  ...(leftover.length
    ? [
        {
          id: "more",
          title: "More image tools",
          blurb: "Everything else in the collection.",
          tools: leftover,
        },
      ]
    : []),
].filter((g) => g.tools.length > 0);

const imageSizePresets = sizePresetsByKind("image");

export const metadata = toolMeta({
  title:
    "Free Image Tools — Compress, Resize, Convert & Remove BG",
  description:
    "Free image tools: compress to exact KB, resize, crop, convert, remove background, HEIC to JPG and strip EXIF. No signup, no watermark, no upload.",
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
          readyImageTools.map((t) => ({ name: t.name, href: t.href }))
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
        before sharing, pull text out of an image with OCR, and more. Unlike{" "}
        <Link href="/compare/tinypng-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          TinyPNG
        </Link>{" "}
        or{" "}
        <Link href="/compare/remove-bg-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Remove.bg
        </Link>
        , there are no daily limits and no watermark. Everything runs locally in
        your browser, so your photos never leave your device.
      </p>

      <TrustBadges className="mt-6" />

      {grouped.map((g) => (
        <section key={g.id} className="mt-12" id={g.id}>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            {g.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {g.blurb}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.tools.map((t) => (
              <ToolCard key={t!.href} tool={t!} />
            ))}
          </div>

          {/* Preset shortcuts, shown only where they belong topically. These
              long-tail pages previously had no link from the hub at all. */}
          {g.id === "resize-compress" && (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              <span className="font-medium text-text-primary">
                Need an exact file size?
              </span>{" "}
              Jump straight to{" "}
              {imageSizePresets.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && (i === imageSizePresets.length - 1 ? " or " : ", ")}
                  <Link
                    href={`/image/compress/${p.slug}`}
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    {p.label}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}

          {g.id === "convert" && (
            <p className="mt-5 text-sm leading-relaxed text-text-muted">
              <span className="font-medium text-text-primary">
                Common conversions:
              </span>{" "}
              {convertPresets.map((p, i) => (
                <span key={p.slug}>
                  {i > 0 && (i === convertPresets.length - 1 ? " and " : ", ")}
                  <Link
                    href={`/image/convert/${p.slug}`}
                    className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
                  >
                    {p.from} to {p.toLabel}
                  </Link>
                </span>
              ))}
              .
            </p>
          )}
        </section>
      ))}

      <p className="mt-10 text-[15px] text-text-muted">
        New to this?{" "}
        <Link href="/guides/image" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Read our image guides
        </Link>{" "}
        or see how we compare to{" "}
        <Link href="/compare/tinypng-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          TinyPNG
        </Link>{" "}
        and{" "}
        <Link href="/compare/remove-bg-alternative" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
          Remove.bg
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Meeting an exact size limit
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            Most people arriving here are not trying to edit a photo — they are
            trying to get past an upload form that rejects it. Exam portals,
            government e-forms and job applications typically specify both a pixel
            size and a maximum file size in KB, and they enforce both.
          </p>
          <p>
            The order that works is: crop or{" "}
            <Link href="/image/resize" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              resize
            </Link>{" "}
            to the required dimensions first, then{" "}
            <Link href="/image/compress" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              compress to the target KB
            </Link>
            . Doing it the other way round wastes quality, because resizing after
            compression throws away pixels you already paid for. If a photo will
            not reach a very small limit, crop tighter rather than pushing quality
            lower — fewer pixels compress much better than a heavily degraded
            image.
          </p>
          <p>
            We keep step-by-step specs for the common cases:{" "}
            <Link href="/how-to" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              exam and form photo requirements
            </Link>{" "}
            covering NEET, UPSC, SSC, IBPS, GATE and more, plus{" "}
            <Link href="/passport-photo-sizes" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">
              passport and visa photo sizes for 35+ countries
            </Link>{" "}
            with dimensions in mm, inches and exact pixels at 300 DPI.
          </p>
        </div>
      </section>

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/image-tools" />
    </div>
  );
}
