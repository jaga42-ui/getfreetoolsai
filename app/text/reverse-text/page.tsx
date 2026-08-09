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
  title: "Reverse Text — Flip Text, Words & Lines Backwards Online",
  description:
    "Free reverse text generator. Flip text backwards character by character, reverse word order or flip line order. Instant and runs in your browser.",
  keywords:
    "reverse text, reverse text generator, backwards text, flip text, reverse words, reverse lines, text reverser, write backwards",
  path: "/text/reverse-text",
});

const jsonLd = softwareAppSchema({
  name: "Reverse Text Generator",
  description:
    "Reverse text by characters, words or lines instantly in your browser.",
  path: "/text/reverse-text",
});

const Tool = dynamic(() => import("@/components/tools/ReverseText"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I reverse text backwards?", a: "Paste your text and choose Characters. Every character is flipped so the last letter comes first — turning \"hello\" into \"olleh\". Copy the result with one click." },
  { q: "What's the difference between reversing characters and word order?", a: "Reversing Characters flips the whole string letter by letter (hello world → dlrow olleh). Reversing Word order keeps each word intact but puts them in reverse sequence (hello world → world hello)." },
  { q: "Can I reverse the order of lines in a list?", a: "Yes. Choose Line order and the last line becomes the first, which is handy for flipping a chronological list. Each line's text stays unchanged." },
  { q: "Is my text uploaded anywhere?", a: "No. The reversal runs entirely in your browser with JavaScript, so nothing you paste is sent to a server." },
];

const about = (
  <>
    <p>
      A reverse text tool rewrites your text back to front without retyping it.
      It has four modes: flip every <strong>character</strong> (hello → olleh),
      reverse the <strong>word order</strong>, reverse the order of{" "}
      <strong>lines</strong>, or reverse the characters within{" "}
      <strong>each line</strong> separately. People use it for fun and
      social-media captions, to create mirror-writing puzzles, to undo an
      accidentally reversed list, or as a quick programming sanity check.
    </p>
    <p>
      Everything updates as you type and runs locally in your browser, so it is
      instant, free and private. For more text utilities, try the{" "}
      <a href="/text/case-converter" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">case converter</a>{" "}
      or{" "}
      <a href="/text/sort-lines" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">sort lines</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Text Tools" sectionHref="/text-tools" current="Reverse Text" />
      <ToolHeader
        title="Reverse Text"
        description="Flip text backwards by characters, reverse the word order, or reverse the order of lines — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Reversing happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to reverse text"
        steps={[
          "Type or paste your text",
          "Choose characters, words or lines",
          "Copy the reversed result",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          {about}
        </div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/reverse-text" />
    </div>
  );
}
