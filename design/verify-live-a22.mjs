/**
 * verify-live-a22.mjs — post-deploy verification of A22 + A23 on the LIVE site.
 * NO cache-busting anywhere: this is what a real visitor gets.
 *
 * Safety: wa.me and api.whatsapp.com are aborted, so no message reaches
 * Swastik; every Google/Clarity beacon is aborted, so no test conversion is
 * written to Ads account 786-647-2391. gtag is wrapped and recorded locally.
 */
import { chromium } from 'playwright';

const URL_ = 'https://ankuramtuition.com/';
const WA = /wa\.me|api\.whatsapp\.com/i;
const BEACON = /googleads\.g\.doubleclick\.net|\/pagead\/|google-analytics\.com|analytics\.google\.com|\/g\/collect|clarity\.ms|stats\.g\.doubleclick|\/ccm\/|\/rmkt\/|googletagmanager\.com/i;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

const EXPECTED = {
  '': ['CBSE', 'IB PYP', 'IB MYP', 'IGCSE', 'ICSE', 'ISC', 'IB DP', 'AS & A Levels', 'State Board'],
  '1-5': ['CBSE', 'IB PYP', 'ICSE', 'State Board'],
  '6-10': ['CBSE', 'IB MYP', 'IGCSE', 'ICSE', 'State Board'],
  '11-12': ['CBSE', 'ISC', 'IB DP', 'AS & A Levels', 'State Board'],
};

const browser = await chromium.launch();
const bad = [];

async function session(recordGtag = false) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA });
  const page = await ctx.newPage();
  const st = { errors: [], gtag: [], dl: [], navs: [] };
  page.on('pageerror', (e) => st.errors.push('PAGEERROR: ' + String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED/.test(m.text())) st.errors.push('console: ' + m.text().slice(0, 150)); });
  if (recordGtag) {
    await page.exposeFunction('__rec', (s) => st.gtag.push(s));
    await page.exposeFunction('__dl', (s) => st.dl.push(JSON.parse(s)));
    await page.addInitScript(() => {
      window.dataLayer = window.dataLayer || [];
      const rp = window.dataLayer.push.bind(window.dataLayer);
      window.dataLayer.push = function (o) { try { window.__dl(JSON.stringify(o)); } catch (e) {} return rp(o); };
    });
  }
  await page.route('**/*', (route) => {
    const r = route.request();
    const u = r.url();
    if (WA.test(u)) { st.navs.push(u); return route.abort(); }
    if (BEACON.test(u)) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(URL_)) { st.navs.push(u); return route.abort(); }
    return route.continue();           // NO cache-busting
  });
  await page.goto(URL_, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  if (recordGtag) {
    await page.evaluate(() => {
      const inner = window.gtag;
      window.gtag = function () {
        try { window.__rec(JSON.stringify([...arguments].map((a) => (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a)))); } catch (e) {}
        try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) {}
        const last = arguments[2];
        if (last && typeof last.event_callback === 'function') setTimeout(last.event_callback, 5);
      };
    });
  }
  return { ctx, page, st };
}

// ============================================ 1. 16 clean loads, no cachebust
console.log('=== 1. SIXTEEN live loads, no cache-busting of any kind\n');
let clean = 0;
for (let i = 1; i <= 16; i++) {
  const { ctx, page, st } = await session();
  const h = await page.evaluate(() => ['trackFormSubmission', 'trackPhoneClick', 'trackWhatsAppClick', 'trackCTAClick']
    .every((n) => typeof window[n] === 'function'));
  const ok = st.errors.length === 0 && h;
  if (ok) clean++;
  console.log(`  load ${String(i).padStart(2)}: console errors ${st.errors.length}   all 4 handlers function: ${h}   ${ok ? 'CLEAN' : '*** ' + st.errors.join(' | ') + ' ***'}`);
  await ctx.close();
}
console.log(`\n  CLEAN LOADS: ${clean} / 16`);
if (clean !== 16) bad.push(`only ${clean}/16 loads were clean`);

// ==================================================== 2. handler typeof
{
  const { ctx, page } = await session();
  const t = await page.evaluate(() => ['trackFormSubmission', 'trackPhoneClick', 'trackWhatsAppClick', 'trackCTAClick']
    .map((n) => `${n}=${typeof window[n]}`));
  console.log(`\n=== 2. inline handlers on the live page`);
  t.forEach((x) => console.log(`  ${x}`));
  if (!t.every((x) => x.endsWith('=function'))) bad.push('not all handlers are functions');
  await ctx.close();
}

// ==================================================== 3. the four grade lists
{
  const { ctx, page } = await session();
  console.log(`\n=== 3. curriculum options per grade, on the live page\n`);
  for (const [grade, want] of Object.entries(EXPECTED)) {
    await page.selectOption('#grade', grade);
    await page.waitForTimeout(120);
    const got = await page.evaluate(() => {
      const s = document.getElementById('curriculum');
      return { texts: [...s.options].filter((o) => o.value !== '').map((o) => o.textContent), disabled: s.disabled, ph: s.options[0].textContent };
    });
    const ok = JSON.stringify(got.texts) === JSON.stringify(want);
    if (!ok) bad.push(`grade "${grade}": ${JSON.stringify(got.texts)}`);
    if (got.disabled) bad.push(`grade "${grade}": select disabled`);
    console.log(`  ${(grade === '' ? 'BLANK' : 'Grades ' + grade).padEnd(14)} ${got.texts.length}: ${got.texts.join(' · ')}   ${ok ? 'MATCHES' : '*** MISMATCH ***'}`);
  }
  await ctx.close();
}

// ============================== 4. Grades 1-5 + IB PYP submit + conversions
{
  const { ctx, page, st } = await session(true);
  await page.selectOption('#grade', '1-5');
  await page.selectOption('#curriculum', 'ib-pyp');
  await page.fill('#name', 'Test Parent');
  await page.fill('#phone', '9876543210');
  await page.locator('.contact-form button[type=submit]').click();
  await page.waitForTimeout(2500);
  const wa = st.navs.filter((u) => WA.test(u));
  const conv = (l) => st.gtag.filter((c) => c.includes(l)).length;
  const anyConv = st.gtag.filter((c) => { try { return JSON.parse(c)[1] === 'conversion'; } catch (e) { return false; } }).length;
  const ev = (n) => st.gtag.filter((c) => { try { return JSON.parse(c)[1] === n; } catch (e) { return false; } }).length;
  console.log(`\n=== 4. Grades 1-5 + IB PYP, submitted on the live page`);
  wa.forEach((u) => {
    console.log(`  FULL URL: ${u}`);
    const m = /[?&]text=([^&]*)/.exec(u);
    const txt = m ? decodeURIComponent(m[1]) : null;
    console.log(`  decoded: ${JSON.stringify(txt)}`);
    if (!txt || !txt.includes('Curriculum: IB PYP')) bad.push('live: text does not read "Curriculum: IB PYP"');
  });
  console.log(`  GA4 form_submission: ${ev('form_submission')}   dataLayer form_submission: ${st.dl.filter((x) => x && x.event === 'form_submission').length}`);
  console.log(`  Ads jucWCNPv3OAbEPOvruco: ${conv('jucWCNPv3OAbEPOvruco')}   conversion events of any label: ${anyConv}`);
  console.log(`  ReferenceErrors: ${st.errors.filter((e) => /ReferenceError/.test(e)).length}   errors: ${st.errors.length ? st.errors.join(' | ') : 'none'}`);
  if (wa.length !== 1) bad.push(`live form: ${wa.length} WhatsApp navigations`);
  if (conv('jucWCNPv3OAbEPOvruco') !== 1) bad.push(`live form: ${conv('jucWCNPv3OAbEPOvruco')} WhatsApp conversions`);
  if (anyConv !== 1) bad.push(`live form: ${anyConv} conversion events`);
  if (ev('form_submission') !== 1) bad.push(`live form: ${ev('form_submission')} form_submission events`);
  if (st.dl.filter((x) => x && x.event === 'form_submission').length !== 1) bad.push('live form: dataLayer form_submission not 1');
  await ctx.close();
}

// ================================================ 5. tel:, wa.me and CTA
for (const [label, sel, wantLabel, wantEvent] of [
  ['tel: link', 'a[href^="tel:"][onclick*="trackPhoneClick"]', 'NGIFCNbv3OAbEPOvruco', 'phone_call_click'],
  ['wa.me link', 'a[href*="wa.me"][onclick*="trackWhatsAppClick"]', 'jucWCNPv3OAbEPOvruco', 'whatsapp_click'],
  ['CTA link', 'a[onclick*="trackCTAClick"]', null, 'cta_click'],
]) {
  const { ctx, page, st } = await session(true);
  const all = page.locator(sel);
  const n = await all.count();
  let target = null;
  for (let i = 0; i < n; i++) if (await all.nth(i).isVisible()) { target = all.nth(i); break; }
  if (!target) { console.log(`\n=== 5. ${label}: no visible link`); await ctx.close(); continue; }
  await target.click({ force: true });
  await page.waitForTimeout(1500);
  const ev = (nm) => st.gtag.filter((c) => { try { return JSON.parse(c)[1] === nm; } catch (e) { return false; } }).length;
  const anyConv = st.gtag.filter((c) => { try { return JSON.parse(c)[1] === 'conversion'; } catch (e) { return false; } }).length;
  const conv = wantLabel ? st.gtag.filter((c) => c.includes(wantLabel)).length : null;
  console.log(`\n=== 5. ${label}, live`);
  st.gtag.forEach((c) => console.log(`    ${c}`));
  console.log(`  GA4 ${wantEvent}: ${ev(wantEvent)}${wantLabel ? `   Ads ${wantLabel}: ${conv}` : ''}   conversion events of any label: ${anyConv}`);
  console.log(`  ReferenceErrors: ${st.errors.filter((e) => /ReferenceError/.test(e)).length}`);
  if (ev(wantEvent) !== 1) bad.push(`${label}: ${ev(wantEvent)} ${wantEvent} events, expected 1`);
  if (wantLabel && conv !== 1) bad.push(`${label}: ${conv} conversions, expected 1`);
  if (wantLabel && anyConv !== 1) bad.push(`${label}: ${anyConv} conversion events, expected 1`);
  if (st.errors.length) bad.push(`${label}: ${st.errors.join(' | ')}`);
  await ctx.close();
}

await browser.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — every live check met');
process.exitCode = bad.length ? 1 : 0;
