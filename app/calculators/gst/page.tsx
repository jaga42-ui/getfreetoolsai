import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "GST Calculator Free Online — Add or Remove GST | GetFreeToolsAI",
  description:
    "Calculate GST free online. Add or remove GST from any amount. Shows CGST, SGST, and IGST breakdown. All GST slabs: 3%, 5%, 12%, 18%, 28%. No signup.",
  keywords:
    "gst calculator, gst calculator free, gst calculation online, add gst calculator, remove gst calculator, cgst sgst calculator, gst calculator india, inclusive gst calculator",
  path: "/calculators/gst",
});

const jsonLd = softwareAppSchema({
  name: "Free GST Calculator",
  description:
    "Add or remove GST and see CGST, SGST and IGST breakdown free online.",
  path: "/calculators/gst",
  ratingCount: 1540,
});

const GstCalculator = dynamic(() => import("@/components/calc/GstCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I add GST to an amount?",
    a: "Enter the original price and choose a GST rate. GST amount = price × rate ÷ 100, and the total = price + GST. For example, ₹1,000 at 18% adds ₹180 for a total of ₹1,180.",
  },
  {
    q: "How do I remove GST from a total (reverse GST)?",
    a: "Switch to “Remove GST” and enter the GST-inclusive total. Original price = total ÷ (1 + rate ÷ 100), and the GST is the difference. This is how you back out the tax from an inclusive price.",
  },
  {
    q: "What are CGST, SGST, and IGST?",
    a: "For sales within a state, GST splits equally into CGST (central) and SGST (state) — each half of the total GST. For inter-state sales, the full amount is charged as IGST.",
  },
  {
    q: "What GST rate should I use?",
    a: "Indian GST slabs are 3%, 5%, 12%, 18%, and 28% depending on the goods or service. Pick the relevant preset or type a custom rate.",
  },
  {
    q: "Is the GST calculation accurate?",
    a: "The arithmetic is exact. However, specific items may attract a cess or fall under a special rate, so confirm the applicable rate for your product with a tax professional.",
  },
];

const about = (
  <>
    <p>
      The Goods and Services Tax (GST) is an indirect tax applied to most goods
      and services in India. This free GST calculator lets you add GST to a base
      price or remove it from a GST-inclusive total, and it instantly shows the
      GST amount along with the CGST, SGST, and IGST breakdown. It supports every
      standard slab — 3%, 5%, 12%, 18%, and 28% — plus any custom rate you type.
    </p>
    <p>
      Use it to price products, raise invoices, verify a bill, or work out how
      much tax is hidden inside an inclusive price. For intra-state transactions
      GST is split equally into CGST and SGST; for inter-state transactions the
      full amount is IGST. All calculations run locally in your browser with no
      data uploaded. Results are estimates for planning — confirm the exact
      applicable rate and any cess with a qualified accountant.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="GST Calculator"
        description="Add or remove GST from any amount and see the CGST, SGST and IGST breakdown across every Indian GST slab."
        currentHref="/calculators/gst"
        current="GST Calculator"
        disclaimer="financial"
        about={about}
        faqs={faqs}
      >
        <GstCalculator />
      </CalculatorPage>
    </>
  );
}
