import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "NSC Calculator — Maturity Value & Year-by-Year Interest",
  description:
    "Free National Savings Certificate calculator. See your NSC maturity value, total interest, and a year-by-year table of how the balance compounds across the 5-year tenure. No signup.",
  keywords:
    "nsc calculator, national savings certificate calculator, nsc maturity calculator, nsc interest calculator, nsc return calculator india, post office nsc calculator",
  path: "/calculators/nsc",
});

const jsonLd = softwareAppSchema({
  name: "Free NSC Calculator",
  description: "Calculate National Savings Certificate maturity value and interest over 5 years.",
  path: "/calculators/nsc",
});

const Tool = dynamic(() => import("@/components/calc/NscCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is NSC maturity calculated?", a: "NSC interest is compounded annually and paid at maturity: Maturity = P × (1 + r)^5, where P is the investment, r the annual rate and 5 the fixed tenure in years." },
  { q: "What is the NSC tenure?", a: "NSC (National Savings Certificate) has a fixed lock-in of 5 years. Interest accrues annually and is paid out along with the principal at the end." },
  { q: "Is NSC interest taxable?", a: "The interest is taxable, but because it's reinvested each year (except the final year), that reinvested interest also qualifies for a Section 80C deduction. The final year's interest is fully taxable." },
  { q: "What is the current NSC interest rate?", a: "The government revises the NSC rate each quarter (recently around 7.7%). Enter the current notified rate for an accurate maturity figure." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing you enter is stored." },
];

const about = (
  <>
    <p>
      An NSC calculator shows the maturity value of a National Savings Certificate
      — a government-backed 5-year savings scheme available at post offices. Enter
      your investment and the current interest rate to see what it grows to.
    </p>
    <h3>How it works</h3>
    <p>
      NSC interest is compounded annually and paid at maturity:{" "}
      <strong>Maturity = P × (1 + r)⁵</strong>. Investing{" "}
      <strong>₹1,00,000</strong> at <strong>7.7%</strong> grows to about{" "}
      <strong>₹1,44,903</strong> after 5 years.
    </p>
    <p>
      Comparing schemes? See the{" "}
      <Link href="/calculators/ppf">PPF</Link>,{" "}
      <Link href="/calculators/fd">FD</Link> and{" "}
      <Link href="/calculators/ssy">SSY</Link> calculators.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="NSC Calculator"
        description="Calculate the maturity value and interest on a National Savings Certificate (NSC) — a 5-year scheme with annually compounded interest."
        currentHref="/calculators/nsc"
        current="NSC Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
