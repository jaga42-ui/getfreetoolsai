import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-gst",
  category: "calculator",
  title: "How to Calculate GST (Add & Remove) — Formula & Examples",
  description:
    "Learn how to add GST to a price and how to remove GST from a GST-inclusive amount, with the exact formulas, worked examples at 18%, and a free GST calculator.",
  keywords:
    "how to calculate gst, gst calculation, add gst, remove gst, gst formula, reverse gst calculation, gst inclusive price, calculate gst amount",
  excerpt:
    "How to add GST to a price and how to back it out of a GST-inclusive amount — with formulas and 18% worked examples.",
  datePublished: "2026-07-02",
  dateModified: "2026-07-02",
  authorId: "team",
  readingTime: 5,
  tags: ["gst", "tax", "business"],
  relatedTools: ["/calculators/gst", "/calculators/percentage", "/calculators/discount"],
  relatedGuides: ["how-to-calculate-percentage", "how-to-calculate-emi"],
  toc: [
    { id: "what", label: "What GST is" },
    { id: "add", label: "Adding GST to a price" },
    { id: "remove", label: "Removing GST (reverse)" },
    { id: "split", label: "CGST and SGST split" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        GST (Goods and Services Tax) is a percentage added to the price of most
        goods and services. Two questions come up constantly: how much GST to{" "}
        <em>add</em> to a base price, and how to <em>remove</em> GST from a price
        that already includes it. Both are short formulas, shown below with
        worked examples, and the free{" "}
        <Link href="/calculators/gst">GST calculator</Link> does either instantly.
      </p>

      <h2 id="what">What GST is</h2>
      <p>
        GST is charged as a percentage of a product&apos;s taxable value — common
        slabs are 5%, 12%, 18% and 28%. A <strong>GST-exclusive</strong> price is
        the base amount before tax; a <strong>GST-inclusive</strong> price already
        has the tax baked in. Knowing which one you&apos;re starting from decides
        which formula you need.
      </p>

      <h2 id="add">Adding GST to a price</h2>
      <p>
        <strong>GST amount = base price × (rate ÷ 100)</strong>
        <br />
        <strong>Final price = base price + GST amount</strong>
      </p>
      <p>
        <em>Example — a ₹1,000 item at 18% GST.</em> GST = 1000 × 0.18 ={" "}
        <strong>₹180</strong>, so the final price is 1000 + 180 ={" "}
        <strong>₹1,180</strong>.
      </p>

      <h2 id="remove">Removing GST from an inclusive price (reverse GST)</h2>
      <p>
        If you only know the final GST-inclusive price and want the base and tax,
        you can&apos;t just take 18% of the total — that overcounts. Divide instead:
      </p>
      <p>
        <strong>Base price = inclusive price ÷ (1 + rate ÷ 100)</strong>
        <br />
        <strong>GST amount = inclusive price − base price</strong>
      </p>
      <p>
        <em>Example — ₹1,180 including 18% GST.</em> Base = 1180 ÷ 1.18 ={" "}
        <strong>₹1,000</strong>, so the GST portion is 1180 − 1000 ={" "}
        <strong>₹180</strong>. Notice 18% of ₹1,180 would be ₹212.40 — the wrong
        answer, which is exactly why you divide rather than multiply.
      </p>

      <h2 id="split">The CGST and SGST split</h2>
      <p>
        For a sale within a state, GST is split equally into{" "}
        <strong>CGST</strong> (central) and <strong>SGST</strong> (state). So 18%
        GST is 9% CGST + 9% SGST — on ₹1,000 that&apos;s ₹90 + ₹90 = ₹180. For
        inter-state sales it&apos;s a single <strong>IGST</strong> of the full 18%
        instead. The total tax is the same either way; only the split on the
        invoice differs.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How do I remove GST from a total?</strong> Divide the inclusive price by (1 + rate/100). At 18%, divide by 1.18 to get the base price.</p>
      <p><strong>Why can&apos;t I just subtract 18%?</strong> Because 18% of the inclusive total is larger than the actual tax — the tax was calculated on the smaller base, not the total.</p>
      <p><strong>What&apos;s the difference between CGST, SGST and IGST?</strong> Within a state, GST splits into equal CGST and SGST; across states it&apos;s a single IGST for the full rate.</p>
      <p><strong>Is my data private?</strong> Yes — the calculator runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
