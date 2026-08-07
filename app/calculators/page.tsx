import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { calculatorTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

const faqs = [
  {
    q: "Are these calculators free to use?",
    a: "Yes. Every calculator is completely free with no signup, no limits and no watermark.",
  },
  {
    q: "Are the formulas accurate?",
    a: "Each calculator uses verified, industry-standard formulas — for example reducing-balance EMI, Mifflin-St Jeor for calories, and the latest income-tax slabs for salary — and shows results instantly as you type.",
  },
  {
    q: "Is my data private?",
    a: "Completely. Every calculation runs locally in your browser. Nothing you enter is uploaded or stored on any server.",
  },
  {
    q: "Can I use these on my phone?",
    a: "Yes. All calculators are mobile-friendly and work in any browser on Android or iPhone, with nothing to install.",
  },
];

export const metadata = toolMeta({
  title:
    "Free Online Calculators — EMI, BMI, GST, SIP & More",
  description:
    "15+ free online calculators for finance, health, and everyday use. EMI, BMI, calorie, GST, SIP, percentage, age calculator and more. Instant accurate results.",
  keywords:
    "free online calculators, emi calculator free, bmi calculator online, gst calculator india, sip calculator, percentage calculator, age calculator, calorie calculator, loan calculator free",
  path: "/calculators",
});

export default function CalculatorsPage() {
  const ready = calculatorTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Calculators" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Free Online Calculators",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />
      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Calculators</span>
      </nav>
      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
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

      <TrustBadges className="mt-6" badges={["Free", "No Signup"]} />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {calculatorTools.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/calculators" />
    </div>
  );
}
