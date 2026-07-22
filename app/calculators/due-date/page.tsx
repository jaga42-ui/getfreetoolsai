import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Due Date Calculator — Pregnancy Due Date & Week",
  description:
    "Calculate your pregnancy due date free online from your last period. See your estimated due date, how many weeks along you are, and your trimester. No signup.",
  keywords:
    "due date calculator, pregnancy due date calculator, pregnancy calculator, gestational age calculator, when is my baby due",
  path: "/calculators/due-date",
});

const jsonLd = softwareAppSchema({
  name: "Free Due Date Calculator",
  description:
    "Estimate your pregnancy due date, current gestational week and trimester from your last menstrual period.",
  path: "/calculators/due-date",
});

const DueDateCalculator = dynamic(
  () => import("@/components/calc/DueDateCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How is the due date calculated?", a: "It uses Naegele's rule: add 280 days (40 weeks) to the first day of your last menstrual period, adjusted for your cycle length. This is the same method most doctors use for a first estimate." },
  { q: "How accurate is the due date?", a: "It is an estimate. Only about 1 in 20 babies is born on the exact due date; most arrive within two weeks either side. A dating ultrasound gives a more precise estimate." },
  { q: "What if my cycle is not 28 days?", a: "Enter your average cycle length and the calculator shifts the due date accordingly — longer cycles push the due date later, shorter cycles bring it earlier." },
  { q: "How many weeks pregnant am I?", a: "Pregnancy is counted from the first day of your last period, not from conception, so you are already considered about two weeks pregnant at conception. The calculator shows your current week and day." },
  { q: "Is my information private?", a: "Completely. The dates you enter are processed only in your browser and are never uploaded or stored." },
];

const about = (
  <>
    <p>
      This free due date calculator estimates when your baby is likely to arrive,
      how far along you are right now, and which trimester you are in — all from
      the first day of your last menstrual period (LMP).
    </p>
    <h3>How it works</h3>
    <p>
      Pregnancy typically lasts about 40 weeks (280 days) from the LMP. The
      calculator adds 280 days to your LMP and adjusts for your cycle length, so
      the estimate fits your body rather than a fixed 28-day assumption.
    </p>
    <h3>Trimesters</h3>
    <ul>
      <li><strong>First trimester:</strong> weeks 1–12</li>
      <li><strong>Second trimester:</strong> weeks 13–26</li>
      <li><strong>Third trimester:</strong> weeks 27–birth</li>
    </ul>
    <p>
      Planning ahead or trying to conceive? The{" "}
      <Link href="/calculators/ovulation">ovulation calculator</Link> estimates
      your fertile window, and the{" "}
      <Link href="/calculators/age">age calculator</Link> works out an exact age
      once your baby arrives.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Due Date Calculator"
        description="Estimate your pregnancy due date, current week and trimester from the first day of your last period."
        currentHref="/calculators/due-date"
        current="Due Date Calculator"
        disclaimer="health"
        about={about}
        faqs={faqs}
      >
        <DueDateCalculator />
      </CalculatorPage>
    </>
  );
}
