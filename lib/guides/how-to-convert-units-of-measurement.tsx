import Link from "next/link";
import type { Guide } from "@/lib/guides/types";

const guide: Guide = {
  slug: "how-to-convert-units-of-measurement",
  category: "calculator",
  title: "How to Convert Units: Length, Weight & Temperature",
  description:
    "Convert between metric and imperial units — length, weight and temperature — with the key conversion factors, worked examples, and a free unit converter.",
  keywords:
    "how to convert units, unit converter, metric to imperial, cm to inches, kg to pounds, celsius to fahrenheit, convert measurements, conversion factors",
  excerpt:
    "The conversion factors that actually matter — cm↔in, kg↔lb, °C↔°F — with worked examples and a free converter.",
  datePublished: "2026-07-03",
  dateModified: "2026-07-03",
  authorId: "team",
  readingTime: 4,
  tags: ["unit conversion", "measurement", "everyday"],
  relatedTools: ["/calculators/unit-converter", "/calculators/percentage", "/calculators/bmi"],
  relatedGuides: [],
  toc: [
    { id: "how", label: "How conversion works" },
    { id: "length", label: "Length" },
    { id: "weight", label: "Weight" },
    { id: "temperature", label: "Temperature" },
    { id: "faq", label: "FAQ" },
  ],
  body: (
    <>
      <p>
        Converting units is just multiplying by the right factor — except
        temperature, which is the odd one out. Knowing a handful of factors covers
        almost every everyday conversion; the rest is arithmetic. Here are the ones
        worth memorising, with worked examples, plus a free{" "}
        <Link href="/calculators/unit-converter">unit converter</Link> for the rest.
      </p>

      <h2 id="how">How unit conversion works</h2>
      <p>
        To convert, multiply by a factor that turns the old unit into the new one.
        If 1 inch = 2.54 cm, then to go from inches to cm you multiply by 2.54, and
        to go back you divide by 2.54. The only trick is knowing which way to
        multiply — set it up so the units you don&apos;t want cancel out.
      </p>

      <h2 id="length">Length</h2>
      <ul>
        <li><strong>1 inch = 2.54 cm</strong> — so 10 in × 2.54 = 25.4 cm.</li>
        <li><strong>1 foot = 30.48 cm</strong> (12 inches).</li>
        <li><strong>1 mile = 1.609 km</strong> — a 5 km run is about 3.1 miles.</li>
        <li><strong>1 metre = 3.281 feet</strong>.</li>
      </ul>

      <h2 id="weight">Weight</h2>
      <ul>
        <li><strong>1 kg = 2.205 lb</strong> — so 70 kg × 2.205 ≈ 154 lb.</li>
        <li><strong>1 pound = 0.454 kg</strong>.</li>
        <li><strong>1 stone = 6.35 kg</strong> (14 lb), common for body weight in the UK.</li>
      </ul>

      <h2 id="temperature">Temperature (the odd one out)</h2>
      <p>
        Temperature scales don&apos;t share a zero, so you can&apos;t just multiply
        — you scale <em>and</em> shift:
      </p>
      <ul>
        <li><strong>°C → °F:</strong> (°C × 9/5) + 32. So 20°C = (36) + 32 = <strong>68°F</strong>.</li>
        <li><strong>°F → °C:</strong> (°F − 32) × 5/9. So 98.6°F = (66.6) × 5/9 = <strong>37°C</strong>.</li>
      </ul>
      <p>
        Handy anchors: 0°C = 32°F (freezing), 37°C ≈ 98.6°F (body), 100°C = 212°F
        (boiling).
      </p>

      <h2 id="faq">FAQ</h2>
      <p><strong>How many cm in an inch?</strong> Exactly 2.54 cm.</p>
      <p><strong>How do I convert kg to pounds?</strong> Multiply kilograms by 2.205.</p>
      <p><strong>Why is temperature different?</strong> The scales have different zero points, so you scale and then add or subtract an offset, not just multiply.</p>
      <p><strong>Is my data private?</strong> Yes — the converter runs in your browser and stores nothing.</p>
    </>
  ),
};

export default guide;
