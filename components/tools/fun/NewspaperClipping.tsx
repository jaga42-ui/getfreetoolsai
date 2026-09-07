"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, Link2 } from "lucide-react";
import { Button } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { canvasToBlob } from "@/lib/pdfjs";
import {
  drawClipping,
  clippingDefaults,
  decodeClippingState,
  encodeClippingState,
  clampTilt,
  TILT_LIMIT,
  type ClippingContent,
} from "@/lib/newspaperClipping";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none";

function Field({
  label,
  value,
  onChange,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  maxLength?: number;
}) {
  return (
    <label className="block text-sm">
      <span className="mb-1.5 block text-text-muted">{label}</span>
      <input
        value={value}
        maxLength={maxLength}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      />
    </label>
  );
}

export default function NewspaperClipping() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [c, setC] = useState<ClippingContent>(clippingDefaults);
  const [copied, setCopied] = useState(false);

  // Reopen a shared clipping. Read once on mount: after this the fields own
  // the state, so re-reading would fight the user's edits.
  useEffect(() => {
    if (window.location.search.length > 1) {
      setC(decodeClippingState(window.location.search.slice(1)));
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) drawClipping(canvasRef.current, c);
  }, [c]);

  const set = <K extends keyof ClippingContent>(k: K, v: ClippingContent[K]) =>
    setC((prev) => ({ ...prev, [k]: v }));

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, "newspaper-clipping.png");
  };

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}?${encodeClippingState(c)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some embedded contexts; put the URL in the
      // address bar so it can still be copied by hand.
      window.history.replaceState(null, "", url);
    }
  }, [c]);

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-6 lg:grid-cols-[minmax(0,20rem)_minmax(0,1fr)]">
        <div className="space-y-4">
          <Field
            label="Newspaper name"
            value={c.paper}
            onChange={(v) => set("paper", v)}
            maxLength={40}
          />
          <Field
            label="Date"
            value={c.date}
            onChange={(v) => set("date", v)}
            maxLength={48}
          />
          <label className="block text-sm">
            <span className="mb-1.5 block text-text-muted">Headline</span>
            <textarea
              value={c.headline}
              maxLength={120}
              rows={2}
              onChange={(e) => set("headline", e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1.5 block text-text-muted">
              Story <span className="text-text-muted/70">— blank line starts a new paragraph</span>
            </span>
            <textarea
              value={c.body}
              maxLength={1200}
              rows={7}
              onChange={(e) => set("body", e.target.value)}
              className={`${inputCls} resize-y`}
            />
          </label>

          <label className="block text-sm">
            <span className="mb-1.5 block text-text-muted">
              Tilt: {c.tilt}&deg;
            </span>
            <input
              type="range"
              min={-TILT_LIMIT}
              max={TILT_LIMIT}
              step={1}
              value={c.tilt}
              onChange={(e) => set("tilt", clampTilt(Number(e.target.value)))}
              className="w-full accent-primary"
            />
          </label>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={c.aged}
              onChange={(e) => set("aged", e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Aged, yellowed paper
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={download} icon={Download}>
              Download PNG
            </Button>
            <Button
              onClick={copyLink}
              variant="outline"
              icon={copied ? Check : Link2}
            >
              {copied ? "Link copied" : "Copy link to this clipping"}
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg"
            aria-label="Preview of the newspaper clipping you are creating"
          />
        </div>
      </div>
    </div>
  );
}
