import Link from "next/link";
import {
  Twitter,
  Youtube,
  Instagram,
  Linkedin,
  Facebook,
  Heart,
  type LucideIcon,
} from "lucide-react";
import { Logo } from "@/components/Logo";

/**
 * Footer link budget is deliberately small.
 *
 * This used to render every PDF, image and calculator tool (81 links), which
 * put ~106 links in the footer of all 349 pages. That spreads internal link
 * equity uniformly, so the site had no way to signal which pages matter, and
 * the handful of genuinely contextual in-content links were outnumbered ~6:1
 * by boilerplate.
 *
 * Every tool is still fully crawlable — each category hub lists its complete
 * set, and every hub is linked from both the header and "Browse" below. So no
 * page is orphaned; the crawl path is simply one hop longer and far more
 * topically coherent.
 *
 * `popularTools` is therefore an editorial slot, not a convenience menu: these
 * are the pages we are actively trying to rank, and they are the ones that
 * receive site-wide internal links. Change it when the target list changes.
 */
const popularTools = [
  { name: "JSON Formatter", href: "/dev-tools/json-formatter" },
  { name: "JWT Decoder", href: "/dev-tools/jwt-decoder" },
  { name: "QR Code Generator", href: "/dev-tools/qr-code" },
  { name: "EMI Calculator", href: "/calculators/emi" },
  { name: "SIP Calculator", href: "/calculators/sip" },
  { name: "GST Calculator", href: "/calculators/gst" },
  { name: "PDF OCR", href: "/pdf/ocr" },
  { name: "Compress PDF", href: "/pdf/compress" },
  { name: "Compress Image", href: "/image/compress" },
  { name: "Background Remover", href: "/image/background-remover" },
  { name: "Typing Speed Test", href: "/fun/typing-test" },
  { name: "Passport Photo Sizes", href: "/passport-photo-sizes" },
];

/** Category hubs — the crawl path to every individual tool. */
const browseLinks = [
  { name: "PDF Tools", href: "/pdf-tools" },
  { name: "Image Tools", href: "/image-tools" },
  { name: "Calculators", href: "/calculators" },
  { name: "Developer Tools", href: "/dev-tools" },
  { name: "Text Tools", href: "/text-tools" },
  { name: "Fun & Prank Tools", href: "/fun-tools" },
  { name: "Audio Tools", href: "/audio-tools" },
  { name: "Video Tools", href: "/video-tools" },
  { name: "Guides", href: "/guides" },
  { name: "Free Alternatives", href: "/compare" },
];

const companyLinks = [
  { name: "About Us", href: "/about" },
  { name: "Contact", href: "/contact" },
  { name: "Privacy Policy", href: "/privacy-policy" },
  { name: "Terms of Service", href: "/terms" },
  { name: "Disclaimer", href: "/disclaimer" },
];

const socials: { label: string; href: string; icon: LucideIcon }[] = [
  { label: "GetFreeToolsAI on X (Twitter)", href: "https://x.com/getfreetoolsai", icon: Twitter },
  { label: "GetFreeToolsAI on YouTube", href: "https://www.youtube.com/@getfreetoolsai", icon: Youtube },
  { label: "GetFreeToolsAI on Instagram", href: "https://www.instagram.com/getfreetoolsai", icon: Instagram },
  { label: "GetFreeToolsAI on LinkedIn", href: "https://www.linkedin.com/company/getfreetoolsai", icon: Linkedin },
  { label: "GetFreeToolsAI on Facebook", href: "https://www.facebook.com/getfreetoolsai", icon: Facebook },
];

function FooterColumn({
  title,
  links,
}: {
  title: string;
  links: { name: string; href: string }[];
}) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-sm text-text-muted transition-colors hover:text-text-primary"
            >
              {l.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer data-nosnippet className="mt-28 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr] lg:gap-12">
          <div>
            <Logo />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-text-muted">
              Free tools for everyone. Forever. No signup, no limits, and your
              files never leave your device.
            </p>
            <div className="mt-5 flex items-center gap-3">
              {socials.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-9 w-9 items-center justify-center rounded-md border border-border text-text-muted transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="h-4 w-4" strokeWidth={1.75} />
                </a>
              ))}
            </div>
          </div>
          <FooterColumn title="Popular Tools" links={popularTools} />
          <FooterColumn title="Browse" links={browseLinks} />
          <FooterColumn title="Company" links={companyLinks} />
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} GetFreeToolsAI.com</p>
          {/* Legal links live in the Company column above; repeating them here
              would add three duplicate site-wide links for no user benefit. */}
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <span className="inline-flex items-center gap-1">
              Built with
              <Heart className="h-3 w-3 fill-primary text-primary" aria-hidden="true" />
            </span>
            <span aria-hidden>·</span>
            <span>No data stored</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
