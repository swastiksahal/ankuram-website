#!/usr/bin/env node
/**
 * build-c-final.js — final Direction C homepage.
 *
 * Content still comes verbatim from design/home-content.json. The only wording
 * changes are the ones APPROVED-CHANGES allows:
 *   A9  — no photograph of the centre anywhere (C already carried none)
 *   A10 — four diagram captions and one loop label, exact strings below
 *
 * Usage: node design/build-c-final.js
 */

const fs = require('fs');
const path = require('path');

const C = JSON.parse(fs.readFileSync('design/home-content.json', 'utf8'));
const esc = (s) => String(s).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ---------------------------------------------------------------- A10 text
const STEPS = [
  { title: 'Diagnostic Test', caption: "A test on last year's topics shows exactly where your child stands." },
  { title: 'Gaps in foundational knowledge', caption: 'Swastik solves every question and marks the exact gaps behind each mistake.' },
  { title: 'Foundation-First Learning', caption: 'Weak basics are re-taught first, then the current syllabus is built on top.' },
  { title: 'improve marks and confidence', caption: 'Regular practice and tests in small batches of 3–5, until the topic holds.' },
];
const LOOP_LABEL = 'Tested again — any gap found is fixed again.';
const DIAGRAM_ARIA =
  'How we teach, in four steps: Diagnostic Test, then Gaps in foundational knowledge, then Foundation-First Learning, then improve marks and confidence. Step four loops back to step two.';

// ------------------------------------------------------------------- icons
// Small, single-stroke, currentColor. Decorative: the step title next to each
// icon carries the meaning, so each icon is aria-hidden.
const ICONS = {
  testPaper: `<svg viewBox="0 0 32 32" class="ic" aria-hidden="true" focusable="false">
    <rect x="7" y="4" width="18" height="24" rx="2"/>
    <line x1="11" y1="11" x2="21" y2="11"/><line x1="11" y1="16" x2="21" y2="16"/><line x1="11" y1="21" x2="17" y2="21"/></svg>`,
  magnifierGap: `<svg viewBox="0 0 32 32" class="ic" aria-hidden="true" focusable="false">
    <line x1="4" y1="24" x2="11" y2="24"/><line x1="21" y1="24" x2="28" y2="24" stroke-dasharray="3 3"/>
    <circle cx="16" cy="13" r="7"/><line x1="21.2" y1="18.2" x2="26" y2="23"/></svg>`,
  blocks: `<svg viewBox="0 0 32 32" class="ic" aria-hidden="true" focusable="false">
    <rect x="5" y="19" width="9" height="8" rx="1"/><rect x="17" y="19" width="9" height="8" rx="1"/>
    <rect x="11" y="9" width="9" height="8" rx="1"/></svg>`,
  examTick: `<svg viewBox="0 0 32 32" class="ic" aria-hidden="true" focusable="false">
    <rect x="6" y="4" width="17" height="24" rx="2"/>
    <line x1="10" y1="11" x2="19" y2="11"/><line x1="10" y1="15" x2="16" y2="15"/>
    <polyline points="12,21 15.5,24.5 23,16"/></svg>`,
};
const ICON_ORDER = ['testPaper', 'magnifierGap', 'blocks', 'examTick'];

const ARROW_RIGHT = `<svg viewBox="0 0 24 16" class="arw arw-h" aria-hidden="true" focusable="false"><line x1="1" y1="8" x2="19" y2="8"/><polyline points="14,3 20,8 14,13"/></svg>`;
const ARROW_DOWN = `<svg viewBox="0 0 16 24" class="arw arw-v" aria-hidden="true" focusable="false"><line x1="8" y1="1" x2="8" y2="19"/><polyline points="3,14 8,20 13,14"/></svg>`;

function methodDiagram() {
  const cards = STEPS.map((s, i) => `
      <li class="ms-step${i === 3 ? ' ms-step-final' : ''}">
        <div class="ms-head">
          <span class="ms-num" aria-hidden="true">${i + 1}</span>
          ${ICONS[ICON_ORDER[i]]}
        </div>
        <p class="ms-title${i === 3 ? ' ms-title-cap' : ''}">${esc(s.title)}</p>
        <p class="ms-caption">${esc(s.caption)}</p>
      </li>`).join(`
      <li class="ms-arrow" aria-hidden="true">${ARROW_RIGHT}${ARROW_DOWN}</li>`);

  return `
<figure class="method" role="group" aria-label="${esc(DIAGRAM_ARIA)}">
  <ol class="ms-flow">
    ${cards}
  </ol>
  <div class="ms-loop">
    <svg class="ms-loop-line ms-loop-h" viewBox="0 0 800 46" preserveAspectRatio="none" role="img" aria-label="${esc(DIAGRAM_ARIA)}">
      <path d="M770 2 L770 30 Q770 40 758 40 L222 40 Q210 40 210 30 L210 10" />
      <polyline points="204,16 210,6 216,16" />
    </svg>
    <svg class="ms-loop-line ms-loop-v" viewBox="0 0 48 300" preserveAspectRatio="none" role="img" aria-label="${esc(DIAGRAM_ARIA)}">
      <path d="M40 292 L40 286 Q40 278 30 278 L14 278 Q4 278 4 268 L4 97 Q4 87 14 87 L30 87" />
      <polyline points="24,81 34,87 24,93" />
    </svg>
    <p class="ms-loop-label">${esc(LOOP_LABEL)}</p>
  </div>
</figure>`;
}

// ---------------------------------------------------------------- structure
const BARE_NUM = /^\d{1,2}$/;
const STEP_LABEL = /^Step \d+$/;
/** Text that is decoration, not content: separators and standalone emoji. */
const isDecoration = (v) => {
  const t = String(v).trim();
  if (!t) return true;
  return !/[\p{L}\p{N}]/u.test(t);
};

function tree(blocks, topLevel) {
  const out = [];
  let cur = null;
  let pendingNum = null;
  let pendingLabel = null;
  for (const b of blocks) {
    if ((b.t === 'text' || b.t === 'p') && typeof b.v === 'string') {
      const t = b.v.trim();
      // "Step 1" sits before the card it belongs to, not after the previous one.
      if (STEP_LABEL.test(t)) { pendingLabel = t; continue; }
      if (BARE_NUM.test(t)) { pendingNum = t; continue; }
      if (isDecoration(t)) continue; // stray "+" separators and emoji
    }
    const deeper = /^h([2-6])$/.exec(b.t);
    if (b.t === topLevel) {
      cur = { head: b.v, num: pendingNum, label: pendingLabel, body: [], subs: [] };
      pendingNum = null; pendingLabel = null; out.push(cur); continue;
    }
    if (!cur) { out.push({ head: null, num: null, label: null, body: [b], subs: [] }); continue; }
    if (deeper && Number(deeper[1]) > Number(topLevel[1])) {
      cur.subs.push({ head: b.v, level: b.t, label: pendingLabel, num: pendingNum, body: [] });
      pendingLabel = null; pendingNum = null;
    } else {
      const lastSub = cur.subs[cur.subs.length - 1];
      (lastSub ? lastSub.body : cur.body).push(b);
    }
  }
  // A numeral or label with no heading after it still belongs to the page.
  if (pendingNum || pendingLabel) out.push({ head: null, num: pendingNum, label: pendingLabel, body: [], subs: [] });
  return out;
}

const renderBody = (blocks) =>
  blocks.map((b) => {
    if (b.t === 'p' || b.t === 'text') return isDecoration(b.v) ? '' : `<p>${esc(b.v)}</p>`;
    if (b.t === 'ul') return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (b.t === 'options') return `<ul class="opts">${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
    if (b.t === 'link') return `<p><a class="inline-link" href="${esc(b.href || '#')}">${esc(b.v)}</a></p>`;
    if (b.t === 'button') return `<p><span class="pseudo-btn">${esc(b.v)}</span></p>`;
    return '';
  }).join('\n');

const stepLabel = (n) => (n.label ? `<span class="step-label">${esc(n.label)}</span>` : '');
const numEl = (n) => (n.num ? `<span class="num">${esc(n.num)}</span>` : '');

const renderSubs = (n) =>
  (n.subs || []).map((sub) => `<article class="sub-card">${stepLabel(sub)}${numEl(sub)}<h4>${esc(sub.head)}</h4>${renderBody(sub.body)}</article>`).join('');

// ------------------------------------------------------------- layout kit
const L = {
  cards: (t) => `<div class="cards">${t.map((n) => `<article class="card">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</article>`).join('')}</div>`,
  numbered: (t) => {
    const own = t.some((n) => n.num);
    return `<ol class="numbered${own ? ' own-nums' : ''}">${t.map((n) => `<li>${numEl(n)}<div>${stepLabel(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div></li>`).join('')}</ol>`;
  },
  rows: (t) => `<div class="rows">${t.map((n) => `<article class="row">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}<div class="row-body">${renderBody(n.body)}${renderSubs(n)}</div></article>`).join('')}</div>`,
  table: (t) => {
    const intro = t.filter((n) => !n.head).map((n) => `${renderBody(n.body)}${renderSubs(n)}`).join('');
    const headed = t.filter((n) => n.head);
    const body = headed.map((n) => `<tr><th scope="row">${numEl(n)}${esc(n.head)}</th><td>${renderBody(n.body)}${renderSubs(n)}</td></tr>`).join('');
    return `${intro ? `<div class="intro">${intro}</div>` : ''}${headed.length ? `<div class="table-wrap"><table class="deftable"><tbody>${body}</tbody></table></div>` : ''}`;
  },
  details: (t) => `<div class="accordion">${t.map((n) => n.head
    ? `<details><summary>${esc(n.head)}</summary><div class="acc-body">${renderBody(n.body)}${renderSubs(n)}</div></details>`
    : `<div class="acc-plain">${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
  regions: (t) => `<div class="regions">${t.map((n) => `<section class="region">${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}<div class="region-grid">${n.subs.map((s) => `<article class="area">${stepLabel(s)}${numEl(s)}<h4>${esc(s.head)}</h4>${renderBody(s.body)}</article>`).join('')}</div></section>`).join('')}</div>`,
  prose: (t) => `<div class="prose">${t.map((n) => `${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${n.subs.map((s) => `<h4>${esc(s.head)}</h4>${renderBody(s.body)}`).join('')}`).join('')}</div>`,
  panel: (t) => `<div class="panel">${t.map((n) => `<div class="panel-item">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
};

const PLAN = ['numbered', 'cards', 'regions', 'table', 'numbered', 'panel', 'rows', 'cards', 'prose', 'panel', 'cards', 'details', 'rows'];
for (let i = 1; i < PLAN.length; i++) if (PLAN[i] === PLAN[i - 1]) throw new Error(`sections ${i} and ${i + 1} share layout`);

function renderSections() {
  return C.sections.map((sec, i) => {
    const h2 = (sec.blocks.find((b) => b.t === 'h2') || {}).v || '';
    const rest = sec.blocks.filter((b) => b.t !== 'h2');
    const top = rest.some((b) => b.t === 'h3') ? 'h3' : rest.some((b) => b.t === 'h4') ? 'h4' : null;
    const t = top ? tree(rest, top) : [{ head: null, num: null, label: null, body: rest.filter((b) => !(typeof b.v === 'string' && isDecoration(b.v))), subs: [] }];
    return `
<section class="sec sec-${PLAN[i]}" id="${esc(sec.id || 'sec-' + (i + 1))}">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    ${L[PLAN[i]](t)}
  </div>
</section>`;
  }).join('\n');
}

const TRACKING = `<script async src="https://www.googletagmanager.com/gtag/js?id=G-MQRSS8DKLE"></script>
<script>
  window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}
  gtag('js',new Date());
  gtag('config','G-MQRSS8DKLE');
  gtag('config','AW-10954184691');
  document.addEventListener('click',function(e){
    var a=e.target.closest&&e.target.closest('a');if(!a)return;
    if(a.href.indexOf('wa.me')>-1)gtag('event','conversion',{send_to:'AW-10954184691/jucWCNPv3OAbEPOvruco'});
    else if(a.href.indexOf('tel:')===0)gtag('event','conversion',{send_to:'AW-10954184691/NGIFCNbv3OAbEPOvruco'});
  });
</script>`;

const navLinks = C.header.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.text)}</a>`).join('');

const page = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Diagram-led — Ankuram homepage direction C (final)</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="../../css/site.css">
${TRACKING}
</head>
<body class="v2">
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">ANKURAM</a>
    <div class="header-cta">
      <a class="hcta hcta-wa" href="${esc(C.whatsapp)}">WhatsApp</a>
      <a class="hcta hcta-tel" href="tel:${esc(C.header.phone.tel)}">${esc(C.header.phone.display)}</a>
    </div>
    <nav class="nav nav-desktop" aria-label="Main">${navLinks}</nav>
    <details class="nav-mobile">
      <summary>Menu</summary>
      <nav class="nav-mobile-list" aria-label="Main">${navLinks}</nav>
    </details>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="wrap hero-inner">
      <div class="hero-text">
        <h1>${esc(C.hero.h1)}</h1>
        ${C.hero.paras.map((p, i) => `<p class="${i === 0 ? 'lede' : i === C.hero.paras.length - 1 ? 'curricula-line' : ''}">${esc(p)}</p>`).join('')}
        <div class="hero-ctas">${C.hero.ctas.map((c, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(c.href)}">${esc(c.text)}</a>`).join('')}</div>
        <div class="rating" aria-label="Rating ${esc(C.rating.value)} out of 5">
          <span class="rating-num">${esc(C.rating.value)}</span>
          <span class="rating-stars" aria-hidden="true">${'★'.repeat(C.rating.stars)}</span>
          <span class="rating-meta"><span class="rc">${esc(C.rating.reviewCount)}</span><span class="bn">${esc(C.rating.businessName)}</span></span>
        </div>
        <ul class="trust">${C.trust.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      ${methodDiagram()}
    </div>
  </section>

${renderSections()}

  <section class="cta-band">
    <div class="wrap">
      <h2>${esc(C.hero.ctas[0].text)}</h2>
      <p>${esc(C.hero.paras[0])}</p>
      <div class="cta-row">
        <a class="btn btn-primary" href="${esc(C.whatsapp)}">WhatsApp</a>
        <a class="btn btn-ghost" href="tel:${esc(C.header.phone.tel)}">${esc(C.header.phone.display)}</a>
      </div>
    </div>
  </section>
</main>

<footer class="site-footer">
  <div class="wrap">
    ${C.footer.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
    <nav class="footer-links" aria-label="Footer">${C.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join('')}</nav>
  </div>
</footer>
</body>
</html>
`;

fs.mkdirSync('design/direction-c', { recursive: true });
fs.writeFileSync('design/direction-c/index.html', page);

// ----------------------------------------------------------------- checks
const bodyText = /<body[^>]*>([\s\S]*)<\/body>/i.exec(page)[1]
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
const wc = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// Word-count check, explained rather than guessed. Compare against the P2
// Direction C page and account for every added word.
const P2_WORDS = 3258;
const a10 = wc(STEPS.map((s) => s.caption).concat(LOOP_LABEL).join(' '));
const titles = wc(STEPS.map((s) => s.title).join(' '));   // now real HTML text, not SVG
const numerals = STEPS.length;                            // the 1..4 badges
const navDupe = wc(C.header.nav.map((n) => n.text).join(' ')) + 1; // mobile menu copy + "Menu"
const expected = P2_WORDS + a10 + titles + numerals + navDupe;
const actual = wc(bodyText);

console.log(`words: P2 ${P2_WORDS} + A10 ${a10} + diagram titles ${titles} + numerals ${numerals} + mobile-nav copy ${navDupe} = ${expected}`);
console.log(`visible words: ${actual}  ${actual === expected ? 'OK — every added word accounted for' : `MISMATCH by ${actual - expected}`}`);
if (/\bnull\b|\bundefined\b/.test(bodyText)) { console.log('null/undefined leaked'); process.exitCode = 1; }
if (/<img\b/i.test(page)) { console.log('A9 VIOLATION: an <img> is present'); process.exitCode = 1; }
else console.log('A9: no <img> on the page');
if (actual !== expected) process.exitCode = 1;
console.log(`html ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB`);
