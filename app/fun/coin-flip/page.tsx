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
  title: "Flip a Coin — Free Online Coin Flip (Heads or Tails)",
  description:
    "Flip a coin online free. An animated heads-or-tails coin toss with a running tally of results and streaks. Fair, secure randomness — runs in your browser, no signup.",
  keywords:
    "flip a coin, coin flip, coin toss, heads or tails, online coin flip, virtual coin toss, flip a coin online",
  path: "/fun/coin-flip",
});

const jsonLd = softwareAppSchema({
  name: "Coin Flip",
  description: "Flip a virtual coin for heads or tails, with a running tally, in your browser.",
  path: "/fun/coin-flip",
});

const Tool = dynamic(() => import("@/components/tools/fun/CoinFlip"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "Is the coin flip fair?", a: "Yes. Each flip uses the browser's cryptographically secure random generator, giving a genuine 50/50 chance of heads or tails — fairer than most physical coins." },
  { q: "Does it keep a tally?", a: "Yes. It counts your heads and tails, the total number of flips, and shows your current streak when the same side comes up several times in a row." },
  { q: "What can I use it for?", a: "Settling a decision, choosing who goes first, breaking a tie, or demonstrating probability — the more you flip, the closer the split usually gets to 50/50." },
  { q: "Is anything uploaded?", a: "No. The coin flip runs entirely in your browser and nothing is sent to a server." },
];

const about = (
  <>
    <p>
      This coin flip tool tosses a virtual coin for a fair heads-or-tails result.
      Tap <em>Flip the coin</em> and it spins with a 3D animation before landing,
      while a running tally tracks your heads, tails and total flips — plus your
      current streak.
    </p>
    <p>
      Every flip uses secure randomness for a true 50/50 chance, and it all runs
      in your browser with nothing uploaded. Need to pick from several options
      instead of two? Spin the{" "}
      <a href="/fun/spin-wheel" className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary">wheel</a>.
    </p>
  </>
);

export default function Page() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <JsonLd data={jsonLd} />
      <Breadcrumb section="Fun Tools" sectionHref="/fun-tools" current="Flip a Coin" />
      <ToolHeader
        title="Flip a Coin"
        description="An animated, fair heads-or-tails coin toss with a running tally of your results and streaks."
      />
      <div className="mt-8">
        <Tool />
      </div>
      <PrivacyNote>
        <span className="font-medium">Nothing is uploaded.</span>{" "}
        The coin flip runs entirely on your device.
      </PrivacyNote>
      <HowItWorks
        name="How to flip a coin online"
        steps={["Click Flip the coin", "Watch it land on heads or tails", "Track the running tally and streaks"]}
      />
      <section className="mt-14">
        <h2 className="font-display text-2xl font-medium text-text-primary">About this tool</h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">{about}</div>
      </section>
      <FaqSection items={faqs} />
      <RelatedTools currentHref="/fun/coin-flip" />
    </div>
  );
}
