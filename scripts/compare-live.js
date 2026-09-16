#!/usr/bin/env node
/**
 * compare-live.js — diff live HTTP behaviour against what .htaccess + the
 * filesystem predicted in P0b.
 *
 * Usage: node scripts/compare-live.js public_html baseline/live-http.csv
 * Writes baseline/live-vs-predicted.json and prints a summary.
 */

const fs = require('fs');
const path = require('path');
const { parseRewrites } = require('./fingerprint.js');

const root = process.argv[2] || 'public_html';
const livePath = process.argv[3] || 'baseline/live-http.csv';
const rules = parseRewrites(path.join(root, '.htaccess'));

// ---- parse the live CSV (fields 3 and 5 are quoted) -----------------------
function parseCsv(text) {
  const rows = [];
  for (const line of text.trim().split('\n').slice(1)) {
    const f = [];
    let cur = '', inQ = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (inQ) {
        if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; }
        else if (c === '"') inQ = false;
        else cur += c;
      } else if (c === '"') inQ = true;
      else if (c === ',') { f.push(cur); cur = ''; }
      else cur += c;
    }
    f.push(cur);
    rows.push({
      url: f[0], firstStatus: f[1], firstLocation: f[2],
      finalStatus: f[3], finalUrl: f[4], hops: Number(f[5] || 0),
    });
  }
  return rows;
}

// ---- prediction ----------------------------------------------------------
const fileExists = (p) => fs.existsSync(path.join(root, p.replace(/^\//, '')));

function predict(url) {
  const bare = url.replace(/^\//, '').split('?')[0];

  // Section 2: /index and /index.html -> /
  if (/^index(\.html)?$/.test(bare)) return { status: '301', why: 'index -> /' };

  // Section 2: any .html request is 301'd to the extensionless form
  if (/\.html$/.test(bare) && fileExists(bare)) {
    return { status: '301', why: '.html stripped' };
  }

  // Section 3: first unconditional redirect whose pattern matches
  for (const r of rules) {
    if (!r.regex || r.conditional || !/R=30\d/i.test(r.flags)) continue;
    if (r.regex.test(bare)) return { status: '301', why: `htaccess: ${r.pattern} -> ${r.target}` };
  }

  // Real directory -> index.html (mod_dir adds the trailing slash)
  const asDir = bare.replace(/\/$/, '');
  if (asDir && fs.existsSync(path.join(root, asDir)) && fs.statSync(path.join(root, asDir)).isDirectory()) {
    if (!bare.endsWith('/')) return { status: '301', why: 'directory -> trailing slash' };
    return fileExists(asDir + '/index.html')
      ? { status: '200', why: 'DirectoryIndex' }
      : { status: '403/404', why: 'directory without index.html' };
  }

  // Section 4: trailing slash removed for non-directories
  if (bare.endsWith('/') && bare !== '') return { status: '301', why: 'trailing slash removed' };

  // Section 5: clean URL -> .html
  if (fileExists(bare + '.html')) return { status: '200', why: 'clean URL -> .html' };
  if (fileExists(bare)) return { status: '200', why: 'static file' };

  return { status: '404', why: 'no file, no rule' };
}

// ---- compare -------------------------------------------------------------
const live = parseCsv(fs.readFileSync(livePath, 'utf8'));
const diffs = [];
const agree = [];

for (const r of live) {
  const p = predict(r.url);
  const actual = r.firstStatus;
  const ok =
    p.status === actual ||
    (p.status === '403/404' && /^(403|404)$/.test(actual));
  (ok ? agree : diffs).push({
    url: r.url,
    predicted: p.status,
    predictedWhy: p.why,
    actualFirst: actual,
    location: r.firstLocation,
    finalStatus: r.finalStatus,
    finalUrl: r.finalUrl,
    hops: r.hops,
  });
}

const out = {
  generatedAt: new Date().toISOString(),
  urlsTested: live.length,
  agree: agree.length,
  differ: diffs.length,
  statusTally: live.reduce((a, r) => ((a[r.firstStatus] = (a[r.firstStatus] || 0) + 1), a), {}),
  finalTally: live.reduce((a, r) => ((a[r.finalStatus] = (a[r.finalStatus] || 0) + 1), a), {}),
  differences: diffs,
};
fs.writeFileSync('baseline/live-vs-predicted.json', JSON.stringify(out, null, 2));

console.log(`tested ${live.length}  agree ${agree.length}  differ ${diffs.length}`);
console.log('first-hop status tally:', out.statusTally);
console.log('final status tally:', out.finalTally);
for (const d of diffs) {
  console.log(`  ${d.url}\n     predicted ${d.predicted} (${d.predictedWhy})  actual ${d.actualFirst} -> ${d.location || d.finalUrl}`);
}
