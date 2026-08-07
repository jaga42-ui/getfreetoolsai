import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Percentage to CGPA Calculator — Convert % to CGPA",
  description:
    "Convert percentage to CGPA instantly. Free percentage to CGPA calculator using the CBSE formula (CGPA = Percentage ÷ 9.5), with a custom divisor for other boards.",
  keywords:
    "percentage to cgpa, percentage to cgpa calculator, convert percentage to cgpa, cgpa calculator, marks to cgpa, cbse percentage to cgpa",
  path: "/calculators/percentage-to-cgpa",
});

const jsonLd = softwareAppSchema({
  name: "Free Percentage to CGPA Calculator",
  description: "Convert percentage to CGPA using the CBSE formula or a custom divisor.",
  path: "/calculators/percentage-to-cgpa",
});

const Tool = dynamic(() => import("@/components/calc/PercentageToCgpaCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  { q: "How do I convert percentage to CGPA?", a: "Divide your percentage by 9.5. This reverses the CBSE formula: CGPA = Percentage ÷ 9.5. For example, 80% ÷ 9.5 = 8.42 CGPA." },
  { q: "What is 90% in CGPA?", a: "Using the CBSE formula, 90 ÷ 9.5 = about 9.47 CGPA." },
  { q: "Is the 9.5 divisor the same for every board?", a: "No. 9.5 is the CBSE factor. Other boards and universities may use a different conversion, so change the divisor field to match your institution." },
  { q: "Why doesn't 95% give exactly 10 CGPA?", a: "It does: 95 ÷ 9.5 = 10.0. In the CBSE scale, 95% corresponds to a perfect 10 CGPA." },
  { q: "Is my data private?", a: "Yes. The calculation runs in your browser and nothing is stored." },
];

const about = (
  <>
    <p>
      This percentage to CGPA calculator converts a percentage into a Cumulative
      Grade Point Average using the CBSE formula. Enter your percentage and it
      divides by 9.5 instantly — or change the divisor if your board or university
      uses a different factor.
    </p>
    <h3>The formula</h3>
    <p>
      <strong>CGPA = Percentage ÷ 9.5</strong>. For <strong>80%</strong>,
      that&apos;s 80 ÷ 9.5 = <strong>8.42 CGPA</strong>.
    </p>
    <p>
      Need the reverse? Use the{" "}
      <Link href="/calculators/cgpa-to-percentage">CGPA to percentage calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Percentage to CGPA Calculator"
        description="Convert a percentage to CGPA using the CBSE formula (Percentage ÷ 9.5), with a custom divisor for other boards and universities."
        currentHref="/calculators/percentage-to-cgpa"
        current="Percentage to CGPA"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <Tool />
      </CalculatorPage>
    </>
  );
}
