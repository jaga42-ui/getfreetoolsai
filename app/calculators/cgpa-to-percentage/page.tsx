import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "CGPA to Percentage Calculator — Convert CGPA to %",
  description:
    "Convert CGPA to percentage instantly. Free CGPA to percentage calculator using the CBSE formula (Percentage = CGPA × 9.5), with a custom multiplier for other boards.",
  keywords:
    "cgpa to percentage, cgpa to percentage calculator, convert cgpa to percentage, cgpa calculator, 10 cgpa to percentage, cbse cgpa to percentage",
  path: "/calculators/cgpa-to-percentage",
});

const jsonLd = softwareAppSchema({
  name: "Free CGPA to Percentage Calculator",
  description: "Convert CGPA to percentage using the CBSE formula or a custom multiplier.",
  path: "/calculators/cgpa-to-percentage",
});

const Tool = dynamic(() => import("@/components/calc/CgpaToPercentageCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I convert CGPA to percentage?", a: "Multiply your CGPA by 9.5. This is the official CBSE formula: Percentage = CGPA × 9.5. For example, a CGPA of 8.5 equals 80.75%." },
  { q: "Why is the multiplier 9.5?", a: "CBSE derived 9.5 by averaging the marks of top-scoring students across subjects over several years. It applies to the CBSE 10-point grading scale; some universities use a different factor." },
  { q: "What is 10 CGPA in percentage?", a: "Using the CBSE formula, 10 CGPA × 9.5 = 95%. A perfect 10 CGPA corresponds to 95%, not 100%." },
  { q: "Does this work for my university?", a: "The 9.5 multiplier is CBSE-specific. Many universities publish their own conversion formula, so change the multiplier field to match your institution's rule." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing you enter is stored." },
];

const about = (
  <>
    <p>
      This CGPA to percentage calculator converts your Cumulative Grade Point
      Average into a percentage using the official CBSE formula. Enter your CGPA
      and it multiplies by 9.5 instantly — or change the multiplier if your board
      or university uses a different factor.
    </p>
    <h3>The formula</h3>
    <p>
      <strong>Percentage = CGPA × 9.5</strong>. For a CGPA of{" "}
      <strong>8.5</strong>, that&apos;s 8.5 × 9.5 = <strong>80.75%</strong>.
    </p>
    <p>
      Need to go the other way? Use the{" "}
      <Link href="/calculators/percentage-to-cgpa">percentage to CGPA calculator</Link>,
      or work out any percentage with the{" "}
      <Link href="/calculators/percentage">percentage calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="CGPA to Percentage Calculator"
        description="Convert your CGPA to a percentage using the CBSE formula (CGPA × 9.5), with a custom multiplier for other boards and universities."
        currentHref="/calculators/cgpa-to-percentage"
        current="CGPA to Percentage"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
