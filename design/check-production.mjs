/**
 * Overflow + anchors + Lighthouse against build/production, served as the
 * document root so every relative href resolves the way it will on live.
 * script.js is NOT in build/production (the live server already has it), so it
 * is served from public_html/script.js to reproduce the live page faithfully.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const ROOT = path.resolve('build/production');
const PORT = 8266;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (url === '/' || url.endsWith('/')) file = path.join(file, 'index.html');
  // the live server already serves /script.js from the web root
  if (url === '/script.js') file = path.resolve('public_html/script.js');
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}/`;

const ANCHORS = ['home', 'about', 'curricula', 'contact', 'reviews', 'hybrid-classes'];
const WIDTHS = [360, 390, 768, 1024, 1280, 1440];

const browser = await chromium.launch();
const out = [];
for (const w of WIDTHS) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(BASE, { waitUntil: 'networkidle', timeout: 45000 });
  const r = await page.evaluate(() => {
    const d = document.documentElement;
    const over = Math.max(0, d.scrollWidth - d.clientWidth);
    const wide = [...document.querySelectorAll('*')]
      .filter((el) => el.getBoundingClientRect().right > d.clientWidth + 1)
      .slice(0, 5).map((el) => el.tagName + '.' + (el.className || '').toString().split(' ')[0]);
    return { over, wide };
  });
  out.push(`  ${String(w).padStart(4)}: overflow=${r.over}px${r.wide.length ? '  offenders: ' + r.wide.join(', ') : ''}`);
  await ctx.close();
}

const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.goto(BASE, { waitUntil: 'networkidle' });
const anchors = await page.evaluate((ids) => ids.map((id) => ({ id, present: !!document.getElementById(id), tag: document.getElementById(id)?.tagName.toLowerCase() || null })), ANCHORS);
const refs = await page.evaluate(() => {
  const list = [];
  document.querySelectorAll('[src],[href]').forEach((el) => {
    const v = el.getAttribute('src') || el.getAttribute('href');
    if (v) list.push({ tag: el.tagName.toLowerCase(), v });
  });
  return list;
});
await ctx.close();

console.log('=== horizontal overflow, build/production');
out.forEach((l) => console.log(l));
console.log('\n=== anchor ids');
anchors.forEach((a) => console.log(`  #${a.id.padEnd(16)} ${a.present ? 'PRESENT' : 'MISSING'}  <${a.tag}>`));

console.log('\n=== every src/href the page requests (local, non-anchor)');
const local = [...new Set(refs.filter((r) => !/^(#|tel:|mailto:|https?:|data:)/.test(r.v)).map((r) => `${r.tag}  ${r.v}`))];
local.forEach((l) => console.log('  ' + l));
const absLocal = [...new Set(refs.filter((r) => /^\//.test(r.v)).map((r) => r.v))];
console.log('\n=== root-relative hrefs (resolve on the live server)');
absLocal.forEach((l) => console.log('  ' + l));

// ------------------------------------------------------------- lighthouse
const lhBrowser = await chromium.launch({ args: ['--remote-debugging-port=9333'] });
const presets = {
  mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } },
  desktop: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
};
console.log('');
for (const [name, cfg] of Object.entries(presets)) {
  const res = await lighthouse(BASE, { port: 9333, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'] }, { extends: 'lighthouse:default', settings: cfg });
  const c = res.lhr.categories;
  const a = res.lhr.audits;
  console.log(`lighthouse ${name.padEnd(7)}: perf ${Math.round(c.performance.score * 100)}  a11y ${Math.round(c.accessibility.score * 100)}  best-practices ${Math.round(c['best-practices'].score * 100)}  seo ${Math.round(c.seo.score * 100)}  CLS ${a['cumulative-layout-shift'].numericValue.toFixed(3)}  LCP ${Math.round(a['largest-contentful-paint'].numericValue)}ms`);
  const fails = Object.values(a).filter((x) => x.score === 0 && x.scoreDisplayMode === 'binary' && /seo|accessib/i.test(x.id + x.title)).map((x) => x.id);
  if (fails.length) console.log(`   failing: ${fails.join(', ')}`);
}
await lhBrowser.close();
await browser.close();
server.close();
