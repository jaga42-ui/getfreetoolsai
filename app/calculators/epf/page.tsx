import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "EPF Calculator — Provident Fund Maturity at Retirement",
  description:
    "Calculate your EPF (Employees' Provident Fund) corpus at retirement from your basic salary, contributions and interest rate. Free EPF calculator, no signup.",
  keywords:
    "epf calculator, employee provident fund calculator, pf calculator, epf maturity calculator, provident fund calculator india, epf corpus calculator",
  path: "/calculators/epf",
});

const jsonLd = softwareAppSchema({
  name: "Free EPF Calculator",
  description: "Estimate your EPF corpus at retirement from basic salary, contributions and interest.",
  path: "/calculators/epf",
});

const EpfCalculator = dynamic(() => import("@/components/calc/EpfCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is the EPF corpus calculated?", a: "Every month you contribute 12% of your basic + DA and your employer adds a matching amount. Of the employer's 12%, 3.67% goes to EPF and 8.33% to EPS (pension). The EPF balance earns interest (compounded) and grows until retirement. This calculator projects that EPF corpus." },
  { q: "How much do the employee and employer contribute?", a: "You contribute 12% of basic + DA. Your employer also contributes 12%, but only 3.67% of it goes into your EPF; the other 8.33% funds the EPS pension and isn't part of the EPF balance shown here." },
  { q: "What interest rate does EPF pay?", a: "The EPF interest rate is announced each year by the government (recently around 8.25%). It's calculated on the running monthly balance and credited annually. Enter the current rate for an accurate estimate." },
  { q: "Does this include the EPS pension?", a: "No. This shows the EPF corpus only. The employer's 8.33% EPS contribution provides a separate monthly pension and is not added to this figure." },
  { q: "Is my data private?", a: "Yes. Everything is calculated in your browser and nothing you enter is uploaded." },
];

const about = (
  <>
    <p>
      An EPF calculator estimates the Employees&apos; Provident Fund corpus you
      could build by retirement. It combines your monthly contribution, your
      employer&apos;s EPF share, annual salary growth and the EPF interest rate to
      project the final balance.
    </p>
    <h3>How it works</h3>
    <p>
      You contribute <strong>12%</strong> of basic + DA each month and your
      employer adds <strong>3.67%</strong> to EPF (the other 8.33% goes to the EPS
      pension). The balance compounds at the EPF interest rate, and your salary
      grows by the hike you enter each year.
    </p>
    <h3>Worked example</h3>
    <p>
      Starting at age <strong>30</strong> with <strong>₹2,00,000</strong> saved, a{" "}
      <strong>₹30,000</strong> monthly basic, a <strong>5%</strong> annual hike and{" "}
      <strong>8.25%</strong> interest, the EPF corpus grows to roughly{" "}
      <strong>₹1.2 crore</strong> by age 58.
    </p>
    <p>
      Planning other retirement savings? See the{" "}
      <Link href="/calculators/ppf">PPF</Link> and{" "}
      <Link href="/calculators/nps">NPS</Link> calculators.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="EPF Calculator"
        description="Estimate your Employees' Provident Fund (EPF) corpus at retirement from your basic salary, contributions, salary growth and interest rate."
        currentHref="/calculators/epf"
        current="EPF Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <EpfCalculator />
      </CalculatorPage>
    </>
  );
}
