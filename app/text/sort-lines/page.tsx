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
  title: "Sort Lines — Alphabetize & Sort a List of Text Online",
  description:
    "Free tool to sort lines of text alphabetically (A–Z or Z–A), by length or number, reverse or shuffle. Remove duplicates and blank lines too. Runs in your browser.",
  keywords:
    "sort lines, alphabetize list, sort text alphabetically, sort list online, put in alphabetical order, sort lines a to z, line sorter",
  path: "/text/sort-lines",
});

const jsonLd = softwareAppSchema({
  name: "Sort Lines",
  description:
    "Sort and alphabetize lines of text by name, length or number, in your browser.",
  path: "/text/sort-lines",
});

const Tool = dynamic(() => import("@/components/tools/SortLines"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I put a list in alphabetical order?", a: "Paste your list with one item per line and choose A → Z. The lines are sorted alphabetically instantly, and Z → A reverses it. Numbers within lines are handled naturally, so item2 comes before item10." },
  { q: "Can I sort by number instead of alphabetically?", a: "Yes. Choose Number ↑ or Number ↓ and the tool sorts by the first number it finds in each line — useful for sorting prices, scores or IDs." },
  { q: "Can it remove duplicate lines while sorting?", a: "Yes. Turn on \"Remove duplicates\" to keep only the first occurrence of each line, and \"Ignore case\" to treat Apple and apple as the same." },
  { q: "Can I randomize the order of lines?", a: "Yes. Choose Shuffle to put the lines in a random order — handy for randomising a list of names or questions." },
  { q: "Is my list uploaded anywhere?", a: "No. Sorting runs entirely in your browser, so your list never leaves your device." },
];

const about = (
  <>
    <p>
      This tool sorts a list of lines however you need: alphabetically{" "}
      <strong>A → Z</strong> or <strong>Z → A</strong>, by line{" "}
      <strong>length</strong>, by the <strong>number</strong> inside each line,
      simply <strong>reversed</strong>, or <strong>shuffled</strong> into a
      random order. Alphabetical sorting is natural and case-aware, so
      &quot;item2&quot; correctly comes before &quot;item10&quot;.
    </p>
    <p>
      Optional toggles let you ignore case, trim each line, drop blank lines, and
      remove duplicates in the same pass — so you can alphabetize and de-dupe a
      list at once. It all runs locally in your browser. For dedicated
      de-duplication, see{" "}
      <a href="/text/remove-duplicate-lines" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove duplicate lines</a>, or tidy spacing with{" "}
      <a href="/text/remove-extra-spaces" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">remove extra spaces</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Text Tools" sectionHref="/text-tools" current="Sort Lines" />
      <ToolHeader
        title="Sort Lines"
        description="Alphabetize and sort a list of lines A–Z, by length or number, reverse or shuffle — with optional de-duplication, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your list never leaves your browser.</span>{" "}
        Sorting happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to sort lines of text"
        steps={[
          "Paste your list, one item per line",
          "Pick a sort order",
          "Copy the sorted result",
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
      <RelatedTools currentHref="/text/sort-lines" />
    </div>
  );
}
