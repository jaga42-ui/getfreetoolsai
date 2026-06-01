"use client";

import { useEffect, useRef, useState } from "react";
import {
  LockOpen,
  RotateCcw,
  FileText,
  Eye,
  EyeOff,
  Download,
  Lock,
  Info,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage } from "@/components/ui";
import { ProgressBar } from "@/components/ProgressBar";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";
import { getPdfjs, renderPageToCanvas, canvasToBlob } from "@/lib/pdfjs";

function isPasswordException(e: unknown): boolean {
  return (
    typeof e === "object" &&
    e !== null &&
    "name" in e &&
    (e as { name?: string }).name === "PasswordException"
  );
}

type Phase =
  | "checking"
  | "needsPassword"
  | "open" // opened without an open-password (may be owner-restricted)
  | "working"
  | "done";

export default function UnlockPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [phase, setPhase] = useState<Phase>("checking");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  const [result, setResult] = useState<{ blob: Blob; flattened: boolean } | null>(
    null
  );
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (phase === "needsPassword") inputRef.current?.focus();
  }, [phase]);

  const reset = () => {
    setFile(null);
    setPhase("checking");
    setPassword("");
    setError("");
    setResult(null);
    setProgress(0);
    setStatusText("");
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setResult(null);
    setPassword("");
    setPhase("checking");
    try {
      const pdfjs = await getPdfjs();
      const task = pdfjs.getDocument({ data: await f.arrayBuffer() });
      await task.promise;
      // Opened with no open-password.
      setPhase("open");
    } catch (e) {
      if (isPasswordException(e)) {
        setPhase("needsPassword");
      } else {
        setError("Could not read this PDF. It may be corrupted.");
        setPhase("open");
      }
    }
  };

  // Re-save without encryption (preserves text). Good for owner-restricted PDFs.
  const resaveWithoutEncryption = async (): Promise<Blob> => {
    const { PDFDocument } = await import("pdf-lib");
    const doc = await PDFDocument.load(await file!.arrayBuffer(), {
      ignoreEncryption: true,
    });
    const bytes = await doc.save();
    return bytesToBlob(bytes, "application/pdf");
  };

  // Rebuild from rendered pages using a verified password (decrypts content).
  const rebuildFromRender = async (pw: string): Promise<Blob> => {
    const pdfjs = await getPdfjs();
    const { PDFDocument } = await import("pdf-lib");
    const doc = await pdfjs.getDocument({
      data: await file!.arrayBuffer(),
      password: pw,
    }).promise;
    const out = await PDFDocument.create();
    for (let p = 1; p <= doc.numPages; p++) {
      setStatusText(`Unlocking page ${p} of ${doc.numPages}...`);
      const page = await doc.getPage(p);
      const canvas = await renderPageToCanvas(page, 2);
      const jpgBlob = await canvasToBlob(canvas, "image/jpeg", 0.92);
      const jpg = await out.embedJpg(await jpgBlob.arrayBuffer());
      const viewport = page.getViewport({ scale: 1 });
      const newPage = out.addPage([viewport.width, viewport.height]);
      newPage.drawImage(jpg, {
        x: 0,
        y: 0,
        width: viewport.width,
        height: viewport.height,
      });
      setProgress(Math.round((p / doc.numPages) * 100));
    }
    const bytes = await out.save();
    return bytesToBlob(bytes, "application/pdf");
  };

  // For "open" PDFs — just strip any owner/permission restrictions.
  const unlockOpen = async () => {
    setPhase("working");
    setError("");
    setStatusText("Removing restrictions...");
    try {
      const blob = await resaveWithoutEncryption();
      setResult({ blob, flattened: false });
      setPhase("done");
    } catch (e) {
      setError("Could not process this PDF. Please try again.");
      setPhase("open");
    }
  };

  // For password-protected PDFs — verify password, then decrypt + rebuild.
  const unlockWithPassword = async () => {
    if (!password) {
      setError("Please enter the PDF password.");
      return;
    }
    setError("");
    setPhase("working");
    setProgress(0);
    setStatusText("Verifying password...");
    try {
      const pdfjs = await getPdfjs();
      // Validate the password first.
      await pdfjs.getDocument({
        data: await file!.arrayBuffer(),
        password,
      }).promise;
    } catch (e) {
      if (isPasswordException(e)) {
        setError("Incorrect password. Try again.");
        setPassword("");
        setPhase("needsPassword");
        return;
      }
      setError("Could not open this PDF. Please try again.");
      setPhase("needsPassword");
      return;
    }

    try {
      const blob = await rebuildFromRender(password);
      setResult({ blob, flattened: true });
      setPhase("done");
    } catch {
      setError("Unlocking failed after verifying the password. Please retry.");
      setPhase("needsPassword");
    }
  };

  const outName = file
    ? `unlocked-${file.name.replace(/\.pdf$/i, "")}.pdf`
    : "unlocked.pdf";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">
            Your PDF stays in your browser.
          </span>{" "}
          Your password is never sent to any server.
        </p>
      </div>

      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a password-protected PDF"
          maxSizeMB={100}
          onFilesAccepted={onFile}
        />
      ) : (
        <>
          <div className="flex items-center gap-3 rounded-xl border border-border bg-background p-3">
            <FileText className="h-5 w-5 shrink-0 text-text-muted" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-text-primary">
                {file.name}
              </p>
              <p className="text-xs text-text-muted">{formatBytes(file.size)}</p>
            </div>
          </div>

          {phase === "open" && !result && (
            <>
              <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
                <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
                <p className="text-sm text-text-primary">
                  This PDF is not protected by an open-password. If it has
                  printing or copying restrictions, we can remove those and give
                  you a clean copy.
                </p>
              </div>
              <ErrorMessage message={error} />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button size="lg" icon={LockOpen} onClick={unlockOpen}>
                  Remove restrictions & download
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Start over
                </Button>
              </div>
            </>
          )}

          {phase === "needsPassword" && (
            <>
              <div className="mt-4 rounded-xl border border-border bg-background p-4">
                <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  PDF password
                </label>
                <div className="mt-2 flex items-center gap-2">
                  <div className="relative flex-1">
                    <input
                      ref={inputRef}
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onKeyDown={(e) =>
                        e.key === "Enter" && unlockWithPassword()
                      }
                      placeholder="Enter password"
                      className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((s) => !s)}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                      aria-label={showPassword ? "Hide password" : "Show password"}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-xs text-text-muted">
                  We can only unlock this PDF with the correct password. We
                  cannot crack or bypass encryption.
                </p>
              </div>
              <ErrorMessage message={error} />
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button size="lg" icon={LockOpen} onClick={unlockWithPassword}>
                  Unlock PDF
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Start over
                </Button>
              </div>
            </>
          )}

          {phase === "working" && (
            <div className="mt-5">
              <ProgressBar
                value={progress || 30}
                label={statusText || "Working..."}
              />
            </div>
          )}

          {phase === "done" && result && (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <p className="text-lg font-semibold text-secondary">
                ✅ PDF Unlocked Successfully
              </p>
              <p className="mt-1 text-sm text-text-muted">
                {formatBytes(file.size)} → {formatBytes(result.blob.size)}
              </p>
              {result.flattened && (
                <p className="mx-auto mt-2 max-w-md text-xs text-text-muted">
                  Because this file required a password to open, the unlocked
                  copy is rebuilt from its pages and is no longer encrypted.
                </p>
              )}
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result.blob, outName)}
                >
                  Download unlocked PDF
                </Button>
                <Button variant="ghost" icon={RotateCcw} onClick={reset}>
                  Process another file
                </Button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
