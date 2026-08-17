import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-daily-calorie-needs",
  category: "calculator",
  title: "How to Calculate Your Daily Calorie Needs (BMR & TDEE)",
  description:
    "How to calculate the calories you burn a day — BMR and TDEE via the Mifflin-St Jeor formula — with an example and targets for losing or gaining.",
  keywords:
    "how to calculate daily calorie needs, tdee calculation, bmr formula, mifflin st jeor, calories to lose weight, maintenance calories, calorie calculator",
  excerpt:
    "Work out your BMR and TDEE with the Mifflin-St Jeor formula, then set calories for cutting, maintaining or gaining.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 6,
  tags: ["calories", "tdee", "health"],
  relatedTools: ["/calculators/calorie", "/calculators/bmi", "/calculators/percentage"],
  relatedGuides: [],
  toc: [
    { id: "bmr", label: "Step 1: your BMR" },
    { id: "tdee", label: "Step 2: your TDEE" },
    { id: "example", label: "Worked example" },
    { id: "goals", label: "Setting calories for a goal" },
    { id: "notes", label: "Important caveats" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Every diet plan starts with one number: how many calories you burn in a
        day. Get that right and losing, maintaining or gaining weight becomes
        simple arithmetic. It&apos;s a two-step calculation — your resting burn
        (BMR), then your total daily burn (TDEE) once activity is added. This guide
        walks through both with a worked example, and the free{" "}
        <Link href="/calculators/calorie">calorie calculator</Link> does the maths
        for you.
      </p>

      <h2 id="bmr">Step 1: Basal Metabolic Rate (BMR)</h2>
      <p>
        Your <strong>BMR</strong> is the energy your body uses at complete rest —
        just breathing, circulating blood and staying alive. The widely used{" "}
        <strong>Mifflin-St Jeor</strong> formula is:
      </p>
      <p>
        <strong>Men:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 ×
        age + 5
      </p>
      <p>
        <strong>Women:</strong> BMR = 10 × weight(kg) + 6.25 × height(cm) − 5 ×
        age − 161
      </p>

      <h2 id="tdee">Step 2: Total Daily Energy Expenditure (TDEE)</h2>
      <p>
        Nobody rests all day, so multiply BMR by an <strong>activity factor</strong>{" "}
        to get TDEE — the calories you actually burn:
      </p>
      <ul>
        <li><strong>Sedentary</strong> (little exercise) → BMR × 1.2</li>
        <li><strong>Lightly active</strong> (1–3 days/week) → BMR × 1.375</li>
        <li><strong>Moderately active</strong> (3–5 days/week) → BMR × 1.55</li>
        <li><strong>Very active</strong> (6–7 days/week) → BMR × 1.725</li>
        <li><strong>Extremely active</strong> (hard training/physical job) → BMR × 1.9</li>
      </ul>

      <h2 id="example">Worked example</h2>
      <p><em>A 30-year-old woman, 65&nbsp;kg, 165&nbsp;cm, moderately active:</em></p>
      <table>
        <tbody>
          <tr><td>BMR</td><td>10×65 + 6.25×165 − 5×30 − 161 = <strong>1,370 kcal</strong></td></tr>
          <tr><td>TDEE (×1.55)</td><td>1,370 × 1.55 ≈ <strong>2,124 kcal/day</strong></td></tr>
        </tbody>
      </table>
      <p>She burns roughly 2,124 calories a day — her maintenance level.</p>

      <h2 id="goals">Setting calories for your goal</h2>
      <ul>
        <li>
          <strong>Lose weight</strong> — eat below TDEE. A deficit of ~500 kcal/day
          targets about 0.5&nbsp;kg of fat loss a week.
        </li>
        <li>
          <strong>Maintain</strong> — eat at your TDEE.
        </li>
        <li>
          <strong>Gain</strong> — eat above TDEE. A surplus of ~250–500 kcal/day
          supports lean gain without excess fat.
        </li>
      </ul>
      <p>
        Since 1&nbsp;kg of fat is roughly 7,700 kcal, a steady daily deficit is
        what drives change — crash deficits mostly backfire.
      </p>

      <h2 id="notes">Important caveats</h2>
      <p>
        These formulas are estimates, not lab measurements — real metabolism
        varies with genetics, muscle mass and hormones. Use the number as a
        starting point, track your weight over 2–3 weeks, and adjust based on what
        actually happens. For a quick weight-for-height screen, see the{" "}
        <Link href="/calculators/bmi">BMI calculator</Link>. Consult a professional
        before big dietary changes.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s the difference between BMR and TDEE?</strong> BMR is calories burned at rest; TDEE is BMR plus everything you do in a day.</p>
      <p><strong>How many calories to lose weight?</strong> Eat about 500 below your TDEE for roughly 0.5&nbsp;kg loss per week.</p>
      <p><strong>Which formula is best?</strong> Mifflin-St Jeor is currently the most accurate general formula for most people.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
