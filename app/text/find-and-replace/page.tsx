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
  title: "Find and Replace Text Online — Bulk Replace, Regex Support",
  description:
    "Free online find and replace tool. Replace every occurrence of a word or pattern in bulk, with case-sensitive and regular-expression options.",
  keywords:
    "find and replace, find and replace online, replace text, bulk find replace, regex replace, replace all, text find and replace tool",
  path: "/text/find-and-replace",
});

const jsonLd = softwareAppSchema({
  name: "Find and Replace Text",
  description:
    "Find and replace words or regex patterns in bulk, entirely in your browser.",
  path: "/text/find-and-replace",
});

const Tool = dynamic(() => import("@/components/tools/FindReplace"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I find and replace all occurrences at once?", a: "Paste your text, type what to find and what to replace it with, and every match is replaced instantly. The result shows how many replacements were made." },
  { q: "Can I make the search case-sensitive?", a: "Yes. By default the search ignores case, but tick \"Case sensitive\" to match capitalisation exactly — so \"Cat\" no longer matches \"cat\"." },
  { q: "Does it support regular expressions?", a: "Yes. Turn on \"Regular expression\" to find patterns — for example \\d+ to match numbers or \\s+ for whitespace — and use $1, $2 in the replacement to reference capture groups." },
  { q: "How do I delete a word instead of replacing it?", a: "Type the word to find and leave the replace field empty. Every match is removed from the text." },
  { q: "Is my text uploaded?", a: "No. Find and replace runs entirely in your browser, so your text is never sent anywhere — safe for private documents." },
];

const about = (
  <>
    <p>
      Find and replace swaps every occurrence of a word, phrase or pattern in
      your text for something else — all at once, instead of editing by hand.
      It is perfect for correcting a repeated typo, renaming a term throughout a
      document, cleaning up exported data, or stripping out unwanted characters
      by leaving the replacement empty.
    </p>
    <p>
      Toggle <strong>case sensitivity</strong> for exact matching, or switch on{" "}
      <strong>regular expressions</strong> for advanced pattern matching with
      capture groups. Everything runs locally in your browser, so even large or
      sensitive text stays on your device. Also useful:{" "}
      <a href="/text/remove-extra-spaces" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove extra spaces</a>{" "}
      and{" "}
      <a href="/text/remove-line-breaks" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove line breaks</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Text Tools" sectionHref="/text-tools" current="Find and Replace" />
      <ToolHeader
        title="Find and Replace Text"
        description="Replace every occurrence of a word or pattern in bulk, with case-sensitive and regular-expression options — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Find and replace happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to find and replace text"
        steps={[
          "Paste your text",
          "Enter find and replace values",
          "Copy the updated result",
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
      <RelatedTools currentHref="/text/find-and-replace" />
    </div>
  );
}
