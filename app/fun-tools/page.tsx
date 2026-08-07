import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ToolCard } from "@/components/ToolCard";
import { TrustBadges } from "@/components/TrustBadges";
import { AdSlot } from "@/components/AdSlot";
import { FaqSection, CategoryStrip } from "@/components/ToolScaffold";
import { JsonLd } from "@/components/JsonLd";
import { funTools } from "@/lib/tools";
import {
  SITE_URL,
  toolMeta,
  breadcrumbSchema,
  itemListSchema,
} from "@/lib/seo";

export const metadata = toolMeta({
  title: "Fun & Prank Tools — Fancy Text, Fake Tweet, Hacker Typer",
  description:
    "Fancy and glitch text, upside-down text, hacker typer, fake error popups, fake tweets and texts, and a Morse translator — all free, no signup.",
  keywords:
    "fun tools, prank tools, fancy text generator, glitch text, hacker typer, fake tweet generator, fake text message, morse code translator",
  path: "/fun-tools",
});

const faqs = [
  {
    q: "Are these fun tools free?",
    a: "Yes — every fun and prank tool is completely free, with no signup, no limits and no watermark.",
  },
  {
    q: "Are these tools just for jokes?",
    a: "They're built for entertainment — memes, jokes with friends, social captions, stylish bios and harmless pranks. Please don't use the mockup makers to impersonate real people or spread misinformation.",
  },
  {
    q: "Is anything uploaded to a server?",
    a: "No. Every tool runs entirely in your browser, so the text and images you enter never leave your device.",
  },
  {
    q: "Do they work on a phone?",
    a: "Yes. All of them work in mobile browsers on Android and iPhone, with nothing to install.",
  },
];

export default function FunToolsHub() {
  const ready = funTools.filter((t) => t.ready);
  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", url: SITE_URL },
          { name: "Fun Tools" },
        ])}
      />
      <JsonLd
        data={itemListSchema(
          "Fun & Prank Tools",
          ready.map((t) => ({ name: t.name, href: t.href }))
        )}
      />

      <nav
        aria-label="Breadcrumb"
        className="flex items-center gap-1 text-sm text-text-muted"
      >
        <Link href="/" className="transition-colors hover:text-text-primary">
          Home
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text-primary">Fun Tools</span>
      </nav>

      <h1 className="mt-5 font-display text-3xl font-medium leading-tight text-text-primary sm:text-4xl">
        Fun &amp; Prank Tools
      </h1>
      <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-text-muted">
        A playground of text and prank toys — turn plain words into{" "}
        <span className="whitespace-nowrap">𝓯𝓪𝓷𝓬𝔂 𝓯𝓸𝓷𝓽𝓼</span>, glitch them out,
        flip them upside down, prank a friend with a fake hacking screen or error
        popup, mock up a tweet or text-message screenshot for a meme, or translate
        to Morse code. Everything runs in your browser and updates instantly — no
        signup, no watermark, nothing uploaded.
      </p>

      <TrustBadges className="mt-6" />

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {ready.map((t) => (
          <ToolCard key={t.href} tool={t} />
        ))}
      </div>

      <p className="mt-8 text-[15px] text-text-muted">
        Making memes? Pair these with the{" "}
        <Link
          href="/image/meme-maker"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          meme maker
        </Link>{" "}
        or the{" "}
        <Link
          href="/text-tools"
          className="text-primary underline decoration-primary/40 underline-offset-2 hover:decoration-primary"
        >
          text tools
        </Link>
        .
      </p>

      <AdSlot className="mt-12" />

      <FaqSection items={faqs} />

      <CategoryStrip currentHref="/fun-tools" />
    </div>
  );
}
