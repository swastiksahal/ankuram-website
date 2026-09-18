/**
 * verify-live.mjs — post-deploy verification against the LIVE homepage.
 *
 * ADDITION 2: prove the page renders, not merely that it returns 200.
 * ADDITION 3: prove the conversion wiring, WITHOUT recording real conversions
 *             and WITHOUT sending a real WhatsApp message.
 *
 * Safety:
 *   - Every outbound conversion/analytics BEACON is aborted at the network
 *     layer, so nothing this script does can reach Google Ads account
 *     786-647-2391 or the GA4 property. gtag itself is allowed to load, and
 *     window.gtag is wrapped so the calls the page makes are recorded locally.
 *   - Navigation away from the page is aborted and the URL recorded, so no
 *     WhatsApp message is ever sent. The form is NOT submitted; its handler and
 *     its generated wa.me URL are inspected instead.
 */
import fs from 'fs';
import { chromium } from 'playwright';

const URL_ = 'https://ankuramtuition.com/';
const BEACON = /googleads\.g\.doubleclick\.net|\/pagead\/|google-analytics\.com|analytics\.google\.com|\/g\/collect|clarity\.ms\/c\.gif|region1\.google-analytics/i;

const browser = await chromium.launch();
const report = {};

for (const [name, vp] of [['390', { width: 390, height: 844 }], ['1440', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp, deviceScaleFactor: 1 });
  const page = await ctx.newPage();

  const consoleErrors = [];
  const pageErrors = [];
  const responses = [];
  const blocked = [];
  const navAttempts = [];

  page.on('console', (m) => { if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 200)); });
  page.on('pageerror', (e) => pageErrors.push(String(e).slice(0, 200)));
  page.on('response', (r) => responses.push({ url: r.url(), status: r.status() }));

  await page.route('**/*', async (route) => {
    const r = route.request();
    const u = r.url();
    if (BEACON.test(u)) { blocked.push(u.slice(0, 90)); return route.abort(); }
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(URL_)) {
      navAttempts.push(u); return route.abort();
    }
    return route.continue();
  });

  await page.goto(URL_, { waitUntil: 'networkidle', timeout: 60000 });
  await page.screenshot({ path: `design/screens/LIVE-${name}.png`, fullPage: true });

  const assets = {
    css: responses.find((r) => r.url.includes('/css/site.css')),
    wa: responses.find((r) => r.url.includes('/js/contact-whatsapp.js')),
    scriptjs: responses.find((r) => /\/script\.js/.test(r.url)),
  };

  const overflow = await page.evaluate(() => {
    const d = document.documentElement;
    return { over: Math.max(0, d.scrollWidth - d.clientWidth), scrollW: d.scrollWidth, clientW: d.clientWidth };
  });

  // ------------------------------------------------ FAQ accordion, real clicks
  const det = page.locator('.sec-details .accordion details').first();
  const before = await det.getAttribute('open');
  await det.locator('summary').click();
  const opened = await det.getAttribute('open');
  const bodyVisible = await det.locator('.acc-body').isVisible();
  await det.locator('summary').click();
  const closed = await det.getAttribute('open');

  // ------------------------------------------------------------- grade tabs
  const tabs = await page.evaluate(() => {
    const radios = [...document.querySelectorAll('.tab-bar input[type=radio], input[name^="tab"]')];
    const labels = [...document.querySelectorAll('.tab-bar label')].map((l) => l.textContent.trim());
    return { radios: radios.length, labels };
  });
  let tabResult = 'no tabs found';
  if (tabs.radios > 1) {
    const panelBefore = await page.evaluate(() => {
      const p = [...document.querySelectorAll('.tab-panels > *')].find((x) => getComputedStyle(x).display !== 'none');
      return p ? p.textContent.trim().slice(0, 45) : null;
    });
    await page.locator('.tab-bar label').nth(1).click();
    await page.waitForTimeout(200);
    const panelAfter = await page.evaluate(() => {
      const p = [...document.querySelectorAll('.tab-panels > *')].find((x) => getComputedStyle(x).display !== 'none');
      return p ? p.textContent.trim().slice(0, 45) : null;
    });
    tabResult = { panelBefore, panelAfter, switched: panelBefore !== panelAfter };
  }

  // ------------------------------------------------------------- swipe rows
  let swipe = 'n/a (desktop)';
  if (name === '390') {
    swipe = await page.evaluate(async () => {
      const row = document.querySelector('.swipe');
      if (!row) return 'no .swipe found';
      const start = row.scrollLeft;
      row.scrollLeft = 200;
      await new Promise((r) => setTimeout(r, 120));
      const moved = row.scrollLeft;
      row.scrollLeft = start;
      return { scrollWidth: row.scrollWidth, clientWidth: row.clientWidth, scrolledTo: moved, scrollable: moved > start };
    });
  }

  report[name] = {
    consoleErrors, pageErrors, assets, overflow,
    faq: { startedOpen: before !== null, openedOnClick: opened !== null, bodyVisible, closedOnSecondClick: closed === null },
    tabs: tabResult, swipe,
    blockedBeacons: [...new Set(blocked)].length,
    navAttempts,
  };
  await ctx.close();
}

// =============================================== ADDITION 3 — conversion wiring
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
const page = await ctx.newPage();
const gtagCalls = [];
const navs = [];
await page.exposeFunction('__rec', (s) => gtagCalls.push(s));
await page.route('**/*', async (route) => {
  const r = route.request();
  const u = r.url();
  if (BEACON.test(u)) return route.abort();
  if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(URL_)) { navs.push(u); return route.abort(); }
  return route.continue();
});
await page.goto(URL_, { waitUntil: 'networkidle', timeout: 60000 });

// what the three controls resolve to, read straight off the DOM
const controls = await page.evaluate(() => {
  const wa = document.querySelector('a.hcta-wa') || document.querySelector('a[href*="wa.me"]');
  const tel = document.querySelector('a.hcta-tel') || document.querySelector('a[href^="tel:"]');
  const btn = document.querySelector('.contact-form button[type=submit]');
  const form = document.getElementById('contactForm');
  return {
    whatsapp: { href: wa && wa.getAttribute('href'), text: wa && wa.textContent.trim() },
    phone: { href: tel && tel.getAttribute('href'), text: tel && tel.textContent.trim() },
    submit: {
      text: btn && btn.textContent.trim(),
      formOnsubmit: form && form.getAttribute('onsubmit'),
      handlerSource: typeof window.handleFormSubmit === 'function' ? window.handleFormSubmit.toString().slice(0, 260) : null,
      handlerName: typeof window.handleFormSubmit === 'function' ? window.handleFormSubmit.name : null,
      overrideLoaded: typeof window.__contactWhatsAppUrl === 'function',
      note: (document.querySelector('.form-note') || {}).textContent,
    },
    waLinksOnPage: document.querySelectorAll('a[href*="wa.me"]').length,
    telLinksOnPage: document.querySelectorAll('a[href^="tel:"]').length,
  };
});

// the wa.me URL the form WOULD generate — generated, never submitted
const generated = await page.evaluate(() => {
  const set = (id, v) => { const el = document.getElementById(id); if (el) { el.value = v; } };
  set('name', 'TEST DO NOT SEND');
  set('phone', '0000000000');
  const g = document.getElementById('grade'); if (g) g.selectedIndex = 1;
  const c = document.getElementById('curriculum'); if (c) c.selectedIndex = 1;
  set('message', 'automated post-deploy check, not submitted');
  return typeof window.__contactWhatsAppUrl === 'function' ? window.__contactWhatsAppUrl() : null;
});

// wrap gtag, then click the two links. Beacons are blocked, so nothing is recorded at Google.
await page.evaluate(() => {
  const inner = window.gtag;
  window.gtag = function () {
    try { window.__rec(JSON.stringify([...arguments].map((a) => (a && typeof a === 'object' ? Object.keys(a).reduce((o, k) => { o[k] = typeof a[k] === 'function' ? '[fn]' : a[k]; return o; }, {}) : a)))); } catch (e) {}
    try { if (typeof inner === 'function') inner.apply(this, arguments); } catch (e) {}
    const last = arguments[2];
    if (last && typeof last.event_callback === 'function') setTimeout(last.event_callback, 5);
  };
});

const mark = () => gtagCalls.length;
const phoneStart = mark();
await page.locator('a.hcta-tel, a[href^="tel:"]').first().click({ force: true });
await page.waitForTimeout(1200);
const phoneCalls = gtagCalls.slice(phoneStart);

const waStart = mark();
await page.locator('a.hcta-wa, a[href*="wa.me"]').first().click({ force: true });
await page.waitForTimeout(1200);
const waCalls = gtagCalls.slice(waStart);

report.conversions = {
  controls,
  generatedWaUrl: generated,
  phoneClick: { calls: phoneCalls, conversions: phoneCalls.filter((c) => c.includes('NGIFCNbv3OAbEPOvruco')).length },
  whatsappClick: { calls: waCalls, conversions: waCalls.filter((c) => c.includes('jucWCNPv3OAbEPOvruco')).length },
  navigationsAttempted: navs,
  formSubmitted: false,
};
await ctx.close();
await browser.close();

fs.writeFileSync('design/live-verify.json', JSON.stringify(report, null, 2));
console.log(JSON.stringify(report, null, 2));
