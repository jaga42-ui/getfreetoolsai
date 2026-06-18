// Shared config + warm-up for the in-browser @imgly/background-removal model,
// used by the Background Remover and Blur Background tools. The model and wasm
// are self-hosted under /imgly (see scripts/copy-imgly-assets.mjs) so there's
// no external CDN dependency — everything runs locally and offline.

export const imglyConfig = () => ({
  publicPath: new URL("/imgly/", window.location.origin).toString(),
  model: "medium" as const,
});

let warmed = false;

/**
 * Prefetch only the medium model into the browser cache the moment a file is
 * picked, so the first removeBackground() is fast. We deliberately do NOT use
 * imgly's preload(): it loops over every key in the manifest and fetches all of
 * them — both the small and medium models plus every onnxruntime wasm build —
 * which wastes bandwidth and 404s the variants we don't self-host. The actual
 * removeBackground() only fetches the medium model + the wasm build it selects,
 * so warming just the model covers the slow part.
 */
export function warmImglyModel() {
  if (warmed || typeof window === "undefined") return;
  warmed = true;
  const start = async () => {
    try {
      await import("@imgly/background-removal"); // parse the library JS up front
      const base = imglyConfig().publicPath;
      const res = await fetch(new URL("resources.json", base));
      if (!res.ok) return;
      const manifest: Record<string, { chunks?: { hash: string }[] }> =
        await res.json();
      const chunks = manifest["/models/medium"]?.chunks ?? [];
      await Promise.all(
        chunks.map((c) =>
          fetch(new URL(c.hash, base)).then(() => undefined).catch(() => undefined)
        )
      );
    } catch {
      warmed = false; // allow a retry on the actual run
    }
  };
  if ("requestIdleCallback" in window) {
    (window as unknown as {
      requestIdleCallback: (cb: () => void) => void;
    }).requestIdleCallback(start);
  } else {
    setTimeout(start, 200);
  }
}
