import Link from "next/link";
import { ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { CategoryStrip } from "@/components/ToolScaffold";
import { DevHub } from "@/components/dev/DevHub";
import { readyDevTools } from "@/lib/devtools";
import {
  toolMeta,
  SITE_URL,
  itemListSchema,
  breadcrumbSchema,
  faqPageSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Free Developer Tools Online — JSON, JWT, Regex & More",
  description:
    "Free developer tools that run in your browser: JSON formatter, JWT decoder, regex tester, Base64, UUID and more. No signup, nothing uploaded.",
  keywords:
    "developer tools online, free dev tools, online developer utilities, browser based dev tools, json formatter, jwt decoder, regex tester, base64 encoder, uuid generator",
  path: "/dev-tools",
});

/**
 * Genuine questions engineers ask before pasting data into a web tool. Kept
 * short and honest — no invented FAQs padded in for keyword coverage.
 *
 * FAQPage schema no longer produces a Google rich result (retired May 2026)
 * but is retained deliberately: it remains a strong signal for AI/LLM
 * citation, which is where a chunk of tool discovery now happens.
 */
const faqs = [
  {
    q: "Are these developer tools really free?",
    a: "Yes — every tool on this page is free with no signup, no account and no usage cap. There is no paid tier holding features back.",
  },
  {
    q: "Is it safe to paste a JWT or API response into an online tool?",
    a: "Into most online tools, no — they post your input to a server, which means a production token or customer data leaves your machine. These tools are different: every one runs as JavaScript in your own browser, so what you paste is never transmitted anywhere. You can confirm it by opening DevTools and watching the Network tab while you use them.",
  },
  {
    q: "Do these tools work offline?",
    a: "Mostly yes. Once a tool page has loaded, the processing itself needs no network, so it keeps working if your connection drops. The site also registers a service worker, so previously visited tools can load again offline.",
  },
  {
    q: "Is there a file size or request limit?",
    a: "There is no artificial limit. Because the work happens on your own device, the practical ceiling is your browser's available memory rather than a quota we impose.",
  },
  {
    q: "Do you store or log what I paste?",
    a: "No. There is no server-side processing to log. Input stays in the page's memory and is discarded when you close or reload the tab.",
  },
  {
    q: "Which tool should I use to validate JSON?",
    a: "Use the JSON Formatter — it validates as it formats and points at the exact line and character where parsing failed, which is usually a trailing comma, a single quote, or an unescaped character inside a string.",
  },
];

export default function DevToolsHub() {
  return (
    <div>
      <JsonLd data={itemListSchema("Free Developer Tools", readyDevTools.map((t) => ({ name: t.name, href: t.href })))} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Developer Tools" }])} />
      <JsonLd data={faqPageSchema(faqs)} />

      <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Free Developer Tools
      </h1>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
        A fast, private toolkit built for engineers — format and validate JSON, decode JWTs,
        test regular expressions, generate UUIDs, convert JSON to TypeScript and more. Every
        tool runs <span className="text-zinc-200">entirely in your browser</span>: no signup,
        no uploads, and whatever you paste never leaves your device.
      </p>
      <span className="mt-4 inline-flex items-center gap-1.5 rounded-md bg-emerald-500/10 px-2.5 py-1 text-[11px] font-medium text-emerald-400">
        <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" /> Runs entirely in your browser — nothing is uploaded
      </span>

      <DevHub />

      <AdSlot className="mt-12" />

      {/* ------------------------------------------------------------------
          Pillar content. Deliberately placed BELOW the tool grid so the tools
          stay the primary experience — nobody should scroll past an essay to
          reach a JSON formatter.
         ------------------------------------------------------------------ */}
      <section className="mt-16 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-zinc-100">
          Why run developer tools in the browser?
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-400">
          <p>
            Most online dev utilities are thin front-ends over a server endpoint. You paste,
            it POSTs, a machine you do not control parses your input and returns a result.
            For a lorem-ipsum string that is harmless. For a signed JWT from staging, a
            customer record inside an API response, or a private key fingerprint, it means
            production data has left your network and landed in someone else&apos;s logs.
          </p>
          <p>
            Every tool here is plain JavaScript executing in your own tab. There is no
            upload step, no request to inspect, and no server-side copy to retain — which
            also means there is no breach surface later. That is a claim you can verify
            rather than trust: open DevTools, watch the Network tab, and use any tool on
            this page. You will not see a request carrying your input.
          </p>
          <p>
            The practical side effects are worth having too. Nothing round-trips, so results
            are instant. There is no rate limit, because there is no server to protect. And
            once a page has loaded, it keeps working without a connection.
          </p>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-zinc-100">
          Finding the right tool
        </h2>
        <div className="mt-4 space-y-4 text-sm leading-relaxed text-zinc-400">
          <p>
            <span className="font-medium text-zinc-200">Working with JSON and data.</span>{" "}
            The{" "}
            <Link href="/dev-tools/json-formatter" className="text-emerald-400 hover:underline">
              JSON formatter and validator
            </Link>{" "}
            is the one most people arrive for — it beautifies, minifies and reports the exact
            position of a syntax error. From there,{" "}
            <Link href="/dev-tools/json-to-typescript" className="text-emerald-400 hover:underline">
              JSON to TypeScript
            </Link>{" "}
            turns a sample payload into typed interfaces, and{" "}
            <Link href="/dev-tools/json-csv" className="text-emerald-400 hover:underline">
              JSON to CSV
            </Link>{" "}
            converts in both directions with correct RFC-4180 quoting. For pattern work, the{" "}
            <Link href="/dev-tools/regex-tester" className="text-emerald-400 hover:underline">
              regex tester
            </Link>{" "}
            highlights matches and capture groups as you type.
          </p>
          <p>
            <span className="font-medium text-zinc-200">Encoding and security.</span>{" "}
            The{" "}
            <Link href="/dev-tools/jwt-decoder" className="text-emerald-400 hover:underline">
              JWT decoder
            </Link>{" "}
            splits a token into header, payload and signature and surfaces expiry and standard
            claims — locally, which matters more here than anywhere else on the site. Alongside
            it sit{" "}
            <Link href="/dev-tools/base64" className="text-emerald-400 hover:underline">
              Base64 encode and decode
            </Link>{" "}
            with full UTF-8 support, a{" "}
            <Link href="/dev-tools/hash-generator" className="text-emerald-400 hover:underline">
              SHA hash generator
            </Link>
            , and a{" "}
            <Link href="/dev-tools/url-encoder" className="text-emerald-400 hover:underline">
              URL encoder
            </Link>{" "}
            for safe percent-encoding of query components.
          </p>
          <p>
            <span className="font-medium text-zinc-200">Generating things.</span>{" "}
            Bulk{" "}
            <Link href="/dev-tools/uuid" className="text-emerald-400 hover:underline">
              UUID v4 generation
            </Link>{" "}
            and the{" "}
            <Link href="/dev-tools/password-generator" className="text-emerald-400 hover:underline">
              password generator
            </Link>{" "}
            both use the Web Crypto API rather than <code className="font-mono text-zinc-300">Math.random()</code>,
            so the output is cryptographically random. The{" "}
            <Link href="/dev-tools/qr-code" className="text-emerald-400 hover:underline">
              QR code generator
            </Link>{" "}
            exports PNG or SVG with no tracking redirect and no expiry.
          </p>
          <p>
            <span className="font-medium text-zinc-200">Converting formats.</span>{" "}
            Everyday conversions live in{" "}
            <Link href="/dev-tools/timestamp" className="text-emerald-400 hover:underline">
              Unix timestamp
            </Link>
            ,{" "}
            <Link href="/dev-tools/number-base" className="text-emerald-400 hover:underline">
              number base
            </Link>{" "}
            and{" "}
            <Link href="/dev-tools/color-converter" className="text-emerald-400 hover:underline">
              colour
            </Link>{" "}
            converters. If your work is more documents than data, the{" "}
            <Link href="/text-tools" className="text-emerald-400 hover:underline">
              text tools
            </Link>{" "}
            and{" "}
            <Link href="/pdf-tools" className="text-emerald-400 hover:underline">
              PDF tools
            </Link>{" "}
            follow the same no-upload rule.
          </p>
        </div>
      </section>

      <section className="mt-14 max-w-3xl">
        <h2 className="font-display text-2xl font-medium text-zinc-100">
          Frequently asked questions
        </h2>
        <div className="mt-5 space-y-4">
          {faqs.map((f) => (
            <details
              key={f.q}
              className="group rounded-lg border border-zinc-800 bg-zinc-900/40 px-4 py-3"
            >
              <summary className="cursor-pointer list-none text-sm font-medium text-zinc-100 marker:content-none">
                {f.q}
              </summary>
              <p className="mt-2.5 text-sm leading-relaxed text-zinc-400">{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <CategoryStrip currentHref="/dev-tools" variant="dark" />
    </div>
  );
}
