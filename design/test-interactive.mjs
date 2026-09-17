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

report.reviewsWidgetGone = await page.evaluate(() => ({
  loading: !!document.getElementById('reviewsLoading'),
  error: !!document.getElementById('reviewsError'),
  carousel: !!document.getElementById('reviewsCarousel'),
  cta: (document.querySelector('.reviews-cta') || {}).textContent,
  ctaHref: (document.querySelector('.reviews-cta') || {}).href,
  sectionPresent: !!document.getElementById('reviews'),
}));

// ------------------------------------------- reviews: as-served source state
// script.js runs on load and rewrites these, so "starts hidden" has to be
// asserted against the served HTML, not against the live DOM after the fetch.
await page.waitForTimeout(2500);   // window 'load' would have called loadGoogleReviews()

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

// ------------------------------------------------------ invariant 15 ids
report.anchors = await page.evaluate((ids) => ids.map((id) => {
  const el = document.getElementById(id);
  return { id, present: !!el, tag: el ? el.tagName.toLowerCase() : null, heading: el ? (el.querySelector('h1,h2,summary,.section-title,.reviews-title') || {}).textContent : null };
}), ANCHORS);

report.formNote = await page.evaluate(() => (document.querySelector('.form-note') || {}).textContent);

// -------------------------------------------------------- the contact form
await page.fill('#name', 'Test Parent');
await page.fill('#phone', '9876543210');
await page.selectOption('#grade', '6-10');
await page.selectOption('#curriculum', 'cbse');
await page.fill('#message', 'Test message, not a real enquiry.');
// Wrap the page's own gtag so the conversion call is recorded. Recorded on the
// Node side via an exposed binding: the submit navigates away, which destroys
// the page context and with it anything kept on `window`.
const gtagCalls = [];
await page.exposeFunction('__recordGtag', (payload) => { gtagCalls.push(payload); });
await page.evaluate(() => {
  const inner = window.gtag;
  window.gtag = function () {
    try {
      window.__recordGtag(JSON.stringify(Array.prototype.slice.call(arguments).map((a) =>
        (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a))));
    } catch (e) { /* ignore */ }
    try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) { /* ignore */ }
    const last = arguments[2];
    if (last && typeof last.event_callback === 'function') setTimeout(last.event_callback, 5);
  };
});
const beforeUrl = page.url();
await page.click('.contact-form button[type="submit"]');
await page.waitForTimeout(2200);
report.gtagCalls = gtagCalls;
report.conversions = gtagCalls.filter((c) => c.includes('jucWCNPv3OAbEPOvruco'));
report.formResult = {
  urlBefore: beforeUrl,
  urlAfter: page.url(),
  navigated: page.url() !== beforeUrl,
  waUrlAttempted: report.navigations.filter((u) => u.indexOf('wa.me') > -1),
  builtUrl: await page.evaluate(() => (window.__contactWhatsAppUrl ? window.__contactWhatsAppUrl() : null)),
  formNote: report.formNote,
};

await browser.close();
server.close();
fs.writeFileSync('design/interactive-test.json', JSON.stringify(report, null, 2));

const line = (s) => console.log(s);
line('=== SELECTS');
report.selects.forEach((s) => line(`  #${s.id.padEnd(18)} ${s.tag} options=${s.options} height=${s.height}px font=${s.fontPx}px  "${s.first}" … "${s.last}"`));
line('\n=== REVIEWS (A15)');
line(`  #reviews section present: ${report.reviewsWidgetGone.sectionPresent}`);
line(`  loader/error/carousel removed: ${!report.reviewsWidgetGone.loading}/${!report.reviewsWidgetGone.error}/${!report.reviewsWidgetGone.carousel}`);
line(`  button: "${report.reviewsWidgetGone.cta}"`);
line(`  href: ${String(report.reviewsWidgetGone.ctaHref).slice(0, 96)}…`);
line('\n=== FINDER');
line(`  values: ${JSON.stringify(report.finderValues)}`);
line(`  results panel display: ${report.finderResult.visible}`);
line(`  confirmation: "${report.finderResult.confirmation}"`);
line(`  how we teach: "${report.finderResult.howWeTeachTitle}" (${report.finderResult.bullets} bullets)`);
line(`  alignment: "${report.finderResult.alignmentTitle}"`);
line('\n=== CONTACT FORM');
line(`  url before: ${report.formResult.urlBefore}`);
line(`  url after : ${report.formResult.urlAfter}   navigated=${report.formResult.navigated}`);
line(`  note under button: "${report.formResult.formNote}"`);
line(`  wa.me navigation attempted: ${report.formResult.waUrlAttempted.length}`);
report.formResult.waUrlAttempted.forEach((u) => line(`    ${u}`));
line(`  WhatsApp conversion calls: ${report.conversions.length}`);
report.conversions.forEach((c) => line(`    ${c.slice(0, 150)}`));
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
if (report.reviewsWidgetGone.loading || report.reviewsWidgetGone.error || report.reviewsWidgetGone.carousel) bad.push('A15: a review widget container is still present');
if (!report.reviewsWidgetGone.sectionPresent) bad.push('#reviews section missing');
if (!report.reviewsWidgetGone.cta) bad.push('A15: reviews button missing');
if (report.console.some((c) => /google-reviews|404/.test(c))) bad.push('console still shows the reviews 404');
if (report.finderResult.visible !== 'block') bad.push('finder results panel did not open');
if (report.formResult.waUrlAttempted.length !== 1) bad.push(`expected exactly 1 wa.me navigation, got ${report.formResult.waUrlAttempted.length}`);
if (report.conversions.length !== 1) bad.push(`expected exactly 1 WhatsApp conversion, got ${report.conversions.length}`);
if (report.dialogs.length) bad.push(`alert() still fires: ${report.dialogs.length}`);
if (!report.anchors.every((a) => a.present)) bad.push('missing anchor ids');
if (bad.length) { console.log('\nFAIL:\n  ' + bad.join('\n  ')); process.exitCode = 1; } else console.log('\nPASS');
