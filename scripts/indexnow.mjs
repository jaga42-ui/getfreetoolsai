/**
 * IndexNow submission — pings IndexNow (Bing, Yandex, Seznam, and others that
 * consume the protocol) with every live URL so new/updated pages get crawled
 * within hours instead of weeks.
 *
 * Usage:  node scripts/indexnow.mjs        (after a production deploy)
 *         npm run indexnow
 *
 * The key below must match the file served at:
 *   https://www.getfreetoolsai.com/<KEY>.txt
 */

const HOST = "www.getfreetoolsai.com";
const KEY = "b7d4f29a8c3e41f6951a0e7c2d8b5f43";
const KEY_LOCATION = `https://${HOST}/${KEY}.txt`;
const SITEMAPS = [
  `https://${HOST}/sitemap-tools.xml`,
  `https://${HOST}/sitemap-guides.xml`,
];
const ENDPOINT = "https://api.indexnow.org/indexnow";

async function locsFromSitemap(url) {
  const res = await fetch(url, { headers: { "User-Agent": "indexnow-script" } });
  if (!res.ok) throw new Error(`${url} -> ${res.status}`);
  const xml = await res.text();
  return [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1].trim());
}

async function main() {
  const all = [];
  for (const sm of SITEMAPS) {
    try {
      const locs = await locsFromSitemap(sm);
      all.push(...locs);
      console.log(`  ${sm} -> ${locs.length} urls`);
    } catch (e) {
      console.warn(`  skip ${sm}: ${e.message}`);
    }
  }
  const urlList = [...new Set(all)].filter((u) => u.startsWith(`https://${HOST}`));
  if (urlList.length === 0) {
    console.error("No URLs found — is the site deployed?");
    process.exit(1);
  }

  // IndexNow allows up to 10,000 URLs per request.
  for (let i = 0; i < urlList.length; i += 10000) {
    const batch = urlList.slice(i, i + 10000);
    const res = await fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host: HOST,
        key: KEY,
        keyLocation: KEY_LOCATION,
        urlList: batch,
      }),
    });
    console.log(`Submitted ${batch.length} URLs -> IndexNow ${res.status} ${res.statusText}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
