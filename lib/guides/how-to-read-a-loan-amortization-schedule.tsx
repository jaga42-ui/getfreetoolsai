import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-read-a-loan-amortization-schedule",
  category: "calculator",
  title: "How to Read a Loan Amortization Schedule (With Example)",
  description:
    "See where every rupee of a loan payment goes — how an amortization schedule splits each instalment into interest and principal.",
  keywords:
    "loan amortization schedule, how amortization works, principal vs interest, loan repayment schedule, total interest on a loan, amortization example, loan calculator",
  excerpt:
    "How each loan payment splits into interest and principal, why prepaying early saves the most, and the true total cost.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 5,
  tags: ["loan", "amortization", "personal finance"],
  relatedTools: ["/calculators/loan", "/calculators/emi", "/calculators/compound-interest"],
  relatedGuides: ["how-to-calculate-sip-returns"],
  toc: [
    { id: "what", label: "What amortization means" },
    { id: "split", label: "The interest/principal split" },
    { id: "example", label: "Worked example" },
    { id: "prepay", label: "Why prepaying early wins" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Your loan instalment is the same every month, but what it&apos;s{" "}
        <em>made of</em> changes completely over time. An amortization schedule is
        the month-by-month table showing how each payment splits between interest
        and principal. Reading it tells you the real cost of borrowing and where
        prepayments do the most good. The free{" "}
        <Link href="/calculators/loan">loan calculator</Link> builds the full
        schedule for you.
      </p>

      <h2 id="what">What &ldquo;amortization&rdquo; means</h2>
      <p>
        Amortizing a loan means paying it off in equal instalments over a fixed
        term, so the balance reaches exactly zero on the last payment. Interest is
        always charged on the <em>outstanding</em> balance, which shrinks each
        month — so even though the payment is fixed, the interest portion falls and
        the principal portion rises as you go.
      </p>

      <h2 id="split">The interest/principal split</h2>
      <p>
        Each month: interest = current balance × monthly rate; the rest of the
        payment reduces the principal. Early on the balance is large, so most of
        the payment is interest and barely any touches the principal. Near the end
        the balance is tiny, so almost the whole payment is principal.
      </p>

      <h2 id="example">Worked example</h2>
      <p>
        <em>A ₹5,00,000 loan at 10% for 5 years — EMI ≈ ₹10,624:</em>
      </p>
      <table>
        <tbody>
          <tr><td><strong>Month</strong></td><td><strong>Interest</strong></td><td><strong>Principal</strong></td></tr>
          <tr><td>1</td><td>₹4,167</td><td>₹6,457</td></tr>
          <tr><td>30 (halfway)</td><td>₹2,371</td><td>₹8,253</td></tr>
          <tr><td>60 (last)</td><td>₹88</td><td>₹10,536</td></tr>
        </tbody>
      </table>
      <p>
        Same ₹10,624 payment throughout, but the interest share collapses from
        ₹4,167 to almost nothing. Total interest over the loan ≈ ₹1,37,440 on top
        of the ₹5,00,000 borrowed.
      </p>

      <h2 id="prepay">Why prepaying early saves the most</h2>
      <p>
        A prepayment goes straight to principal, which permanently removes all the
        future interest that balance would have generated. Because early balances
        are largest, a prepayment in year 1 wipes out far more interest than the
        same amount in year 4. If your loan allows penalty-free part-prepayments,
        the earlier the better. The{" "}
        <Link href="/calculators/emi">EMI calculator</Link> covers the payment
        formula itself, and{" "}
        <Link href="/calculators/compound-interest">compound interest</Link> shows
        the mirror image — how balances grow when they&apos;re working for you.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Why is my early payment almost all interest?</strong> Interest is charged on the outstanding balance, which is highest at the start.</p>
      <p><strong>Does a longer tenure cost more?</strong> Yes — a lower monthly payment but more total interest, because you borrow for longer.</p>
      <p><strong>When should I prepay?</strong> As early as possible — early prepayments cancel the most future interest.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
