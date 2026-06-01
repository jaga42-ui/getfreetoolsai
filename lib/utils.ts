import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Human-readable byte size, e.g. 1.2 MB / 340 KB */
export function formatBytes(bytes: number, decimals = 1): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(decimals))} ${sizes[i]}`;
}

/** Wrap raw bytes (e.g. pdf-lib's save() output) into a typed Blob. */
export function bytesToBlob(bytes: Uint8Array, type: string): Blob {
  return new Blob([bytes as unknown as BlobPart], { type });
}

/** Trigger a browser download for a Blob */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  // Revoke after a tick so the download has time to start
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

/**
 * Parse a printer-style page range string like "1,3,5-8,12"
 * into a sorted, de-duplicated array of 1-based page numbers,
 * clamped to [1, totalPages].
 */
export function parsePageRanges(input: string, totalPages: number): number[] {
  const pages = new Set<number>();
  const parts = input.split(",").map((p) => p.trim()).filter(Boolean);
  for (const part of parts) {
    if (part.includes("-")) {
      const [startStr, endStr] = part.split("-").map((s) => s.trim());
      let start = parseInt(startStr, 10);
      let end = parseInt(endStr, 10);
      if (Number.isNaN(start) || Number.isNaN(end)) continue;
      if (start > end) [start, end] = [end, start];
      for (let i = start; i <= end; i++) {
        if (i >= 1 && i <= totalPages) pages.add(i);
      }
    } else {
      const n = parseInt(part, 10);
      if (!Number.isNaN(n) && n >= 1 && n <= totalPages) pages.add(n);
    }
  }
  return Array.from(pages).sort((a, b) => a - b);
}
