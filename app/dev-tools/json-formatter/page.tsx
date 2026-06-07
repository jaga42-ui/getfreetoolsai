import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import Link from "next/link";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JSON Formatter & Validator — Free Online",
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
    <h3>Format vs minify</h3>
    <p>
      <strong>Format</strong> (beautify) adds line breaks and two-space indentation so a
      payload is easy to read and diff. <strong>Minify</strong> strips every optional
      character to produce the smallest valid JSON — useful for embedding a config in code or
      reducing what you send over the wire. Both produce identical data; only the whitespace
      differs.
    </p>
    <h3>Common errors it catches</h3>
    <ul>
      <li><strong>Trailing commas</strong> — valid in JavaScript objects, but not in JSON.</li>
      <li><strong>Single quotes</strong> — JSON strings and keys must use double quotes.</li>
      <li><strong>Unquoted keys</strong> — <code>{`{name: "x"}`}</code> is invalid; it must be <code>{`{"name": "x"}`}</code>.</li>
      <li><strong>Stray comments</strong> — standard JSON does not allow <code>{"//"}</code> or <code>{"/* */"}</code>.</li>
    </ul>
    <h3>Worked example</h3>
    <p>
      Paste <code>{`{"id":1,"tags":["a","b"],"ok":true}`}</code> and Format returns it across
      multiple indented lines; Minify collapses an indented file back to a single compact line.
      If you change <code>true</code> to <code>True</code>, the validator immediately flags it,
      because JSON booleans are lowercase.
    </p>
    <p>
      Once your JSON is valid, turn it into types with{" "}
      <Link href="/dev-tools/json-to-typescript">JSON to TypeScript</Link>.
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
