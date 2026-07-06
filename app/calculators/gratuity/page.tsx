import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Gratuity Calculator — Payment on Years of Service",
  description:
    "Calculate your gratuity amount free online from your last drawn salary and years of service, using the Payment of Gratuity Act formula. No signup.",
  keywords:
    "gratuity calculator, gratuity calculation formula, gratuity amount calculator, payment of gratuity act calculator, gratuity india",
  path: "/calculators/gratuity",
});

const jsonLd = softwareAppSchema({
  name: "Free Gratuity Calculator",
  description:
    "Calculate gratuity from last drawn salary and years of service using the statutory formula.",
  path: "/calculators/gratuity",
});

const GratuityCalculator = dynamic(
  () => import("@/components/calc/GratuityCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How is gratuity calculated?", a: "For employees covered by the Payment of Gratuity Act: Gratuity = 15 × last drawn salary (basic + DA) × years of service ÷ 26, where 26 is the number of working days in a month." },
  { q: "How many years do I need to qualify?", a: "You generally need at least 5 years of continuous service, except in cases of death or disablement. A part-year of 6 months or more counts as a full year." },
  { q: "What salary is used?", a: "The last drawn monthly salary, counting only basic pay plus dearness allowance (DA) — not HRA, bonuses or other allowances." },
  { q: "Is gratuity tax-free?", a: "Gratuity is tax-exempt up to ₹20 lakh for covered employees. Amounts above the applicable exemption are added to your income and taxed." },
  { q: "Is my data saved?", a: "No. The calculation runs entirely in your browser and nothing is uploaded." },
];

const about = (
  <>
    <p>
      Gratuity is a lump-sum reward employers pay for long service. This free
      gratuity calculator uses the statutory formula under the Payment of Gratuity
      Act to estimate what you are owed from your last drawn salary and length of
      service.
    </p>
    <h3>The formula</h3>
    <p>
      <strong>Gratuity = 15 × last drawn salary × years of service ÷ 26</strong>,
      where the salary is basic pay plus dearness allowance and 26 represents the
      working days in a month. A part-year of six months or more rounds up to a
      full year.
    </p>
    <h3>Worked example</h3>
    <p>
      With a last drawn salary of <strong>₹50,000</strong> and{" "}
      <strong>10 years</strong> of service, gratuity ={" "}
      <strong>15 × 50,000 × 10 ÷ 26 ≈ ₹2,88,462</strong>.
    </p>
    <p>
      Planning your finances after leaving a job? See the{" "}
      <Link href="/calculators/salary">salary calculator</Link> for in-hand pay or
      the <Link href="/calculators/ppf">PPF calculator</Link> for tax-free savings.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Gratuity Calculator"
        description="Estimate your gratuity from your last drawn salary and years of service, using the Payment of Gratuity Act formula."
        currentHref="/calculators/gratuity"
        current="Gratuity Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <GratuityCalculator />
      </CalculatorPage>
    </>
  );
}
