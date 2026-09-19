/** Hero + curricula section at 390 and 1440, into a labelled folder. */
import fs from 'fs'; import path from 'path'; import http from 'http';
import { chromium } from 'playwright';
const LABEL = process.argv[2];
const SRC = process.argv[3] || 'build/staging';
if (!LABEL) throw new Error('usage: node design/shoot-curricula.mjs <label> [dir]');
const ROOT = path.resolve(SRC);
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(8295, r));
const OUT = path.join('design/screens', `boards-${LABEL}`);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8295/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  for (const [name, sel] of [['hero', '#home'], ['curricula', '#curricula'], ['boards', '.boards-wrap']]) {
    const el = await p.$(sel);
    if (el) await el.screenshot({ path: path.join(OUT, `${name}-${w}.png`) });
  }
  const d = await p.$('#curricula details');
  if (d) {
    await p.evaluate(() => document.querySelector('#curricula details').open = true);
    await p.waitForTimeout(150);
    await (await p.$('#curricula')).screenshot({ path: path.join(OUT, `curricula-open-${w}.png`) });
  }
  await c.close();
}
await b.close(); srv.close();
fs.readdirSync(OUT).sort().forEach((f) => console.log(`  ${OUT}/${f}  ${fs.statSync(path.join(OUT, f)).size} B`));
