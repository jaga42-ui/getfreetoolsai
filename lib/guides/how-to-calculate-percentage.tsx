import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-percentage",
  category: "calculator",
  title: "How to Calculate a Percentage (Formulas & Examples)",
  description:
    "Learn how to calculate a percentage of a number, what percent one number is of another, and percentage increase or decrease — with simple formulas, worked examples and a free calculator.",
  keywords:
    "how to calculate percentage, percentage formula, percent of a number, percentage increase, percentage decrease, what percent is, percentage change calculator",
  excerpt:
    "The three percentage formulas everyone needs — percent of a number, one number as a percent of another, and percentage change — with worked examples.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 5,
  tags: ["percentage", "maths", "everyday"],
  relatedTools: ["/calculators/percentage", "/calculators/discount", "/calculators/gst"],
  relatedGuides: ["how-to-calculate-gst", "how-to-calculate-sip-returns"],
  toc: [
    { id: "basics", label: "What a percentage is" },
    { id: "of", label: "Percentage of a number" },
    { id: "whatpercent", label: "What percent one number is of another" },
    { id: "change", label: "Percentage increase and decrease" },
    { id: "tips", label: "Quick mental tricks" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        &ldquo;Percent&rdquo; simply means &ldquo;out of 100&rdquo;, so 25% is 25
        out of 100, or 0.25. Almost every real percentage question is one of three
        types, and each has a one-line formula. This guide covers all three with
        worked examples, and the free{" "}
        <Link href="/calculators/percentage">percentage calculator</Link> does any
        of them instantly.
      </p>

      <h2 id="basics">What a percentage is</h2>
      <p>
        A percentage is just a fraction with 100 on the bottom. To turn a percent
        into a number you can calculate with, divide by 100: 40% = 40 ÷ 100 =
        0.40. To turn a decimal back into a percent, multiply by 100: 0.40 → 40%.
        Everything below builds on that one idea.
      </p>

      <h2 id="of">1. Percentage of a number</h2>
      <p>
        <strong>Result = (percent ÷ 100) × number</strong>
      </p>
      <p>
        <em>Example — what is 15% of 240?</em> 15 ÷ 100 = 0.15, then 0.15 × 240 ={" "}
        <strong>36</strong>. This is the one you use for a 15% tip, 18% GST, or 20%
        off a price.
      </p>

      <h2 id="whatpercent">2. What percent one number is of another</h2>
      <p>
        <strong>Percent = (part ÷ whole) × 100</strong>
      </p>
      <p>
        <em>Example — 37 out of 50 marks is what percent?</em> 37 ÷ 50 = 0.74, ×
        100 = <strong>74%</strong>. Use this for test scores, completion rates, or
        &ldquo;how much of my target have I hit?&rdquo;
      </p>

      <h2 id="change">3. Percentage increase and decrease</h2>
      <p>
        <strong>Change % = ((new − old) ÷ old) × 100</strong>
      </p>
      <p>
        <em>Example — a price rises from ₹800 to ₹1,000.</em> (1000 − 800) ÷ 800 =
        0.25, × 100 = <strong>25% increase</strong>. If it fell from ₹1,000 to
        ₹800 instead: (800 − 1000) ÷ 1000 = −0.20 = a <strong>20% decrease</strong>.
        Note the same ₹200 gap is a different percentage each way, because the
        starting number changed.
      </p>

      <h2 id="tips">Quick mental tricks</h2>
      <ul>
        <li><strong>10%</strong> — just move the decimal one place: 10% of 340 = 34.</li>
        <li><strong>5%</strong> — half of 10%: 5% of 340 = 17.</li>
        <li><strong>1%</strong> — move the decimal two places: 1% of 340 = 3.4.</li>
        <li><strong>x% of y = y% of x</strong> — 18% of 50 is the same as 50% of 18 = 9. Often one side is far easier.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I find a percentage of a number fast?</strong> Divide the percent by 100 and multiply by the number — or use the 10% / 1% tricks above.</p>
      <p><strong>How do I calculate percentage change?</strong> Subtract old from new, divide by the old value, then multiply by 100.</p>
      <p><strong>Is a 20% rise cancelled by a 20% fall?</strong> No — because the base changes, they don&apos;t cancel. ₹100 up 20% is ₹120; down 20% from ₹120 is ₹96.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs entirely in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
