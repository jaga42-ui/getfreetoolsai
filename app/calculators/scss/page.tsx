import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "SCSS Calculator — Senior Citizen Savings Scheme Interest",
  description:
    "Calculate Senior Citizen Savings Scheme (SCSS) quarterly interest payout and total interest. Free SCSS calculator for the 5-year scheme.",
  keywords:
    "scss calculator, senior citizen savings scheme calculator, scss interest calculator, scss quarterly interest, senior citizen scheme calculator india, post office scss calculator",
  path: "/calculators/scss",
});

const jsonLd = softwareAppSchema({
  name: "Free SCSS Calculator",
  description: "Calculate Senior Citizen Savings Scheme quarterly interest and total returns.",
  path: "/calculators/scss",
});

const Tool = dynamic(() => import("@/components/calc/ScssCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is SCSS interest calculated?", a: "SCSS pays simple interest that's disbursed every quarter: quarterly payout = deposit × annual rate ÷ 4. The deposit itself is returned at the end of the 5-year term." },
  { q: "How often is SCSS interest paid?", a: "Every quarter. Unlike compounding schemes, the interest is paid out to you four times a year as income rather than being added back to the principal." },
  { q: "What is the maximum SCSS deposit?", a: "The maximum deposit is ₹30 lakh (raised from ₹15 lakh). The scheme is open to those aged 60 and above, with some exceptions for early retirees." },
  { q: "What is the SCSS interest rate?", a: "The government sets the SCSS rate each quarter (recently around 8.2%). Enter the current notified rate for an accurate payout figure." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing is stored." },
];

const about = (
  <>
    <p>
      An SCSS calculator works out the income from the Senior Citizen Savings
      Scheme — a government-backed 5-year deposit for those aged 60 and above that
      pays interest every quarter. Enter your deposit and the current rate to see
      the quarterly payout and total interest.
    </p>
    <h3>How it works</h3>
    <p>
      SCSS pays simple interest quarterly:{" "}
      <strong>Quarterly payout = deposit × rate ÷ 4</strong>. A{" "}
      <strong>₹15,00,000</strong> deposit at <strong>8.2%</strong> pays{" "}
      <strong>₹30,750</strong> every quarter, and about{" "}
      <strong>₹6,15,000</strong> of interest over 5 years.
    </p>
    <p>
      Comparing options? See the{" "}
      <Link href="/calculators/fd">FD</Link> and{" "}
      <Link href="/calculators/ppf">PPF</Link> calculators.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="SCSS Calculator"
        description="Calculate the quarterly interest payout and total interest on a Senior Citizen Savings Scheme (SCSS) deposit over its 5-year term."
        currentHref="/calculators/scss"
        current="SCSS Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
