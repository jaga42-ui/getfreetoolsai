import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Salary Calculator — CTC to In-Hand Free | GetFreeToolsAI",
  description:
    "Calculate in-hand salary from CTC free. Indian salary calculator with PF, TDS, and professional tax deductions. Compare old vs new tax regime. 2026 tax slabs.",
  keywords:
    "salary calculator, ctc to in hand calculator, take home salary calculator india, salary calculator india 2026, in hand salary calculator, net salary calculator india",
  path: "/calculators/salary",
});

const jsonLd = softwareAppSchema({
  name: "Free Salary Calculator (CTC to In-Hand)",
  description:
    "Calculate in-hand salary from CTC with PF, professional tax and income tax — new vs old regime.",
  path: "/calculators/salary",
  ratingCount: 1290,
});

const SalaryCalculator = dynamic(
  () => import("@/components/calc/SalaryCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What is the difference between CTC and in-hand salary?", a: "CTC (Cost to Company) is the total an employer spends on you, including employer PF and benefits. In-hand salary is what reaches your bank after PF, professional tax, and income tax are deducted." },
  { q: "Which tax regime is better — old or new?", a: "It depends on your deductions. The new regime has lower rates but few exemptions; the old regime lets you claim 80C, HRA, and more. The calculator shows the net for both so you can compare." },
  { q: "How is PF calculated?", a: "Employee provident fund is typically 12% of basic salary, matched by the employer. This calculator deducts the 12% employee contribution from your take-home." },
  { q: "What are the 2026 new-regime tax slabs?", a: "0–3L: 0%, 3–7L: 5%, 7–10L: 10%, 10–12L: 15%, 12–15L: 20%, above 15L: 30%, plus a standard deduction and the 87A rebate up to ₹7L taxable." },
  { q: "Is this an exact figure?", a: "It is a close estimate. Actual pay depends on your company's exact salary structure, HRA exemption, and other allowances — confirm with your employer or a CA." },
];

const about = (
  <>
    <p>
      This free salary calculator converts your annual CTC into an estimated
      monthly in-hand figure using India&apos;s 2026 tax structure. It deducts the
      employer provident fund from CTC to find gross pay, then subtracts the
      employee PF contribution, professional tax, and income tax (including the 4%
      cess and the 87A rebate) to arrive at your take-home salary.
    </p>
    <p>
      You can switch between the new and old tax regimes — and the calculator
      shows the annual in-hand under both so you can pick the better option for
      your situation, including 80C deductions under the old regime. Note that HRA
      exemption and company-specific allowances can shift the result, so treat it
      as a planning estimate and confirm exact figures with your employer or a
      chartered accountant.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Salary Calculator — CTC to In-Hand"
        description="Estimate your monthly take-home salary from CTC with PF, professional tax and income tax — and compare the new vs old tax regime."
        currentHref="/calculators/salary"
        current="Salary Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <SalaryCalculator />
      </CalculatorPage>
    </>
  );
}
