#!/usr/bin/env node
/**
 * screenshots.js — full-page screenshots of every indexable URL from the LIVE site.
 *
 * Usage: node scripts/screenshots.js [outDir]
 *
 * Indexable = present in sitemap.xml and not noindex. Each URL is resolved to the
 * URL that actually returns 200 (per baseline/live-http.csv) so we capture what
 * visitors see, not a redirect. One page at a time, waits for network idle.
 */

const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const SITE = 'https://ankuramtuition.com';
const outDir = process.argv[2] || 'baseline/screens';
const WIDTHS = [390, 1440];

function slugFor(url) {
  const s = url.replace(/^\//, '').replace(/\/$/, '');
  return s === '' ? 'home' : s.replace(/\//g, '-').replace(/[^a-zA-Z0-9._-]/g, '_');
}

// ---- resolve the indexable set ------------------------------------------
function loadTargets() {
  const sm = fs
    .readFileSync('public_html/sitemap.xml', 'utf8')
    .match(/<loc>([^<]+)<\/loc>/g)
    .map((s) => s.replace(/<\/?loc>/g, '').replace(SITE, '') || '/');

  // final URL per requested path, from the P0c sweep
  const final = new Map();
  const csv = fs.readFileSync('baseline/live-http.csv', 'utf8').trim().split('\n').slice(1);
  for (const line of csv) {
    const f = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c; }
      else if (c === '"') inQ = true;
      else if (c === ',') { f.push(cur); cur = ''; }
      else cur += c;
    }
    f.push(cur);
    final.set(f[0], { finalUrl: f[4], finalStatus: f[3] });
  }

  const seen = new Set();
  const targets = [];
  for (const p of sm) {
    const hit = final.get(p);
    const url = hit && hit.finalUrl ? hit.finalUrl.replace(SITE, '') || '/' : p;
    if (hit && hit.finalStatus !== '200') {
      console.warn(`  skip (final ${hit.finalStatus}): ${p}`);
      continue;
    }
    if (seen.has(url)) { console.warn(`  dedupe: ${p} -> ${url} (already queued)`); continue; }
    seen.add(url);
    targets.push({ requested: p, url });
  }
  return targets;
}

(async () => {
  const targets = loadTargets();
  fs.mkdirSync(outDir, { recursive: true });
  console.log(`${targets.length} unique indexable URLs -> ${targets.length * WIDTHS.length} screenshots`);

  const browser = await chromium.launch();
  const rows = [];
  let n = 0;

  for (const t of targets) {
    n++;
    for (const w of WIDTHS) {
      const ctx = await browser.newContext({
        viewport: { width: w, height: w === 390 ? 844 : 900 },
        deviceScaleFactor: 1,
        userAgent: 'AnkuramBaselineAudit/1.0 (read-only P0d screenshot)',
      });
      const page = await ctx.newPage();
      const file = path.join(outDir, `${slugFor(t.url)}-${w}.png`);
      let status = 'ok';
      try {
        const resp = await page.goto(SITE + t.url, { waitUntil: 'networkidle', timeout: 45000 });
        status = resp ? String(resp.status()) : 'no-response';
        await page.screenshot({ path: file, fullPage: true });
      } catch (e) {
        status = 'ERROR: ' + e.message.split('\n')[0].slice(0, 80);
        try { await page.screenshot({ path: file, fullPage: true }); } catch { /* nothing to save */ }
      }
      const bytes = fs.existsSync(file) ? fs.statSync(file).size : 0;
      rows.push({ url: t.url, width: w, file: path.basename(file), bytes, status });
      console.log(`[${n}/${targets.length}] ${t.url} @${w} -> ${status} ${bytes}B`);
      await ctx.close();
    }
  }

  await browser.close();

  const csv = ['url,width,file,bytes,status']
    .concat(rows.map((r) => `${r.url},${r.width},${r.file},${r.bytes},"${r.status}"`))
    .join('\n') + '\n';
  fs.writeFileSync('baseline/screens-index.csv', csv);
  console.log(`wrote baseline/screens-index.csv (${rows.length} rows)`);
  const failed = rows.filter((r) => !/^2\d\d$/.test(r.status));
  if (failed.length) console.log('NON-200:', failed.map((f) => `${f.url}@${f.width}=${f.status}`).join(', '));
})();
