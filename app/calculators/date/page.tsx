import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Date Calculator Free Online — Days Between Dates | GetFreeToolsAI",
  description:
    "Calculate days between dates free online. Add or subtract days from dates. Find week numbers and business days. No signup required. Instant results.",
  keywords:
    "date calculator, days between dates, date difference calculator, add days to date, how many days between two dates, day counter calculator free",
  path: "/calculators/date",
});

const jsonLd = softwareAppSchema({
  name: "Free Date Calculator",
  description:
    "Find days between dates, add or subtract days, and get week numbers free online.",
  path: "/calculators/date",
  ratingCount: 690,
});

const DateCalculator = dynamic(
  () => import("@/components/calc/DateCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How do I find the number of days between two dates?", a: "Use the “Date difference” mode and pick both dates. It shows the gap in years, months, and days, plus the total days, weeks, and business days." },
  { q: "How do I add or subtract days from a date?", a: "Switch to “Add / subtract”, choose a start date, pick add or subtract, and enter the number of days to get the resulting date and weekday." },
  { q: "What are business days?", a: "Business days exclude weekends (Saturday and Sunday), counting only Monday to Friday between the two dates." },
  { q: "What is an ISO week number?", a: "It is the standardised week-of-year number (1–53) used internationally, where week 1 contains the year's first Thursday." },
  { q: "Does it handle leap years correctly?", a: "Yes. It uses the browser's date engine, which accounts for leap years and varying month lengths." },
];

const about = (
  <>
    <p>
      This free date calculator covers three common date tasks. Find the exact
      difference between two dates — in years, months, and days, plus total days,
      weeks, and business days (excluding weekends). Add or subtract a number of
      days from any date to get the resulting calendar date and day of the week.
      And look up the ISO week number, quarter, and how many days have passed or
      remain in the year for any date.
    </p>
    <p>
      It is useful for project deadlines, notice periods, due dates, age gaps, and
      planning. Everything is computed locally in your browser, accounting for leap
      years and month lengths, with nothing uploaded.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Date Calculator"
        description="Count the days between two dates, add or subtract days, and find ISO week numbers — all in one place."
        currentHref="/calculators/date"
        current="Date Calculator"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <DateCalculator />
      </CalculatorPage>
    </>
  );
}
