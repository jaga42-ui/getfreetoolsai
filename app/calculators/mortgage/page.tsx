import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Mortgage Calculator — Monthly Payment with Taxes & PMI",
  description:
    "Free mortgage calculator with property tax, insurance, PMI and HOA. See your full monthly PITI payment, total interest and payoff. No signup.",
  keywords:
    "mortgage calculator, home loan calculator, monthly mortgage payment, mortgage payment calculator, piti calculator, mortgage calculator with pmi, house payment calculator",
  path: "/calculators/mortgage",
});

const jsonLd = softwareAppSchema({
  name: "Free Mortgage Calculator",
  description:
    "Estimate a monthly mortgage payment including principal, interest, taxes, insurance and PMI.",
  path: "/calculators/mortgage",
});

const MortgageCalculator = dynamic(
  () => import("@/components/calc/MortgageCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How is a monthly mortgage payment calculated?", a: "Principal and interest use M = P · r(1+r)^n / ((1+r)^n − 1), where P is the loan amount, r is the monthly interest rate (annual rate ÷ 12) and n is the number of months. This calculator then adds monthly property tax, home insurance, PMI and HOA to give your full PITI payment." },
  { q: "What is PITI?", a: "PITI stands for Principal, Interest, Taxes and Insurance — the four parts of a typical mortgage payment. Lenders look at PITI (plus HOA) when deciding how much you can borrow." },
  { q: "When do I have to pay PMI?", a: "Private mortgage insurance is usually required when your down payment is under 20% of the home price. This calculator adds PMI while your down payment is below 20% and drops it once you reach 20% down." },
  { q: "Does a bigger down payment lower my payment?", a: "Yes. A larger down payment shrinks the loan amount, reduces interest over the life of the loan and — once you reach 20% — removes PMI, all of which lower the monthly payment." },
  { q: "Is my data private?", a: "Completely. The calculator runs entirely in your browser and nothing you enter is uploaded or stored." },
];

const about = (
  <>
    <p>
      This free mortgage calculator estimates your full monthly house payment —
      not just principal and interest, but property tax, home insurance, PMI and
      HOA dues too, so the figure matches what you&apos;ll actually pay each
      month.
    </p>
    <h3>How it works</h3>
    <p>
      Principal and interest use the standard amortized-loan formula:{" "}
      <strong>M = P · r(1+r)ⁿ / ((1+r)ⁿ − 1)</strong> — loan amount{" "}
      <strong>P</strong>, monthly rate <strong>r</strong> (annual APR ÷ 12) and{" "}
      <strong>n</strong> months (years × 12). Monthly property tax, insurance,
      PMI and HOA are added on top to give your <strong>PITI</strong> payment.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>$400,000</strong> home with <strong>$80,000</strong> down (20%)
      on a <strong>30-year</strong> loan at <strong>6.5%</strong> has a principal
      &amp; interest payment of about <strong>$2,023</strong>. Add{" "}
      <strong>$400</strong> tax and <strong>$150</strong> insurance a month and
      the total is roughly <strong>$2,573</strong> — with no PMI, since the down
      payment reaches 20%.
    </p>
    <p>
      Buying a car instead? Try the{" "}
      <Link href="/calculators/auto-loan">auto loan calculator</Link>, or see how
      any loan amortizes with the{" "}
      <Link href="/calculators/loan">loan calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Mortgage Calculator"
        description="Estimate your full monthly mortgage payment — principal, interest, property tax, insurance, PMI and HOA — plus total interest over the life of the loan."
        currentHref="/calculators/mortgage"
        current="Mortgage Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <MortgageCalculator />
      </CalculatorPage>
    </>
  );
}
