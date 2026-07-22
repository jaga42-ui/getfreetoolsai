import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-sales-tax",
  category: "calculator",
  title: "How to Calculate Sales Tax (Add & Remove) — Formula & Examples",
  description:
    "Learn how to add US sales tax to a price and how to back it out of a tax-inclusive total (reverse sales tax), with the formulas, worked examples, and a free calculator.",
  keywords:
    "how to calculate sales tax, add sales tax, reverse sales tax, remove sales tax from total, sales tax formula, calculate sales tax backwards",
  excerpt:
    "How to add sales tax to a price and how to reverse it out of a total — with formulas and examples.",
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  authorId: "team",
  readingTime: 4,
  tags: ["sales tax", "tax", "shopping", "finance"],
  relatedTools: ["/calculators/sales-tax", "/calculators/discount", "/calculators/percentage"],
  relatedGuides: ["how-to-calculate-gst", "how-to-calculate-a-discount"],
  toc: [
    { id: "what", label: "How US sales tax works" },
    { id: "add", label: "Adding sales tax" },
    { id: "remove", label: "Removing sales tax (reverse)" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Two sales-tax questions come up constantly: how much tax to <em>add</em>{" "}
        to a price, and how to <em>back out</em> the tax from a total that already
        includes it. Both are short formulas, shown below with examples. The free{" "}
        <Link href="/calculators/sales-tax">sales tax calculator</Link> does either
        instantly.
      </p>

      <h2 id="what">How US sales tax works</h2>
      <p>
        The United States has no national sales tax. Instead, states, counties and
        cities each set their own rates, so the <strong>combined rate</strong> at
        the register varies by location — from 0% in a handful of states to over
        10% in some cities. Always use the combined rate for wherever the sale
        happens.
      </p>

      <h2 id="add">Adding sales tax to a price</h2>
      <p>
        <strong>Tax = price × (rate ÷ 100)</strong>
        <br />
        <strong>Total = price + tax</strong>
      </p>
      <p>
        <em>Example — a $100 item at 7.25%.</em> Tax = 100 × 0.0725 ={" "}
        <strong>$7.25</strong>, so the total is 100 + 7.25 ={" "}
        <strong>$107.25</strong>.
      </p>

      <h2 id="remove">Removing sales tax from a total (reverse)</h2>
      <p>
        If you only know the tax-inclusive total and want the pre-tax price, you
        can&apos;t just subtract the percentage of the total — that overcounts.
        Divide instead:
      </p>
      <p>
        <strong>Pre-tax price = total ÷ (1 + rate ÷ 100)</strong>
        <br />
        <strong>Tax = total − pre-tax price</strong>
      </p>
      <p>
        <em>Example — $107.25 including 7.25% tax.</em> Pre-tax = 107.25 ÷ 1.0725 ={" "}
        <strong>$100</strong>, so the tax portion is 107.25 − 100 ={" "}
        <strong>$7.25</strong>. Notice 7.25% of $107.25 would be $7.78 — the wrong
        answer, which is exactly why you divide rather than multiply.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I find the pre-tax price from a receipt total?</strong> Divide the total by (1 + rate ÷ 100). At 7.25%, divide by 1.0725.</p>
      <p><strong>Why can&apos;t I just subtract 7.25%?</strong> Because 7.25% of the inclusive total is larger than the actual tax — the tax was charged on the smaller pre-tax price, not the total.</p>
      <p><strong>What rate should I enter?</strong> The combined state + county + city rate for the location of the sale. A quick search for your ZIP code&apos;s sales tax rate gives the figure.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
