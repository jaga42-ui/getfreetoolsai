import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Discount Calculator Free Online — Sale Price Calculator",
  description:
    "Calculate discounts free online. Find sale price after discount, discount percentage, or original price. 4 calculation modes. Instant results.",
  keywords:
    "discount calculator, sale price calculator, percentage discount calculator, how much is discount, discount price calculator free, calculate discount percentage online",
  path: "/calculators/discount",
});

const jsonLd = softwareAppSchema({
  name: "Free Discount Calculator",
  description:
    "Find sale price, discount percentage, original price, and stacked discounts free online.",
  path: "/calculators/discount",
  ratingCount: 980,
});

const DiscountCalculator = dynamic(
  () => import("@/components/calc/DiscountCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How do I calculate the final price after a discount?",
    a: "Final price = original price × (1 − discount% ÷ 100). For example, ₹2,000 with 20% off becomes ₹1,600, saving you ₹400.",
  },
  {
    q: "How do I find what percentage discount I'm getting?",
    a: "Discount% = ((original − sale) ÷ original) × 100. Enter the original and sale prices in the “Discount %” mode to see it instantly.",
  },
  {
    q: "How do I find the original price before a discount?",
    a: "Original = sale price ÷ (1 − discount% ÷ 100). Use the “Original price” mode when you know the sale price and the discount.",
  },
  {
    q: "Is 20% + 10% the same as 30% off?",
    a: "No. Stacked discounts apply one after another, so 20% then 10% off ₹100 gives ₹72 — an effective 28% discount, not 30%, because the second discount applies to the already-reduced price.",
  },
  {
    q: "Is this discount calculator free?",
    a: "Yes, completely free with no signup. All calculations happen instantly in your browser.",
  },
];

const about = (
  <>
    <p>
      This free discount calculator handles every common sale-price question in
      four modes. Find the final price after a discount and see exactly how much
      you save, work out what percentage off you are actually getting from an
      original and sale price, recover the original price from a discounted one,
      and calculate stacked (double) discounts that apply one after another.
    </p>
    <p>
      It is perfect for shoppers comparing deals, sellers setting sale prices, and
      anyone checking whether an advertised offer is as good as it sounds. The
      stacked-discount mode is especially useful because two successive discounts
      never simply add up — the calculator shows the true effective discount.
      Everything runs locally in your browser with instant results and nothing
      uploaded.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Discount Calculator"
        description="Find the sale price, the discount percentage, the original price, or the true effect of stacked discounts — instantly."
        currentHref="/calculators/discount"
        current="Discount Calculator"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <DiscountCalculator />
      </CalculatorPage>
    </>
  );
}
