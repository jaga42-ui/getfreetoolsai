import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Body Fat Calculator — US Navy Method, Free",
  description:
    "Calculate your body fat percentage free online with the U.S. Navy tape method. Enter a few measurements to get body fat %, fat mass and lean mass. No signup.",
  keywords:
    "body fat calculator, body fat percentage calculator, us navy body fat calculator, body fat measurement, lean body mass calculator",
  path: "/calculators/body-fat",
});

const jsonLd = softwareAppSchema({
  name: "Free Body Fat Calculator",
  description:
    "Estimate body fat percentage, fat mass and lean mass using the U.S. Navy circumference method.",
  path: "/calculators/body-fat",
});

const BodyFatCalculator = dynamic(
  () => import("@/components/calc/BodyFatCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How does the U.S. Navy body fat method work?", a: "It estimates body fat from body circumference measurements — neck and waist for men, plus hips for women — together with your height. It is a quick, tape-only method that correlates reasonably well with more expensive tests." },
  { q: "How do I measure correctly?", a: "Measure your waist at the belly button, your neck just below the larynx, and (for women) your hips at their widest point. Keep the tape snug but not tight, and measure without holding your breath." },
  { q: "What is a healthy body fat percentage?", a: "General fitness ranges are roughly 14–17% for men and 21–24% for women. Essential fat is about 2–5% for men and 10–13% for women; athletes are usually below the fitness range." },
  { q: "How accurate is it?", a: "It is an estimate, typically within a few percent of a DEXA scan for most people. Very muscular or very lean bodies may see larger differences." },
  { q: "Is my data stored?", a: "No. Your measurements are used only in your browser and are never uploaded." },
];

const about = (
  <>
    <p>
      This free body fat calculator uses the U.S. Navy circumference method to
      estimate your body fat percentage from a few tape measurements. It also
      converts that percentage into fat mass and lean mass using your weight.
    </p>
    <h3>How it works</h3>
    <p>
      The formula combines your height with your neck and waist measurements (and
      hips for women). It needs no calipers or scales beyond a tape measure and
      your body weight, which makes it easy to repeat and track over time.
    </p>
    <h3>Body fat categories</h3>
    <ul>
      <li><strong>Essential:</strong> 2–5% (men), 10–13% (women)</li>
      <li><strong>Athletes:</strong> 6–13% (men), 14–20% (women)</li>
      <li><strong>Fitness:</strong> 14–17% (men), 21–24% (women)</li>
      <li><strong>Average:</strong> 18–24% (men), 25–31% (women)</li>
    </ul>
    <p>
      For a broader picture of healthy weight, try the{" "}
      <Link href="/calculators/bmi">BMI calculator</Link> or plan intake with the{" "}
      <Link href="/calculators/calorie">calorie calculator</Link>.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Body Fat Calculator"
        description="Estimate your body fat percentage, fat mass and lean mass using the U.S. Navy tape-measure method."
        currentHref="/calculators/body-fat"
        current="Body Fat Calculator"
        disclaimer="health"
        about={about}
        faqs={faqs}
      >
        <BodyFatCalculator />
      </CalculatorPage>
    </>
  );
}
