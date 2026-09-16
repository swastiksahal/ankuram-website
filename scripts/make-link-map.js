#!/usr/bin/env node
/**
 * make-link-map.js — build docs/link-map.csv from baseline/broken-links.json.
 *
 * A proposal is only written if the replacement URL is verified to return a
 * final 200 in baseline/live-http.csv. Targets with no honest equivalent are
 * marked DECIDE rather than pointed at an unrelated page.
 *
 * Usage: node scripts/make-link-map.js
 */

const fs = require('fs');

const broken = JSON.parse(fs.readFileSync('baseline/broken-links.json', 'utf8'));

// final status per requested path, from the P0c sweep
const live = new Map();
for (const line of fs.readFileSync('baseline/live-http.csv', 'utf8').trim().split('\n').slice(1)) {
  const f = [];
  let cur = '', inQ = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (inQ) { if (c === '"' && line[i + 1] === '"') { cur += '"'; i++; } else if (c === '"') inQ = false; else cur += c; }
    else if (c === '"') inQ = true;
    else if (c === ',') { f.push(cur); cur = ''; }
    else cur += c;
  }
  f.push(cur);
  live.set(f[0], { first: f[1], final: f[3] });
}

const serves200 = (u) => {
  const hit = live.get(u);
  return hit && hit.final === '200' && hit.first === '200';
};

const DECIDE = 'DECIDE';

// target -> [replacement, reason]
const MAP = {
  '/online-tuition.html': ['/online-maths-tuition', 'Anchor "Learn More About Online Tuition"; nearest live general online-tuition page'],
  '/areas/jubilee-hills': ['/', 'Anchor "Jubilee Hills"; no areas/ page for the home locality, homepage is the Jubilee Hills hub'],
  '/about.html': ['/about/', 'Same page, current path'],
  '/contact.html': ['/contact/', 'Same page, current path'],
  '/curricula.html': ['/cbse-icse-igcse-ib-tuition-hyderabad', 'Anchor "Curricula"; this is the all-boards page'],
  '/online-classes.html': ['/online-maths-tuition', 'Anchor "Online Classes"; nearest live online page'],
  '/cbse': ['/best-cbse-tuition-centre', 'Anchor "CBSE"; the live CBSE landing page'],
  '/chemistry': ['/class-12-maths-physics-chemistry-tuition-hyderabad', 'Anchor "Chemistry"; only live page covering chemistry'],
  '/ib': ['/ib-tuition-hyderabad', 'Anchor "IB (MYP & DP)"; the IB hub page'],
  '/icse': ['/icse-tuition-hyderabad', 'Anchor "ICSE"; the ICSE page'],
  '/igcse': ['/igcse-tuition-jubilee-hills', 'Anchor "IGCSE & A-Levels"; the IGCSE page'],
  '/maths': ['/maths-tuition-jubilee-hills', 'Anchor "Mathematics"; the maths hub page'],
  '/physics': ['/physics-tuition-hyderabad', 'Anchor "Physics"; the physics page'],
  '/topics/class-11': ['/class-11-tuition/', 'Anchor "Class 11"; the live class-11 page'],
  '/topics/physics': ['/physics-tuition-hyderabad', 'Anchor "Physics"; no topics/physics index exists'],
  '/approach': ['/how-we-teach', 'Anchor "Approach"; how-we-teach is the method page'],
  '/programmes': ['/cbse-icse-igcse-ib-tuition-hyderabad', 'Anchor "Programmes"; the all-boards offer page'],
  '/topics/vectors': ['/topics/vectors-class-11-physics/', 'Anchor "Vectors"; the live vectors topic page'],

  // No honest equivalent exists. Pointing these at an unrelated page would be
  // worse than the 404: it sends a reader who clicked "Practice Sheet 1" to a
  // sales page. Swastik decides: remove the link, or write the page.
  '/notes': [DECIDE, 'Anchor "Study Notes"; no notes section exists. Remove link or create page'],
  '/practice': [DECIDE, 'Anchor "Practice Sheets"; no practice section exists. Remove link or create page'],
  '/resources': [DECIDE, 'Anchor "Resources"; no resources section exists. Remove link or create page'],
  '/topics/motion-in-a-plane-class-11-physics': [DECIDE, 'Related-topic link to an unwritten article. Remove link or write it'],
  '/topics/newtons-laws-class-11-physics': [DECIDE, 'Related-topic link to an unwritten article. Remove link or write it'],
  '/topics/projectile-motion-class-11-physics': [DECIDE, 'Related-topic link to an unwritten article. Remove link or write it'],
  '/topics/work-energy-power-class-11-physics': [DECIDE, 'Related-topic link to an unwritten article. Remove link or write it'],
  '/topics/vectors-lecture-2-components/': [DECIDE, 'Anchor "Next: Components & Unit Vectors"; lecture 2 not written. Remove link or write it'],
  '/topics/vectors-lecture-3-addition/': [DECIDE, 'Anchor labelled "Coming soon"; lecture 3 not written. Remove link or write it'],
  '/topics/vectors-practice-1/': [DECIDE, 'Anchor "Practice Sheet 1"; sheet not written. Remove link or write it'],
};

const rows = [];
const unverified = [];

for (const b of broken) {
  const entry = MAP[b.target];
  if (!entry) { unverified.push(`${b.target}: NO MAPPING`); continue; }
  const [repl, reason] = entry;
  let verified = 'n/a';
  if (repl !== DECIDE) {
    if (!serves200(repl)) { unverified.push(`${b.target} -> ${repl}: NOT VERIFIED 200`); verified = 'FAIL'; }
    else verified = '200';
  }
  rows.push({
    broken_target: b.target,
    pages_linking: b.fromPages,
    example_pages: b.examples.join(' '),
    proposed_replacement: repl,
    replacement_live_status: verified,
    reason,
  });
}

const header = ['broken_target', 'pages_linking', 'example_pages', 'proposed_replacement', 'replacement_live_status', 'reason'];
const cell = (v) => (/[",\n]/.test(String(v)) ? '"' + String(v).replace(/"/g, '""') + '"' : String(v));
fs.mkdirSync('docs', { recursive: true });
fs.writeFileSync('docs/link-map.csv', [header.join(',')].concat(rows.map((r) => header.map((h) => cell(r[h])).join(','))).join('\n') + '\n');

const decide = rows.filter((r) => r.proposed_replacement === DECIDE).length;
console.log(`link-map.csv: ${rows.length} rows (broken targets: ${broken.length})`);
console.log(`  mapped to a verified 200: ${rows.length - decide}`);
console.log(`  needs a decision: ${decide}`);
if (unverified.length) { console.log('PROBLEMS:'); unverified.forEach((u) => console.log('  ' + u)); process.exitCode = 1; }
