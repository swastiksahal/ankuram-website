#!/usr/bin/env node
/**
 * check-c-final.mjs — screenshots, scroll checks and Lighthouse mobile for the
 * final Direction C page. Serves the project root so css/site.css resolves.
 *
 * Usage: node design/check-c-final.mjs
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve('.');
const PORT = 8142;
const PAGE = '/design/direction-c/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.webp': 'image/webp', '.png': 'image/png', '.js': 'text/javascript', '.json': 'application/json' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (url.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('nf'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;
fs.mkdirSync('design/screens', { recursive: true });

const browser = await chromium.launch();
const results = { shots: [], scroll: [] };

for (const w of [360, 390, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });

  const m = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  results.scroll.push({ width: w, overflow: m.s - m.c });

  // CSS check: confirm the mobile menu / desktop nav swap actually happens
  const nav = await page.evaluate(() => {
    const d = document.querySelector('.nav-desktop');
    const mo = document.querySelector('.nav-mobile');
    return { desktop: d ? getComputedStyle(d).display : null, mobile: mo ? getComputedStyle(mo).display : null };
  });
  results[`nav@${w}`] = nav;

  // diagram layout + minimum caption size
  const dg = await page.evaluate(() => {
    const flow = document.querySelector('.ms-flow');
    const cap = document.querySelector('.ms-caption');
    const loopH = document.querySelector('.ms-loop-h');
    const loopV = document.querySelector('.ms-loop-v');
    return {
      direction: flow ? getComputedStyle(flow).flexDirection : null,
      captionPx: cap ? parseFloat(getComputedStyle(cap).fontSize) : null,
      loopH: loopH ? getComputedStyle(loopH).display : null,
      loopV: loopV ? getComputedStyle(loopV).display : null,
    };
  });
  results[`diagram@${w}`] = dg;

  if (w === 390 || w === 1440) {
    const full = `design/screens/c-final-${w}.png`;
    await page.screenshot({ path: full, fullPage: true });
    results.shots.push({ file: full, bytes: fs.statSync(full).size });

    const topH = w === 390 ? 2400 : 2700;
    const top = `design/screens/c-final-${w}-top.png`;
    await page.screenshot({ path: top, clip: { x: 0, y: 0, width: w, height: topH } });
    results.shots.push({ file: top, bytes: fs.statSync(top).size });

    const fig = await page.$('.method');
    const dfile = `design/screens/c-diagram-${w}.png`;
    await fig.screenshot({ path: dfile });
    results.shots.push({ file: dfile, bytes: fs.statSync(dfile).size });
  }
  await ctx.close();
}
await browser.close();

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const res = await lighthouse(base + PAGE, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] });
const r = res.lhr;
fs.mkdirSync('design/lighthouse', { recursive: true });
fs.writeFileSync('design/lighthouse/c-final-mobile.json', JSON.stringify(r));
const n = (v, d = 0) => Number(v.toFixed(d));
results.lighthouse = {
  performance: n(r.categories.performance.score * 100),
  accessibility: n(r.categories.accessibility.score * 100),
  bestPractices: n(r.categories['best-practices'].score * 100),
  seo: n(r.categories.seo.score * 100),
  lcpMs: n(r.audits['largest-contentful-paint'].numericValue),
  cls: n(r.audits['cumulative-layout-shift'].numericValue, 3),
  totalBytes: n(r.audits['total-byte-weight'].numericValue),
};
await chrome.kill();
server.close();

fs.writeFileSync('design/c-final-checks.json', JSON.stringify(results, null, 2));

console.log('scroll overflow:', results.scroll.map((s) => `${s.width}px=${s.overflow}`).join('  '));
for (const w of [360, 390, 768, 1440]) console.log(`nav@${w}: desktop=${results[`nav@${w}`].desktop} mobile=${results[`nav@${w}`].mobile}`);
for (const w of [360, 390, 768, 1440]) { const d = results[`diagram@${w}`]; console.log(`diagram@${w}: ${d.direction}, caption ${d.captionPx}px, loop h=${d.loopH} v=${d.loopV}`); }
console.log('shots:', results.shots.map((s) => path.basename(s.file)).join(', '));
console.log('lighthouse mobile:', JSON.stringify(results.lighthouse));

const L = results.lighthouse;
let bad = false;
if (L.performance < 90) { console.log(`FAIL performance ${L.performance} < 90`); bad = true; }
if (L.cls >= 0.1) { console.log(`FAIL CLS ${L.cls} >= 0.1`); bad = true; }
if (results.scroll.some((s) => s.overflow > 1)) { console.log('FAIL horizontal scroll'); bad = true; }
if (bad) process.exitCode = 1; else console.log('PASS: performance >= 90, CLS < 0.1, no horizontal scroll');
