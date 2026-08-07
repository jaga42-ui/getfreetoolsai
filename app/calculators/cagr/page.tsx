import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "CAGR Calculator — Compound Annual Growth Rate",
  description:
    "Calculate CAGR (compound annual growth rate) from an initial and final value over a period. Free online CAGR calculator with absolute return and total gain.",
  keywords:
    "cagr calculator, compound annual growth rate calculator, cagr formula, calculate cagr, annualized return calculator, cagr calculator india",
  path: "/calculators/cagr",
});

const jsonLd = softwareAppSchema({
  name: "Free CAGR Calculator",
  description: "Calculate the compound annual growth rate between two values over time.",
  path: "/calculators/cagr",
});

const CagrCalculator = dynamic(() => import("@/components/calc/CagrCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is CAGR?", a: "CAGR (Compound Annual Growth Rate) is the smoothed annual rate at which an investment grows from its starting value to its ending value, as if it grew at a steady rate each year." },
  { q: "How is CAGR calculated?", a: "CAGR = (Final value ÷ Initial value)^(1 ÷ years) − 1, expressed as a percentage. For example, growing ₹1,00,000 to ₹2,50,000 in 5 years is a CAGR of about 20.1%." },
  { q: "How is CAGR different from absolute return?", a: "Absolute return is the total percentage gain over the whole period, ignoring time. CAGR annualises that gain, so you can compare investments held for different durations fairly." },
  { q: "Can CAGR be negative?", a: "Yes. If the final value is lower than the initial value, CAGR is negative, showing an average annual decline." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing you enter is stored." },
];

const about = (
  <>
    <p>
      A CAGR calculator tells you the compound annual growth rate of an
      investment — the steady yearly rate that would take it from its starting
      value to its ending value over a given period. It&apos;s the fairest way to
      compare returns across investments held for different lengths of time.
    </p>
    <h3>How it works</h3>
    <p>
      <strong>CAGR = (Final ÷ Initial)^(1 ÷ years) − 1</strong>, shown as a
      percentage. The calculator also shows the absolute (total) return and the
      rupee gain.
    </p>
    <h3>Worked example</h3>
    <p>
      An investment growing from <strong>₹1,00,000</strong> to{" "}
      <strong>₹2,50,000</strong> over <strong>5 years</strong> has a CAGR of about{" "}
      <strong>20.11%</strong>, even though the absolute return is 150%.
    </p>
    <p>
      Projecting future growth instead? Try the{" "}
      <Link href="/calculators/lumpsum">lumpsum calculator</Link> or{" "}
      <Link href="/calculators/compound-interest">compound interest calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="CAGR Calculator"
        description="Work out the compound annual growth rate (CAGR) between a starting and ending value, plus the absolute return and total gain."
        currentHref="/calculators/cagr"
        current="CAGR Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <CagrCalculator />
      </CalculatorPage>
    </>
  );
}
