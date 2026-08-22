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
  title: "Text Compare — Free Online Diff Checker",
  description:
    "Compare two texts and see exactly what changed, word by word. Free online diff checker — no signup, no upload, runs in your browser.",
  keywords:
    "text compare, diff checker, compare two texts, text difference checker, online diff tool, compare text online free, file compare",
  path: "/text/compare",
});

const jsonLd = softwareAppSchema({
  name: "Free Text Compare & Diff Checker",
  description:
    "Compare two blocks of text side by side and highlight every added, removed and changed word.",
  path: "/text/compare",
});

const Tool = dynamic(() => import("@/components/tools/text/TextCompare"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I compare two texts?",
    a: "Paste the original version in the left box and the changed version in the right box. The comparison updates as you type — added lines are highlighted in green, removed lines in red, and changed lines show the specific words that differ.",
  },
  {
    q: "What is the difference between side-by-side and unified view?",
    a: "Side by side shows both versions in two columns, which is easier for reading prose and spotting reworded sentences. Unified stacks everything in one column with + and − markers, the same layout git and code review tools use, which suits long files and narrow screens.",
  },
  {
    q: "Can I ignore capitalisation or spacing differences?",
    a: "Yes. Ignore case treats “Cat” and “cat” as identical. Ignore whitespace trims leading and trailing spaces and collapses runs of spaces and tabs, which is useful when comparing reformatted or re-indented text.",
  },
  {
    q: "Does it work with code?",
    a: "Yes. Indentation is preserved and the comparison is line based, so it works for source code, JSON, CSV, configuration files and logs as well as prose. Windows and Unix line endings are normalised first, so a file saved on Windows will not show up as entirely changed against the same file saved on Linux.",
  },
  {
    q: "Is my text uploaded anywhere?",
    a: "No. The whole comparison runs in your browser with JavaScript. Nothing is sent to a server, which means you can safely compare contracts, medical notes, source code or anything else confidential.",
  },
  {
    q: "Is there a size limit?",
    a: "There is no hard limit, but very large texts with a large number of differences fall back to a coarser comparison so your browser stays responsive. When that happens the tool tells you, rather than presenting an approximate result as if it were exact.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Text Compare"
      />
      <ToolHeader
        title="Text Compare"
        description="Paste two versions and see exactly what changed — line by line and word by word, entirely in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        The comparison runs on your device, so confidential documents and code
        stay private.
      </PrivacyNote>
      <HowItWorks
        name="How to compare two texts"
        steps={[
          "Paste the original text on the left",
          "Paste the changed text on the right",
          "Read the highlighted differences",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          A diff checker answers one question quickly: what actually changed
          between these two versions? That comes up constantly — proofreading an
          edited draft against the original, checking which clause moved in a
          contract, working out what a colleague altered in a config file, or
          confirming that a copy-paste really was identical. Reading both
          versions side by side and trusting your eyes is slow and unreliable;
          this does it in one pass.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          The comparison works at two levels. First it matches up lines that are
          unchanged, so you can see the shape of the edit. Then, for lines that
          were modified rather than added or deleted outright, it highlights the
          individual words that differ — which is what turns &ldquo;this line
          changed&rdquo; into &ldquo;this one word changed&rdquo;. Line numbers
          are tracked separately for each side, so you can find the spot in your
          real file.
        </p>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          Everything runs locally with JavaScript — nothing is uploaded, and
          there is no signup or daily limit. If you need to clean up the text
          first, the{" "}
          <a
            href="/text/remove-extra-spaces"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            extra space remover
          </a>{" "}
          and{" "}
          <a
            href="/text/remove-duplicate-lines"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            duplicate line remover
          </a>{" "}
          pair well with this one.
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/compare" />
    </div>
  );
}
