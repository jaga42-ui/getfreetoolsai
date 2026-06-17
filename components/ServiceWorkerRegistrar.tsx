"use client";

import { useEffect } from "react";

/**
 * Registers the service worker (public/sw.js) in production only — registering
 * in dev would cache the dev server's assets and cause confusing stale reloads.
 * Renders nothing. The SW itself is network-first for navigations, so this is
 * safe to mount globally.
 */
export function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;

    const register = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* registration failed — the site works fine without the SW */
      });
    };

    // Register after load so it never competes with the initial render.
    if (document.readyState === "complete") {
      register();
    } else {
      window.addEventListener("load", register, { once: true });
      return () => window.removeEventListener("load", register);
    }
  }, []);

  return null;
}
