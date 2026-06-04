import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-calculate-sip-returns",
  category: "calculator",
  title: "How to Calculate SIP Returns (With Formula & Example)",
  description:
    "Understand how SIP returns are calculated — the future-value formula, a worked ₹10,000/month example, why compounding rewards starting early, and a free SIP calculator.",
  keywords:
    "how to calculate sip returns, sip calculation formula, sip returns example, mutual fund sip calculator, future value of sip, sip maturity calculation",
  excerpt:
    "The SIP future-value formula, a worked ₹10,000/month example, and why starting early matters.",
  datePublished: "2026-06-04",
  dateModified: "2026-06-04",
  authorId: "team",
  readingTime: 6,
  tags: ["sip", "mutual funds", "investing"],
  relatedTools: ["/calculators/sip", "/calculators/compound-interest", "/calculators/emi"],
  relatedGuides: [],
  toc: [
    { id: "what", label: "What a SIP is" },
    { id: "formula", label: "The SIP returns formula" },
    { id: "example", label: "Worked example" },
    { id: "compounding", label: "Why starting early wins" },
    { id: "tips", label: "Getting more from a SIP" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        A <strong>SIP (Systematic Investment Plan)</strong> means investing a fixed amount in a
        mutual fund every month. Because each instalment is invested at a different time and keeps
        compounding until you withdraw, the maths isn&apos;t simple multiplication. This guide shows
        exactly how SIP returns are calculated, with a worked example you can reproduce.
      </p>

      <h2 id="what">What a SIP is</h2>
      <p>
        Instead of investing a lump sum once, a SIP spreads your investment across months. This
        averages your purchase price (you buy more units when prices are low, fewer when high) and
        builds discipline. Each monthly instalment then grows through compounding for the remaining
        period.
      </p>

      <h2 id="formula">The SIP returns formula</h2>
      <p>
        Because a SIP is a series of equal monthly investments that each compound, it uses the{" "}
        <strong>future value of an annuity</strong> formula:
      </p>
      <p><strong>FV = P × ( (1 + r)ⁿ − 1 ) ÷ r × (1 + r)</strong></p>
      <ul>
        <li><strong>P</strong> = monthly investment amount</li>
        <li><strong>r</strong> = monthly rate of return = annual return ÷ 12 ÷ 100</li>
        <li><strong>n</strong> = total number of monthly instalments</li>
      </ul>
      <p>The final <code>(1 + r)</code> reflects that each instalment is invested at the start of the period.</p>

      <h2 id="example">Worked example</h2>
      <p>Suppose you invest <strong>₹10,000 a month for 10 years</strong> at an assumed <strong>12% annual return</strong>:</p>
      <table>
        <tbody>
          <tr><td>Monthly amount (P)</td><td>₹10,000</td></tr>
          <tr><td>Monthly rate (r)</td><td>12 ÷ 12 ÷ 100 = 0.01</td></tr>
          <tr><td>Months (n)</td><td>120</td></tr>
          <tr><td>Total invested</td><td>₹12,00,000</td></tr>
          <tr><td>Projected maturity value</td><td>≈ ₹23,23,391</td></tr>
          <tr><td>Wealth gained</td><td>≈ ₹11,23,391</td></tr>
        </tbody>
      </table>
      <p>
        You put in ₹12 lakh; compounding turns it into roughly ₹23.2 lakh. Try your own numbers in the{" "}
        <Link href="/calculators/sip">SIP calculator</Link> — it does this instantly and shows the
        invested-vs-returns split.
      </p>

      <h2 id="compounding">Why starting early wins</h2>
      <p>
        Compounding rewards <em>time</em> more than amount. Running the same ₹10,000 SIP for 20 years
        instead of 10 doesn&apos;t just double the corpus — it grows several times larger, because each
        year&apos;s returns themselves earn returns. Starting a few years earlier often beats investing
        a bigger amount later. The{" "}
        <Link href="/calculators/compound-interest">compound interest calculator</Link> makes this
        effect easy to see.
      </p>

      <h2 id="tips">Getting more from a SIP</h2>
      <ul>
        <li><strong>Step up annually:</strong> raising your SIP as your income grows dramatically increases the final corpus.</li>
        <li><strong>Stay invested through dips:</strong> falling markets buy more units, which helps when they recover.</li>
        <li><strong>Use a realistic rate:</strong> Indian equity funds have historically returned ~10–14% long term, but returns are never guaranteed.</li>
        <li><strong>Account for inflation:</strong> a good calculator shows the real, inflation-adjusted value too.</li>
      </ul>

      <h2 id="faq">FAQ</h2>
      <p><strong>What return rate should I assume?</strong> 12% is a common planning assumption for equity funds, but actual returns vary with the market.</p>
      <p><strong>Are SIP returns guaranteed?</strong> No. Mutual fund returns depend on market performance; the formula gives a projection, not a promise.</p>
      <p><strong>SIP or lump sum?</strong> SIP averages your cost over time and suits regular income; a lump sum invests once. The calculator lets you compare both.</p>
      <p><strong>Is my data private?</strong> Yes — every calculation runs in your browser and nothing is stored.</p>
    </>
  ),
};

export default guide;
