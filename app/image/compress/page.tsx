import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  PrivacyNote,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { ToolDemo, CompressDemo } from "@/components/ToolDemo";
import { ToolExtraContent } from "@/components/ToolExtraContent";
import { ProseSection } from "@/components/ProseSection";
import Link from "next/link";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Compress Image to Exact KB Free — Reduce Photo Size Online | GetFreeToolsAI",
  description:
    "Compress JPG, PNG, WebP images to exact file size in KB free. Set target size like 200KB, 100KB. No signup, no watermark. Perfect for government forms, college portals, job applications. 100% private.",
  keywords:
    "compress image to 200kb, compress image online free, reduce image size, compress photo for online form, image compressor free, reduce image size in kb, compress jpg free, compress png free, tinypng alternative",
  path: "/image/compress",
});

const jsonLd = softwareAppSchema({
  name: "Free Image Compressor",
  description:
    "Compress JPG, PNG, WebP images to an exact file size in KB free. No signup, no watermark.",
  path: "/image/compress",
  ratingCount: 2456,
});

const CompressImage = dynamic(
  () => import("@/components/tools/CompressImage"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "Can I compress image to exactly 200KB?",
    a: "Yes. Choose “Compress to target size”, type 200 in the KB field, and our tool runs a binary-search across quality levels (downscaling if needed) to land at or just under your target. It works for any target — 20KB, 50KB, 100KB, 500KB and beyond.",
  },
  {
    q: "Does compressing reduce image quality?",
    a: "Compression always involves a quality trade-off, but our tool keeps the highest quality possible for your chosen file size. For mild compression (quality 70–90%), the difference is usually invisible to the eye.",
  },
  {
    q: "What image formats are supported?",
    a: "You can upload JPG, PNG and WebP files. JPG and PNG are exported as optimised JPG, while WebP files stay as WebP for the best compression.",
  },
  {
    q: "Is there a file size limit?",
    a: "You can upload images up to 50MB each, and as many as you like in one batch. Because everything runs in your browser, the only real limit is your device’s memory.",
  },
  {
    q: "Are my photos stored on your servers?",
    a: "No. Every image is processed entirely inside your browser on your own device. Your photos are never uploaded to us or anyone else.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Compress Image"
      />
      <ToolHeader
        title="Compress Image to Exact KB"
        description="Shrink JPG, PNG and WebP photos to an exact file size in KB — perfect for government forms, college portals and job applications."
      />

      <div className="mt-8">
        <CompressImage />
      </div>

      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your image(s)",
          "Pick a target KB or quality",
          "Download the compressed image",
        ]}
      />
      <ToolDemo
        title="What compression does"
        caption="Your photo keeps its look while the file gets much lighter. The exact saving depends on the image and the target size you choose."
      >
        <CompressDemo kind="image" />
      </ToolDemo>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free image compressor shrinks JPG, PNG, and WebP photos to an
          exact file size in kilobytes — the feature almost everyone actually
          needs. It is built for the moment a government portal, college
          admission form, or job application refuses your photo because it is
          “larger than 200KB”. Enter your target size and the tool runs a
          binary-search across quality levels, downscaling only if necessary, to
          land at or just under your limit while keeping the best possible
          quality. Unlike TinyPNG, which caps free users and only accepts
          certain formats, GetFreeToolsAI has no daily limits and never adds a
          watermark. Every image is processed entirely inside your browser on
          your own device, so your photos are never uploaded to us or anyone
          else. It works in Chrome, Firefox, Safari, and Edge with no
          installation and no signup, ever.
        </p>
      </section>
      <ToolExtraContent href="/image/compress" />
      <ProseSection title="How to compress an image to an exact size">
        <p>
          Most online portals reject photos that are even a kilobyte over their
          limit, which is why &ldquo;compress to a target size&rdquo; is the feature that
          actually matters. Instead of guessing at a quality percentage, you type
          the size you need — say <strong>200KB</strong> or <strong>50KB</strong> —
          and the tool runs a binary search across quality levels, downscaling the
          image only if it has to, until the result lands at or just under your
          target while keeping the most detail possible.
        </p>
        <h3>Lossy vs lossless compression</h3>
        <p>
          JPG and WebP use <strong>lossy</strong> compression: they discard
          information the eye barely notices to achieve dramatically smaller files.
          PNG is <strong>lossless</strong>, so it stays larger but pixel-perfect.
          For photographs, exporting to optimised JPG or WebP gives the biggest
          savings with no visible difference at quality 70–90%. For screenshots,
          logos and line art with sharp edges or transparency, keep PNG or WebP.
        </p>
        <h3>Common size limits and where they apply</h3>
        <ul>
          <li><strong>20–50KB</strong> — passport and signature photos for many exam and visa forms</li>
          <li><strong>100–200KB</strong> — government portals, college admission and bank KYC uploads</li>
          <li><strong>under 1MB</strong> — most job-application and CV photo fields</li>
          <li><strong>under 100KB per image</strong> — fast-loading website images that help Core Web Vitals</li>
        </ul>
        <h3>Tips for the best quality at a small size</h3>
        <ul>
          <li>Resize the dimensions first if the image is far larger than it needs to be — a 4000px photo shown at 800px wastes most of its bytes.</li>
          <li>Prefer WebP when the destination supports it: it is typically 25–35% smaller than JPG at the same quality.</li>
          <li>Compress once from the original. Repeatedly re-compressing an already-compressed JPG degrades it.</li>
          <li>If a strict KB cap forces visible artefacts, reduce the dimensions slightly rather than crushing the quality.</li>
        </ul>
        <p>
          Working with images for the web? Cut the dimensions first with the{" "}
          <Link href="/image/resize">image resizer</Link>, switch formats with the{" "}
          <Link href="/image/convert">image converter</Link>, or strip hidden
          location data using <Link href="/image/remove-exif">remove EXIF</Link>{" "}
          before you share.
        </p>
      </ProseSection>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/compress" />
    </div>
  );
}
