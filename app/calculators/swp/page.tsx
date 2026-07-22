import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "SWP Calculator — Systematic Withdrawal Plan Returns",
  description:
    "Calculate a Systematic Withdrawal Plan (SWP): how long your corpus lasts, total withdrawn and the final balance, with monthly withdrawals and expected returns. No signup.",
  keywords:
    "swp calculator, systematic withdrawal plan calculator, swp mutual fund calculator, monthly withdrawal calculator, swp return calculator india",
  path: "/calculators/swp",
});

const jsonLd = softwareAppSchema({
  name: "Free SWP Calculator",
  description: "Model a systematic withdrawal plan — monthly withdrawals, corpus longevity and final balance.",
  path: "/calculators/swp",
});

const SwpCalculator = dynamic(() => import("@/components/calc/SwpCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is an SWP?", a: "A Systematic Withdrawal Plan (SWP) lets you withdraw a fixed amount from a mutual fund investment at regular intervals — usually monthly — while the remaining balance stays invested and continues to earn returns. It's popular for generating a retirement-style income." },
  { q: "How does the SWP calculator work?", a: "Each month the calculator grows your remaining corpus by the monthly return, then subtracts your withdrawal. It repeats this for your chosen tenure and shows the final balance, total withdrawn, and warns if the corpus runs out early." },
  { q: "Can my corpus run out?", a: "Yes. If your withdrawals exceed what the corpus earns, the balance falls over time and can hit zero before the tenure ends. The calculator flags exactly when that happens." },
  { q: "Is SWP better than a fixed deposit for income?", a: "It can offer higher returns and more tax efficiency than an FD, but unlike an FD it's market-linked and not guaranteed. Compare both for your situation." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing you enter is uploaded." },
];

const about = (
  <>
    <p>
      An SWP calculator models a Systematic Withdrawal Plan — taking a fixed
      amount out of your investment every month while the rest stays invested and
      keeps earning. It shows how long your corpus will last, how much you&apos;ll
      withdraw in total, and the balance left at the end.
    </p>
    <h3>How it works</h3>
    <p>
      Each month the remaining corpus grows by the monthly return, then your
      withdrawal is subtracted. If withdrawals outpace growth, the balance
      declines — and the calculator warns you if it would run out before your
      chosen tenure.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>₹10,00,000</strong> corpus with a <strong>₹10,000</strong> monthly
      withdrawal at an <strong>8%</strong> return lasts the full{" "}
      <strong>10 years</strong> and still leaves a balance, because the monthly
      returns largely cover the withdrawals.
    </p>
    <p>
      Building the corpus first? Use the{" "}
      <Link href="/calculators/sip">SIP</Link> or{" "}
      <Link href="/calculators/lumpsum">lumpsum</Link> calculator.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="SWP Calculator"
        description="Model a Systematic Withdrawal Plan — see how long your corpus lasts, the total withdrawn and the final balance with regular monthly withdrawals."
        currentHref="/calculators/swp"
        current="SWP Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <SwpCalculator />
      </CalculatorPage>
    </>
  );
}
