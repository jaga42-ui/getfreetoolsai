import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "BMI Calculator Free Online — Body Mass Index | GetFreeToolsAI",
  description:
    "Calculate your BMI free online. Get your Body Mass Index, weight category, and healthy weight range. Works in metric and imperial units. No signup required.",
  keywords:
    "bmi calculator, body mass index calculator, bmi calculator free, bmi calculator online, healthy weight calculator, bmi calculator kg cm, bmi calculator lbs",
  path: "/calculators/bmi",
});

const jsonLd = softwareAppSchema({
  name: "Free BMI Calculator",
  description:
    "Calculate Body Mass Index, weight category and healthy weight range free online.",
  path: "/calculators/bmi",
  ratingCount: 1980,
});

const BmiCalculator = dynamic(() => import("@/components/calc/BmiCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "What is a healthy BMI range?",
    a: "The World Health Organization considers a BMI of 18.5 to 24.9 to be the normal, healthy range for most adults. Below 18.5 is underweight, 25–29.9 is overweight, and 30 or above is classified as obese.",
  },
  {
    q: "Is BMI accurate for athletes?",
    a: "Not always. BMI only uses height and weight, so it can misclassify very muscular people (such as athletes) as overweight because muscle weighs more than fat. For them, body-fat percentage is a better measure.",
  },
  {
    q: "What is the difference between BMI and body fat percentage?",
    a: "BMI estimates whether your weight is healthy for your height, while body-fat percentage measures the proportion of your body that is fat. Two people with the same BMI can have very different body compositions.",
  },
  {
    q: "How do I calculate BMI manually?",
    a: "In metric, BMI = weight in kilograms ÷ (height in metres)². In imperial, BMI = (weight in pounds ÷ (height in inches)²) × 703. This calculator does both for you instantly.",
  },
  {
    q: "Should I use metric or imperial units?",
    a: "Use whichever you know your measurements in — the result is identical. Toggle between Metric (kg/cm) and Imperial (lbs/ft) at the top of the calculator.",
  },
];

const about = (
  <>
    <p>
      Body Mass Index (BMI) is a simple screening number that estimates whether
      your weight is in a healthy range for your height. It is calculated by
      dividing your weight in kilograms by the square of your height in metres.
      This free BMI calculator works in both metric and imperial units and
      instantly shows your BMI, the official WHO weight category, where you fall
      on the BMI scale, and the healthy weight range for your height.
    </p>
    <p>
      BMI is useful as a quick, population-level indicator, but it has real
      limitations: it does not distinguish muscle from fat, and it does not
      account for age, sex, bone density, or body-fat distribution. Athletes and
      very muscular people may register as overweight despite being healthy,
      while others within the normal range may still carry excess fat. Treat BMI
      as a starting point, not a diagnosis. Everything is calculated locally in
      your browser, and for any health decisions you should consult a qualified
      healthcare professional.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="BMI Calculator"
        description="Find your Body Mass Index, weight category, and healthy weight range in metric or imperial units — instantly and privately."
        currentHref="/calculators/bmi"
        current="BMI Calculator"
        disclaimer="health"
        about={about}
        faqs={faqs}
      >
        <BmiCalculator />
      </CalculatorPage>
    </>
  );
}
