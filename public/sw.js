/*
 * GetFreeToolsAI service worker — deliberately conservative.
 *
 * Design goals (in order): never break the site, then speed up repeat visits,
 * then provide a basic offline experience.
 *
 *  - Navigations (HTML): NETWORK-FIRST. Online users always get fresh HTML; the
 *    cache is only a fallback when the network fails, then an offline page. This
 *    is what prevents a bad/stale cache from "bricking" the site.
 *  - Immutable static assets (/_next/static + hashed media/fonts/css/js):
 *    CACHE-FIRST. Safe because their URLs are content-hashed.
 *  - Everything else (including the large imgly model files and tesseract WASM,
 *    and all cross-origin ad/analytics requests): passthrough, never cached.
 *
 * Bump VERSION to invalidate old caches on the next activate.
 */
const VERSION = "v1";
const STATIC_CACHE = `gft-static-${VERSION}`;
const PAGES_CACHE = `gft-pages-${VERSION}`;
const OFFLINE_URL = "/offline";
const PRECACHE = [OFFLINE_URL];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(PAGES_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  const keep = new Set([STATIC_CACHE, PAGES_CACHE]);
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.filter((k) => !keep.has(k)).map((k) => caches.delete(k)))
      )
      .then(() => self.clients.claim())
  );
});

function isImmutableAsset(url) {
  return (
    url.pathname.startsWith("/_next/static/") ||
    /\.(?:woff2?|css|js|svg|png|jpe?g|webp|gif|ico)$/.test(url.pathname)
  );
}

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  // Only handle same-origin requests — never intercept ads/analytics/CDNs.
  if (url.origin !== self.location.origin) return;

  // Page navigations: network-first with cache + offline fallback.
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(PAGES_CACHE).then((cache) => cache.put(request, copy));
          return response;
        })
        .catch(() =>
          caches
            .match(request)
            .then((cached) => cached || caches.match(OFFLINE_URL))
        )
    );
    return;
  }

  // Immutable, content-hashed assets: cache-first.
  if (isImmutableAsset(url)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            // Only cache successful, basic (same-origin) responses.
            if (response.ok && response.type === "basic") {
              const copy = response.clone();
              caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            }
            return response;
          })
      )
    );
    return;
  }

  // Everything else (WASM models, data files, API): straight to network.
});
