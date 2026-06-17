"use client";

import { useEffect } from "react";

/**
 * Last-resort boundary for errors thrown in the root layout itself. It replaces
 * the entire document, so it must render its own <html>/<body>, and global CSS
 * is not guaranteed to be applied — styling is inlined with the brand palette.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body
        style={{
          margin: 0,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#f4efe4",
          color: "#211f1a",
          fontFamily:
            "Inter Variable, system-ui, -apple-system, Segoe UI, Roboto, sans-serif",
          padding: "2rem",
        }}
      >
        <div style={{ maxWidth: "32rem", textAlign: "center" }}>
          <h1
            style={{
              fontFamily: "Fraunces Variable, Georgia, serif",
              fontSize: "1.875rem",
              fontWeight: 500,
              lineHeight: 1.2,
              margin: 0,
            }}
          >
            Something went wrong.
          </h1>
          <p
            style={{
              marginTop: "1rem",
              fontSize: "1rem",
              lineHeight: 1.6,
              color: "#6c675c",
            }}
          >
            An unexpected error occurred while loading the page. Please try
            reloading — your files are always processed privately in your browser
            and were never uploaded.
          </p>
          <button
            type="button"
            onClick={reset}
            style={{
              marginTop: "1.5rem",
              border: "none",
              cursor: "pointer",
              borderRadius: "0.375rem",
              backgroundColor: "#b25733",
              color: "#fbf8f1",
              padding: "0.75rem 1.25rem",
              fontSize: "0.9375rem",
              fontWeight: 500,
            }}
          >
            Reload page
          </button>
        </div>
      </body>
    </html>
  );
}
