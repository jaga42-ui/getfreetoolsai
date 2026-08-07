import { ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/JsonLd";
import { AdSlot } from "@/components/AdSlot";
import { CategoryStrip } from "@/components/ToolScaffold";
import { DevHub } from "@/components/dev/DevHub";
import { readyDevTools } from "@/lib/devtools";
import { toolMeta, SITE_URL, itemListSchema, breadcrumbSchema } from "@/lib/seo";

export const metadata = toolMeta({
  title: "Developer Tools — Free Online Utilities for Engineers",
  description:
    "A fast, private developer toolkit — JSON formatter, JWT decoder, regex tester, Base64, UUID generator, JSON to TypeScript and more.",
  keywords:
    "developer tools online, free dev tools, json formatter, jwt decoder, regex tester, base64 encoder, uuid generator, json to typescript, online developer utilities, browser based dev tools",
  path: "/dev-tools",
});

export default function DevToolsHub() {
  return (
    <div>
      <JsonLd data={itemListSchema("Free Developer Tools", readyDevTools.map((t) => ({ name: t.name, href: t.href })))} />
      <JsonLd data={breadcrumbSchema([{ name: "Home", url: SITE_URL }, { name: "Developer Tools" }])} />

      <h1 className="font-display text-3xl font-semibold tracking-tight text-zinc-50 sm:text-4xl">
        Developer Tools
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

      <CategoryStrip currentHref="/dev-tools" variant="dark" />
    </div>
  );
}
