/**
 * verify-live-3.mjs — control test for the aborted analytics beacons.
 *
 * The new homepage shows net::ERR_ABORTED on some Google collect endpoints.
 * If an UNTOUCHED page (which still uses the old markup and styles.css) shows
 * the same pattern, it is environmental and not caused by wave 1.
 */
import { chromium } from 'playwright';

const PAGES = [
  ['/ (new, wave 1)', 'https://ankuramtuition.com/'],
  ['/how-we-teach (untouched)', 'https://ankuramtuition.com/how-we-teach'],
];

const browser = await chromium.launch();
for (const [label, url] of PAGES) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await ctx.newPage();
  const ok = [];
  const failed = [];
  page.on('response', (r) => {
    const u = r.url();
    if (/googletagmanager|google-analytics|analytics\.google|doubleclick|clarity|\/collect/i.test(u)) ok.push(`${r.status()} ${u.slice(0, 70)}`);
  });
  page.on('requestfailed', (r) => {
    const u = r.url();
    if (/googletagmanager|google-analytics|analytics\.google|doubleclick|clarity|\/collect|rmkt|ccm/i.test(u)) failed.push(`${r.failure()?.errorText} ${u.slice(0, 70)}`);
  });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(3000);
  const ids = await page.evaluate(() => ({
    gtagDefined: typeof window.gtag === 'function',
    dataLayerLength: (window.dataLayer || []).length,
    clarityDefined: typeof window.clarity === 'function',
    html: document.documentElement.outerHTML.length,
  }));
  console.log(`=== ${label}`);
  console.log(`  tracking loaded OK (${ok.length}):`);
  ok.forEach((x) => console.log(`     ${x}`));
  console.log(`  aborted/failed (${failed.length}):`);
  failed.forEach((x) => console.log(`     ${x}`));
  console.log(`  gtag defined: ${ids.gtagDefined}   dataLayer entries: ${ids.dataLayerLength}   clarity defined: ${ids.clarityDefined}`);
  await ctx.close();
}
await browser.close();
