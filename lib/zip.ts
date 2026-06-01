/** Lazily build a ZIP file from named blobs and return it as a Blob. */
export async function zipFiles(
  files: { name: string; blob: Blob }[]
): Promise<Blob> {
  const JSZip = (await import("jszip")).default;
  const zip = new JSZip();
  for (const f of files) {
    zip.file(f.name, f.blob);
  }
  return zip.generateAsync({ type: "blob" });
}
