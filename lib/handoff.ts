"use client";

import { useEffect, useRef } from "react";

/**
 * Tool chaining handoff. A tool can hand its output file(s) to another tool
 * ("send result to…") without a re-upload. State lives at module scope, which
 * survives Next.js App-Router client navigations (single SPA runtime). It is
 * intentionally cleared on a full page reload — chaining is a same-session
 * action, and files should never be persisted to storage.
 */

type Handoff = { files: File[]; from: string };

let pending: Handoff | null = null;

export function setHandoff(files: File[], from: string) {
  pending = files.length ? { files, from } : null;
}

/** Consume the pending handoff (one-shot). */
export function takeHandoff(): Handoff | null {
  const p = pending;
  pending = null;
  return p;
}

/** Convert a result Blob into a File suitable for re-feeding into a tool. */
export function blobToFile(blob: Blob, name: string): File {
  return new File([blob], name, {
    type: blob.type || "application/octet-stream",
  });
}

/**
 * On mount, if another tool handed files to this one, feed them in. Runs once.
 */
export function useHandoffIntake(onFiles: (files: File[]) => void) {
  const ref = useRef(onFiles);
  ref.current = onFiles;
  useEffect(() => {
    const h = takeHandoff();
    if (h && h.files.length) ref.current(h.files);
  }, []);
}
