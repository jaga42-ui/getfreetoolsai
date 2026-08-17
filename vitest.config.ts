import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirror the "@/*" -> repo-root alias from tsconfig.json.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  // The content registries (guides, comparisons, how-tos) are .tsx because their
  // bodies are JSX. Tests that assert on their metadata have to import them, so
  // use the automatic runtime rather than requiring a React global.
  esbuild: { jsx: "automatic" },
  test: {
    // Pure-logic unit tests run in Node; browser/DOM-heavy tools are excluded.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
