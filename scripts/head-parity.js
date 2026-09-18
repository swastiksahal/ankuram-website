#!/usr/bin/env node
/**
 * head-parity.js — compare a built page against the live baseline fingerprint,
 * field by field, using the SAME extractor that produced the baseline
 * (scripts/fingerprint.js), so both sides are normalised identically.
 *
 *   node scripts/head-parity.js <built-fingerprint.json> <url>
 *   node scripts/head-parity.js /tmp/prod-fingerprint.json /
 *
 * Reports PASS/FAIL per field and quotes both values on any FAIL.
 */

const fs = require('fs');

const BUILT_FP = process.argv[2];
const URL = process.argv[3] || '/';

const base = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json', 'utf8'))
  .pages.find((p) => p.url === URL);
const built = JSON.parse(fs.readFileSync(BUILT_FP, 'utf8')).pages[0];
if (!base) throw new Error(`baseline has no entry for ${URL}`);

const rows = [];
const q = (v) => (Array.isArray(v) ? JSON.stringify(v) : JSON.stringify(v));
const cmp = (name, a, b, note) => rows.push({
  name, ok: JSON.stringify(a) === JSON.stringify(b), live: a, built: b, note,
});

// ------------------------------------------------------------- head fields
cmp('title', base.title, built.title);
cmp('titleHash', base.titleHash, built.titleHash);
cmp('metaDescription', base.metaDescription, built.metaDescription);
cmp('canonical', base.canonical, built.canonical);
cmp('metaRobots', base.metaRobots, built.metaRobots);
cmp('hreflang', base.hreflang, built.hreflang);
cmp('H1 text', base.h1, built.h1);

// -------------------------------------------------------- og / twitter tags
const keys = (o) => Object.keys(o).sort();
cmp('og: tag names', keys(base.og), keys(built.og));
for (const k of keys(base.og)) cmp(`og  ${k}`, base.og[k], built.og[k]);
cmp('twitter: tag names', keys(base.twitter), keys(built.twitter));
for (const k of keys(base.twitter)) cmp(`tw  ${k}`, base.twitter[k], built.twitter[k]);

// ------------------------------------------------------------------ JSON-LD
cmp('JSON-LD block count', base.jsonLd.length, built.jsonLd.length);
const types = (arr) => arr.map((j) => {
  const m = /"@type"\s*:\s*("([^"]+)"|\[[^\]]*\])/.exec(j);
  return m ? (m[2] || m[1].replace(/\s+/g, ' ')) : '?';
});
cmp('JSON-LD @type, in order', types(base.jsonLd), types(built.jsonLd));
cmp('JSON-LD hashes, in order', base.jsonLdHashes, built.jsonLdHashes);

// --------------------------------------------------------- headings present
// Invariant 4 requires the TEXT to be retained; it allows reordering and
// wrapping, and does not pin the element level. So presence is tested against
// the page's visible text, and the level each string ended up at is reported
// separately — a level change is not a failure, but it is never silent.
const html = fs.readFileSync(process.argv[4] || 'build/production/index.html', 'utf8');
const norm = (s) => String(s).replace(/\s+/g, ' ').trim();
const dec = (t) => t
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const elementText = {};
for (const tag of ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'summary']) {
  const re = new RegExp(`<${tag}\\b[^>]*>([\\s\\S]*?)</${tag}>`, 'gi');
  let m;
  while ((m = re.exec(html))) {
    const t = norm(dec(m[1].replace(/<[^>]+>/g, ' ')));
    (elementText[t] = elementText[t] || []).push(tag);
  }
}
const visible = norm(dec(
  (/<body[^>]*>([\s\S]*)<\/body>/i.exec(html) || [, html])[1]
    .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
));

// A20: the bar is now higher than invariant 4. Every live h2/h3 string must be
// present AS A HEADING ELEMENT, not merely as visible text. <summary> alone does
// not count; an <h1>-<h6> does, including one nested inside a <summary>.
const HEADING_TAGS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
const levelReport = [];
function headingCheck(label, list, sameTag) {
  const uniq = [...new Set(list.map(norm))];
  const absentText = uniq.filter((t) => !visible.includes(t));
  const notHeading = uniq.filter((t) => visible.includes(t) && !(elementText[t] || []).some((tag) => HEADING_TAGS.has(tag)));
  const moved = uniq.filter((t) => {
    const tags = (elementText[t] || []).filter((x) => HEADING_TAGS.has(x));
    return tags.length && !tags.includes(sameTag);
  });
  rows.push({ name: `${label} (${uniq.length} unique) — text retained`, ok: absentText.length === 0, live: absentText, built: '' });
  rows.push({ name: `${label} — present AS A HEADING`, ok: notHeading.length === 0, live: notHeading, built: '' });
  levelReport.push({ label, uniq: uniq.length, moved: moved.map((t) => ({ t, to: (elementText[t] || []).filter((x) => HEADING_TAGS.has(x))[0] })) });
}
headingCheck('every live h2 present', base.h2, 'h2');
headingCheck('every live h3 present', base.h3, 'h3');

// ----------------------------------------------------------------- tracking
const t = [];
const has = (name, id, want) => {
  const n = html.split(id).length - 1;
  t.push({ name, ok: want ? n > 0 : n === 0, detail: `${n} occurrence${n === 1 ? '' : 's'}` });
};
has('GA4 G-MQRSS8DKLE present', 'G-MQRSS8DKLE', true);
has('Ads AW-10954184691 present', 'AW-10954184691', true);
has('Clarity uir8kpny76 present', 'uir8kpny76', true);
has('phone label NGIFCNbv3OAbEPOvruco present', 'NGIFCNbv3OAbEPOvruco', true);
has('WhatsApp label jucWCNPv3OAbEPOvruco present', 'jucWCNPv3OAbEPOvruco', true);
has('no G-KHP2PBXF6X anywhere', 'G-KHP2PBXF6X', false);
has('no G-MQRSS8DKKE typo anywhere', 'G-MQRSS8DKKE', false);
has('no jucWCNbv label typo anywhere', 'jucWCNbv3OAbEPOvruco', false);

const iScript = html.indexOf('src="script.js"');
const iWa = html.indexOf('src="js/contact-whatsapp.js"');
t.push({
  name: 'script.js loads before js/contact-whatsapp.js',
  ok: iScript > -1 && iWa > -1 && iScript < iWa,
  detail: `script.js at byte ${iScript}, contact-whatsapp.js at byte ${iWa}`,
});
const bothDefer = /<script defer src="script\.js">/.test(html) && /<script defer src="js\/contact-whatsapp\.js">/.test(html);
t.push({ name: 'both are defer (defer preserves document order)', ok: bothDefer, detail: bothDefer ? 'both defer' : 'not both defer' });

// ------------------------------------------------------------------- report
let failed = 0;
console.log(`head parity: ${BUILT_FP} vs baseline "${URL}"\n`);
for (const r of rows) {
  if (!r.ok) failed++;
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}`);
  if (!r.ok) {
    console.log(`          live : ${q(r.live)}`);
    console.log(`          built: ${q(r.built)}`);
  }
}
console.log('\nheading levels (invariant 4 pins the text, not the level — reported, not failed):\n');
for (const r of levelReport) {
  console.log(`  ${r.label}: ${r.uniq - r.moved.length}/${r.uniq} at the same level, ${r.moved.length} at a different level`);
  const byTarget = {};
  r.moved.forEach((m) => (byTarget[m.to] = byTarget[m.to] || []).push(m.t));
  for (const [to, list] of Object.entries(byTarget)) {
    console.log(`      -> <${to}>: ${list.length}`);
    list.forEach((t) => console.log(`           ${JSON.stringify(t)}`));
  }
}

console.log('\ntracking:\n');
for (const r of t) {
  if (!r.ok) failed++;
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  ${r.name}  (${r.detail})`);
}
console.log(failed ? `\n${failed} FAILED` : '\nALL PASS');
process.exitCode = failed ? 1 : 0;
