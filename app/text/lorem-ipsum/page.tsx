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
  title: "Lorem Ipsum Generator — Free Placeholder Text",
  description:
    "Generate lorem ipsum placeholder text by paragraphs, sentences or words. Copy dummy text for mockups and designs instantly — free, no signup, in your browser.",
  keywords:
    "lorem ipsum generator, placeholder text, dummy text generator, filler text, lorem ipsum copy paste, generate dummy text",
  path: "/text/lorem-ipsum",
});

const jsonLd = softwareAppSchema({
  name: "Lorem Ipsum Generator",
  description:
    "Generate lorem ipsum placeholder text by paragraphs, sentences or words for mockups and designs.",
  path: "/text/lorem-ipsum",
});

const Tool = dynamic(() => import("@/components/tools/LoremIpsum"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is lorem ipsum?",
    a: "Lorem ipsum is scrambled Latin-like placeholder text that designers and developers use to fill layouts before the real copy is ready. It lets you judge typography and spacing without being distracted by meaning.",
  },
  {
    q: "How much text can I generate?",
    a: "Choose any amount from 1 to 200 paragraphs, sentences or words. Each result is freshly generated, and you can hit Regenerate for a new variation.",
  },
  {
    q: "Can I start with the classic 'Lorem ipsum dolor sit amet'?",
    a: "Yes. Tick the option to begin with the traditional opening line, or untick it for fully random filler.",
  },
  {
    q: "Is the generated text always the same?",
    a: "No. Sentence lengths and word order are randomised each time you change a setting or press Regenerate, so you get natural-looking, varied placeholder text.",
  },
  {
    q: "Does this work offline and privately?",
    a: "Yes. The text is generated in your browser with JavaScript — nothing is requested from or sent to a server.",
  },
];

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb
        section="Text Tools"
        sectionHref="/text-tools"
        current="Lorem Ipsum Generator"
      />
      <ToolHeader
        title="Lorem Ipsum Generator"
        description="Create placeholder text by paragraphs, sentences or words for your mockups and designs — generated instantly in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Everything runs in your browser.</span>{" "}
        The placeholder text is generated on your device — no network requests,
        no tracking of what you make.
      </PrivacyNote>
      <HowItWorks
        name="How to generate lorem ipsum"
        steps={[
          "Choose an amount and unit",
          "Pick paragraphs, sentences or words",
          "Copy the placeholder text",
        ]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          About this tool
        </h2>
        <p className="mt-4 text-[15px] leading-relaxed text-text-muted">
          A lorem ipsum generator produces neutral placeholder text so you can
          design a layout before the final copy exists. Because the words carry
          no meaning, your eye focuses on the real work — line length, heading
          hierarchy, whitespace and rhythm. Use it to fill a website wireframe,
          a slide deck, a print mockup, a CMS field or a component in Figma. This
          generator lets you choose the exact number of paragraphs, sentences or
          words, optionally opens with the classic “Lorem ipsum dolor sit amet”
          line, and randomises sentence length for a realistic look. It is free,
          has no limits, and runs entirely in your browser. Need to size your
          copy afterwards? Try the{" "}
          <a
            href="/calculators/word-counter"
            className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
          >
            word counter
          </a>
          .
        </p>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/text/lorem-ipsum" />
    </div>
  );
}
