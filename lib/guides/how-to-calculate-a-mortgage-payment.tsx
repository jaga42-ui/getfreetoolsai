import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-a-mortgage-payment",
  category: "calculator",
  title: "How to Calculate a Mortgage Payment (PITI) — Formula & Example",
  description:
    "Learn how to calculate a monthly mortgage payment — principal, interest, taxes, insurance and PMI — with the exact formula, a worked example, and a free calculator.",
  keywords:
    "how to calculate mortgage payment, mortgage payment formula, piti, how is mortgage calculated, monthly mortgage payment formula, mortgage math",
  excerpt:
    "The formula behind your monthly mortgage payment, what PITI means, and a worked $400k example.",
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  authorId: "team",
  readingTime: 6,
  tags: ["mortgage", "home loan", "piti", "finance"],
  relatedTools: ["/calculators/mortgage", "/calculators/auto-loan", "/calculators/loan"],
  relatedGuides: ["how-to-calculate-emi", "how-to-read-a-loan-amortization-schedule"],
  toc: [
    { id: "piti", label: "What makes up a payment (PITI)" },
    { id: "formula", label: "The principal & interest formula" },
    { id: "example", label: "Worked example" },
    { id: "extras", label: "Taxes, insurance & PMI" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Your monthly mortgage payment is more than just paying back the loan.
        Most of it is principal and interest, but taxes, insurance and — if your
        down payment is small — mortgage insurance ride along too. Here&apos;s
        exactly how each part is calculated, with a worked example. The free{" "}
        <Link href="/calculators/mortgage">mortgage calculator</Link> does it all
        instantly.
      </p>

      <h2 id="piti">What makes up a payment (PITI)</h2>
      <p>
        Lenders describe a payment with the acronym <strong>PITI</strong>:
      </p>
      <ul>
        <li><strong>Principal</strong> — the portion that pays down the loan balance.</li>
        <li><strong>Interest</strong> — the lender&apos;s charge on the outstanding balance.</li>
        <li><strong>Taxes</strong> — property tax, usually collected monthly into escrow.</li>
        <li><strong>Insurance</strong> — homeowner&apos;s insurance, plus PMI if applicable.</li>
      </ul>
      <p>
        Homeowners-association (HOA) dues, where they apply, are on top of PITI.
      </p>

      <h2 id="formula">The principal &amp; interest formula</h2>
      <p>
        Principal and interest use the standard amortized-loan formula:
      </p>
      <p>
        <strong>M = P × r(1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
      </p>
      <p>
        where <strong>P</strong> is the loan amount (home price minus down
        payment), <strong>r</strong> is the monthly interest rate (annual APR ÷
        12 ÷ 100), and <strong>n</strong> is the number of monthly payments (years
        × 12). The payment stays level for the life of the loan; early on most of
        it is interest, and over time more goes to principal.
      </p>

      <h2 id="example">Worked example</h2>
      <p>
        <em>A $400,000 home, 20% down, 30-year loan at 6.5%.</em>
      </p>
      <ul>
        <li>Loan amount P = 400,000 − 80,000 = <strong>$320,000</strong></li>
        <li>Monthly rate r = 6.5 ÷ 12 ÷ 100 = <strong>0.005417</strong></li>
        <li>Payments n = 30 × 12 = <strong>360</strong></li>
      </ul>
      <p>
        Plugging in gives a principal &amp; interest payment of about{" "}
        <strong>$2,023</strong> a month. Over 360 months that&apos;s roughly{" "}
        <strong>$728,000</strong> paid in total — about <strong>$408,000</strong>{" "}
        of it interest.
      </p>

      <h2 id="extras">Taxes, insurance &amp; PMI</h2>
      <p>
        Add the monthly share of each yearly cost:
      </p>
      <ul>
        <li><strong>Property tax:</strong> annual tax ÷ 12. On our example, $4,800/yr ≈ $400/mo.</li>
        <li><strong>Home insurance:</strong> annual premium ÷ 12. Say $1,800/yr ≈ $150/mo.</li>
        <li><strong>PMI:</strong> charged while your down payment is under 20%, typically 0.3%–1.5% of the loan per year ÷ 12. At 20% down there&apos;s no PMI.</li>
      </ul>
      <p>
        So the full PITI here is roughly 2,023 + 400 + 150 ={" "}
        <strong>$2,573</strong> a month. Change any input in the{" "}
        <Link href="/calculators/mortgage">calculator</Link> and every figure
        updates live.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Why is so much of an early payment interest?</strong> Interest is charged on the outstanding balance, which is highest at the start. As the balance falls, the interest share shrinks and the principal share grows.</p>
      <p><strong>How can I lower my payment?</strong> A bigger down payment, a lower rate, or a longer term each reduce the monthly figure — though a longer term raises total interest.</p>
      <p><strong>When does PMI go away?</strong> Usually once you reach 20% equity, either through payments or rising home value; many loans let you request cancellation at that point.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
