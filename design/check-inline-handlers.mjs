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

const DIR = path.resolve(process.argv[2] || 'build/staging');
const PORT = 8284;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer((req, res) => {
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

const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
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
await page.route('**/*', (route) => (/googletagmanager|clarity|doubleclick|google-analytics|analytics\.google/i.test(route.request().url()) ? route.abort() : route.continue()));
await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'domcontentloaded' });
await page.waitForTimeout(600);

const results = await page.evaluate((list) => list.map((n) => ({ n, type: typeof window[n] })), names);

console.log(`${path.relative(process.cwd(), DIR)}: ${names.length} function(s) referenced by inline on* attributes\n`);
let bad = 0;
for (const r of results) {
  const ok = r.type === 'function';
  if (!ok) bad++;
  console.log(`  ${ok ? 'OK     ' : 'MISSING'}  window.${r.n}  typeof=${r.type}`);
}
console.log(`\npage errors on load: ${errors.length ? errors.join(' | ') : 'none'}`);
await browser.close();
server.close();
console.log(bad ? `\nFAIL — ${bad} undefined at runtime` : '\nPASS — every inline handler resolves at runtime');
process.exitCode = bad ? 1 : 0;
