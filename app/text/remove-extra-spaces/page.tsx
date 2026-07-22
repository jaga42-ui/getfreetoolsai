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
  title: "Remove Extra Spaces — Clean Up Double Spaces & Blank Lines",
  description:
    "Free tool to remove extra spaces, double spaces, tabs and blank lines from text. Collapse whitespace and trim lines instantly. Runs entirely in your browser.",
  keywords:
    "remove extra spaces, remove double spaces, remove whitespace, trim spaces, delete blank lines, clean up text, remove spaces online",
  path: "/text/remove-extra-spaces",
});

const jsonLd = softwareAppSchema({
  name: "Remove Extra Spaces",
  description:
    "Collapse double spaces, trim lines and remove blank lines from text in your browser.",
  path: "/text/remove-extra-spaces",
});

const Tool = dynamic(() => import("@/components/tools/RemoveExtraSpaces"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I remove double spaces from text?", a: "Paste your text with \"Collapse multiple spaces into one\" enabled, and every run of two or more spaces becomes a single space instantly." },
  { q: "Can it remove blank lines too?", a: "Yes. Turn on \"Remove blank lines\" and every empty line is stripped out, closing up the gaps in your text." },
  { q: "Will it keep my line breaks?", a: "Yes. This tool cleans spaces and tabs within and around each line but preserves your line breaks. To join everything onto one line instead, use the Remove Line Breaks tool." },
  { q: "Does it convert tabs to spaces?", a: "Optionally. With \"Convert tabs to spaces\" on, each tab becomes a space and then collapses with any neighbours — useful for tidying pasted spreadsheet or code text." },
  { q: "Is my text private?", a: "Yes. Cleaning happens entirely in your browser, so nothing you paste is uploaded." },
];

const about = (
  <>
    <p>
      This tool tidies up messy whitespace in one pass. It can collapse runs of
      double or triple spaces into a single space, trim the spaces at the start
      and end of every line, convert tabs to spaces, and delete blank lines.
      That makes it ideal for cleaning text copied out of a PDF, spreadsheet,
      email or web page, where stray spacing often comes along for the ride.
    </p>
    <p>
      Each option is a toggle, so you control exactly what gets cleaned, and the
      result updates as you type. Everything runs locally in your browser. To
      flatten multi-line text onto a single line, pair it with{" "}
      <a href="/text/remove-line-breaks" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove line breaks</a>, or
      swap specific text with{" "}
      <a href="/text/find-and-replace" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">find and replace</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Text Tools" sectionHref="/text-tools" current="Remove Extra Spaces" />
      <ToolHeader
        title="Remove Extra Spaces"
        description="Collapse double spaces, trim lines, convert tabs and delete blank lines to clean up messy text — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Cleaning happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to remove extra spaces"
        steps={[
          "Paste your messy text",
          "Choose what to clean",
          "Copy the tidied result",
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
      <RelatedTools currentHref="/text/remove-extra-spaces" />
    </div>
  );
}
