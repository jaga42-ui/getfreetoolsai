"use client";

import { useState } from "react";
import { Upload, Trash2 } from "lucide-react";
import { CopyButton, Panel } from "@/components/dev/ui";

type Swatch = { hex: string; rgb: string };

function extractPalette(img: HTMLImageElement, n = 6): Swatch[] {
  const canvas = document.createElement("canvas");
  const w = (canvas.width = 80);
  const h = (canvas.height = Math.max(1, Math.round((80 * img.naturalHeight) / img.naturalWidth)));
  const ctx = canvas.getContext("2d");
  if (!ctx) return [];
  ctx.drawImage(img, 0, 0, w, h);
  const data = ctx.getImageData(0, 0, w, h).data;
  const map = new Map<string, { count: number; r: number; g: number; b: number }>();
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 128) continue;
    const r = data[i], g = data[i + 1], b = data[i + 2];
    const key = `${r >> 4}-${g >> 4}-${b >> 4}`;
    const e = map.get(key);
    if (e) { e.count++; e.r += r; e.g += g; e.b += b; }
    else map.set(key, { count: 1, r, g, b });
  }
  return Array.from(map.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, n)
    .map((e) => {
      const r = Math.round(e.r / e.count), g = Math.round(e.g / e.count), b = Math.round(e.b / e.count);
      const hex = "#" + [r, g, b].map((x) => x.toString(16).padStart(2, "0")).join("");
      return { hex: hex.toUpperCase(), rgb: `rgb(${r}, ${g}, ${b})` };
    });
}

export default function ColorPalette() {
  const [preview, setPreview] = useState<string | null>(null);
  const [palette, setPalette] = useState<Swatch[]>([]);

  const onFile = (file?: File) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setPreview(url);
    const img = new Image();
    img.onload = () => setPalette(extractPalette(img));
    img.src = url;
  };

  return (
    <div className="space-y-4">
      {!preview ? (
        <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-zinc-800 bg-zinc-900/40 p-10 text-center transition-colors hover:border-emerald-500/40 hover:bg-zinc-900/70">
          <span className="flex h-12 w-12 items-center justify-center rounded-full border border-zinc-700 text-emerald-400"><Upload className="h-5 w-5" /></span>
          <span className="font-medium text-zinc-200">Upload an image</span>
          <span className="text-xs text-zinc-500">JPG, PNG or WebP · processed in your browser</span>
          <input type="file" accept="image/*" className="hidden" onChange={(e) => onFile(e.target.files?.[0])} />
        </label>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <Panel label="Image" actions={<button onClick={() => { setPreview(null); setPalette([]); }} className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800/60 px-2.5 py-1.5 text-xs font-medium text-zinc-300 hover:bg-zinc-800"><Trash2 className="h-3.5 w-3.5" /> Reset</button>}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Uploaded" className="max-h-72 w-full rounded-lg border border-zinc-800 object-contain" />
          </Panel>
          <Panel label={`${palette.length} dominant colours`}>
            <div className="space-y-2">
              {palette.map((s) => (
                <div key={s.hex} className="flex items-center gap-3 rounded-lg border border-zinc-800 bg-zinc-900/70 p-2">
                  <span className="h-9 w-9 shrink-0 rounded-md border border-zinc-700" style={{ backgroundColor: s.hex }} />
                  <div className="min-w-0 flex-1">
                    <code className="block font-mono text-[13px] text-zinc-100">{s.hex}</code>
                    <code className="block font-mono text-[11px] text-zinc-500">{s.rgb}</code>
                  </div>
                  <CopyButton value={s.hex} className="shrink-0" />
                </div>
              ))}
            </div>
          </Panel>
        </div>
      )}
      <p className="text-xs text-zinc-500">Your image is decoded on a canvas in your browser and never uploaded to any server.</p>
    </div>
  );
}
