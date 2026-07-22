import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Number Base Converter — Binary, Octal, Decimal & Hex",
  description:
    "Free number base converter. Convert numbers between binary, octal, decimal, hexadecimal and any base from 2 to 36, with big-number support. Runs in your browser.",
  keywords:
    "number base converter, binary to decimal, decimal to binary, hex to decimal, binary to hex, base converter, radix converter, decimal to hexadecimal",
  path: "/dev-tools/number-base",
});

const Tool = dynamic(() => import("@/components/dev/tools/NumberBaseConverter"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This tool converts a number from one base (radix) to another. Enter a value
      and pick its base — binary (2), octal (8), decimal (10) or hexadecimal (16)
      — and it instantly shows the equivalent in all the common bases, plus any
      custom base from 2 to 36.
    </p>
    <h3>Big numbers, no rounding</h3>
    <p>
      Conversions use JavaScript&apos;s <code>BigInt</code>, so very large values
      convert exactly without the precision loss you&apos;d get from ordinary
      floating-point math. Negative numbers and the <code>0x</code>,{" "}
      <code>0b</code> and <code>0o</code> prefixes are accepted too.
    </p>
    <p>All conversion happens locally in your browser.</p>
  </>
);

const faqs = [
  { q: "How do I convert binary to decimal?", a: "Set 'From base' to Binary, type your binary digits, and read the Decimal row. For example 11111111 in binary is 255 in decimal." },
  { q: "How do I convert decimal to hexadecimal?", a: "Set 'From base' to Decimal, enter the number, and read the Hexadecimal row. For example 255 becomes ff." },
  { q: "What bases are supported?", a: "Binary, octal, decimal and hexadecimal are always shown, and you can output any base from 2 to 36 using the custom base field. Bases above 10 use letters a–z for the extra digits." },
  { q: "Does it handle very large numbers?", a: "Yes. It uses BigInt, so numbers far larger than a normal 64-bit integer convert exactly, with no rounding." },
  { q: "Is my input sent to a server?", a: "No. The conversion runs entirely in your browser and nothing is uploaded." },
];

export default function Page() {
  return (
    <DevFrame slug="number-base" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
