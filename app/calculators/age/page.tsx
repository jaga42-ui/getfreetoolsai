import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Age Calculator by Date of Birth — Exact Age in Years & Days",
  description:
    "Calculate exact age in years, months, and days free. Find age in weeks, days, hours. Get next birthday countdown, zodiac sign, and generation. No signup.",
  keywords:
    "age calculator, age calculator online free, how old am i, calculate age from date of birth, exact age calculator, age calculator years months days",
  path: "/calculators/age",
});

const jsonLd = softwareAppSchema({
  name: "Free Age Calculator",
  description:
    "Calculate exact age in years, months, days, plus next birthday, zodiac and generation.",
  path: "/calculators/age",
  ratingCount: 1450,
});

const AgeCalculator = dynamic(() => import("@/components/calc/AgeCalculator"), {
  ssr: false,
  loading: () => <ToolSkeleton />,
});

const faqs = [
  {
    q: "How do I calculate my exact age?",
    a: "Enter your date of birth and the calculator returns your age in years, months, and days as of today (or any date you choose), counting calendar months precisely.",
  },
  {
    q: "How many days old am I?",
    a: "The calculator shows your total age in days — and also in weeks, hours, and minutes — alongside the years-months-days breakdown.",
  },
  {
    q: "How does the age calculator handle leap years?",
    a: "It uses the JavaScript date engine, which accounts for leap years and the differing number of days in each month, so the day count is exact.",
  },
  {
    q: "Can I calculate age between two dates?",
    a: "Yes. Change the “Age as of” date to any date to find how old someone was (or will be) on that specific day.",
  },
  {
    q: "What generation am I?",
    a: "Based on your birth year, the calculator labels your generation — Gen Alpha, Gen Z, Millennial, Gen X, Baby Boomer, or Silent Generation.",
  },
];

const about = (
  <>
    <p>
      This free age calculator works out exactly how old you are — in years, months
      and days — from your date of birth, accurately accounting for leap years and
      the different number of days in each month. It also converts your age into
      total months, weeks, days, hours and minutes, and counts down the days to your
      next birthday.
    </p>
    <p>
      As a bonus it tells you the day of the week you were born, your Western zodiac
      sign, your Chinese zodiac animal, and your generation. Change the “Age as of”
      date to measure age on any past or future date — useful for eligibility cut-offs
      or comparing ages. Everything is computed in your browser, so your date of birth
      is never uploaded or stored.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Age Calculator by Date of Birth"
        description="Find your exact age in years, months and days — plus weeks, hours, your next birthday, zodiac signs and generation."
        currentHref="/calculators/age"
        current="Age Calculator"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <AgeCalculator />
      </CalculatorPage>
    </>
  );
}
