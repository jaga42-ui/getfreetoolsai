import dynamic from "next/dynamic";
import { CalculatorPage } from "@/components/CalculatorPage";
import { JsonLd } from "@/components/JsonLd";
import { ToolSkeleton } from "@/components/ToolScaffold";
import { toolMeta, softwareAppSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Roman Numeral Converter — Free & Instant",
  description:
    "Convert numbers to Roman numerals and Roman numerals to numbers, 1 to 3999. Free, instant, with a breakdown showing how each numeral is built.",
  keywords:
    "roman numeral converter, roman numerals, number to roman numeral, roman numeral to number, roman numerals chart, convert roman numerals",
  path: "/calculators/roman-numerals",
});

const jsonLd = softwareAppSchema({
  name: "Free Roman Numeral Converter",
  description:
    "Convert between numbers and Roman numerals in both directions, with a place-value breakdown.",
  path: "/calculators/roman-numerals",
});

const RomanNumeralConverter = dynamic(
  () => import("@/components/calc/RomanNumeralConverter"),
  { ssr: false, loading: () => <ToolSkeleton /> }
);

const faqs = [
  {
    q: "How do Roman numerals work?",
    a: "Seven letters carry fixed values: I is 1, V is 5, X is 10, L is 50, C is 100, D is 500 and M is 1000. Values are added when written largest to smallest, so XVI is 10 + 5 + 1 = 16. When a smaller letter comes before a larger one it is subtracted instead, which is how IV means 4 and CM means 900.",
  },
  {
    q: "Why is 4 written IV and not IIII?",
    a: "Standard notation never repeats a letter more than three times, so 4 uses the subtractive form IV rather than IIII. You will still see IIII on some clock faces — that is a traditional stylistic choice, not correct notation, and this converter flags it as invalid.",
  },
  {
    q: "What is the largest Roman numeral?",
    a: "In plain text, 3999 (MMMCMXCIX). Larger values need a vinculum — an overline that multiplies a numeral by 1000 — which cannot be typed as ordinary characters, so most converters, including this one, stop at 3999.",
  },
  {
    q: "Is there a Roman numeral for zero?",
    a: "No. The system was built for counting and has no symbol for nothing. Medieval scholars wrote the Latin word nulla when they needed to express zero in a Roman-numeral context.",
  },
  {
    q: "Which subtractive combinations are allowed?",
    a: "Only six: IV (4), IX (9), XL (40), XC (90), CD (400) and CM (900). A subtraction is only valid one power of ten below the larger symbol, which is why IC is not a valid way to write 99 — that is XCIX.",
  },
  {
    q: "How do I write a year in Roman numerals?",
    a: "Convert it like any other number: 2024 becomes MMXXIV, and 1987 becomes MCMLXXXVII. Type the year into the converter above and the breakdown shows exactly how each part is formed.",
  },
];

const about = (
  <>
    <p>
      This converter works in both directions — type a number from 1 to 3999 to
      get its Roman numeral, or type a numeral to get the number back. The
      breakdown underneath shows how the result is assembled from its parts,
      which is usually more useful than the answer on its own if you are trying
      to learn the system or check a piece of homework.
    </p>
    <p>
      Roman numerals still turn up in plenty of everyday places: chapter and
      volume numbers, clock faces, film and game sequels, the copyright date at
      the end of a broadcast, monument and building inscriptions, Super Bowl
      numbering, and outline numbering in formal documents. They are also a
      staple of primary and middle-school maths.
    </p>
    <p>
      Conversion from a numeral is validated strictly rather than loosely. A
      string like IIII or IC can be read as 4 and 99 if you are being generous,
      but neither is valid notation, and quietly accepting them would make this
      useless for checking whether an answer is actually right. When the input
      is not canonical, the tool says so and shows the correct form.
    </p>
  </>
);

export default function Page() {
  return (
    <>
      <JsonLd data={jsonLd} />
      <CalculatorPage
        title="Roman Numeral Converter"
        description="Convert numbers to Roman numerals and back, from 1 to 3999, with a breakdown of how each numeral is built."
        currentHref="/calculators/roman-numerals"
        current="Roman Numeral Converter"
        disclaimer="none"
        about={about}
        faqs={faqs}
      >
        <RomanNumeralConverter />
      </CalculatorPage>
    </>
  );
}
