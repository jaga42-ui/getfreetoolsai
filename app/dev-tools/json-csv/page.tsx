import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "JSON to CSV Converter — And CSV to JSON, Free Online",
  description:
    "Free JSON to CSV converter that works both ways. Proper header detection and RFC-4180 quoting — runs in your browser, nothing uploaded.",
  keywords:
    "json to csv, csv to json, json to csv converter, convert json to csv, csv to json converter, json csv, export json to csv",
  path: "/dev-tools/json-csv",
});

const Tool = dynamic(() => import("@/components/dev/tools/JsonCsvConverter"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      This converter turns a JSON array of objects into CSV, and turns CSV back
      into JSON — switch direction with one click. Going to CSV, it builds the
      header from the union of every object&apos;s keys and quotes any field that
      contains a comma, quote or line break. Going to JSON, it parses quoted
      fields and escaped quotes correctly (RFC 4180) and coerces numbers and
      booleans.
    </p>
    <h3>Good to know</h3>
    <ul>
      <li>JSON input should be an array of flat objects; nested objects and arrays are stored as JSON strings in the cell.</li>
      <li>CSV input must have a header row — those names become the JSON keys.</li>
      <li>Switching direction feeds the current output back in, so you can round-trip in a click.</li>
    </ul>
    <p>Everything runs in your browser, so even sensitive data never leaves your device.</p>
  </>
);

const faqs = [
  { q: "How do I convert JSON to CSV?", a: "Paste a JSON array of objects in the JSON → CSV mode. The tool creates a header row from all the keys and a data row per object, quoting anything that needs it, ready to open in Excel or Sheets." },
  { q: "How do I convert CSV to JSON?", a: "Switch to CSV → JSON and paste CSV with a header row. Each row becomes an object keyed by the header, and numbers and true/false are converted to real JSON types." },
  { q: "Does it handle commas and quotes inside fields?", a: "Yes. The CSV parser follows RFC 4180, so fields wrapped in quotes can contain commas, line breaks and escaped double-quotes without breaking the columns." },
  { q: "What happens to nested objects?", a: "When converting JSON to CSV, a nested object or array in a value is written as a compact JSON string in that cell, since CSV is a flat format." },
  { q: "Is my data uploaded?", a: "No. Conversion runs entirely in your browser — nothing is sent to a server, which matters for private datasets." },
];

export default function Page() {
  return (
    <DevFrame slug="json-csv" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
