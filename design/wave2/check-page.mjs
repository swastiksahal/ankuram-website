/**
 * check-page.mjs — verification for a wave 2 page.
 *   node design/wave2/check-page.mjs build/wave2/diagnostic-assessment /diagnostic-assessment
 *
 * Head must be byte-identical to live. Every live H2/H3 must be present AS A
 * HEADING (A20). Word count >= 95%. Every baseline internal link retained.
 */
import fs from 'fs'; import path from 'path'; import http from 'http';
import { chromium } from 'playwright';
import lighthouse from 'lighthouse';

const DIR = path.resolve(process.argv[2]);
const URL_PATH = process.argv[3];
const SRC = JSON.parse(fs.readFileSync('design/wave2/diagnostic.json', 'utf8')).source;
const live = fs.readFileSync(SRC, 'utf8');
const built = fs.readFileSync(path.join(DIR, 'index.html'), 'utf8');
const base = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json', 'utf8')).pages
  .find((p) => p.url === URL_PATH);

const bad = [];
const ok = (name, cond, detail = '') => { if (!cond) bad.push(name); console.log(`  ${cond ? 'PASS' : 'FAIL'}  ${name}${!cond && detail ? '  -> ' + detail : ''}`); };

// ------------------------------------------------------------ head parity
console.log('=== head parity (must be byte-identical to the live page)\n');
const one = (h, re) => { const m = re.exec(h); return m ? m[0] : null; };
for (const [name, re] of [
  ['title', /<title>[\s\S]*?<\/title>/i],
  ['meta description', /<meta[^>]+name="description"[^>]*>/i],
  ['canonical', /<link[^>]+rel="canonical"[^>]*>/i],
]) ok(name, one(live, re) === one(built, re), `${one(built, re)}`);
const many = (h, re) => h.match(re) || [];
ok(`og tags (${many(live, /<meta[^>]+property="og:[^>]*>/gi).length})`,
  JSON.stringify(many(live, /<meta[^>]+property="og:[^>]*>/gi)) === JSON.stringify(many(built, /<meta[^>]+property="og:[^>]*>/gi)));
ok(`twitter tags (${many(live, /<meta[^>]+name="twitter:[^>]*>/gi).length})`,
  JSON.stringify(many(live, /<meta[^>]+name="twitter:[^>]*>/gi)) === JSON.stringify(many(built, /<meta[^>]+name="twitter:[^>]*>/gi)));
const ld = (h) => h.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [];
ok(`JSON-LD blocks (${ld(live).length}), byte-identical`, JSON.stringify(ld(live)) === JSON.stringify(ld(built)));
const robots = (h) => one(h, /<meta[^>]+name="robots"[^>]*>/i);
console.log(`  note  robots: live ${robots(live)}  built ${robots(built)}  (staging is deliberately noindex)`);

// --------------------------------------------------------------- headings
const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', ldquo: '“', rdquo: '”', hellip: '…', copy: '©' };
const dec = (t) => String(t).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => (n in ENT ? ENT[n] : m));
const norm = (s) => dec(s).replace(/\s+/g, ' ').trim();
const headingText = {};
for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']) {
  for (const m of built.matchAll(new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi'))) {
    const t = norm(m[1].replace(/<[^>]+>/g, ' '));
    (headingText[t] = headingText[t] || []).push(tag);
  }
}
console.log('\n=== heading retention (A20: present AS A HEADING, not merely as text)\n');
ok('H1 identical', JSON.stringify(base.h1.map(norm)) === JSON.stringify([...built.matchAll(/<h1\b[^>]*>([\s\S]*?)<\/h1>/gi)].map((m) => norm(m[1].replace(/<[^>]+>/g, ' ')))));
for (const [lvl, list] of [['h2', base.h2], ['h3', base.h3]]) {
  const uniq = [...new Set(list.map(norm))];
  const missing = uniq.filter((t) => !headingText[t]);
  ok(`every live ${lvl} present as a heading (${uniq.length} unique)`, missing.length === 0, missing.join(' | '));
  const moved = uniq.filter((t) => headingText[t] && !headingText[t].includes(lvl));
  if (moved.length) console.log(`        note: ${moved.length} at a different level: ${moved.map((t) => `${t} -> ${headingText[t][0]}`).join(', ')}`);
}

// ------------------------------------------------------------ words, links
const visible = (h) => norm(/<body[^>]*>([\s\S]*)<\/body>/i.exec(h)[1]
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
  .replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' '));
const wc = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const wBuilt = wc(visible(built));
const pct = (wBuilt / base.visibleWordCount) * 100;
console.log('');
ok(`word count ${wBuilt} vs live ${base.visibleWordCount} = ${pct.toFixed(1)}% (floor 95%)`, pct >= 95);

const hrefs = (h) => [...new Set([...h.matchAll(/href="([^"]+)"/g)].map((m) => m[1].split('?')[0]))];
const liveInternal = base.internalHrefs.filter((x) => !/\.(png|ico|webmanifest)$/.test(x));
const builtHrefs = new Set(hrefs(built));
const missingLinks = liveInternal.filter((x) => !builtHrefs.has(x));
ok(`baseline internal links retained (${liveInternal.length})`, missingLinks.length === 0, missingLinks.join(', '));

// ------------------------------------------------------- render + lighthouse
const T = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const REPO = path.resolve('.');
const srv = http.createServer((q, s) => {
  const u = decodeURIComponent(q.url.split('?')[0]);
  let f = u === '/' ? path.join(DIR, 'index.html') : path.join(REPO, u.replace(/^\/+/, ''));
  if (u.startsWith('/css/') || u.startsWith('/js/')) f = path.join(REPO, u.replace(/^\/+/, ''));
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { s.writeHead(404); s.end(); return; }
  s.writeHead(200, { 'content-type': T[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(s);
});
await new Promise((r) => srv.listen(8322, r));
// the page links ../../css/... ; serve those too
const BASE = 'http://127.0.0.1:8322/';

const browser = await chromium.launch({ args: ['--remote-debugging-port=9350'] });
console.log('\n=== render\n');
const OUTS = 'design/screens'; fs.mkdirSync(OUTS, { recursive: true });
for (const w of [390, 1440]) {
  const c = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  p.on('console', (m) => { if (m.type() === 'error') errs.push('console: ' + m.text().slice(0, 140)); });
  await p.goto(BASE, { waitUntil: 'networkidle' });
  await p.screenshot({ path: path.join(OUTS, `diagnostic-${w}.png`), fullPage: true });
  const r = await p.evaluate(() => {
    const d = document.documentElement;
    return { over: Math.max(0, d.scrollWidth - d.clientWidth), h: d.scrollHeight, css: !!document.querySelector('link[href*="site.css"]') };
  });
  console.log(`  ${w}px  overflow ${r.over}px   page height ${r.h}px   console errors ${errs.length ? errs.join(' | ') : 'none'}`);
  if (r.over !== 0) bad.push(`overflow at ${w}`);
  if (errs.length) bad.push(`console errors at ${w}`);
  await c.close();
}
// overflow at all six widths
const widths = [360, 390, 768, 1024, 1280, 1440];
const over = [];
for (const w of widths) {
  const c = await browser.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const o = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
  over.push(`${w}:${o}`);
  if (o !== 0) bad.push(`overflow ${w}`);
  await c.close();
}
console.log(`  overflow at six widths: ${over.join('  ')}`);

for (const [name, cfg] of Object.entries({
  mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } },
  desktop: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
})) {
  const res = await lighthouse(BASE, { port: 9350, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'seo'] }, { extends: 'lighthouse:default', settings: cfg });
  const c = res.lhr.categories; const a = res.lhr.audits;
  const a11y = Math.round(c.accessibility.score * 100);
  console.log(`  lighthouse ${name.padEnd(7)}: perf ${Math.round(c.performance.score * 100)}  a11y ${a11y}  seo ${Math.round(c.seo.score * 100)}  CLS ${a['cumulative-layout-shift'].numericValue.toFixed(3)}`);
  const fails = c.accessibility.auditRefs.map((r) => a[r.id]).filter((x) => x.score !== null && x.score < 1);
  if (fails.length) console.log(`      failing a11y: ${fails.map((x) => x.id).join(', ')}`);
  if (a11y !== 100) bad.push(`a11y ${name} = ${a11y}`);
}
await browser.close(); srv.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — every wave 2 page check met');
process.exitCode = bad.length ? 1 : 0;
