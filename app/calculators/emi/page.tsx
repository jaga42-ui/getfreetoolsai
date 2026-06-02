import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "EMI Calculator Free Online — Loan EMI Calculator | GetFreeToolsAI",
  description:
    "Calculate your loan EMI free. Get monthly payment, total interest, and full amortization schedule. Works for home loan, car loan, personal loan. No signup.",
  keywords:
    "emi calculator, loan emi calculator, home loan emi calculator, car loan emi, personal loan emi, emi calculator free, monthly emi calculator, loan calculator india",
  path: "/calculators/emi",
});

const jsonLd = softwareAppSchema({
  name: "Free EMI Calculator",
  description:
    "Calculate loan EMI, total interest and amortization schedule free online. No signup.",
  path: "/calculators/emi",
  ratingCount: 2410,
});

const EmiCalculator = dynamic(
  () => import("@/components/calc/EmiCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "What is EMI and how is it calculated?",
    a: "EMI stands for Equated Monthly Instalment — the fixed amount you repay each month over the loan tenure. It is calculated with the reducing-balance formula EMI = P × r × (1+r)ⁿ / ((1+r)ⁿ − 1), where P is the principal, r is the monthly interest rate (annual rate ÷ 12 ÷ 100) and n is the number of months.",
  },
  {
    q: "How can I reduce my loan EMI?",
    a: "Choose a longer tenure (lowers the EMI but raises total interest), negotiate a lower interest rate, make a larger down payment to reduce the principal, or prepay part of the loan when you can. Even a small rate reduction noticeably lowers the EMI over a long tenure.",
  },
  {
    q: "What happens if I miss an EMI payment?",
    a: "Missing an EMI usually attracts a late-payment penalty and can hurt your credit score. Repeated misses may lead the lender to classify the loan as a non-performing asset. Contact your bank early if you anticipate difficulty paying.",
  },
  {
    q: "Is there a difference between flat rate and reducing balance EMI?",
    a: "Yes. A flat rate charges interest on the full principal for the whole tenure, so the effective rate is higher. This calculator uses the reducing-balance method (interest on the outstanding balance), which is how most home, car and personal loans actually work.",
  },
  {
    q: "How accurate is this EMI calculator?",
    a: "The math uses the standard reducing-balance formula and is accurate to the rupee. However, your bank may add processing fees, insurance, or use a slightly different rounding or day-count convention, so treat the result as a close estimate.",
  },
];

const about = (
  <>
    <p>
      An EMI, or Equated Monthly Instalment, is the fixed payment you make to a
      lender every month until a loan is fully repaid. Each EMI is split between
      interest on the outstanding balance and repayment of the principal — early
      on, most of it goes toward interest, and over time more goes toward the
      principal. This free EMI calculator instantly shows your monthly payment,
      the total interest you will pay, the total amount payable, and a complete
      month-by-month amortization schedule.
    </p>
    <p>
      Use it to plan a home loan, car loan, personal loan, or education loan.
      Home loans typically run 10–30 years at lower rates, car loans 3–7 years,
      and personal loans 1–5 years at higher rates — so the same amount produces
      very different EMIs depending on the rate and tenure. Try a few
      combinations to find a payment that fits your budget. A longer tenure
      lowers the EMI but increases total interest, while prepaying reduces both
      the tenure and the interest you pay.
    </p>
    <p>
      Everything is calculated locally in your browser — none of your figures are
      uploaded or stored. The result is an estimate for planning only; your bank
      may include processing fees, insurance, or different rounding, so confirm
      exact figures with your lender before committing.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="EMI Calculator"
        description="Calculate your loan EMI, total interest, and full repayment schedule for any home, car, or personal loan — instantly and privately."
        currentHref="/calculators/emi"
        current="EMI Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <EmiCalculator />
      </CalculatorPage>
    </>
  );
}
