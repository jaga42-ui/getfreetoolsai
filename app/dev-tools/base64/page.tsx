import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Base64 Encoder & Decoder — Free Online",
  description:
    "Encode and decode Base64 online with full UTF-8 support. Runs entirely in your browser — nothing is uploaded. Free, instant, no signup.",
  keywords:
    "base64 encode, base64 decode, base64 encoder decoder, base64 to text, encode base64 online, decode base64",
  path: "/dev-tools/base64",
});

const Tool = dynamic(() => import("@/components/dev/tools/Base64Tool"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Base64 represents binary or text data using 64 ASCII characters so it can travel safely
      through systems that expect text — data URIs, JSON fields, email and HTTP headers. This
      tool encodes and decodes as you type, with full UTF-8 handling so emoji and non-Latin
      scripts round-trip correctly.
    </p>
    <p>
      Use the Swap button to flip the input and output, and Copy to grab the result. It all
      runs locally, so it is safe for secrets and internal data.
    </p>
  </>
);

const faqs = [
  { q: "Does this support UTF-8 and emoji?", a: "Yes. Text is encoded as UTF-8 before Base64, so accented characters, emoji and non-Latin scripts encode and decode correctly." },
  { q: "Is my text sent to a server?", a: "No. Encoding and decoding run entirely in your browser — nothing you paste leaves your device." },
  { q: "Why do I get an error when decoding?", a: "The input is not valid Base64. Check for missing characters, stray spaces, or that you didn't accidentally paste URL-safe Base64 with - and _ characters." },
  { q: "Can I use this for data URIs?", a: "Yes — encode your text and prefix it with the appropriate data: scheme, e.g. data:text/plain;base64,…" },
];

export default function Page() {
  return (
    <DevFrame slug="base64" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
