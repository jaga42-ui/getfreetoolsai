"use client";

import { useCallback, useRef, useState } from "react";
import { UploadCloud, AlertCircle } from "lucide-react";
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
}: DropZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = useCallback(
    (fileList: FileList | null) => {
      if (!fileList || fileList.length === 0) return;
      setError(null);
      const incoming = Array.from(fileList);
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

  return (
    <div className={className}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setIsDragging(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragging(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "flex w-full flex-col items-center justify-center rounded-xl border-2 border-dashed text-center transition-all duration-200",
          compact ? "p-6" : "p-10 sm:p-14",
          isDragging
            ? "border-primary bg-primary/5"
            : error
            ? "border-red-500/60 bg-red-500/5"
            : "border-border bg-surface hover:border-primary/50 hover:bg-surface/60"
        )}
      >
        <div
          className={cn(
            "mb-3 flex items-center justify-center rounded-full border border-border bg-background transition-colors",
            compact ? "h-12 w-12" : "h-16 w-16",
            isDragging && "border-primary text-primary"
          )}
        >
          <UploadCloud className={compact ? "h-5 w-5" : "h-7 w-7"} />
        </div>
        <p className="font-semibold tracking-tight text-text-primary">
          {isDragging ? "Drop your file here" : "Drag & Drop or Click to Upload"}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          {acceptedLabel ? `Accepts ${acceptedLabel}` : "Select a file to begin"}
          {maxSizeMB ? ` · up to ${maxSizeMB}MB` : ""}
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={acceptedTypes.join(",")}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            handleFiles(e.target.files);
            // Reset so selecting the same file again re-triggers change
            e.target.value = "";
          }}
        />
      </button>

      {error && (
        <p className="mt-3 flex items-center gap-2 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
