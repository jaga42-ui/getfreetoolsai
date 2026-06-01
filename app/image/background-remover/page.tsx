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
  title: "Background Remover — Free Online",
  description:
    "Remove the background from any photo automatically with AI, right in your browser. Free, no signup, 100% private. Download a transparent PNG.",
  keywords:
    "background remover, remove background from image, transparent png, ai background remover free, erase background",
  openGraph: {
    title: "Background Remover — Free Online | GetFreeToolsAI",
    description:
      "Remove image backgrounds automatically with AI in your browser. Free, private, transparent PNG.",
    url: "https://getfreetoolsai.com/image/background-remover",
    siteName: "GetFreeToolsAI",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Background Remover — Free Online",
    description: "Remove image backgrounds with AI in your browser. Free, private.",
  },
  alternates: { canonical: "https://getfreetoolsai.com/image/background-remover" },
};

const BackgroundRemover = dynamic(
  () => import("@/components/tools/BackgroundRemover"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How does the background remover work?",
    a: "It runs an AI segmentation model directly in your browser to detect the foreground subject and erase everything behind it, producing a transparent PNG.",
  },
  {
    q: "Is my photo uploaded to a server?",
    a: "No. The model runs locally on your device. The image is never uploaded — only the model files are downloaded once and then cached for future use.",
  },
  {
    q: "Why is the first run slow?",
    a: "The AI model (a few megabytes) downloads the first time you use the tool. After that it’s cached, so subsequent removals are much faster.",
  },
  {
    q: "What image types work best?",
    a: "Photos with a clear subject — people, products, animals — give the cleanest results. Very busy or low-contrast scenes can be harder to separate.",
  },
  {
    q: "What format is the result?",
    a: "A PNG with a transparent background, so you can drop it onto any colour or design without a visible box around the subject.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <Breadcrumb
        section="Image Tools"
        sectionHref="/#all-tools"
        current="Background Remover"
      />
      <ToolHeader
        title="Background Remover"
        description="Automatically erase the background from any photo with AI and download a clean transparent PNG — all processed privately in your browser."
      />
      <div className="mt-8">
        <BackgroundRemover />
      </div>
      <PrivacyNote>
        <span className="font-semibold">
          Your image never leaves your browser.
        </span>{" "}
        The AI model runs entirely on your device — only the model files are
        fetched, never your photo.
      </PrivacyNote>
      <HowItWorks
        steps={[
          "Upload your photo",
          "AI removes the background",
          "Download the transparent PNG",
        ]}
      />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/background-remover" />
    </div>
  );
}
