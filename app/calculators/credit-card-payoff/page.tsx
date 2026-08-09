import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Credit Card Payoff Calculator — Time & Interest to Pay Off",
  description:
    "Free credit card payoff calculator. See how long a balance takes to clear at a fixed payment, or the payment to be debt-free by a date.",
  keywords:
    "credit card payoff calculator, credit card interest calculator, debt payoff calculator, how long to pay off credit card, credit card payment calculator",
  path: "/calculators/credit-card-payoff",
});

const jsonLd = softwareAppSchema({
  name: "Free Credit Card Payoff Calculator",
  description:
    "Find how long it takes to pay off a credit card, or the payment needed to be debt-free by a target date.",
  path: "/calculators/credit-card-payoff",
});

const CreditCardPayoffCalculator = dynamic(
  () => import("@/components/calc/CreditCardPayoffCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How long will it take to pay off my credit card?", a: "It depends on your balance, APR and monthly payment. In 'Monthly payment' mode, enter what you pay each month and the calculator shows the number of months to reach a zero balance and the total interest you'll pay." },
  { q: "Why does my balance barely go down?", a: "Because interest is charged on the balance every month. If your payment is only a little above the monthly interest, most of it goes to interest and the balance drops slowly. Paying more than the minimum makes a big difference." },
  { q: "What payment do I need to be debt-free by a date?", a: "Switch to 'Target timeframe' mode, enter how many months you want, and the calculator shows the fixed monthly payment required to clear the balance in that time, along with the total interest." },
  { q: "What happens if my payment is too low?", a: "If your monthly payment is at or below the monthly interest, the balance never gets paid off. The calculator flags this and shows the minimum payment you'd need to exceed to make progress." },
  { q: "Is my data private?", a: "Yes. The calculation runs entirely in your browser and nothing you enter is uploaded or stored." },
];

const about = (
  <>
    <p>
      This free credit card payoff calculator works two ways: tell it what you
      can pay each month and it shows how long until you&apos;re debt-free, or
      tell it a deadline and it shows the payment you need. Either way you see the
      total interest — the real cost of carrying a balance.
    </p>
    <h3>How it works</h3>
    <p>
      Interest is added to the balance each month at your APR ÷ 12, then your
      payment is subtracted. In <strong>Monthly payment</strong> mode the tool
      steps through month by month until the balance hits zero. In{" "}
      <strong>Target timeframe</strong> mode it solves the amortized-loan formula
      for the payment that clears the balance in your chosen number of months.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>$6,000</strong> balance at <strong>22%</strong> APR paid at{" "}
      <strong>$250</strong> a month takes about <strong>32 months</strong> to
      clear and costs roughly <strong>$1,980</strong> in interest. Bump the
      payment to <strong>$400</strong> and it&apos;s gone in about{" "}
      <strong>18 months</strong> with about half the interest.
    </p>
    <p>
      Planning a lump-sum loan instead? See the{" "}
      <Link href="/calculators/loan">loan calculator</Link>, or check how savings
      grow with{" "}
      <Link href="/calculators/compound-interest">compound interest</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Credit Card Payoff Calculator"
        description="See how long it takes to pay off a credit card at a fixed payment, or the payment needed to be debt-free by a target date — with total interest either way."
        currentHref="/calculators/credit-card-payoff"
        current="Credit Card Payoff"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <CreditCardPayoffCalculator />
      </CalculatorPage>
    </>
  );
}
