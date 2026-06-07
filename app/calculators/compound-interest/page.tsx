import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Compound Interest Calculator Free — Investment Growth",
  description:
    "Calculate compound interest free online. See how investments grow over time with daily, monthly, or yearly compounding. Compare simple vs compound interest.",
  keywords:
    "compound interest calculator, compound interest calculator free, investment calculator, interest calculator, compound interest formula calculator, savings calculator free",
  path: "/calculators/compound-interest",
});

const jsonLd = softwareAppSchema({
  name: "Free Compound Interest Calculator",
  description:
    "See how savings and investments grow with compound interest at any frequency, free online.",
  path: "/calculators/compound-interest",
  ratingCount: 1320,
});

const CompoundCalculator = dynamic(
  () => import("@/components/calc/CompoundCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "What is the compound interest formula?",
    a: "A = P(1 + r/n)^(nt), where A is the final amount, P is the principal, r is the annual rate as a decimal, n is the number of times interest compounds per year, and t is the number of years.",
  },
  {
    q: "What is the difference between simple and compound interest?",
    a: "Simple interest is calculated only on the original principal, while compound interest is calculated on the principal plus all previously earned interest — so it grows faster, especially over long periods.",
  },
  {
    q: "How does compounding frequency affect returns?",
    a: "The more often interest compounds (daily vs annually), the more you earn, because interest starts earning interest sooner. The effect is shown by the Effective Annual Rate (EAR).",
  },
  {
    q: "What is the Effective Annual Rate (EAR)?",
    a: "EAR is the actual yearly rate once compounding is included: EAR = (1 + r/n)^n − 1. A 12% nominal rate compounded monthly has an EAR of about 12.68%.",
  },
  {
    q: "Can I include regular monthly deposits?",
    a: "Yes. Add an optional monthly deposit and the calculator includes those recurring contributions in the growth, showing how regular investing accelerates your balance.",
  },
];

const about = (
  <>
    <p>
      Compound interest is interest earned on both your original principal and the
      interest that has already accumulated — the reason long-term investing is so
      powerful. This free compound interest calculator shows the final value of a
      lump sum (and optional monthly deposits) using the formula A = P(1 + r/n)^(nt),
      across daily, monthly, quarterly, semi-annual, or annual compounding.
    </p>
    <p>
      Enter your principal, annual interest rate, time period, and compounding
      frequency to see the maturity amount, total interest earned, and the
      Effective Annual Rate. A year-by-year breakdown reveals how growth
      accelerates over time. It is ideal for planning savings, fixed deposits, or
      any investment that compounds. All maths runs locally in your browser;
      results are estimates, so confirm actual returns and tax treatment with your
      bank or financial advisor.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Compound Interest Calculator"
        description="See how a lump sum and regular deposits grow with compound interest at any frequency, with a full yearly breakdown."
        currentHref="/calculators/compound-interest"
        current="Compound Interest"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <CompoundCalculator />
      </CalculatorPage>
    </>
  );
}
