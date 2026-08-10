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

const readyCalculators = calculatorTools.filter((t) => t.ready);

/**
 * Grouping for the hub.
 *
 * Two reasons this is explicit rather than a flat grid of 43 cards: a reader
 * looking for "SSY" should not scan 43 tiles, and a single ungrouped list gives
 * the page no heading structure to describe what the category actually covers.
 *
 * Anything not listed here falls into a "More calculators" group automatically
 * (see `grouped` below). That matters: since the footer no longer links every
 * tool, this hub is the crawl path to each calculator, so a tool must never be
 * able to drop off it by being forgotten in this config.
 */
const GROUPS: { id: string; title: string; blurb: string; hrefs: string[] }[] = [
  {
    id: "loans",
    title: "Loan & EMI calculators",
    blurb:
      "Work out a monthly repayment, the total interest a loan will cost, and how much faster it clears if you pay extra.",
    hrefs: [
      "/calculators/emi",
      "/calculators/loan",
      "/calculators/mortgage",
      "/calculators/auto-loan",
      "/calculators/credit-card-payoff",
      "/calculators/simple-interest",
    ],
  },
  {
    id: "investments",
    title: "Investment & savings calculators",
    blurb:
      "Project what a monthly or one-time investment grows into, and compare the fixed-return schemes offered by Indian banks and post offices.",
    hrefs: [
      "/calculators/sip",
      "/calculators/step-up-sip",
      "/calculators/lumpsum",
      "/calculators/swp",
      "/calculators/cagr",
      "/calculators/compound-interest",
      "/calculators/fd",
      "/calculators/rd",
      "/calculators/ppf",
      "/calculators/nsc",
      "/calculators/scss",
      "/calculators/ssy",
    ],
  },
  {
    id: "tax-salary",
    title: "Tax, salary & retirement calculators",
    blurb:
      "Take-home pay, GST and sales tax in both directions, and the retirement corpus your contributions are on track to build.",
    hrefs: [
      "/calculators/income-tax",
      "/calculators/gst",
      "/calculators/sales-tax",
      "/calculators/salary",
      "/calculators/hra",
      "/calculators/gratuity",
      "/calculators/epf",
      "/calculators/nps",
      "/calculators/401k",
      "/calculators/retirement",
    ],
  },
  {
    id: "health",
    title: "Health & pregnancy calculators",
    blurb:
      "Body composition and daily energy needs, plus due-date and ovulation estimates. Screening estimates only — not a diagnosis.",
    hrefs: [
      "/calculators/bmi",
      "/calculators/calorie",
      "/calculators/body-fat",
      "/calculators/due-date",
      "/calculators/ovulation",
    ],
  },
  {
    id: "students",
    title: "Student calculators",
    blurb:
      "Convert between CGPA and percentage using the CBSE formula or your own board's multiplier, and count words for an assignment limit.",
    hrefs: [
      "/calculators/cgpa-to-percentage",
      "/calculators/percentage-to-cgpa",
      "/calculators/word-counter",
    ],
  },
  {
    id: "everyday",
    title: "Everyday calculators",
    blurb:
      "The quick ones — percentages, a sale price, a tip split, your exact age, days between dates and unit conversions.",
    hrefs: [
      "/calculators/percentage",
      "/calculators/discount",
      "/calculators/tip",
      "/calculators/age",
      "/calculators/date",
      "/calculators/unit-converter",
      "/calculators/inflation",
    ],
  },
];

const byHref = new Map(readyCalculators.map((t) => [t.href, t]));
const claimed = new Set(GROUPS.flatMap((g) => g.hrefs));
const leftover = readyCalculators.filter((t) => !claimed.has(t.href));

const grouped = [
  ...GROUPS.map((g) => ({
    ...g,
    tools: g.hrefs.map((h) => byHref.get(h)).filter(Boolean),
  })),
  ...(leftover.length
    ? [
        {
          id: "more",
          title: "More calculators",
          blurb: "Everything else in the collection.",
          tools: leftover,
        },
      ]
    : []),
].filter((g) => g.tools.length > 0);

const faqs = [
  {
    q: "Are these calculators free to use?",
    a: "Yes. Every calculator is completely free with no signup, no limits and no watermark.",
  },
  {
    q: "Are the formulas accurate?",
    a: "Each calculator uses the standard published formula for its purpose — reducing-balance EMI, Mifflin-St Jeor for daily calories, annual compounding for NSC, and the current slabs for income tax. Where a scheme's rate is revised periodically by the government, the rate is an input you can change rather than a hard-coded value, so the result stays correct after a revision.",
  },
  {
    q: "Is my data private?",
    a: "Completely. Every calculation runs locally in your browser. Nothing you enter is uploaded or stored on any server, which is why these work with no account and no rate limit.",
  },
  {
    q: "Can I use these on my phone?",
    a: "Yes. All calculators are mobile-friendly and work in any browser on Android or iPhone, with nothing to install.",
  },
  {
    q: "Which calculator should I use for a home loan?",
    a: "Start with the EMI calculator — it gives your monthly instalment, the total interest over the term, and a full amortisation schedule. Use the loan calculator if you want to solve for a different variable, such as the amount you can borrow at a given EMI.",
  },
  {
    q: "Do these cover Indian tax and savings schemes?",
    a: "Yes. PPF, EPF, NPS, NSC, SSY, SCSS, HRA, gratuity and GST are all covered, alongside income tax with an old-versus-new regime comparison. US-specific tools such as the 401(k) and mortgage calculators are included too.",
  },
];

export const metadata = toolMeta({
  title: "Free Online Calculators — EMI, SIP, GST, BMI & More",
  description: `${readyCalculators.length} free online calculators for loans, investments, tax, salary and health — EMI, SIP, GST, PPF and BMI. Instant results, no signup.`,
  keywords:
    "free online calculators, emi calculator, sip calculator, gst calculator india, ppf calculator, income tax calculator, bmi calculator online, percentage calculator, financial calculators",
  path: "/calculators",
});

export default function CalculatorsPage() {
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
          readyCalculators.map((t) => ({ name: t.name, href: t.href }))
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
        {readyCalculators.length} calculators for loans, investments, tax, salary,
        health and everyday maths — each using the standard published formula and
        showing its result instantly as you type. Nothing is uploaded: every
        calculation runs privately in your browser, with no signup and no limits.
      </p>

      <TrustBadges className="mt-6" badges={["Free", "No Signup"]} />

      {/* Grouped tool grid — the primary experience, kept at the top. */}
      {grouped.map((g) => (
        <section key={g.id} className="mt-12" id={g.id}>
          <h2 className="font-display text-2xl font-medium text-text-primary">
            {g.title}
          </h2>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            {g.blurb}
          </p>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {g.tools.map((t) => (
              <ToolCard key={t!.href} tool={t!} />
            ))}
          </div>
        </section>
      ))}

      <AdSlot className="mt-12" />

      {/* ------------------------------------------------------------------
          Supporting content, deliberately below the calculators themselves.
         ------------------------------------------------------------------ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Built for Indian finance, not adapted to it
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            Most international calculator sites cover loans and BMI, then stop.
            The schemes people in India actually plan around are usually missing,
            or modelled with the wrong compounding. This collection covers them
            directly:{" "}
            <Link href="/calculators/ppf" className="text-primary hover:underline">
              PPF
            </Link>
            ,{" "}
            <Link href="/calculators/epf" className="text-primary hover:underline">
              EPF
            </Link>
            ,{" "}
            <Link href="/calculators/nps" className="text-primary hover:underline">
              NPS
            </Link>
            ,{" "}
            <Link href="/calculators/nsc" className="text-primary hover:underline">
              NSC
            </Link>
            ,{" "}
            <Link href="/calculators/ssy" className="text-primary hover:underline">
              Sukanya Samriddhi Yojana
            </Link>{" "}
            and{" "}
            <Link href="/calculators/scss" className="text-primary hover:underline">
              the Senior Citizen Savings Scheme
            </Link>
            , each with the compounding and tenure the scheme actually uses.
          </p>
          <p>
            On the salary side,{" "}
            <Link href="/calculators/income-tax" className="text-primary hover:underline">
              income tax
            </Link>{" "}
            compares the old and new regimes side by side including the standard
            deduction, 87A rebate and cess, while{" "}
            <Link href="/calculators/hra" className="text-primary hover:underline">
              HRA
            </Link>{" "}
            and{" "}
            <Link href="/calculators/gratuity" className="text-primary hover:underline">
              gratuity
            </Link>{" "}
            handle the exemptions that decide your real take-home.{" "}
            <Link href="/calculators/gst" className="text-primary hover:underline">
              GST
            </Link>{" "}
            works in both directions — add it to a base price, or extract it from
            a tax-inclusive total.
          </p>
          <p>
            Government-notified rates change from time to time. Rather than
            hard-coding a figure that quietly goes stale, every scheme calculator
            takes the rate as an input with a sensible current default, so you can
            enter the notified rate and still get an accurate answer.
          </p>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-text-primary">
          Where to start
        </h2>
        <div className="mt-4 space-y-4 text-[15px] leading-relaxed text-text-muted">
          <p>
            <span className="font-medium text-text-primary">Borrowing.</span> The{" "}
            <Link href="/calculators/emi" className="text-primary hover:underline">
              EMI calculator
            </Link>{" "}
            is the usual starting point for a home, car or personal loan — it
            returns the monthly instalment, total interest and a full amortisation
            schedule, so you can see how much of each early payment is interest
            rather than principal. If you are carrying a balance instead, the{" "}
            <Link href="/calculators/credit-card-payoff" className="text-primary hover:underline">
              credit card payoff calculator
            </Link>{" "}
            shows how long a fixed payment takes to clear it.
          </p>
          <p>
            <span className="font-medium text-text-primary">Investing.</span> Use the{" "}
            <Link href="/calculators/sip" className="text-primary hover:underline">
              SIP calculator
            </Link>{" "}
            for a monthly mutual-fund contribution and{" "}
            <Link href="/calculators/lumpsum" className="text-primary hover:underline">
              lumpsum
            </Link>{" "}
            for a one-time investment. To measure a return you have already earned
            rather than project a future one, use{" "}
            <Link href="/calculators/cagr" className="text-primary hover:underline">
              CAGR
            </Link>
            .
          </p>
          <p>
            <span className="font-medium text-text-primary">Everyday maths.</span> The{" "}
            <Link href="/calculators/percentage" className="text-primary hover:underline">
              percentage calculator
            </Link>{" "}
            handles increases, decreases and &ldquo;what percent of&rdquo; in one
            place, and students converting marks can go straight to{" "}
            <Link href="/calculators/cgpa-to-percentage" className="text-primary hover:underline">
              CGPA to percentage
            </Link>
            . For document and image work instead, see the{" "}
            <Link href="/pdf-tools" className="text-primary hover:underline">
              PDF tools
            </Link>{" "}
            and{" "}
            <Link href="/image-tools" className="text-primary hover:underline">
              image tools
            </Link>
            .
          </p>
          <p className="text-sm">
            Financial and health results are estimates for planning only. Confirm
            anything consequential with a qualified professional before acting on
            it.
          </p>
        </div>
      </section>

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/calculators" />
    </div>
  );
}
