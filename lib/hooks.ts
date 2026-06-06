"use client";

import { useEffect, useRef, useState } from "react";

/**
 * useState that persists to localStorage so a tool remembers the user's
 * last-used settings between visits. Reads on mount (in an effect) to avoid
 * SSR hydration mismatches — first paint uses `initial`, then hydrates.
 */
export function usePersistentState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(initial);
  const loaded = useRef(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setState(JSON.parse(raw) as T);
    } catch {
      /* ignore unreadable storage */
    }
    loaded.current = true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  useEffect(() => {
    if (!loaded.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(state));
    } catch {
      /* ignore quota / private-mode errors */
    }
  }, [key, state]);

  return [state, setState] as const;
}

type ShortcutOpts = {
  /** Primary action (Enter). */
  onRun?: () => void;
  /** Reset / start over (Escape). */
  onReset?: () => void;
  /** When false, Enter does nothing (e.g. nothing to run yet). */
  runEnabled?: boolean;
};

/**
 * Tool keyboard shortcuts: Enter runs the primary action, Escape resets.
 * Ignored while the user is typing in a field or focused on a button (so it
 * never double-fires). Listener is registered once and reads latest handlers
 * via a ref.
 */
export function useToolShortcuts(opts: ShortcutOpts) {
  const ref = useRef(opts);
  ref.current = opts;

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const { onRun, onReset, runEnabled = true } = ref.current;
      const ae = document.activeElement as HTMLElement | null;
      const tag = ae?.tagName;
      const typing =
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        !!ae?.isContentEditable;

      if (e.key === "Enter" && !typing && tag !== "BUTTON" && tag !== "A") {
        if (runEnabled && onRun) {
          e.preventDefault();
          onRun();
        }
      } else if (e.key === "Escape" && onReset) {
        onReset();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
}
