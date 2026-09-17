#!/usr/bin/env node
/**
 * check-hybrid.mjs — mobile-first budget checks for the A11 section.
 *
 * Hard budget at 390x844:
 *   whole section  <= 2 viewports (1688px)
 *   each diagram   <= 1 viewport  (844px)
 *   no text < 15px, tap targets >= 44px
 *   no horizontal PAGE scroll; only .swipe rows may scroll sideways
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve('.');
const PORT = 8171;
const PAGE = '/design/direction-c/';
const VW = 390, VH = 844;
const BUDGET_SECTION = VH * 2;
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

const out = { budget: {}, scroll: [], shots: [] };
const browser = await chromium.launch();

// ------------------------------------------------- phone: measure + capture
{
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });

  out.budget = await page.evaluate(() => {
    const h = (sel) => { const el = document.querySelector(sel); return el ? Math.round(el.getBoundingClientRect().height) : null; };
    const sec = document.querySelector('.sec-week');
    const r = sec.getBoundingClientRect();

    // smallest rendered font among elements that actually carry text
    let minFont = 999, minSel = '';
    sec.querySelectorAll('*').forEach((el) => {
      const txt = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      if (!txt) return;
      const cs = getComputedStyle(el);
      if (cs.display === 'none' || cs.visibility === 'hidden') return;
      const f = parseFloat(cs.fontSize);
      if (f < minFont) { minFont = f; minSel = el.className || el.tagName; }
    });

    // interactive targets
    // Only the parts this pass redesigned: the section and the header.
    // .skip is offscreen until focused, so it is not a tap target.
    const taps = [...document.querySelectorAll('.sec-week a, .sec-week button, .sec-week summary, .site-header a, .site-header summary')]
      .filter((el) => !el.classList.contains('skip') && el.getBoundingClientRect().width > 0)
      .map((el) => { const b = el.getBoundingClientRect(); return { sel: (el.className || el.tagName).toString().slice(0, 40), w: Math.round(b.width), h: Math.round(b.height) }; });
    const smallTaps = taps.filter((t) => t.h < 44).slice(0, 8);

    // anything wider than the viewport that is NOT an intended swipe row
    const overflowing = [];
    sec.querySelectorAll('*').forEach((el) => {
      // Only elements that can actually scroll count. overflow:visible just
      // reports a larger scrollWidth when a decoration sticks out.
      const ox = getComputedStyle(el).overflowX;
      if (el.scrollWidth > el.clientWidth + 1 && (ox === 'auto' || ox === 'scroll') && !el.classList.contains('swipe')) {
        overflowing.push((el.className || el.tagName).toString().slice(0, 40));
      }
    });

    const swipes = [...document.querySelectorAll('.swipe')].map((el) => ({
      scrollable: el.scrollWidth > el.clientWidth + 1,
      cardPct: Math.round((el.querySelector('.card').getBoundingClientRect().width / el.clientWidth) * 100),
    }));

    return {
      sectionHeight: Math.round(r.height),
      d1: h('.dg-week'),
      d2: h('.dg-loop'),
      d3Removed: document.querySelector('.dg-weekend') === null,
      weekendLine: !!document.querySelector('.wk-weekend'),
      chipCount: document.querySelectorAll('.chip').length,
      chipH: h('.chip'),
      badge: document.querySelectorAll('.chip-badge').length,
      minFont: Math.round(minFont * 100) / 100,
      minFontSel: minSel.toString().slice(0, 40),
      smallTaps,
      overflowing,
      swipes,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      loopNoteOneLine: (() => {
        const n = document.querySelector('.dg-loop .ms-note');
        if (!n) return null;
        const lh = parseFloat(getComputedStyle(n).lineHeight);
        return n.getBoundingClientRect().height < lh * 1.8;   // one line, not two
      })(),
    };
  });

  // one PNG per viewport, covering the whole section
  const box = await (await page.$('.sec-week')).boundingBox();
  const shots = Math.ceil(box.height / VH);
  for (let i = 0; i < shots; i++) {
    const y = Math.round(box.y + i * VH);
    const height = Math.min(VH, Math.round(box.y + box.height - y));
    if (height <= 0) break;
    const file = `design/screens/hybrid-m-${i + 1}.png`;
    await page.screenshot({ path: file, fullPage: true, clip: { x: 0, y, width: VW, height } });
    out.shots.push(path.basename(file));
  }
  await ctx.close();
}

// -------------------------------------------------------- other breakpoints
for (const w of [360, 768, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });
  const m = await page.evaluate(() => ({
    s: document.documentElement.scrollWidth,
    c: document.documentElement.clientWidth,
    whyCols: getComputedStyle(document.querySelector('.swipe-4')).gridTemplateColumns.split(' ').length,
    flowDisplay: getComputedStyle(document.querySelector('.dg-loop .ms-flow')).display,
  }));
  out.scroll.push({ width: w, overflow: m.s - m.c, whyCols: m.whyCols, flow: m.flowDisplay });
  if (w === 1440) {
    await (await page.$('.sec-week')).screenshot({ path: 'design/screens/hybrid-1440.png' });
    out.shots.push('hybrid-1440.png');
  }
  await ctx.close();
}
await browser.close();

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const r = (await lighthouse(base + PAGE, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] })).lhr;
fs.writeFileSync('design/lighthouse/hybrid-mobile.json', JSON.stringify(r));
const n = (v, d = 0) => Number(v.toFixed(d));
out.lighthouse = {
  performance: n(r.categories.performance.score * 100),
  accessibility: n(r.categories.accessibility.score * 100),
  cls: n(r.audits['cumulative-layout-shift'].numericValue, 3),
  lcpMs: n(r.audits['largest-contentful-paint'].numericValue),
  totalBytes: n(r.audits['total-byte-weight'].numericValue),
};
out.a11yFailures = r.categories.accessibility.auditRefs.map((x) => r.audits[x.id]).filter((a) => a && a.score !== null && a.score < 1).map((a) => a.id);
await chrome.kill();
server.close();
fs.writeFileSync('design/hybrid-checks.json', JSON.stringify(out, null, 2));

const B = out.budget;
console.log(`section height @390: ${B.sectionHeight}px  (budget ${BUDGET_SECTION}px, = ${(B.sectionHeight / VH).toFixed(2)} viewports)`);
console.log(`D1 ${B.d1}px   D2 ${B.d2}px   (budget ${VH}px each)`);
console.log(`D3 removed: ${B.d3Removed}   weekend line present: ${B.weekendLine}   chips ${B.chipCount} @${B.chipH}px   +2 badges ${B.badge}`);
console.log(`min font in section: ${B.minFont}px (${B.minFontSel})`);
console.log(`swipe rows: ${JSON.stringify(B.swipes)}`);
console.log(`page overflow: ${B.pageOverflow}px   unintended sideways scrollers: ${B.overflowing.join(', ') || 'none'}`);
console.log(`loop note on one line: ${B.loopNoteOneLine}`);
console.log(`taps under 44px: ${B.smallTaps.length ? JSON.stringify(B.smallTaps) : 'none'}`);
console.log('other widths:', out.scroll.map((s) => `${s.width}:overflow=${s.overflow} whyCols=${s.whyCols} flow=${s.flow}`).join('  '));
console.log('lighthouse:', JSON.stringify(out.lighthouse));
console.log('a11y failures:', out.a11yFailures.join(', ') || 'none');
console.log('shots:', out.shots.join(', '));

let bad = [];
if (B.sectionHeight > BUDGET_SECTION) bad.push(`section ${B.sectionHeight} > ${BUDGET_SECTION}`);
if (B.d1 > VH) bad.push(`D1 ${B.d1} > ${VH}`);
if (B.d2 > VH) bad.push(`D2 ${B.d2} > ${VH}`);
if (B.minFont < 15) bad.push(`min font ${B.minFont} < 15`);
if (B.smallTaps.length) bad.push(`${B.smallTaps.length} taps under 44px`);
if (B.pageOverflow > 1) bad.push(`page overflow ${B.pageOverflow}`);
if (B.overflowing.length) bad.push(`unintended scrollers: ${B.overflowing.join(', ')}`);
if (!B.swipes.every((s) => s.scrollable && s.cardPct >= 80 && s.cardPct <= 90)) bad.push('swipe rows not scrolling at ~85%');
if (!B.d3Removed) bad.push('D3 still present');
if (out.lighthouse.performance < 90) bad.push(`perf ${out.lighthouse.performance} < 90`);
if (out.lighthouse.cls >= 0.1) bad.push(`CLS ${out.lighthouse.cls}`);
if (out.scroll.some((s) => s.overflow > 1)) bad.push('horizontal scroll at another width');
if (out.a11yFailures.length) bad.push(`a11y: ${out.a11yFailures.join(', ')}`);

if (bad.length) { console.log('\nFAIL:\n  ' + bad.join('\n  ')); process.exitCode = 1; }
else console.log('\nPASS: every budget met');
