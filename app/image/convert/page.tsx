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
  title: "Convert Image Format Free Online",
  description:
    "Convert JPG to PNG, PNG to WebP, WebP to JPG and more. Free, instant, no signup. Batch convert multiple images.",
  keywords:
    "jpg to png, png to jpg, webp to jpg, image converter free, convert image format online",
  openGraph: {
    title: "Convert Image Format Free Online | GetFreeToolsAI",
    description:
      "Convert JPG to PNG, PNG to WebP, WebP to JPG and more. Free, instant, no signup.",
    url: "https://getfreetoolsai.com/image/convert",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Convert Image Format Free Online",
    description: "Convert between JPG, PNG, WebP and BMP. Free, batch, no signup.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/convert" },
};

const ConvertImage = dynamic(() => import("@/components/tools/ConvertImage"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Which image formats are supported?",
    a: "You can upload JPG, PNG, WebP, BMP and GIF, and convert to JPG, PNG, WebP or BMP. That covers nearly every everyday image conversion.",
  },
  {
    q: "Can I convert multiple images at once?",
    a: "Yes. Add as many images as you like, choose one output format, and convert the whole batch in one click. Download them individually or as a single ZIP.",
  },
  {
    q: "Will converting change my image quality?",
    a: "PNG and BMP are lossless, so no quality is lost. For JPG and WebP you can set a quality slider; higher values preserve more detail at a larger file size.",
  },
  {
    q: "What is WebP and why should I use it?",
    a: "WebP is a modern format from Google that produces noticeably smaller files than JPG or PNG at similar quality, making web pages load faster. It’s supported by all current browsers.",
  },
  {
    q: "Is there a file size limit?",
    a: "Each image can be up to 50MB. Conversion runs in your browser, so the practical limit depends on your device’s memory rather than any server cap.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Convert Image"
      />
      <ToolHeader
        title="Convert Image Format"
        description="Switch between JPG, PNG, WebP and BMP in seconds. Batch convert and download — all in your browser."
      />
      <div className="mt-8">
        <ConvertImage />
      </div>
      <PrivacyNote />
      <HowItWorks
        steps={[
          "Upload your images",
          "Choose the output format",
          "Download converted images",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/convert" />
    </div>
  );
}
