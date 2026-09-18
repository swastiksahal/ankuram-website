/**
 * test-no-double-conversion.mjs — the restored inline handlers (A21) run
 * alongside the delegated conversion listener. Clicking a tel: or wa.me link
 * that carries an inline onclick must still fire EXACTLY ONE Ads conversion.
 * All outbound navigation and beacons are blocked.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const ROOT = path.resolve('build/staging');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(8283, r));
const BASE = 'http://127.0.0.1:8283/';
const BLOCK = /wa\.me|api\.whatsapp\.com|doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect/i;

const browser = await chromium.launch();
const bad = [];

for (const [label, selector, wantLabel] of [
  ['tel: link with inline trackPhoneClick', 'a[href^="tel:"][onclick*="trackPhoneClick"]', 'NGIFCNbv3OAbEPOvruco'],
  ['wa.me link with inline trackWhatsAppClick', 'a[href*="wa.me"][onclick*="trackWhatsAppClick"]', 'jucWCNPv3OAbEPOvruco'],
]) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const page = await ctx.newPage();
  const calls = [];
  const errs = [];
  await page.exposeFunction('__rec', (s) => calls.push(s));
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  await page.route('**/*', async (route) => {
    const r = route.request();
    if (BLOCK.test(r.url())) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !r.url().startsWith(BASE)) return route.abort();
    return route.continue();
  });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);
  await page.evaluate(() => {
    const inner = window.gtag;
    window.gtag = function () {
      try { window.__rec(JSON.stringify([...arguments].map((a) => (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a)))); } catch (e) {}
      try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) {}
    };
  });
  const all = page.locator(selector);
  const n = await all.count();
  if (!n) { console.log(`${label}: NO MATCHING LINK (${selector})`); await ctx.close(); continue; }
  // the first match sits inside the hidden availability-results panel
  let target = null;
  for (let i = 0; i < n; i++) { if (await all.nth(i).isVisible()) { target = all.nth(i); break; } }
  if (!target) { console.log(`${label}: ${n} link(s), none visible`); await ctx.close(); continue; }
  await target.click({ force: true });
  await page.waitForTimeout(1200);

  const conversions = calls.filter((c) => c.includes(wantLabel));
  const anyConv = calls.filter((c) => c.includes('"conversion"'));
  console.log(`\n${label}  (${n} such link(s) on the page)`);
  calls.forEach((c) => console.log(`   ${c}`));
  console.log(`   conversions with ${wantLabel}: ${conversions.length}`);
  console.log(`   conversion events of ANY label: ${anyConv.length}`);
  console.log(`   page errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  if (conversions.length !== 1) bad.push(`${label}: expected 1 conversion, got ${conversions.length}`);
  if (anyConv.length !== 1) bad.push(`${label}: expected 1 conversion event total, got ${anyConv.length}`);
  if (errs.length) bad.push(`${label}: page errors`);
  await ctx.close();
}
await browser.close();
server.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — exactly one conversion per click, no double-counting, no errors');
process.exitCode = bad.length ? 1 : 0;
