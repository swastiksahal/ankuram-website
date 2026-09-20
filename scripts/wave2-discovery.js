#!/usr/bin/env node
/**
 * wave2-discovery.js — READ ONLY. Inventory of the wave 2 pages before any
 * rebuild, per the roadmap in CLAUDE.md.
 *
 * The column that matters most is the last one. A19 lost Microsoft Clarity and
 * A21 lost four inline tracking functions, both because the rebuild carried
 * markup over verbatim and left the inline <script> behind. So every function
 * defined in an inline <script> AND every function called from an on* attribute
 * is listed per page, before anything is rebuilt.
 *
 *   node scripts/wave2-discovery.js
 */
const fs = require('fs');

const PAGES = [
  ['/about/', 'public_html/about/index.html'],
  ['/contact/', 'public_html/contact/index.html'],
  ['/how-we-teach', 'public_html/how-we-teach.html'],
  ['/diagnostic-assessment', 'public_html/diagnostic-assessment.html'],
  ['/hybrid-tuition-hyderabad', 'public_html/hybrid-tuition-hyderabad.html'],
  ['/home-tuition-hyderabad', 'public_html/home-tuition-hyderabad.html'],
  ['/home-tutor-hyderabad/', 'public_html/home-tutor-hyderabad/index.html'],
  ['/privacy-policy/', 'public_html/privacy-policy/index.html'],
  ['/terms/', 'public_html/terms/index.html'],
  ['/thank-you', 'public_html/thank-you.html'],
];

const fp = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json', 'utf8')).pages;
const gsc = fs.readFileSync('baseline/gsc-tiers.csv', 'utf8').trim().split('\n').slice(1)
  .map((l) => l.split(',')).reduce((m, [u, t, c, i]) => (m[u] = { tier: t, clicks: +c, impr: +i }, m), {});

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', hellip: '…' };
const dec = (t) => String(t).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => (n in ENT ? ENT[n] : m));
const txt = (h) => dec(h.replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();

// homepage blocks, by the marker that identifies each in the source
const HOME_BLOCKS = [
  ['header + nav', /<header[^>]*class="[^"]*site-header|class="nav-mobile"|<nav\b/i],
  ['hero', /class="hero\b|class="hero-inner|id="home"/i],
  ['quick finder', /id="finder-grade"|id="checkAvailability"/i],
  ['rating / reviews strip', /class="rating|4\.8|reviewsCarousel|class="reviews/i],
  ['curricula chips', /class="curr-chip|class="curricula/i],
  ['board cards', /class="board-card|class="boards\b/i],
  ['method / how we teach diagram', /class="method|class="cycle\b|howWeTeach/i],
  ['FAQ accordion', /class="faq|faq-question|itemtype="[^"]*FAQPage/i],
  ['contact form', /id="contactForm"/i],
  ['CTA band', /class="cta-band|Book Diagnostic Test/i],
  ['footer', /<footer\b|class="footer\b/i],
  ['areas list', /\/areas\//i],
];

const rows = [];
for (const [url, file] of PAGES) {
  if (!fs.existsSync(file)) { console.log(`MISSING FILE ${file}`); continue; }
  const html = fs.readFileSync(file, 'utf8');
  const e = fp.find((p) => p.url === url) || fp.find((p) => p.url === url.replace(/\/$/, ''));
  const g = gsc[url] || gsc[url.replace(/\/$/, '')] || null;

  // inline <script> blocks that are not JSON-LD and have no src
  const inline = [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)]
    .filter((m) => !/\bsrc=/i.test(m[1]) && !/ld\+json/i.test(m[1]))
    .map((m) => m[2]);
  const defined = new Set();
  for (const blk of inline) {
    for (const d of blk.matchAll(/function\s+([A-Za-z_$][\w$]*)\s*\(/g)) defined.add(d[1]);
    for (const d of blk.matchAll(/(?:window\.)?([A-Za-z_$][\w$]*)\s*=\s*function\b/g)) defined.add(d[1]);
  }
  const called = new Set();
  for (const m of html.matchAll(/\son[a-z]+\s*=\s*"([^"]*)"/gi)) {
    for (const c of m[1].matchAll(/([A-Za-z_$][\w$]*)\s*\(/g)) called.add(c[1]);
  }
  const BUILTIN = new Set(['alert', 'confirm', 'parseInt', 'parseFloat', 'String', 'Number', 'return', 'if', 'typeof', 'this']);
  const calledReal = [...called].filter((n) => !BUILTIN.has(n));
  // the ones that would break if the inline script were dropped
  const atRisk = calledReal.filter((n) => defined.has(n));
  const externallyDefined = calledReal.filter((n) => !defined.has(n));

  const tracking = {
    ga4: [...new Set((html.match(/G-[A-Z0-9]{8,}/g) || []))],
    ads: [...new Set((html.match(/AW-\d{9,}/g) || []))],
    clarity: [...new Set((html.match(/clarity\.ms\/tag\/(\w+)/g) || []).map((x) => x.split('/').pop()))],
    labels: [...new Set((html.match(/AW-\d+\/[\w-]+/g) || []))],
    gtm: [...new Set((html.match(/GTM-[A-Z0-9]+/g) || []))],
  };

  const blocks = HOME_BLOCKS.filter(([, re]) => re.test(html)).map(([n]) => n);

  const h2 = e ? e.h2 : [];
  const h3 = e ? e.h3 : [];

  rows.push({
    url, file,
    tier: g ? g.tier : '—', clicks: g ? g.clicks : 0, impr: g ? g.impr : 0,
    words: e ? e.visibleWordCount : null,
    h1: e ? e.h1 : [],
    h2, h3,
    canonical: e ? e.canonical : null,
    robots: e ? e.metaRobots : null,
    jsonLd: e ? e.jsonLd.length : 0,
    title: e ? e.title : null,
    blocks, tracking,
    inlineScripts: inline.length,
    defined: [...defined].sort(),
    called: calledReal.sort(),
    atRisk: atRisk.sort(),
    externallyDefined: externallyDefined.sort(),
    bytes: html.length,
  });
}

fs.writeFileSync('docs/wave2-discovery.json', JSON.stringify(rows, null, 2));

// ------------------------------------------------------------------ per page
for (const r of rows) {
  console.log(`\n${'='.repeat(78)}\n${r.url}    ${r.file}`);
  console.log(`  GSC: tier ${r.tier}, ${r.clicks} clicks, ${r.impr} impressions (3 months)`);
  console.log(`  words: ${r.words}    bytes: ${r.bytes}    JSON-LD blocks: ${r.jsonLd}`);
  console.log(`  title: ${r.title}`);
  console.log(`  canonical: ${r.canonical || '*** MISSING ***'}    robots: ${r.robots || '(none)'}`);
  console.log(`  H1 (${r.h1.length}): ${r.h1.map((x) => JSON.stringify(x)).join(' | ') || '*** NONE ***'}`);
  console.log(`  H2 (${r.h2.length}):`);
  r.h2.forEach((x) => console.log(`      ${x}`));
  console.log(`  H3 (${r.h3.length}):`);
  r.h3.forEach((x) => console.log(`      ${x}`));
  console.log(`  tracking: GA4 ${JSON.stringify(r.tracking.ga4)}  Ads ${JSON.stringify(r.tracking.ads)}  Clarity ${JSON.stringify(r.tracking.clarity)}  GTM ${JSON.stringify(r.tracking.gtm)}`);
  console.log(`            conversion labels ${JSON.stringify(r.tracking.labels)}`);
  console.log(`  homepage blocks it could reuse (${r.blocks.length}): ${r.blocks.join(', ') || 'none'}`);
  console.log(`  INLINE SCRIPTS: ${r.inlineScripts}`);
  console.log(`    functions defined inline (${r.defined.length}): ${r.defined.join(', ') || 'none'}`);
  console.log(`    functions called from on* (${r.called.length}): ${r.called.join(', ') || 'none'}`);
  console.log(`    AT RISK — called from on* AND defined only inline (${r.atRisk.length}): ${r.atRisk.join(', ') || 'none'}`);
  if (r.externallyDefined.length) console.log(`    called but not defined inline (external/script.js): ${r.externallyDefined.join(', ')}`);
}
console.log(`\n\nwrote docs/wave2-discovery.json (${rows.length} pages)`);
