#!/usr/bin/env node
/**
 * check-hybrid.mjs — screenshots and checks for the A11 staging homepage.
 * Serves the project root so ../../css/site.css resolves.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve('.');
const PORT = 8161;
const PAGE = '/design/direction-c/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.png': 'image/png' };

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

const out = { scroll: [], shots: [] };
const browser = await chromium.launch();

for (const w of [360, 390, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });

  const m = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth }));
  out.scroll.push({ width: w, overflow: m.s - m.c });

  out[`layout@${w}`] = await page.evaluate(() => {
    const cs = (sel, prop) => { const el = document.querySelector(sel); return el ? getComputedStyle(el)[prop] : null; };
    const header = document.querySelector('.header-inner');
    const kids = header ? [...header.children].filter((el) => getComputedStyle(el).display !== 'none') : [];
    // "One row" means every visible child shares vertical space, not that their
    // top edges match to the pixel -- items of different heights are centred.
    const boxes = kids.map((el) => el.getBoundingClientRect());
    const overlaps = boxes.every((b) => b.top < boxes[0].bottom && b.bottom > boxes[0].top);
    return {
      headerRows: overlaps ? 1 : 2,
      headerHeight: header ? Math.round(header.getBoundingClientRect().height) : null,
      headerVisibleChildren: kids.length,
      navDesktop: cs('.nav-desktop', 'display'),
      navMobile: cs('.nav-mobile', 'display'),
      hctaText: cs('.hcta-text', 'display'),
      hctaIcon: cs('.hcta-ic', 'display'),
      weekCells: cs('.wk-cells', 'gridTemplateColumns').split(' ').length,
      blockLabelPx: parseFloat(cs('.wk-block-label', 'fontSize') || '0'),
      weLabelPx: parseFloat(cs('.we-label', 'fontSize') || '0'),
      msCaptionPx: parseFloat(cs('.ms-caption', 'fontSize') || '0'),
      areasOpen: document.querySelector('.areas-details')?.hasAttribute('open') ?? null,
      diagrams: document.querySelectorAll('figure.dg, figure.method').length,
    };
  });

  if (w === 390) {
    const hd = await page.$('.site-header');
    await hd.screenshot({ path: 'design/screens/header-390.png' });
    const areas = await page.$('.sec-areas');
    await areas.screenshot({ path: 'design/screens/areas-closed-390.png' });
    const week = await page.$('.sec-week');
    await week.screenshot({ path: 'design/screens/hybrid-390.png' });
    out.shots.push('header-390.png', 'areas-closed-390.png', 'hybrid-390.png');
  }
  if (w === 1440) {
    const week = await page.$('.sec-week');
    await week.screenshot({ path: 'design/screens/hybrid-1440.png' });
    await page.screenshot({ path: 'design/screens/c-final-1440.png', fullPage: true });
    out.shots.push('hybrid-1440.png', 'c-final-1440.png');
  }
  await ctx.close();
}
await browser.close();

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const r = (await lighthouse(base + PAGE, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] })).lhr;
fs.mkdirSync('design/lighthouse', { recursive: true });
fs.writeFileSync('design/lighthouse/hybrid-mobile.json', JSON.stringify(r));
const n = (v, d = 0) => Number(v.toFixed(d));
out.lighthouse = {
  performance: n(r.categories.performance.score * 100),
  accessibility: n(r.categories.accessibility.score * 100),
  bestPractices: n(r.categories['best-practices'].score * 100),
  seo: n(r.categories.seo.score * 100),
  lcpMs: n(r.audits['largest-contentful-paint'].numericValue),
  cls: n(r.audits['cumulative-layout-shift'].numericValue, 3),
  totalBytes: n(r.audits['total-byte-weight'].numericValue),
};
const failed = r.categories.accessibility.auditRefs.map((x) => r.audits[x.id]).filter((a) => a && a.score !== null && a.score < 1);
out.a11yFailures = failed.map((a) => a.id);
await chrome.kill();
server.close();
fs.writeFileSync('design/hybrid-checks.json', JSON.stringify(out, null, 2));

console.log('scroll overflow:', out.scroll.map((s) => `${s.width}=${s.overflow}`).join('  '));
for (const w of [360, 390, 768, 1440]) {
  const L = out[`layout@${w}`];
  console.log(`@${w}: headerRows=${L.headerRows} h=${L.headerHeight}px navDesktop=${L.navDesktop} navMobile=${L.navMobile} hctaText=${L.hctaText} icon=${L.hctaIcon} weekCols=${L.weekCells} blockLabel=${L.blockLabelPx}px weLabel=${L.weLabelPx}px caption=${L.msCaptionPx}px areasOpen=${L.areasOpen} diagrams=${L.diagrams}`);
}
console.log('lighthouse:', JSON.stringify(out.lighthouse));
console.log('a11y failures:', out.a11yFailures.join(', ') || 'none');

let bad = false;
if (out.lighthouse.performance < 90) { console.log('FAIL perf < 90'); bad = true; }
if (out.lighthouse.cls >= 0.1) { console.log('FAIL CLS >= 0.1'); bad = true; }
if (out.scroll.some((s) => s.overflow > 1)) { console.log('FAIL horizontal scroll'); bad = true; }
for (const w of [360, 390]) {
  const L = out[`layout@${w}`];
  if (L.headerRows !== 1) { console.log(`FAIL header is ${L.headerRows} rows at ${w}px`); bad = true; }
  if (L.blockLabelPx < 16 || L.weLabelPx < 16 || L.msCaptionPx < 16) { console.log(`FAIL diagram text under 16px at ${w}px`); bad = true; }
  if (L.areasOpen !== false) { console.log(`FAIL areas <details> is not closed at ${w}px`); bad = true; }
}
process.exitCode = bad ? 1 : 0;
if (!bad) console.log('PASS');
