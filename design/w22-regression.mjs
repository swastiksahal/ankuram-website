/**
 * w22-regression.mjs — the two pages that were already live must not move.
 * Renders the reconstructed PRE-W2.2 artifacts locally and the LIVE pages now,
 * with identical viewport and third parties blocked, and diffs the bytes.
 */
import fs from 'fs'; import path from 'path'; import http from 'http'; import crypto from 'crypto';
import { chromium } from 'playwright';
const SP = '/private/tmp/claude-501/-Users-swastiksahal-Projects-ankuramtuition-com/d4e9960b-8cbc-4133-842a-5c00fb919ef8/scratchpad';
const ROOT = path.join(SP, 'pre22');
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const srv = http.createServer((q, s) => {
  let u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/') f = path.join(ROOT, 'index.html');
  else if (!fs.existsSync(f) && fs.existsSync(f + '.html')) f = f + '.html';
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(8350, r));
const BLOCK = /doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect|\/ccm\/|\/rmkt\/|wa\.me/i;
const OUT = 'design/screens/w22-regression'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
const shot = async (url, file, w) => {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await p.screenshot({ path: file, fullPage: true });
  await c.close();
};
let bad = 0;
for (const [name, before, after] of [
  ['homepage', 'http://127.0.0.1:8350/', 'https://ankuramtuition.com/'],
  ['diagnostic-assessment', 'http://127.0.0.1:8350/diagnostic-assessment', 'https://ankuramtuition.com/diagnostic-assessment'],
]) {
  for (const w of [390, 1440]) {
    const fb = path.join(OUT, `${name}-${w}-before.png`);
    const fa = path.join(OUT, `${name}-${w}-after-live.png`);
    await shot(before, fb, w);
    await shot(after, fa, w);
    const A = fs.readFileSync(fb), B = fs.readFileSync(fa);
    const same = A.equals(B);
    if (!same) bad++;
    const h = (x) => crypto.createHash('sha256').update(x).digest('hex').slice(0, 24);
    console.log(`  ${name.padEnd(22)} ${w}px   before ${A.length} B  after ${B.length} B`);
    console.log(`     ${h(A)}  /  ${h(B)}   ${same ? 'PIXEL DELTA ZERO' : '*** DIFFERENT — ROLLBACK ***'}`);
  }
}
await b.close(); srv.close();
console.log(bad ? `\n  ${bad} comparison(s) differ` : '\n  PASS — both already-live pages are pixel-identical');
process.exitCode = bad ? 1 : 0;
