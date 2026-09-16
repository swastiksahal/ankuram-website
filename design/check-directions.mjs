#!/usr/bin/env node
/**
 * check-directions.mjs — serve design/ locally, screenshot each direction at
 * 390 and 1440, assert no horizontal scroll at 360/390/768/1440, and run
 * Lighthouse mobile against the local server.
 *
 * Usage: node design/check-directions.mjs
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve('design');
const PORT = 8137;
const DIRS = ['a', 'b', 'c'];
const WIDTHS_CHECK = [360, 390, 768, 1440];
const WIDTHS_SHOT = [390, 1440];

const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.js': 'text/javascript' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (url.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404); res.end('not found'); return;
  }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});

await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;
console.log(`serving ${ROOT} at ${base}`);

fs.mkdirSync('design/screens', { recursive: true });

// ---------------------------------------------- screenshots + scroll checks
const browser = await chromium.launch();
const shots = [];
const scrollIssues = [];

for (const d of DIRS) {
  for (const w of WIDTHS_CHECK) {
    const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
    const page = await ctx.newPage();
    await page.goto(`${base}/direction-${d}/`, { waitUntil: 'networkidle', timeout: 30000 });
    const metrics = await page.evaluate(() => ({
      scrollW: document.documentElement.scrollWidth,
      clientW: document.documentElement.clientWidth,
    }));
    const overflow = metrics.scrollW - metrics.clientW;
    if (overflow > 1) {
      const culprits = await page.evaluate(() => {
        const bad = [];
        const limit = document.documentElement.clientWidth;
        document.querySelectorAll('*').forEach((el) => {
          const r = el.getBoundingClientRect();
          if (r.right > limit + 1 || r.left < -1) bad.push(el.tagName.toLowerCase() + (el.className ? '.' + String(el.className).split(' ')[0] : '') + ` right=${Math.round(r.right)}`);
        });
        return bad.slice(0, 5);
      });
      scrollIssues.push({ dir: d, width: w, overflow, culprits });
    }
    if (WIDTHS_SHOT.includes(w)) {
      const file = `design/screens/direction-${d}-${w}.png`;
      await page.screenshot({ path: file, fullPage: true });
      shots.push({ file, bytes: fs.statSync(file).size, dir: d, width: w });
    }
    console.log(`  ${d} @${w}: scrollW=${metrics.scrollW} clientW=${metrics.clientW} overflow=${overflow}`);
    await ctx.close();
  }
}
await browser.close();

// -------------------------------------------------------- lighthouse mobile
const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const lh = [];
for (const d of DIRS) {
  const res = await lighthouse(`${base}/direction-${d}/`, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  });
  const r = res.lhr;
  fs.mkdirSync('design/lighthouse', { recursive: true });
  fs.writeFileSync(`design/lighthouse/direction-${d}-mobile.json`, JSON.stringify(r));
  const n = (v, dp = 0) => (typeof v === 'number' ? Number(v.toFixed(dp)) : null);
  lh.push({
    dir: d,
    performance: n(r.categories.performance.score * 100),
    accessibility: n(r.categories.accessibility.score * 100),
    bestPractices: n(r.categories['best-practices'].score * 100),
    seo: n(r.categories.seo.score * 100),
    lcpMs: n(r.audits['largest-contentful-paint'].numericValue),
    cls: n(r.audits['cumulative-layout-shift'].numericValue, 3),
    totalBytes: n(r.audits['total-byte-weight'].numericValue),
  });
  console.log(`  lighthouse ${d}: perf=${lh.at(-1).performance} a11y=${lh.at(-1).accessibility} lcp=${lh.at(-1).lcpMs}ms cls=${lh.at(-1).cls}`);
}
await chrome.kill();
server.close();

// ------------------------------------------------------------------ output
const idx = ['file,direction,width,bytes'].concat(shots.map((s) => `${path.basename(s.file)},${s.dir},${s.width},${s.bytes}`)).join('\n') + '\n';
fs.writeFileSync('design/screens-index.csv', idx);
fs.writeFileSync('design/checks.json', JSON.stringify({ generatedAt: new Date().toISOString(), lighthouse: lh, scrollIssues, shots }, null, 2));

console.log(`\nscreenshots: ${shots.length}`);
if (scrollIssues.length) {
  console.log('HORIZONTAL SCROLL PROBLEMS:');
  scrollIssues.forEach((s) => console.log(`  direction ${s.dir} @${s.width}px overflow ${s.overflow}px — ${s.culprits.join('; ')}`));
  process.exitCode = 1;
} else {
  console.log('no horizontal scroll at 360/390/768/1440 in any direction');
}
