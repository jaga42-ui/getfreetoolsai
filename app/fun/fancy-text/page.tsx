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
  title: "Fancy Text Generator — 𝓒𝓸𝓸𝓵 Fonts & Stylish Text",
  description:
    "Free fancy text generator. Turn plain words into script, bold, bubble and gothic Unicode fonts to paste into Instagram, TikTok and Discord.",
  keywords:
    "fancy text generator, cool fonts, stylish text, instagram fonts, fancy letters, aesthetic text generator, cursive text",
  path: "/fun/fancy-text",
});

const jsonLd = softwareAppSchema({
  name: "Fancy Text Generator",
  description: "Convert text into fancy Unicode fonts you can copy and paste anywhere.",
  path: "/fun/fancy-text",
});

const Tool = dynamic(() => import("@/components/tools/fun/FancyText"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How does a fancy text generator work?", a: "It maps your normal letters to look-alike Unicode characters — like 𝓼𝓬𝓻𝓲𝓹𝓽, 𝐛𝐨𝐥𝐝 or Ⓑⓤⓑⓑⓛⓔ. Because these are real characters, you can copy and paste them anywhere that accepts text." },
  { q: "Can I use this text in my Instagram or TikTok bio?", a: "Yes. The output is standard Unicode, so it pastes into Instagram, TikTok, Twitter/X, Discord, usernames and bios without any app." },
  { q: "Will it show up on every device?", a: "Most modern phones and computers render these characters, but a few very old devices or apps may show boxes for some styles. Stick to the more common styles for the widest support." },
  { q: "Is my text private?", a: "Yes. The conversion runs entirely in your browser — nothing you type is uploaded." },
];

const about = (
  <>
    <p>
      A fancy text generator turns ordinary words into eye-catching styles using
      special Unicode characters — cursive script, bold, italic, bubble, gothic,
      small caps and more. Because the result is real text (not an image), you can
      copy it and paste it straight into a social bio, username, caption, comment
      or chat.
    </p>
    <p>
      It updates as you type and runs entirely in your browser. Pair it with the{" "}
      <a href="/fun/glitch-text" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">glitch text generator</a>{" "}
      or the{" "}
      <a href="/text/case-converter" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">case converter</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Fancy Text Generator" />
      <ToolHeader
        title="Fancy Text Generator"
        description="Turn plain text into cool Unicode fonts — script, bold, bubble, gothic and more — to copy and paste anywhere."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Styling happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to make fancy text"
        steps={["Type your text", "Pick a style you like", "Copy and paste it anywhere"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/fancy-text" />
    </div>
  );
}
