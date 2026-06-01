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
  title: "HEIC to JPG Converter Free Online",
  description:
    "Convert iPhone HEIC photos to JPG instantly. Free, no signup, batch convert multiple files. Works in your browser.",
  keywords:
    "heic to jpg, convert heic to jpeg, iphone photo converter, heif to jpg free",
  openGraph: {
    title: "HEIC to JPG Converter Free Online | GetFreeToolsAI",
    description:
      "Convert iPhone HEIC photos to JPG instantly. Free, no signup, batch convert.",
    url: "https://getfreetoolsai.com/image/heic-to-jpg",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HEIC to JPG Converter Free Online",
    description: "Convert iPhone HEIC photos to JPG instantly. Free, browser-based.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/heic-to-jpg" },
};

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
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
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
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/heic-to-jpg" />
    </div>
  );
}
