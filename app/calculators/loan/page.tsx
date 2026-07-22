import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Loan Calculator — Monthly Payment & Amortization Schedule",
  description:
    "Work out your monthly loan payment, total interest and a full amortization schedule for personal, home, car or education loans — free and instant, no signup.",
  keywords:
    "loan calculator, loan payment calculator free, personal loan calculator, home loan calculator, car loan calculator, loan amortization calculator, monthly payment calculator",
  path: "/calculators/loan",
});

const jsonLd = softwareAppSchema({
  name: "Free Loan Calculator",
  description:
    "Calculate monthly loan payments, total interest and amortization schedule free online.",
  path: "/calculators/loan",
  ratingCount: 1610,
});

const LoanCalculator = dynamic(() => import("@/components/calc/LoanCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is the monthly loan payment calculated?", a: "It uses the reducing-balance formula M = P[r(1+r)ⁿ]/[(1+r)ⁿ−1], where P is the loan amount, r is the monthly rate, and n is the number of months." },
  { q: "Does an extra monthly payment help?", a: "Yes — adding an extra amount each month goes straight to the principal, shortening the term and cutting total interest. The calculator shows your new payoff date." },
  { q: "What loan types does this work for?", a: "Any amortizing loan — personal, home, car, or education. The maths is identical; the loan type is just a label for your reference." },
  { q: "What is an amortization schedule?", a: "A month-by-month table showing how each payment splits between interest and principal and how the balance falls to zero." },
  { q: "How accurate is the result?", a: "The math is exact for a fixed-rate loan, but lenders may add fees, insurance, or use different rounding, so treat it as a close estimate." },
];

const about = (
  <>
    <p>
      This free loan calculator works out your monthly payment, total repayment,
      and total interest for any fixed-rate loan — personal, home, car, or
      education. Enter the loan amount, annual interest rate, and term, and
      optionally an extra monthly payment to see how much faster you could clear
      the debt and how much interest you would save.
    </p>
    <p>
      A full amortization schedule shows how each instalment is divided between
      interest and principal over the life of the loan, and the payoff date
      updates automatically. Everything runs locally in your browser with nothing
      uploaded. Results are estimates for planning — confirm exact terms, fees,
      and rates with your lender.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Loan Calculator"
        description="Find the monthly payment, total interest, and amortization schedule for any personal, home, car, or education loan."
        currentHref="/calculators/loan"
        current="Loan Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <LoanCalculator />
      </CalculatorPage>
    </>
  );
}
