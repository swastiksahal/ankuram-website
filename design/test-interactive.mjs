#!/usr/bin/env node
/**
 * test-interactive.mjs — prove the carried-over markup actually works.
 *
 *  - the three finder <select>s are real dropdowns with every option
 *  - "Check Availability" produces the results panel
 *  - the contact form submits and we capture the resulting URL / action
 *  - the reviews block behaves exactly as live (error fallback, since the
 *    /api/google-reviews endpoint does not exist on Hostinger)
 *  - invariant 15 anchor ids exist and point at matching content
 *
 * No real WhatsApp message is sent: navigation is intercepted and the URL
 * recorded. alert() dialogs are auto-dismissed so they cannot block the run.
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const ROOT = path.resolve('.');
const PORT = 8201;
const PAGE = '/design/direction-c/';
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png' };

const server = http.createServer((req, res) => {
  const url = decodeURIComponent(req.url.split('?')[0]);
  let file = path.join(ROOT, url);
  if (url.endsWith('/')) file = path.join(file, 'index.html');
  if (!file.startsWith(ROOT) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(PORT, r));
const base = `http://127.0.0.1:${PORT}`;

const ANCHORS = ['home', 'about', 'curricula', 'contact', 'reviews', 'hybrid-classes'];
const report = { dialogs: [], navigations: [], console: [] };

const browser = await chromium.launch();
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();

page.on('dialog', async (d) => { report.dialogs.push({ type: d.type(), message: d.message() }); await d.dismiss(); });
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') report.console.push(`${m.type()}: ${m.text().slice(0, 120)}`); });

// capture any attempt to leave the page instead of following it
await page.route('**/*', async (route) => {
  const r = route.request();
  const u = r.url();
  if (r.isNavigationRequest() && !u.startsWith(base)) { report.navigations.push(u); return route.abort(); }
  return route.continue();
});

await page.goto(base + PAGE, { waitUntil: 'networkidle', timeout: 30000 });

// ---------------------------------------------------------------- selects
report.selects = await page.evaluate(() => {
  const ids = ['finder-grade', 'finder-subject', 'finder-curriculum', 'grade', 'curriculum'];
  return ids.map((id) => {
    const el = document.getElementById(id);
    if (!el) return { id, present: false };
    const r = el.getBoundingClientRect();
    return {
      id, present: true, tag: el.tagName, options: el.options.length,
      height: Math.round(r.height), fontPx: parseFloat(getComputedStyle(el).fontSize),
      first: el.options[0] && el.options[0].textContent.trim(),
      last: el.options[el.options.length - 1] && el.options[el.options.length - 1].textContent.trim(),
    };
  });
});

// ------------------------------------------- reviews: as-served source state
// script.js runs on load and rewrites these, so "starts hidden" has to be
// asserted against the served HTML, not against the live DOM after the fetch.
{
  const src = fs.readFileSync('design/direction-c/index.html', 'utf8');
  const inline = (id) => {
    const m = new RegExp('<div id="' + id + '"[^>]*>').exec(src);
    return m ? (/style="([^"]*)"/.exec(m[0]) || [, ''])[1] : null;
  };
  report.reviewsSource = { loading: inline('reviewsLoading'), error: inline('reviewsError') };
}

await page.waitForTimeout(2500);   // let loadGoogleReviews() finish its fetch
report.reviewsAfter = await page.evaluate(() => {
  const g = (id) => { const el = document.getElementById(id); return el ? { display: getComputedStyle(el).display, text: el.textContent.replace(/\s+/g, ' ').trim().slice(0, 80) } : null; };
  return { loading: g('reviewsLoading'), error: g('reviewsError'), carousel: g('reviewsCarousel') };
});

// ------------------------------------------------------------- the finder
await page.selectOption('#finder-grade', '10');
await page.selectOption('#finder-subject', 'maths');
await page.selectOption('#finder-curriculum', 'cbse');
report.finderValues = await page.evaluate(() => ({
  grade: document.getElementById('finder-grade').value,
  subject: document.getElementById('finder-subject').value,
  curriculum: document.getElementById('finder-curriculum').value,
}));
await page.click('#checkAvailability');
await page.waitForTimeout(700);
report.finderResult = await page.evaluate(() => {
  const el = document.getElementById('availabilityResults');
  return {
    visible: el ? getComputedStyle(el).display : null,
    confirmation: (document.getElementById('resultsConfirmation') || {}).textContent,
    howWeTeachTitle: (document.getElementById('howWeTeachTitle') || {}).textContent,
    alignmentTitle: (document.getElementById('curriculumAlignmentTitle') || {}).textContent,
    bullets: document.querySelectorAll('#resultsHowWeTeach li').length,
  };
});

// -------------------------------------------------------- the contact form
await page.fill('#name', 'Test Parent');
await page.fill('#phone', '9876543210');
await page.selectOption('#grade', '6-10');
await page.selectOption('#curriculum', 'cbse');
await page.fill('#message', 'Test message, not a real enquiry.');
const beforeUrl = page.url();
await page.click('.contact-form button[type="submit"]');
await page.waitForTimeout(2200);
report.formResult = {
  urlBefore: beforeUrl,
  urlAfter: page.url(),
  navigated: page.url() !== beforeUrl,
  submitButtonText: await page.evaluate(() => document.querySelector('.contact-form button[type="submit"]').textContent.trim()),
  nameFieldAfter: await page.inputValue('#name'),
};

// ------------------------------------------------------ invariant 15 ids
report.anchors = await page.evaluate((ids) => ids.map((id) => {
  const el = document.getElementById(id);
  return { id, present: !!el, tag: el ? el.tagName.toLowerCase() : null, heading: el ? (el.querySelector('h1,h2,summary,.section-title,.reviews-title') || {}).textContent : null };
}), ANCHORS);

await browser.close();
server.close();
fs.writeFileSync('design/interactive-test.json', JSON.stringify(report, null, 2));

const line = (s) => console.log(s);
line('=== SELECTS');
report.selects.forEach((s) => line(`  #${s.id.padEnd(18)} ${s.tag} options=${s.options} height=${s.height}px font=${s.fontPx}px  "${s.first}" … "${s.last}"`));
line('\n=== REVIEWS');
line(`  as served: reviewsLoading style=${JSON.stringify(report.reviewsSource.loading)}  reviewsError style=${JSON.stringify(report.reviewsSource.error)}`);
line(`  after load -> loading=${report.reviewsAfter.loading.display}  error=${report.reviewsAfter.error.display}  carousel=${report.reviewsAfter.carousel.display}`);
line(`  error text: "${report.reviewsAfter.error.text}"`);
line('\n=== FINDER');
line(`  values: ${JSON.stringify(report.finderValues)}`);
line(`  results panel display: ${report.finderResult.visible}`);
line(`  confirmation: "${report.finderResult.confirmation}"`);
line(`  how we teach: "${report.finderResult.howWeTeachTitle}" (${report.finderResult.bullets} bullets)`);
line(`  alignment: "${report.finderResult.alignmentTitle}"`);
line('\n=== CONTACT FORM');
line(`  url before: ${report.formResult.urlBefore}`);
line(`  url after : ${report.formResult.urlAfter}   navigated=${report.formResult.navigated}`);
line(`  submit button now: "${report.formResult.submitButtonText}"   name field now: "${report.formResult.nameFieldAfter}"`);
line(`  dialogs: ${report.dialogs.length ? report.dialogs.map((d) => `${d.type}: ${d.message.slice(0, 90)}`).join(' | ') : 'none'}`);
line(`  external navigations attempted: ${report.navigations.length ? report.navigations.join(', ') : 'none'}`);
line('\n=== ANCHORS (invariant 15)');
report.anchors.forEach((a) => line(`  #${a.id.padEnd(16)} ${a.present ? 'PRESENT' : 'MISSING'}  <${a.tag}>  ${(a.heading || '').trim().slice(0, 40)}`));
line(`\nconsole errors/warnings: ${report.console.length ? report.console.join(' | ') : 'none'}`);

const bad = [];
report.selects.forEach((s) => {
  if (!s.present || s.tag !== 'SELECT') bad.push(`#${s.id} is not a <select>`);
  else { if (s.height < 44) bad.push(`#${s.id} is ${s.height}px tall`); if (s.fontPx < 16) bad.push(`#${s.id} font ${s.fontPx}px`); }
});
if (!/display:\s*none/.test(report.reviewsSource.loading || '')) bad.push('reviewsLoading does not start hidden in the served HTML');
if (!/display:\s*none/.test(report.reviewsSource.error || '')) bad.push('reviewsError does not start hidden in the served HTML');
if (report.finderResult.visible !== 'block') bad.push('finder results panel did not open');
if (!report.anchors.every((a) => a.present)) bad.push('missing anchor ids');
if (bad.length) { console.log('\nFAIL:\n  ' + bad.join('\n  ')); process.exitCode = 1; } else console.log('\nPASS');
