"use client";

import { useEffect, useRef, useState } from "react";
import { Download } from "lucide-react";
import { Button, SegmentedControl } from "@/components/ui";
import { downloadBlob } from "@/lib/utils";
import { canvasToBlob } from "@/lib/pdfjs";

type Icon = "error" | "warning" | "info" | "success";

const S = 2; // render scale for crisp output
const W = 440;

function wrap(ctx: CanvasRenderingContext2D, text: string, maxW: number): string[] {
  const lines: string[] = [];
  for (const para of text.split("\n")) {
    const words = para.split(/\s+/);
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line);
        line = w;
      } else line = test;
    }
    lines.push(line);
  }
  return lines;
}

function drawIcon(ctx: CanvasRenderingContext2D, kind: Icon, x: number, y: number, r: number) {
  ctx.save();
  ctx.translate(x + r, y + r);
  if (kind === "warning") {
    ctx.fillStyle = "#ffb900";
    ctx.beginPath();
    ctx.moveTo(0, -r);
    ctx.lineTo(r, r);
    ctx.lineTo(-r, r);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#000";
    ctx.font = `bold ${r * 1.3}px Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("!", 0, r * 0.25);
  } else {
    const colors = { error: "#e81123", info: "#0078d7", success: "#107c10" };
    ctx.fillStyle = colors[kind];
    ctx.beginPath();
    ctx.arc(0, 0, r, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#fff";
    ctx.fillStyle = "#fff";
    ctx.lineWidth = r * 0.16;
    ctx.lineCap = "round";
    if (kind === "error") {
      const d = r * 0.45;
      ctx.beginPath();
      ctx.moveTo(-d, -d);
      ctx.lineTo(d, d);
      ctx.moveTo(d, -d);
      ctx.lineTo(-d, d);
      ctx.stroke();
    } else if (kind === "success") {
      ctx.beginPath();
      ctx.moveTo(-r * 0.5, 0);
      ctx.lineTo(-r * 0.1, r * 0.4);
      ctx.lineTo(r * 0.55, -r * 0.4);
      ctx.stroke();
    } else {
      ctx.font = `bold ${r * 1.2}px Georgia`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("i", 0, r * 0.05);
    }
  }
  ctx.restore();
}

export default function FakeError() {
  const [icon, setIcon] = useState<Icon>("error");
  const [title, setTitle] = useState("Error");
  const [message, setMessage] = useState(
    "A fatal error has occurred and the operation could not be completed.\n\nError code: 0x000000FF"
  );
  const [buttons, setButtons] = useState("OK, Cancel");
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    ctx.font = `${13 * S}px Segoe UI, Arial`;
    const iconR = 16;
    const bodyLeft = 20 + iconR * 2 + 16;
    const textMaxW = (W - bodyLeft - 20) * S;
    const lines = wrap(ctx, message, textMaxW);
    const lineH = 19;
    const titleBarH = 32;
    const bodyH = Math.max(iconR * 2, lines.length * lineH) + 24;
    const btnRowH = 48;
    const H = titleBarH + bodyH + btnRowH;

    canvas.width = W * S;
    canvas.height = H * S;
    ctx.scale(S, S);

    // window
    ctx.fillStyle = "#f0f0f0";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "#b4b4b4";
    ctx.lineWidth = 1;
    ctx.strokeRect(0.5, 0.5, W - 1, H - 1);

    // title bar
    const grad = ctx.createLinearGradient(0, 0, 0, titleBarH);
    grad.addColorStop(0, "#f5f9ff");
    grad.addColorStop(1, "#dbeafb");
    ctx.fillStyle = grad;
    ctx.fillRect(1, 1, W - 2, titleBarH - 1);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = `${13 * 1}px Segoe UI, Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "middle";
    ctx.fillText(title, 12, titleBarH / 2 + 1);
    // close button
    ctx.fillStyle = "#e81123";
    ctx.fillRect(W - 46, 1, 45, titleBarH - 2);
    ctx.strokeStyle = "#fff";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(W - 29, 11);
    ctx.lineTo(W - 17, 23);
    ctx.moveTo(W - 17, 11);
    ctx.lineTo(W - 29, 23);
    ctx.stroke();

    // icon + message
    drawIcon(ctx, icon, 20, titleBarH + 16, iconR);
    ctx.fillStyle = "#1a1a1a";
    ctx.font = `${13}px Segoe UI, Arial`;
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    lines.forEach((ln, i) => {
      ctx.fillText(ln, bodyLeft, titleBarH + 16 + i * lineH);
    });

    // buttons (right aligned)
    const labels = buttons.split(",").map((b) => b.trim()).filter(Boolean);
    let bx = W - 12;
    ctx.font = `${13}px Segoe UI, Arial`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (let i = labels.length - 1; i >= 0; i--) {
      const label = labels[i];
      const bw = Math.max(75, ctx.measureText(label).width + 28);
      const by = H - btnRowH + 8;
      const bh = 26;
      bx -= bw;
      ctx.fillStyle = i === 0 ? "#e5f1fb" : "#fdfdfd";
      ctx.fillRect(bx, by, bw, bh);
      ctx.strokeStyle = i === 0 ? "#0078d7" : "#adadad";
      ctx.strokeRect(bx + 0.5, by + 0.5, bw - 1, bh - 1);
      ctx.fillStyle = "#1a1a1a";
      ctx.fillText(label, bx + bw / 2, by + bh / 2 + 1);
      bx -= 8;
    }
  }, [icon, title, message, buttons]);

  const download = async () => {
    if (!canvasRef.current) return;
    const blob = await canvasToBlob(canvasRef.current, "image/png");
    downloadBlob(blob, "fake-error.png");
  };

  const inputCls =
    "w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-4">
          <div>
            <span className="mb-1.5 block text-sm text-text-muted">Icon</span>
            <SegmentedControl<Icon>
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
            <span className="mb-1 block text-text-muted">Title bar text</span>
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

        <div className="flex items-start justify-center rounded-xl border border-border bg-[#008080] p-4">
          <canvas ref={canvasRef} className="h-auto w-full max-w-[440px] shadow-lg" />
        </div>
      </div>

      <div className="mt-5">
        <Button size="lg" variant="success" icon={Download} onClick={download}>
          Download PNG
        </Button>
      </div>

      <p className="mt-4 text-xs leading-relaxed text-text-muted">
        For memes and harmless pranks only. Everything is drawn on your device —
        nothing is uploaded.
      </p>
    </div>
  );
}
