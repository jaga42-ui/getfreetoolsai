import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-bmi",
  category: "calculator",
  title: "How to Calculate BMI (Formula, Example & Categories)",
  description:
    "How to calculate BMI in metric and imperial units, what the WHO weight categories mean, and the important limits of BMI — with a free calculator.",
  keywords:
    "how to calculate bmi, bmi formula, body mass index calculation, bmi categories, calculate bmi metric imperial, bmi example, what is a healthy bmi",
  excerpt:
    "The BMI formula in metric and imperial, a worked example, the WHO categories, and where BMI falls short.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 5,
  tags: ["bmi", "health", "fitness"],
  relatedTools: ["/calculators/bmi", "/calculators/calorie", "/calculators/percentage"],
  relatedGuides: ["how-to-calculate-percentage"],
  toc: [
    { id: "what", label: "What BMI is" },
    { id: "formula", label: "The BMI formula" },
    { id: "example", label: "Worked example" },
    { id: "categories", label: "BMI categories" },
    { id: "limits", label: "The limits of BMI" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        <strong>BMI (Body Mass Index)</strong> is a quick screening number that
        relates your weight to your height. It won&apos;t tell you everything about
        your health, but it&apos;s a useful first check that health services use
        worldwide. This guide shows the formula in both metric and imperial units,
        a worked example, and what the result actually means — and the free{" "}
        <Link href="/calculators/bmi">BMI calculator</Link> does the maths for you.
      </p>

      <h2 id="what">What BMI is</h2>
      <p>
        BMI estimates whether you&apos;re a healthy weight for your height by
        dividing your weight by the square of your height. It&apos;s the same
        formula for adults of any age or sex, which makes it a simple, consistent
        screening tool — but also one with real limits (see below).
      </p>

      <h2 id="formula">The BMI formula</h2>
      <p>
        <strong>Metric:</strong> BMI = weight (kg) ÷ height (m)²
      </p>
      <p>
        <strong>Imperial:</strong> BMI = 703 × weight (lb) ÷ height (in)²
      </p>
      <p>
        The 703 factor just converts pounds-and-inches into the same scale as the
        metric version, so both give the same BMI number.
      </p>

      <h2 id="example">Worked example</h2>
      <p>
        <em>Someone 1.75&nbsp;m tall weighing 70&nbsp;kg:</em>
      </p>
      <table>
        <tbody>
          <tr><td>Height squared</td><td>1.75 × 1.75 = 3.0625</td></tr>
          <tr><td>BMI</td><td>70 ÷ 3.0625 ≈ <strong>22.9</strong></td></tr>
          <tr><td>Category</td><td>Healthy weight (18.5–24.9)</td></tr>
        </tbody>
      </table>
      <p>
        The same person in imperial (5&nbsp;ft 9&nbsp;in ≈ 69&nbsp;in,
        154&nbsp;lb): 703 × 154 ÷ 69² = 703 × 154 ÷ 4761 ≈ 22.7 — the same answer,
        give or take rounding.
      </p>

      <h2 id="categories">BMI categories (WHO, adults)</h2>
      <table>
        <tbody>
          <tr><td>Below 18.5</td><td>Underweight</td></tr>
          <tr><td>18.5 – 24.9</td><td>Healthy weight</td></tr>
          <tr><td>25.0 – 29.9</td><td>Overweight</td></tr>
          <tr><td>30.0 and above</td><td>Obese</td></tr>
        </tbody>
      </table>
      <p>
        Some health bodies use lower thresholds for people of South Asian
        descent, where health risks rise at a lower BMI.
      </p>

      <h2 id="limits">The limits of BMI</h2>
      <p>
        BMI only knows your height and weight — not your body composition. A
        muscular athlete can read as &ldquo;overweight&rdquo; despite low body fat,
        while someone at a &ldquo;healthy&rdquo; BMI may carry excess fat. It also
        doesn&apos;t account for age, sex, or where fat is stored. Treat BMI as a
        rough screen, not a diagnosis — pair it with waist measurement and a
        doctor&apos;s advice. To plan around energy needs, the{" "}
        <Link href="/calculators/calorie">calorie calculator</Link> estimates your
        daily maintenance calories.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What is a healthy BMI?</strong> For most adults, 18.5 to 24.9. Lower cut-offs may apply for some populations.</p>
      <p><strong>Does BMI work for athletes?</strong> Not well — extra muscle raises BMI without extra fat, so it can misclassify very muscular people.</p>
      <p><strong>Is BMI the same for men and women?</strong> The formula and adult categories are the same, though body composition differs on average.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs entirely in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
