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
  title: "Remove Line Breaks — Free Online Text Cleaner",
  description:
    "Remove line breaks and paragraph breaks from text, join lines, and clean up extra spaces. Paste, clean and copy — free, instant, and private in your browser.",
  keywords:
    "remove line breaks, delete line breaks online, remove paragraph breaks, join lines, strip newlines, remove extra spaces from text",
  path: "/text/remove-line-breaks",
});

const jsonLd = softwareAppSchema({
  name: "Remove Line Breaks",
  description:
    "Remove line breaks and paragraph breaks from text, join lines and collapse extra spaces.",
  path: "/text/remove-line-breaks",
});

const Tool = dynamic(() => import("@/components/tools/RemoveLineBreaks"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "Why does text I copy from a PDF have broken lines?",
    a: "PDFs and emails often add a hard line break at the end of every visible line. When you paste elsewhere the text stays chopped up. This tool rejoins those lines into clean, flowing paragraphs.",
  },
  {
    q: "Can I join lines without adding spaces?",
    a: "Yes. Choose to replace each break with a space (best for sentences) or with nothing (best for rejoining a word or code that was split across lines).",
  },
  {
    q: "Will it keep my paragraphs?",
    a: "You control it. Turn off 'Drop empty lines' to keep the blank lines between paragraphs, or turn it on to collapse everything into one block.",
  },
  {
    q: "Does it remove double spaces too?",
    a: "Yes — enable 'Collapse repeated spaces' and any runs of two or more spaces are reduced to a single space.",
  },
  {
    q: "Is my text uploaded?",
    a: "No. All cleaning happens locally in your browser, so your text never leaves your device.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Remove Line Breaks"
      />
      <ToolHeader
        title="Remove Line Breaks"
        description="Strip out unwanted line breaks, rejoin chopped-up lines and tidy extra spaces — paste, clean and copy in seconds."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Cleaning happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to remove line breaks from text"
        steps={[
          "Paste your broken-up text",
          "Choose how to join and clean it",
          "Copy the cleaned text",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Copying text out of a PDF, an email or a chat message often brings
          along a hard line break at the end of every line, leaving you with a
          ragged block that will not reflow. This tool removes those unwanted
          breaks and rejoins the text into clean paragraphs. You decide whether
          each break becomes a space or disappears entirely, whether to trim
          stray spaces around lines, whether to drop empty lines, and whether to
          collapse repeated spaces. It is ideal for tidying pasted quotes,
          reflowing OCR output, cleaning up a CSV cell, or preparing text before
          you run it through the{" "}
          <a
            href="/text/case-converter"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            case converter
          </a>
          . Everything is free, unlimited and processed privately in your
          browser.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/remove-line-breaks" />
    </div>
  );
}
