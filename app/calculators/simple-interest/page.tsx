import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Simple Interest Calculator — Free Online",
  description:
    "Calculate simple interest and total amount free online. Enter principal, rate and time in years or months to get instant results. No signup, no limits.",
  keywords:
    "simple interest calculator, si calculator, interest calculator, calculate simple interest, principal interest calculator",
  path: "/calculators/simple-interest",
});

const jsonLd = softwareAppSchema({
  name: "Free Simple Interest Calculator",
  description:
    "Calculate simple interest and the total amount from principal, rate and time.",
  path: "/calculators/simple-interest",
});

const SimpleInterestCalculator = dynamic(
  () => import("@/components/calc/SimpleInterestCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What is the simple interest formula?", a: "Simple interest = (P × R × T) ÷ 100, where P is the principal, R is the annual interest rate in percent, and T is the time in years. The total amount is principal plus interest." },
  { q: "What is the difference between simple and compound interest?", a: "Simple interest is calculated only on the original principal, so it stays the same each year. Compound interest is calculated on the principal plus accumulated interest, so it grows faster over time." },
  { q: "Can I enter the time in months?", a: "Yes. Switch the time unit to months and the calculator converts it to years automatically before applying the formula." },
  { q: "Where is simple interest used?", a: "It is common for short-term loans, car loans, some fixed deposits and informal lending where interest does not compound." },
  { q: "Is my data saved?", a: "No. The calculation runs entirely in your browser and nothing is uploaded or stored." },
];

const about = (
  <>
    <p>
      Simple interest is interest charged only on the original principal, never
      on interest already earned. This free calculator instantly shows the
      interest and the total amount payable or receivable for any principal,
      rate and time period.
    </p>
    <h3>The formula</h3>
    <p>
      <strong>Simple Interest = P × R × T ÷ 100</strong> — where{" "}
      <strong>P</strong> is the principal, <strong>R</strong> the annual rate in
      percent and <strong>T</strong> the time in years. The final amount is P +
      interest.
    </p>
    <h3>Worked example</h3>
    <p>
      A principal of <strong>₹1,00,000</strong> at <strong>8%</strong> for{" "}
      <strong>5 years</strong> earns ₹1,00,000 × 8 × 5 ÷ 100 ={" "}
      <strong>₹40,000</strong> in interest, for a total of{" "}
      <strong>₹1,40,000</strong>.
    </p>
    <p>
      For savings that compound, use the{" "}
      <Link href="/calculators/compound-interest">
        compound interest calculator
      </Link>{" "}
      instead, or the <Link href="/calculators/fd">FD calculator</Link> for bank
      deposits.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Simple Interest Calculator"
        description="Work out simple interest and the total amount from a principal, rate and time in years or months."
        currentHref="/calculators/simple-interest"
        current="Simple Interest Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <SimpleInterestCalculator />
      </CalculatorPage>
    </>
  );
}
