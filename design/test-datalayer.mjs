/**
 * test-datalayer.mjs — capture dataLayer pushes Node-side, so the record
 * survives the navigation that destroys the page context.
 * wa.me and api.whatsapp.com are blocked: no message can be sent.
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
await new Promise((r) => server.listen(8282, r));
const BASE = 'http://127.0.0.1:8282/';
const WA = /wa\.me|api\.whatsapp\.com/i;
const BEACON = /doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect/i;

const browser = await chromium.launch();
const ctx = await browser.newContext({
  viewport: { width: 390, height: 844 },
  userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
});
const page = await ctx.newPage();
const pushes = [];
await page.exposeFunction('__dl', (s) => pushes.push(JSON.parse(s)));
await page.route('**/*', async (route) => {
  const r = route.request();
  if (WA.test(r.url()) || BEACON.test(r.url())) return route.abort();
  if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !r.url().startsWith(BASE)) return route.abort();
  return route.continue();
});
// install the recorder before contact-whatsapp.js runs
await page.addInitScript(() => {
  window.dataLayer = window.dataLayer || [];
  const realPush = window.dataLayer.push.bind(window.dataLayer);
  window.dataLayer.push = function (o) {
    try { window.__dl(JSON.stringify(o)); } catch (e) {}
    return realPush(o);
  };
});
await page.goto(BASE, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(500);

await page.evaluate(() => {
  document.getElementById('name').value = 'Test Parent';
  document.getElementById('phone').value = '9876543210';
  document.getElementById('grade').selectedIndex = 1;
  document.getElementById('curriculum').selectedIndex = 1;
});
await page.locator('.contact-form button[type=submit]').click();
await page.waitForTimeout(2000);

console.log(`dataLayer pushes captured: ${pushes.length}`);
pushes.forEach((p) => console.log('  ' + JSON.stringify(p)));
const fs2 = pushes.filter((p) => p && p.event === 'form_submission');
console.log(`\nform_submission pushes: ${fs2.length}`);
console.log(fs2.length === 1 ? 'PASS — exactly one form_submission dataLayer push' : 'FAIL');

// and the phone / whatsapp / cta inline handlers
const ctx2 = await browser.newContext({ viewport: { width: 390, height: 844 } });
const p2 = await ctx2.newPage();
const pushes2 = [];
const errs = [];
await p2.exposeFunction('__dl', (s) => pushes2.push(JSON.parse(s)));
p2.on('pageerror', (e) => errs.push(String(e).slice(0, 120)));
await p2.route('**/*', async (route) => {
  const r = route.request();
  if (WA.test(r.url()) || BEACON.test(r.url())) return route.abort();
  if (r.isNavigationRequest() && r.frame() === p2.mainFrame() && !r.url().startsWith(BASE)) return route.abort();
  return route.continue();
});
await p2.addInitScript(() => {
  window.dataLayer = window.dataLayer || [];
  const realPush = window.dataLayer.push.bind(window.dataLayer);
  window.dataLayer.push = function (o) { try { window.__dl(JSON.stringify(o)); } catch (e) {} return realPush(o); };
});
await p2.goto(BASE, { waitUntil: 'domcontentloaded' });
await p2.waitForTimeout(400);
const res = await p2.evaluate(() => {
  const out = {};
  try { window.trackPhoneClick('test_location'); out.phone = 'ok'; } catch (e) { out.phone = String(e); }
  try { window.trackWhatsAppClick('test_location'); out.whatsapp = 'ok'; } catch (e) { out.whatsapp = String(e); }
  try { window.trackCTAClick('test_cta', 'test_location'); out.cta = 'ok'; } catch (e) { out.cta = String(e); }
  return out;
});
console.log(`\ndirect calls to the three restored handlers: ${JSON.stringify(res)}`);
console.log(`their dataLayer pushes (${pushes2.length}):`);
pushes2.forEach((p) => console.log('  ' + JSON.stringify(p)));
console.log(`page errors: ${errs.length ? errs.join(' | ') : 'none'}`);

await browser.close();
server.close();
