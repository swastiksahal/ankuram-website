/**
 * Prove the hero's only change is the removed band plus the reflow below it.
 * Both crops use IDENTICAL geometry in both builds, or the comparison is
 * meaningless (a differently sized crop always differs).
 *   region A: hero top -> top of the band in the BEFORE build   -> expect IDENTICAL
 *   region B: CTA row top -> +N px, same N in both              -> expect IDENTICAL
 */
import fs from 'fs'; import path from 'path'; import http from 'http'; import crypto from 'crypto';
import { chromium } from 'playwright';
const SP = '/private/tmp/claude-501/-Users-swastiksahal-Projects-ankuramtuition-com/d4e9960b-8cbc-4133-842a-5c00fb919ef8/scratchpad';
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const serve = (root, port) => new Promise((res) => {
  const s = http.createServer((q, r) => {
    const u = decodeURIComponent(q.url.split('?')[0]);
    let f = path.join(root, u);
    if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
    if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { r.writeHead(404); r.end(); return; }
    r.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
    fs.createReadStream(f).pipe(r);
  });
  s.listen(port, () => res(s));
});
const sB = await serve(`${SP}/hero-before-build`, 8301);
const sA = await serve(path.resolve('build/staging'), 8302);
const b = await chromium.launch();
const h = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 12);

async function measure(port, w) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  await p.goto(`http://127.0.0.1:${port}/`, { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important}' });

  if (process.env.NO_GRID === "1") {
    // The hero paints a 28px grid anchored to its own top edge. Shortening
    // the hero re-phases everything below it against that static grid, which
    // reads as a pixel difference but is not a layout change. Suppress it to
    // compare the content alone.
    await p.addStyleTag({ content: ".v2 .hero{background-image:none!important}" });
  }  const m = await p.evaluate(() => {
    const hero = document.querySelector('#home').getBoundingClientRect();
    const band = document.querySelector('#home .curricula-line');
    const cta = document.querySelector('#home .hero-ctas').getBoundingClientRect();
    const ps = [...document.querySelectorAll('#home .hero-text p, #home .hero-inner > div > p')];
    const last = ps.length ? ps[ps.length - 1].getBoundingClientRect() : null;
    return {
      heroTop: hero.top, heroH: hero.height,
      bandOffset: band ? band.getBoundingClientRect().top - hero.top : null,
      bandH: band ? band.getBoundingClientRect().height : 0,
      ctaTop: cta.top, ctaOffset: cta.top - hero.top,
      gapToCta: last ? Math.round(cta.top - last.bottom) : null,
      scrollY: window.scrollY,
    };
  });
  return { c, p, m };
}

for (const w of [390, 1440]) {
  const B = await measure(8301, w);
  const A = await measure(8302, w);
  const cutA = Math.round(B.m.bandOffset);                       // same height in both
  const tailH = Math.round(Math.min(B.m.heroTop + B.m.heroH - B.m.ctaTop, A.m.heroTop + A.m.heroH - A.m.ctaTop));
  for (const [lbl, S] of [['before', B], ['after', A]]) {
    await S.p.screenshot({ path: `${SP}/rA-${lbl}-${w}.png`, fullPage: true, clip: { x: 0, y: S.m.heroTop + S.m.scrollY, width: w, height: cutA } });
    await S.p.screenshot({ path: `${SP}/rB-${lbl}-${w}.png`, fullPage: true, clip: { x: 0, y: S.m.ctaTop + S.m.scrollY, width: w, height: tailH } });
  }
  const rA = h(`${SP}/rA-before-${w}.png`) === h(`${SP}/rA-after-${w}.png`);
  const rB = h(`${SP}/rB-before-${w}.png`) === h(`${SP}/rB-after-${w}.png`);
  console.log(`\n${w}px`);
  console.log(`  hero height   ${Math.round(B.m.heroH)} -> ${Math.round(A.m.heroH)}   delta ${Math.round(A.m.heroH - B.m.heroH)}px`);
  console.log(`  band          ${Math.round(B.m.bandH)}px tall -> removed (present: ${A.m.bandOffset !== null})`);
  console.log(`  CTA row       offset ${Math.round(B.m.ctaOffset)} -> ${Math.round(A.m.ctaOffset)}   moved up ${Math.round(B.m.ctaOffset - A.m.ctaOffset)}px`);
  console.log(`  gap last <p> -> CTA   ${B.m.gapToCta}px -> ${A.m.gapToCta}px`);
  console.log(`  region ABOVE the band (${cutA}px tall, identical crop): ${rA ? 'IDENTICAL — nothing above changed' : '*** DIFFERENT ***'}`);
  console.log(`  region from CTA down  (${tailH}px tall, identical crop): ${rB ? 'IDENTICAL — content only translated' : '*** DIFFERENT ***'}`);
  await B.c.close(); await A.c.close();
}
await b.close(); sB.close(); sA.close();
