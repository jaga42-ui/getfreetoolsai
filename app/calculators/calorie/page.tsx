import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Calorie Calculator Free — TDEE & BMR Calculator",
  description:
    "Calculate your daily calorie needs free. Get BMR, TDEE, and calorie goals for weight loss, maintenance, or muscle gain. Includes macro breakdown. No signup.",
  keywords:
    "calorie calculator, tdee calculator, bmr calculator, daily calorie calculator free, calories to lose weight, calorie intake calculator, macro calculator free",
  path: "/calculators/calorie",
});

const jsonLd = softwareAppSchema({
  name: "Free Calorie & TDEE Calculator",
  description:
    "Calculate BMR, TDEE, calorie goals and macros free online using the Mifflin-St Jeor formula.",
  path: "/calculators/calorie",
  ratingCount: 1410,
});

const CalorieCalculator = dynamic(
  () => import("@/components/calc/CalorieCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What is the difference between BMR and TDEE?", a: "BMR (Basal Metabolic Rate) is the energy your body burns at complete rest. TDEE (Total Daily Energy Expenditure) is BMR multiplied by an activity factor — the calories you actually burn in a day." },
  { q: "How many calories should I eat to lose weight?", a: "A deficit of about 500 calories below your TDEE typically loses ~0.5 kg per week, and 250 below loses ~0.25 kg per week. The calculator shows both targets." },
  { q: "Are these calorie calculations accurate?", a: "The Mifflin-St Jeor equation is one of the most accurate predictive formulas for the general population, but individual metabolism varies. Use it as a starting point and adjust based on real results." },
  { q: "What are macros and why do they matter?", a: "Macros are protein, carbohydrates, and fat. Hitting the right balance — especially enough protein — supports muscle retention and satiety while you manage calories." },
  { q: "How do I choose the right activity level?", a: "Be honest about exercise frequency: sedentary for a desk job with no workouts, up to very/extra active for those who train hard most days or do physical labour." },
];

const about = (
  <>
    <p>
      This free calorie calculator estimates your daily energy needs using the
      Mifflin-St Jeor equation — widely regarded as the most accurate formula for
      the general population. It first computes your BMR from your age, sex,
      height, and weight, then multiplies by an activity factor to give your TDEE,
      the calories you burn in a typical day.
    </p>
    <p>
      From there it shows calorie targets for losing weight (fast or steady),
      maintaining, or gaining muscle, plus a suggested macronutrient split of
      protein, carbohydrates, and fat. It works in metric or imperial units and
      runs entirely in your browser. Results are general estimates based on
      population averages — consult a healthcare professional or dietitian for
      personalised advice.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Calorie & TDEE Calculator"
        description="Find your BMR, daily calorie needs (TDEE), and calorie goals for weight loss, maintenance or muscle gain — with a macro breakdown."
        currentHref="/calculators/calorie"
        current="Calorie Calculator"
        disclaimer="health"
        about={about}
        faqs={faqs}
      >
        <CalorieCalculator />
      </CalculatorPage>
    </>
  );
}
