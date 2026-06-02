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
        sectionHref="/#all-tools"
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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/compress" />
    </div>
  );
}
