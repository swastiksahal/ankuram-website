/** A25.2: the measured gap above the CTA row vs the gap between paragraphs. */
import fs from 'fs'; import path from 'path'; import http from 'http';
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
await new Promise((r) => srv.listen(8303, r));
const OUT = 'design/screens/hero-a252'; fs.mkdirSync(OUT, { recursive: true });
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8303/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });
  const m = await p.evaluate(() => {
    const hero = document.querySelector('#home');
    const cta = document.querySelector('#home .hero-ctas');
    const ps = [...document.querySelectorAll('#home .hero-text p')];
    const r = (e) => e.getBoundingClientRect();
    const cs = getComputedStyle(cta);
    const paraGaps = [];
    for (let i = 1; i < ps.length; i++) paraGaps.push(Math.round(r(ps[i]).top - r(ps[i - 1]).bottom));
    return {
      heroH: Math.round(r(hero).height),
      ctaMarginTop: cs.marginTop,
      gapToCta: Math.round(r(cta).top - r(ps[ps.length - 1]).bottom),
      paraGaps,
      lastParaMb: getComputedStyle(ps[ps.length - 1]).marginBottom,
      bandPresent: !!document.querySelector('#home .curricula-line'),
    };
  });
  await (await p.$('#home')).screenshot({ path: path.join(OUT, `hero-${w}.png`) });
  console.log(`${w}px`);
  console.log(`   .hero-ctas computed margin-top : ${m.ctaMarginTop}`);
  console.log(`   gap last <p> -> CTA row        : ${m.gapToCta}px`);
  console.log(`   gap between hero paragraphs    : ${m.paraGaps.join(', ')}px  (last <p> margin-bottom ${m.lastParaMb})`);
  console.log(`   CTA break is larger            : ${m.gapToCta > Math.max(...m.paraGaps) ? 'YES — ' + m.gapToCta + 'px vs ' + Math.max(...m.paraGaps) + 'px' : 'NO'}`);
  console.log(`   hero height ${m.heroH}px   band present: ${m.bandPresent}`);
  await c.close();
}
await b.close(); srv.close();
