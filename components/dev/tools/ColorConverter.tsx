"use client";

import { useMemo, useState } from "react";
import { CopyButton, Panel, Labeled, inputClass } from "@/components/dev/ui";

type RGBA = { r: number; g: number; b: number; a: number };

const clamp = (n: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, n));

function parseColor(input: string): RGBA | null {
  const s = input.trim().toLowerCase();
  if (!s) return null;

  // #hex (3, 4, 6, 8)
  const hex = s.replace(/^#/, "");
  if (/^[0-9a-f]+$/.test(hex) && [3, 4, 6, 8].includes(hex.length)) {
    const exp =
      hex.length <= 4
        ? hex.split("").map((c) => c + c).join("")
        : hex;
    const r = parseInt(exp.slice(0, 2), 16);
    const g = parseInt(exp.slice(2, 4), 16);
    const b = parseInt(exp.slice(4, 6), 16);
    const a = exp.length === 8 ? parseInt(exp.slice(6, 8), 16) / 255 : 1;
    return { r, g, b, a };
  }

  const rgbM = s.match(/^rgba?\(([^)]+)\)$/);
  if (rgbM) {
    const p = rgbM[1].split(/[,/]+/).map((x) => x.trim());
    if (p.length >= 3) {
      return {
        r: clamp(Math.round(parseFloat(p[0])), 0, 255),
        g: clamp(Math.round(parseFloat(p[1])), 0, 255),
        b: clamp(Math.round(parseFloat(p[2])), 0, 255),
        a: p[3] !== undefined ? clamp(parseFloat(p[3]), 0, 1) : 1,
      };
    }
  }

  const hslM = s.match(/^hsla?\(([^)]+)\)$/);
  if (hslM) {
    const p = hslM[1].split(/[,/]+/).map((x) => x.trim());
    if (p.length >= 3) {
      const h = parseFloat(p[0]);
      const sl = parseFloat(p[1]) / 100;
      const l = parseFloat(p[2]) / 100;
      const a = p[3] !== undefined ? clamp(parseFloat(p[3]), 0, 1) : 1;
      return { ...hslToRgb(h, sl, l), a };
    }
  }
  return null;
}

function hslToRgb(h: number, s: number, l: number): { r: number; g: number; b: number } {
  h = ((h % 360) + 360) % 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60) [r, g, b] = [c, x, 0];
  else if (h < 120) [r, g, b] = [x, c, 0];
  else if (h < 180) [r, g, b] = [0, c, x];
  else if (h < 240) [r, g, b] = [0, x, c];
  else if (h < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return {
    r: Math.round((r + m) * 255),
    g: Math.round((g + m) * 255),
    b: Math.round((b + m) * 255),
  };
}

function rgbToHsl(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const l = (max + min) / 2;
  const s = d === 0 ? 0 : d / (1 - Math.abs(2 * l - 1));
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) };
}

function rgbToHsv(r: number, g: number, b: number) {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
  const d = max - min;
  let h = 0;
  if (d !== 0) {
    if (max === r) h = ((g - b) / d) % 6;
    else if (max === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
    if (h < 0) h += 360;
  }
  const s = max === 0 ? 0 : d / max;
  return { h: Math.round(h), s: Math.round(s * 100), v: Math.round(max * 100) };
}

const hx = (n: number) => n.toString(16).padStart(2, "0");

function OutRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-3 px-3 py-2">
      <span className="shrink-0 text-xs text-zinc-500">{label}</span>
      <div className="flex min-w-0 items-center gap-2">
        <code className="truncate font-mono text-[13px] text-zinc-200">{value}</code>
        <CopyButton value={value} className="shrink-0" />
      </div>
    </div>
  );
}

export default function ColorConverter() {
  const [input, setInput] = useState("#4b6b4e");

  const rgba = useMemo(() => parseColor(input), [input]);

  const out = useMemo(() => {
    if (!rgba) return null;
    const { r, g, b, a } = rgba;
    const hsl = rgbToHsl(r, g, b);
    const hsv = rgbToHsv(r, g, b);
    const hex = `#${hx(r)}${hx(g)}${hx(b)}${a < 1 ? hx(Math.round(a * 255)) : ""}`;
    return {
      hex,
      pickerHex: `#${hx(r)}${hx(g)}${hx(b)}`,
      css: `#${hx(r)}${hx(g)}${hx(b)}`,
      rgb: a < 1 ? `rgba(${r}, ${g}, ${b}, ${a})` : `rgb(${r}, ${g}, ${b})`,
      hsl: a < 1 ? `hsla(${hsl.h}, ${hsl.s}%, ${hsl.l}%, ${a})` : `hsl(${hsl.h}, ${hsl.s}%, ${hsl.l}%)`,
      hsv: `hsv(${hsv.h}, ${hsv.s}%, ${hsv.v}%)`,
    };
  }, [rgba]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <div
          className="h-16 w-16 shrink-0 rounded-lg border border-zinc-700"
          style={{ background: out?.css ?? "transparent" }}
          aria-hidden
        />
        <div className="min-w-[200px] flex-1">
          <Labeled label="Color (HEX, RGB or HSL)">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="#4b6b4e, rgb(75,107,78) or hsl(125,18%,36%)"
              className={inputClass}
            />
          </Labeled>
        </div>
        <input
          type="color"
          value={out?.pickerHex ?? "#000000"}
          onChange={(e) => setInput(e.target.value)}
          className="h-10 w-12 shrink-0 cursor-pointer rounded-md border border-zinc-800 bg-zinc-900/70"
          aria-label="Pick a color"
        />
      </div>

      {out ? (
        <Panel label="Converted">
          <div className="divide-y divide-zinc-800 overflow-hidden rounded-lg border border-zinc-800 bg-zinc-900/70">
            <OutRow label="HEX" value={out.hex} />
            <OutRow label="RGB" value={out.rgb} />
            <OutRow label="HSL" value={out.hsl} />
            <OutRow label="HSV" value={out.hsv} />
          </div>
        </Panel>
      ) : (
        input.trim() !== "" && (
          <p className="text-xs text-red-400">
            Couldn&apos;t parse that color. Try a hex like #4b6b4e, rgb(75, 107, 78) or hsl(125, 18%, 36%).
          </p>
        )
      )}
    </div>
  );
}
