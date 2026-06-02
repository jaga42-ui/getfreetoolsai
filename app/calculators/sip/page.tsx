import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "SIP Calculator Free — Mutual Fund SIP Returns Calculator | GetFreeToolsAI",
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
    <p>
      Enter your monthly amount, expected annual return, and investment period to
      see the projected corpus, and add an optional inflation rate to see the
      real, inflation-adjusted value. All calculations run privately in your
      browser. Returns are estimates based on the rate you choose — actual mutual
      fund returns vary with the market, so consult a financial advisor before
      investing.
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
