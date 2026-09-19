/** A25: the curricula fold must open and close with NO JavaScript, like A12. */
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
await new Promise((r) => srv.listen(8296, r));
const b = await chromium.launch(); const bad = [];
for (const w of [390, 1440]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 }, javaScriptEnabled: false });
  const p = await c.newPage();
  await p.goto('http://127.0.0.1:8296/', { waitUntil: 'domcontentloaded' });
  const d = p.locator('#curricula details.curr-details');
  const sum = d.locator('summary');
  const sets = d.locator('.curr-sets');
  const start = await d.getAttribute('open');
  const startVis = await sets.isVisible();
  await sum.click();
  const open1 = await d.getAttribute('open'); const vis1 = await sets.isVisible();
  const chips = await d.locator('.curr-chip').count();
  const titles = await d.locator('.curr-set-title').allTextContents();
  await sum.click();
  const open2 = await d.getAttribute('open'); const vis2 = await sets.isVisible();
  const box = await sum.boundingBox();
  console.log(`${w}px, JavaScript DISABLED`);
  console.log(`   summary: ${JSON.stringify(await sum.textContent())}`);
  console.log(`   initial:        open=${start !== null}  sets visible=${startVis}`);
  console.log(`   after 1 click:  open=${open1 !== null}  sets visible=${vis1}   chips=${chips}   sets=${JSON.stringify(titles)}`);
  console.log(`   after 2 clicks: open=${open2 !== null}  sets visible=${vis2}`);
  console.log(`   tap target: ${Math.round(box.width)}x${Math.round(box.height)}px`);
  if (start !== null || startVis) bad.push(`${w}: starts open`);
  if (open1 === null || !vis1) bad.push(`${w}: did not open`);
  if (open2 !== null || vis2) bad.push(`${w}: did not close`);
  if (chips !== 9) bad.push(`${w}: ${chips} chips, expected 9`);
  if (titles.length !== 2) bad.push(`${w}: ${titles.length} set titles, expected 2`);
  if (box.height < 44) bad.push(`${w}: tap target ${Math.round(box.height)}px`);
  await c.close();
}
await b.close(); srv.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — opens and closes with no JavaScript, 9 chips in 2 labelled sets');
process.exitCode = bad.length ? 1 : 0;
