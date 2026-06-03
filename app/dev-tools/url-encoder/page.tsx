import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "URL Encoder & Decoder — Free Online | GetFreeToolsAI",
  description:
    "Percent-encode and decode URLs and query parameters instantly in your browser. Free, private, no signup.",
  keywords:
    "url encoder, url decoder, percent encoding, encode url online, decode url, uri encode, url escape",
  path: "/dev-tools/url-encoder",
});

const Tool = dynamic(() => import("@/components/dev/tools/UrlEncoder"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      URL (percent) encoding escapes characters that have special meaning in a URL — spaces,
      ampersands, question marks and non-ASCII characters — so query strings and path segments
      stay valid. This tool encodes and decodes as you type using the same logic as
      <code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">encodeURIComponent</code>.
    </p>
    <p>
      It is the quick fix when a link breaks because of a stray space or &amp; in a parameter.
      Everything runs locally in your browser.
    </p>
  </>
);

const faqs = [
  { q: "What does this encode?", a: "It percent-encodes everything that is unsafe in a URL component — equivalent to JavaScript's encodeURIComponent — so it is ideal for individual query-string values." },
  { q: "Why did decoding fail?", a: "The input contains an invalid percent sequence (for example a lone % not followed by two hex digits). Fix the malformed sequence and try again." },
  { q: "Is my data private?", a: "Yes — encoding and decoding happen entirely in your browser and nothing is uploaded." },
  { q: "Component vs full-URL encoding?", a: "This tool encodes URL components (values), which also escapes characters like & and = that you usually want escaped inside a single parameter." },
];

export default function Page() {
  return (
    <DevFrame slug="url-encoder" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
