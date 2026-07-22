import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "HRA Calculator — House Rent Allowance Exemption",
  description:
    "Calculate your HRA exemption free online for FY 2025-26. Enter basic salary, HRA received and rent paid to see the tax-exempt and taxable HRA. No signup.",
  keywords:
    "hra calculator, house rent allowance calculator, hra exemption calculator, hra tax exemption, hra calculator india",
  path: "/calculators/hra",
});

const jsonLd = softwareAppSchema({
  name: "Free HRA Calculator",
  description:
    "Calculate the tax-exempt portion of your House Rent Allowance under Section 10(13A).",
  path: "/calculators/hra",
});

const HraCalculator = dynamic(() => import("@/components/calc/HraCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How is HRA exemption calculated?", a: "Your exemption is the least of three amounts: the actual HRA you receive, the rent you pay minus 10% of your basic salary, and 50% of basic salary if you live in a metro city (40% for non-metros)." },
  { q: "Which cities count as metro for HRA?", a: "Only Delhi, Mumbai, Kolkata and Chennai are treated as metro cities for HRA, giving a 50% limit. Every other city, including Bengaluru, Hyderabad and Pune, uses the 40% limit." },
  { q: "Can I claim HRA if I live with my parents?", a: "Yes, if you actually pay rent to them and they declare it as income. Keep rent receipts and, for annual rent above ₹1 lakh, your landlord's PAN." },
  { q: "Does HRA exemption apply in the new tax regime?", a: "No. The HRA exemption under Section 10(13A) is only available in the old tax regime. If you opt for the new regime, HRA is fully taxable." },
  { q: "Does this calculator store my salary details?", a: "No. Every figure is computed in your browser and nothing you enter is uploaded or saved." },
];

const about = (
  <>
    <p>
      House Rent Allowance (HRA) is a salary component that is partly exempt from
      income tax if you live in rented accommodation. This free HRA calculator
      shows exactly how much of your HRA is tax-exempt and how much remains
      taxable, based on the rules in Section 10(13A) of the Income Tax Act.
    </p>
    <h3>How the exemption works</h3>
    <p>
      The exempt amount is the <strong>least</strong> of these three figures:
    </p>
    <ul>
      <li>The actual HRA received from your employer</li>
      <li>Rent paid minus 10% of basic salary (plus DA)</li>
      <li>50% of basic salary in a metro city, or 40% in a non-metro</li>
    </ul>
    <h3>Worked example</h3>
    <p>
      On a basic of <strong>₹40,000</strong>/month with{" "}
      <strong>₹18,000</strong> HRA and <strong>₹20,000</strong> rent in a metro,
      the exemption is the least of ₹18,000, ₹16,000 (rent − 10% of basic) and
      ₹20,000 (50% of basic) — so <strong>₹16,000</strong> is exempt and ₹2,000
      is taxable each month.
    </p>
    <p>
      Want the full picture? Estimate your liability with the{" "}
      <Link href="/calculators/income-tax">income tax calculator</Link> or work
      out take-home pay with the{" "}
      <Link href="/calculators/salary">salary calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="HRA Calculator"
        description="Find the tax-exempt portion of your House Rent Allowance from your basic salary, HRA and rent paid."
        currentHref="/calculators/hra"
        current="HRA Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <HraCalculator />
      </CalculatorPage>
    </>
  );
}
