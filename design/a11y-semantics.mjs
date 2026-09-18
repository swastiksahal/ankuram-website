/**
 * a11y-semantics.mjs — A20 accessibility re-check.
 *
 * MDN warns that some browsers give <summary> a button role that strips the
 * roles of its children, so an <h3> inside a <summary> may not be announced as
 * a heading. This runs axe-core and Lighthouse at both form factors AND reads
 * back the computed accessibility tree, so the claim is measured, not assumed.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const ROOT = path.resolve('.');
const PORT = 8273;
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
const URL_ = `http://127.0.0.1:${PORT}/design/direction-c/`;
const AXE = fs.readFileSync('node_modules/axe-core/axe.min.js', 'utf8');

const browser = await chromium.launch();

// ------------------------------------------------------------------ axe
for (const [name, vp] of [['mobile', { width: 390, height: 844 }], ['desktop', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  await page.goto(URL_, { waitUntil: 'networkidle' });
  await page.addScriptTag({ content: AXE });
  const r = await page.evaluate(async () => {
    const res = await window.axe.run(document, { resultTypes: ['violations'] });
    return {
      violations: res.violations.map((v) => ({ id: v.id, impact: v.impact, nodes: v.nodes.length, help: v.help })),
      passes: res.passes ? res.passes.length : null,
    };
  });
  console.log(`axe ${name.padEnd(7)}: ${r.violations.length} violations`);
  r.violations.forEach((v) => console.log(`    ${v.impact}  ${v.id} (${v.nodes} nodes) — ${v.help}`));

  // also run the heading-specific rules explicitly
  const hr = await page.evaluate(async () => {
    const res = await window.axe.run(document, { runOnly: ['heading-order', 'empty-heading', 'page-has-heading-one'] });
    return { v: res.violations.map((x) => ({ id: x.id, nodes: x.nodes.length })), inc: res.incomplete.map((x) => x.id) };
  });
  console.log(`    heading rules: violations ${JSON.stringify(hr.v)}  incomplete ${JSON.stringify(hr.inc)}`);
  await ctx.close();
}

// ------------------------------------------------- the accessibility tree
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
await page.goto(URL_, { waitUntil: 'networkidle' });

const probe = await page.evaluate(() => {
  const sum = document.querySelector('.sec-details .accordion summary');
  const h3 = sum.querySelector('h3.faq-question');
  const cyc = document.querySelector('h3.cycle-title');
  return {
    summaryTag: sum.tagName,
    h3Tag: h3.tagName,
    h3Text: h3.textContent.trim().slice(0, 50),
    cycleTag: cyc.tagName,
    cycleText: cyc.textContent.trim(),
  };
});
console.log(`\nDOM: <${probe.summaryTag}> contains <${probe.h3Tag}> "${probe.h3Text}…"`);
console.log(`     cycle title is <${probe.cycleTag}> "${probe.cycleText}"`);

// Chrome's own computed a11y tree, via CDP — this is what a screen reader sees.
const cdp = await ctx.newCDPSession(page);
await cdp.send('Accessibility.enable');
const full = await cdp.send('Accessibility.getFullAXTree');
const nodes = full.nodes;
const nameOf = (n) => (n.name && n.name.value) || '';
const headings = nodes.filter((n) => n.role && n.role.value === 'heading');
console.log(`\naccessibility tree: ${headings.length} nodes exposed with role=heading`);

const q = 'Do you offer tuition in Jubilee Hills for CBSE, ICSE, IGCSE and IB?';
const faqNodes = nodes.filter((n) => nameOf(n).includes('Do you offer tuition in Jubilee Hills'));
console.log(`\nnodes whose accessible name is the first FAQ question: ${faqNodes.length}`);
faqNodes.forEach((n) => {
  const lvl = (n.properties || []).find((p) => p.name === 'level');
  console.log(`    role=${n.role.value}${lvl ? ` level=${lvl.value.value}` : ''}  ignored=${n.ignored}  name="${nameOf(n).slice(0, 60)}"`);
});
const cycNodes = nodes.filter((n) => nameOf(n).trim() === 'Practice Together');
console.log(`\nnodes named "Practice Together": ${cycNodes.length}`);
cycNodes.forEach((n) => {
  const lvl = (n.properties || []).find((p) => p.name === 'level');
  console.log(`    role=${n.role.value}${lvl ? ` level=${lvl.value.value}` : ''}  ignored=${n.ignored}`);
});
await ctx.close();

// ----------------------------------------------------------- lighthouse
const lhB = await chromium.launch({ args: ['--remote-debugging-port=9336'] });
const presets = {
  mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } },
  desktop: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
};
console.log('');
for (const [name, cfg] of Object.entries(presets)) {
  const res = await lighthouse(URL_, { port: 9336, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'seo'] }, { extends: 'lighthouse:default', settings: cfg });
  const c = res.lhr.categories;
  const a = res.lhr.audits;
  console.log(`lighthouse ${name.padEnd(7)}: perf ${Math.round(c.performance.score * 100)}  a11y ${Math.round(c.accessibility.score * 100)}  seo ${Math.round(c.seo.score * 100)}  CLS ${a['cumulative-layout-shift'].numericValue.toFixed(3)}`);
  const failed = c.accessibility.auditRefs
    .map((r) => a[r.id])
    .filter((x) => x.score !== null && x.score < 1);
  console.log(`    failing a11y audits: ${failed.length ? failed.map((x) => x.id).join(', ') : 'none'}`);
  console.log(`    heading-order: ${a['heading-order'] ? a['heading-order'].score : 'n/a'}   empty-heading: ${a['empty-heading'] ? a['empty-heading'].score : 'n/a'}`);
}
await lhB.close();
await browser.close();
server.close();
