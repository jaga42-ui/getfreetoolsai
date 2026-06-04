"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";

const GA_ID = process.env.NEXT_PUBLIC_GA_ID || "G-M180ZJC75T";
const ADS_CLIENT = "ca-pub-8900650860007222";
const KEY = "gft-consent";

type Consent = "granted" | "denied" | null;

/**
 * Privacy-first consent gate. Google Analytics and AdSense scripts are NOT
 * loaded until the visitor explicitly accepts. Consent Mode v2 signals are set
 * (default = denied) so even after loading, ads/analytics respect the choice.
 * Declining — or ignoring the banner — loads nothing non-essential.
 */
export function ConsentManager() {
  const [consent, setConsent] = useState<Consent>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    try {
      const v = localStorage.getItem(KEY);
      if (v === "granted" || v === "denied") setConsent(v);
    } catch {
      /* localStorage unavailable */
    }
  }, []);

  const choose = (v: "granted" | "denied") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      /* ignore */
    }
    setConsent(v);
  };

  return (
    <>
      {consent === "granted" && (
        <>
          <Script id="consent-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
gtag('consent','default',{ad_storage:'denied',analytics_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',wait_for_update:500});
gtag('consent','update',{ad_storage:'granted',analytics_storage:'granted',ad_user_data:'granted',ad_personalization:'granted'});
gtag('js',new Date());gtag('config','${GA_ID}');`}
          </Script>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script
            id="adsbygoogle-init"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADS_CLIENT}`}
            strategy="afterInteractive"
            crossOrigin="anonymous"
          />
        </>
      )}

      {mounted && consent === null && (
        <div
          role="dialog"
          aria-label="Cookie consent"
          aria-live="polite"
          className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-surface/95 backdrop-blur-md"
        >
          <div className="mx-auto flex max-w-4xl flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <p className="text-sm leading-relaxed text-text-muted">
              We use optional cookies for analytics and ads to keep these tools free. Your files
              are always processed privately in your browser and are never uploaded.{" "}
              <Link href="/privacy-policy" className="text-primary underline underline-offset-2">
                Privacy Policy
              </Link>
              .
            </p>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => choose("denied")}
                className="rounded-md border border-border bg-background px-4 py-2 text-sm font-medium text-text-muted transition-colors hover:text-text-primary"
              >
                Decline
              </button>
              <button
                type="button"
                onClick={() => choose("granted")}
                className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
