#!/usr/bin/env node
/**
 * audit.js — P0b baseline audit. Consumes the fingerprint JSON plus the raw
 * folder (sitemap.xml, .htaccess, stray files) and emits:
 *
 *   baseline/url-inventory.csv
 *   baseline/audit-data.json   (mismatches, junk, tracking, NAP — feeds the report)
 *
 * Usage: node scripts/audit.js <folder> <fingerprint.json> <outdir>
 * No network.
 */

const fs = require('fs');
const path = require('path');
const { parseRewrites } = require('./fingerprint.js');

const root = process.argv[2] || 'public_html';
const fpPath = process.argv[3] || 'baseline/seo-fingerprint.json';
const outDir = process.argv[4] || 'baseline';

const fp = JSON.parse(fs.readFileSync(fpPath, 'utf8'));
const rules = parseRewrites(path.join(root, '.htaccess'));

// ------------------------------------------------------------------ sitemap

function sitemapUrls(file) {
  if (!fs.existsSync(file)) return [];
  const xml = fs.readFileSync(file, 'utf8');
  return (xml.match(/<loc>([^<]+)<\/loc>/g) || []).map((s) =>
    s.replace(/<\/?loc>/g, '').trim()
  );
}

const SITE = 'https://ankuramtuition.com';
const toPath = (u) => u.replace(/^https?:\/\/(www\.)?ankuramtuition\.com/i, '') || '/';

const smRaw = sitemapUrls(path.join(root, 'sitemap.xml'));
const smPaths = smRaw.map(toPath);
const smSet = new Set(smPaths);
// A sitemap entry and a file URL can differ only by trailing slash; index both ways.
const loose = (p) => (p.length > 1 ? p.replace(/\/$/, '') : p);
const smLoose = new Set(smPaths.map(loose));

const nestedSitemap = sitemapUrls(path.join(root, 'class-8-maths', 'sitemap.xml'));

// --------------------------------------------------------------- inventory

const byUrl = new Map();
for (const p of fp.pages) byUrl.set(loose(p.url), p);

const rows = fp.pages.map((p) => ({
  url: p.url,
  source_file: p.file,
  in_sitemap: smSet.has(p.url) || smLoose.has(loose(p.url)) ? 'yes' : 'no',
  meta_robots: p.metaRobots || '',
  canonical: p.canonical || '',
  http_redirect_rule_if_any: p.redirectRule || '',
}));

// Sitemap URLs with no backing file.
const orphanSitemap = smPaths.filter((u) => !byUrl.has(loose(u)));
// Add them to the inventory so the CSV is a complete list of public URLs.
for (const u of orphanSitemap) {
  rows.push({
    url: u,
    source_file: '(none — sitemap only)',
    in_sitemap: 'yes',
    meta_robots: '',
    canonical: '',
    http_redirect_rule_if_any: '',
  });
}

/**
 * Turn a RewriteRule pattern into the plain URL path a visitor would type.
 * Anchors, optional groups and backslash escapes are regex syntax, not part of
 * the path — leaving them in produced rows like `/index(\.html)?` that are not
 * real URLs and 404 when tested.
 */
function patternToPath(pattern) {
  let p = pattern.replace(/^\^/, '').replace(/\$$/, '');
  p = p.replace(/\([^()]*\)\?/g, ''); // optional group: (\.html)? -> ''
  p = p.replace(/\/\?$/, ''); // optional trailing slash
  p = p.replace(/\\(.)/g, '$1'); // unescape \. \- etc
  return '/' + p;
}

const REGEX_METACHARS = /[\\^$()[\]{}|*+?]/;

// Redirect-only URLs declared in .htaccess (they are public URLs too).
const redirectRows = rules
  .filter((r) => /R=30\d/i.test(r.flags) && !r.conditional)
  .map((r) => ({
    url: patternToPath(r.pattern),
    source_file: '(redirect only — .htaccess line ' + r.line + ')',
    in_sitemap: 'no',
    meta_robots: '',
    canonical: '',
    http_redirect_rule_if_any: `${r.pattern} -> ${r.target} [${r.flags}]`,
  }));

const allRows = [...rows, ...redirectRows];

// Guard: no row may carry regex syntax into the inventory.
const malformed = allRows.filter((r) => REGEX_METACHARS.test(r.url));
if (malformed.length) {
  console.error('MALFORMED URL ROWS:', malformed.map((r) => r.url).join(', '));
  process.exitCode = 1;
}

function csvCell(v) {
  const s = String(v == null ? '' : v);
  return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
}
const header = ['url', 'source_file', 'in_sitemap', 'meta_robots', 'canonical', 'http_redirect_rule_if_any'];
const csv = [header.join(',')]
  .concat(allRows.map((r) => header.map((h) => csvCell(r[h])).join(',')))
  .join('\n') + '\n';

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'url-inventory.csv'), csv);

// HTML files not in the sitemap.
const notInSitemap = fp.pages
  .filter((p) => !(smSet.has(p.url) || smLoose.has(loose(p.url))))
  .map((p) => ({ file: p.file, url: p.url, robots: p.metaRobots || '(none)', redirect: p.redirectRule || '' }));

// Pages that are in the sitemap AND redirected away by .htaccess (contradiction).
const sitemapButRedirected = fp.pages
  .filter((p) => (smSet.has(p.url) || smLoose.has(loose(p.url))) && p.redirectRule)
  .map((p) => ({ file: p.file, url: p.url, redirect: p.redirectRule }));

// Pages in the sitemap that are noindex (contradiction).
const sitemapButNoindex = fp.pages
  .filter((p) => (smSet.has(p.url) || smLoose.has(loose(p.url))) && /noindex/i.test(p.metaRobots || ''))
  .map((p) => ({ file: p.file, url: p.url, robots: p.metaRobots }));

// ------------------------------------------------------------------- junk

const JUNK_RE = /(\.bak|\.bak\d|\.orig|\.old|\.save|~)$|\.bak[-.\d]|\bcopy\b|\(\d+\)|\.tmp$/i;
function walkAll(dir, base, out) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) walkAll(full, base, out);
    else out.push(path.relative(base, full).split(path.sep).join('/'));
  }
  return out;
}
const allFiles = walkAll(root, root, []).sort();
const junk = allFiles
  .filter((f) => JUNK_RE.test(f) || /\.zip$/i.test(f) || /\.txt$/i.test(path.basename(f)) && /index\.txt$/.test(f))
  .map((f) => ({ file: f, bytes: fs.statSync(path.join(root, f)).size }));

// Directories that hold no .html at all (stray asset folders are fine; flagged for review).
const htmlDirs = new Set(fp.pages.map((p) => path.posix.dirname(p.file)));
const allDirs = [...new Set(allFiles.map((f) => path.posix.dirname(f)))].filter((d) => d !== '.');
const dirsWithoutHtml = allDirs.filter((d) => ![...htmlDirs].some((h) => h === d || h.startsWith(d + '/')));

// --------------------------------------------------------------- tracking

function tally(getter) {
  const m = new Map();
  for (const p of fp.pages) {
    for (const v of getter(p)) {
      if (!m.has(v)) m.set(v, []);
      m.get(v).push(p.file);
    }
  }
  return [...m.entries()]
    .map(([id, files]) => ({ id, pages: files.length, files }))
    .sort((a, b) => b.pages - a.pages);
}

const tracking = {
  ga4: tally((p) => p.tracking.ga4),
  aw: tally((p) => p.tracking.aw),
  gtm: tally((p) => p.tracking.gtm),
  ua: tally((p) => p.tracking.ua),
  clarity: tally((p) => p.tracking.clarity),
  conversionLabels: tally((p) => p.tracking.conversionLabels),
};

const noTracking = fp.pages
  .filter((p) => p.tracking.ga4.length === 0 && p.tracking.aw.length === 0 && p.tracking.gtm.length === 0)
  .map((p) => ({ file: p.file, url: p.url, clarity: p.tracking.clarity }));

const majorityGa4 = tracking.ga4[0] ? tracking.ga4[0].id : null;
const oddGa4 = fp.pages
  .filter((p) => p.tracking.ga4.length && !p.tracking.ga4.includes(majorityGa4))
  .map((p) => ({ file: p.file, ids: p.tracking.ga4 }));
const multiGa4 = fp.pages
  .filter((p) => p.tracking.ga4.length > 1)
  .map((p) => ({ file: p.file, ids: p.tracking.ga4 }));

const noClarity = fp.pages.filter((p) => p.tracking.clarity.length === 0).map((p) => p.file);

// -------------------------------------------------------------------- NAP

const rawByFile = new Map();
for (const p of fp.pages) rawByFile.set(p.file, fs.readFileSync(path.join(root, p.file), 'utf8'));

const NAP_PATTERNS = {
  phone: /(?:\+91[\s\-]?)?(?:73966[\s\-]?69430|7396669430|73966 69430)|\+?91[\s\-]?\d{5}[\s\-]?\d{5}/g,
  telHref: /tel:\+?[0-9\s\-]{8,}/g,
  whatsapp: /(?:wa\.me|api\.whatsapp\.com[^"']*?phone=)\/?(\+?\d{8,})/g,
  postcode: /\b5000\d{2}\b/g,
  plot: /Plot\s*(?:No\.?\s*)?\d+[^,<]{0,40}/gi,
  road: /Road\s*(?:No\.?|Number)?\s*\d+[^,<]{0,20}/gi,
  latlong: /(?:latitude|longitude)["'\s:]+(-?\d{1,3}\.\d{3,})/gi,
  geoCoords: /\b(17\.\d{4,})\s*,\s*(78\.\d{4,})\b/g,
};

function napTally(re, transform) {
  const m = new Map();
  for (const [file, html] of rawByFile) {
    const hits = html.match(re) || [];
    for (const h0 of hits) {
      const h = (transform ? transform(h0) : h0).replace(/\s+/g, ' ').trim();
      if (!h) continue;
      if (!m.has(h)) m.set(h, new Set());
      m.get(h).add(file);
    }
  }
  return [...m.entries()]
    .map(([variant, files]) => ({ variant, pages: files.size, files: [...files].sort() }))
    .sort((a, b) => b.pages - a.pages);
}

const nap = {
  phone: napTally(/\+?91[\s\-.]?\(?\d{4,5}\)?[\s\-.]?\d{5,6}|\b73966[\s\-]?69430\b/g),
  telHref: napTally(/tel:[+0-9\s\-().]{8,}/g),
  whatsappNumbers: napTally(/(?:wa\.me\/|phone=)(\+?\d{10,})/g),
  postcode: napTally(/\b5\d{5}\b/g),
  plot: napTally(/Plot\s*(?:No\.?\s*)?[\d\-/]+/gi),
  road: napTally(/Road\s*(?:No\.?|Number)?\s*[\d\-/]+/gi),
  latlong: napTally(/["']?(?:latitude|longitude)["']?\s*[:=]\s*["']?(-?\d{1,3}\.\d{2,})/gi),
  geoPair: napTally(/\b1[67]\.\d{3,}\s*,\s*7[89]\.\d{3,}\b/g),
  businessName: napTally(/Ankuram\s+Tuition\s+Cent(?:re|er)/gi),
  locality: napTally(/Prashasan\s+Nagar|Jubilee\s+Hills|Hyderabad,?\s*Telangana/gi),
};

// ------------------------------------------------------------------ output

const data = {
  generatedAt: new Date().toISOString(),
  counts: {
    filesTotal: allFiles.length,
    htmlPages: fp.pages.length,
    sitemapUrls: smPaths.length,
    nestedSitemapUrls: nestedSitemap.length,
    activeRewriteRules: rules.length,
    redirectRules: rules.filter((r) => /R=30\d/i.test(r.flags) && !r.conditional).length,
    inventoryRows: allRows.length,
  },
  orphanSitemap,
  notInSitemap,
  sitemapButRedirected,
  sitemapButNoindex,
  nestedSitemap,
  junk,
  dirsWithoutHtml,
  tracking,
  noTracking,
  oddGa4,
  multiGa4,
  noClarity,
  nap,
};

fs.writeFileSync(path.join(outDir, 'audit-data.json'), JSON.stringify(data, null, 2));
console.log(`inventory rows: ${allRows.length}`);
console.log(`sitemap urls: ${smPaths.length}, html pages: ${fp.pages.length}`);
console.log(`orphan sitemap urls: ${orphanSitemap.length}, html not in sitemap: ${notInSitemap.length}`);
console.log(`junk files: ${junk.length}`);
