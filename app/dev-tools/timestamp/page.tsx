import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Unix Timestamp Converter — Epoch to Date & Date to Epoch",
  description:
    "Free Unix timestamp converter. Convert epoch timestamps (seconds or milliseconds) to human-readable UTC and local dates, and dates back to Unix time.",
  keywords:
    "unix timestamp converter, epoch converter, timestamp to date, unix time, epoch to date, convert timestamp, unix timestamp to date, milliseconds to date",
  path: "/dev-tools/timestamp",
});

const Tool = dynamic(() => import("@/components/dev/tools/TimestampConverter"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      A Unix timestamp (also called epoch time) is the number of seconds since{" "}
      <strong>1 January 1970 UTC</strong>. This converter turns a timestamp into
      a readable date — in ISO 8601, UTC and your local timezone — and converts a
      date back into a timestamp, in both seconds and milliseconds.
    </p>
    <h3>Seconds vs milliseconds</h3>
    <p>
      Unix time is usually counted in seconds (a 10-digit number today), but
      JavaScript and many APIs use milliseconds (13 digits). The converter
      auto-detects which you pasted, or you can force seconds or milliseconds.
    </p>
    <p>Everything runs locally in your browser — no request is made to any server.</p>
  </>
);

const faqs = [
  { q: "What is a Unix timestamp?", a: "It's the number of seconds elapsed since 00:00:00 UTC on 1 January 1970, known as the Unix epoch. It's a compact, timezone-independent way to represent a moment in time, used throughout programming and databases." },
  { q: "How do I convert a timestamp to a date?", a: "Paste the timestamp into the 'Timestamp → date' box. The converter shows the ISO 8601, UTC and local date-times, plus how long ago or from now it is." },
  { q: "Is the timestamp in seconds or milliseconds?", a: "Timestamps in seconds are about 10 digits today; in milliseconds they're about 13. Leave the unit on Auto-detect and the tool figures it out, or pick Seconds or Milliseconds explicitly." },
  { q: "How do I get the current Unix time?", a: "The current timestamp is shown live at the top in both seconds and milliseconds, updating every second, with one-click copy." },
  { q: "Does this send my data anywhere?", a: "No. All conversion happens in your browser using the JavaScript Date API — nothing is uploaded." },
];

export default function Page() {
  return (
    <DevFrame slug="timestamp" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
