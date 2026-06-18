"use client";

import { useState } from "react";
import {
  RefreshCw,
  FileText,
  MapPin,
  ShieldAlert,
  ShieldCheck,
  ScanSearch,
} from "lucide-react";
import Link from "next/link";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { formatBytes } from "@/lib/utils";

type Row = { label: string; value: string; sensitive?: boolean };
type Scan = {
  kind: "image" | "pdf";
  rows: Row[];
  gps: { lat: number; lng: number } | null;
} | null;

// Keys that can identify you, your device or your location.
const SENSITIVE = new Set([
  "Make", "Model", "LensModel", "LensMake", "SerialNumber", "BodySerialNumber",
  "InternalSerialNumber", "Software", "Artist", "Copyright", "HostComputer",
  "OwnerName", "CameraOwnerName", "DateTimeOriginal", "CreateDate", "ModifyDate",
  "GPSLatitude", "GPSLongitude", "GPSDateStamp",
  // PDF
  "Author", "Creator", "Producer", "CreationDate", "ModificationDate",
]);

const LABELS: Record<string, string> = {
  Make: "Camera make",
  Model: "Camera model",
  LensModel: "Lens",
  ISO: "ISO",
  FNumber: "Aperture (f-number)",
  ExposureTime: "Shutter speed",
  FocalLength: "Focal length",
  DateTimeOriginal: "Date taken",
  CreateDate: "Created",
  ModifyDate: "Modified",
  Software: "Software",
  Artist: "Author / artist",
  Copyright: "Copyright",
  SerialNumber: "Camera serial number",
  BodySerialNumber: "Body serial number",
  HostComputer: "Computer",
  Orientation: "Orientation",
  // PDF
  Title: "Title",
  Author: "Author",
  Subject: "Subject",
  Keywords: "Keywords",
  Creator: "Creating app",
  Producer: "Producer",
  CreationDate: "Created",
  ModificationDate: "Modified",
};

function fmt(v: unknown): string | null {
  if (v == null) return null;
  if (v instanceof Date) return isNaN(v.getTime()) ? null : v.toLocaleString();
  if (typeof v === "number") return Number.isInteger(v) ? String(v) : v.toFixed(4).replace(/\.?0+$/, "");
  if (typeof v === "boolean") return v ? "Yes" : "No";
  if (typeof v === "string") return v.trim() ? v.trim() : null;
  if (Array.isArray(v)) {
    const parts = v.map(fmt).filter(Boolean);
    return parts.length ? parts.join(", ") : null;
  }
  return null; // skip objects / binary blobs (thumbnails, maker notes, etc.)
}

const SKIP = /thumbnail|makernote|applicationnotes|xmp|^padding$|userdata/i;

export default function MetadataViewer() {
  const [file, setFile] = useState<File | null>(null);
  const [scan, setScan] = useState<Scan>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const reset = () => {
    setFile(null);
    setScan(null);
    setError("");
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setScan(null);
    setBusy(true);
    try {
      const isPdf = /\.pdf$/i.test(f.name) || f.type === "application/pdf";
      if (isPdf) {
        const { PDFDocument } = await import("pdf-lib");
        const doc = await PDFDocument.load(await f.arrayBuffer(), {
          ignoreEncryption: true,
          updateMetadata: false,
        });
        const raw: Record<string, unknown> = {
          Title: doc.getTitle(),
          Author: doc.getAuthor(),
          Subject: doc.getSubject(),
          Keywords: doc.getKeywords(),
          Creator: doc.getCreator(),
          Producer: doc.getProducer(),
          CreationDate: safeDate(() => doc.getCreationDate()),
          ModificationDate: safeDate(() => doc.getModificationDate()),
        };
        setScan({ kind: "pdf", rows: toRows(raw), gps: null });
      } else {
        const exifr = (await import("exifr")).default;
        // `true` = parse every segment (EXIF/IFD0/GPS/IPTC/…) into a merged object.
        const data = (await exifr.parse(f, true)) as
          | Record<string, unknown>
          | undefined;
        const gps =
          data && typeof data.latitude === "number" && typeof data.longitude === "number"
            ? { lat: data.latitude, lng: data.longitude }
            : null;
        setScan({ kind: "image", rows: toRows(data ?? {}), gps });
      }
    } catch {
      setError("Could not read this file. Try a JPG, PNG, HEIC, TIFF or PDF.");
    } finally {
      setBusy(false);
    }
  };

  const sensitiveCount = scan
    ? scan.rows.filter((r) => r.sensitive).length + (scan.gps ? 1 : 0)
    : 0;

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf", "image/jpeg", "image/png", "image/webp", "image/tiff", "image/heic", ".heic"]}
          acceptedLabel="a photo (JPG, PNG, HEIC, TIFF) or PDF"
          maxSizeMB={50}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">{file.name}</p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Scan another
            </Button>
          </div>

          <ErrorMessage message={error} />

          {busy && (
            <p className="mt-5 flex items-center gap-2 text-sm text-text-muted">
              <ScanSearch className="h-4 w-4 animate-pulse" /> Scanning for hidden metadata…
            </p>
          )}

          {scan && !busy && (
            <>
              {/* Summary banner */}
              {scan.gps ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-[#c0563a]/40 bg-[#c0563a]/[0.06] p-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#9c4828]" />
                  <div className="text-sm text-text-primary">
                    <p className="font-semibold text-[#9c4828]">This file reveals an exact location.</p>
                    <p className="mt-1">
                      GPS: {scan.gps.lat.toFixed(6)}, {scan.gps.lng.toFixed(6)} ·{" "}
                      <a
                        className="font-medium text-primary underline"
                        href={`https://www.openstreetmap.org/?mlat=${scan.gps.lat}&mlon=${scan.gps.lng}#map=16/${scan.gps.lat}/${scan.gps.lng}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        view on map
                      </a>
                    </p>
                  </div>
                </div>
              ) : sensitiveCount > 0 ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-amber-500/40 bg-amber-500/[0.07] p-4">
                  <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold">This file carries identifying metadata</span> — device, software, dates or author details are embedded below.
                  </p>
                </div>
              ) : scan.rows.length === 0 ? (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold text-secondary">No embedded metadata found.</span> This file looks clean — nothing identifying to strip.
                  </p>
                </div>
              ) : (
                <div className="mt-4 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
                  <p className="text-sm text-text-primary">
                    <span className="font-semibold text-secondary">No location or identifying device data found.</span> Some harmless technical metadata is listed below.
                  </p>
                </div>
              )}

              {/* Metadata table */}
              {scan.rows.length > 0 && (
                <div className="mt-4 overflow-hidden rounded-xl border border-border">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-border">
                      {scan.rows.map((r, i) => (
                        <tr key={i} className={r.sensitive ? "bg-[#c0563a]/[0.04]" : ""}>
                          <td className="w-2/5 px-4 py-2.5 align-top text-text-muted">
                            <span className="flex items-center gap-1.5">
                              {r.sensitive && <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#c0563a]" aria-hidden="true" />}
                              {r.label}
                            </span>
                          </td>
                          <td className="break-words px-4 py-2.5 font-mono text-[13px] text-text-primary">{r.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* CTA to strip it */}
              {(scan.gps || sensitiveCount > 0) && scan.kind === "image" && (
                <div className="mt-4 flex flex-wrap items-center gap-3 rounded-xl border border-border bg-background p-4">
                  <p className="flex-1 text-sm text-text-muted">
                    Want to share this photo without the hidden data?
                  </p>
                  <Link
                    href="/image/remove-exif"
                    className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-[#fbf8f1] transition-colors hover:bg-[#9c4828]"
                  >
                    Remove metadata
                  </Link>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

function safeDate(fn: () => Date | undefined): Date | undefined {
  try {
    return fn();
  } catch {
    return undefined;
  }
}

function toRows(raw: Record<string, unknown>): Row[] {
  const rows: Row[] = [];
  for (const [key, val] of Object.entries(raw)) {
    if (key === "latitude" || key === "longitude") continue; // shown in banner
    if (SKIP.test(key)) continue;
    const value = fmt(val);
    if (value == null) continue;
    rows.push({
      label: LABELS[key] ?? key.replace(/([a-z])([A-Z])/g, "$1 $2"),
      value: value.length > 300 ? value.slice(0, 300) + "…" : value,
      sensitive: SENSITIVE.has(key),
    });
  }
  // sensitive first, then alphabetical
  return rows.sort((a, b) =>
    a.sensitive === b.sensitive ? a.label.localeCompare(b.label) : a.sensitive ? -1 : 1
  );
}
