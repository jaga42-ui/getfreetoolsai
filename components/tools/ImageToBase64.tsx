"use client";

import { useState } from "react";
import { RefreshCw } from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, SegmentedControl, ErrorMessage } from "@/components/ui";
import { CopyButton } from "@/components/tools/text/shared";

type Mode = "datauri" | "css" | "html";

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result));
    r.onerror = () => reject(new Error("Could not read this file."));
    r.readAsDataURL(file);
  });
}

export default function ImageToBase64() {
  const [dataUri, setDataUri] = useState("");
  const [name, setName] = useState("");
  const [size, setSize] = useState(0);
  const [mode, setMode] = useState<Mode>("datauri");
  const [error, setError] = useState("");

  const onFile = async (files: File[]) => {
    setError("");
    try {
      const uri = await readAsDataURL(files[0]);
      setDataUri(uri);
      setName(files[0].name);
      setSize(uri.length);
    } catch {
      setError("Could not read this image.");
    }
  };

  const output =
    mode === "css"
      ? `background-image: url("${dataUri}");`
      : mode === "html"
      ? `<img src="${dataUri}" alt="${name.replace(/\.[^.]+$/, "")}" />`
      : dataUri;

  const reset = () => {
    setDataUri("");
    setName("");
    setSize(0);
  };

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!dataUri ? (
        <DropZone
          acceptedTypes={["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"]}
          acceptedLabel="JPG, PNG, WebP, GIF, SVG"
          maxSizeMB={10}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={dataUri}
                alt={name}
                className="h-14 w-14 rounded-lg border border-border object-contain"
              />
              <div className="text-sm">
                <p className="font-medium text-text-primary">{name}</p>
                <p className="text-text-muted">
                  {(size / 1024).toFixed(1)} KB encoded
                </p>
              </div>
            </div>
            <SegmentedControl<Mode>
              value={mode}
              onChange={setMode}
              options={[
                { value: "datauri", label: "Data URI" },
                { value: "css", label: "CSS" },
                { value: "html", label: "HTML" },
              ]}
            />
          </div>

          <textarea
            readOnly
            value={output}
            rows={8}
            onFocus={(e) => e.currentTarget.select()}
            className="mt-4 w-full resize-y break-all rounded-lg border border-border bg-background p-3 font-mono text-xs text-text-primary focus:border-primary focus:outline-none"
          />

          <ErrorMessage message={error} />

          <div className="mt-4 flex flex-wrap items-center gap-3">
            <CopyButton text={output} label="Copy code" />
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Start over
            </Button>
          </div>

          <p className="mt-3 text-xs leading-relaxed text-text-muted">
            Base64 embedding avoids an extra network request but is about 33%
            larger than the file — best for small icons and inline assets.
          </p>
        </>
      )}
      {!dataUri && <ErrorMessage message={error} />}
    </div>
  );
}
