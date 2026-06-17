"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { UploadCloud, AlertCircle, ClipboardPaste } from "lucide-react";
import { cn } from "@/lib/utils";

export type DropZoneProps = {
  /** Accepted extensions (".pdf") and/or mime types ("image/*"). */
  acceptedTypes: string[];
  multiple?: boolean;
  maxSizeMB?: number;
  /** Friendly label of accepted types, e.g. "JPG, PNG, WebP". */
  acceptedLabel?: string;
  onFilesAccepted: (files: File[]) => void;
  className?: string;
  compact?: boolean;
  /** Listen for clipboard paste (Ctrl/⌘+V) while this zone is mounted. */
  enablePaste?: boolean;
};

function matchesAccept(file: File, acceptedTypes: string[]): boolean {
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();
  return acceptedTypes.some((a) => {
    const accept = a.toLowerCase();
    if (accept.startsWith(".")) return name.endsWith(accept);
    if (accept.endsWith("/*")) return type.startsWith(accept.slice(0, -1));
    return type === accept;
  });
}

export function DropZone({
  acceptedTypes,
  multiple = false,
  maxSizeMB = 50,
  acceptedLabel,
  onFilesAccepted,
  className,
  compact = false,
  enablePaste = true,
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  // Counter avoids drag-state flicker when moving over child elements.
  const dragDepth = useRef(0);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pasted, setPasted] = useState(false);

  const handleFiles = useCallback(
    (incoming: File[]) => {
      if (incoming.length === 0) return;
      setError(null);
      const accepted: File[] = [];

      for (const file of incoming) {
        if (!matchesAccept(file, acceptedTypes)) {
          setError(`"${file.name}" is not a supported file type.`);
          continue;
        }
        if (file.size > maxSizeMB * 1024 * 1024) {
          setError(`"${file.name}" is too large. Maximum size is ${maxSizeMB}MB.`);
          continue;
        }
        accepted.push(file);
      }

      if (accepted.length > 0) {
        onFilesAccepted(multiple ? accepted : accepted.slice(0, 1));
      }
    },
    [acceptedTypes, maxSizeMB, multiple, onFilesAccepted]
  );

  // Paste from clipboard — captures images/files unless the user is typing.
  useEffect(() => {
    if (!enablePaste) return;
    const onPaste = (e: ClipboardEvent) => {
      const ae = document.activeElement as HTMLElement | null;
      const tag = ae?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || ae?.isContentEditable) return;
      const files = e.clipboardData ? Array.from(e.clipboardData.files) : [];
      const usable = files.filter((f) => matchesAccept(f, acceptedTypes));
      if (usable.length === 0) return;
      e.preventDefault();
      setPasted(true);
      window.setTimeout(() => setPasted(false), 1200);
      handleFiles(usable);
    };
    window.addEventListener("paste", onPaste);
    return () => window.removeEventListener("paste", onPaste);
  }, [enablePaste, acceptedTypes, handleFiles]);

  const setDragging = (active: boolean) => {
    dragDepth.current = active
      ? dragDepth.current + 1
      : Math.max(0, dragDepth.current - 1);
    setIsDragging(dragDepth.current > 0);
  };

  return (
    <div className={className}>
      <button
        type="button"
        aria-label={
          acceptedLabel ? `Upload ${acceptedLabel}` : "Upload a file"
        }
        onClick={() => inputRef.current?.click()}
        onDragEnter={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          dragDepth.current = 0;
          setIsDragging(false);
          handleFiles(Array.from(e.dataTransfer.files));
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-all duration-200",
          compact ? "p-6" : "p-10 sm:p-14",
          isDragging
            ? "border-primary bg-primary/5 ring-4 ring-primary/10"
            : pasted
            ? "border-secondary bg-secondary/5"
            : error
            ? "border-red-500/60 bg-red-500/5"
            : "border-border bg-surface hover:border-primary/50 hover:bg-surface/60"
        )}
      >
        <div
          className={cn(
            "mb-3 flex items-center justify-center rounded-full border border-border bg-background transition-colors",
            compact ? "h-12 w-12" : "h-16 w-16",
            isDragging && "border-primary text-primary",
            pasted && "border-secondary text-secondary"
          )}
        >
          {pasted ? (
            <ClipboardPaste
              className={compact ? "h-5 w-5" : "h-7 w-7"}
              aria-hidden="true"
            />
          ) : (
            <UploadCloud
              className={compact ? "h-5 w-5" : "h-7 w-7"}
              aria-hidden="true"
            />
          )}
        </div>
        <p className="font-semibold tracking-tight text-text-primary">
          {isDragging
            ? multiple
              ? "Drop your files here"
              : "Drop your file here"
            : pasted
            ? "Pasted from clipboard"
            : "Drag & drop, paste, or click to upload"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {acceptedLabel ? `Accepts ${acceptedLabel}` : "Select a file to begin"}
          {maxSizeMB ? ` · up to ${maxSizeMB}MB` : ""}
        </p>
        {enablePaste && !compact && (
          <p className="mt-2 hidden items-center gap-1.5 text-[11px] text-text-muted/80 sm:inline-flex">
            <ClipboardPaste className="h-3 w-3" aria-hidden="true" />
            Tip: paste a screenshot or file with
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              Ctrl
            </kbd>
            +
            <kbd className="rounded border border-border bg-background px-1.5 py-0.5 font-mono text-[10px] text-text-muted">
              V
            </kbd>
          </p>
        )}
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            handleFiles(Array.from(e.target.files ?? []));
            // Reset so selecting the same file again re-triggers change
            e.target.value = "";
          }}
        />
      </button>

      {error && (
        <p
          role="alert"
          className="mt-3 flex items-center gap-2 text-sm text-red-400"
        >
          <AlertCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
          {error}
        </p>
      )}
    </div>
  );
}
