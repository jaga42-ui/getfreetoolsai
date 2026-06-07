import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Word Counter Free Online — Character & Text Analyzer",
  description:
    "Free word counter online. Count words, characters, sentences. Get reading time, readability score, and more. Instant real-time counting. No signup.",
  keywords:
    "word counter, word counter online free, character counter, word count tool, text analyzer free, words and characters counter, count words in text",
  path: "/calculators/word-counter",
});

const jsonLd = softwareAppSchema({
  name: "Free Word Counter & Text Analyzer",
  description:
    "Count words, characters, sentences and get reading time and readability free online.",
  path: "/calculators/word-counter",
  ratingCount: 880,
});

const WordCounter = dynamic(() => import("@/components/calc/WordCounter"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "Does it count in real time?", a: "Yes. Every count and metric updates instantly as you type or paste, with no button to press." },
  { q: "How is reading time calculated?", a: "Reading time assumes an average of 200 words per minute; speaking time assumes about 130 words per minute." },
  { q: "What is the readability score?", a: "It is the Flesch Reading Ease score (0–100). Higher is easier to read — 60–80 is plain English, below 30 is difficult, academic-level text." },
  { q: "Does it count characters with and without spaces?", a: "Yes, both are shown — useful for character limits on platforms like Twitter/X, SMS, or meta descriptions." },
  { q: "Is my text uploaded anywhere?", a: "No. All analysis happens in your browser; your text never leaves your device." },
];

const about = (
  <>
    <p>
      This free word counter and text analyzer gives you live statistics as you
      type or paste: word count, characters with and without spaces, sentences,
      paragraphs, and lines. It also estimates reading time and speaking time, the
      average word length, and a Flesch Reading Ease readability score so you can
      judge how accessible your writing is.
    </p>
    <p>
      It is ideal for students hitting an essay word limit, writers and bloggers
      tracking length, and anyone composing social posts, meta descriptions, or
      SMS within a character cap. Everything runs in your browser instantly and
      privately — nothing is uploaded or stored.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Word Counter & Text Analyzer"
        description="Count words, characters, sentences and paragraphs in real time, with reading time and a readability score."
        currentHref="/calculators/word-counter"
        current="Word Counter"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <WordCounter />
      </CalculatorPage>
    </>
  );
}
