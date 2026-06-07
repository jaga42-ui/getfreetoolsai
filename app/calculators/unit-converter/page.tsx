import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Unit Converter Free Online — Length Weight Temperature",
  description:
    "Free online unit converter. Convert length, weight, temperature, volume, area, speed, and data units instantly. All units in one place. No signup.",
  keywords:
    "unit converter, unit converter free, length converter, weight converter, temperature converter, metric converter, cm to inches, kg to lbs, celsius to fahrenheit",
  path: "/calculators/unit-converter",
});

const jsonLd = softwareAppSchema({
  name: "Free Unit Converter",
  description:
    "Convert length, weight, temperature, volume, area, speed, data and time units free online.",
  path: "/calculators/unit-converter",
  ratingCount: 1190,
});

const UnitConverter = dynamic(
  () => import("@/components/calc/UnitConverter"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "What units can I convert?", a: "Length, weight/mass, temperature, volume, area, speed, digital data, and time — each with the common metric and imperial units." },
  { q: "How do I convert Celsius to Fahrenheit?", a: "Pick the Temperature tab, enter your value, and choose °C as the from-unit; the °F result appears instantly using °F = (°C × 9/5) + 32." },
  { q: "Does it convert to all units at once?", a: "Yes. Enter a value once and every unit in that category updates simultaneously, so you can read off any conversion." },
  { q: "Can I copy a result?", a: "Yes — click any result to copy it to your clipboard." },
  { q: "Is it accurate?", a: "It uses standard conversion factors and is accurate for everyday use; extremely large or small values are shown in scientific notation." },
];

const about = (
  <>
    <p>
      This free unit converter handles every common everyday conversion in one
      place. Choose a category — length, weight, temperature, volume, area, speed,
      digital data, or time — type a value, pick the unit you are converting from,
      and instantly see the equivalent in all other units in that category.
    </p>
    <p>
      Temperature uses the exact Celsius–Fahrenheit–Kelvin formulas, and every
      other category uses standard conversion factors. Click any result to copy
      it. It is perfect for cooking, travel, study, engineering, and quick
      day-to-day conversions like cm to inches or kg to lbs — all running locally
      in your browser.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Unit Converter"
        description="Convert length, weight, temperature, volume, area, speed, data and time units instantly — all in one place."
        currentHref="/calculators/unit-converter"
        current="Unit Converter"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <UnitConverter />
      </CalculatorPage>
    </>
  );
}
