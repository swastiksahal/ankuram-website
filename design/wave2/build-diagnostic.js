#!/usr/bin/env node
/**
 * build-diagnostic.js — /diagnostic-assessment, the wave 2 template proof.
 *
 *   node design/wave2/build-diagnostic.js
 *
 * Content comes verbatim from design/wave2/diagnostic.json, which was extracted
 * from the live page by a text-node walker. No wording is retyped here.
 * The head is copied whole from the live page: title, description, canonical,
 * robots, og, twitter and all three JSON-LD blocks, byte for byte.
 */
const fs = require('fs');
const path = require('path');
const B = require('./blocks');

const esc = B.esc;
const M = JSON.parse(fs.readFileSync('design/wave2/diagnostic.json', 'utf8'));

// ------------------------------------------------- group the flat block list
// Every h2 opens a section; h3s inside it open cards. Text keeps its order.
const sections = [];
let sec = null;
let card = null;
for (const b of M.blocks) {
  if (b.t === 'h1') continue;                       // the hero owns the H1
  if (b.t === 'h2') { sec = { head: b.v, intro: [], cards: [] }; card = null; sections.push(sec); continue; }
  if (!sec) { (sections.preamble = sections.preamble || []).push(b); continue; }
  if (b.t === 'h3') { card = { head: b.v, body: [] }; sec.cards.push(card); continue; }
  (card ? card.body : sec.intro).push(b);
}

const h1 = M.blocks.find((b) => b.t === 'h1').v;
const preamble = (sections.preamble || []).filter((b) => b.t === 'p' || b.t === 'text');

// The hero takes the H1 and the paragraphs that preceded the first H2.
const heroPreamble = preamble;   // rendered below, CTA links included

// The FAQ section becomes the shared accordion block.
const FAQ_HEAD = 'Frequently Asked Questions';
const faqSection = sections.find((s) => s.head === FAQ_HEAD);
if (!faqSection) throw new Error('no FAQ section found');
const faqItems = faqSection.cards.map((c) => ({ q: c.head, a: c.body.map((b) => b.runs || [{ text: b.v }]) }));

// Inline runs keep their <a>. Invariant 6: every internal link on the live page
// must still exist on the rebuilt one, and these sit inside paragraph text.
const inline = (b) => (b.runs || [{ text: b.v }])
  .map((r) => (r.href ? `<a href="${esc(r.href)}">${esc(r.text)}</a>` : esc(r.text)))
  .join(' ');
const isCta = (b) => b.runs && b.runs.length === 1 && b.runs[0].href
  && /^(https:\/\/wa\.me|tel:)/.test(b.runs[0].href)
  && b.runs[0].text.trim() === b.v.trim();
const body = (blocks) => {
  const out = [];
  let i = 0;
  while (i < blocks.length) {
    const b = blocks[i];
    if (b.t === 'li') { i++; continue; }
    if (isCta(b)) {
      // consecutive CTA links become one button row, same words, no new ones
      const run = [];
      while (i < blocks.length && blocks[i].t !== 'li' && isCta(blocks[i])) run.push(blocks[i++]);
      out.push(`<div class="hero-ctas">${run.map((x, k) => `<a class="btn ${k === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(x.runs[0].href)}">${esc(x.runs[0].text)}</a>`).join('')}</div>`);
      continue;
    }
    out.push(`<p>${inline(b)}</p>`);
    i++;
  }
  return out.join('');
};
const listOf = (blocks) => {
  const items = blocks.filter((b) => b.t === 'li');
  return items.length ? `<ul class="w2-list">${items.map((b) => `<li>${inline(b)}</li>`).join('')}</ul>` : '';
};

function renderSection(s) {
  if (s.head === FAQ_HEAD) {
    return `<section class="w2-sec" aria-labelledby="faq-head">
  <div class="wrap">
    <h2 id="faq-head">${esc(s.head)}</h2>
    ${faq(faqItems)}
  </div>
</section>`;
  }
  const intro = `${body(s.intro)}${listOf(s.intro)}`;
  const cards = s.cards.length
    ? `<div class="w2-cards">${s.cards.map((c) => `
      <article class="w2-card">
        <h3>${esc(c.head)}</h3>
        ${body(c.body)}${listOf(c.body)}
      </article>`).join('')}</div>`
    : '';
  return `<section class="w2-sec">
  <div class="wrap">
    <h2>${esc(s.head)}</h2>
    ${intro ? `<div class="w2-prose">${intro}</div>` : ''}
    ${cards}
  </div>
</section>`;
}
const faq = B.faq;

// ------------------------------------------------------------------ the page
const OUT = 'build/wave2/diagnostic-assessment';
const CSS_V = require('crypto').createHash('sha256').update(fs.readFileSync('css/site.css')).digest('hex').slice(0, 8);
const WA_V = require('crypto').createHash('sha256').update(fs.readFileSync('js/contact-whatsapp.js')).digest('hex').slice(0, 8);

const STAGING = process.env.WAVE2_PRODUCTION !== '1';
const robots = STAGING
  ? '<!-- STAGING ONLY: the live page is "index, follow". Staging must never be indexed. -->\n<meta name="robots" content="noindex, nofollow">'
  : M.head.robots;

const page = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${M.head.title}
${M.head.description}
${M.head.canonical}
${robots}
${M.head.og.join('\n')}
${M.head.twitter.join('\n')}
<link rel="stylesheet" href="../../css/site.css?v=${CSS_V}">
<script defer src="../../js/contact-whatsapp.js?v=${WA_V}"></script>
${M.head.jsonld.join('\n')}
</head>
<body class="v2 w2">
${B.skipLink()}
${B.header({ base: '/' })}
<main id="main">
${B.hero({ h1, html: body(heroPreamble) })}
${sections.map(renderSection).join('\n')}
</main>
${B.footer({ base: '/' })}
</body>
</html>`;

fs.mkdirSync(OUT, { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), page);

// --------------------------------------------------------------- self-checks
const dec = (t) => t.replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&copy;/g, '©').replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const visible = dec(/<body[^>]*>([\s\S]*)<\/body>/i.exec(page)[1]
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const words = visible.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

const count = (re) => (page.match(re) || []).length;
console.log(`built ${OUT}/index.html  ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB`);
console.log(`  head copied from live: title, description, canonical, ${M.head.og.length} og, ${M.head.twitter.length} twitter, ${M.head.jsonld.length} JSON-LD`);
console.log(`  A23: css/site.css?v=${CSS_V}   js/contact-whatsapp.js?v=${WA_V}`);
console.log(`  headings: h1 ${count(/<h1\b/g)}, h2 ${count(/<h2\b/g)}, h3 ${count(/<h3\b/g)}`);
console.log(`  sections ${sections.length}, FAQ items ${faqItems.length}, visible words ${words}`);
if (count(/<h1\b/g) !== 1) throw new Error('expected exactly one H1');
if (/<img\b/i.test(page)) throw new Error('A9: an <img> is present');
// every new selector this page relies on must be .w2-scoped or already .v2
if (!/<body class="v2 w2">/.test(page)) throw new Error('body must carry both v2 and w2');
