import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-in-hand-salary-from-ctc",
  category: "calculator",
  title: "How to Calculate In-Hand Salary from CTC (With Example)",
  description:
    "Why your in-hand salary is far less than your CTC — the PF, professional tax and income tax deductions — with a worked example and a calculator.",
  keywords:
    "how to calculate in hand salary from ctc, ctc to in hand salary, take home salary calculation, ctc breakup, gross vs net salary, salary calculator, in hand salary formula",
  excerpt:
    "Why your CTC and your bank credit differ — the gross-to-net breakdown with a worked example.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 6,
  tags: ["salary", "ctc", "personal finance"],
  relatedTools: ["/calculators/salary", "/calculators/emi", "/calculators/percentage"],
  relatedGuides: [],
  toc: [
    { id: "ctc", label: "What CTC really means" },
    { id: "layers", label: "CTC → gross → net" },
    { id: "deductions", label: "The deductions explained" },
    { id: "example", label: "Worked example" },
    { id: "tips", label: "How to raise your take-home" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        The number in your offer letter (CTC) and the number that hits your bank
        account are rarely the same — and the gap surprises almost everyone on
        their first payslip. CTC includes costs your employer pays{" "}
        <em>on your behalf</em> that never reach your account, plus deductions
        taken before payday. This guide breaks CTC down to in-hand salary with a
        worked example, and the free{" "}
        <Link href="/calculators/salary">salary calculator</Link> does it instantly.
      </p>

      <h2 id="ctc">What CTC really means</h2>
      <p>
        <strong>CTC (Cost to Company)</strong> is the total annual amount your
        employer spends on you — not what you take home. It bundles your salary
        with the employer&apos;s PF contribution, gratuity, insurance premiums and
        sometimes perks. Those employer-side costs inflate the headline figure
        without ever landing in your account.
      </p>

      <h2 id="layers">CTC → gross → net: three different numbers</h2>
      <ul>
        <li>
          <strong>CTC</strong> — everything the company spends, including its own
          contributions.
        </li>
        <li>
          <strong>Gross salary</strong> — CTC minus the employer&apos;s
          contributions (its PF share, gratuity). This is your salary before your
          own deductions.
        </li>
        <li>
          <strong>Net (in-hand) salary</strong> — gross minus your deductions
          (your PF, professional tax, income tax). This is what you actually
          receive.
        </li>
      </ul>

      <h2 id="deductions">The deductions explained</h2>
      <ul>
        <li>
          <strong>Provident Fund (PF)</strong> — typically 12% of basic salary,
          deducted from you (the employer adds a matching share on top of CTC).
          It&apos;s forced savings, not lost money — it&apos;s yours later.
        </li>
        <li>
          <strong>Professional tax</strong> — a small state-level tax, often
          around ₹200 a month where it applies.
        </li>
        <li>
          <strong>Income tax (TDS)</strong> — deducted monthly based on your slab
          and the regime (old vs new) you choose.
        </li>
      </ul>

      <h2 id="example">Worked example</h2>
      <p><em>A ₹12,00,000 CTC, illustrative:</em></p>
      <table>
        <tbody>
          <tr><td>CTC (annual)</td><td>₹12,00,000</td></tr>
          <tr><td>Less: employer PF &amp; gratuity</td><td>− ₹72,000</td></tr>
          <tr><td>Gross salary</td><td>₹11,28,000</td></tr>
          <tr><td>Less: employee PF</td><td>− ₹43,200</td></tr>
          <tr><td>Less: professional tax</td><td>− ₹2,400</td></tr>
          <tr><td>Less: income tax (TDS)</td><td>− ₹70,000</td></tr>
          <tr><td>Net annual (in-hand)</td><td>≈ ₹10,12,400</td></tr>
          <tr><td>Monthly in-hand</td><td>≈ ₹84,367</td></tr>
        </tbody>
      </table>
      <p>
        Exact figures depend on your salary structure and tax regime — change the
        inputs in the calculator to match your own offer.
      </p>

      <h2 id="tips">How to raise your take-home</h2>
      <ul>
        <li><strong>Compare tax regimes</strong> — the new regime&apos;s lower rates often beat the old regime once you drop most deductions.</li>
        <li><strong>Use tax-efficient allowances</strong> — HRA, LTA and standard deduction reduce taxable income where eligible.</li>
        <li><strong>Look past the headline CTC</strong> — two offers with the same CTC can have very different in-hand pay depending on structure.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Why is my in-hand so much lower than CTC?</strong> CTC includes employer contributions and perks that never reach you, plus PF and tax deducted before payday.</p>
      <p><strong>Is PF lost money?</strong> No — it&apos;s your retirement savings; you get it back with interest.</p>
      <p><strong>Does a higher CTC always mean higher take-home?</strong> Not necessarily — salary structure and tax choices matter as much as the headline number.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
