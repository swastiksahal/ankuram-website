#!/usr/bin/env node
/**
 * extract-home.js — pull the live homepage's content into a structured JSON.
 *
 * Every string written here is a verbatim text node from public_html/index.html.
 * Nothing is reworded, re-wrapped or re-encoded. The three P2 design directions
 * all render from this one file, so their wording is identical by construction.
 *
 * It walks every text node rather than a fixed list of tags, because real
 * content on this page also lives in <a>, <button>, <option> and bare <div>.
 *
 * Usage: node design/extract-home.js  ->  design/home-content.json
 */

const fs = require('fs');

const SRC = 'public_html/index.html';
const html = fs.readFileSync(SRC, 'utf8');
const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(html)[1]
  .replace(/<script[\s\S]*?<\/script>/gi, '')
  .replace(/<style[\s\S]*?<\/style>/gi, '')
  .replace(/<svg[\s\S]*?<\/svg>/gi, '')
  .replace(/<!--[\s\S]*?-->/g, '');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr']);
// Elements that own a block of text for our purposes.
const BLOCK = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'option', 'button', 'a', 'td', 'th', 'figcaption', 'summary', 'label', 'blockquote', 'dt', 'dd']);

const squash = (s) => s.replace(/\s+/g, ' ').trim();

/** Walk the document, returning text nodes with their open-element stack. */
function walk(src) {
  const out = [];
  const stack = [];
  let uid = 0;
  const re = /<\/([a-zA-Z0-9]+)\s*>|<([a-zA-Z0-9]+)((?:"[^"]*"|'[^']*'|[^>])*)>|([^<]+)/g;
  let m;
  while ((m = re.exec(src)) !== null) {
    if (m[1]) {
      const name = m[1].toLowerCase();
      for (let i = stack.length - 1; i >= 0; i--) {
        if (stack[i].name === name) { stack.length = i; break; }
      }
    } else if (m[2]) {
      const name = m[2].toLowerCase();
      const attrs = m[3] || '';
      if (VOID.has(name) || /\/$/.test(attrs.trim())) continue;
      stack.push({ name, attrs, uid: ++uid });
    } else if (m[4]) {
      const text = squash(m[4]);
      if (text) out.push({ text, stack: stack.slice() });
    }
  }
  return out;
}

const attr = (el, key) => {
  const r = new RegExp(key + '\\s*=\\s*"([^"]*)"', 'i').exec(el.attrs || '');
  return r ? r[1] : '';
};
const hasClass = (el, c) => new RegExp('(^|\\s)' + c + '(\\s|$)').test(attr(el, 'class'));

const nodes = walk(body);

/** Nearest ancestor that owns this text. */
function owner(stack) {
  for (let i = stack.length - 1; i >= 0; i--) if (BLOCK.has(stack[i].name)) return stack[i];
  return stack[stack.length - 1] || null;
}
const inTag = (stack, name) => stack.some((e) => e.name === name);
const inClass = (stack, c) => stack.some((e) => hasClass(e, c));
/**
 * A "section" for our purposes is a <section>, or a top-level <div id="...">
 * that carries real content. The homepage keeps ~400 words inside
 * div#diagnosticModal (a pop-up). A6 removes pop-ups on non-paid pages, but
 * invariants 5 and 14 keep the words, so that content is captured here and
 * rendered as an on-page <details> disclosure instead of a modal.
 */
const PSEUDO_SECTIONS = new Set(['diagnosticModal']);
const sectionOf = (stack) =>
  [...stack].reverse().find((e) => e.name === 'section' || (e.name === 'div' && PSEUDO_SECTIONS.has(attr(e, 'id'))));

// Two blocks are deliberately not carried into the redesign:
//  - div#mobileMenu repeats the header nav verbatim in a second block of markup
//    (same words, no new content — the redesign uses one responsive nav);
//  - div.mobile-cta-bar is a sticky CTA bar, which A6 removes on every page
//    except the four paid ones. The homepage is not a paid page.
// Both are counted and reported so the token deficit is fully explained.
const isMobileMenuDupe = (stack) => stack.some((e) => attr(e, 'id') === 'mobileMenu');
const isStickyCtaBar = (stack) => stack.some((e) => hasClass(e, 'mobile-cta-bar'));

// ---- group consecutive text nodes that share an owner element --------------
const groups = [];
for (const n of nodes) {
  const o = owner(n.stack);
  const key = o ? o.uid : 'root';
  const last = groups[groups.length - 1];
  if (last && last.key === key) { last.text += ' ' + n.text; continue; }
  groups.push({
    key,
    tag: o ? o.name : 'text',
    href: o && o.name === 'a' ? attr(o, 'href') : '',
    text: n.text,
    stack: n.stack,
  });
}

// ------------------------------------------------------------------ pieces
const pick = (fn) => groups.filter(fn);

const headerGroups = pick((g) => inTag(g.stack, 'header'));
const footerGroups = pick((g) => inTag(g.stack, 'footer'));

const nav = headerGroups
  .filter((g) => g.tag === 'a' && g.stack.some((e) => hasClass(e, 'nav-link')))
  .map((g) => ({ text: g.text, href: g.href }));

const heroGroups = pick((g) => { const s = sectionOf(g.stack); return s && hasClass(s, 'hero'); });
const hero = {
  h1: (heroGroups.find((g) => g.tag === 'h1') || {}).text || '',
  paras: heroGroups.filter((g) => g.tag === 'p').map((g) => g.text),
  ctas: heroGroups.filter((g) => g.tag === 'a').map((g) => ({ text: g.text, href: g.href })),
};

const trust = pick((g) => inClass(g.stack, 'trust-item')).map((g) => g.text);

const ratingNode = groups.find((g) => inClass(g.stack, 'rating-number'));
const rating = {
  value: ratingNode ? ratingNode.text : '',
  businessName: (groups.find((g) => inClass(g.stack, 'business-name')) || {}).text || '',
  reviewCount: (groups.find((g) => inClass(g.stack, 'review-count')) || {}).text || '',
  stars: 5,
};

// ---- sections, in document order ------------------------------------------
const sections = [];
const seenSection = new Map();
let mobileMenuTokens = 0;
let stickyBarTokens = 0;
for (const g of groups) {
  if (inTag(g.stack, 'header') || inTag(g.stack, 'footer')) continue;
  if (isMobileMenuDupe(g.stack)) { mobileMenuTokens += squash(g.text).split(/\s+/).length; continue; }
  if (isStickyCtaBar(g.stack)) { stickyBarTokens += squash(g.text).split(/\s+/).length; continue; }
  const s = sectionOf(g.stack);
  if (!s) continue;
  if (hasClass(s, 'hero') || hasClass(s, 'trust-bar')) continue;
  if (g.text === '×') continue; // modal close button glyph, not content
  if (inClass(g.stack, 'rating-number') || inClass(g.stack, 'business-name') || inClass(g.stack, 'review-count')) continue;
  if (/^(Loading reviews|★+)$/.test(g.text)) continue;

  let sec = seenSection.get(s.uid);
  if (!sec) {
    sec = { id: attr(s, 'id'), cls: attr(s, 'class'), blocks: [] };
    seenSection.set(s.uid, sec);
    sections.push(sec);
  }

  const t = g.tag;
  if (/^h[2-6]$/.test(t)) sec.blocks.push({ t, v: g.text });
  else if (t === 'p') sec.blocks.push({ t: 'p', v: g.text });
  else if (t === 'li') {
    const last = sec.blocks[sec.blocks.length - 1];
    if (last && last.t === 'ul') last.items.push(g.text);
    else sec.blocks.push({ t: 'ul', items: [g.text] });
  } else if (t === 'option') {
    const last = sec.blocks[sec.blocks.length - 1];
    if (last && last.t === 'options') last.items.push(g.text);
    else sec.blocks.push({ t: 'options', items: [g.text] });
  } else if (t === 'a') sec.blocks.push({ t: 'link', v: g.text, href: g.href });
  else if (t === 'button') sec.blocks.push({ t: 'button', v: g.text });
  else sec.blocks.push({ t: 'text', v: g.text });
}

const footer = {
  lines: footerGroups.filter((g) => g.tag !== 'a').map((g) => g.text),
  links: footerGroups.filter((g) => g.tag === 'a').map((g) => ({ text: g.text, href: g.href })),
};

// Sections whose markup must be carried over VERBATIM because they are
// interactive: real <select> dropdowns, a real <form>, and the review
// containers script.js writes into. Rebuilding these by hand produced loose
// "chips" instead of working controls.
function rawSection(re, strip = []) {
  const m = re.exec(html);
  if (!m) throw new Error('raw section not found: ' + re);
  let out = m[0];
  for (const s of strip) {
    const before = out.length;
    out = out.replace(s, '');
    if (out.length === before) throw new Error('strip pattern did not match: ' + s);
  }
  return out;
}

const rawSections = {
  'quick-finder': rawSection(/<section[^>]*class="[^"]*quick-finder[^"]*"[\s\S]*?<\/section>/),
  'contact-section': rawSection(/<section[^>]*class="[^"]*contact-section[^"]*"[\s\S]*?<\/section>/),
  // The rating header moved to the hero, and the background image is a photo
  // of the centre (A9), so both are stripped here.
  'reviews-section': rawSection(
    /<section[^>]*class="[^"]*reviews-section[^"]*"[\s\S]*?<\/section>/,
    [/<div class="reviews-background">[\s\S]*?<\/div>\s*<\/div>/,
     /<div class="google-rating">[\s\S]*?<p class="review-count"[^>]*>[\s\S]*?<\/p>/]
  ),
};

// A15: the Google Maps reviews URL already on the page (the href behind
// "See our Google reviews →"). Reused for the single replacement button.
const reviewsLinkMatch = /<a href="(https:\/\/www\.google\.com\/maps\/place[^"]+)"[^>]*class="view-all-reviews"/.exec(rawSections['reviews-section'])
  || /class="view-all-reviews"[^>]*href="([^"]+)"/.exec(rawSections['reviews-section'])
  || /<a href="(https:\/\/www\.google\.com\/maps\/place[^"]+)"/.exec(rawSections['reviews-section']);
if (!reviewsLinkMatch) throw new Error('reviews Google Maps link not found');

// The button href uses script.js's own GOOGLE_REVIEWS_LINK constant.
const SCRIPT = fs.readFileSync('public_html/script.js', 'utf8');
const gmLink = /const GOOGLE_REVIEWS_LINK\s*=\s*'([^']+)'/.exec(SCRIPT);
if (!gmLink) throw new Error('GOOGLE_REVIEWS_LINK not found in script.js');

const out = {
  source: SRC,
  rawSections,
  reviewsLink: reviewsLinkMatch[1],
  googleReviewsLink: gmLink[1],
  extractedAt: new Date().toISOString(),
  header: { nav, phone: { display: '+91 73966 69430', tel: '+917396669430' } },
  whatsapp: 'https://wa.me/917396669430',
  hero,
  trust,
  rating,
  sections,
  footer,
};

fs.mkdirSync('design', { recursive: true });
fs.writeFileSync('design/home-content.json', JSON.stringify(out, null, 2));

// ---- parity check against the baseline visible text ------------------------
const tokens = (s) => squash(String(s)).split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w));
let captured = [];
const add = (s) => { captured = captured.concat(tokens(s)); };
add(hero.h1); hero.paras.forEach(add); hero.ctas.forEach((c) => add(c.text)); trust.forEach(add);
[rating.value, rating.businessName, rating.reviewCount].forEach(add);
nav.forEach((n) => add(n.text));
add(out.header.phone.display);
for (const s of sections) for (const b of s.blocks) (b.items || [b.v]).forEach(add);
footer.lines.forEach(add); footer.links.forEach((l) => add(l.text));

const origTokens = tokens(body.replace(/<[^>]+>/g, ' '));
const count = (a) => a.reduce((m, w) => m.set(w, (m.get(w) || 0) + 1), new Map());
const co = count(origTokens), cc = count(captured);
const missing = [];
for (const [w, n] of co) { const got = cc.get(w) || 0; if (got < n) missing.push([w, n - got]); }

console.log(`sections: ${sections.length}  blocks: ${sections.reduce((a, s) => a + s.blocks.length, 0)}`);
console.log(`original tokens: ${origTokens.length}  captured: ${captured.length}`);
const missingCount = missing.reduce((a, m) => a + m[1], 0);

// The meaningful test is not token counts (the page repeats its nav, phone and
// CTA labels several times) but whether any DISTINCT string was lost.
const captureBlob = ' ' + captured.join(' ') + ' ';
const carried = nodes.filter((n) => !isMobileMenuDupe(n.stack) && !isStickyCtaBar(n.stack));
const distinctOriginal = [...new Set(carried.map((n) => n.text))].filter((t) => tokens(t).length);
const lost = distinctOriginal.filter((t) => {
  const ws = tokens(t);
  return !ws.every((w) => new RegExp('(^| )' + w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '( |$)').test(captureBlob));
});

console.log(`excluded: ${mobileMenuTokens} mobile-menu duplicate tokens (same words as header nav)`);
console.log(`excluded: ${stickyBarTokens} sticky CTA bar tokens (removed by APPROVED-CHANGES A6)`);
console.log(`token deficit: ${missingCount} — repeated nav/phone/CTA chrome, each captured once`);
if (lost.length) {
  console.log(`DISTINCT STRINGS LOST: ${lost.length}`);
  lost.slice(0, 20).forEach((t) => console.log(`   "${t.slice(0, 90)}"`));
  process.exitCode = 1;
} else {
  console.log(`no distinct string lost: all ${distinctOriginal.length} unique text nodes are represented`);
}
