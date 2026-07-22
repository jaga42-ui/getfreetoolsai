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
  title: "Morse Code Translator — Text to Morse & Back, With Sound",
  description:
    "Free Morse code translator. Convert text to Morse code and Morse back to text, and play it as audio beeps. Instant, free and runs entirely in your browser.",
  keywords:
    "morse code translator, text to morse, morse to text, morse code converter, morse code generator, morse code with sound",
  path: "/fun/morse-code",
});

const jsonLd = softwareAppSchema({
  name: "Morse Code Translator",
  description: "Translate between text and Morse code and play it as sound, in your browser.",
  path: "/fun/morse-code",
});

const Tool = dynamic(() => import("@/components/tools/fun/MorseCode"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I translate text to Morse code?", a: "Type your text and it's converted to Morse instantly, using dots and dashes with spaces between letters and slashes between words. You can copy the result or play it as audio beeps." },
  { q: "Can it convert Morse code back to text?", a: "Yes. Paste Morse code (dots, dashes, spaces and / for word breaks) and it decodes back into readable text." },
  { q: "Can I hear the Morse code?", a: "Yes. A play button sounds out the dots and dashes as short and long beeps, at a standard Morse timing." },
  { q: "Is my text private?", a: "Yes. Translation runs entirely in your browser and nothing you type is uploaded." },
];

const about = (
  <>
    <p>
      This Morse code translator converts plain text into Morse — dots and dashes,
      with spaces between letters and slashes between words — and decodes Morse
      back into text. You can copy either side, and play the code aloud as short
      and long beeps to hear how it sounds.
    </p>
    <p>
      It runs entirely in your browser. Explore more in{" "}
      <a href="/fun-tools" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">fun tools</a>{" "}
      or the{" "}
      <a href="/text/case-converter" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">text tools</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Morse Code Translator" />
      <ToolHeader
        title="Morse Code Translator"
        description="Convert text to Morse code and back, and play it as audio beeps — instantly, in your browser."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your text never leaves your browser.</span>{" "}
        Translation happens on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to translate Morse code"
        steps={["Type text or paste Morse code", "See the translation instantly", "Copy it or play it as sound"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/morse-code" />
    </div>
  );
}
