import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Tip Calculator & Bill Splitter Free Online",
  description:
    "Calculate tip and split bills free online. Split dinner bills equally, choose a tip percentage, and see the per-person amount. No app download, no signup.",
  keywords:
    "tip calculator, bill splitter free, split bill calculator, tip calculator online, dinner bill splitter, tip and split calculator, how much to tip calculator",
  path: "/calculators/tip",
});

const jsonLd = softwareAppSchema({
  name: "Free Tip Calculator & Bill Splitter",
  description:
    "Calculate the tip and split a bill between any number of people free online.",
  path: "/calculators/tip",
  ratingCount: 760,
});

const TipCalculator = dynamic(() => import("@/components/calc/TipCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How much should I tip?",
    a: "It varies by country and service, but 15–20% is common for good restaurant service in many places. Use the preset buttons or enter a custom percentage that suits your situation.",
  },
  {
    q: "How is the tip calculated?",
    a: "Tip = bill amount × tip percentage ÷ 100. The total is the bill plus the tip, and the per-person amount divides that total by the number of people.",
  },
  {
    q: "Can I split the bill between people?",
    a: "Yes. Enter the number of people and the calculator shows the total per person and each person’s share of the tip.",
  },
  {
    q: "Should I tip on the pre-tax or post-tax amount?",
    a: "Either is acceptable; many people tip on the pre-tax subtotal. Enter whichever bill figure you prefer to base the tip on.",
  },
  {
    q: "Is this tip calculator free?",
    a: "Yes — it is completely free, needs no signup, and works instantly in your browser, even on your phone at the table.",
  },
];

const about = (
  <>
    <p>
      This free tip calculator and bill splitter makes paying at a restaurant easy.
      Enter the bill amount, pick a tip percentage from the quick presets (10%, 15%,
      18%, 20%, 25%) or type a custom value, and set how many people are splitting.
      You instantly see the tip amount, the total with tip, the amount each person
      owes, and each person’s share of the tip.
    </p>
    <p>
      It is handy for dinners with friends, group lunches, taxi fares, or any time
      you want to tip fairly and split the cost without doing mental maths. Because
      everything runs in your browser, it works instantly on your phone at the table
      with no app to install and nothing uploaded.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Tip Calculator & Bill Splitter"
        description="Work out the tip and split any bill between friends in seconds — pick a tip percentage and see the per-person total."
        currentHref="/calculators/tip"
        current="Tip Calculator"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <TipCalculator />
      </CalculatorPage>
    </>
  );
}
