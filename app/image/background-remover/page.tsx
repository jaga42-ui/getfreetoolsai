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
import { ToolDemo, BackgroundRemoverDemo } from "@/components/ToolDemo";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Background Remover — Remove BG from Image Free, No Upload | GetFreeToolsAI",
  description:
    "Remove BG from any image free with AI. No signup, no watermark, unlimited uses. Unlike Remove.bg, your photo never leaves your browser — nothing is uploaded. The private background remover.",
  keywords:
    "remove bg, bg remover, remove bg free, remove background from image free, background remover free, remove image background online, remove bg online free, ai background remover, background eraser, remove.bg alternative free",
  path: "/image/background-remover",
});

const jsonLd = softwareAppSchema({
  name: "Free AI Background Remover",
  description:
    "Remove the background from any image free with AI, in your browser. No signup, no watermark, unlimited uses.",
  path: "/image/background-remover",
  ratingCount: 1875,
});

const BackgroundRemover = dynamic(
  () => import("@/components/tools/BackgroundRemover"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How do I remove the BG from an image?",
    a: "Upload your photo and click “Remove background”. The AI automatically removes the bg (background) and gives you a transparent PNG to download — no clicking around the edges, no signup.",
  },
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
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Background Remover"
      />
      <ToolHeader
        title="Background Remover — Remove BG from Image"
        description="Remove the background (BG) from any photo automatically with AI and download a clean, transparent PNG — processed privately in your browser and never uploaded."
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
      <ToolDemo
        title="See what the background remover does"
        caption="An illustration of the transformation: the subject is kept and everything behind it becomes a transparent PNG. Actual results depend on your photo."
      >
        <BackgroundRemoverDemo />
      </ToolDemo>
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free AI background remover — often searched for as a “remove bg”
          or “bg remover” tool — detects the subject of a photo and erases
          everything behind it, giving you a clean transparent PNG in seconds.
          It is the tool you want for product shots on a marketplace, a
          professional profile picture, passport-style photos, or any design
          where you need to drop a subject onto a new background. The biggest
          difference from Remove.bg, which limits free users to a single
          full-resolution image, is that GetFreeToolsAI is genuinely unlimited
          and never adds a watermark. The AI segmentation model runs entirely on
          your own device — your photo is never uploaded, and only the model
          files are downloaded once and then cached, which is why the first run
          is a little slower. Your images stay completely private. It works in
          Chrome, Firefox, Safari, and Edge with no installation and no signup,
          ever.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/background-remover" />
    </div>
  );
}
