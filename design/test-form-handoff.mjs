/**
 * test-form-handoff.mjs — fire the contact form for real and capture the exact
 * URL the page tries to navigate to.
 *
 * Real mobile user agent, 390x844. Every request to wa.me and api.whatsapp.com
 * is ABORTED, so no WhatsApp message can ever reach Swastik's number.
 *
 * Serves build/staging, which is byte-identical to what is deployed to the
 * staging folder; the staging URL itself is behind basic auth whose password
 * must never be read.
 *
 *   node design/test-form-handoff.mjs [label]
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium, devices } from 'playwright';

const LABEL = process.argv[2] || '';
const ROOT = path.resolve('build/staging');
const PORT = 8281;
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };

const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const BASE = `http://127.0.0.1:${PORT}/`;

const WA = /wa\.me|api\.whatsapp\.com|whatsapp:/i;
const BEACON = /googleads\.g\.doubleclick\.net|\/pagead\/|google-analytics\.com|analytics\.google\.com|\/g\/collect|clarity\.ms|googletagmanager\.com/i;

const iPhone = devices['iPhone 13'];
const browser = await chromium.launch();

async function run(caseName, fill, expectNav) {
  const ctx = await browser.newContext({
    ...iPhone,
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1',
  });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const navAttempts = [];
  const gtagCalls = [];
  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 180)); });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR: ' + String(e).slice(0, 180)));
  await page.exposeFunction('__rec', (s) => gtagCalls.push(s));

  await page.route('**/*', async (route) => {
    const r = route.request();
    const u = r.url();
    if (WA.test(u)) { navAttempts.push(u); return route.abort(); }
    if (BEACON.test(u)) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(BASE)) { navAttempts.push(u); return route.abort(); }
    return route.continue();
  });

  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(400);

  // record gtag without letting anything reach Google
  await page.evaluate(() => {
    window.dataLayer = window.dataLayer || [];
    const inner = window.gtag;
    window.gtag = function () {
      try { window.__rec(JSON.stringify([...arguments].map((a) => (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a)))); } catch (e) {}
      try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) {}
      const last = arguments[2];
      if (last && typeof last.event_callback === 'function') setTimeout(last.event_callback, 5);
    };
  });

  await page.evaluate((f) => {
    const set = (id, v) => { const el = document.getElementById(id); if (el && v !== null) el.value = v; };
    set('name', f.name); set('phone', f.phone); set('message', f.message);
    if (f.grade !== null) { const g = document.getElementById('grade'); if (g) g.selectedIndex = 1; }
    if (f.curriculum !== null) { const c = document.getElementById('curriculum'); if (c) c.selectedIndex = 1; }
  }, fill);

  const urlBefore = page.url();
  await page.locator('.contact-form button[type=submit]').click();
  await page.waitForTimeout(2500);
  const urlAfter = page.url();

  const waNavs = navAttempts.filter((u) => WA.test(u));
  const conversions = gtagCalls.filter((c) => c.includes('jucWCNPv3OAbEPOvruco'));

  console.log(`\n--- CASE: ${caseName}`);
  console.log(`  navigation attempts to WhatsApp: ${waNavs.length}`);
  waNavs.forEach((u) => {
    console.log(`    FULL URL: ${u}`);
    const m = /[?&]text=([^&]*)/.exec(u);
    console.log(`    decoded text param: ${m ? JSON.stringify(decodeURIComponent(m[1])) : '*** NO text PARAMETER ***'}`);
  });
  console.log(`  other navigation attempts: ${JSON.stringify(navAttempts.filter((u) => !WA.test(u)))}`);
  console.log(`  page URL: ${urlBefore} -> ${urlAfter}${urlAfter !== urlBefore ? '   *** PAGE NAVIGATED ***' : ''}`);
  console.log(`  WhatsApp conversions fired: ${conversions.length}`);
  console.log(`  all gtag calls: ${gtagCalls.length ? gtagCalls.join('\n                  ') : 'none'}`);
  console.log(`  dataLayer form_submission pushes: ${await page.evaluate(() => (window.dataLayer || []).filter((x) => x && x.event === 'form_submission').length)}`);
  console.log(`  console errors: ${consoleErrors.length ? '\n    ' + consoleErrors.join('\n    ') : 'NONE'}`);

  const problems = [];
  if (expectNav) {
    if (waNavs.length !== 1) problems.push(`expected exactly 1 WhatsApp navigation, got ${waNavs.length}`);
    if (waNavs.length && !/[?&]text=/.test(waNavs[0])) problems.push('the text parameter is MISSING from the URL');
    if (conversions.length !== 1) problems.push(`expected exactly 1 conversion, got ${conversions.length}`);
  } else {
    if (waNavs.length) problems.push(`expected NO navigation, got ${waNavs.length}`);
    if (urlAfter !== urlBefore) problems.push('the page navigated when it should have blocked');
  }
  console.log(`  ${problems.length ? 'PROBLEMS: ' + problems.join('; ') : 'OK'}`);
  await ctx.close();
  return { consoleErrors, waNavs, conversions: conversions.length, problems };
}

console.log(`=== form handoff test ${LABEL} (mobile UA, 390x844, wa.me blocked)`);
const r1 = await run('Name + Phone only', { name: 'Test Parent', phone: '9876543210', message: null, grade: null, curriculum: null }, true);
const r2 = await run('Name + Phone + Grade + Curriculum + Message', { name: 'Test Parent', phone: '9876543210', message: 'Test message, not a real enquiry.', grade: 1, curriculum: 1 }, true);
const r3 = await run('Name EMPTY (must block)', { name: '', phone: '9876543210', message: null, grade: null, curriculum: null }, false);

await browser.close();
server.close();

const allProblems = [...r1.problems, ...r2.problems, ...r3.problems];
const allErrors = [...r1.consoleErrors, ...r2.consoleErrors, ...r3.consoleErrors];
console.log(`\n=== SUMMARY ${LABEL}`);
console.log(`  total console errors across the three cases: ${allErrors.length}`);
console.log(`  ReferenceError mentions: ${allErrors.filter((e) => /ReferenceError/.test(e)).length}`);
console.log(allProblems.length ? `  PROBLEMS:\n    ${allProblems.join('\n    ')}` : '  all three cases behaved correctly');
