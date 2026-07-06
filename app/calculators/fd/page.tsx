import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "FD Calculator — Fixed Deposit Maturity & Interest",
  description:
    "Calculate fixed deposit (FD) maturity value and interest earned free online. Supports monthly, quarterly, half-yearly and yearly compounding. No signup.",
  keywords:
    "fd calculator, fixed deposit calculator, fd maturity calculator, fd interest calculator, bank fd calculator india",
  path: "/calculators/fd",
});

const jsonLd = softwareAppSchema({
  name: "Free FD Calculator",
  description:
    "Calculate fixed deposit maturity value and interest with flexible compounding.",
  path: "/calculators/fd",
});

const FdCalculator = dynamic(() => import("@/components/calc/FdCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is FD maturity calculated?", a: "With compound interest: Maturity = P × (1 + r/n)^(n×t), where P is the deposit, r the annual rate, n the number of compounding periods a year, and t the tenure in years." },
  { q: "How often is FD interest compounded?", a: "Most Indian banks compound FD interest quarterly, but some offer monthly, half-yearly or yearly. Pick the frequency your bank uses for an accurate figure." },
  { q: "Is FD interest taxable?", a: "Yes. FD interest is added to your income and taxed at your slab rate. Banks deduct TDS if interest crosses ₹40,000 a year (₹50,000 for senior citizens)." },
  { q: "What is the difference between an FD and an RD?", a: "An FD is a single lump-sum deposit, while a recurring deposit (RD) is a fixed amount saved every month. Use the RD calculator for monthly deposits." },
  { q: "Does this calculator store my data?", a: "No. Everything is computed in your browser — nothing you enter is uploaded or saved." },
];

const about = (
  <>
    <p>
      A fixed deposit (FD) locks a lump sum with a bank or NBFC for a set tenure
      at a fixed interest rate. This free FD calculator shows the maturity value
      and the total interest you will earn, with a choice of compounding
      frequency so it matches how your bank actually credits interest.
    </p>
    <h3>How it works</h3>
    <p>
      The maturity uses compound interest:{" "}
      <strong>M = P × (1 + r/n)^(n×t)</strong> — deposit <strong>P</strong>, annual
      rate <strong>r</strong>, <strong>n</strong> compounding periods per year and
      tenure <strong>t</strong> in years. Quarterly compounding (n = 4) is the most
      common in India.
    </p>
    <h3>Worked example</h3>
    <p>
      Deposit <strong>₹1,00,000</strong> for <strong>5 years</strong> at{" "}
      <strong>7% p.a.</strong> compounded quarterly and it grows to about{" "}
      <strong>₹1,41,478</strong> — roughly <strong>₹41,478</strong> of interest.
    </p>
    <p>
      Saving a fixed amount every month instead? Use the{" "}
      <Link href="/calculators/rd">RD calculator</Link>, or compare long-term
      growth with the{" "}
      <Link href="/calculators/compound-interest">compound interest calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="FD Calculator"
        description="Work out the maturity value and interest on a fixed deposit, with monthly, quarterly, half-yearly or yearly compounding."
        currentHref="/calculators/fd"
        current="FD Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <FdCalculator />
      </CalculatorPage>
    </>
  );
}
