import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import Link from "next/link";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "SIP Calculator Free — Mutual Fund SIP Returns Calculator",
  description:
    "Calculate SIP returns free online. Find mutual fund investment maturity value, total returns, and wealth gained. Compare lump sum vs SIP. No signup.",
  keywords:
    "sip calculator, sip calculator free, mutual fund calculator, sip return calculator, monthly sip calculator, sip maturity calculator, investment calculator india",
  path: "/calculators/sip",
});

const jsonLd = softwareAppSchema({
  name: "Free SIP Calculator",
  description:
    "Calculate mutual fund SIP and lump sum returns and maturity value free online.",
  path: "/calculators/sip",
  ratingCount: 1730,
});

const SipCalculator = dynamic(() => import("@/components/calc/SipCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How are SIP returns calculated?", a: "Using the future-value-of-annuity formula FV = P × ((1+r)ⁿ − 1) / r × (1+r), where P is the monthly amount, r is the monthly return, and n is the number of months." },
  { q: "What return rate should I assume?", a: "Equity mutual funds have historically returned roughly 10–14% annually over the long term, but returns are not guaranteed. 12% is a common planning assumption." },
  { q: "What is the difference between SIP and lump sum?", a: "A SIP invests a fixed amount every month, averaging your purchase price over time, while a lump sum invests once upfront. Toggle between the two to compare." },
  { q: "What does inflation-adjusted value mean?", a: "It shows what your maturity amount is worth in today's money after accounting for inflation, giving a more realistic sense of future purchasing power." },
  { q: "Are these returns guaranteed?", a: "No. Mutual fund returns depend on market performance and are not guaranteed. This is an estimate for planning only." },
];

const about = (
  <>
    <p>
      A Systematic Investment Plan (SIP) lets you invest a fixed amount in a
      mutual fund every month. This free SIP calculator estimates the maturity
      value of your investment, the total amount you will have invested, and the
      wealth gained, using the standard future-value formula. Switch to lump-sum
      mode to model a one-time investment instead.
    </p>
    <h3>How SIP returns are calculated</h3>
    <p>
      A SIP is a series of monthly investments, each compounding until maturity, so
      it uses the future-value-of-annuity formula{" "}
      <strong>FV = P × ((1 + r)ⁿ − 1) ÷ r × (1 + r)</strong>, where{" "}
      <strong>P</strong> is the monthly contribution, <strong>r</strong> is the
      monthly return (annual ÷ 12 ÷ 100) and <strong>n</strong> is the number of
      monthly instalments.
    </p>
    <h3>Worked example</h3>
    <p>
      Invest <strong>₹10,000 a month</strong> for <strong>10 years</strong> at an
      assumed <strong>12% annual return</strong>. You contribute{" "}
      <strong>₹12,00,000</strong> over those 120 months, but thanks to compounding
      the projected maturity value is about <strong>₹23,23,391</strong> — roughly{" "}
      <strong>₹11,23,391</strong> of wealth gained on top of what you put in.
    </p>
    <h3>Why starting early matters</h3>
    <p>
      Compounding rewards time more than amount. The same ₹10,000 SIP run for 20
      years instead of 10 doesn&apos;t just double — it grows several times larger,
      because each year&apos;s returns themselves earn returns. Starting a few years
      earlier often beats investing a larger amount later.
    </p>
    <h3>Tips to get more from a SIP</h3>
    <ul>
      <li><strong>Step up annually</strong> — raising your SIP as your income grows dramatically increases the final corpus.</li>
      <li><strong>Stay invested through dips</strong> — SIPs average your cost, so falling markets buy more units.</li>
      <li><strong>Use a realistic rate</strong> — equity funds have historically returned ~10–14% long term, but nothing is guaranteed.</li>
    </ul>
    <p>
      Add an optional inflation rate to see the real, inflation-adjusted value. All
      calculations run privately in your browser, and returns are estimates based on
      the rate you choose — consult a financial advisor before investing. Repaying a
      loan too? See the <Link href="/calculators/emi">EMI calculator</Link> or the{" "}
      <Link href="/calculators/compound-interest">compound interest calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="SIP Calculator"
        description="Estimate the maturity value and returns of a monthly mutual fund SIP or a lump-sum investment, with inflation adjustment."
        currentHref="/calculators/sip"
        current="SIP Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <SipCalculator />
      </CalculatorPage>
    </>
  );
}
