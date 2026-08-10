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
  title: "Text Repeater — Repeat Text Any Number of Times Online",
  description:
    "Free text repeater. Repeat a word, line or paragraph any number of times with your choice of separator and optional numbering. Instant, in-browser.",
  keywords:
    "text repeater, repeat text, repeat text generator, duplicate text, repeat a word, copy text multiple times, repeat text online",
  path: "/text/repeat-text",
});

const jsonLd = softwareAppSchema({
  name: "Text Repeater",
  description:
    "Repeat any text a chosen number of times with a custom separator, in your browser.",
  path: "/text/repeat-text",
});

const Tool = dynamic(() => import("@/components/tools/TextRepeater"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I repeat text multiple times?", a: "Type your text, enter how many copies you want, pick a separator (new line, space, comma or custom) and the repeated text appears instantly, ready to copy." },
  { q: "Can I put each copy on its own line?", a: "Yes. Choose the New line separator and every copy is placed on a separate line — useful for filling test data or making a list." },
  { q: "Can I number each repeated copy?", a: "Yes. Turn on \"Number each copy\" and the tool prefixes 1., 2., 3. and so on to each repetition." },
  { q: "Is there a limit to how many times I can repeat?", a: "You can repeat up to 10,000 times. Because it runs on your device, very large outputs are limited only by your browser's memory." },
  { q: "Is my text private?", a: "Yes. Everything runs in your browser, so nothing you type is uploaded or stored." },
];

const about = (
  <>
    <p>
      A text repeater duplicates whatever you type as many times as you want,
      joined by the separator you choose. It saves you from copying and pasting
      the same line over and over — handy for creating placeholder or test data,
      filling a form field, making a repeated pattern for a design, spamming a
      friendly message in a chat, or generating a numbered list from a single
      line.
    </p>
    <p>
      Pick a new line, space or comma between copies, add your own custom
      separator, and optionally number each one. It all runs locally in your
      browser. Need filler paragraphs instead? Use the{" "}
      <a href="/text/lorem-ipsum" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">lorem ipsum generator</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Text Tools" sectionHref="/text-tools" current="Text Repeater" />
      <ToolHeader
        title="Text Repeater"
        description="Repeat a word, line or paragraph any number of times, with a choice of separator and optional numbering — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Repeating happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to repeat text"
        steps={[
          "Type the text to repeat",
          "Set the count and separator",
          "Copy the repeated result",
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
      <RelatedTools currentHref="/text/repeat-text" />
    </div>
  );
}
