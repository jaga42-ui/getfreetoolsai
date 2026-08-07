import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "NPS Calculator — Pension Corpus & Monthly Pension",
  description:
    "Calculate your National Pension System (NPS) corpus at 60, tax-free lump sum and monthly pension free online. Adjust contribution, return and annuity.",
  keywords:
    "nps calculator, national pension system calculator, nps pension calculator, nps corpus calculator, nps maturity calculator",
  path: "/calculators/nps",
});

const jsonLd = softwareAppSchema({
  name: "Free NPS Calculator",
  description:
    "Project your NPS retirement corpus, lump-sum withdrawal and monthly pension from your monthly contributions.",
  path: "/calculators/nps",
});

const NpsCalculator = dynamic(() => import("@/components/calc/NpsCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is the NPS corpus calculated?", a: "Your monthly contributions grow with compound interest until you turn 60. The calculator uses the standard future-value formula for a monthly investment, so the corpus depends on how much you invest, for how long and the expected annual return." },
  { q: "How much of the NPS corpus can I withdraw?", a: "At 60 you can withdraw up to 60% of the corpus as a tax-free lump sum. The remaining 40% (or more, if you choose) must be used to buy an annuity that pays your monthly pension." },
  { q: "What return should I assume for NPS?", a: "NPS returns depend on your equity-debt mix. Historically balanced NPS funds have delivered roughly 9–11% a year, but returns are market-linked and not guaranteed." },
  { q: "Is the NPS pension taxable?", a: "The 60% lump sum is tax-free. The monthly annuity pension is added to your income and taxed at your slab rate in the year you receive it." },
  { q: "Does this calculator save my data?", a: "No. All figures are calculated in your browser and nothing is uploaded." },
];

const about = (
  <>
    <p>
      The National Pension System (NPS) is a government-backed retirement scheme
      where you invest every month until age 60 and build a corpus for your
      retirement. This free NPS calculator projects that corpus, the tax-free
      lump sum you can withdraw, and the monthly pension your annuity would pay.
    </p>
    <h3>How it works</h3>
    <p>
      Contributions are compounded monthly until 60. At retirement, part of the
      corpus is taken as a lump sum and the rest buys an annuity. Your monthly
      pension is that annuity amount multiplied by the annuity rate, divided by
      twelve.
    </p>
    <h3>Worked example</h3>
    <p>
      Investing <strong>₹5,000</strong>/month from age <strong>30</strong> at{" "}
      <strong>9%</strong> gives a corpus of roughly <strong>₹1.76 crore</strong>{" "}
      at 60. Using 40% for an annuity at 6% yields about{" "}
      <strong>₹35,000</strong> a month in pension, with the remaining ₹1.05 crore
      taken tax-free.
    </p>
    <p>
      Compare with other long-term options like the{" "}
      <Link href="/calculators/ppf">PPF calculator</Link> or a{" "}
      <Link href="/calculators/sip">SIP calculator</Link> for mutual funds.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="NPS Calculator"
        description="Project your NPS corpus at 60, the tax-free lump sum and your monthly pension from regular contributions."
        currentHref="/calculators/nps"
        current="NPS Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <NpsCalculator />
      </CalculatorPage>
    </>
  );
}
