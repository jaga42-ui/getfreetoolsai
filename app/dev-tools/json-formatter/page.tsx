import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JSON Formatter & Validator — Free Online | GetFreeToolsAI",
  description:
    "Format, beautify, minify and validate JSON online with instant error messages. 100% in your browser — your data is never uploaded. Free, no signup.",
  keywords:
    "json formatter, json validator, json beautifier, format json online, minify json, json pretty print, json lint",
  path: "/dev-tools/json-formatter",
});

const Tool = dynamic(() => import("@/components/dev/tools/JsonFormatter"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Paste any JSON and this tool re-parses it with the browser&apos;s native engine to
      pretty-print it with two-space indentation, minify it to a single line, or surface the
      exact syntax error when something is off. Because it uses a real parser rather than a
      regex, the &ldquo;valid&rdquo; badge means the JSON is genuinely well-formed.
    </p>
    <p>
      It is handy for inspecting API responses, cleaning up config files, and shrinking JSON
      before embedding it. Everything runs locally — your payload is never sent to a server,
      so it is safe for tokens, internal responses and sensitive data.
    </p>
  </>
);

const faqs = [
  { q: "Is my JSON uploaded anywhere?", a: "No. Parsing and formatting happen entirely in your browser with the native JSON engine. Nothing you paste is sent to a server." },
  { q: "Why does it say my JSON is invalid?", a: "The error message comes straight from the JSON parser and usually points at the problem — a trailing comma, a single quote instead of double quotes, or an unquoted key are the most common causes." },
  { q: "What is the difference between format and minify?", a: "Format adds line breaks and two-space indentation for readability; minify strips all whitespace to produce the smallest valid JSON for storage or transport." },
  { q: "Is there a size limit?", a: "There is no server limit since nothing is uploaded. Very large documents depend only on your device's available memory." },
];

export default function Page() {
  return (
    <DevFrame slug="json-formatter" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
