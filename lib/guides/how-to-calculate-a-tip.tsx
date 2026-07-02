import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-a-tip",
  category: "calculator",
  title: "How to Calculate a Tip and Split the Bill (Quick Guide)",
  description:
    "Work out a 15%, 18% or 20% tip in your head, split the bill between any number of people, and handle tip-on-tax questions — with a free tip calculator.",
  keywords:
    "how to calculate a tip, tip calculator, split the bill, 20 percent tip, 15 percent tip, tip on tax, how much to tip, gratuity calculation",
  excerpt:
    "Fast mental math for a 15/18/20% tip, splitting the bill evenly, and the tip-on-tax question answered.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 3,
  tags: ["tip", "dining", "everyday"],
  relatedTools: ["/calculators/tip", "/calculators/percentage", "/calculators/discount"],
  relatedGuides: [],
  toc: [
    { id: "formula", label: "The tip formula" },
    { id: "mental", label: "Quick mental math" },
    { id: "split", label: "Splitting the bill" },
    { id: "tax", label: "Tip before or after tax?" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        The bill lands, everyone looks at each other, and someone reaches for their
        phone. Calculating a tip is simple percentage math, and splitting it is just
        division — but doing both quickly, out loud, under mild social pressure is
        the real skill. Here are the shortcuts, plus a free{" "}
        <Link href="/calculators/tip">tip calculator</Link> that also splits the bill.
      </p>

      <h2 id="formula">The tip formula</h2>
      <p>
        <strong>Tip = bill × (percent ÷ 100)</strong>, and{" "}
        <strong>total = bill + tip</strong>. A 20% tip on a ₹1,200 bill is 1,200 ×
        0.20 = ₹240, for a ₹1,440 total.
      </p>

      <h2 id="mental">Quick mental math</h2>
      <ul>
        <li><strong>10%</strong> — move the decimal one place: ₹1,200 → ₹120.</li>
        <li><strong>20%</strong> — that 10%, doubled: ₹240.</li>
        <li><strong>15%</strong> — 10% plus half of it: ₹120 + ₹60 = ₹180.</li>
        <li><strong>18%</strong> — easiest as 20% minus a touch, or just round 15–20% to a neat total.</li>
      </ul>
      <p>Rounding the final total up to a round number is the fastest real-world move.</p>

      <h2 id="split">Splitting the bill</h2>
      <p>
        Add the tip first, then divide the total by the number of people:{" "}
        <strong>per person = (bill + tip) ÷ people</strong>. A ₹1,440 total across
        4 diners is ₹360 each. For uneven splits (someone skipped dessert), work out
        each share of the bill, then add that person&apos;s proportional tip. The
        calculator handles both even and custom splits.
      </p>

      <h2 id="tax">Should you tip before or after tax?</h2>
      <p>
        Strictly, a tip rewards service, so it&apos;s calculated on the pre-tax
        food-and-drink subtotal. In practice many people just tip on the total
        because it&apos;s simpler and the difference is small. Either is fine —
        pick one and don&apos;t overthink it. The underlying math is the same
        percentage-of-a-number covered in the{" "}
        <Link href="/calculators/percentage">percentage guide</Link>.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>What&apos;s a standard tip?</strong> It varies by country — commonly 15–20% in the US, often optional or rounded elsewhere.</p>
      <p><strong>How do I split a bill with a tip?</strong> Add the tip to the bill, then divide by the number of people.</p>
      <p><strong>Tip on the pre-tax or post-tax amount?</strong> Traditionally pre-tax, but tipping on the total is common and fine.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
