#!/usr/bin/env node
/**
 * fingerprint.js — SEO baseline fingerprinter for a static site folder.
 *
 * Usage:  node scripts/fingerprint.js <folder> [output.json]
 * Example: node scripts/fingerprint.js public_html baseline/seo-fingerprint.json
 *
 * No network. No dependencies. Re-runnable on any folder, so a rebuilt site
 * can be diffed against this baseline field by field.
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

// ---------------------------------------------------------------- utilities

function walk(dir, base, out) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === '.git' || entry.name === 'node_modules') continue;
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, base, out);
    else if (entry.isFile() && entry.name.toLowerCase().endsWith('.html')) {
      out.push(path.relative(base, full));
    }
  }
  return out;
}

const ENTITIES = {
  amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ',
  rsquo: '’', lsquo: '‘', rdquo: '”', ldquo: '“',
  ndash: '–', mdash: '—', hellip: '…', middot: '·',
  times: '×', deg: '°', eacute: 'é', copy: '©',
};

function decodeEntities(s) {
  return s
    .replace(/&#x([0-9a-fA-F]+);/g, (_, h) => String.fromCodePoint(parseInt(h, 16)))
    .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(parseInt(d, 10)))
    .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => (n in ENTITIES ? ENTITIES[n] : m));
}

const norm = (s) => decodeEntities(String(s)).replace(/\s+/g, ' ').trim();
const sha = (s) => crypto.createHash('sha256').update(s, 'utf8').digest('hex').slice(0, 16);

/** Parse an HTML attribute list into a plain object (lowercased keys). */
function attrs(tag) {
  const out = {};
  const re = /([a-zA-Z_:][-a-zA-Z0-9_:.]*)\s*=\s*("([^"]*)"|'([^']*)'|([^\s"'>]+))/g;
  let m;
  while ((m = re.exec(tag)) !== null) {
    out[m[1].toLowerCase()] = m[3] !== undefined ? m[3] : m[4] !== undefined ? m[4] : m[5];
  }
  return out;
}

/** All <tag ...>inner</tag> pairs for a given tag name. */
function elements(html, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b([^>]*)>([\\s\\S]*?)<\\/${name}\\s*>`, 'gi');
  let m;
  while ((m = re.exec(html)) !== null) out.push({ attrs: attrs(m[1]), inner: m[2], raw: m[0] });
  return out;
}

/** All self-closing / void tags for a given name. */
function voidTags(html, name) {
  const out = [];
  const re = new RegExp(`<${name}\\b([^>]*)>`, 'gi');
  let m;
  while ((m = re.exec(html)) !== null) out.push(attrs(m[1]));
  return out;
}

/** Strip tags and non-visible regions, then count words. */
function visibleText(html) {
  let body = html;
  const bm = /<body\b[^>]*>([\s\S]*?)<\/body\s*>/i.exec(html);
  if (bm) body = bm[1];
  return norm(
    body
      .replace(/<!--[\s\S]*?-->/g, ' ')
      .replace(/<script\b[\s\S]*?<\/script\s*>/gi, ' ')
      .replace(/<style\b[\s\S]*?<\/style\s*>/gi, ' ')
      .replace(/<noscript\b[\s\S]*?<\/noscript\s*>/gi, ' ')
      .replace(/<svg\b[\s\S]*?<\/svg\s*>/gi, ' ')
      .replace(/<template\b[\s\S]*?<\/template\s*>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
  );
}

const wordCount = (t) => (t ? t.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length : 0);

// ------------------------------------------------------------ URL derivation

function urlForFile(rel) {
  const p = rel.split(path.sep).join('/');
  if (p === 'index.html') return '/';
  if (p.endsWith('/index.html')) return '/' + p.slice(0, -'index.html'.length);
  return '/' + p.replace(/\.html$/, '');
}

/**
 * Parse active (uncommented) RewriteRule lines out of an .htaccess file.
 * Returns [{ pattern, target, flags, regex, line }].
 */
function parseRewrites(htaccessPath) {
  if (!fs.existsSync(htaccessPath)) return [];
  const rules = [];
  const lines = fs.readFileSync(htaccessPath, 'utf8').split(/\r?\n/);
  // RewriteCond lines bind to the NEXT RewriteRule. A rule guarded by conditions
  // (host/HTTPS/filesystem tests) cannot be resolved from the filesystem alone, so
  // we record its conditions and never treat it as an unconditional redirect.
  let pending = [];
  lines.forEach((raw, i) => {
    const line = raw.trim();
    if (!line || line.startsWith('#')) return;
    if (/^RewriteCond\s/i.test(line)) { pending.push(line); return; }
    const m = /^RewriteRule\s+(\S+)\s+(\S+)(?:\s+\[([^\]]*)\])?/i.exec(line);
    if (!m) { if (/^Rewrite/i.test(line)) pending = []; return; }
    let regex = null;
    try { regex = new RegExp(m[1]); } catch { /* unparseable pattern */ }
    rules.push({
      pattern: m[1],
      target: m[2],
      flags: m[3] || '',
      regex,
      line: i + 1,
      conditions: pending,
      conditional: pending.length > 0,
    });
    pending = [];
  });
  return rules;
}

/**
 * First UNCONDITIONAL redirecting rule (R=30x) whose pattern matches this path.
 * Conditional rules (domain normalisation, trailing-slash removal) are skipped:
 * they depend on request host/filesystem state, not on the path alone, and
 * treating them as matches would mark every URL as redirected.
 */
function redirectFor(url, rules) {
  const p = url.replace(/^\//, '');
  for (const r of rules) {
    if (!r.regex || r.conditional || !/R=30\d/i.test(r.flags)) continue;
    if (r.regex.test(p)) return `${r.pattern} -> ${r.target} [${r.flags}]`;
  }
  return '';
}

// ------------------------------------------------------------- tracking bits

const TRACKING_PATTERNS = {
  ga4: /\bG-[A-Z0-9]{6,12}\b/g,
  aw: /\bAW-\d{9,12}\b/g,
  gtm: /\bGTM-[A-Z0-9]{5,9}\b/g,
  ua: /\bUA-\d{4,10}-\d{1,4}\b/g,
  conversionLabel: /AW-\d{9,12}\/[A-Za-z0-9_-]+/g,
  clarity: /clarity["'\s,(\[]+["']([a-z0-9]{8,12})["']/gi,
};

function trackingFor(html) {
  const uniq = (a) => [...new Set(a)].sort();
  const grab = (re) => uniq(html.match(re) || []);

  const clarity = [];
  // Standard Clarity loader: (c,l,a,r,i,t,y) ... "clarity", "script", "<id>"
  const clarityRe = /clarity["']?\s*,\s*["']script["']\s*,\s*["']([a-z0-9]+)["']/gi;
  let m;
  while ((m = clarityRe.exec(html)) !== null) clarity.push(m[1]);
  const cdn = /clarity\.ms\/tag\/([a-z0-9]+)/gi;
  while ((m = cdn.exec(html)) !== null) clarity.push(m[1]);

  const labels = html.match(TRACKING_PATTERNS.conversionLabel) || [];

  // Hash each script block that carries tracking, so a rebuild can prove the
  // snippet was copied verbatim rather than retyped.
  const snippetHashes = {};
  for (const el of elements(html, 'script')) {
    const body = el.inner;
    if (!/gtag|dataLayer|clarity|googletagmanager|gtag\/js/i.test(body + JSON.stringify(el.attrs))) continue;
    const key = el.attrs.src ? `src:${el.attrs.src}` : `inline:${sha(norm(body))}`;
    snippetHashes[key] = sha(body.trim());
  }

  return {
    ga4: grab(TRACKING_PATTERNS.ga4),
    aw: grab(TRACKING_PATTERNS.aw),
    gtm: grab(TRACKING_PATTERNS.gtm),
    ua: grab(TRACKING_PATTERNS.ua),
    conversionLabels: uniq(labels),
    clarity: uniq(clarity),
    snippetHashes,
    hasGtagJs: /googletagmanager\.com\/gtag\/js/i.test(html),
    hasGtmLoader: /googletagmanager\.com\/gtm\.js/i.test(html),
  };
}

// ------------------------------------------------------------------ per page

function fingerprintFile(root, rel, rules) {
  const abs = path.join(root, rel);
  const raw = fs.readFileSync(abs);
  const html = raw.toString('utf8');
  const url = urlForFile(rel);

  const metas = voidTags(html, 'meta');
  const meta = (name) => {
    const hit = metas.find((a) => (a.name || '').toLowerCase() === name);
    return hit ? norm(hit.content || '') : null;
  };
  const prop = (p) => {
    const hit = metas.find((a) => (a.property || '').toLowerCase() === p);
    return hit ? norm(hit.content || '') : null;
  };

  const og = {};
  const tw = {};
  for (const a of metas) {
    const p = (a.property || '').toLowerCase();
    const n = (a.name || '').toLowerCase();
    if (p.startsWith('og:')) og[p] = norm(a.content || '');
    if (n.startsWith('og:')) og[n] = norm(a.content || '');
    if (p.startsWith('twitter:')) tw[p] = norm(a.content || '');
    if (n.startsWith('twitter:')) tw[n] = norm(a.content || '');
  }

  const links = voidTags(html, 'link');
  const canonical = links.find((a) => (a.rel || '').toLowerCase() === 'canonical');
  const hreflang = links
    .filter((a) => a.hreflang)
    .map((a) => ({ hreflang: a.hreflang, href: a.href || '' }));

  const titleEl = elements(html, 'title')[0];
  const heads = (n) => elements(html, n).map((e) => norm(e.inner.replace(/<[^>]+>/g, ' '))).filter(Boolean);

  const internal = new Set();
  const external = new Set();
  for (const a of voidTags(html, 'a')) {
    const href = (a.href || '').trim();
    if (!href || href.startsWith('#')) continue;
    if (/^(mailto:|tel:|javascript:)/i.test(href)) { external.add(href); continue; }
    if (/^https?:\/\//i.test(href)) {
      if (/^https?:\/\/(www\.)?ankuramtuition\.com/i.test(href)) internal.add(href);
      else external.add(href);
    } else internal.add(href);
  }

  const images = voidTags(html, 'img').map((a) => ({
    src: a.src || a['data-src'] || '',
    alt: a.alt === undefined ? null : a.alt, // null = attribute absent (a11y defect)
    loading: a.loading || null,
    width: a.width || null,
    height: a.height || null,
  }));

  const jsonLd = elements(html, 'script')
    .filter((e) => /application\/ld\+json/i.test(e.attrs.type || ''))
    .map((e) => e.inner.trim());

  const text = visibleText(html);

  return {
    file: rel.split(path.sep).join('/'),
    url,
    redirectRule: redirectFor(url, rules),
    bytes: raw.length,
    title: titleEl ? norm(titleEl.inner) : null,
    titleHash: titleEl ? sha(norm(titleEl.inner)) : null,
    metaDescription: meta('description'),
    metaRobots: meta('robots'),
    canonical: canonical ? (canonical.href || '') : null,
    hreflang,
    h1: heads('h1'),
    h2: heads('h2'),
    h3: heads('h3'),
    visibleWordCount: wordCount(text),
    visibleTextHash: sha(text),
    internalHrefs: [...internal].sort(),
    externalHrefs: [...external].sort(),
    jsonLd,
    jsonLdHashes: jsonLd.map((j) => sha(norm(j))),
    og,
    twitter: tw,
    images,
    imagesMissingAlt: images.filter((i) => i.alt === null || i.alt === '').length,
    tracking: trackingFor(html),
  };
}

// ---------------------------------------------------------------------- main

function main() {
  const root = process.argv[2];
  const outPath = process.argv[3] || 'seo-fingerprint.json';
  if (!root || !fs.existsSync(root)) {
    console.error('usage: node scripts/fingerprint.js <folder> [output.json]');
    process.exit(2);
  }

  const rules = parseRewrites(path.join(root, '.htaccess'));
  const files = walk(root, root, []).sort();
  const pages = files.map((f) => fingerprintFile(root, f, rules));

  const result = {
    generatedAt: new Date().toISOString(),
    root: path.resolve(root),
    pageCount: pages.length,
    activeRewriteRules: rules.length,
    pages,
  };

  fs.mkdirSync(path.dirname(path.resolve(outPath)), { recursive: true });
  fs.writeFileSync(outPath, JSON.stringify(result, null, 2));
  console.log(`fingerprinted ${pages.length} pages from ${root} -> ${outPath}`);
}

if (require.main === module) main();

module.exports = { fingerprintFile, urlForFile, parseRewrites, walk, visibleText, wordCount, norm };
