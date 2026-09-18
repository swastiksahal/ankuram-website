/**
 * measure-semantics.mjs — computed styles and geometry of the elements touched
 * by A20, so BEFORE and AFTER can be compared numerically as well as visually.
 *
 *   node design/measure-semantics.mjs > out.json
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const ROOT = path.resolve('.');
const PORT = 8272;
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

const PROPS = ['display', 'fontSize', 'fontWeight', 'lineHeight', 'letterSpacing', 'color', 'marginTop', 'marginBottom', 'paddingTop', 'paddingBottom', 'paddingLeft'];
const out = {};
const browser = await chromium.launch();
for (const w of [390, 1440]) {
  const ctx = await browser.newContext({ viewport: { width: w, height: 900 } });
  const page = await ctx.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/design/direction-c/`, { waitUntil: 'networkidle' });
  out[w] = await page.evaluate((props) => {
    const pick = (el) => {
      const cs = getComputedStyle(el);
      const o = {};
      props.forEach((p) => { o[p] = cs[p]; });
      const r = el.getBoundingClientRect();
      o.box = `${Math.round(r.width)}x${Math.round(r.height)}`;
      return o;
    };
    const res = {};
    // the first cycle title
    const ct = document.querySelector('.cycle-title');
    res.cycleTitle = { tag: ct.tagName, text: ct.textContent.trim(), ...pick(ct) };
    // the whole first cycle step, to catch any layout shift around it
    const step = document.querySelector('.cycle-step');
    const sr = step.getBoundingClientRect();
    res.cycleStep = { box: `${Math.round(sr.width)}x${Math.round(sr.height)}` };
    const ol = document.querySelector('.cycle');
    const or_ = ol.getBoundingClientRect();
    res.cycleList = { box: `${Math.round(or_.width)}x${Math.round(or_.height)}` };

    // the first FAQ summary
    const sum = document.querySelector('.sec-details .accordion summary');
    res.summary = { ...pick(sum) };
    const srect = sum.getBoundingClientRect();
    res.summary.box = `${Math.round(srect.width)}x${Math.round(srect.height)}`;
    // the element actually holding the question text
    const q = sum.querySelector('h3') || sum;
    res.question = { tag: q.tagName, text: q.textContent.trim().slice(0, 40), ...pick(q) };
    // whole accordion height, closed
    const acc = document.querySelector('.sec-details .accordion');
    const ar = acc.getBoundingClientRect();
    res.accordionClosed = { box: `${Math.round(ar.width)}x${Math.round(ar.height)}` };
    // and open
    document.querySelectorAll('.sec-details details').forEach((d) => { d.open = true; });
    const ar2 = acc.getBoundingClientRect();
    res.accordionOpen = { box: `${Math.round(ar2.width)}x${Math.round(ar2.height)}` };
    document.querySelectorAll('.sec-details details').forEach((d) => { d.open = false; });

    // section heights
    res.sections = {};
    ['.sec-details', '.sec-teach'].forEach((s) => {
      const el = document.querySelector(s);
      res.sections[s] = Math.round(el.getBoundingClientRect().height);
    });
    res.pageHeight = document.documentElement.scrollHeight;
    return res;
  }, PROPS);
  await ctx.close();
}
await browser.close();
server.close();
console.log(JSON.stringify(out, null, 2));
