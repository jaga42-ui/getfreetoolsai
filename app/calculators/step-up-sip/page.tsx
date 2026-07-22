import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Step Up SIP Calculator — Top-Up SIP Returns",
  description:
    "Calculate returns on a step-up (top-up) SIP that increases every year. Free step-up SIP calculator with maturity value, total invested and returns. No signup.",
  keywords:
    "step up sip calculator, top up sip calculator, step-up sip, sip step up calculator, increasing sip calculator, sip top up returns",
  path: "/calculators/step-up-sip",
});

const jsonLd = softwareAppSchema({
  name: "Free Step Up SIP Calculator",
  description: "Calculate returns on a SIP that steps up by a fixed percentage each year.",
  path: "/calculators/step-up-sip",
});

const StepUpSipCalculator = dynamic(() => import("@/components/calc/StepUpSipCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is a step-up SIP?", a: "A step-up (or top-up) SIP increases your monthly investment by a fixed percentage every year — for example 10% annually. It lets your investment grow with your income and builds a much larger corpus than a flat SIP." },
  { q: "How does the step-up SIP calculator work?", a: "It invests your monthly amount for a year, raises it by your step-up percentage at the start of each new year, and compounds the whole balance at your expected return — then totals the maturity value, invested amount and returns." },
  { q: "How much difference does a step-up make?", a: "A lot over long periods. Because each year's contributions are larger and compound for years, even a 10% annual step-up can add substantially to the final corpus versus a flat SIP." },
  { q: "Are the returns guaranteed?", a: "No. SIP returns are market-linked and not guaranteed. The figures are estimates for planning only." },
  { q: "Is my data private?", a: "Yes. Everything is calculated in your browser and nothing is uploaded." },
];

const about = (
  <>
    <p>
      A step-up SIP calculator projects the maturity value of a SIP that grows
      each year. Instead of investing the same amount forever, you raise your
      monthly contribution by a set percentage annually — matching your rising
      income and building a noticeably larger corpus.
    </p>
    <h3>How it works</h3>
    <p>
      Each month your SIP is invested and the balance compounds at your expected
      return; at the start of every year the monthly amount increases by your
      step-up percentage. The calculator sums it all into the final maturity
      value, total invested and returns.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>₹10,000</strong> monthly SIP with a <strong>10%</strong> annual
      step-up, at <strong>12%</strong> for <strong>15 years</strong>, grows to
      roughly <strong>₹86 lakh</strong> — well above a flat SIP of the same
      starting amount.
    </p>
    <p>
      Prefer a flat SIP? Use the{" "}
      <Link href="/calculators/sip">SIP calculator</Link>, or invest a one-time
      amount with the <Link href="/calculators/lumpsum">lumpsum calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Step Up SIP Calculator"
        description="Estimate the maturity value of a step-up (top-up) SIP that increases by a fixed percentage every year."
        currentHref="/calculators/step-up-sip"
        current="Step Up SIP Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <StepUpSipCalculator />
      </CalculatorPage>
    </>
  );
}
