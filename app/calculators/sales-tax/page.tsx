import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Sales Tax Calculator — Add or Remove US Sales Tax",
  description:
    "Free sales tax calculator. Add sales tax to a price, or back it out of a tax-inclusive total. Enter any state or local rate and see tax and pre-tax price instantly.",
  keywords:
    "sales tax calculator, add sales tax, reverse sales tax calculator, remove sales tax, sales tax calculator by rate, us sales tax calculator, tax calculator",
  path: "/calculators/sales-tax",
});

const jsonLd = softwareAppSchema({
  name: "Free Sales Tax Calculator",
  description: "Add sales tax to a price or back it out of a tax-inclusive total.",
  path: "/calculators/sales-tax",
});

const SalesTaxCalculator = dynamic(
  () => import("@/components/calc/SalesTaxCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How do I add sales tax to a price?", a: "Multiply the pre-tax price by the tax rate to get the tax, then add it to the price. For example, $100 at 7.25% is $100 × 0.0725 = $7.25 tax, for a $107.25 total. In 'Add tax' mode the calculator does this instantly." },
  { q: "How do I remove sales tax from a total (reverse sales tax)?", a: "Divide the tax-inclusive total by 1 + the rate. At 7.25%, divide by 1.0725. You can't just subtract 7.25% of the total — that overcounts, because the tax was calculated on the smaller pre-tax price. Use 'Remove tax' mode to do it correctly." },
  { q: "What sales tax rate should I use?", a: "US sales tax is set by state, county and city, so the combined rate varies by location — from 0% in a few states to over 10% in some cities. Enter the combined rate for where the sale happens." },
  { q: "Does the US have a national sales tax?", a: "No. Unlike VAT or GST in many countries, the US has no federal sales tax. Rates are set locally, which is why the same item can cost different totals in different places." },
  { q: "Is my data private?", a: "Yes. The calculator runs in your browser and stores nothing you enter." },
];

const about = (
  <>
    <p>
      This free sales tax calculator does the math both directions: add sales tax
      to a listed price, or back the tax out of a total that already includes it.
      Enter any combined state and local rate and it shows the tax amount and the
      pre-tax price instantly.
    </p>
    <h3>How it works</h3>
    <p>
      <strong>Adding tax:</strong> tax = price × (rate ÷ 100), and total = price +
      tax. <strong>Removing tax (reverse):</strong> pre-tax price = total ÷ (1 +
      rate ÷ 100), and the tax is the difference. Dividing — not subtracting the
      percentage — is what makes the reverse calculation correct.
    </p>
    <h3>Worked example</h3>
    <p>
      A <strong>$100</strong> item at <strong>7.25%</strong> tax comes to{" "}
      <strong>$107.25</strong> (<strong>$7.25</strong> tax). Working backwards
      from a <strong>$107.25</strong> total at the same rate returns exactly{" "}
      <strong>$100</strong> pre-tax — note that 7.25% of $107.25 would be $7.78,
      the wrong answer, which is why you divide.
    </p>
    <p>
      Working out a discount too? Use the{" "}
      <Link href="/calculators/discount">discount calculator</Link>, or the{" "}
      <Link href="/calculators/percentage">percentage calculator</Link> for any
      percent math.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Sales Tax Calculator"
        description="Add US sales tax to a price, or back it out of a tax-inclusive total, at any state or local rate — with the tax amount and pre-tax price shown instantly."
        currentHref="/calculators/sales-tax"
        current="Sales Tax Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <SalesTaxCalculator />
      </CalculatorPage>
    </>
  );
}
