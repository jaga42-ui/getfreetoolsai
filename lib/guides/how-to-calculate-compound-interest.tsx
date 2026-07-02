import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-compound-interest",
  category: "calculator",
  title: "How to Calculate Compound Interest (Formula & Example)",
  description:
    "Understand how compound interest works — the formula, a worked example, how compounding frequency changes the result, and the difference from simple interest — with a free calculator.",
  keywords:
    "how to calculate compound interest, compound interest formula, compound interest example, compounding frequency, compound vs simple interest, compound interest calculator",
  excerpt:
    "The compound interest formula, a worked ₹1-lakh example, and why compounding frequency and time do the heavy lifting.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 6,
  tags: ["compound interest", "investing", "personal finance"],
  relatedTools: ["/calculators/compound-interest", "/calculators/sip", "/calculators/emi"],
  relatedGuides: ["how-to-calculate-sip-returns"],
  toc: [
    { id: "what", label: "What compound interest is" },
    { id: "formula", label: "The formula" },
    { id: "example", label: "Worked example" },
    { id: "frequency", label: "Why frequency matters" },
    { id: "vs-simple", label: "Compound vs simple interest" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Compound interest is interest earning interest. Instead of paying out each
        period, the interest is added to your balance so the next period&apos;s
        interest is calculated on a bigger number. Over time that snowball becomes
        the single most powerful force in personal finance. This guide shows the
        formula, a worked example, and the two levers that matter most — with a
        free <Link href="/calculators/compound-interest">compound interest
        calculator</Link> to run your own numbers.
      </p>

      <h2 id="what">What compound interest is</h2>
      <p>
        With <strong>simple</strong> interest you earn the same amount every year,
        because it&apos;s always calculated on the original principal. With{" "}
        <strong>compound</strong> interest, each year&apos;s interest is added to
        the balance, so next year you earn interest on the interest too. The gap
        between the two starts small and grows dramatically the longer you leave it.
      </p>

      <h2 id="formula">The compound interest formula</h2>
      <p>
        <strong>A = P × (1 + r ÷ n)<sup>n × t</sup></strong>
      </p>
      <ul>
        <li><strong>A</strong> = final amount (principal + interest)</li>
        <li><strong>P</strong> = principal (starting amount)</li>
        <li><strong>r</strong> = annual interest rate as a decimal (8% = 0.08)</li>
        <li><strong>n</strong> = times interest compounds per year</li>
        <li><strong>t</strong> = number of years</li>
      </ul>
      <p>The interest earned is simply <strong>A − P</strong>.</p>

      <h2 id="example">Worked example</h2>
      <p>
        <em>₹1,00,000 at 8% for 10 years, compounded annually (n = 1):</em>
      </p>
      <table>
        <tbody>
          <tr><td>Principal (P)</td><td>₹1,00,000</td></tr>
          <tr><td>Rate (r)</td><td>0.08</td></tr>
          <tr><td>Years (t)</td><td>10</td></tr>
          <tr><td>Final amount (A)</td><td>1,00,000 × 1.08¹⁰ ≈ <strong>₹2,15,892</strong></td></tr>
          <tr><td>Interest earned</td><td>≈ ₹1,15,892</td></tr>
        </tbody>
      </table>
      <p>
        Your money more than doubles without you adding a rupee. Simple interest
        at the same rate would earn only ₹80,000 — compounding adds an extra
        ₹35,892 purely from interest-on-interest.
      </p>

      <h2 id="frequency">Why compounding frequency matters</h2>
      <p>
        The more often interest compounds, the more you earn, because interest
        starts earning sooner. On the same ₹1,00,000 at 8% for 10 years:
      </p>
      <ul>
        <li><strong>Annually</strong> (n = 1) → ≈ ₹2,15,892</li>
        <li><strong>Quarterly</strong> (n = 4) → ≈ ₹2,20,804</li>
        <li><strong>Monthly</strong> (n = 12) → ≈ ₹2,21,964</li>
      </ul>
      <p>
        The jumps shrink as frequency rises, but more frequent compounding always
        wins. It&apos;s why the same &ldquo;8%&rdquo; can mean different real
        returns depending on the fine print.
      </p>

      <h2 id="vs-simple">Compound vs simple interest</h2>
      <p>
        Compounding rewards <em>time</em> above all. Doubling the years far more
        than doubles the interest, because the later years grow the largest
        balances. This is exactly why starting to invest early beats investing more
        later — the same logic that powers a{" "}
        <Link href="/calculators/sip">SIP</Link>, where each monthly instalment
        compounds until you withdraw.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s the difference from simple interest?</strong> Simple interest is always on the original principal; compound interest is on the growing balance, so it accelerates over time.</p>
      <p><strong>Does compounding frequency change the result?</strong> Yes — monthly compounding beats annual at the same rate, though the extra gain shrinks at higher frequencies.</p>
      <p><strong>How can I double my money?</strong> Roughly, divide 72 by the interest rate for the years to double (the &ldquo;Rule of 72&rdquo;) — 8% ≈ 9 years.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs entirely in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
