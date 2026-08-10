import dynamic from "next/dynamic";
import {
  Breadcrumb,
  ToolHeader,
  HowItWorks,
  FaqSection,
  RelatedTools,
  ToolSkeleton,
} from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { toolMeta, softwareAppSchema } from "@/lib/seo";
import { ToolExtraContent } from "@/components/ToolExtraContent";

export const metadata = toolMeta({
  title: "Blur Background of a Photo Free Online",
  description:
    "Blur a photo background free with AI. Keep your subject sharp for a portrait look — no signup, no watermark, 100% private in your browser.",
  keywords:
    "blur background of photo free, blur image background online, ai background blur, portrait blur photo free, blur photo background free",
  path: "/image/blur-background",
});

const jsonLd = softwareAppSchema({
  name: "Free Blur Background",
  description:
    "Blur a photo's background with AI while keeping the subject sharp. 100% private — your photo never leaves your browser.",
  path: "/image/blur-background",
  ratingCount: 289,
});

const BlurBackground = dynamic(
  () => import("@/components/tools/BlurBackground"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How does the background blur work?",
    a: "An AI model finds the main subject in your photo, then we softly blur everything behind it while keeping the subject sharp — giving you a portrait-style depth effect.",
  },
  {
    q: "Is my photo uploaded to a server?",
    a: "No. The AI model runs locally in your browser and your photo is processed on your device. Only the model files are downloaded once, then cached for next time.",
  },
  {
    q: "Can I control how strong the blur is?",
    a: "Yes. After processing, a slider lets you dial the blur from a subtle softening to a strong, dramatic background blur, with a live preview.",
  },
  {
    q: "What image formats can I use?",
    a: "JPG, PNG and WebP up to 30MB. The result is saved as a high-quality PNG.",
  },
  {
    q: "Is it free and watermark-free?",
    a: "Completely. There's no signup, no daily limit and never a watermark on your result.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Image Tools"
        sectionHref="/image-tools"
        current="Blur Background"
      />
      <ToolHeader
        title="Blur Background of a Photo"
        description="Keep your subject crisp and softly blur everything behind it for a clean, portrait look — privately, in your browser."
      />
      <div className="mt-8">
        <BlurBackground />
      </div>
      <HowItWorks
        steps={[
          "Upload your photo",
          "Let the AI find the subject",
          "Set the blur and download",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Our free blur-background tool gives any photo a clean, professional
          depth-of-field look by keeping the subject sharp and gently blurring
          everything behind them. It&apos;s perfect for profile pictures and
          headshots, product photos that need a distraction-free backdrop, and
          portraits where a busy background pulls attention away from the person.
          An AI model detects the subject automatically — no manual masking — and
          a strength slider lets you choose anything from a subtle softening to a
          strong, dramatic blur. Unlike many free editors, there&apos;s no
          signup, no limit and no watermark, and because the AI runs entirely in
          your browser, your photo is never uploaded to a server. If you&apos;d
          rather remove the background completely, try our Background Remover.
          Works in Chrome, Firefox, Safari and Edge on desktop and mobile.
        </p>
      </section>
      <ToolExtraContent href="/image/blur-background" />
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/image/blur-background" />
    </div>
  );
}
