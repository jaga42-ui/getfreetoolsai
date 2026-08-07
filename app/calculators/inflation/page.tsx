import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Inflation Calculator — Future Cost & Buying Power",
  description:
    "See how inflation changes the value of money over time. Free inflation calculator showing the future cost of an amount and how much its buying power erodes.",
  keywords:
    "inflation calculator, inflation calculator india, future value of money, purchasing power calculator, cost of living calculator, value of money over time",
  path: "/calculators/inflation",
});

const jsonLd = softwareAppSchema({
  name: "Free Inflation Calculator",
  description: "Calculate the future cost of money and how inflation erodes buying power.",
  path: "/calculators/inflation",
});

const Tool = dynamic(() => import("@/components/calc/InflationCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How does the inflation calculator work?", a: "It uses compound growth. Future cost = amount × (1 + inflation)^years shows what something will cost later, and amount ÷ (1 + inflation)^years shows how much your money will actually buy in the future." },
  { q: "What is buying power?", a: "Buying power (or purchasing power) is how much you can actually buy with a sum of money. Inflation erodes it — ₹1,00,000 today buys less in 10 years even though the number is unchanged." },
  { q: "What inflation rate should I use?", a: "India's long-run consumer inflation has averaged roughly 5–7%. Use a rate that reflects your expectation; try a few values to see a range." },
  { q: "Why does inflation matter for investing?", a: "If your investments don't grow faster than inflation, you lose real value. That's why comparing returns to the inflation rate — the 'real return' — matters more than the headline figure." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing is stored." },
];

const about = (
  <>
    <p>
      An inflation calculator shows how the value of money changes over time. It
      tells you two things: what a given amount will cost in the future, and how
      much buying power today&apos;s money will have retained by then.
    </p>
    <h3>How it works</h3>
    <p>
      <strong>Future cost = amount × (1 + inflation)ⁿ</strong> and{" "}
      <strong>future buying power = amount ÷ (1 + inflation)ⁿ</strong>. At{" "}
      <strong>6%</strong> inflation, something costing <strong>₹1,00,000</strong>{" "}
      today will cost about <strong>₹1,79,085</strong> in 10 years — and that same
      ₹1,00,000 will buy only about <strong>₹55,839</strong> worth of goods.
    </p>
    <p>
      Planning long term? Pair it with the{" "}
      <Link href="/calculators/retirement">retirement calculator</Link> or the{" "}
      <Link href="/calculators/compound-interest">compound interest calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Inflation Calculator"
        description="See how inflation changes the value of money — the future cost of an amount and how much its buying power erodes over time."
        currentHref="/calculators/inflation"
        current="Inflation Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
