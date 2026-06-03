import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import Link from "next/link";
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
    <h3>How EMI is calculated</h3>
    <p>
      The EMI uses the reducing-balance formula{" "}
      <strong>EMI = P × r × (1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>, where{" "}
      <strong>P</strong> is the loan principal, <strong>r</strong> is the monthly
      interest rate (annual rate ÷ 12 ÷ 100) and <strong>n</strong> is the number
      of monthly instalments. Interest is charged only on the outstanding balance,
      which is how home, car and personal loans actually work — not on the full
      amount for the whole term.
    </p>
    <h3>Worked example</h3>
    <p>
      Take a <strong>₹5,00,000</strong> loan at <strong>10% per year</strong> for{" "}
      <strong>5 years (60 months)</strong>. The monthly rate is 10 ÷ 12 ÷ 100 =
      0.00833. Plugging into the formula gives an EMI of about{" "}
      <strong>₹10,624</strong>. Over 60 months you repay roughly{" "}
      <strong>₹6,37,411</strong> in total — so the interest cost is about{" "}
      <strong>₹1,37,411</strong> on top of the ₹5,00,000 you borrowed.
    </p>
    <h3>How each instalment is split</h3>
    <p>
      Although the EMI stays fixed, its make-up shifts every month. Early on, most
      of the payment is interest because the outstanding balance is high; as the
      balance falls, more of each EMI goes toward principal. The amortization
      schedule below the calculator shows this split for every month.
    </p>
    <h3>Ways to lower your EMI</h3>
    <ul>
      <li><strong>Longer tenure</strong> — reduces the monthly EMI but increases total interest paid.</li>
      <li><strong>Lower interest rate</strong> — even 0.5% off noticeably cuts a long-tenure EMI.</li>
      <li><strong>Bigger down payment</strong> — a smaller principal means a smaller EMI.</li>
      <li><strong>Prepayment</strong> — paying lump sums when you can reduces both tenure and interest.</li>
    </ul>
    <p>
      Everything is calculated locally in your browser — none of your figures are
      uploaded. The result is an estimate for planning only; your bank may add
      processing fees, insurance or different rounding, so confirm exact figures
      with your lender. Planning an investment instead? Try the{" "}
      <Link href="/calculators/sip">SIP calculator</Link> or the{" "}
      <Link href="/calculators/loan">loan calculator</Link>.
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
