"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Check, Download, Link2 } from "lucide-react";
import { Button, SegmentedControl } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { canvasToBlob } from "@/lib/pdfjs";
import {
  drawDialog,
  decodeDialogState,
  encodeDialogState,
  type DialogContent,
  type DialogIcon,
} from "@/lib/errorDialog";
import { errorStyles, type ErrorChrome } from "@/lib/errorStyles";

const WIN10 = errorStyles.find((s) => s.slug === "windows-10")!;

export default function FakeError({
  chrome = WIN10.chrome,
  defaults = WIN10.defaults,
  filename = "fake-error.png",
}: {
  chrome?: ErrorChrome;
  defaults?: { title: string; message: string; buttons: string };
  filename?: string;
}) {
  const seed: DialogContent = {
    icon: "error",
    title: defaults.title,
    message: defaults.message,
    buttons: defaults.buttons.split(",").map((b) => b.trim()).filter(Boolean),
  };

  const [icon, setIcon] = useState<DialogIcon>(seed.icon);
  const [title, setTitle] = useState(seed.title);
  const [message, setMessage] = useState(seed.message);
  const [buttons, setButtons] = useState(defaults.buttons);
  const [copied, setCopied] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Hydrate from a shared link. Done in an effect rather than in the initial
  // state so the server-rendered markup and the first client render agree.
  useEffect(() => {
    if (!window.location.search) return;
    const s = decodeDialogState(window.location.search, seed);
    setIcon(s.icon);
    setTitle(s.title);
    setMessage(s.message);
    setButtons(s.buttons.join(", "));
    // Seed is derived from props that do not change for a given route.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Memoised so `copyLink`'s identity is stable between renders.
  const content: DialogContent = useMemo(
    () => ({
      icon,
      title,
      message,
      buttons: buttons.split(",").map((b) => b.trim()).filter(Boolean),
    }),
    [icon, title, message, buttons]
  );

  useEffect(() => {
    if (canvasRef.current) drawDialog(canvasRef.current, chrome, content);
  });

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, filename);
  };

  const copyLink = useCallback(async () => {
    const url = `${window.location.origin}${window.location.pathname}?${encodeDialogState(content)}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      // Clipboard is blocked in some embedded contexts; put the URL in the
      // address bar instead so it can still be copied by hand.
      window.history.replaceState(null, "", url);
    }
  }, [content]);

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm text-text-muted">Icon</span>
            <SegmentedControl<DialogIcon>
              value={icon}
              onChange={setIcon}
              options={[
                { value: "error", label: "Error" },
                { value: "warning", label: "Warning" },
                { value: "info", label: "Info" },
                { value: "success", label: "Success" },
              ]}
            />
          </div>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">
              {chrome.layout === "mac" ? "Headline" : "Title bar text"}
            </span>
            <input value={title} onChange={(e) => setTitle(e.target.value)} className={inputCls} />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Message</span>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className={inputCls + " resize-y"}
            />
          </label>
          <label className="block text-sm">
            <span className="mb-1 block text-text-muted">Buttons (comma-separated)</span>
            <input value={buttons} onChange={(e) => setButtons(e.target.value)} className={inputCls} />
          </label>
        </div>

        <div
          className="flex items-start justify-center rounded-xl border border-border p-4"
          style={{ background: chrome.desktop }}
        >
          <canvas
            ref={canvasRef}
            className="h-auto w-full shadow-lg"
            style={{ maxWidth: chrome.width }}
          />
        </div>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <Button size="lg" variant="success" icon={Download} onClick={download}>
          Download PNG
        </Button>
        <Button size="lg" variant="outline" icon={copied ? Check : Link2} onClick={copyLink}>
          {copied ? "Link copied" : "Copy link to this popup"}
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes and harmless pranks only. Everything is drawn on your device —
        nothing is uploaded.
      </p>
    </div>
  );
}
