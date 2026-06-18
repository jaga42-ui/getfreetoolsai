"use client";

import { useState } from "react";
import {
  Download,
  RefreshCw,
  FileText,
  PenLine,
  Info,
} from "lucide-react";
import Link from "next/link";
import { DropZone } from "@/components/DropZone";
import { Button, ErrorMessage, SuccessHeader } from "@/components/ui";
import { formatBytes, downloadBlob, bytesToBlob } from "@/lib/utils";

type FieldKind = "text" | "checkbox" | "dropdown" | "radio" | "optionlist";

type FieldModel = {
  name: string;
  kind: FieldKind;
  options?: string[];
  value: string; // for checkbox: "on" | ""
};

export default function FillPDF() {
  const [file, setFile] = useState<File | null>(null);
  const [fields, setFields] = useState<FieldModel[] | null>(null);
  const [flatten, setFlatten] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<Blob | null>(null);

  const reset = () => {
    setFile(null);
    setFields(null);
    setResult(null);
    setError("");
  };

  const onFile = async (files: File[]) => {
    const f = files[0];
    setFile(f);
    setError("");
    setResult(null);
    setFields(null);
    try {
      const {
        PDFDocument,
        PDFTextField,
        PDFCheckBox,
        PDFDropdown,
        PDFRadioGroup,
        PDFOptionList,
      } = await import("pdf-lib");
      const doc = await PDFDocument.load(await f.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const form = doc.getForm();
      const models: FieldModel[] = [];
      for (const field of form.getFields()) {
        const name = field.getName();
        if (field instanceof PDFTextField) {
          models.push({ name, kind: "text", value: field.getText() ?? "" });
        } else if (field instanceof PDFCheckBox) {
          models.push({ name, kind: "checkbox", value: field.isChecked() ? "on" : "" });
        } else if (field instanceof PDFDropdown) {
          models.push({
            name,
            kind: "dropdown",
            options: field.getOptions(),
            value: field.getSelected()[0] ?? "",
          });
        } else if (field instanceof PDFRadioGroup) {
          models.push({
            name,
            kind: "radio",
            options: field.getOptions(),
            value: field.getSelected() ?? "",
          });
        } else if (field instanceof PDFOptionList) {
          models.push({
            name,
            kind: "optionlist",
            options: field.getOptions(),
            value: field.getSelected()[0] ?? "",
          });
        }
      }
      setFields(models);
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not read this PDF: ${e.message}`
          : "Could not read this PDF."
      );
    }
  };

  const update = (i: number, value: string) =>
    setFields((fs) => fs && fs.map((f, idx) => (idx === i ? { ...f, value } : f)));

  const run = async () => {
    if (!file || !fields) return;
    setBusy(true);
    setError("");
    try {
      const {
        PDFDocument,
        PDFTextField,
        PDFCheckBox,
        PDFDropdown,
        PDFRadioGroup,
        PDFOptionList,
      } = await import("pdf-lib");
      const doc = await PDFDocument.load(await file.arrayBuffer(), {
        ignoreEncryption: true,
      });
      const form = doc.getForm();
      for (const model of fields) {
        const field = form.getField(model.name);
        if (field instanceof PDFTextField) {
          field.setText(model.value || undefined);
        } else if (field instanceof PDFCheckBox) {
          if (model.value === "on") field.check();
          else field.uncheck();
        } else if (field instanceof PDFDropdown) {
          if (model.value) field.select(model.value);
          else field.clear();
        } else if (field instanceof PDFRadioGroup) {
          if (model.value) field.select(model.value);
          else field.clear();
        } else if (field instanceof PDFOptionList) {
          if (model.value) field.select(model.value);
          else field.clear();
        }
      }
      if (flatten) form.flatten();
      const bytes = await doc.save();
      setResult(bytesToBlob(bytes, "application/pdf"));
    } catch (e) {
      setError(
        e instanceof Error
          ? `Could not fill this PDF: ${e.message}`
          : "Something went wrong. Please try again."
      );
    } finally {
      setBusy(false);
    }
  };

  const outName = file ? `filled-${file.name}` : "filled.pdf";

  return (
    <div className="rounded-2xl border border-border bg-surface/40 p-4 sm:p-6">
      {!file ? (
        <DropZone
          acceptedTypes={[".pdf", "application/pdf"]}
          acceptedLabel="a PDF form"
          maxSizeMB={100}
          onFilesAccepted={onFile}
        />
      ) : result ? (
        <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-5 text-center">
          <SuccessHeader>Form filled</SuccessHeader>
          <p className="mt-1 text-sm text-text-muted">{formatBytes(result.size)}</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              variant="success"
              icon={Download}
              onClick={() => downloadBlob(result, outName)}
            >
              Download filled PDF
            </Button>
            <Button variant="ghost" icon={RefreshCw} onClick={reset}>
              Fill another form
            </Button>
          </div>
        </div>
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

          <ErrorMessage message={error} />

          {fields && fields.length === 0 && (
            <div className="mt-4 flex items-start gap-3 rounded-xl border border-sky-500/30 bg-sky-500/5 p-4">
              <Info className="mt-0.5 h-5 w-5 shrink-0 text-sky-400" />
              <p className="text-sm text-text-primary">
                This PDF has no fillable form fields. To write on a flat PDF or
                add a signature, use the{" "}
                <Link href="/pdf/sign" className="font-medium text-primary underline">
                  Sign PDF
                </Link>{" "}
                tool instead.
              </p>
            </div>
          )}

          {fields && fields.length > 0 && (
            <>
              <div className="mt-4 space-y-4 rounded-xl border border-border bg-background p-4">
                {fields.map((f, i) => (
                  <div key={f.name + i}>
                    <label className="mb-1.5 block text-sm font-medium text-text-primary">
                      {prettyName(f.name)}
                    </label>
                    {f.kind === "text" && (
                      <input
                        value={f.value}
                        onChange={(e) => update(i, e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                      />
                    )}
                    {f.kind === "checkbox" && (
                      <label className="flex cursor-pointer items-center gap-2.5 text-sm text-text-primary">
                        <input
                          type="checkbox"
                          checked={f.value === "on"}
                          onChange={(e) => update(i, e.target.checked ? "on" : "")}
                          className="h-4 w-4 accent-primary"
                        />
                        Checked
                      </label>
                    )}
                    {(f.kind === "dropdown" || f.kind === "optionlist") && (
                      <select
                        value={f.value}
                        onChange={(e) => update(i, e.target.value)}
                        className="w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm text-text-primary focus:border-primary focus:outline-none"
                      >
                        <option value="">— Select —</option>
                        {f.options?.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
                      </select>
                    )}
                    {f.kind === "radio" && (
                      <div className="flex flex-wrap gap-3">
                        {f.options?.map((o) => (
                          <label
                            key={o}
                            className="flex cursor-pointer items-center gap-2 text-sm text-text-primary"
                          >
                            <input
                              type="radio"
                              name={f.name + i}
                              checked={f.value === o}
                              onChange={() => update(i, o)}
                              className="h-4 w-4 accent-primary"
                            />
                            {o}
                          </label>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <label className="mt-4 flex cursor-pointer items-center gap-2.5 text-sm text-text-primary">
                <input
                  type="checkbox"
                  checked={flatten}
                  onChange={(e) => setFlatten(e.target.checked)}
                  className="h-4 w-4 accent-primary"
                />
                Flatten the form so values can&apos;t be edited later
              </label>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <Button size="lg" icon={PenLine} loading={busy} onClick={run}>
                  {busy ? "Filling…" : "Fill form"}
                </Button>
                <Button variant="ghost" icon={RefreshCw} onClick={reset}>
                  Start over
                </Button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
}

/** Turn a raw field name like "first_name" or "Form1[0].FirstName" into a label. */
function prettyName(raw: string): string {
  const tail = raw.split(/[.\][]/).filter(Boolean).pop() ?? raw;
  return tail
    .replace(/[_-]+/g, " ")
    .replace(/([a-z])([A-Z])/g, "$1 $2")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/^\w/, (c) => c.toUpperCase());
}
