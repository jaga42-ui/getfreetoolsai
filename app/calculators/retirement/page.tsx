import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Retirement Calculator — Corpus You Need to Retire",
  description:
    "Find the retirement corpus you need. Free calculator factoring in inflation, expenses and post-retirement returns to size your fund. No signup.",
  keywords:
    "retirement calculator, retirement corpus calculator, retirement planning calculator india, how much to retire, retirement fund calculator, pension corpus calculator",
  path: "/calculators/retirement",
});

const jsonLd = softwareAppSchema({
  name: "Free Retirement Calculator",
  description: "Estimate the retirement corpus needed to fund inflation-adjusted expenses.",
  path: "/calculators/retirement",
});

const Tool = dynamic(() => import("@/components/calc/RetirementCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How much do I need to retire?", a: "Enough to cover your inflation-adjusted expenses for the rest of your life. This calculator projects your future monthly expense at retirement, then works out the corpus needed so that withdrawals — growing with inflation — last until your life expectancy." },
  { q: "How does the calculator estimate the corpus?", a: "It grows your current expense to a future value using inflation, then computes the present value at retirement of an inflation-linked income stream, discounted at your expected post-retirement return (the 'real return' method)." },
  { q: "What return should I assume after retirement?", a: "Retirees usually shift to safer, lower-return investments. A post-retirement return of 7–8% is a common assumption in India, but use a figure you're comfortable with." },
  { q: "Does it account for existing savings or pension?", a: "No — it sizes the total corpus you'll need. Subtract any expected pension, EPF, NPS or existing savings to find the additional amount to accumulate." },
  { q: "Is my data private?", a: "Yes. Everything is calculated in your browser and nothing you enter is stored." },
];

const about = (
  <>
    <p>
      A retirement calculator estimates the corpus you need to have saved by
      retirement to cover your living expenses for the rest of your life,
      accounting for inflation before and during retirement.
    </p>
    <h3>How it works</h3>
    <p>
      It inflates your current monthly expense to its value at retirement, then
      calculates the fund required to sustain that inflation-adjusted spending —
      discounted at your expected post-retirement return — until your life
      expectancy.
    </p>
    <h3>Worked example</h3>
    <p>
      Aged <strong>30</strong>, retiring at <strong>60</strong>, life expectancy{" "}
      <strong>85</strong>, spending <strong>₹50,000</strong> a month, with{" "}
      <strong>6%</strong> inflation and an <strong>8%</strong> post-retirement
      return, you&apos;d need a corpus of roughly <strong>₹6.8 crore</strong> —
      because that ₹50,000 becomes about ₹2.87 lakh a month by age 60.
    </p>
    <p>
      Build the corpus with the{" "}
      <Link href="/calculators/sip">SIP</Link>,{" "}
      <Link href="/calculators/nps">NPS</Link> or{" "}
      <Link href="/calculators/epf">EPF</Link> calculators.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Retirement Calculator"
        description="Estimate the retirement corpus you need to fund your inflation-adjusted expenses from retirement until your life expectancy."
        currentHref="/calculators/retirement"
        current="Retirement Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
