#!/usr/bin/env node
/**
 * make-waves.js — assign every HTML file in the baseline to exactly one
 * migration wave. Fails loudly if any file is unassigned or double-assigned.
 *
 * Usage: node scripts/make-waves.js   ->  docs/waves.csv + summary on stdout
 */

const fs = require('fs');

const fp = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json', 'utf8'));
const files = fp.pages.map((p) => ({ file: p.file, url: p.url, bytes: p.bytes, robots: p.metaRobots || '' }));

// Files no live URL can reach (proved in P0c). Left untouched — not rebuilt.
const UNREACHABLE = new Set([
  'cbse-class-10-maths.html',
  'areas/kukatpally.html',
  'ib-pyp-tuition-hyderabad.html',
]);

const PAID = new Set([
  'online-tuition-class-10-cbse/index.html',
  'online-maths-tuition-class-10-cbse/index.html',
  'online-science-tuition-class-10-cbse/index.html',
  'cbse-class-10/index.html',
]);

// Paid pages are rebuilt one at a time, in this order, each needing its own approval.
const PAID_ORDER = [
  'online-science-tuition-class-10-cbse/index.html',
  'online-maths-tuition-class-10-cbse/index.html',
  'online-tuition-class-10-cbse/index.html',
  'cbse-class-10/index.html', // last: the most complex, Ads sitelinks depend on its anchors
];

function waveFor(f) {
  const n = f.file;
  if (UNREACHABLE.has(n)) return { wave: 'X', name: 'Untouched (unreachable)' };
  if (PAID.has(n)) return { wave: '8.' + (PAID_ORDER.indexOf(n) + 1), name: 'Paid Ads landing pages (one at a time)' };

  if (n === 'index.html') return { wave: '1', name: 'Homepage' };

  // Wave 2 — the shared chrome proves itself on small, low-risk pages
  if (/^(about|contact|privacy-policy|terms|thank-you|404)\//.test(n) || /^(thank-you|404)\.html$/.test(n)) {
    return { wave: '2', name: 'Utility and trust pages' };
  }
  if (n === 'how-we-teach.html') return { wave: '2', name: 'Utility and trust pages' };

  // Wave 3 — 24 near-identical area pages, one template, biggest win per unit of work
  if (/^areas\//.test(n)) return { wave: '3', name: 'Area pages' };

  // Wave 4 — board / curriculum landing pages
  if (/^(best-cbse-tuition-centre|cbse-tuition-jubilee-hills|cbse-icse-igcse-ib-tuition-hyderabad|icse-tuition-hyderabad|igcse-tuition-jubilee-hills|ib-tuition-hyderabad|ib-myp-tuition-hyderabad|ib-dp-tuition-hyderabad|isc-tuition-hyderabad|state-board-tuition-hyderabad|a-level-tuition-hyderabad)\.html$/.test(n)) {
    return { wave: '4', name: 'Board and curriculum pages' };
  }

  // Wave 5 — subject pages
  if (/^(maths-tuition-jubilee-hills|science-tuition-jubilee-hills|physics-tuition-hyderabad|online-maths-tuition|a-level-maths-tuition-hyderabad|ib-maths-tuition-hyderabad|icse-maths-tuition-hyderabad|igcse-maths-tuition-hyderabad)\.html$/.test(n)) {
    return { wave: '5', name: 'Subject pages' };
  }

  // Wave 6 — class / grade pages (the commercial core)
  if (/^class-\d/.test(n) || /^(cbse-class-10-maths|cbse-class-10-science|cbse-class-10-online-tuition|online-class-10-tuition|online-maths-tuition-class-10-cbse|online-maths-tuition-class-10-icse|online-science-tuition-class-10-cbse)\//.test(n) || /^(online-class-10-tuition|cbse-class-10-online-tuition)\.html$/.test(n)) {
    return { wave: '6', name: 'Class and grade pages' };
  }

  // Wave 7 — editorial / topic content and the remaining service pages
  return { wave: '7', name: 'Content, topics and remaining service pages' };
}

const assigned = new Map();
for (const f of files) {
  const w = waveFor(f);
  if (assigned.has(f.file)) throw new Error('double assigned: ' + f.file);
  assigned.set(f.file, { ...f, ...w });
}

if (assigned.size !== files.length) throw new Error(`assigned ${assigned.size} of ${files.length}`);

const rows = [...assigned.values()].sort((a, b) => (a.wave === b.wave ? a.file.localeCompare(b.file) : String(a.wave).localeCompare(String(b.wave))));
const header = ['wave', 'wave_name', 'file', 'url', 'bytes', 'meta_robots'];
const cell = (v) => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v));
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/waves.csv',
  [header.join(',')].concat(rows.map((r) => [r.wave, r.name, r.file, r.url, r.bytes, r.robots].map(cell).join(','))).join('\n') + '\n');

const byWave = new Map();
for (const r of rows) {
  const k = String(r.wave);
  if (!byWave.has(k)) byWave.set(k, { name: r.name, files: [] });
  byWave.get(k).files.push(r.file);
}
console.log(`total files assigned: ${rows.length} (fingerprint pages: ${files.length})`);
for (const [k, v] of [...byWave].sort()) console.log(`  wave ${k.padEnd(4)} ${String(v.files.length).padStart(2)} files  ${v.name}`);
const sum = [...byWave.values()].reduce((a, v) => a + v.files.length, 0);
console.log(`sum of waves: ${sum} ${sum === files.length ? '== 93 OK' : '!! MISMATCH'}`);
