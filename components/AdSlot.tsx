"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_EVENT, getConsent } from "@/lib/consent";

// AdSense publisher ID (matches public/ads.txt and ConsentManager).
const ADS_CLIENT = "ca-pub-8900650860007222";

// TODO: replace this placeholder with a real ad-unit slot ID from the AdSense
// dashboard (AdSense → Ads → By ad unit → Display ad → copy the data-ad-slot).
// Every <AdSlot/> falls back to this when no `slot` prop is passed.
export const PLACEHOLDER_AD_SLOT = "0000000000";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

/**
 * A single AdSense display unit that:
 *  - renders nothing until the visitor has granted consent (GDPR/AdSense policy),
 *  - reserves vertical space so filling the ad doesn't cause layout shift (CLS),
 *  - pushes to `adsbygoogle` exactly once.
 *
 * The AdSense loader script itself is injected by ConsentManager after consent,
 * so this component only worries about the per-unit push.
 */
export function AdSlot({
  slot = PLACEHOLDER_AD_SLOT,
  className,
  /** Reserved height (px) to prevent layout shift while the ad loads. */
  minHeight = 280,
  format = "auto",
}: {
  slot?: string;
  className?: string;
  minHeight?: number;
  format?: string;
}) {
  const [granted, setGranted] = useState(false);
  const pushed = useRef(false);

  useEffect(() => {
    const sync = () => setGranted(getConsent() === "granted");
    sync();
    window.addEventListener(CONSENT_EVENT, sync);
    window.addEventListener("storage", sync); // other tabs
    return () => {
      window.removeEventListener(CONSENT_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  useEffect(() => {
    if (!granted || pushed.current) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
      pushed.current = true;
    } catch {
      /* adsbygoogle not ready yet — it will be retried if granted flips again */
    }
  }, [granted]);

  // Pre-consent: render nothing. Any layout change happens only after the user
  // interacts with the consent banner, so it isn't counted against CLS.
  if (!granted) return null;

  return (
    <div className={className}>
      <p className="label mb-1.5 text-center text-text-muted/50">Advertisement</p>
      <ins
        className="adsbygoogle"
        style={{ display: "block", minHeight }}
        data-ad-client={ADS_CLIENT}
        data-ad-slot={slot}
        data-ad-format={format}
        data-full-width-responsive="true"
      />
    </div>
  );
}
