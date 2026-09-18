/**
 * axe-compare.mjs — run axe-core against the pre-A20 build and the current one,
 * so any violation can be attributed rather than guessed at.
 *
 *   node design/axe-compare.mjs <dir-with-index.html-and-site.css> <label>
 *
 * The page is served at the root of the given directory; site.css is served at
 * the href the page asks for.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const DIR = path.resolve(process.argv[2]);
const LABEL = process.argv[3] || DIR;
const PORT = 8274;

const html = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const css = fs.readFileSync(path.join(DIR, 'site.css'), 'utf8');
const script = fs.readFileSync('public_html/script.js', 'utf8');
const wa = fs.readFileSync('js/contact-whatsapp.js', 'utf8');

const server = http.createServer((req, res) => {
  const u = req.url.split('?')[0];
  const send = (type, body) => { res.writeHead(200, { 'content-type': type }); res.end(body); };
  if (u === '/' || u === '/index.html') return send('text/html; charset=utf-8', html);
  if (u.endsWith('site.css')) return send('text/css; charset=utf-8', css);
  if (u.endsWith('script.js') && !u.includes('contact')) return send('text/javascript', script);
  if (u.includes('contact-whatsapp')) return send('text/javascript', wa);
  res.writeHead(404); res.end();
});
await new Promise((r) => server.listen(PORT, r));

const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');
const browser = await chromium.launch();
for (const [name, vp] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { resultTypes: ['violations'] });
    return res.violations.map((v) => ({
      id: v.id, impact: v.impact, n: v.nodes.length,
      targets: v.nodes.slice(0, 8).map((x) => x.target.join(' ')),
    }));
  });
  console.log(`${LABEL} / ${name}: ${r.length} violation type(s)`);
  r.forEach((v) => {
    console.log(`   ${v.impact}  ${v.id}  (${v.n} nodes)`);
    v.targets.forEach((t) => console.log(`       ${t}`));
  });
  await ctx.close();
}
await browser.close();
server.close();
