import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "PPF Calculator — Maturity Value Over 15 Years",
  description:
    "Calculate your Public Provident Fund (PPF) maturity value and interest free online, with the current 7.1% rate and yearly compounding. No signup.",
  keywords:
    "ppf calculator, public provident fund calculator, ppf maturity calculator, ppf interest calculator, ppf 15 year calculator",
  path: "/calculators/ppf",
});

const jsonLd = softwareAppSchema({
  name: "Free PPF Calculator",
  description:
    "Calculate PPF maturity value and interest over the 15-year lock-in with yearly compounding.",
  path: "/calculators/ppf",
});

const PpfCalculator = dynamic(() => import("@/components/calc/PpfCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is the current PPF interest rate?", a: "The PPF rate is set by the government each quarter and is 7.1% per annum at the time of writing. It is compounded annually. Update the field if the rate changes." },
  { q: "How much can I invest in PPF each year?", a: "Between ₹500 and ₹1,50,000 per financial year. Contributions above ₹1.5 lakh earn no interest and get no tax benefit." },
  { q: "What is the PPF lock-in period?", a: "PPF has a 15-year maturity, extendable in blocks of 5 years. Partial withdrawals are allowed from the 7th year." },
  { q: "Is PPF tax-free?", a: "Yes — PPF is EEE (exempt-exempt-exempt): the investment qualifies under section 80C, and both the interest and the maturity amount are tax-free." },
  { q: "Is my data saved?", a: "No. The calculation runs in your browser and nothing is uploaded." },
];

const about = (
  <>
    <p>
      The Public Provident Fund (PPF) is a government-backed, tax-free savings
      scheme with a 15-year lock-in. This free PPF calculator projects your
      maturity value and total interest based on a fixed yearly contribution and
      the current interest rate.
    </p>
    <h3>How it works</h3>
    <p>
      Each year&apos;s deposit is added to the balance and interest is compounded
      annually. Because PPF is EEE, the entire maturity amount — principal plus
      interest — is tax-free in your hands.
    </p>
    <h3>Worked example</h3>
    <p>
      Invest the maximum <strong>₹1,50,000 a year</strong> for{" "}
      <strong>15 years</strong> at <strong>7.1%</strong> and you contribute{" "}
      <strong>₹22,50,000</strong>, maturing to about <strong>₹40,68,000</strong> —
      roughly <strong>₹18,18,000</strong> of tax-free interest.
    </p>
    <p>
      Comparing tax-saving options? The{" "}
      <Link href="/calculators/sip">SIP calculator</Link> models mutual-fund
      growth, and the <Link href="/calculators/fd">FD calculator</Link> covers
      fixed deposits.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="PPF Calculator"
        description="Project the maturity value and tax-free interest of your PPF account over its 15-year term."
        currentHref="/calculators/ppf"
        current="PPF Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
        sources={[
          { label: "National Savings Institute", href: "https://www.nsiindia.gov.in/" },
        ]}
      >
        <PpfCalculator />
      </CalculatorPage>
    </>
  );
}
