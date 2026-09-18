/**
 * check-inline-handlers.mjs — the authoritative guard for the A19/A21 defect.
 *
 * Raw sections are carried into the rebuild verbatim, inline on* attributes and
 * all, but the old page's inline <script> is not. Any function those attributes
 * call must actually EXIST at runtime, or it is a ReferenceError on the live
 * site. A regex over the sources is not good enough: a named function
 * expression assigned to the wrong name still matches the regex while being
 * undefined at runtime. So this loads the built page in a real browser and asks
 * the page itself.
 *
 *   node design/check-inline-handlers.mjs [build/staging]
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

// The argument is either a local build directory or a full http(s) URL. A URL
// checks the deployed site itself, which is the only thing that really counts.
const ARG = process.argv[2] || 'build/staging';
const IS_URL = /^https?:\/\//i.test(ARG);
const DIR = IS_URL ? null : path.resolve(ARG);
const PORT = 8284;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
let server = null;
let target = ARG;
if (!IS_URL) {
  server = http.createServer((req, res) => {
    const u = decodeURIComponent(req.url.split('?')[0]);
    let f = path.join(DIR, u);
    if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
    // build/production does not ship script.js; live serves it from the web root
    if (u === '/script.js' && !fs.existsSync(f)) f = path.resolve('public_html/script.js');
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(res);
  });
  await new Promise((r) => server.listen(PORT, r));
  target = `http://127.0.0.1:${PORT}/`;
}

const html = IS_URL
  ? await fetch(ARG).then((r) => r.text())
  : fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const called = new Set();
for (const m of html.matchAll(/\son[a-z]+\s*=\s*"([^"]*)"/gi)) {
  for (const c of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)) called.add(c[1]);
}
const BUILTIN = new Set(['alert', 'confirm', 'parseInt', 'parseFloat', 'String', 'Number']);
const names = [...called].filter((n) => !BUILTIN.has(n)).sort();

const browser = await chromium.launch();
const ctx = await browser.newContext();
const page = await ctx.newPage();
const errors = [];
page.on('pageerror', (e) => errors.push(String(e).slice(0, 160)));
// CACHE_BUST=1 re-requests the site's own scripts with a query string, to read
// past a stale CDN edge copy and exercise the bytes actually on the origin.
const BUST = process.env.CACHE_BUST === '1';
await page.route('**/*', (route) => {
  const u = route.request().url();
  if (/googletagmanager|clarity|doubleclick|google-analytics|analytics\.google/i.test(u)) return route.abort();
  if (BUST && /\.(js|css)(\?|$)/i.test(u) && u.startsWith('https://ankuramtuition.com/')) {
    return route.continue({ url: u + (u.includes('?') ? '&' : '?') + 'cachebust=' + Date.now() });
  }
  return route.continue();
});
await page.goto(target, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);

const results = await page.evaluate((list) => list.map((n) => ({ n, type: typeof window[n] })), names);

console.log(`${IS_URL ? ARG : path.relative(process.cwd(), DIR)}: ${names.length} function(s) referenced by inline on* attributes\n`);
let bad = 0;
for (const r of results) {
  const ok = r.type === 'function';
  if (!ok) bad++;
  console.log(`  ${ok ? 'OK     ' : 'MISSING'}  window.${r.n}  typeof=${r.type}`);
}
console.log(`\npage errors on load: ${errors.length ? errors.join(' | ') : 'none'}`);
await browser.close();
if (server) server.close();
console.log(bad ? `\nFAIL — ${bad} undefined at runtime` : '\nPASS — every inline handler resolves at runtime');
process.exitCode = bad ? 1 : 0;
