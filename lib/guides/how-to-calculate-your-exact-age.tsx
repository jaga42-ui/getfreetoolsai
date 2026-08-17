import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-your-exact-age",
  category: "calculator",
  title: "How to Calculate Your Exact Age (Years, Months & Days)",
  description:
    "Work out an exact age in years, months and days from any date of birth — the manual method, the leap-year gotcha, and a free calculator.",
  keywords:
    "how to calculate age, calculate exact age, age in years months days, age from date of birth, how old am i, age calculator, age difference",
  excerpt:
    "The manual method for an exact age in years, months and days — plus the leap-year trap most people miss.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 4,
  tags: ["age", "dates", "everyday"],
  relatedTools: ["/calculators/age", "/calculators/date", "/calculators/bmi"],
  relatedGuides: [],
  toc: [
    { id: "method", label: "The manual method" },
    { id: "example", label: "Worked example" },
    { id: "leap", label: "The leap-year gotcha" },
    { id: "uses", label: "Where exact age matters" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        &ldquo;How old am I exactly?&rdquo; sounds trivial until you try to do it by
        hand and the months don&apos;t line up. Calculating an exact age means
        subtracting one date from another and borrowing across months and years —
        the same care a stopwatch takes. Here&apos;s the method, plus a free{" "}
        <Link href="/calculators/age">age calculator</Link> that gives years, months
        and days in one click.
      </p>

      <h2 id="method">The manual method</h2>
      <p>
        Subtract the date of birth from today, one unit at a time — days, then
        months, then years:
      </p>
      <ol>
        <li>Subtract the day numbers. If today&apos;s day is smaller, borrow the days from the previous month and reduce the month count by one.</li>
        <li>Subtract the month numbers. If that goes negative, borrow 12 months from the year and reduce the year count by one.</li>
        <li>Subtract the year numbers. What&apos;s left is the exact age.</li>
      </ol>

      <h2 id="example">Worked example</h2>
      <p><em>Born 15 August 1998, today 3 July 2026:</em></p>
      <ul>
        <li>Days: 3 − 15 is negative, so borrow → 3 + 30 − 15 = <strong>18 days</strong>, carry −1 month.</li>
        <li>Months: 7 − 8 − 1 = −2, so borrow 12 → 10 + 7 − 8 − 1 = <strong>10 months</strong>, carry −1 year.</li>
        <li>Years: 2026 − 1998 − 1 = <strong>27 years</strong>.</li>
      </ul>
      <p>Exact age: <strong>27 years, 10 months, 18 days</strong>.</p>

      <h2 id="leap">The leap-year gotcha</h2>
      <p>
        Borrowing &ldquo;days from the previous month&rdquo; means the number of
        days varies — 28, 29, 30 or 31 — so a hand calculation is easy to get
        slightly wrong, especially around February in a leap year. Someone born on
        29 February only gets a &ldquo;true&rdquo; birthday every four years, and
        different systems treat their non-leap-year birthday as 28 Feb or 1 March.
        A calculator handles all of this consistently.
      </p>

      <h2 id="uses">Where exact age matters</h2>
      <p>
        Eligibility cut-offs (school admission, retirement, visas), precise
        milestones, and working out the gap between two people&apos;s ages all need
        exactness, not just &ldquo;27&rdquo;. To count the days or working days
        between any two dates instead, use the{" "}
        <Link href="/calculators/date">date calculator</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I calculate age from a date of birth?</strong> Subtract the birth date from today, borrowing across months and years as needed.</p>
      <p><strong>What about a 29 February birthday?</strong> In non-leap years it&apos;s usually observed on 28 Feb or 1 March, depending on the system.</p>
      <p><strong>Can I find the age difference between two people?</strong> Yes — subtract the two birth dates the same way.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
