import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-a-401k-match-works",
  category: "calculator",
  title: "How a 401(k) Employer Match Works — And Why It Matters",
  description:
    "Understand how a 401(k) employer match works, common match formulas, how to get the full match, and how compounding turns it into a large retirement balance.",
  keywords:
    "how does 401k match work, 401k employer match, 401k matching explained, 50% up to 6%, 401k match formula, how much to contribute to 401k",
  excerpt:
    "What '50% up to 6%' really means, how to capture the full match, and how it compounds over a career.",
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  authorId: "team",
  readingTime: 6,
  tags: ["401k", "retirement", "employer match", "investing"],
  relatedTools: ["/calculators/401k", "/calculators/compound-interest", "/calculators/sip"],
  relatedGuides: ["how-to-calculate-compound-interest", "how-to-calculate-sip-returns"],
  toc: [
    { id: "what", label: "What an employer match is" },
    { id: "formulas", label: "Common match formulas" },
    { id: "full", label: "Getting the full match" },
    { id: "compounding", label: "How it compounds" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A 401(k) employer match is one of the closest things to free money in
        personal finance: your employer contributes to your retirement account
        based on what you put in. Understanding the formula — and contributing
        enough to capture all of it — can add hundreds of thousands of dollars
        over a career. See it play out in the{" "}
        <Link href="/calculators/401k">401(k) calculator</Link>.
      </p>

      <h2 id="what">What an employer match is</h2>
      <p>
        When you contribute a percentage of your salary to your 401(k), many
        employers add a contribution of their own, up to a limit. It&apos;s part
        of your total compensation — but unlike salary, you only receive it if you
        contribute enough to trigger it.
      </p>

      <h2 id="formulas">Common match formulas</h2>
      <ul>
        <li>
          <strong>50% up to 6%</strong> — the employer adds 50 cents per dollar
          you contribute, on the first 6% of your salary. Contribute 6% and the
          employer adds 3% of salary.
        </li>
        <li>
          <strong>100% up to 4%</strong> — a dollar-for-dollar match on the first
          4% of salary. Contribute 4% and the employer adds 4%.
        </li>
        <li>
          <strong>Tiered</strong> — e.g. 100% on the first 3% then 50% on the next
          2%, for a maximum 4% match at a 5% contribution.
        </li>
      </ul>
      <p>
        In the calculator you enter the employer match as a percent of salary; it
        applies up to what you contribute, because an employer never matches more
        than you put in.
      </p>

      <h2 id="full">Getting the full match</h2>
      <p>
        The key rule: <strong>contribute at least enough to earn the entire
        match.</strong> If your plan matches up to 6% and you only contribute 3%,
        you&apos;re leaving half the match — real compensation — on the table.
        Raising your contribution to the match threshold is usually the
        highest-return move available, since it&apos;s an immediate, guaranteed
        addition before any market growth.
      </p>

      <h2 id="compounding">How it compounds</h2>
      <p>
        The match matters most because it compounds for decades.{" "}
        <em>Example:</em> starting at age 30 with $25,000 saved, a $70,000 salary,
        contributing 6% with a 4% match, a 7% return and 2% annual raises, the
        balance grows to roughly <strong>$1.6 million</strong> by age 65. A large
        share of that is the employer match plus the growth it earned — money you
        never would have had by contributing alone. Compare lump-sum growth in the{" "}
        <Link href="/calculators/compound-interest">compound interest calculator</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What does &quot;50% up to 6%&quot; mean?</strong> The employer matches half of what you contribute, but only on the first 6% of your salary — so the most they add is 3% of salary, and you get it by contributing 6%.</p>
      <p><strong>Is the match ever taken back?</strong> Matched funds can be subject to a vesting schedule, meaning you earn full ownership after a set number of years. Your own contributions are always 100% yours.</p>
      <p><strong>What return should I assume?</strong> Long-run stock returns have averaged around 7% after inflation, but they vary year to year. Test a range rather than trusting one number.</p>
      <p><strong>Is my data private?</strong> Yes — all projections run in your browser and nothing is uploaded.</p>
    </>
  ),
};

export default guide;
