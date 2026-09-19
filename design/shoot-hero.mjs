/** Hero at 390 and 1440, into a labelled folder, animations frozen. */
import fs from 'fs'; import path from 'path'; import http from 'http';
import { chromium } from 'playwright';
const LABEL = process.argv[2]; const SRC = process.argv[3] || 'build/staging';
if (!LABEL) throw new Error('usage: node design/shoot-hero.mjs <label> [dir]');
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
await new Promise((r) => srv.listen(8297, r));
const OUT = path.join('design/screens', `hero-${LABEL}`);
fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8297/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  const el = await p.$('#home');
  await el.screenshot({ path: path.join(OUT, `hero-${w}.png`) });
  const box = await el.boundingBox();
  const m = await p.evaluate(() => {
    const h = document.querySelector('#home');
    const cta = document.querySelector('#home .hero-ctas');
    const last = document.querySelector('#home .curricula-line');
    const sup = [...document.querySelectorAll('#home p')].map((x) => ({
      cls: x.className || '(none)', h: Math.round(x.getBoundingClientRect().height),
      mb: getComputedStyle(x).marginBottom, mt: getComputedStyle(x).marginTop,
    }));
    return { heroH: Math.round(h.getBoundingClientRect().height), ctaTop: cta ? Math.round(cta.getBoundingClientRect().top) : null, hasBand: !!last, paras: sup };
  });
  console.log(`  ${w}px hero ${Math.round(box.width)}x${Math.round(box.height)}  heroH=${m.heroH}  ctaTop=${m.ctaTop}  band=${m.hasBand}`);
  m.paras.forEach((x) => console.log(`      <p class="${x.cls}"> h=${x.h} mt=${x.mt} mb=${x.mb}`));
  await c.close();
}
await b.close(); srv.close();
