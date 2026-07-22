import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Lumpsum Calculator — Mutual Fund One-Time Investment Returns",
  description:
    "Calculate the maturity value and returns on a one-time (lumpsum) mutual fund investment. Free online lumpsum calculator with expected return and tenure. No signup.",
  keywords:
    "lumpsum calculator, mutual fund lumpsum calculator, one time investment calculator, lumpsum return calculator, lumpsum maturity calculator, investment calculator india",
  path: "/calculators/lumpsum",
});

const jsonLd = softwareAppSchema({
  name: "Free Lumpsum Calculator",
  description: "Calculate maturity value and returns on a one-time lumpsum investment.",
  path: "/calculators/lumpsum",
});

const LumpsumCalculator = dynamic(() => import("@/components/calc/LumpsumCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is lumpsum investment return calculated?", a: "With compound interest: Maturity = P × (1 + r)^n, where P is the one-time investment, r the expected annual return and n the number of years. The calculator applies this instantly." },
  { q: "What is the difference between lumpsum and SIP?", a: "A lumpsum is a single one-time investment, while a SIP invests a fixed amount every month. Lumpsum suits money you already have; SIP suits investing gradually from income." },
  { q: "What return should I assume?", a: "Equity mutual funds have historically returned around 10–12% a year over the long run, but returns vary and aren't guaranteed. Try a few rates to see a realistic range." },
  { q: "Are the returns guaranteed?", a: "No. Market-linked investments carry risk and past performance doesn't guarantee future returns. This is an estimate for planning only." },
  { q: "Is my data private?", a: "Yes. Everything is calculated in your browser and nothing you enter is uploaded." },
];

const about = (
  <>
    <p>
      A lumpsum calculator shows how a single one-time investment could grow over
      time. Enter the amount, an expected annual return and the number of years,
      and it projects the maturity value and the returns earned using compound
      growth.
    </p>
    <h3>How it works</h3>
    <p>
      It uses <strong>Maturity = P × (1 + r)ⁿ</strong> — investment{" "}
      <strong>P</strong>, annual return <strong>r</strong> and{" "}
      <strong>n</strong> years — the standard compound-growth formula for a
      one-time investment.
    </p>
    <h3>Worked example</h3>
    <p>
      <strong>₹1,00,000</strong> invested for <strong>10 years</strong> at{" "}
      <strong>12%</strong> grows to about <strong>₹3,10,585</strong> — roughly{" "}
      <strong>₹2,10,585</strong> of returns.
    </p>
    <p>
      Investing monthly instead? Use the{" "}
      <Link href="/calculators/sip">SIP calculator</Link>, or plan withdrawals with
      the <Link href="/calculators/swp">SWP calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Lumpsum Calculator"
        description="Estimate the maturity value and returns on a one-time mutual fund or lumpsum investment, using your expected return and time period."
        currentHref="/calculators/lumpsum"
        current="Lumpsum Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <LumpsumCalculator />
      </CalculatorPage>
    </>
  );
}
