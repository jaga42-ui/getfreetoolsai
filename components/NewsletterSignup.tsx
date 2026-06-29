"use client";

import { useState, type FormEvent } from "react";
import { Mail, Check, Loader2, ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

type Status = "idle" | "loading" | "ok" | "error";

/**
 * Newsletter signup. Posts to the same-origin /api/subscribe route (provider key
 * stays server-side). Self-contained states; safe to drop anywhere. Display is
 * gated by callers on NEXT_PUBLIC_NEWSLETTER_ENABLED so it only appears once the
 * backend is configured.
 */
export function NewsletterSignup({ className }: { className?: string }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const value = email.trim();
    if (!EMAIL_RE.test(value)) {
      setStatus("error");
      setMessage("Please enter a valid email address.");
      return;
    }
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
      if (res.ok) {
        setStatus("ok");
        track("newsletter_signup");
      } else {
        const data = await res.json().catch(() => ({}));
        setStatus("error");
        setMessage(
          data?.error === "invalid_email"
            ? "Please enter a valid email address."
            : "Something went wrong — please try again."
        );
      }
    } catch {
      setStatus("error");
      setMessage("Something went wrong — please try again.");
    }
  }

  if (status === "ok") {
    return (
      <div
        className={cn(
          "flex items-center gap-3 rounded-xl border border-secondary/30 bg-secondary/[0.07] px-5 py-4",
          className
        )}
        role="status"
      >
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary">
          <Check className="h-4 w-4" strokeWidth={2.5} />
        </span>
        <p className="text-[15px] text-text-primary">
          You&apos;re in — thanks! We&apos;ll email you when new tools ship.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className={cn("w-full", className)} noValidate>
      <div className="flex flex-col gap-2.5 sm:flex-row">
        <label htmlFor="newsletter-email" className="sr-only">
          Email address
        </label>
        <div className="relative flex-1">
          <Mail
            className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted"
            strokeWidth={1.75}
            aria-hidden="true"
          />
          <input
            id="newsletter-email"
            type="email"
            inputMode="email"
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (status === "error") setStatus("idle");
            }}
            aria-invalid={status === "error"}
            className="w-full rounded-lg border border-border bg-surface py-3 pl-10 pr-3 text-[15px] text-text-primary placeholder:text-text-muted/70 focus:border-primary focus:outline-none"
          />
        </div>
        <button
          type="submit"
          disabled={status === "loading"}
          className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-lg bg-primary px-5 py-3 text-[15px] font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828] disabled:opacity-70"
        >
          {status === "loading" ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Subscribing…
            </>
          ) : (
            <>
              Subscribe
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </>
          )}
        </button>
      </div>
      <p
        className="mt-2.5 text-[13px] text-text-muted"
        role={status === "error" ? "alert" : undefined}
      >
        {status === "error" ? (
          <span className="text-red-500">{message}</span>
        ) : (
          "New tools in your inbox. No spam, unsubscribe anytime — we never share your email."
        )}
      </p>
    </form>
  );
}
