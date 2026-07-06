import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Income Tax Calculator — Old vs New Regime (FY 2025-26)",
  description:
    "Calculate your income tax for FY 2025-26 (AY 2026-27) and compare the old vs new regime instantly. Includes standard deduction, 87A rebate and 4% cess. No signup.",
  keywords:
    "income tax calculator, income tax calculator india, old vs new regime calculator, fy 2025-26 tax calculator, new tax regime calculator, income tax slab calculator",
  path: "/calculators/income-tax",
});

const jsonLd = softwareAppSchema({
  name: "Free Income Tax Calculator",
  description:
    "Compare income tax under the old and new regimes for FY 2025-26 with standard deduction, rebate and cess.",
  path: "/calculators/income-tax",
});

const IncomeTaxCalculator = dynamic(
  () => import("@/components/calc/IncomeTaxCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What are the new regime slabs for FY 2025-26?", a: "Nil up to ₹4 lakh, 5% ₹4–8L, 10% ₹8–12L, 15% ₹12–16L, 20% ₹16–20L, 25% ₹20–24L and 30% above ₹24 lakh, with a ₹75,000 standard deduction and full rebate up to ₹12 lakh taxable income." },
  { q: "Which regime should I choose?", a: "The new regime has lower rates but almost no deductions; the old regime has higher rates but lets you claim 80C, 80D, HRA, home-loan interest and more. Enter your deductions and the calculator shows which comes out lower for you." },
  { q: "What is the section 87A rebate?", a: "It makes tax nil for lower incomes — up to ₹12 lakh taxable income under the new regime (FY 2025-26) and up to ₹5 lakh under the old regime." },
  { q: "Does this include cess and surcharge?", a: "It adds the 4% health and education cess. It does not apply the surcharge on incomes above ₹50 lakh, marginal relief, or senior-citizen slabs, so treat it as an estimate." },
  { q: "Is my income data saved?", a: "No. Everything is calculated in your browser — nothing you enter is uploaded or stored." },
];

const about = (
  <>
    <p>
      This free income tax calculator estimates your tax for{" "}
      <strong>FY 2025-26 (AY 2026-27)</strong> and shows the old and new regimes
      side by side so you can see which one costs you less. It applies the
      standard deduction, the section 87A rebate and the 4% health and education
      cess.
    </p>
    <h3>New regime vs old regime</h3>
    <p>
      The <strong>new regime</strong> has lower slab rates and a ₹75,000 standard
      deduction, but you give up most exemptions. The <strong>old regime</strong>{" "}
      keeps higher rates but lets you reduce taxable income with deductions like
      80C (up to ₹1.5 lakh), 80D, HRA and home-loan interest. Enter your total old-
      regime deductions to compare fairly.
    </p>
    <h3>Worked example</h3>
    <p>
      On a <strong>₹12,00,000</strong> salary with <strong>₹1,50,000</strong> of
      deductions: the new regime works out to <strong>₹0</strong> (taxable income
      up to ₹12 lakh is fully rebated), while the old regime is about{" "}
      <strong>₹1,17,000</strong> — so the new regime wins here.
    </p>
    <p>
      Related tools: the <Link href="/calculators/salary">salary calculator</Link>{" "}
      for in-hand pay, and the tax-free{" "}
      <Link href="/calculators/ppf">PPF</Link> and{" "}
      <Link href="/calculators/fd">FD</Link> calculators for the 80C deductions
      you can claim under the old regime.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Income Tax Calculator"
        description="Compare your income tax under the old and new regimes for FY 2025-26 (AY 2026-27), with standard deduction, 87A rebate and cess."
        currentHref="/calculators/income-tax"
        current="Income Tax Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <IncomeTaxCalculator />
      </CalculatorPage>
    </>
  );
}
