import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-a-discount",
  category: "calculator",
  title: "How to Calculate a Discount and Sale Price (With Examples)",
  description:
    "Work out a sale price fast — the discount formula, mental shortcuts, stacked discounts, and how to reverse-engineer the percentage off.",
  keywords:
    "how to calculate a discount, discount formula, sale price calculation, percentage off, calculate discount price, stacked discounts, discount calculator",
  excerpt:
    "The discount and sale-price formulas, quick mental tricks, stacked discounts, and how to find the percent off.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 4,
  tags: ["discount", "shopping", "maths"],
  relatedTools: ["/calculators/discount", "/calculators/percentage", "/calculators/gst"],
  relatedGuides: [],
  toc: [
    { id: "formula", label: "The discount formula" },
    { id: "example", label: "Worked example" },
    { id: "tricks", label: "Quick mental tricks" },
    { id: "stacked", label: "Stacked discounts" },
    { id: "reverse", label: "Finding the percent off" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Working out a sale price is one short formula — but the sneaky bits (stacked
        offers, whether tax comes before or after the discount) trip people up at
        the till. This guide covers the basics and the traps, with a free{" "}
        <Link href="/calculators/discount">discount calculator</Link> for the
        moment you&apos;re standing in the shop.
      </p>

      <h2 id="formula">The discount formula</h2>
      <p>
        <strong>Discount = original price × (percent off ÷ 100)</strong>
        <br />
        <strong>Sale price = original price − discount</strong>
      </p>
      <p>
        Or in one step: <strong>sale price = original × (1 − percent ÷ 100)</strong>.
      </p>

      <h2 id="example">Worked example</h2>
      <p><em>A ₹2,500 jacket at 30% off:</em></p>
      <table>
        <tbody>
          <tr><td>Discount</td><td>2,500 × 0.30 = <strong>₹750</strong></td></tr>
          <tr><td>Sale price</td><td>2,500 − 750 = <strong>₹1,750</strong></td></tr>
        </tbody>
      </table>
      <p>Or straight to the answer: 2,500 × 0.70 = ₹1,750.</p>

      <h2 id="tricks">Quick mental tricks</h2>
      <ul>
        <li><strong>50% off</strong> — just halve it.</li>
        <li><strong>10% off</strong> — move the decimal one place (₹2,500 → ₹250 off).</li>
        <li><strong>20% off</strong> — take 10% twice, or double 10%.</li>
        <li><strong>25% off</strong> — quarter it: divide by 4 to get the discount.</li>
        <li><strong>15% off</strong> — 10% plus half of that 10%.</li>
      </ul>

      <h2 id="stacked">Stacked discounts don&apos;t simply add</h2>
      <p>
        &ldquo;30% off, then an extra 20% off&rdquo; is <em>not</em> 50% off. The
        second discount applies to the already-reduced price: ₹2,500 → 30% off =
        ₹1,750 → 20% off that = <strong>₹1,400</strong>. That&apos;s a real saving
        of 44%, not 50%. Discounts multiply, they don&apos;t add.
      </p>

      <h2 id="reverse">Finding the percent off</h2>
      <p>
        Spotted a price drop and want the percentage? Use{" "}
        <strong>percent off = (original − sale) ÷ original × 100</strong>. A ₹2,500
        item now ₹1,750: (2,500 − 1,750) ÷ 2,500 × 100 = <strong>30%</strong>. This
        is the same percentage-change maths covered in the{" "}
        <Link href="/calculators/percentage">percentage calculator</Link>. If GST is
        added after the discount, apply it to the sale price using the{" "}
        <Link href="/calculators/gst">GST calculator</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I find the sale price?</strong> Multiply the original by (1 − percent/100). For 30% off, multiply by 0.70.</p>
      <p><strong>Do stacked discounts add up?</strong> No — the second applies to the reduced price, so 30% then 20% is 44% off, not 50%.</p>
      <p><strong>Is tax before or after the discount?</strong> Usually the discount comes first, then tax on the reduced price — but check your receipt.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
