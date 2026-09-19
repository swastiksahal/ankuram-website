/** A24/A25/A25.1 on the LIVE page. wa.me and all beacons blocked. */
import { chromium } from 'playwright';
const URL_ = 'https://ankuramtuition.com/';
const BLOCK = /wa\.me|api\.whatsapp\.com|doubleclick|google-analytics|analytics\.google|clarity\.ms|googletagmanager\.com|\/collect|\/ccm\/|\/rmkt\//i;
const UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1';
const BOARDS = ['CBSE', 'ICSE', 'ISC', 'IGCSE', 'IB PYP', 'IB MYP', 'IB DP', 'AS & A Levels', 'State Board'];
const ANCHORS = ['home', 'about', 'curricula', 'contact', 'reviews', 'hybrid-classes'];
const bad = [];
const b = await chromium.launch();

// raw HTML for counts
const html = await (await fetch(URL_)).text();
const plain = html.replace(/&amp;/g, '&');
console.log('=== board-name counts on the LIVE page');
for (const n of BOARDS) {
  const c = plain.split(n).length - 1;
  if (c === 0) bad.push(`${n} count is zero`);
  console.log(`  ${n.padEnd(16)}${String(c).padStart(3)}${c === 0 ? '  *** ZERO ***' : ''}`);
}
console.log(`\n  hero band (curricula-line) occurrences: ${html.split('curricula-line').length - 1}  ${html.includes('curricula-line') ? '*** STILL PRESENT ***' : '(absent, correct)'}`);
if (html.includes('curricula-line')) bad.push('hero band still on the live page');
console.log(`  id="curricula": ${html.split('id="curricula"').length - 1}`);
if (!html.includes('id="curricula"')) bad.push('id="curricula" missing');

for (const js of [true, false]) {
  const c = await b.newContext({ viewport: { width: 390, height: 844 }, userAgent: UA, javaScriptEnabled: js });
  const p = await c.newPage();
  const errs = [];
  p.on('pageerror', (e) => errs.push(String(e).slice(0, 140)));
  await p.route('**/*', (r) => (BLOCK.test(r.request().url()) ? r.abort() : r.continue()));
  await p.goto(URL_, { waitUntil: 'domcontentloaded' });
  await p.waitForTimeout(js ? 900 : 300);
  const d = p.locator('#curricula details.curr-details');
  const sum = d.locator('summary');
  const sets = d.locator('.curr-sets');
  const start = await d.getAttribute('open');
  await sum.click(); const o1 = await d.getAttribute('open'); const v1 = await sets.isVisible();
  const chips = await d.locator('.curr-chip').count();
  const titles = await d.locator('.curr-set-title').allTextContents();
  await sum.click(); const o2 = await d.getAttribute('open');
  const anchors = await p.evaluate((ids) => ids.map((i) => `${i}:${!!document.getElementById(i)}`), ANCHORS);
  console.log(`\n=== curricula fold, live, JavaScript ${js ? 'ENABLED' : 'DISABLED'}`);
  console.log(`  starts closed: ${start === null}   opens: ${o1 !== null && v1}   closes: ${o2 === null}`);
  console.log(`  chips: ${chips}   sets: ${JSON.stringify(titles)}`);
  console.log(`  anchors: ${anchors.join('  ')}`);
  console.log(`  page errors: ${errs.length ? errs.join(' | ') : 'none'}`);
  if (start !== null) bad.push(`js=${js}: fold starts open`);
  if (!(o1 !== null && v1)) bad.push(`js=${js}: fold did not open`);
  if (o2 !== null) bad.push(`js=${js}: fold did not close`);
  if (chips !== 9) bad.push(`js=${js}: ${chips} chips`);
  if (titles.length !== 2) bad.push(`js=${js}: ${titles.length} set titles`);
  if (anchors.some((a) => a.endsWith('false'))) bad.push(`js=${js}: missing anchor`);
  if (errs.length) bad.push(`js=${js}: page errors`);
  await c.close();
}
await b.close();
console.log(bad.length ? `\nFAIL:\n  ${bad.join('\n  ')}` : '\nPASS — every A24/A25 live check met');
process.exitCode = bad.length ? 1 : 0;
