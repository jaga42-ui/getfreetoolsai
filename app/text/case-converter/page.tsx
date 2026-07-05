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
  title: "Case Converter — Free Online UPPER, lower & Title Case",
  description:
    "Convert text to UPPERCASE, lowercase, Title Case, Sentence case, camelCase, snake_case, kebab-case and more. Instant, free, and runs entirely in your browser.",
  keywords:
    "case converter, uppercase to lowercase, title case converter, sentence case, capitalize text, camelcase converter, change text case online",
  path: "/text/case-converter",
});

const jsonLd = softwareAppSchema({
  name: "Case Converter",
  description:
    "Convert text between UPPERCASE, lowercase, Title Case, Sentence case and programmer cases like camelCase and snake_case.",
  path: "/text/case-converter",
});

const Tool = dynamic(() => import("@/components/tools/CaseConverter"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I change text to all capital letters?",
    a: "Paste your text and choose UPPERCASE. Every letter is converted to a capital instantly, and you can copy the result with one click.",
  },
  {
    q: "What is the difference between Title Case and Sentence case?",
    a: "Title Case capitalises the first letter of every word (Great for headings), while Sentence case only capitalises the first letter of each sentence (Like this).",
  },
  {
    q: "Can it make camelCase or snake_case for code?",
    a: "Yes. The converter detects word boundaries — including existing camelCase — and can output camelCase, PascalCase, snake_case, kebab-case or CONSTANT_CASE for variables, filenames and slugs.",
  },
  {
    q: "Is my text sent to a server?",
    a: "No. The conversion runs entirely in your browser using JavaScript. Nothing you type is uploaded, so it is safe for private or sensitive text.",
  },
  {
    q: "Is there a character limit?",
    a: "There is no fixed limit. You can convert anything from a single word to long documents — the only practical ceiling is your device's memory.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Case Converter"
      />
      <ToolHeader
        title="Case Converter"
        description="Switch text between UPPERCASE, lowercase, Title Case, Sentence case and programmer cases like camelCase and snake_case — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Conversion happens on your device — nothing is uploaded to any server.
      </PrivacyNote>
      <HowItWorks
        name="How to convert text case"
        steps={[
          "Type or paste your text",
          "Pick a case — UPPER, Title, camelCase…",
          "Copy the converted result",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          A case converter changes the capitalisation of your text without
          retyping it. It is handy for fixing a headline that came in ALL CAPS,
          turning a title into a clean URL, standardising a spreadsheet column,
          or generating a variable name in the exact style your codebase uses.
          This tool supports ten styles — UPPERCASE, lowercase, Title Case,
          Sentence case, camelCase, PascalCase, snake_case, kebab-case,
          CONSTANT_CASE and aLtErNaTiNg — and updates the result as you type.
          Everything runs locally in your browser, so it is fast, free, has no
          daily limit, and your text is never uploaded. Pair it with the{" "}
          <a
            href="/calculators/word-counter"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            word counter
          </a>{" "}
          or the{" "}
          <a
            href="/text/slug-generator"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            slug generator
          </a>{" "}
          when preparing content for the web.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/case-converter" />
    </div>
  );
}
