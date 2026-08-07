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
  title: "Typing Speed Test — Free WPM Test Online",
  description:
    "Free typing speed test. Measure your typing speed in words per minute (WPM) and accuracy as you type, with live per-character feedback.",
  keywords:
    "typing speed test, wpm test, typing test, words per minute test, typing speed checker, how fast can i type, online typing test",
  path: "/fun/typing-test",
});

const jsonLd = softwareAppSchema({
  name: "Typing Speed Test",
  description: "Measure your typing speed (WPM) and accuracy in your browser.",
  path: "/fun/typing-test",
});

const Tool = dynamic(() => import("@/components/tools/fun/TypingTest"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is typing speed (WPM) calculated?", a: "The standard formula counts every 5 characters as one word: WPM = (correct characters ÷ 5) ÷ minutes typed. Only correctly typed characters count, so accuracy and speed both matter." },
  { q: "What is a good typing speed?", a: "The average typist manages around 40 WPM. 60–70 WPM is fast, and professional typists often exceed 80–100 WPM. Accuracy above 95% is a good target alongside speed." },
  { q: "Does the timer start immediately?", a: "No. The clock starts on your first keystroke and stops the moment you finish the passage, so thinking time before you begin doesn't count against you." },
  { q: "Is my typing recorded anywhere?", a: "No. Everything runs in your browser — nothing you type is sent to a server." },
];

const about = (
  <>
    <p>
      This typing speed test measures how fast and accurately you type. Start
      typing the passage and it tracks your words per minute (WPM) and accuracy
      live, colouring each character green when correct and red when not, so you
      can see exactly where you slip.
    </p>
    <p>
      The timer starts on your first keystroke and stops when you finish, then
      shows your final WPM and accuracy. Click <em>New text</em> for a fresh
      passage. It all runs in your browser — nothing is uploaded. Want to test
      reflexes too? Try the{" "}
      <a href="/fun/reaction-time" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">reaction time test</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Typing Speed Test" />
      <ToolHeader
        title="Typing Speed Test"
        description="Measure your typing speed in words per minute and your accuracy, with live per-character feedback as you type."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing you type is uploaded.</span>{" "}
        The test runs entirely on your device.
      </PrivacyNote>
      <HowItWorks
        name="How to test your typing speed"
        steps={["Start typing the passage shown", "Watch your WPM and accuracy update live", "See your final score, then try a new text"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/typing-test" />
    </div>
  );
}
