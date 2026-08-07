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
  title: "Reaction Time Test — How Fast Are Your Reflexes?",
  description:
    "Free reaction time test. Click when the screen turns green and measure your reflexes in milliseconds, with your best and average score.",
  keywords:
    "reaction time test, reflex test, reaction speed test, human benchmark, how fast are my reflexes, click speed reaction, reaction time ms",
  path: "/fun/reaction-time",
});

const jsonLd = softwareAppSchema({
  name: "Reaction Time Test",
  description: "Measure your reaction time in milliseconds by clicking when the screen turns green.",
  path: "/fun/reaction-time",
});

const Tool = dynamic(() => import("@/components/tools/fun/ReactionTime"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How does the reaction time test work?", a: "Click the box to start, then wait. After a random delay it turns green — click as fast as you can. The tool measures the milliseconds between the colour change and your click, and tracks your best and average over several tries." },
  { q: "What is a good reaction time?", a: "A typical human visual reaction time is around 200–300 milliseconds. Anything under 200 ms is very fast. Gamers and athletes often score at the quicker end." },
  { q: "Why did it say 'too soon'?", a: "You clicked before the box turned green. Wait for the colour change — clicking early doesn't count, so you can't cheat the timer." },
  { q: "Does my device affect the score?", a: "A little. Screen refresh rate, input lag and mouse or touchscreen latency all add a few milliseconds, so compare scores on the same device." },
];

const about = (
  <>
    <p>
      This reaction time test measures how quickly you respond to a visual cue.
      Click to start, wait for the box to turn green — after an unpredictable
      delay so you can&apos;t anticipate it — then click as fast as you can. Your
      time in milliseconds is shown, along with your best and average across
      attempts.
    </p>
    <p>
      A typical result is 200–300 ms. Everything runs in your browser with nothing
      uploaded. Want to test your fingers instead of your reflexes? Try the{" "}
      <a href="/fun/typing-test" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">typing speed test</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Reaction Time Test" />
      <ToolHeader
        title="Reaction Time Test"
        description="Click when the screen turns green and measure your reflexes in milliseconds — with your best and average score."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The test runs entirely on your device.
      </PrivacyNote>
      <HowItWorks
        name="How to test your reaction time"
        steps={["Click the box to start", "Wait for it to turn green", "Click as fast as you can"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/reaction-time" />
    </div>
  );
}
