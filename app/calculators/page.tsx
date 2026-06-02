import { ToolCard } from "@/components/ToolCard";
import { calculatorTools } from "@/lib/tools";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title:
    "Free Online Calculators — EMI, BMI, GST, SIP & More | GetFreeToolsAI",
  description:
    "15+ free online calculators for finance, health, and everyday use. EMI, BMI, calorie, GST, SIP, percentage, age calculator and more. Instant accurate results. No signup.",
  keywords:
    "free online calculators, emi calculator free, bmi calculator online, gst calculator india, sip calculator, percentage calculator, age calculator, calorie calculator, loan calculator free",
  path: "/calculators",
});

export default function CalculatorsPage() {
  const liveCount = calculatorTools.filter((t) => t.ready).length;
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="label">{liveCount} live · more coming soon</p>
      <h1 className="mt-3 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Free Online Calculators
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        A growing set of fast, accurate calculators for finance, health and
        everyday life — EMI and loan calculators, SIP and compound interest, GST,
        BMI and calorie, percentage, discount, tip and age. Every calculator uses
        verified, industry-standard formulas and shows clear, instant results as
        you type. Nothing is uploaded: all calculations run privately in your
        browser, with no signup, no limits and no watermark. Whether you are
        planning a loan repayment, checking a sale price, working out your daily
        calories, or splitting a dinner bill, these tools give you a reliable
        answer in seconds. Financial and health results are estimates for planning
        only — always confirm important decisions with a qualified professional.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculatorTools.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>
    </div>
  );
}
