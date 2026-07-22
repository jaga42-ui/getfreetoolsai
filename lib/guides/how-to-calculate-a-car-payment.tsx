import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-a-car-payment",
  category: "calculator",
  title: "How to Calculate a Car Payment — With Tax & Trade-In",
  description:
    "Learn how to calculate a monthly car payment, including sales tax, down payment and trade-in, with the formula, a worked example, and a free auto loan calculator.",
  keywords:
    "how to calculate car payment, car payment formula, auto loan formula, calculate monthly car payment, car loan interest calculation, car payment with trade in",
  excerpt:
    "How the amount financed and monthly car payment are worked out — tax and trade-in included.",
  datePublished: "2026-07-22",
  dateModified: "2026-07-22",
  authorId: "team",
  readingTime: 5,
  tags: ["auto loan", "car finance", "loan", "finance"],
  relatedTools: ["/calculators/auto-loan", "/calculators/mortgage", "/calculators/loan"],
  relatedGuides: ["how-to-calculate-a-mortgage-payment", "how-to-calculate-emi"],
  toc: [
    { id: "financed", label: "The amount you actually finance" },
    { id: "formula", label: "The payment formula" },
    { id: "example", label: "Worked example" },
    { id: "term", label: "Why the term matters" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A car&apos;s sticker price isn&apos;t what you borrow. Sales tax pushes
        the amount up; your down payment and trade-in bring it down. Get those
        right and the monthly payment is simple arithmetic. Here&apos;s the
        method, with a worked example and the free{" "}
        <Link href="/calculators/auto-loan">auto loan calculator</Link>.
      </p>

      <h2 id="financed">The amount you actually finance</h2>
      <p>
        Start by finding the loan amount:
      </p>
      <p>
        <strong>Amount financed = price + sales tax − down payment − trade-in</strong>
      </p>
      <p>
        In most US states, sales tax is charged on the price{" "}
        <em>after</em> subtracting the trade-in, which lowers your tax bill. A few
        states tax the full price — worth checking your state&apos;s rule, since
        it changes the total.
      </p>

      <h2 id="formula">The payment formula</h2>
      <p>
        The monthly payment uses the same amortized-loan formula as a mortgage:
      </p>
      <p>
        <strong>M = P × r(1 + r)ⁿ ÷ ((1 + r)ⁿ − 1)</strong>
      </p>
      <p>
        with <strong>P</strong> the amount financed, <strong>r</strong> the
        monthly rate (APR ÷ 12 ÷ 100), and <strong>n</strong> the term in months.
      </p>

      <h2 id="example">Worked example</h2>
      <p>
        <em>A $35,000 car, $5,000 down, no trade-in, 6% sales tax, 60 months at 7% APR.</em>
      </p>
      <ul>
        <li>Sales tax = 35,000 × 6% = <strong>$2,100</strong></li>
        <li>Amount financed = 35,000 + 2,100 − 5,000 = <strong>$32,100</strong></li>
        <li>Monthly rate r = 7 ÷ 12 ÷ 100 = <strong>0.005833</strong>, n = 60</li>
      </ul>
      <p>
        That works out to about <strong>$636</strong> a month, with roughly{" "}
        <strong>$6,050</strong> of total interest over five years.
      </p>

      <h2 id="term">Why the term matters</h2>
      <p>
        Stretching the loan lowers the monthly payment but raises the total cost.
        The same $32,100 at 7% costs about <strong>$636/mo</strong> over 60 months
        but around <strong>$550/mo</strong> over 72 months — yet you&apos;d pay
        roughly <strong>$1,400 more</strong> in interest for the longer term. Try
        both in the <Link href="/calculators/auto-loan">calculator</Link> to see
        the trade-off.
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>Is sales tax financed into the loan?</strong> Usually yes — unless you pay it up front, the tax is added to the amount financed and spread across your payments.</p>
      <p><strong>Does a trade-in lower my tax?</strong> In most states, yes: tax is charged on the price minus the trade-in value, so a trade-in reduces both the loan and the tax.</p>
      <p><strong>What&apos;s a good down payment?</strong> Many buyers aim for 10–20% to keep payments manageable and avoid owing more than the car is worth early in the loan.</p>
      <p><strong>Is my data private?</strong> Yes — everything is calculated in your browser and nothing is uploaded.</p>
    </>
  ),
};

export default guide;
