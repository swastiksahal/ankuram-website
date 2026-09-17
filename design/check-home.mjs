#!/usr/bin/env node
/**
 * check-home.mjs — whole-homepage mobile-first checks at 390x844.
 *
 * Rules: no text under 15px (the swipe hint is 14px by explicit instruction),
 * tap targets >= 44px, no horizontal PAGE scroll, only .swipe rows scroll
 * sideways, Lighthouse mobile >= 90, CLS < 0.1.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const ROOT = path.resolve('.');
const PORT = 8191;
const PAGE = '/design/direction-c/';
const VW = 390, VH = 844;
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

const out = { sections: [], scroll: [] };
const browser = await chromium.launch();

{
  const ctx = await browser.newContext({ viewport: { width: VW, height: VH }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });

  const m = await page.evaluate(() => {
    const rows = [];
    const push = (name, el) => { if (el) rows.push({ name, h: Math.round(el.getBoundingClientRect().height) }); };
    push('header', document.querySelector('.site-header'));
    document.querySelectorAll('main > section').forEach((s) => {
      const h = s.querySelector('h2') || s.querySelector('summary');
      push((h && h.textContent.trim().slice(0, 38)) || s.className.slice(0, 30), s);
    });
    push('footer', document.querySelector('.site-footer'));

    // smallest rendered text, ignoring the deliberately-14px swipe hint
    let minFont = 999, minSel = '';
    document.querySelectorAll('body *').forEach((el) => {
      if (el.classList.contains('swipe-hint') || el.classList.contains('skip')) return;
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      // getClientRects() is empty when the element, or any ancestor, is hidden
      if (!el.getClientRects().length) return;
      const cs = getComputedStyle(el);
      if (cs.visibility === 'hidden') return;
      const f = parseFloat(cs.fontSize);
      if (f < minFont) { minFont = f; minSel = (el.className || el.tagName).toString().slice(0, 36) + ':' + el.textContent.trim().slice(0, 18); }
    });

    const smallTaps = [...document.querySelectorAll('a, button, summary')]
      .filter((el) => !el.classList.contains('skip') && el.getBoundingClientRect().width > 0)
      .map((el) => ({ sel: (el.className || el.tagName).toString().slice(0, 36), h: Math.round(el.getBoundingClientRect().height) }))
      .filter((t) => t.h < 44);

    const badScrollers = [];
    document.querySelectorAll('body *').forEach((el) => {
      const ox = getComputedStyle(el).overflowX;
      if (el.scrollWidth > el.clientWidth + 1 && (ox === 'auto' || ox === 'scroll') && !el.classList.contains('swipe')) {
        badScrollers.push((el.className || el.tagName).toString().slice(0, 36));
      }
    });

    const swipes = [...document.querySelectorAll('.swipe')].map((el) => {
      const card = el.querySelector('.card, .panel-item, li, .row');
      return { scrollable: el.scrollWidth > el.clientWidth + 1, cardPct: card ? Math.round((card.getBoundingClientRect().width / el.clientWidth) * 100) : null };
    });

    return {
      rows, total: Math.round(document.body.scrollHeight),
      minFont: Math.round(minFont * 100) / 100, minSel,
      smallTaps, badScrollers, swipes,
      pageOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      faqAnswers: document.querySelectorAll('.accordion details .acc-body').length,
      faqClosed: [...document.querySelectorAll('.accordion details')].every((d) => !d.hasAttribute('open')),
      imgs: document.querySelectorAll('img').length,
    };
  });
  Object.assign(out, m);

  for (const f of fs.readdirSync('design/screens')) if (/^home-m-\d+\.png$/.test(f)) fs.unlinkSync(path.join('design/screens', f));
  const screens = Math.ceil(m.total / VH);
  for (let i = 0; i < screens; i++) {
    const y = i * VH;
    const height = Math.min(VH, m.total - y);
    if (height <= 2) break;
    await page.screenshot({ path: `design/screens/home-m-${String(i + 1).padStart(2, '0')}.png`, fullPage: true, clip: { x: 0, y, width: VW, height } });
  }
  await (await page.$('#reviews')).screenshot({ path: 'design/screens/reviews-390.png' });
  await (await page.$('.contact-form')).screenshot({ path: 'design/screens/contact-390.png' });
  out.screens = screens;
  await ctx.close();
}

out.svgGuard = [];
out.contrastGuard = [];
for (const w of [360, 390, 768, 1024, 1280, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });
  const m = await page.evaluate(() => ({ s: document.documentElement.scrollWidth, c: document.documentElement.clientWidth, h: Math.round(document.body.scrollHeight) }));
  out.scroll.push({ width: w, overflow: m.s - m.c, height: m.h });

  // GUARD: no non-diagram SVG may exceed 48px, and nothing may spill out of
  // the button or link that contains it.
  const guard = await page.evaluate(() => {
    const DIAGRAM = /ms-loop|wk-arrow|method|arw|dg-/;
    const big = [];
    document.querySelectorAll('svg').forEach((sv) => {
      const cls = (sv.getAttribute('class') || '');
      if (DIAGRAM.test(cls)) return;
      const r = sv.getBoundingClientRect();
      if (r.width > 48 || r.height > 48) big.push(`${cls || '(no class)'} ${Math.round(r.width)}x${Math.round(r.height)}`);
    });
    const spill = [];
    document.querySelectorAll('a, button').forEach((el) => {
      const r = el.getBoundingClientRect();
      if (!r.width) return;
      el.querySelectorAll('*').forEach((ch) => {
        const c = ch.getBoundingClientRect();
        if (c.width > r.width + 1 || c.height > r.height + 1) {
          spill.push(`${(el.className || el.tagName).toString().slice(0, 28)} < ${ch.tagName} ${Math.round(c.width)}x${Math.round(c.height)}`);
        }
      });
    });
    // invisible text: foreground within 3:1 of its own background
    const L = (col) => { const m2 = /rgba?\((\d+), ?(\d+), ?(\d+)/.exec(col); if (!m2) return 1;
      const v = [1, 2, 3].map((i) => Number(m2[i]) / 255).map((x) => (x <= 0.03928 ? x / 12.92 : Math.pow((x + 0.055) / 1.055, 2.4)));
      return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2]; };
    const invisible = [];
    document.querySelectorAll('a, button, span, div, p, li').forEach((el) => {
      if (![...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim())) return;
      if (!el.getClientRects().length) return;
      const cs = getComputedStyle(el);
      let bg = cs.backgroundColor, node = el;
      while (bg === 'rgba(0, 0, 0, 0)' && node.parentElement) { node = node.parentElement; bg = getComputedStyle(node).backgroundColor; }
      const l1 = L(cs.color), l2 = L(bg);
      const ratio = (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
      if (ratio < 3) invisible.push(`${(el.className || el.tagName).toString().slice(0, 30)} "${el.textContent.trim().slice(0, 20)}" ${ratio.toFixed(2)}:1`);
    });
    return { big, spill, invisible };
  });
  if (guard.big.length) out.svgGuard.push({ width: w, big: guard.big });
  if (guard.spill.length) out.svgGuard.push({ width: w, spill: guard.spill });
  if (guard.invisible.length) out.contrastGuard.push({ width: w, invisible: guard.invisible });
  if ([1024, 1280, 1440].includes(w)) {
    await page.screenshot({ path: `design/screens/home-desktop-${w}.png`, fullPage: true });
    await (await page.$('.site-header')).screenshot({ path: `design/screens/header-${w}.png` });
  }
  if (w === 1440) {
    await (await page.$('.sec-week')).screenshot({ path: 'design/screens/hybrid-1440.png' });
    await (await page.$('.site-footer')).screenshot({ path: 'design/screens/footer-1440.png' });
    await (await page.$('.contact-section')).screenshot({ path: 'design/screens/contact-1440.png' });
    await (await page.$('#reviews')).screenshot({ path: 'design/screens/reviews-1440.png' });
  }
  await ctx.close();
}
await browser.close();

const chrome = await chromeLauncher.launch({ chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'] });
const r = (await lighthouse(base + PAGE, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] })).lhr;
fs.writeFileSync('design/lighthouse/home-mobile.json', JSON.stringify(r));
const n = (v, d = 0) => Number(v.toFixed(d));
out.lighthouse = {
  performance: n(r.categories.performance.score * 100),
  accessibility: n(r.categories.accessibility.score * 100),
  cls: n(r.audits['cumulative-layout-shift'].numericValue, 3),
  lcpMs: n(r.audits['largest-contentful-paint'].numericValue),
  totalBytes: n(r.audits['total-byte-weight'].numericValue),
};
out.a11yFailures = r.categories.accessibility.auditRefs.map((x) => r.audits[x.id]).filter((a) => a && a.score !== null && a.score < 1).map((a) => a.id);

// Desktop Lighthouse as well — the desktop pass has to clear 90 too.
const DESKTOP = {
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
  throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
};
const rd = (await lighthouse(base + PAGE, { port: chrome.port, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, { extends: 'lighthouse:default', settings: DESKTOP })).lhr;
out.lighthouseDesktop = {
  performance: n(rd.categories.performance.score * 100),
  accessibility: n(rd.categories.accessibility.score * 100),
  cls: n(rd.audits['cumulative-layout-shift'].numericValue, 3),
  lcpMs: n(rd.audits['largest-contentful-paint'].numericValue),
};
await chrome.kill();
server.close();
fs.writeFileSync('design/home-checks.json', JSON.stringify(out, null, 2));

console.log(`PAGE @390: ${out.total}px = ${(out.total / VH).toFixed(1)} screens (${out.screens} PNGs)`);
out.rows.forEach((r2) => console.log(`  ${String(r2.h).padStart(5)}px  ${r2.name}`));
console.log(`min font: ${out.minFont}px (${out.minSel})   [swipe hint is 14px by instruction]`);
console.log(`taps <44px: ${out.smallTaps.length ? JSON.stringify(out.smallTaps.slice(0, 6)) : 'none'}`);
console.log(`page overflow: ${out.pageOverflow}px   unintended scrollers: ${out.badScrollers.join(', ') || 'none'}`);
console.log(`swipe rows: ${out.swipes.length}  ${JSON.stringify(out.swipes.slice(0, 3))}`);
console.log(`FAQ answers in HTML: ${out.faqAnswers}, all closed: ${out.faqClosed}   <img> count: ${out.imgs}`);
console.log('widths:', out.scroll.map((s) => `${s.width}:overflow=${s.overflow}`).join('  '));
console.log(`svg/spill guard: ${out.svgGuard.length ? JSON.stringify(out.svgGuard) : 'clean at 360/390/768/1024/1280/1440'}`);
console.log(`invisible-text guard: ${out.contrastGuard.length ? JSON.stringify(out.contrastGuard) : 'clean'}`);
console.log('lighthouse mobile :', JSON.stringify(out.lighthouse));
console.log('lighthouse desktop:', JSON.stringify(out.lighthouseDesktop));
console.log('a11y failures:', out.a11yFailures.join(', ') || 'none');

const bad = [];
if (out.minFont < 15) bad.push(`min font ${out.minFont} (${out.minSel})`);
if (out.smallTaps.length) bad.push(`${out.smallTaps.length} taps under 44px`);
if (out.pageOverflow > 1) bad.push('page overflow');
if (out.badScrollers.length) bad.push(`scrollers: ${out.badScrollers.join(', ')}`);
if (!out.swipes.every((s) => s.scrollable)) bad.push('a swipe row does not scroll');
if (out.imgs) bad.push(`A9: ${out.imgs} <img>`);
if (!out.faqClosed) bad.push('FAQ not closed');
if (out.lighthouse.performance < 90) bad.push(`mobile perf ${out.lighthouse.performance}`);
if (out.lighthouseDesktop.performance < 90) bad.push(`desktop perf ${out.lighthouseDesktop.performance}`);
if (out.lighthouseDesktop.cls >= 0.1) bad.push(`desktop CLS ${out.lighthouseDesktop.cls}`);
if (out.lighthouse.cls >= 0.1) bad.push(`CLS ${out.lighthouse.cls}`);
if (out.scroll.some((s) => s.overflow > 1)) bad.push('horizontal scroll at another width');
if (out.svgGuard.length) bad.push('oversized SVG or overflowing child inside a button/link');
if (out.contrastGuard.length) bad.push('text with under 3:1 contrast against its own background');
if (out.a11yFailures.length) bad.push(`a11y: ${out.a11yFailures.join(', ')}`);
if (bad.length) { console.log('\nFAIL:\n  ' + bad.join('\n  ')); process.exitCode = 1; } else console.log('\nPASS');
