import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Sukanya Samriddhi Yojana (SSY) Calculator — Maturity Value",
  description:
    "Calculate the maturity value of a Sukanya Samriddhi Yojana (SSY) account. Free SSY calculator with 15 years of deposits, 21-year maturity and total interest. No signup.",
  keywords:
    "sukanya samriddhi yojana calculator, ssy calculator, sukanya samriddhi calculator, ssy maturity calculator, sukanya yojana interest calculator, ssy scheme calculator",
  path: "/calculators/ssy",
});

const jsonLd = softwareAppSchema({
  name: "Free Sukanya Samriddhi Yojana Calculator",
  description: "Calculate the maturity value and interest of a Sukanya Samriddhi Yojana account.",
  path: "/calculators/ssy",
});

const SsyCalculator = dynamic(() => import("@/components/calc/SsyCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "What is Sukanya Samriddhi Yojana?", a: "Sukanya Samriddhi Yojana (SSY) is a government-backed savings scheme for a girl child. A parent or guardian opens the account, deposits for 15 years, and the account matures 21 years after opening — with interest that's compounded annually and currently tax-free." },
  { q: "How is the SSY maturity value calculated?", a: "Deposits are made for the first 15 years and the balance earns compound interest every year. From year 16 to 21 no deposits are needed but the balance keeps earning interest, and the account matures at the end of year 21." },
  { q: "What is the minimum and maximum deposit?", a: "The scheme allows a minimum of ₹250 and a maximum of ₹1,50,000 per financial year. Enter your planned yearly deposit to see the projected maturity." },
  { q: "Is the interest rate fixed?", a: "No. The government revises the SSY interest rate each quarter. This calculator uses the rate you enter, so update it to match the latest notified rate for an accurate figure." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing you enter is uploaded." },
];

const about = (
  <>
    <p>
      A Sukanya Samriddhi Yojana calculator projects how much a girl child&apos;s
      SSY account will be worth at maturity. You deposit each year for 15 years,
      the balance compounds annually, and the account matures 21 years after it
      was opened.
    </p>
    <h3>How it works</h3>
    <p>
      For years 1–15 your yearly deposit is added and the balance earns interest;
      for years 16–21 no deposit is needed but interest keeps compounding. The
      calculator totals the maturity value, your deposits and the interest earned.
    </p>
    <h3>Worked example</h3>
    <p>
      Depositing <strong>₹50,000</strong> a year at <strong>8.2%</strong> grows to
      roughly <strong>₹23.9 lakh</strong> at maturity — with about{" "}
      <strong>₹7.5 lakh</strong> deposited and the rest earned as interest.
    </p>
    <p>
      Comparing other small-savings schemes? See the{" "}
      <Link href="/calculators/ppf">PPF calculator</Link> or the{" "}
      <Link href="/calculators/fd">FD calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Sukanya Samriddhi Yojana Calculator"
        description="Estimate the maturity value of a Sukanya Samriddhi Yojana (SSY) account — 15 years of deposits, 21-year maturity, and the total interest earned."
        currentHref="/calculators/ssy"
        current="SSY Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
        sources={[
          { label: "National Savings Institute", href: "https://www.nsiindia.gov.in/" },
        ]}
      >
        <SsyCalculator />
      </CalculatorPage>
    </>
  );
}
