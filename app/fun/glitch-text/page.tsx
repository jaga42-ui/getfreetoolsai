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
  title: "Glitch Text Generator — Cursed Zalgo Text",
  description:
    "Free glitch text generator. Create cursed, corrupted z̸a̸l̸g̸o̸ text with adjustable intensity to copy and paste into social posts, usernames and chats. Runs in your browser.",
  keywords:
    "glitch text generator, zalgo text, cursed text, corrupted text, creepy text generator, glitchy text",
  path: "/fun/glitch-text",
});

const jsonLd = softwareAppSchema({
  name: "Glitch Text Generator",
  description: "Create cursed zalgo glitch text with adjustable intensity, in your browser.",
  path: "/fun/glitch-text",
});

const Tool = dynamic(() => import("@/components/tools/fun/GlitchText"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is zalgo / glitch text?", a: "It's text with lots of stacked Unicode combining marks that spill above and below the letters, giving a creepy, corrupted, glitching look. It's still real text you can copy and paste." },
  { q: "Can I control how intense the glitch is?", a: "Yes. An intensity slider adds more or fewer combining marks, from a light distortion to a heavily cursed, barely-readable effect." },
  { q: "Where can I paste it?", a: "Most places that accept text — social posts, usernames, Discord and chats. Some apps strip or limit combining marks, so very heavy glitch may render differently." },
  { q: "Is my text private?", a: "Yes. Everything runs in your browser and nothing you type is uploaded." },
];

const about = (
  <>
    <p>
      A glitch text generator (also called zalgo text) stacks Unicode combining
      characters onto your letters so they look corrupted, cursed and glitchy.
      Because it&apos;s still real text, you can copy it into a caption, username,
      comment or chat for a creepy or chaotic effect. An intensity control lets you
      dial the distortion from subtle to extreme.
    </p>
    <p>
      It runs entirely in your browser. Try the{" "}
      <a href="/fun/fancy-text" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fancy text generator</a>{" "}
      or{" "}
      <a href="/fun/upside-down-text" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">upside down text</a>{" "}
      too.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Glitch Text Generator" />
      <ToolHeader
        title="Glitch Text Generator"
        description="Create cursed z̸a̸l̸g̸o̸ glitch text with adjustable intensity to copy and paste anywhere."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        The glitch effect is applied on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to make glitch text"
        steps={["Type your text", "Set the glitch intensity", "Copy the cursed result"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/glitch-text" />
    </div>
  );
}
