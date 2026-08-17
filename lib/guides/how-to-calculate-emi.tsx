import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-emi",
  category: "calculator",
  title: "How to Calculate EMI (Formula, Example & Free Calculator)",
  description:
    "How loan EMI is calculated — the exact formula, a worked ₹10-lakh home-loan example, and how tenure and rate change the interest you pay.",
  keywords:
    "how to calculate emi, emi calculation formula, emi formula, loan emi calculation, calculate emi for home loan, emi example, reducing balance emi",
  excerpt:
    "The EMI formula explained, a worked ₹10-lakh loan example, and how rate and tenure change what you really pay.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 6,
  tags: ["emi", "loans", "personal finance"],
  relatedTools: ["/calculators/emi", "/calculators/loan", "/calculators/compound-interest"],
  relatedGuides: ["how-to-calculate-sip-returns"],
  toc: [
    { id: "what", label: "What an EMI is" },
    { id: "formula", label: "The EMI formula" },
    { id: "example", label: "Worked example" },
    { id: "factors", label: "What changes your EMI" },
    { id: "interest", label: "How much goes to interest" },
    { id: "tips", label: "Tips to pay less" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        An <strong>EMI (Equated Monthly Instalment)</strong> is the fixed amount
        you pay a lender every month until a loan is cleared. Each EMI covers part
        interest and part principal, and while the total stays the same, that
        split shifts every month. This guide shows exactly how EMI is calculated,
        with a worked example you can reproduce, plus a free{" "}
        <Link href="/calculators/emi">EMI calculator</Link> that does it instantly.
      </p>

      <h2 id="what">What an EMI is</h2>
      <p>
        When you borrow — a home loan, car loan or personal loan — the lender
        spreads repayment across a fixed number of months. Every month you pay the
        same EMI. Early on, most of it is interest on the outstanding balance;
        later, as the balance falls, more of each payment goes to principal. This
        is the <strong>reducing-balance</strong> method used by virtually all
        modern loans.
      </p>

      <h2 id="formula">The EMI formula</h2>
      <p>EMI is calculated with this standard formula:</p>
      <p>
        <strong>EMI = P × r × (1 + r)ⁿ ÷ ( (1 + r)ⁿ − 1 )</strong>
      </p>
      <ul>
        <li><strong>P</strong> = principal (the amount borrowed)</li>
        <li><strong>r</strong> = monthly interest rate = annual rate ÷ 12 ÷ 100</li>
        <li><strong>n</strong> = loan tenure in months</li>
      </ul>
      <p>
        The <code>(1 + r)ⁿ</code> terms are compounding at work — the same maths
        that grows a <Link href="/calculators/sip">SIP</Link>, only here it&apos;s
        working out what fixed payment clears the balance in exactly n months.
      </p>

      <h2 id="example">Worked example</h2>
      <p>
        Suppose you borrow <strong>₹10,00,000 for 20 years</strong> at{" "}
        <strong>9% annual interest</strong>:
      </p>
      <table>
        <tbody>
          <tr><td>Principal (P)</td><td>₹10,00,000</td></tr>
          <tr><td>Monthly rate (r)</td><td>9 ÷ 12 ÷ 100 = 0.0075</td></tr>
          <tr><td>Months (n)</td><td>240</td></tr>
          <tr><td>Monthly EMI</td><td>≈ ₹8,997</td></tr>
          <tr><td>Total paid over 20 years</td><td>≈ ₹21,59,280</td></tr>
          <tr><td>Total interest</td><td>≈ ₹11,59,280</td></tr>
        </tbody>
      </table>
      <p>
        You borrow ₹10 lakh but repay roughly ₹21.6 lakh — the extra ₹11.6 lakh is
        interest. Change any input in the{" "}
        <Link href="/calculators/emi">EMI calculator</Link> and it recomputes the
        EMI, the total interest and the full month-by-month schedule instantly.
      </p>

      <h2 id="factors">What changes your EMI</h2>
      <ul>
        <li>
          <strong>Interest rate</strong> — even a 0.5% difference on a long loan
          changes the total interest by lakhs. Always compare rates.
        </li>
        <li>
          <strong>Tenure</strong> — a longer tenure lowers the monthly EMI but{" "}
          <em>raises</em> total interest, because you borrow for longer.
        </li>
        <li>
          <strong>Principal</strong> — a bigger down payment means a smaller loan
          and a smaller EMI.
        </li>
      </ul>

      <h2 id="interest">How much of each EMI is interest?</h2>
      <p>
        In the example&apos;s first month, interest is ₹10,00,000 × 0.0075 =
        ₹7,500 — so of the ₹8,997 EMI, only about ₹1,497 reduces the principal.
        By the final year almost the whole EMI goes to principal. This is why
        paying extra early, when interest dominates, saves the most. The{" "}
        <Link href="/calculators/loan">loan calculator</Link> shows the full
        amortisation split.
      </p>

      <h2 id="tips">Tips to pay less interest</h2>
      <ul>
        <li><strong>Choose the shortest tenure you can afford</strong> — it cuts total interest sharply.</li>
        <li><strong>Make part-prepayments early</strong> — they attack the principal while interest is highest.</li>
        <li><strong>Compare rates before signing</strong> — a lower rate beats almost any other trick.</li>
        <li><strong>Increase your down payment</strong> — borrowing less is the simplest saving of all.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is EMI calculated on reducing balance?</strong> Yes — standard loans charge interest only on the outstanding balance, which falls each month.</p>
      <p><strong>Does a longer tenure save money?</strong> It lowers the monthly EMI but increases total interest paid over the life of the loan.</p>
      <p><strong>Can I calculate EMI for any loan?</strong> Yes — the same formula works for home, car, personal and education loans.</p>
      <p><strong>Is my data private?</strong> Yes — every calculation runs in your browser and nothing is stored or uploaded.</p>
    </>
  ),
};

export default guide;
