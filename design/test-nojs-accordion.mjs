/**
 * test-nojs-accordion.mjs — A20 must not have made the disclosure depend on JS.
 * Runs with javaScriptEnabled:false and drives the accordions by real clicks.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const ROOT = path.resolve('build/staging');
const PORT = 8275;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const browser = await chromium.launch();
const bad = [];
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: false });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });

  const sel = '.sec-details .accordion details';
  const first = page.locator(sel).first();
  const sum = first.locator('summary');
  const h3 = first.locator('summary h3.faq-question');

  const openAttr = async () => first.evaluate((el) => el.open).catch(() => null);
  // with JS disabled we cannot evaluate; use the attribute via the DOM snapshot
  const isOpen = async () => (await first.getAttribute('open')) !== null;
  const bodyVisible = async () => first.locator('.acc-body').isVisible();

  const startOpen = await isOpen();
  const startVisible = await bodyVisible();

  // click the heading itself — the text a user actually taps
  await h3.click();
  const afterOpen = await isOpen();
  const afterVisible = await bodyVisible();

  // click again to close
  await h3.click();
  const closedAgain = await isOpen();
  const closedVisible = await bodyVisible();

  // and the tap target of the summary row
  const box = await sum.boundingBox();

  console.log(`${w}px, JavaScript DISABLED`);
  console.log(`   initial:        open=${startOpen}  body visible=${startVisible}`);
  console.log(`   after 1 click:  open=${afterOpen}  body visible=${afterVisible}`);
  console.log(`   after 2 clicks: open=${closedAgain}  body visible=${closedVisible}`);
  console.log(`   summary tap target: ${Math.round(box.width)}x${Math.round(box.height)}px`);

  if (startOpen || startVisible) bad.push(`${w}: starts open`);
  if (!afterOpen || !afterVisible) bad.push(`${w}: clicking the h3 did not open it`);
  if (closedAgain || closedVisible) bad.push(`${w}: clicking again did not close it`);
  if (box.height < 44) bad.push(`${w}: tap target ${Math.round(box.height)}px < 44px`);
  await ctx.close();
}
await browser.close();
server.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — opens and closes with no JavaScript, tap targets >= 44px');
process.exitCode = bad.length ? 1 : 0;
