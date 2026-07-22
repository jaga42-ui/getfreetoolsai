import dynamic from "next/dynamic";
import Link from "next/link";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Ovulation Calculator — Fertile Window & Ovulation Day",
  description:
    "Find your most fertile days free online. Enter your last period and cycle length to see your fertile window, ovulation day and next period. No signup.",
  keywords:
    "ovulation calculator, fertile window calculator, fertility calculator, ovulation day calculator, best time to conceive",
  path: "/calculators/ovulation",
});

const jsonLd = softwareAppSchema({
  name: "Free Ovulation Calculator",
  description:
    "Estimate your fertile window and ovulation day from your last period and cycle length.",
  path: "/calculators/ovulation",
});

const OvulationCalculator = dynamic(
  () => import("@/components/calc/OvulationCalculator"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  { q: "How is ovulation day calculated?", a: "Ovulation usually happens about 14 days before your next period. The calculator finds your next period from your cycle length, then counts back 14 days to estimate ovulation." },
  { q: "What is the fertile window?", a: "It is the roughly six-day span ending on ovulation day — the five days before plus ovulation day itself — when intercourse is most likely to lead to pregnancy, because sperm can survive several days." },
  { q: "How accurate is this for irregular cycles?", a: "It is most reliable for regular cycles. If your cycle length varies a lot, the fertile window is only a rough guide; ovulation predictor kits or tracking basal body temperature give better accuracy." },
  { q: "Can it help me avoid pregnancy?", a: "It should not be relied on for contraception. Calendar estimates are not precise enough to prevent pregnancy on their own — use a proven contraceptive method instead." },
  { q: "Is my data kept private?", a: "Yes. Everything is calculated in your browser and nothing you enter is uploaded or saved." },
];

const about = (
  <>
    <p>
      This free ovulation calculator estimates the days you are most likely to
      conceive. Enter the first day of your last period and your average cycle
      length to see your fertile window, your most fertile day, and when your
      next period is expected.
    </p>
    <h3>How it works</h3>
    <p>
      In a typical cycle, ovulation occurs about 14 days before the next period
      starts. Because sperm can live for up to five days, the fertile window
      spans the five days before ovulation plus ovulation day itself.
    </p>
    <h3>Tips for accuracy</h3>
    <ul>
      <li>Track a few cycles to find your true average length</li>
      <li>Combine with ovulation test kits for a tighter estimate</li>
      <li>Note that stress and illness can shift ovulation</li>
    </ul>
    <p>
      Already expecting? Switch to the{" "}
      <Link href="/calculators/due-date">due date calculator</Link> to find out
      when your baby is likely to arrive.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Ovulation Calculator"
        description="Estimate your fertile window and ovulation day from the first day of your last period and your cycle length."
        currentHref="/calculators/ovulation"
        current="Ovulation Calculator"
        disclaimer="health"
        about={about}
        faqs={faqs}
      >
        <OvulationCalculator />
      </CalculatorPage>
    </>
  );
}
