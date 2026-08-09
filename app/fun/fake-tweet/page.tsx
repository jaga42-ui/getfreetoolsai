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
  title: "Fake Tweet Generator — Make Meme Tweet Images",
  description:
    "Free fake tweet generator. Build a realistic tweet mockup with custom name, handle, text and stats, then download it as a PNG. In your browser.",
  keywords:
    "fake tweet generator, tweet generator, fake twitter post, tweet mockup, fake tweet maker, tweet image generator",
  path: "/fun/fake-tweet",
});

const jsonLd = softwareAppSchema({
  name: "Fake Tweet Generator",
  description: "Create a realistic tweet mockup image for memes, in your browser.",
  path: "/fun/fake-tweet",
});

const Tool = dynamic(() => import("@/components/tools/fun/FakeTweet"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I make a fake tweet?", a: "Enter a display name, username and tweet text, set the reply/repost/like counts, and toggle the verified badge or dark mode. A live preview updates as you type, and you can download it as a PNG image." },
  { q: "Can I download the tweet as an image?", a: "Yes. The tweet is drawn on a canvas, so you can download it as a high-resolution PNG to drop into a meme or post." },
  { q: "Does it upload my tweet or a photo?", a: "No. The image is generated entirely on your device using the Canvas API — nothing is uploaded." },
  { q: "Is this allowed?", a: "It's for memes and jokes. Please don't use it to impersonate real people, fabricate quotes, or spread misinformation." },
];

const about = (
  <>
    <p>
      This fake tweet generator lets you mock up a realistic-looking tweet with
      your own name, @handle, text and engagement numbers, plus an optional
      verified badge and dark mode. The preview updates live and you can download
      the result as a clean PNG — ideal for memes, jokes and reaction images.
    </p>
    <p>
      Everything is drawn in your browser and nothing is uploaded. Keep it
      harmless and don&apos;t impersonate real people. Pair it with the{" "}
      <a href="/fun/fake-text-message" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fake text message</a>{" "}
      maker or the{" "}
      <a href="/image/meme-maker" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">meme maker</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fake Tweet Generator" />
      <ToolHeader
        title="Fake Tweet Generator"
        description="Mock up a realistic tweet with a custom name, handle, text and stats, then download it as a PNG — for memes and jokes."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The tweet image is drawn on your device with the Canvas API.
      </PrivacyNote>
      <HowItWorks
        name="How to make a fake tweet"
        steps={["Fill in the name, handle and text", "Adjust stats, verified badge and theme", "Download the tweet as a PNG"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fake-tweet" />
    </div>
  );
}
