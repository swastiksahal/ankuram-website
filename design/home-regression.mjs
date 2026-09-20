/**
 * home-regression.mjs — the homepage must be pixel-identical after wave 2
 * styling lands in the shared stylesheet. Serves build/staging and diffs the
 * full-page screenshots against the ones captured from the LIVE homepage.
 */
import fs from 'fs'; import path from 'path'; import http from 'http'; import crypto from 'crypto';
import { chromium } from 'playwright';
const ROOT = path.resolve('build/staging');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(8321, r));
const OUT = 'design/screens/home-regression-after'; fs.mkdirSync(OUT, { recursive: true });
const BLOCK = /doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect|\/ccm\/|\/rmkt\/|wa\.me/i;
const b = await chromium.launch();
const h = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex');
let bad = 0;
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  await p.goto('http://127.0.0.1:8321/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  const after = path.join(OUT, `home-${w}.png`);
  await p.screenshot({ path: after, fullPage: true });
  const before = `design/screens/home-regression-live/home-${w}.png`;
  const A = fs.readFileSync(before), Z = fs.readFileSync(after);
  const same = A.equals(Z);
  if (!same) bad++;
  const geo = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth }));
  console.log(`  ${w}px  live ${A.length} B  after ${Z.length} B  page ${geo.w}x${geo.h}`);
  console.log(`        sha256 live  ${h(before).slice(0, 24)}`);
  console.log(`        sha256 after ${h(after).slice(0, 24)}`);
  console.log(`        ${same ? 'PIXEL-IDENTICAL — zero delta' : '*** DIFFERENT ***'}`);
  await c.close();
}
await b.close(); srv.close();
console.log(bad ? `\nSTOP — the homepage changed at ${bad} width(s)` : '\nPASS — the homepage is pixel-identical at both widths');
process.exitCode = bad ? 1 : 0;
