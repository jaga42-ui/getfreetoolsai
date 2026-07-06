import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "RD Calculator — Recurring Deposit Maturity & Interest",
  description:
    "Calculate recurring deposit (RD) maturity value and interest earned free online, with quarterly compounding like Indian banks use. No signup.",
  keywords:
    "rd calculator, recurring deposit calculator, rd maturity calculator, rd interest calculator, post office rd calculator",
  path: "/calculators/rd",
});

const jsonLd = softwareAppSchema({
  name: "Free RD Calculator",
  description:
    "Calculate recurring deposit maturity value and interest with quarterly compounding.",
  path: "/calculators/rd",
});

const RdCalculator = dynamic(() => import("@/components/calc/RdCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is RD maturity calculated?", a: "Each monthly deposit earns compound interest for the months it stays invested. Indian banks compound RD interest quarterly, which this calculator models by crediting interest at the end of every quarter." },
  { q: "How is an RD different from an FD?", a: "An RD is a fixed amount deposited every month, ideal for building a habit of saving, while an FD is a one-time lump sum. Use the FD calculator for a lump sum." },
  { q: "Is RD interest taxable?", a: "Yes. RD interest is taxed at your income-tax slab rate, and banks deduct TDS if total interest crosses the annual threshold." },
  { q: "Can I use this for a post office RD?", a: "Yes, enter the post office RD rate. Note post office RDs have their own fixed tenure and compounding rules, so treat the result as an estimate." },
  { q: "Is my data saved?", a: "No. The calculation runs entirely in your browser and nothing is uploaded." },
];

const about = (
  <>
    <p>
      A recurring deposit (RD) lets you save a fixed amount every month for a set
      tenure at a fixed interest rate. This free RD calculator estimates the
      maturity value and total interest, crediting interest quarterly the way most
      Indian banks do.
    </p>
    <h3>How it works</h3>
    <p>
      Every monthly instalment is added to the balance, and interest is compounded
      at the end of each quarter. Because earlier deposits stay invested longer,
      they earn more interest than the later ones.
    </p>
    <h3>Worked example</h3>
    <p>
      Save <strong>₹5,000 a month</strong> for <strong>5 years (60 months)</strong>{" "}
      at <strong>7% p.a.</strong> and you deposit <strong>₹3,00,000</strong> in
      total, maturing to roughly <strong>₹3,58,000</strong> — about{" "}
      <strong>₹58,000</strong> of interest.
    </p>
    <p>
      Prefer a one-time deposit? Try the{" "}
      <Link href="/calculators/fd">FD calculator</Link>. Investing in mutual funds
      monthly instead? See the <Link href="/calculators/sip">SIP calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="RD Calculator"
        description="Estimate the maturity value and interest on a monthly recurring deposit, with quarterly compounding."
        currentHref="/calculators/rd"
        current="RD Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <RdCalculator />
      </CalculatorPage>
    </>
  );
}
