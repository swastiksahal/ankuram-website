/**
 * shoot-sections.mjs — capture the FAQ and the How We Teach cycle at 390 and
 * 1440 into a labelled folder, so a BEFORE set and an AFTER set can be diffed
 * pixel for pixel.
 *
 *   node design/shoot-sections.mjs <label>
 *
 * Writes design/screens/semantics-<label>/<section>-<width>.png
 *
 * Accordions are opened deterministically before the shot (open the FAQ items)
 * so the comparison covers the summary in both its closed and open state.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const LABEL = process.argv[2];
if (!LABEL) throw new Error('usage: node design/shoot-sections.mjs <before|after>');

const ROOT = path.resolve('.');
const PORT = 8271;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (url.endsWith('/')) file = path.join(file, 'index.html');
  if (!fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));

const OUT = path.join('design/screens', `semantics-${LABEL}`);
fs.mkdirSync(OUT, { recursive: true });

const TARGETS = [
  ['faq', '.sec-details'],
  ['cycle', '.sec-teach'],
];

const browser = await chromium.launch();
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1 });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/design/direction-c/`, { waitUntil: 'networkidle' });
  // freeze anything time-based so two runs are comparable
  await page.addStyleTag({ content: '*,*::before,*::after{animation:none!important;transition:none!important;caret-color:transparent!important}' });

  for (const [name, sel] of TARGETS) {
    const el = await page.$(sel);
    if (!el) throw new Error(`selector not found: ${sel}`);
    await el.screenshot({ path: path.join(OUT, `${name}-closed-${w}.png`) });
  }
  // open every accordion inside the FAQ section, then shoot again
  await page.evaluate(() => document.querySelectorAll('.sec-details details').forEach((d) => { d.open = true; }));
  await page.waitForTimeout(150);
  const faq = await page.$('.sec-details');
  await faq.screenshot({ path: path.join(OUT, `faq-open-${w}.png`) });
  await ctx.close();
}
await browser.close();
server.close();

const files = fs.readdirSync(OUT).sort();
console.log(`${OUT}:`);
files.forEach((f) => console.log(`  ${f}  ${fs.statSync(path.join(OUT, f)).size} B`));
