/**
 * verify-live-2.mjs — two things verify-live.mjs could not answer cleanly:
 *   1. console errors on a CLEAN load (no request blocking of my own)
 *   2. the grade tabs, using the page's real class names (.tab-label/.tab-panel)
 *
 * No conversion can fire from a page load, so nothing here writes to the Ads
 * account. A normal pageview is recorded, which is what any real visit does.
 */
import { chromium } from 'playwright';

const URL_ = 'https://ankuramtuition.com/';
const browser = await chromium.launch();

for (const [name, vp] of [['390', { width: 390, height: 844 }], ['1440', { width: 1440, height: 900 }]]) {
  const ctx = await browser.newContext({ viewport: vp });
  const page = await ctx.newPage();
  const consoleErrors = [];
  const warnings = [];
  const failed = [];
  page.on('console', (m) => {
    if (m.type() === 'error') consoleErrors.push(m.text().slice(0, 160));
    if (m.type() === 'warning') warnings.push(m.text().slice(0, 120));
  });
  page.on('pageerror', (e) => consoleErrors.push('PAGEERROR ' + String(e).slice(0, 160)));
  page.on('requestfailed', (r) => failed.push(`${r.failure()?.errorText} ${r.url().slice(0, 80)}`));

  await page.goto(URL_, { waitUntil: 'networkidle', timeout: 60000 });
  await page.waitForTimeout(2500);

  const tabs = await page.evaluate(async () => {
    const inputs = [...document.querySelectorAll('.tab-input')];
    const labels = [...document.querySelectorAll('.tab-label')];
    const panels = [...document.querySelectorAll('.tab-panel')];
    if (!inputs.length) return { found: false };
    const visible = () => panels.map((p) => getComputedStyle(p).display !== 'none');
    const shown = () => {
      const i = visible().indexOf(true);
      return i < 0 ? null : panels[i].textContent.replace(/\s+/g, ' ').trim().slice(0, 44);
    };
    const before = shown();
    const beforeChecked = inputs.findIndex((x) => x.checked);
    labels[1].click();
    await new Promise((r) => setTimeout(r, 200));
    const after = shown();
    const afterChecked = inputs.findIndex((x) => x.checked);
    labels[2] && labels[2].click();
    await new Promise((r) => setTimeout(r, 200));
    const third = shown();
    return {
      found: true, inputs: inputs.length, labels: labels.length, panels: panels.length,
      labelText: labels.map((l) => l.textContent.trim()),
      beforeChecked, afterChecked,
      panelBefore: before, panelAfterSecondTab: after, panelAfterThirdTab: third,
      exactlyOneVisible: visible().filter(Boolean).length === 1,
      switched: before !== after && after !== null,
    };
  });

  console.log(`=== ${name}px, clean load (no blocking)`);
  console.log(`  console errors: ${consoleErrors.length ? JSON.stringify(consoleErrors, null, 2) : 'NONE'}`);
  console.log(`  console warnings: ${warnings.length ? warnings.length + ' — ' + warnings.slice(0, 3).join(' | ') : 'none'}`);
  console.log(`  failed requests: ${failed.length ? JSON.stringify(failed, null, 2) : 'none'}`);
  console.log(`  grade tabs: ${JSON.stringify(tabs, null, 2)}`);
  await ctx.close();
}
await browser.close();
