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
  title: "Upside Down Text Generator — Flip Text ˙uʍop ǝpısdn",
  description:
    "Free upside down text generator. Flip your words to write ˙uʍop ǝpısdn and copy-paste them into social posts, usernames and chats. Instant, free, in your browser.",
  keywords:
    "upside down text, flip text, upside down text generator, flip text generator, reverse text upside down, ǝpısdn down text",
  path: "/fun/upside-down-text",
});

const jsonLd = softwareAppSchema({
  name: "Upside Down Text Generator",
  description: "Flip text upside down to copy and paste anywhere, in your browser.",
  path: "/fun/upside-down-text",
});

const Tool = dynamic(() => import("@/components/tools/fun/UpsideDownText"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How does upside down text work?", a: "Each letter is swapped for a Unicode character that looks like its flipped version, and the order is reversed, so the whole line reads as if turned 180°. It's real text you can copy and paste." },
  { q: "Where can I use flipped text?", a: "Anywhere that accepts text — Instagram and TikTok captions, usernames, bios, comments and chats. It's a fun way to make a post stand out." },
  { q: "Does every character flip?", a: "Letters, numbers and common punctuation have upside-down equivalents. A few rare symbols may stay the same if no flipped character exists." },
  { q: "Is my text private?", a: "Yes. The flip happens in your browser and nothing you type is uploaded." },
];

const about = (
  <>
    <p>
      An upside down text generator flips your writing so it reads{" "}
      <span className="whitespace-nowrap">˙uʍop ǝpısdn</span>. It swaps each
      character for a look-alike that appears rotated 180° and reverses the order,
      producing real Unicode text you can copy and paste into a caption, bio,
      username or message for a playful effect.
    </p>
    <p>
      It runs entirely in your browser. Also try the{" "}
      <a href="/fun/fancy-text" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fancy text generator</a>{" "}
      or the{" "}
      <a href="/text/reverse-text" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">reverse text</a>{" "}
      tool.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Upside Down Text" />
      <ToolHeader
        title="Upside Down Text Generator"
        description="Flip your text to write ˙uʍop ǝpısdn and copy it anywhere — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Flipping happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to flip text upside down"
        steps={["Type your text", "See it flipped instantly", "Copy the upside-down result"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/upside-down-text" />
    </div>
  );
}
