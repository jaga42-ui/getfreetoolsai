import dynamic from "next/dynamic";
import { DevFrame } from "@/components/dev/DevFrame";
import { DevSkeleton } from "@/components/dev/DevHeader";
import { toolMeta } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Regex Tester — Test Regular Expressions Online | GetFreeToolsAI",
  description:
    "Test regular expressions live with match counts, capture groups and JavaScript flags. Runs in your browser, free, no signup.",
  keywords:
    "regex tester, regular expression tester, test regex online, regex match, javascript regex, regex groups, regex playground",
  path: "/dev-tools/regex-tester",
});

const Tool = dynamic(() => import("@/components/dev/tools/RegexTester"), {
  ssr: false,
  loading: () => <DevSkeleton />,
});

const about = (
  <>
    <p>
      Enter a pattern, toggle the flags you need (<code className="mx-1 rounded bg-zinc-800 px-1 py-0.5 text-[12px] text-zinc-200">g i m s u y</code>),
      and paste your test string. Matches are listed instantly with their capture groups, and an
      invalid pattern shows the engine&apos;s exact error so you can fix it fast.
    </p>
    <p>
      It uses the JavaScript regex engine, so what works here works in your JS/TS code. Nothing
      is uploaded — patterns and test data stay in your browser.
    </p>
  </>
);

const faqs = [
  { q: "Which regex flavour does this use?", a: "The native JavaScript (ECMAScript) engine, so behaviour matches regex in your Node.js or browser code exactly." },
  { q: "What do the flags mean?", a: "g = global (all matches), i = case-insensitive, m = multiline ^/$, s = dotAll (. matches newlines), u = unicode, y = sticky." },
  { q: "Can I see capture groups?", a: "Yes. Each match lists its numbered capture groups so you can confirm your parentheses capture what you expect." },
  { q: "Is my data private?", a: "Yes — the pattern and test string are evaluated entirely in your browser and never sent anywhere." },
];

export default function Page() {
  return (
    <DevFrame slug="regex-tester" about={about} faqs={faqs}>
      <Tool />
    </DevFrame>
  );
}
