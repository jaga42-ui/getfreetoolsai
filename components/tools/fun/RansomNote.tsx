"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Check, Download, Link2, Shuffle } from "lucide-react";
import { Button } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { canvasToBlob } from "@/lib/pdfjs";
import {
  drawRansomNote,
  ransomDefaults,
  decodeRansomState,
  encodeRansomState,
  type RansomBackground,
  type RansomContent,
} from "@/lib/ransomNote";

const inputCls =
  "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none";

const BACKGROUNDS: { id: RansomBackground; label: string }[] = [
  { id: "newsprint", label: "Newsprint" },
  { id: "plain", label: "White" },
  { id: "dark", label: "Dark" },
];

export default function RansomNote() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [c, setC] = useState<RansomContent>(ransomDefaults);
  const [copied, setCopied] = useState(false);

  // Reopen a shared note. Read once on mount: after this the fields own the
  // state, so re-reading would fight the user's edits.
  useEffect(() => {
    if (window.location.search.length > 1) {
      setC(decodeRansomState(window.location.search.slice(1)));
    }
  }, []);

  useEffect(() => {
    if (canvasRef.current) drawRansomNote(canvasRef.current, c);
  }, [c]);

  const set = <K extends keyof RansomContent>(k: K, v: RansomContent[K]) =>
    setC((prev) => ({ ...prev, [k]: v }));

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, "ransom-note.png");
  };

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}?${encodeRansomState(c)}`;
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
          <label className="block text-sm">
            <span className="mb-1.5 block text-text-muted">Your message</span>
            <textarea
              value={c.text}
              maxLength={160}
              rows={3}
              onChange={(e) => set("text", e.target.value)}
              className={`${inputCls} resize-y`}
              placeholder="Type the note&hellip;"
            />
          </label>

          <fieldset>
            <legend className="mb-1.5 text-sm text-text-muted">Background</legend>
            <div className="flex flex-wrap gap-2">
              {BACKGROUNDS.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  aria-pressed={c.background === b.id}
                  onClick={() => set("background", b.id)}
                  className={`rounded-lg border px-3 py-1.5 text-sm transition ${
                    c.background === b.id
                      ? "border-primary bg-primary/10 text-text-primary"
                      : "border-border text-text-muted hover:border-primary/50"
                  }`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </fieldset>

          <label className="flex items-center gap-2 text-sm text-text-primary">
            <input
              type="checkbox"
              checked={c.jitter}
              onChange={(e) => set("jitter", e.target.checked)}
              className="h-4 w-4 accent-primary"
            />
            Tilt the letters
          </label>

          <div className="flex flex-wrap gap-2 pt-1">
            <Button onClick={download} icon={Download}>
              Download PNG
            </Button>
            <Button
              onClick={() => set("variation", c.variation + 1)}
              variant="outline"
              icon={Shuffle}
            >
              Shuffle letters
            </Button>
            <Button
              onClick={copyLink}
              variant="outline"
              icon={copied ? Check : Link2}
            >
              {copied ? "Link copied" : "Copy link to this note"}
            </Button>
          </div>
        </div>

        <div className="min-w-0">
          <canvas
            ref={canvasRef}
            className="w-full rounded-lg"
            aria-label="Preview of the ransom note you are creating"
          />
        </div>
      </div>
    </div>
  );
}
