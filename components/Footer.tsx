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
import { pdfTools, imageTools, calculatorTools, type Tool } from "@/lib/tools";
import { Logo } from "@/components/Logo";

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

function FooterColumn({ title, tools }: { title: string; tools: Tool[] }) {
  return (
    <div>
      <p className="label">{title}</p>
      <ul className="mt-4 space-y-2.5">
        {tools
          .filter((t) => t.ready)
          .map((t) => (
            <li key={t.href}>
              <Link
                href={t.href}
                className="text-sm text-text-muted transition-colors hover:text-text-primary"
              >
                {t.name}
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
        <div className="grid gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_1fr_1fr_1fr_1fr] lg:gap-12">
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
          <FooterColumn title="PDF Tools" tools={pdfTools} />
          <FooterColumn title="Image Tools" tools={imageTools} />
          <FooterColumn title="Calculators" tools={calculatorTools} />
          <div>
            <p className="label">Company</p>
            <ul className="mt-4 space-y-2.5">
              <li>
                <Link
                  href="/pdf-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  All PDF Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/image-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  All Image Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/calculators"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  All Calculators
                </Link>
              </li>
              <li>
                <Link
                  href="/text-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  All Text Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/fun-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Fun &amp; Prank Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/dev-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Developer Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/audio-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Audio Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/video-tools"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Video Tools
                </Link>
              </li>
              <li>
                <Link
                  href="/guides"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Guides
                </Link>
              </li>
              <li>
                <Link
                  href="/compare"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Free Alternatives
                </Link>
              </li>
              <li>
                <Link
                  href="/passport-photo-sizes"
                  className="text-sm text-text-muted transition-colors hover:text-text-primary"
                >
                  Passport Photo Sizes
                </Link>
              </li>
              {companyLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm text-text-muted transition-colors hover:text-text-primary"
                  >
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-2 border-t border-border pt-6 text-xs text-text-muted sm:flex-row">
          <p>© {new Date().getFullYear()} GetFreeToolsAI.com</p>
          <p className="flex flex-wrap items-center justify-center gap-x-2">
            <Link href="/privacy-policy" className="transition-colors hover:text-text-primary">
              Privacy Policy
            </Link>
            <span aria-hidden>·</span>
            <Link href="/terms" className="transition-colors hover:text-text-primary">
              Terms
            </Link>
            <span aria-hidden>·</span>
            <Link href="/disclaimer" className="transition-colors hover:text-text-primary">
              Disclaimer
            </Link>
            <span aria-hidden>·</span>
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
