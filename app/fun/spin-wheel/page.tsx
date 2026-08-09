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
  title: "Spin the Wheel — Free Random Picker Wheel",
  description:
    "Free spinner wheel to pick a random name. Add entries, spin the animated wheel and get a winner — ideal for giveaways, classrooms and decisions.",
  keywords:
    "spin the wheel, random picker wheel, wheel of names, spinner wheel, random name picker, decision wheel, wheel spinner",
  path: "/fun/spin-wheel",
});

const jsonLd = softwareAppSchema({
  name: "Spin the Wheel",
  description: "A customizable spinner wheel that picks a random option, in your browser.",
  path: "/fun/spin-wheel",
});

const Tool = dynamic(() => import("@/components/tools/fun/SpinWheel"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I use the spinner wheel?", a: "Type your options one per line — names, choices, prizes — then click Spin the wheel. It spins with a smooth animation and lands on a random winner marked by the pointer at the top." },
  { q: "Is the wheel truly random?", a: "Yes. Each spin picks a winner using the browser's cryptographically secure random generator, so every option has an equal chance regardless of its position on the wheel." },
  { q: "What can I use it for?", a: "Picking a raffle or giveaway winner, choosing who goes first, deciding what to eat, random classroom name selection, or settling any friendly decision." },
  { q: "Is anything uploaded?", a: "No. The wheel runs entirely in your browser — your list of options never leaves your device." },
];

const about = (
  <>
    <p>
      This spin-the-wheel tool is a customizable random picker: add any list of
      names or options and let the wheel choose one at random. It&apos;s great for
      giveaways, classroom name selection, deciding who&apos;s up next, or settling
      &quot;where should we eat?&quot; once and for all.
    </p>
    <p>
      Each spin uses secure randomness so every option is equally likely, and the
      whole thing runs in your browser with nothing uploaded. Need a plain number
      instead? Try the{" "}
      <a href="/dev-tools/random-number" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">random number generator</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Spin the Wheel" />
      <ToolHeader
        title="Spin the Wheel"
        description="Add your own options and spin an animated wheel to pick a random winner — for giveaways, decisions and classrooms."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Your options never leave your browser.</span>{" "}
        The wheel spins on your device — nothing is uploaded.
      </PrivacyNote>
      <HowItWorks
        name="How to spin the wheel"
        steps={["Enter your options, one per line", "Click Spin the wheel", "See the random winner"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/spin-wheel" />
    </div>
  );
}
