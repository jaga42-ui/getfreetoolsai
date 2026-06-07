import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Percentage Calculator Free Online — 7 Types",
  description:
    "Free percentage calculator online. Calculate percentages, percentage change, increase, decrease, and more. 7 calculation types. Instant results, no signup.",
  keywords:
    "percentage calculator, percentage calculator free, what is percent of number, percentage change calculator, percentage increase calculator, how to calculate percentage",
  path: "/calculators/percentage",
});

const jsonLd = softwareAppSchema({
  name: "Free Percentage Calculator",
  description:
    "Seven percentage calculations — of a number, change, increase, decrease, reverse and difference.",
  path: "/calculators/percentage",
  ratingCount: 2670,
});

const PercentageCalculator = dynamic(
  () => import("@/components/calc/PercentageCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How do I calculate percentage of a number?",
    a: "Multiply the number by the percentage and divide by 100. For example, 15% of 200 = (15 ÷ 100) × 200 = 30.",
  },
  {
    q: "What is the formula for percentage change?",
    a: "Percentage change = ((new value − old value) ÷ old value) × 100. A positive result is an increase and a negative result is a decrease.",
  },
  {
    q: "How do I calculate a percentage increase?",
    a: "Add the percentage of the original to the original: new = original + (original × percent ÷ 100). For example, 200 increased by 15% is 230.",
  },
  {
    q: "What is the difference between percentage and percentile?",
    a: "A percentage is a fraction of 100, while a percentile shows your rank relative to a group — the 90th percentile means you scored higher than 90% of people.",
  },
  {
    q: "How do I add a percentage to a price?",
    a: "Use the “Add % to a number” panel: enter the price and the percentage, and it returns price + that percentage. Handy for tax, tips, and markups.",
  },
];

const about = (
  <>
    <p>
      This free percentage calculator handles the seven percentage problems people
      run into most often, each in its own panel that updates instantly as you
      type. Work out what X% of a number is, find what percentage one number is of
      another, measure a percentage increase or decrease, add or subtract a
      percentage from a value, reverse a percentage to find the original number,
      and compute the percentage difference between two values.
    </p>
    <p>
      Percentages appear everywhere — discounts and sales, exam scores, interest
      and tax, tips, statistics and data analysis. Instead of remembering each
      formula, pick the panel that matches your question and read the answer. Every
      calculation runs entirely in your browser, with nothing uploaded or stored,
      so it is fast and private.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Percentage Calculator"
        description="Seven instant percentage calculations in one place — of a number, change, increase, decrease, reverse and difference."
        currentHref="/calculators/percentage"
        current="Percentage Calculator"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <PercentageCalculator />
      </CalculatorPage>
    </>
  );
}
