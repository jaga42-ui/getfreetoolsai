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
  title: "Remove Duplicate Lines — Free Online Dedupe & Sort",
  description:
    "Remove duplicate lines from a list, then optionally sort A–Z and trim blanks. Paste, dedupe and copy — free, instant, and 100% private in your browser.",
  keywords:
    "remove duplicate lines, delete duplicate lines online, dedupe list, remove repeated lines, sort and remove duplicates, unique lines tool",
  path: "/text/remove-duplicate-lines",
});

const jsonLd = softwareAppSchema({
  name: "Remove Duplicate Lines",
  description:
    "Remove duplicate lines from a list, with options to ignore case, trim, drop blanks and sort alphabetically.",
  path: "/text/remove-duplicate-lines",
});

const Tool = dynamic(() => import("@/components/tools/RemoveDuplicateLines"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I remove duplicate lines from a list?",
    a: "Paste your list with one item per line. The tool keeps the first occurrence of each line and removes every later repeat, showing how many duplicates it stripped out.",
  },
  {
    q: "Can it ignore capitalisation?",
    a: "Yes. Enable 'Ignore case when matching' so that 'Apple' and 'apple' are treated as the same line.",
  },
  {
    q: "Does it keep the original order?",
    a: "By default it preserves the order of first appearance. You can also sort the result A → Z or Z → A if you prefer an alphabetised list.",
  },
  {
    q: "Will it remove blank lines?",
    a: "If you enable 'Drop empty lines', all blank lines are removed. Otherwise a single blank line is kept like any other unique value.",
  },
  {
    q: "Is my list uploaded anywhere?",
    a: "No. Deduplication runs entirely in your browser, so your data stays on your device — safe for emails, keywords or any private list.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Remove Duplicate Lines"
      />
      <ToolHeader
        title="Remove Duplicate Lines"
        description="Clean a list by removing repeated lines, with options to ignore case, trim spaces, drop blanks and sort alphabetically."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your list never leaves your browser.</span>{" "}
        Deduplication happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to remove duplicate lines"
        steps={[
          "Paste your list, one item per line",
          "Choose matching and sort options",
          "Copy the de-duplicated result",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          When you merge lists — email addresses, keywords, URLs, product SKUs —
          duplicates creep in. This tool removes repeated lines in one pass and
          tells you exactly how many it deleted. You can match case-sensitively
          or not, trim whitespace so “ apple” and “apple” count as one, drop
          empty lines, and optionally sort the unique results alphabetically. It
          keeps the first occurrence of each line so the original order is
          preserved unless you choose to sort. Because everything runs locally in
          your browser, it handles large lists instantly and keeps sensitive data
          private. Combine it with{" "}
          <a
            href="/text/remove-line-breaks"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            remove line breaks
          </a>{" "}
          to tidy messy pasted data before deduplicating.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/remove-duplicate-lines" />
    </div>
  );
}
