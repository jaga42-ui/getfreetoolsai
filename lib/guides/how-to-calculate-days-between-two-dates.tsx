import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-days-between-two-dates",
  category: "calculator",
  title: "How to Calculate the Days Between Two Dates",
  description:
    "Count the exact number of days between two dates — the manual approach, why inclusive vs exclusive counting trips people up, working days, and a free date calculator.",
  keywords:
    "how to calculate days between two dates, days between dates, date difference, number of days calculator, count days, working days between dates, date calculator",
  excerpt:
    "Count days between two dates accurately — including the inclusive/exclusive trap and how to count only working days.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 4,
  tags: ["dates", "days between", "everyday"],
  relatedTools: ["/calculators/date", "/calculators/age", "/calculators/emi"],
  relatedGuides: [],
  toc: [
    { id: "method", label: "The counting method" },
    { id: "inclusive", label: "Inclusive vs exclusive" },
    { id: "working", label: "Counting working days" },
    { id: "uses", label: "Where it's used" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Counting days between two dates sounds like simple subtraction, but months
        of different lengths, leap years, and the &ldquo;do I count both ends?&rdquo;
        question all conspire to give you an off-by-one answer. Here&apos;s how to do
        it right, plus a free{" "}
        <Link href="/calculators/date">date calculator</Link> that removes the
        guesswork.
      </p>

      <h2 id="method">The counting method</h2>
      <p>
        The reliable way is to count whole months between the dates, convert to days
        using each month&apos;s actual length, then add the leftover days — remembering
        February has 29 days in a leap year. Because that&apos;s fiddly by hand, most
        people either count on a calendar or let a tool do it. A leap year is any
        year divisible by 4, except century years not divisible by 400 (so 2000 was
        a leap year, 1900 wasn&apos;t).
      </p>

      <h2 id="inclusive">Inclusive vs exclusive: the off-by-one trap</h2>
      <p>
        The single biggest source of confusion. From 1 March to 5 March:
      </p>
      <ul>
        <li><strong>Exclusive</strong> (the gap between them) = <strong>4 days</strong>.</li>
        <li><strong>Inclusive</strong> (counting both the start and end day) = <strong>5 days</strong>.</li>
      </ul>
      <p>
        Neither is &ldquo;wrong&rdquo; — it depends on the question. A hotel stay
        counts nights (exclusive); an event lasting &ldquo;from Monday to Friday&rdquo;
        counts days (inclusive). Always decide which you mean before you count.
      </p>

      <h2 id="working">Counting only working days</h2>
      <p>
        For deadlines and delivery estimates you often want business days, not
        calendar days — excluding weekends and public holidays. A rough rule: total
        days × 5/7 approximates working days, but holidays make an exact count worth
        using a tool for. The{" "}
        <Link href="/calculators/date">date calculator</Link> can count the plain gap;
        subtract known holidays for a true working-day figure.
      </p>

      <h2 id="uses">Where it&apos;s used</h2>
      <p>
        Notice periods, project deadlines, loan and interest periods, visa durations,
        countdowns to an event, and age gaps. For an exact age in years, months and
        days from a birth date, use the{" "}
        <Link href="/calculators/age">age calculator</Link> instead.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Should I count both the start and end date?</strong> Only if you want an inclusive count. For the gap between them, count exclusively.</p>
      <p><strong>How do leap years affect it?</strong> They add a day (29 Feb) to any span crossing that date, so a good tool accounts for them automatically.</p>
      <p><strong>How do I count working days?</strong> Exclude weekends and holidays from the total; roughly 5 of every 7 days.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
