#!/usr/bin/env node
/**
 * gsc-tiers.js — build baseline/gsc-tiers.csv from the Search Console
 * transcription, and add a tier column to docs/waves.csv.
 *
 * Tiers, from Step 7 (last 3 months, 2026-06-15 to 2026-09-14):
 *   A = at least 1 click
 *   B = impressions but 0 clicks
 *   C = no 3-month data at all
 *
 * .html and trailing-slash variants of the same page are merged, and figures
 * summed, because they are one page to the visitor and one file to us.
 *
 * Usage: node scripts/gsc-tiers.js
 */

const fs = require('fs');

const GSC = 'baseline/gsc-2026-09-16.md';
const md = fs.readFileSync(GSC, 'utf8').split(/\r?\n/);

// ---- pull the Step 7 table -------------------------------------------------
const start = md.findIndex((l) => /^\*\*Step 7\b/.test(l));
if (start < 0) throw new Error('Step 7 not found');
const rows = [];
for (let i = start; i < md.length; i++) {
  const l = md[i];
  if (/^\*\*Step 8\b/.test(l)) break;
  if (!l.startsWith('|') || /^\|\s*-+/.test(l) || /Page URL/.test(l)) continue;
  const cells = l.split('|').slice(1, -1).map((c) => c.trim());
  if (cells.length < 5) continue;
  const rawUrl = cells[0].replace(/`/g, '').replace(/\(subdomain\)/i, '').trim();
  const num = (s) => Number(String(s).replace(/,/g, '').replace(/[^0-9-]/g, '') || 0);
  rows.push({ rawUrl, clicks3: num(cells[1]), clicksPrev: num(cells[2]), imps3: num(cells[3]), impsPrev: num(cells[4]) });
}

// ---- normalise a URL to a comparable path ----------------------------------
function parse(rawUrl) {
  const m = /^https?:\/\/([^/]+)(\/[^?#]*)?/i.exec(rawUrl);
  if (!m) return null;
  const host = m[1].toLowerCase();
  let p = (m[2] || '/').split('?')[0].split('#')[0];
  return { host, path: p };
}
/** Collapse .html and trailing-slash variants onto one key. */
const key = (p) => {
  let s = p.replace(/\.html$/i, '');
  if (s.length > 1) s = s.replace(/\/+$/, '');
  return s === '' ? '/' : s.toLowerCase();
};

const APEX = new Set(['ankuramtuition.com', 'www.ankuramtuition.com']);

// ---- inventory: the pages we actually own ----------------------------------
function parseCsv(text) {
  return text.trim().split('\n').slice(1).map((line) => {
    const f = []; let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c; }
      else if (c === '"') inQ = true;
      else if (c === ',') { f.push(cur); cur = ''; }
      else cur += c;
    }
    f.push(cur); return f;
  });
}
const inv = parseCsv(fs.readFileSync('baseline/url-inventory.csv', 'utf8'))
  .filter((r) => r[1] && !r[1].startsWith('(')); // file-backed rows only
const invByKey = new Map();
for (const r of inv) invByKey.set(key(r[0]), { url: r[0], file: r[1] });

// ---- aggregate GSC rows onto inventory keys --------------------------------
const agg = new Map();     // key -> {clicks3, imps3, urls:[]}
const unmapped = [];
for (const r of rows) {
  const u = parse(r.rawUrl);
  if (!u) { unmapped.push({ url: r.rawUrl, reason: 'unparseable', clicks3: r.clicks3, imps3: r.imps3 }); continue; }
  const k = key(u.path);
  const onApex = APEX.has(u.host);
  if (!onApex) { unmapped.push({ url: r.rawUrl, reason: `other host (${u.host})`, clicks3: r.clicks3, imps3: r.imps3 }); continue; }
  if (!invByKey.has(k)) { unmapped.push({ url: r.rawUrl, reason: 'no file in url-inventory.csv', clicks3: r.clicks3, imps3: r.imps3 }); continue; }
  const cur = agg.get(k) || { clicks3: 0, imps3: 0, urls: [] };
  cur.clicks3 += r.clicks3; cur.imps3 += r.imps3; cur.urls.push(r.rawUrl);
  agg.set(k, cur);
}

// ---- tier every inventory page --------------------------------------------
const tierOf = (d) => (!d ? 'C' : d.clicks3 >= 1 ? 'A' : d.imps3 > 0 ? 'B' : 'C');
const out = [];
for (const [k, meta] of invByKey) {
  const d = agg.get(k);
  out.push({ url_path: meta.url, file: meta.file, tier: tierOf(d), clicks_3m: d ? d.clicks3 : 0, impressions_3m: d ? d.imps3 : 0 });
}
out.sort((a, b) => (b.clicks_3m - a.clicks_3m) || (b.impressions_3m - a.impressions_3m) || a.url_path.localeCompare(b.url_path));

const cell = (v) => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v));
fs.writeFileSync('baseline/gsc-tiers.csv',
  ['url_path,tier,clicks_3m,impressions_3m']
    .concat(out.map((r) => [r.url_path, r.tier, r.clicks_3m, r.impressions_3m].map(cell).join(',')))
    .join('\n') + '\n');

fs.writeFileSync('baseline/gsc-unmapped.csv',
  ['gsc_url,reason,clicks_3m,impressions_3m']
    .concat(unmapped.map((u) => [u.url, u.reason, u.clicks3, u.imps3].map(cell).join(',')))
    .join('\n') + '\n');

// ---- add tier to docs/waves.csv -------------------------------------------
const wavesRaw = fs.readFileSync('docs/waves.csv', 'utf8').trim().split('\n');
const wHeader = wavesRaw[0].split(',');
const wRows = parseCsv(fs.readFileSync('docs/waves.csv', 'utf8'));
// Join on the normalised key, not the filename: .html and folder/index.html
// variants of one page collapse to a single tier row, so a filename join
// would silently default one of each pair to C.
const tierByKey = new Map(out.map((r) => [key(r.url_path), r.tier]));
const urlIdx = wHeader.indexOf('url');
const missing = [];
const newWaves = [wHeader.concat('tier').join(',')].concat(
  wRows.map((r) => {
    const t = tierByKey.get(key(r[urlIdx]));
    if (!t) missing.push(r[urlIdx]);
    return r.concat(t || 'C').map(cell).join(',');
  })
);
if (missing.length) console.log('waves rows with no tier match (defaulted to C):', missing.join(', '));
fs.writeFileSync('docs/waves.csv', newWaves.join('\n') + '\n');

// ---- report ----------------------------------------------------------------
const byTier = out.reduce((a, r) => ((a[r.tier] = (a[r.tier] || 0) + 1), a), {});
console.log(`GSC Step 7 rows parsed: ${rows.length}`);
console.log(`inventory pages tiered: ${out.length}  ${JSON.stringify(byTier)}`);
console.log(`unmapped GSC rows: ${unmapped.length}`);
console.log('\nTier A:');
out.filter((r) => r.tier === 'A').forEach((r) => console.log(`  ${String(r.clicks_3m).padStart(4)} clicks  ${String(r.impressions_3m).padStart(6)} imps  ${r.url_path}`));
const totalClicks = out.reduce((a, r) => a + r.clicks_3m, 0);
const home = out.find((r) => r.url_path === '/');
console.log(`\ntotal clicks across our pages: ${totalClicks}; homepage ${home.clicks_3m} = ${((home.clicks_3m / totalClicks) * 100).toFixed(1)}%`);
console.log(`waves.csv now has ${wHeader.length + 1} columns`);
