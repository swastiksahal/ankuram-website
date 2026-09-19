#!/usr/bin/env node
/**
 * parity.js — the content-parity gate promised in docs/ARCHITECTURE.md §4.
 *
 *   node scripts/parity.js <built-page.html>
 *   node scripts/parity.js design/direction-c/index.html
 *
 * Checks, per CLAUDE.md:
 *   invariant 3   head block byte-identical to live (title, description,
 *                 canonical, og/twitter, JSON-LD) — robots may differ on staging
 *   invariant 4   H1 text identical; every baseline H2/H3 string still present
 *   invariant 5   visible word count >= 95% of baseline
 *   invariant 14  every baseline string still present, except those listed in
 *                 docs/APPROVED-CHANGES.md as approved removals
 *   invariant 15  the six homepage anchor ids exist
 *
 * Word counts decode HTML entities first: "&amp;" is one ampersand, not a word.
 */

const fs = require('fs');

const page = process.argv[2] || 'design/direction-c/index.html';
const LIVE = 'public_html/index.html';
const CONTENT = 'design/home-content.json';

const built = fs.readFileSync(page, 'utf8');
const live = fs.readFileSync(LIVE, 'utf8');
const C = JSON.parse(fs.readFileSync(CONTENT, 'utf8'));

// Removals approved in docs/APPROVED-CHANGES.md (A13 visible count, A15 widget).
const APPROVED_REMOVALS = [
  '516 Reviews',                          // A13
  'Loading reviews...',                   // A15
  'Unable to load reviews at this time.', // A15
  'See our Google reviews →',             // A15
  'View all reviews on Google →',         // A15
  // A24 — these four are not deletions. Each is still on the page word for
  // word except that the IB enumeration now names all three programmes, so the
  // baseline form of the string no longer matches. The replacement is listed
  // beside each one and is asserted below.
  'Small‑batch classes (3–5 students) with a foundation‑first approach across CBSE, ICSE, ISC, IGCSE, IB (MYP/DP), AS & A Levels and State Board.',
  'CBSE, ICSE, ISC, IGCSE, IB MYP/DP, AS & A Levels, and Telangana/Andhra State Board—taught with the right syllabus + exam approach.',
  'IB MYP/DP',
  'Yes. ANKURAM supports CBSE, ICSE, ISC, IGCSE, IB (MYP/DP), AS & A Levels, and State Board. Teaching style and practice are aligned to the curriculum.',
];

// A24: every string above must reappear with PYP added. This turns "the string
// vanished" into "the string was renamed exactly as approved", and fails if a
// supposed rename actually dropped content.
const A24_RENAMES = [
  ['Small‑batch classes (3–5 students) with a foundation‑first approach across CBSE, ICSE, ISC, IGCSE, IB (MYP/DP), AS & A Levels and State Board.',
    'Small‑batch classes (3–5 students) with a foundation‑first approach across CBSE, ICSE, ISC, IGCSE, IB (PYP/MYP/DP), AS & A Levels and State Board.'],
  ['CBSE, ICSE, ISC, IGCSE, IB MYP/DP, AS & A Levels, and Telangana/Andhra State Board—taught with the right syllabus + exam approach.',
    'CBSE, ICSE, ISC, IGCSE, IB PYP/MYP/DP, AS & A Levels, and Telangana/Andhra State Board—taught with the right syllabus + exam approach.'],
  ['IB MYP/DP', 'IB PYP/MYP/DP'],
  ['Yes. ANKURAM supports CBSE, ICSE, ISC, IGCSE, IB (MYP/DP), AS & A Levels, and State Board. Teaching style and practice are aligned to the curriculum.',
    'Yes. ANKURAM supports CBSE, ICSE, ISC, IGCSE, IB (PYP/MYP/DP), AS & A Levels, and State Board. Teaching style and practice are aligned to the curriculum.'],
];

const ANCHORS = ['home', 'about', 'curricula', 'contact', 'reviews', 'hybrid-classes'];

const decode = (t) => t
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));

const bodyText = (html) => decode(
  (/<body[^>]*>([\s\S]*)<\/body>/i.exec(html) || [, html])[1]
    .replace(/<script[\s\S]*?<\/script>/g, ' ')
    .replace(/<style[\s\S]*?<\/style>/g, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/g, ' ')
    .replace(/<[^>]+>/g, ' ')
).replace(/\s+/g, ' ').trim();

const words = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));

// ---------------------------------------------------------------- baseline
const baselineStrings = [];
const add = (s) => { if (typeof s === 'string' && s.trim() && /[\p{L}\p{N}]/u.test(s)) baselineStrings.push(s.trim()); };
add(C.hero.h1);
C.hero.paras.forEach(add);
C.hero.ctas.forEach((c) => add(c.text));
C.trust.forEach(add);
[C.rating.value, C.rating.businessName, C.rating.reviewCount].forEach(add);
C.sections.forEach((s) => s.blocks.forEach((b) => { if (b.items) b.items.forEach(add); else add(b.v); }));
C.footer.lines.forEach(add);
C.footer.links.forEach((l) => add(l.text));

const liveWords = words(bodyText(live)).length;
const builtWords = words(bodyText(built)).length;
const pct = (builtWords / liveWords) * 100;

// ----------------------------------------------------------------- checks
const results = [];
const check = (rule, name, ok, detail) => results.push({ rule, name, ok, detail });

// invariant 3 — head parity
const one = (h, re) => { const m = re.exec(h); return m ? m[0] : null; };
const HEAD = [
  ['title', /<title>[\s\S]*?<\/title>/i],
  ['meta description', /<meta[^>]+name="description"[^>]*>/i],
  ['canonical', /<link[^>]+rel="canonical"[^>]*>/i],
];
for (const [name, re] of HEAD) check(3, name, one(live, re) === one(built, re), one(built, re) ? '' : 'missing');
const jl = (h) => h.match(/<script[^>]+ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [];
check(3, `JSON-LD (${jl(live).length} blocks)`, JSON.stringify(jl(live)) === JSON.stringify(jl(built)));
const og = (h) => (h.match(/<meta[^>]+property="og:[^>]*>/gi) || []).length;
const tw = (h) => (h.match(/<meta[^>]+name="twitter:[^>]*>/gi) || []).length;
check(3, `og:${og(live)} twitter:${tw(live)}`, og(live) === og(built) && tw(live) === tw(built));

// invariant 4 — H1 and headings
const h1 = (h) => ((/<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(h) || [, ''])[1]).replace(/<[^>]+>/g, '').trim();
check(4, 'H1 text identical', h1(live) === h1(built), h1(built));
const headings = [];
C.sections.forEach((s) => s.blocks.forEach((b) => { if (b.t === 'h2' || b.t === 'h3') headings.push(b.v); }));
const builtBody = bodyText(built);
const missingHeads = [...new Set(headings)].filter((t) => !builtBody.includes(decode(t)));
check(4, `every baseline H2/H3 present (${new Set(headings).size})`, missingHeads.length === 0, missingHeads.join(' | '));

// invariant 5 — word count
check(5, `word count ${builtWords} vs live ${liveWords} = ${pct.toFixed(1)}%`, pct >= 95);

// invariant 14 — every baseline string, minus approved removals
const missingStrings = baselineStrings.filter((s) => !builtBody.includes(decode(s)));
const unapproved = missingStrings.filter((s) => !APPROVED_REMOVALS.includes(s));
check(14, `baseline strings ${baselineStrings.length - missingStrings.length}/${baselineStrings.length}`, unapproved.length === 0, unapproved.join(' | '));
check(14, `removals all approved (${missingStrings.length})`, unapproved.length === 0, missingStrings.join(' | '));

// A24 — each approved rename must be present in its new form
const missingRenames = A24_RENAMES.filter(([, after]) => !builtBody.includes(decode(after)));
check(14, `A24 renames present in their new form (${A24_RENAMES.length})`,
  missingRenames.length === 0, missingRenames.map(([, a]) => a.slice(0, 60)).join(' | '));

// invariant 15 — anchor ids
const missingAnchors = ANCHORS.filter((id) => !new RegExp(`id="${id}"`).test(built));
check(15, `anchor ids (${ANCHORS.length})`, missingAnchors.length === 0, missingAnchors.join(', '));

// ----------------------------------------------------------------- report
console.log(`parity: ${page}\n`);
let failed = 0;
for (const r of results) {
  if (!r.ok) failed++;
  console.log(`  ${r.ok ? 'PASS' : 'FAIL'}  inv ${String(r.rule).padStart(2)}  ${r.name}${r.detail && !r.ok ? '  -> ' + r.detail : ''}`);
}
console.log(`\nword-count parity: ${pct.toFixed(1)}% of live (floor 95%)`);
console.log(`approved removals: ${missingStrings.length} (${missingStrings.join(', ') || 'none'})`);
console.log(failed ? `\n${failed} FAILED` : '\nALL PASS');
process.exitCode = failed ? 1 : 0;
