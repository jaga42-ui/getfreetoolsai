import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Auto Loan Calculator — Car Payment with Tax & Trade-In",
  description:
    "Free auto loan calculator. Work out your monthly car payment with sales tax, down payment and trade-in, plus total interest and cost — instant, no signup.",
  keywords:
    "auto loan calculator, car loan calculator, car payment calculator, auto loan payment, monthly car payment calculator, car finance calculator with trade in",
  path: "/calculators/auto-loan",
});

const jsonLd = softwareAppSchema({
  name: "Free Auto Loan Calculator",
  description:
    "Calculate a monthly car payment with sales tax, down payment and trade-in.",
  path: "/calculators/auto-loan",
});

const AutoLoanCalculator = dynamic(
  () => import("@/components/calc/AutoLoanCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How is a car payment calculated?", a: "The amount financed is the vehicle price plus sales tax, minus your down payment and trade-in. The monthly payment then uses the amortized-loan formula on that amount at your APR over the loan term in months." },
  { q: "Is sales tax charged on the trade-in?", a: "In most US states, sales tax is charged on the price after subtracting the trade-in value, which lowers the tax you pay. This calculator applies tax to the price minus trade-in. A few states tax the full price — check your state's rule." },
  { q: "Does a longer loan term lower my payment?", a: "Yes, but you pay more total interest. A 72-month loan has a smaller monthly payment than a 48-month loan at the same rate, yet costs more overall because interest accrues for longer." },
  { q: "How much should I put down?", a: "A larger down payment lowers the amount financed, your monthly payment and total interest. Many buyers aim for 10–20% down to avoid being 'upside down' (owing more than the car is worth)." },
  { q: "Is my data private?", a: "Yes. Everything is calculated in your browser and nothing you enter is uploaded or saved." },
];

const about = (
  <>
    <p>
      This free auto loan calculator estimates your monthly car payment and the
      true cost of financing, accounting for sales tax, your down payment and any
      trade-in — the numbers a dealer&apos;s quote often glosses over.
    </p>
    <h3>How it works</h3>
    <p>
      Sales tax is applied to the price minus your trade-in (the rule in most
      states). The amount financed is{" "}
      <strong>price + sales tax − down payment − trade-in</strong>, and the
      monthly payment uses the standard amortized-loan formula at your APR over
      the term in months.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>$35,000</strong> car with <strong>$5,000</strong> down, no
      trade-in, <strong>6%</strong> sales tax and a <strong>60-month</strong>{" "}
      loan at <strong>7%</strong> APR finances about <strong>$32,100</strong> for
      a monthly payment near <strong>$636</strong>, with roughly{" "}
      <strong>$6,000</strong> of total interest.
    </p>
    <p>
      Buying a home instead? Use the{" "}
      <Link href="/calculators/mortgage">mortgage calculator</Link>, or compare
      any loan with the{" "}
      <Link href="/calculators/loan">loan calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Auto Loan Calculator"
        description="Calculate your monthly car payment with sales tax, down payment and trade-in — plus the total interest and total cost of the loan."
        currentHref="/calculators/auto-loan"
        current="Auto Loan Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <AutoLoanCalculator />
      </CalculatorPage>
    </>
  );
}
