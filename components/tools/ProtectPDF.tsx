"use client";

import { useState } from "react";
import {
  Download,
  RefreshCw,
  FileText,
  ShieldCheck,
  Eye,
  EyeOff,
  Lock,
  ChevronDown,
} from "lucide-react";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";

/** A strong random owner password so permission restrictions are actually
 * enforced (a holder of the open password can't silently gain owner rights). */
function randomOwnerPassword(): string {
  const bytes = new Uint8Array(24);
  crypto.getRandomValues(bytes);
  return Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
}

export default function ProtectPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [allowPrinting, setAllowPrinting] = useState(true);
  const [allowCopying, setAllowCopying] = useState(true);
  const [allowModifying, setAllowModifying] = useState(true);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const onFile = (files: File[]) => {
    setFile(files[0]);
    setError("");
    setResult(null);
  };
  const reset = () => {
    setFile(null);
    setResult(null);
    setError("");
    setPassword("");
    setConfirm("");
  };

  const run = async () => {
    if (!file) return;
    if (!password) {
      setError("Please enter a password.");
      return;
    }
    if (password.length < 4) {
      setError("Use a password of at least 4 characters.");
      return;
    }
    if (password !== confirm) {
      setError("The passwords don't match.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const { PDFDocument } = await import("@cantoo/pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const restricting = !allowPrinting || !allowCopying || !allowModifying;
      doc.encrypt({
        userPassword: password,
        // When restricting permissions, the owner password must differ from the
        // open password, otherwise opening the file grants full owner rights.
        ownerPassword: restricting ? randomOwnerPassword() : password,
        permissions: {
          printing: allowPrinting ? "highResolution" : false,
          copying: allowCopying,
          modifying: allowModifying,
          annotating: allowModifying,
          fillingForms: allowModifying,
          documentAssembly: allowModifying,
          contentAccessibility: true,
        },
      });
      const bytes = await doc.save();
      setResult(bytesToBlob(bytes, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not protect this PDF: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const outName = file
    ? `protected-${file.name.replace(/\.pdf$/i, "")}.pdf`
    : "protected.pdf";

  const permissions: {
    label: string;
    value: boolean;
    set: (v: boolean) => void;
  }[] = [
    { label: "Allow printing", value: allowPrinting, set: setAllowPrinting },
    { label: "Allow copying text", value: allowCopying, set: setAllowCopying },
    {
      label: "Allow editing & annotations",
      value: allowModifying,
      set: setAllowModifying,
    },
  ];

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      <div className="mb-5 flex items-start gap-3 rounded-xl border border-secondary/40 bg-secondary/10 p-4">
        <Lock className="mt-0.5 h-5 w-5 shrink-0 text-secondary" />
        <p className="text-sm text-text-primary">
          <span className="font-semibold text-secondary">
            Encryption runs in your browser.
          </span>{" "}
          Your PDF and password are never sent to any server.
        </p>
      </div>

      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF file"
          maxSizeMB={200}
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

          {!result && (
            <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  Password
                </label>
                <div className="relative mt-2">
                  <input
                    type={show ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Choose a password"
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-border bg-surface px-3 py-2 pr-10 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => setShow((s) => !s)}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-text-muted hover:text-text-primary"
                    aria-label={show ? "Hide password" : "Show password"}
                  >
                    {show ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <label className="font-mono text-xs uppercase tracking-widest text-text-muted">
                  Confirm password
                </label>
                <input
                  type={show ? "text" : "password"}
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && run()}
                  placeholder="Re-enter the password"
                  autoComplete="new-password"
                  className="mt-2 w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary placeholder:text-text-muted/60 focus:border-primary focus:outline-none"
                />
              </div>

              <div className="border-t border-border pt-1">
                <button
                  type="button"
                  onClick={() => setShowAdvanced((s) => !s)}
                  className="flex w-full items-center justify-between py-2 text-left text-sm font-medium text-text-primary"
                  aria-expanded={showAdvanced}
                >
                  <span>Permissions (optional)</span>
                  <ChevronDown
                    className={`h-4 w-4 text-text-muted transition-transform ${
                      showAdvanced ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {showAdvanced && (
                  <div className="mt-1 space-y-2.5">
                    <p className="text-xs text-text-muted">
                      Uncheck to stop people who have the password from doing
                      these things.
                    </p>
                    {permissions.map((p) => (
                      <label
                        key={p.label}
                        className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary"
                      >
                        <input
                          type="checkbox"
                          checked={p.value}
                          onChange={(e) => p.set(e.target.checked)}
                          className="h-4 w-4 accent-primary"
                        />
                        {p.label}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          <ErrorMessage message={error} />

          {result ? (
            <div className="mt-5 rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
              <SuccessHeader>PDF protected</SuccessHeader>
              <p className="mt-1 text-sm text-text-muted">
                A password is now required to open this file ·{" "}
                {formatBytes(result.size)}
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Button
                  size="lg"
                  variant="success"
                  icon={Download}
                  onClick={() => downloadBlob(result, outName)}
                >
                  Download protected PDF
                </Button>
                <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                  Protect another file
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 flex flex-wrap items-center gap-3">
              <Button size="lg" icon={ShieldCheck} loading={busy} onClick={run}>
                {busy ? "Encrypting…" : "Protect PDF"}
              </Button>
              <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                Start over
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
