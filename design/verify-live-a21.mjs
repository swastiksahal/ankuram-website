/**
 * verify-live-a21.mjs — step 6 of the A21 production deploy, against the LIVE
 * site with a mobile user agent.
 *
 * Safety:
 *   - wa.me and api.whatsapp.com are ABORTED, so no message can reach Swastik.
 *   - every Google/Clarity beacon is ABORTED, so no test conversion is written
 *     to Ads account 786-647-2391 or to the GA4 property. gtag is wrapped and
 *     the calls the page makes are recorded locally instead.
 *
 * CACHE_BUST=1 re-requests the site's own js/css with a query string, to read
 * past a stale CDN edge copy and exercise the bytes on the origin.
 */
import { chromium } from 'playwright';

const URL_ = 'https://ankuramtuition.com/';
const WA = /wa\.me|api\.whatsapp\.com/i;
const BEACON = /googleads\.g\.doubleclick\.net|\/pagead\/|google-analytics\.com|analytics\.google\.com|\/g\/collect|clarity\.ms|stats\.g\.doubleclick|\/ccm\/|\/rmkt\/|googletagmanager\.com/i;
const BUST = process.env.CACHE_BUST === '1';
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';

const browser = await chromium.launch();

async function session() {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA });
  const page = await ctx.newPage();
  const state = { gtag: [], dl: [], navs: [], errors: [] };
  page.on('pageerror', (e) => state.errors.push(String(e).slice(0, 180)));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED/.test(m.text())) state.errors.push('console: ' + m.text().slice(0, 160)); });
  await page.exposeFunction('__rec', (s) => state.gtag.push(s));
  await page.exposeFunction('__dl', (s) => state.dl.push(JSON.parse(s)));
  await page.addInitScript(() => {
    window.dataLayer = window.dataLayer || [];
    const realPush = window.dataLayer.push.bind(window.dataLayer);
    window.dataLayer.push = function (o) { try { window.__dl(JSON.stringify(o)); } catch (e) {} return realPush(o); };
  });
  await page.route('**/*', (route) => {
    const r = route.request();
    const u = r.url();
    if (WA.test(u)) { state.navs.push(u); return route.abort(); }
    if (BEACON.test(u)) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(URL_)) { state.navs.push(u); return route.abort(); }
    if (BUST && /\.(js|css)(\?|$)/i.test(u) && u.startsWith(URL_)) {
      return route.continue({ url: u + (u.includes('?') ? '&' : '?') + 'cachebust=' + Date.now() });
    }
    return route.continue();
  });
  await page.goto(URL_, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(1200);
  await page.evaluate(() => {
    const inner = window.gtag;
    window.gtag = function () {
      try { window.__rec(JSON.stringify([...arguments].map((a) => (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a)))); } catch (e) {}
      try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) {}
      const last = arguments[2];
      if (last && typeof last.event_callback === 'function') setTimeout(last.event_callback, 5);
    };
  });
  return { ctx, page, state };
}

const bad = [];
const ev = (s, name) => s.gtag.filter((c) => c.includes(`"${name}"`)).length;
const conv = (s, label) => s.gtag.filter((c) => c.includes(label)).length;

// ---------------------------------------------------- A. the contact form
{
  const { ctx, page, state } = await session();
  const handlers = await page.evaluate(() => ['trackFormSubmission', 'trackPhoneClick', 'trackWhatsAppClick', 'trackCTAClick']
    .map((n) => `${n}=${typeof window[n]}`).join('  '));
  await page.evaluate(() => {
    document.getElementById('name').value = 'Test Parent';
    document.getElementById('phone').value = '9876543210';
  });
  await page.locator('.contact-form button[type=submit]').click();
  await page.waitForTimeout(2500);

  const waNav = state.navs.filter((u) => WA.test(u));
  console.log('=== A. CONTACT FORM (Name + Phone), live, mobile UA');
  console.log(`  handler typeof: ${handlers}`);
  console.log(`  navigation attempts to WhatsApp: ${waNav.length}`);
  waNav.forEach((u) => {
    console.log(`    FULL URL: ${u}`);
    const m = /[?&]text=([^&]*)/.exec(u);
    console.log(`    decoded text: ${m ? JSON.stringify(decodeURIComponent(m[1])) : '*** NO text PARAMETER ***'}`);
  });
  console.log(`  gtag calls:`);
  state.gtag.forEach((c) => console.log(`    ${c}`));
  console.log(`  dataLayer form_submission pushes: ${state.dl.filter((x) => x && x.event === 'form_submission').length}`);
  console.log(`  GA4 form_submission events: ${ev(state, 'form_submission')}`);
  console.log(`  Ads conversions (jucWCNPv3OAbEPOvruco): ${conv(state, 'jucWCNPv3OAbEPOvruco')}`);
  console.log(`  conversion events of ANY label: ${state.gtag.filter((c) => { try { return JSON.parse(c)[1] === 'conversion'; } catch (e) { return false; } }).length}`);
  console.log(`  ReferenceErrors: ${state.errors.filter((e) => /ReferenceError/.test(e)).length}`);
  console.log(`  errors: ${state.errors.length ? state.errors.join(' | ') : 'none'}`);

  if (waNav.length !== 1) bad.push(`form: expected 1 WhatsApp navigation, got ${waNav.length}`);
  if (waNav.length && !/[?&]text=/.test(waNav[0])) bad.push('form: text parameter missing');
  if (conv(state, 'jucWCNPv3OAbEPOvruco') !== 1) bad.push(`form: expected 1 WhatsApp conversion, got ${conv(state, 'jucWCNPv3OAbEPOvruco')}`);
  if (ev(state, 'form_submission') !== 1) bad.push(`form: expected 1 GA4 form_submission, got ${ev(state, 'form_submission')}`);
  if (state.dl.filter((x) => x && x.event === 'form_submission').length !== 1) bad.push('form: dataLayer form_submission not exactly 1');
  if (state.errors.filter((e) => /ReferenceError/.test(e)).length) bad.push('form: ReferenceError present');
  await ctx.close();
}

// ------------------------------------------------------- B. a tel: link
{
  const { ctx, page, state } = await session();
  const links = page.locator('a[href^="tel:"][onclick*="trackPhoneClick"]');
  const n = await links.count();
  let target = null;
  for (let i = 0; i < n; i++) if (await links.nth(i).isVisible()) { target = links.nth(i); break; }
  await target.click({ force: true });
  await page.waitForTimeout(1500);
  console.log('\n=== B. tel: LINK, live');
  state.gtag.forEach((c) => console.log(`    ${c}`));
  console.log(`  GA4 phone_call_click: ${ev(state, 'phone_call_click')}   (script.js also emits phone_click: ${ev(state, 'phone_click')})`);
  console.log(`  Ads conversions (NGIFCNbv3OAbEPOvruco): ${conv(state, 'NGIFCNbv3OAbEPOvruco')}`);
  console.log(`  conversion events of ANY label: ${state.gtag.filter((c) => { try { return JSON.parse(c)[1] === 'conversion'; } catch (e) { return false; } }).length}`);
  console.log(`  dataLayer phone_call pushes: ${state.dl.filter((x) => x && x.event === 'phone_call').length}`);
  console.log(`  ReferenceErrors: ${state.errors.filter((e) => /ReferenceError/.test(e)).length}`);
  if (conv(state, 'NGIFCNbv3OAbEPOvruco') !== 1) bad.push(`tel: expected 1 conversion, got ${conv(state, 'NGIFCNbv3OAbEPOvruco')}`);
  if (state.gtag.filter((c) => { try { return JSON.parse(c)[1] === 'conversion'; } catch (e) { return false; } }).length !== 1) bad.push('tel: more than one conversion event');
  if (ev(state, 'phone_call_click') !== 1) bad.push(`tel: expected 1 phone_call_click, got ${ev(state, 'phone_call_click')}`);
  await ctx.close();
}

// -------------------------------------- C. whatsapp link and a CTA link
{
  const { ctx, page, state } = await session();
  const wl = page.locator('a[href*="wa.me"][onclick*="trackWhatsAppClick"]');
  let t = null;
  for (let i = 0; i < await wl.count(); i++) if (await wl.nth(i).isVisible()) { t = wl.nth(i); break; }
  await t.click({ force: true });
  await page.waitForTimeout(1200);
  const waConv = conv(state, 'jucWCNPv3OAbEPOvruco');
  const waEv = ev(state, 'whatsapp_click');

  // the CTA handler, on the get-directions link
  const cta = page.locator('a[onclick*="trackCTAClick"]');
  const ctaN = await cta.count();
  let ctaFired = 'no such link';
  if (ctaN) {
    let c2 = null;
    for (let i = 0; i < ctaN; i++) if (await cta.nth(i).isVisible()) { c2 = cta.nth(i); break; }
    if (c2) { await c2.click({ force: true }); await page.waitForTimeout(1000); ctaFired = ev(state, 'cta_click'); }
  }
  console.log('\n=== C. wa.me LINK + CTA LINK, live');
  state.gtag.forEach((c) => console.log(`    ${c}`));
  console.log(`  GA4 whatsapp_click: ${waEv}   Ads conversions (jucWCNPv3OAbEPOvruco): ${waConv}`);
  console.log(`  GA4 cta_click: ${ctaFired}   (${ctaN} link(s) with trackCTAClick)`);
  console.log(`  dataLayer whatsapp_click pushes: ${state.dl.filter((x) => x && x.event === 'whatsapp_click').length}`);
  console.log(`  dataLayer cta_click pushes: ${state.dl.filter((x) => x && x.event === 'cta_click').length}`);
  console.log(`  ReferenceErrors: ${state.errors.filter((e) => /ReferenceError/.test(e)).length}`);
  if (waConv !== 1) bad.push(`wa link: expected 1 conversion, got ${waConv}`);
  if (waEv !== 1) bad.push(`wa link: expected 1 whatsapp_click, got ${waEv}`);
  await ctx.close();
}

await browser.close();
console.log(`\n=== RESULT${BUST ? '  (CACHE_BUST=1 — reading past the stale CDN edge copy)' : ''}`);
console.log(bad.length ? `FAIL:\n  ${bad.join('\n  ')}` : 'PASS — all checks met');
process.exitCode = bad.length ? 1 : 0;
