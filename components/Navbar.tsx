"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ChevronDown, Menu, X } from "lucide-react";
import { pdfTools, imageTools, calculatorTools, type Tool } from "@/lib/tools";
import { cn } from "@/lib/utils";

function Wordmark() {
  return (
    <Link href="/" className="font-display text-xl font-semibold tracking-tight">
      <span className="text-text-primary">Getfreetools</span>
      <span className="text-primary">·ai</span>
    </Link>
  );
}

function DropdownLink({ tool }: { tool: Tool }) {
  const Icon = tool.icon;
  return (
    <Link
      href={tool.ready ? tool.href : "#"}
      onClick={(e) => !tool.ready && e.preventDefault()}
      className={cn(
        "flex items-start gap-3 rounded-md p-2.5 transition-colors",
        tool.ready ? "hover:bg-background" : "cursor-not-allowed opacity-50"
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />
      <span>
        <span className="flex items-center gap-1.5 text-sm font-medium text-text-primary">
          {tool.name}
          {!tool.ready && <span className="label text-text-muted/70">soon</span>}
        </span>
        <span className="block text-xs text-text-muted">{tool.description}</span>
      </span>
    </Link>
  );
}

export function Navbar() {
  const [openMenu, setOpenMenu] = useState<
    "pdf" | "image" | "calc" | null
  >(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  return (
    <header
      data-nosnippet
      className="sticky top-0 z-50 border-b border-border bg-background/85 backdrop-blur-md"
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
        <Wordmark />

        {/* Desktop nav */}
        <nav className="hidden items-center gap-2 md:flex">
          {(["pdf", "image", "calc"] as const).map((key) => {
            const tools =
              key === "pdf"
                ? pdfTools
                : key === "image"
                ? imageTools
                : calculatorTools;
            const label =
              key === "pdf"
                ? "PDF Tools"
                : key === "image"
                ? "Image Tools"
                : "Calculators";
            return (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => setOpenMenu(key)}
                onMouseLeave={() => setOpenMenu(null)}
              >
                <button className="flex items-center gap-1 rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary">
                  {label}
                  <ChevronDown className="h-3.5 w-3.5" />
                </button>
                {openMenu === key && (
                  <div className="absolute left-0 top-full w-[340px] pt-2">
                    <div className="grid max-h-[75vh] grid-cols-1 gap-0.5 overflow-y-auto rounded-lg border border-border bg-surface p-2 shadow-[0_12px_40px_-12px_rgba(33,31,26,0.25)]">
                      {tools.map((t) => (
                        <DropdownLink key={t.href} tool={t} />
                      ))}
                      {key === "calc" && (
                        <Link
                          href="/calculators"
                          className="rounded-md p-2.5 text-sm font-medium text-primary hover:bg-background"
                        >
                          All calculators →
                        </Link>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <Link
            href="/#coming-soon"
            className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            AI Tools
          </Link>
          <Link
            href="/#coming-soon"
            className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            Generators
          </Link>
          <Link
            href="/#coming-soon"
            className="rounded-md px-3 py-2 text-sm text-text-muted transition-colors hover:text-text-primary"
          >
            More
          </Link>
          <Link
            href="/#all-tools"
            className="ml-2 text-sm font-medium text-text-primary underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary"
          >
            All tools
          </Link>
        </nav>

        <button
          className="md:hidden"
          onClick={() => setMobileOpen((o) => !o)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="max-h-[calc(100vh-4rem)] overflow-y-auto border-t border-border bg-background px-5 py-5 md:hidden">
          <p className="label mb-2 px-1">PDF Tools</p>
          <div className="grid gap-0.5" onClick={() => setMobileOpen(false)}>
            {pdfTools.map((t) => (
              <DropdownLink key={t.href} tool={t} />
            ))}
          </div>
          <p className="label mb-2 px-1 pt-5">Image Tools</p>
          <div className="grid gap-0.5" onClick={() => setMobileOpen(false)}>
            {imageTools.map((t) => (
              <DropdownLink key={t.href} tool={t} />
            ))}
          </div>
          <p className="label mb-2 px-1 pt-5">Calculators</p>
          <div className="grid gap-0.5" onClick={() => setMobileOpen(false)}>
            {calculatorTools.map((t) => (
              <DropdownLink key={t.href} tool={t} />
            ))}
          </div>
        </div>
      )}
    </header>
  );
}
