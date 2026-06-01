import type { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Compress Image to Exact KB — Free Online",
  description:
    "Compress JPG, PNG, WebP images to exact file size in KB. Free, no signup, works in browser. Perfect for government forms, college portals, and job applications.",
  keywords:
    "compress image to 200kb, reduce image size, compress photo for online form, image compressor free, photo size reducer",
  openGraph: {
    title: "Compress Image to Exact KB — Free Online | GetFreeToolsAI",
    description:
      "Compress JPG, PNG, WebP images to exact file size in KB. Free, no signup, works in browser.",
    url: "https://getfreetoolsai.com/image/compress",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Compress Image to Exact KB — Free Online",
    description:
      "Compress JPG, PNG, WebP images to exact file size in KB. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/compress" },
};

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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/compress" />
    </div>
  );
}
