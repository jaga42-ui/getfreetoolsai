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
    "HEIC to JPG Converter Free Online — Convert iPhone Photos | GetFreeToolsAI",
  description:
    "Convert HEIC photos from iPhone to JPG free online. Batch convert multiple files. No signup, no watermark. Works in browser — photos never uploaded. Fast and private.",
  keywords:
    "heic to jpg, heic to jpg converter free, convert heic to jpeg, iphone photo to jpg, heif to jpg free, heic converter online",
  path: "/image/heic-to-jpg",
});

const jsonLd = softwareAppSchema({
  name: "Free HEIC to JPG Converter",
  description:
    "Convert iPhone HEIC photos to JPG free online. Batch convert, no signup, no watermark.",
  path: "/image/heic-to-jpg",
  ratingCount: 1190,
});

const HeicToJpg = dynamic(() => import("@/components/tools/HeicToJpg"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is a HEIC file?",
    a: "HEIC (High Efficiency Image Container) is the photo format iPhones use by default since iOS 11. It stores high-quality images at smaller file sizes than JPG, but isn’t supported everywhere.",
  },
  {
    q: "Why can't I open HEIC files on Windows?",
    a: "Older versions of Windows lack a built-in HEIC decoder, so the photos won’t preview or open. Converting them to JPG makes them viewable on any device or website.",
  },
  {
    q: "Can I convert multiple HEIC files at once?",
    a: "Yes. Drop in as many HEIC/HEIF files as you like and convert them all in one batch, then download them individually or together as a ZIP.",
  },
  {
    q: "Will converting HEIC to JPG lose quality?",
    a: "JPG is a lossy format, but with the quality slider set high (85–100%) the difference is virtually invisible. You control the trade-off between size and quality.",
  },
  {
    q: "Do I need to install any software?",
    a: "No. Conversion happens entirely in your browser using the heic2any library. There’s nothing to download or install, and it works offline once the page has loaded.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="HEIC to JPG"
      />
      <ToolHeader
        title="HEIC to JPG Converter"
        description="Convert iPhone HEIC and HEIF photos to universally-supported JPG. Batch convert, in your browser, for free."
      />
      <div className="mt-8">
        <HeicToJpg />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your HEIC photos",
          "Pick a JPG quality",
          "Download your JPG images",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free HEIC to JPG converter turns the high-efficiency photos your
          iPhone takes by default into universally-supported JPG images. It is
          exactly what you need when a HEIC file refuses to open on Windows,
          will not upload to a website, or cannot be shared with someone on a
          non-Apple device. Drop in as many HEIC or HEIF files as you like,
          convert them in one batch, and choose the JPG quality so you control
          the balance between size and detail. Unlike paid converters or app
          downloads, GetFreeToolsAI is completely free with no daily limits and
          no watermark. Conversion happens entirely in your browser using the
          heic2any library, so your photos are never uploaded to a server and
          stay private on your device — it even works offline once the page has
          loaded. It runs in Chrome, Firefox, Safari, and Edge with no
          installation and no signup, ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/heic-to-jpg" />
    </div>
  );
}
