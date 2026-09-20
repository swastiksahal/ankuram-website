/** Full-page screenshots of the LIVE homepage, for the wave 2 regression diff. */
import fs from 'fs'; import path from 'path';
import { chromium } from 'playwright';
const LABEL = process.argv[2] || 'live';
const OUT = path.join('design/screens', `home-regression-${LABEL}`);
fs.mkdirSync(OUT, { recursive: true });
const BLOCK = /doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect|\/ccm\/|\/rmkt\/|wa\.me/i;
const b = await chromium.launch();
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const p = await c.newPage();
  // block every third party so the shot depends only on our own HTML+CSS
  await p.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  await p.goto(process.env.HOME_URL || 'https://ankuramtuition.com/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });
  await p.screenshot({ path: path.join(OUT, `home-${w}.png`), fullPage: true });
  const m = await p.evaluate(() => ({ h: document.documentElement.scrollHeight, w: document.documentElement.scrollWidth }));
  console.log(`  ${w}px -> ${OUT}/home-${w}.png   page ${m.w}x${m.h}`);
  await c.close();
}
await b.close();
