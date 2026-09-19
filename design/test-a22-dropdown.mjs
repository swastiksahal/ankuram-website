/**
 * test-a22-dropdown.mjs — the grade/curriculum filter, driven for real.
 * wa.me and api.whatsapp.com are blocked, so no message is ever sent.
 */
import fs from 'fs';
import path from 'path';
import http from 'http';
import { chromium } from 'playwright';

const ROOT = path.resolve('build/staging');
const TYPES = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8' };
const server = http.createServer((req, res) => {
  const u = decodeURIComponent(req.url.split('?')[0]);      // ignore ?v=<hash>
  let f = path.join(ROOT, u);
  if (u === '/' || u.endsWith('/')) f = path.join(f, 'index.html');
  if (!fs.existsSync(f) || fs.statSync(f).isDirectory()) { res.writeHead(404); res.end(); return; }
  res.writeHead(200, { 'content-type': TYPES[path.extname(f)] || 'application/octet-stream' });
  fs.createReadStream(f).pipe(res);
});
await new Promise((r) => server.listen(8291, r));
const BASE = 'http://127.0.0.1:8291/';
const BLOCK = /wa\.me|api\.whatsapp\.com|doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect/i;

const EXPECTED = {
  '': ['CBSE', 'IB PYP', 'IB MYP', 'IGCSE', 'ICSE', 'ISC', 'IB DP', 'AS & A Levels', 'State Board'],
  '1-5': ['CBSE', 'IB PYP', 'ICSE', 'State Board'],
  '6-10': ['CBSE', 'IB MYP', 'IGCSE', 'ICSE', 'State Board'],
  '11-12': ['CBSE', 'ISC', 'IB DP', 'AS & A Levels', 'State Board'],
};

const browser = await chromium.launch();
const bad = [];

async function newPage(js = true) {
  const ctx = await browser.newContext({ viewport: { width: 390, height: 844 }, javaScriptEnabled: js });
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', (e) => errs.push(String(e).slice(0, 160)));
  page.on('console', (m) => { if (m.type() === 'error' && !/ERR_FAILED|ERR_ABORTED/.test(m.text())) errs.push('console: ' + m.text().slice(0, 140)); });
  await page.route('**/*', (route) => {
    const r = route.request();
    if (BLOCK.test(r.url())) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !r.url().startsWith(BASE)) { errs.push('NAV ' + r.url()); return route.abort(); }
    return route.continue();
  });
  await page.goto(BASE, { waitUntil: 'domcontentloaded' });
  await page.waitForTimeout(js ? 500 : 200);
  return { ctx, page, errs };
}

// ------------------------------------------------- 1. the four grade states
{
  const { ctx, page, errs } = await newPage();
  console.log('=== 1. curriculum options for every grade state\n');
  for (const [grade, want] of Object.entries(EXPECTED)) {
    await page.selectOption('#grade', grade);
    await page.waitForTimeout(120);
    const got = await page.evaluate(() => {
      const s = document.getElementById('curriculum');
      return {
        texts: [...s.options].filter((o) => o.value !== '').map((o) => o.textContent),
        placeholder: s.options[0] && s.options[0].textContent,
        placeholderValue: s.options[0] && s.options[0].value,
        disabled: s.disabled,
        count: s.options.length,
        id: s.id, name: s.name, tag: s.tagName,
      };
    });
    const label = grade === '' ? 'BLANK (no grade chosen)' : `Grades ${grade}`;
    const ok = JSON.stringify(got.texts) === JSON.stringify(want);
    if (!ok) bad.push(`${label}: got ${JSON.stringify(got.texts)}, expected ${JSON.stringify(want)}`);
    if (got.disabled) bad.push(`${label}: the select is disabled`);
    if (got.placeholder !== 'Select Curriculum' || got.placeholderValue !== '') bad.push(`${label}: placeholder changed`);
    if (got.tag !== 'SELECT' || got.id !== 'curriculum' || got.name !== 'curriculum') bad.push(`${label}: select identity changed`);
    console.log(`  ${label}`);
    console.log(`     ${got.texts.length} curricula: ${got.texts.join(' · ')}`);
    console.log(`     placeholder "${got.placeholder}" (value="${got.placeholderValue}")  disabled=${got.disabled}  ${ok ? 'MATCHES' : '*** MISMATCH ***'}`);
  }
  console.log(`\n  errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  if (errs.length) bad.push('console/page errors in test 1');
  await ctx.close();
}

// ---------------------------------- 2. keep a still-valid choice across grades
{
  const { ctx, page } = await newPage();
  await page.selectOption('#grade', '6-10');
  await page.selectOption('#curriculum', 'cbse');
  await page.selectOption('#grade', '11-12');
  await page.waitForTimeout(120);
  const kept = await page.evaluate(() => document.getElementById('curriculum').value);
  console.log(`\n=== 2. CBSE selected, grade 6-10 -> 11-12 (CBSE valid in both)`);
  console.log(`  curriculum after: "${kept}"  ${kept === 'cbse' ? 'KEPT, correct' : '*** should have been kept ***'}`);
  if (kept !== 'cbse') bad.push('a still-valid curriculum was not kept');
  await ctx.close();
}

// ------------------------------- 3. reset when the choice becomes invalid
{
  const { ctx, page } = await newPage();
  await page.selectOption('#grade', '11-12');
  await page.selectOption('#curriculum', 'ib-dp');
  const before = await page.evaluate(() => document.getElementById('curriculum').value);
  await page.selectOption('#grade', '1-5');
  await page.waitForTimeout(120);
  const after = await page.evaluate(() => ({
    value: document.getElementById('curriculum').value,
    text: document.getElementById('curriculum').options[document.getElementById('curriculum').selectedIndex].textContent,
  }));
  console.log(`\n=== 3. IB DP selected, grade 11-12 -> 1-5 (IB DP invalid for 1-5)`);
  console.log(`  before: "${before}"   after: value="${after.value}" text="${after.text}"`);
  const ok = after.value === '' && after.text === 'Select Curriculum';
  console.log(`  ${ok ? 'RESET to the placeholder, correct' : '*** did not reset to the placeholder ***'}`);
  if (!ok) bad.push(`invalid curriculum not reset: value="${after.value}"`);
  await ctx.close();
}

// ------------------------------------------- 4. Grades 1-5 + IB PYP submits
{
  const { ctx, page, errs } = await newPage();
  const navs = [];
  page.on('request', () => {});
  await page.route('**/*', async (route) => {
    const r = route.request();
    const u = r.url();
    if (/wa\.me|api\.whatsapp\.com/i.test(u)) { navs.push(u); return route.abort(); }
    if (BLOCK.test(u)) return route.abort();
    if (r.isNavigationRequest() && r.frame() === page.mainFrame() && !u.startsWith(BASE)) { navs.push(u); return route.abort(); }
    return route.continue();
  });
  await page.selectOption('#grade', '1-5');
  await page.selectOption('#curriculum', 'ib-pyp');
  await page.fill('#name', 'Test Parent');
  await page.fill('#phone', '9876543210');
  await page.locator('.contact-form button[type=submit]').click();
  await page.waitForTimeout(2200);
  console.log(`\n=== 4. Grades 1-5 + IB PYP, submitted`);
  const wa = navs.filter((u) => /wa\.me/.test(u));
  wa.forEach((u) => {
    console.log(`  FULL URL: ${u}`);
    const m = /[?&]text=([^&]*)/.exec(u);
    const t = m ? decodeURIComponent(m[1]) : null;
    console.log(`  decoded text: ${JSON.stringify(t)}`);
    if (!t || !t.includes('Curriculum: IB PYP')) bad.push('the WhatsApp text does not read "Curriculum: IB PYP"');
    if (!t || !t.includes('Grade: Grades 1-5')) bad.push('the WhatsApp text does not carry the grade');
  });
  if (wa.length !== 1) bad.push(`expected 1 WhatsApp navigation, got ${wa.length}`);
  console.log(`  errors: ${errs.length ? errs.filter((e) => !e.startsWith('NAV')).join(' | ') || 'none' : 'none'}`);
  await ctx.close();
}

// ------------------------------------------------- 5. JavaScript disabled
{
  const { ctx, page } = await newPage(false);
  const got = await page.evaluate(() => {
    const s = document.getElementById('curriculum');
    return [...s.options].filter((o) => o.value !== '').map((o) => o.textContent);
  });
  console.log(`\n=== 5. JavaScript DISABLED`);
  console.log(`  ${got.length} curricula: ${got.join(' · ')}`);
  const ok = got.length === 9 && JSON.stringify(got) === JSON.stringify(EXPECTED['']);
  console.log(`  ${ok ? 'all 9 present and selectable, correct' : '*** not all 9 present ***'}`);
  if (!ok) bad.push(`JS off: ${got.length} curricula, expected 9`);
  await ctx.close();
}

await browser.close();
server.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — every A22 check met');
process.exitCode = bad.length ? 1 : 0;
