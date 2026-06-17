import { defineConfig } from "vitest/config";
import { fileURLToPath } from "node:url";

export default defineConfig({
  resolve: {
    // Mirror the "@/*" -> repo-root alias from tsconfig.json.
    alias: {
      "@": fileURLToPath(new URL("./", import.meta.url)),
    },
  },
  test: {
    // Pure-logic unit tests run in Node; browser/DOM-heavy tools are excluded.
    environment: "node",
    include: ["tests/**/*.test.ts"],
  },
});
