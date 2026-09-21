/** W2.2 browser gates. Live regression screenshots use the live URLs; network
 * trackers and the external Maps iframe are neutralised identically in both
 * captures so no analytics events are sent and embedded map tiles cannot vary.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import crypto from 'crypto';
import { chromium } from 'playwright';
import { PNG } from 'pngjs';
import lighthouse from 'lighthouse';

const out = 'verification/w22'; fs.mkdirSync(out, { recursive: true });
const root = path.resolve('build/staging');
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript' };
const srv = http.createServer((req, res) => {
  const u = new URL(req.url, 'http://localhost').pathname;
  if (u === '/favicon.ico') { res.writeHead(204); res.end(); return; }
  let f = path.join(root, u === '/' ? 'index.html' : u);
  if (!fs.existsSync(f) && !path.extname(f)) f += '.html';
  if (fs.existsSync(f) && fs.statSync(f).isDirectory()) f = path.join(f, 'index.html');
  if (!f.startsWith(root + '/') || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': types[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise(r => srv.listen(8392, '127.0.0.1', r));
const local = 'http://127.0.0.1:8392';
const proxy = process.env.HTTPS_PROXY ? { server: new URL(process.env.HTTPS_PROXY).origin, bypass: '127.0.0.1,localhost' } : undefined;
const browser = await chromium.launch({ proxy, args: ['--remote-debugging-port=9352'] });
const result = { browser: await browser.version(), regression: [], render: [], lighthouse: {}, faq: null, failures: [] };
const fail = s => { result.failures.push(s); console.log('FAIL', s); };
const external = /googletagmanager|clarity\.ms|doubleclick|google-analytics|analytics\.google|google\.com\/maps/i;
async function context(w, js = true) {
  const c = await browser.newContext({ viewport: { width: w, height: 900 }, deviceScaleFactor: 1, colorScheme: 'light', reducedMotion: 'reduce', javaScriptEnabled: js, ignoreHTTPSErrors: true });
  await c.route('**/*', async route => {
    if (external.test(route.request().url())) return route.fulfill({ status: 200, contentType: route.request().resourceType() === 'document' ? 'text/html' : 'application/javascript', body: '' });
    return route.continue();
  });
  return c;
}
const sha = b => crypto.createHash('sha256').update(b).digest('hex');
function diff(a, b, file) {
  const aa = PNG.sync.read(a), bb = PNG.sync.read(b);
  if (aa.width !== bb.width || aa.height !== bb.height) return { pixels: null, dimensions: [[aa.width, aa.height], [bb.width, bb.height]] };
  const output = new PNG({ width: aa.width, height: aa.height }); let pixels = 0;
  for (let i = 0; i < aa.data.length; i += 4) {
    const changed = aa.data[i] !== bb.data[i] || aa.data[i+1] !== bb.data[i+1] || aa.data[i+2] !== bb.data[i+2] || aa.data[i+3] !== bb.data[i+3];
    if (changed) pixels++;
    output.data[i] = changed ? 255 : aa.data[i]; output.data[i+1] = changed ? 0 : aa.data[i+1]; output.data[i+2] = changed ? 0 : aa.data[i+2]; output.data[i+3] = 255;
  }
  fs.writeFileSync(file, PNG.sync.write(output)); return { pixels, width: aa.width, height: aa.height };
}
try {
  // Each candidate is exactly the fetched live HTML except A23 asset hashes.
  for (const [slug, url, candidate] of [['home', '/', 'index.html'], ['diagnostic', '/diagnostic-assessment', 'diagnostic-assessment.html']]) {
    const liveFile = `verification/live/${candidate}`;
    const normal = s => s.replace(/(css\/site\.css|js\/contact-whatsapp\.js)\?v=[0-9a-f]{8}/g, '$1?v=HASH');
    if (normal(fs.readFileSync(liveFile, 'utf8')) !== normal(fs.readFileSync(path.join(root, candidate), 'utf8'))) throw Error(`${slug} HTML differs beyond asset hashes`);
    for (const w of [390, 1440]) {
      const shots = [];
      for (const [label, target] of [['live', `https://ankuramtuition.com${url}`], ['candidate', `${local}${url}`]]) {
        const c = await context(w); const p = await c.newPage();
        const response = await p.goto(target, { waitUntil: 'networkidle', timeout: 60000 });
        if (response.status() !== 200) throw Error(`${target}: ${response.status()}`);
        const html = await response.text();
        if (label === 'live' && html !== fs.readFileSync(liveFile, 'utf8')) throw Error(`${slug}: live source changed since capture`);
        await p.evaluate(() => document.fonts.ready);
        shots.push(await p.screenshot({ path: `${out}/${slug}-${w}-${label}.png`, fullPage: true, animations: 'disabled' }));
        await c.close();
      }
      const d = diff(shots[0], shots[1], `${out}/${slug}-${w}-diff.png`);
      result.regression.push({ page: slug, width: w, ...d, liveSha: sha(shots[0]), candidateSha: sha(shots[1]) });
      console.log(`${slug} ${w}: pixel delta ${d.pixels}`);
      if (d.pixels !== 0) { fail(`${slug} ${w}: non-zero screenshot delta`); throw Error('STOP: regression screenshot gate'); }
    }
  }
  for (const w of [360, 390, 768, 1024, 1280, 1440]) {
    const c = await context(w); const p = await c.newPage(); const errors = [];
    p.on('pageerror', e => errors.push(String(e))); p.on('console', m => { if (m.type() === 'error') errors.push(m.text()); });
    await p.goto(`${local}/how-we-teach`, { waitUntil: 'networkidle' });
    const metrics = await p.evaluate(() => ({ overflow: Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth), headings: { h2: document.querySelectorAll('h2').length, h3: document.querySelectorAll('h3').length } }));
    if ([390, 1440].includes(w)) await p.screenshot({ path: `${out}/how-we-teach-${w}.png`, fullPage: true, animations: 'disabled' });
    await p.locator('.w2-teach-faq details').evaluateAll(es => es.forEach(e => e.open = true));
    const openOverflow = await p.evaluate(() => Math.max(0, document.documentElement.scrollWidth - document.documentElement.clientWidth));
    result.render.push({ width: w, ...metrics, openOverflow, errors });
    console.log(`how-we-teach ${w}: overflow ${metrics.overflow}, open FAQ overflow ${openOverflow}, console errors ${errors.length}`);
    if (metrics.overflow || openOverflow || errors.length) fail(`render at ${w}`);
    await c.close();
  }
  const c = await context(390, false), p = await c.newPage();
  await p.goto(`${local}/how-we-teach`, { waitUntil: 'networkidle' });
  const question = p.locator('.w2-teach-faq summary').first(); await question.click();
  const opened = await p.locator('.w2-teach-faq details').first().getAttribute('open'); await question.click();
  const closed = await p.locator('.w2-teach-faq details').first().getAttribute('open');
  result.faq = { noJsOpen: opened !== null, noJsClose: closed === null };
  if (!result.faq.noJsOpen || !result.faq.noJsClose) fail('FAQ without JavaScript'); await c.close();
  for (const [name, cfg] of Object.entries({
    mobile: { formFactor: 'mobile', screenEmulation: { mobile: true, width: 412, height: 823, deviceScaleFactor: 1.75, disabled: false }, throttling: { rttMs: 150, throughputKbps: 1638.4, cpuSlowdownMultiplier: 4 } },
    desktop: { formFactor: 'desktop', screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false }, throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 } },
  })) {
    const res = await lighthouse(`${local}/how-we-teach`, { port: 9352, output: 'json', logLevel: 'error', onlyCategories: ['performance', 'accessibility', 'seo'] }, { extends: 'lighthouse:default', settings: { ...cfg, blockedUrlPatterns: ['*googletagmanager.com/*', '*clarity.ms/*', '*doubleclick.net/*', '*google-analytics.com/*'] } });
    fs.writeFileSync(`${out}/lighthouse-${name}.json`, JSON.stringify(res.lhr));
    const categories = res.lhr.categories, audits = res.lhr.audits;
    const scores = { performance: Math.round(categories.performance.score * 100), accessibility: Math.round(categories.accessibility.score * 100), seo: Math.round(categories.seo.score * 100), cls: audits['cumulative-layout-shift'].numericValue };
    result.lighthouse[name] = scores; console.log(`Lighthouse ${name}: ${JSON.stringify(scores)}`);
    if (scores.accessibility !== 100 || scores.cls >= .1) fail(`Lighthouse ${name}`);
  }
} catch (e) { fail(String(e)); }
finally { await browser.close(); srv.close(); fs.writeFileSync(`${out}/results.json`, JSON.stringify(result, null, 2)); }
process.exitCode = result.failures.length ? 1 : 0;
