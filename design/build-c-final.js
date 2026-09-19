#!/usr/bin/env node
/**
 * build-c-final.js — the staging homepage (Direction C, finalised).
 *
 * Content comes verbatim from design/home-content.json. The head block
 * (title, description, canonical, og/twitter, JSON-LD) is copied byte-for-byte
 * out of the LIVE public_html/index.html, so those never drift.
 *
 * Approved wording changes only:
 *   A9  — no photograph of the centre anywhere
 *   A10 — four method-diagram captions and one loop label
 *   A11 — the "How a week works" section title and the D1/D2/D3 diagram text
 *
 * Usage: node design/build-c-final.js
 */

const fs = require('fs');

const C = JSON.parse(fs.readFileSync('design/home-content.json', 'utf8'));
const esc = (s) => String(s).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// ===================================================== head, copied from live
const LIVE = fs.readFileSync('public_html/index.html', 'utf8');
const LIVE_HEAD = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(LIVE)[1];
const one = (re) => { const m = re.exec(LIVE_HEAD); return m ? m[0] : ''; };
const many = (re) => LIVE_HEAD.match(re) || [];

// A19: Microsoft Clarity was dropped by the first rebuild because the head was
// copied field by field and Clarity had no rule. It is lifted out of the live
// head verbatim — never retyped, never reformatted, ID never touched.
const clarityBlocks = (LIVE_HEAD.match(/<script\b[\s\S]*?<\/script>/gi) || [])
  .filter((s) => s.includes('uir8kpny76'));
if (clarityBlocks.length !== 1) {
  throw new Error(`live head: expected exactly 1 Clarity script, found ${clarityBlocks.length}`);
}

const HEAD = {
  title: one(/<title>[\s\S]*?<\/title>/i),
  description: one(/<meta[^>]+name="description"[^>]*>/i),
  canonical: one(/<link[^>]+rel="canonical"[^>]*>/i),
  og: many(/<meta[^>]+property="og:[^>]*>/gi),
  twitter: many(/<meta[^>]+name="twitter:[^>]*>/gi),
  jsonld: LIVE.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [],
  clarity: clarityBlocks[0],
};
for (const [k, v] of Object.entries(HEAD)) {
  if (!v || (Array.isArray(v) && !v.length)) throw new Error(`live head: ${k} not found`);
}

// ============================================================ A10 / A11 text
const STEPS = [
  { title: 'Diagnostic Test', caption: "A test on last year's topics shows exactly where your child stands." },
  { title: 'Gaps in foundational knowledge', caption: 'Swastik solves every question and marks the exact gaps behind each mistake.' },
  { title: 'Foundation-First Learning', caption: 'Weak basics are re-taught first, then the current syllabus is built on top.' },
  { title: 'improve marks and confidence', caption: 'Regular practice and tests in small batches of 3–5, until the topic holds.' },
];
const LOOP_LABEL = 'Tested again — any gap found is fixed again.';
const METHOD_ARIA = 'How we teach, in four steps: Diagnostic Test, then Gaps in foundational knowledge, then Foundation-First Learning, then improve marks and confidence. Step four loops back to step two.';

// A13: visible review count only. JSON-LD reviewCount stays 516 (frozen).
const A13 = { reviewCount: '500+ reviews' };

// A12: one footer row linking every /areas/ page that returns 200, with the
// area name taken from that page's own H1.
const A12 = { footerHeading: 'Areas we serve' };

// A14: the form now hands off to WhatsApp, so it says so under the button.
const A14 = { formNote: 'Opens WhatsApp with your details filled in.' };

// A15: the broken review widget is replaced by one link to Google.
const A15 = { reviewsButton: 'Read our reviews on Google' };

const A11 = {
  sectionTitle: 'How a week works',
  swipeHint: 'Swipe →',
  d1: {
    title: 'Two routes through the week',
    chips: ['M', 'T', 'W', 'T', 'F', 'S', 'S'],
    keyOnline: 'Online · Google Meet',
    keyCentre: 'At the centre',
    routeA: 'Route A',
    routeB: 'Route B',
    routeBSub: 'Foundation support',
    blockCentre: '2 days · At the centre',
    blockOnline: '3 days · Online',
    arrow: 'As confidence builds',
    weekend: 'Weekends at the centre: doubts cleared in person · revision and practice',
    aria: 'Two routes through the week. Route A: Monday to Friday online on Google Meet, Saturday and Sunday at the centre. Route B, foundation support: the same week with any two weekdays spent at the centre instead. Route B moves to Route A as confidence builds.',
  },
  d2: {
    title: 'A weekday online class',
    steps: [
      'Solved live on the digital board',
      'Your child tries the next one',
      'Photo sent on WhatsApp',
      'Corrected in class',
    ],
    loop: 'Next problem · back to step 2',
    after: 'After class: a worksheet to practise',
    aria: 'A weekday online class, as a loop: solved live on the digital board, your child tries the next one, photo sent on WhatsApp, corrected in class, then back to the next problem.',
  },
};

// ---- A12: build the area link list from live-http.csv + each page's H1 ----
function areaLinks() {
  const rows = fs.readFileSync('baseline/live-http.csv', 'utf8').trim().split('\n').slice(1).map((l) => {
    const f = []; let c = '', q = false;
    for (let i = 0; i < l.length; i++) {
      const ch = l[i];
      if (q) { if (ch === '"' && l[i + 1] === '"') { c += '"'; i++; } else if (ch === '"') q = false; else c += ch; }
      else if (ch === '"') q = true; else if (ch === ',') { f.push(c); c = ''; } else c += ch;
    }
    f.push(c); return f;
  });
  const ok = rows.filter((r) => /^\/areas\/[a-z-]+$/.test(r[0]) && r[1] === '200' && r[3] === '200').map((r) => r[0]).sort();
  return ok.map((url) => {
    const h = fs.readFileSync('public_html' + url + '.html', 'utf8');
    const m = /<h1[^>]*>([\s\S]*?)<\/h1>/i.exec(h);
    if (!m) throw new Error('no H1 on ' + url);
    const h1 = m[1].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
    const name = /^Best Tuition Centre for (.+) Students$/.exec(h1);
    if (!name) throw new Error('unexpected H1 shape on ' + url + ': ' + h1);
    return { url, name: name[1] };
  });
}
const AREAS = areaLinks();

// ====================================================================== icons
// Every inline SVG carries explicit width/height attributes. Without them an
// SVG with only a viewBox falls back to the replaced-element default (300x150)
// whenever a CSS rule fails to reach it.
const svg = (body, cls = 'ic', size = 24) =>
  `<svg viewBox="0 0 32 32" class="${cls}" width="${size}" height="${size}" aria-hidden="true" focusable="false">${body}</svg>`;
const ICONS = {
  testPaper: svg('<rect x="7" y="4" width="18" height="24" rx="2"/><line x1="11" y1="11" x2="21" y2="11"/><line x1="11" y1="16" x2="21" y2="16"/><line x1="11" y1="21" x2="17" y2="21"/>'),
  magnifierGap: svg('<line x1="4" y1="24" x2="11" y2="24"/><line x1="21" y1="24" x2="28" y2="24" stroke-dasharray="3 3"/><circle cx="16" cy="13" r="7"/><line x1="21.2" y1="18.2" x2="26" y2="23"/>'),
  blocks: svg('<rect x="5" y="19" width="9" height="8" rx="1"/><rect x="17" y="19" width="9" height="8" rx="1"/><rect x="11" y="9" width="9" height="8" rx="1"/>'),
  examTick: svg('<rect x="6" y="4" width="17" height="24" rx="2"/><line x1="10" y1="11" x2="19" y2="11"/><line x1="10" y1="15" x2="16" y2="15"/><polyline points="12,21 15.5,24.5 23,16"/>'),
  // A11
  board: svg('<rect x="3" y="6" width="26" height="17" rx="2"/><line x1="16" y1="23" x2="16" y2="28"/><line x1="11" y1="28" x2="21" y2="28"/><line x1="8" y1="12" x2="17" y2="12"/><line x1="8" y1="17" x2="13" y2="17"/>'),
  paper: svg('<rect x="7" y="4" width="16" height="22" rx="2"/><line x1="11" y1="11" x2="19" y2="11"/><line x1="11" y1="16" x2="19" y2="16"/><path d="M20 26 l5 4 -1.5 -5"/>'),
  photo: svg('<rect x="9" y="3" width="14" height="26" rx="3"/><circle cx="16" cy="15" r="4"/><line x1="13" y1="7" x2="19" y2="7"/>'),
  correct: svg('<rect x="5" y="6" width="22" height="20" rx="2"/><polyline points="10,16 14,20 22,11"/>'),
  doubts: svg('<path d="M4 8 a3 3 0 0 1 3 -3 h18 a3 3 0 0 1 3 3 v11 a3 3 0 0 1 -3 3 h-11 l-7 5 v-5 a3 3 0 0 1 -3 -3 z"/><line x1="12" y1="11" x2="20" y2="11"/><line x1="12" y1="16" x2="17" y2="16"/>'),
  revise: svg('<path d="M27 16 a11 11 0 1 1 -3.5 -8"/><polyline points="27,4 27,9 22,9"/><line x1="16" y1="10" x2="16" y2="17"/><line x1="16" y1="17" x2="21" y2="19"/>'),
  // D1 chip marks: a laptop for online, a building for the centre
  laptop: svg('<rect x="6" y="7" width="20" height="14" rx="2"/><line x1="3" y1="25" x2="29" y2="25"/>', 'chip-ic', 15),
  magnifier: svg('<circle cx="14" cy="14" r="8"/><line x1="20" y1="20" x2="27" y2="27"/>'),
  people: svg('<circle cx="11" cy="11" r="4"/><circle cx="22" cy="12" r="3.4"/><path d="M4 27c0-4 3.2-7 7-7s7 3 7 7"/><path d="M19 27c0-3.3 2.4-6 5.5-6 2.1 0 3.9 1.2 4.8 3"/>'),
  pencil: svg('<path d="M22 5l5 5-14 14-6.5 1.5L8 19z"/><line x1="19" y1="8" x2="24" y2="13"/>'),
  tick: svg('<polyline points="7,17 13,23 25,9"/>', 'tick-ic', 18),
  book: svg('<path d="M6 6h9a4 4 0 0 1 4 4v16a3.4 3.4 0 0 0-3.4-3H6z"/><path d="M26 6h-9a4 4 0 0 0-4 4v16a3.4 3.4 0 0 1 3.4-3H26z"/>', 'chip-ic', 16),
  arrowR: svg('<line x1="6" y1="16" x2="24" y2="16"/><polyline points="18,10 25,16 18,22"/>', 'chip-arrow', 16),
  building: svg('<rect x="7" y="6" width="18" height="21" rx="1.5"/><line x1="12" y1="12" x2="12" y2="12.5"/><line x1="16" y1="12" x2="16" y2="12.5"/><line x1="20" y1="12" x2="20" y2="12.5"/><line x1="12" y1="17" x2="12" y2="17.5"/><line x1="16" y1="17" x2="16" y2="17.5"/><line x1="20" y1="17" x2="20" y2="17.5"/><rect x="14" y="21" width="4" height="6"/>', 'chip-ic', 15),
};

const ARROW_RIGHT = '<svg viewBox="0 0 24 16" class="arw arw-h" width="22" height="15" aria-hidden="true" focusable="false"><line x1="1" y1="8" x2="19" y2="8"/><polyline points="14,3 20,8 14,13"/></svg>';
const ARROW_DOWN = '<svg viewBox="0 0 16 24" class="arw arw-v" width="15" height="22" aria-hidden="true" focusable="false"><line x1="8" y1="1" x2="8" y2="19"/><polyline points="3,14 8,20 13,14"/></svg>';

/** A four-step flow with a 4 -> 2 loop. Shared by the method diagram and D2. */
function flowDiagram({ steps, icons, loopLabel, aria, capIndex = -1, extraNote = '', circleLoop = false }) {
  const cards = steps.map((s, i) => {
    const title = typeof s === 'string' ? s : s.title;
    const caption = typeof s === 'string' ? '' : s.caption;
    return `
      <li class="ms-step ms-step-${i + 1}${i === steps.length - 1 ? ' ms-step-final' : ''}">
        <div class="ms-head"><span class="ms-num" aria-hidden="true">${i + 1}</span>${icons[i]}</div>
        <p class="ms-title${i === capIndex ? ' ms-title-cap' : ''}">${esc(title)}</p>
        ${caption ? `<p class="ms-caption">${esc(caption)}</p>` : ''}
      </li>`;
  }).map((card, i) => (i === 0 ? card : `
      <li class="ms-arrow ms-arrow-${i}" aria-hidden="true">${ARROW_RIGHT}${ARROW_DOWN}</li>` + card)).join('');

  const openStage = circleLoop ? '<div class="ms-stage">' : '';
  const closeStage = circleLoop ? '</div>' : '';
  return `${openStage}
  <ol class="ms-flow">${cards}
  </ol>
  <div class="ms-loop">
    <svg class="ms-loop-line ms-loop-h" viewBox="0 0 800 46" width="800" height="46" preserveAspectRatio="none" role="img" aria-label="${esc(aria)}"><path d="M770 2 L770 30 Q770 40 758 40 L222 40 Q210 40 210 30 L210 10"/><polyline points="204,16 210,6 216,16"/></svg>
    ${circleLoop
      ? `<svg class="ms-loop-line ms-loop-circle" viewBox="0 0 64 64" width="34" height="34" role="img" aria-label="${esc(aria)}"><path d="M52 32 a20 20 0 1 1 -6 -14"/><polyline points="46 4 46 18 32 18"/></svg>`
      : `<svg class="ms-loop-line ms-loop-v" viewBox="0 0 48 300" width="48" height="300" preserveAspectRatio="none" role="img" aria-label="${esc(aria)}"><path d="M40 292 L40 286 Q40 278 30 278 L14 278 Q4 278 4 268 L4 97 Q4 87 14 87 L30 87"/><polyline points="24,81 34,87 24,93"/></svg>`}
    <p class="ms-loop-label">${esc(loopLabel)}</p>
  </div>${closeStage}${extraNote ? `\n  <p class="ms-note">${esc(extraNote)}</p>` : ''}`;
}

const methodDiagram = () => `
<figure class="method" aria-label="${esc(METHOD_ARIA)}">${flowDiagram({
  steps: STEPS,
  icons: [ICONS.testPaper, ICONS.magnifierGap, ICONS.blocks, ICONS.examTick],
  loopLabel: LOOP_LABEL,
  aria: METHOD_ARIA,
  capIndex: 3,
})}
</figure>`;

// -------------------------------------------------------------- D1, D2, D3
function diagramWeek() {
  const d = A11.d1;
  const ONLINE = ICONS.laptop, CENTRE = ICONS.building;
  const chip = (letter, kind) =>
    `<li class="chip chip-${kind}">${kind === 'online' ? ONLINE : CENTRE}<span class="chip-d">${esc(letter)}</span></li>`;
  // Route B says "two days at the centre" as a block, so no specific weekday
  // is ever marked -- which is why the day letters are dropped there.
  const block = (label, kind, span) =>
    `<li class="chip chip-block chip-${kind}" style="--span:${span}">${kind === 'online' ? ONLINE : CENTRE}<span class="chip-d">${esc(label)}</span></li>`;
  const weekend = () => d.chips.slice(5).map((c) => chip(c, 'centre')).join('');

  return `
<figure class="dg dg-week" aria-label="${esc(d.aria)}">
  <figcaption class="dg-title">${esc(d.title)}</figcaption>
  <ul class="wk-key">
    <li class="chip chip-online chip-key">${ONLINE}<span class="chip-d">${esc(d.keyOnline)}</span></li>
    <li class="chip chip-centre chip-key">${CENTRE}<span class="chip-d">${esc(d.keyCentre)}</span></li>
  </ul>

  <div class="wk-strip">
    <div class="wk-row">
      <p class="wk-route">${esc(d.routeA)}</p>
      <ul class="wk-chips">${d.chips.slice(0, 5).map((c) => chip(c, 'online')).join('')}${weekend()}</ul>
    </div>

    <div class="wk-link">
      <svg class="wk-arrow" viewBox="0 0 24 34" width="16" height="24" role="img" aria-label="${esc(d.aria)}"><path d="M12 32 L12 8"/><polyline points="5,15 12,4 19,15"/></svg>
      <p class="wk-arrow-label">${esc(d.arrow)}</p>
    </div>

    <div class="wk-row">
      <p class="wk-route">${esc(d.routeB)}<span class="wk-sub">${esc(d.routeBSub)}</span></p>
      <ul class="wk-chips">${block(d.blockCentre, 'centre', 2)}${block(d.blockOnline, 'online', 3)}${weekend()}</ul>
    </div>
  </div>

  <p class="wk-weekend">${esc(d.weekend)}</p>
</figure>`;
}

const diagramClass = () => `
<figure class="dg method dg-loop" aria-label="${esc(A11.d2.aria)}">
  <figcaption class="dg-title">${esc(A11.d2.title)}</figcaption>${flowDiagram({
  steps: A11.d2.steps,
  icons: [ICONS.board, ICONS.paper, ICONS.photo, ICONS.correct],
  loopLabel: A11.d2.loop,
  aria: A11.d2.aria,
  extraNote: A11.d2.after,
  circleLoop: true,
})}
</figure>`;

// ================================================================= structure
const BARE_NUM = /^\d{1,2}$/;
const STEP_LABEL = /^Step \d+$/;
const isDecoration = (v) => { const t = String(v).trim(); return !t || !/[\p{L}\p{N}]/u.test(t); };

function tree(blocks, topLevel) {
  const out = []; let cur = null, pendingNum = null, pendingLabel = null;
  for (const b of blocks) {
    if ((b.t === 'text' || b.t === 'p') && typeof b.v === 'string') {
      const t = b.v.trim();
      if (STEP_LABEL.test(t)) { pendingLabel = t; continue; }
      if (BARE_NUM.test(t)) { pendingNum = t; continue; }
      if (isDecoration(t)) continue;
    }
    const deeper = /^h([2-6])$/.exec(b.t);
    if (b.t === topLevel) { cur = { head: b.v, num: pendingNum, label: pendingLabel, body: [], subs: [] }; pendingNum = pendingLabel = null; out.push(cur); continue; }
    if (!cur) { out.push({ head: null, num: null, label: null, body: [b], subs: [] }); continue; }
    if (deeper && Number(deeper[1]) > Number(topLevel[1])) { cur.subs.push({ head: b.v, level: b.t, label: pendingLabel, num: pendingNum, body: [] }); pendingLabel = pendingNum = null; }
    else { const ls = cur.subs[cur.subs.length - 1]; (ls ? ls.body : cur.body).push(b); }
  }
  if (pendingNum || pendingLabel) out.push({ head: null, num: pendingNum, label: pendingLabel, body: [], subs: [] });
  return out;
}

const renderBody = (blocks) => blocks.map((b) => {
  if (b.t === 'p' || b.t === 'text') return isDecoration(b.v) ? '' : `<p>${esc(b.v)}</p>`;
  if (b.t === 'ul') return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  if (b.t === 'options') return `<ul class="opts">${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
  if (b.t === 'link') return `<p><a class="inline-link" href="${esc(b.href || '#')}">${esc(b.v)}</a></p>`;
  if (b.t === 'button') return `<p><span class="pseudo-btn">${esc(b.v)}</span></p>`;
  return '';
}).join('\n');

// A group of 3+ sibling cards becomes a scroll-snap swipe row on phones.
// The hint sits at the right end of the heading line, never below the row.
const SWIPE_MIN = 3;
let swipeRows = 0;
const headLine = (tag, text, swipes) => {
  if (swipes) swipeRows++;
  return `<div class="sec-head"><${tag}>${esc(text)}</${tag}>` +
    (swipes ? `<span class="swipe-hint">${esc(A11.swipeHint)}</span>` : '') + `</div>`;
};
const wrapSwipe = (html, swipes) => (swipes ? `<div class="swipe">${html}</div>` : html);

const stepLabel = (n) => (n.label ? `<span class="step-label">${esc(n.label)}</span>` : '');
const numEl = (n) => (n.num ? `<span class="num">${esc(n.num)}</span>` : '');
const renderSubs = (n) => (n.subs || []).map((s) => `<article class="sub-card">${stepLabel(s)}${numEl(s)}<h4>${esc(s.head)}</h4>${renderBody(s.body)}</article>`).join('');

const L = {
  cards: (t) => `<div class="cards">${t.map((n) => `<article class="card">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</article>`).join('')}</div>`,
  numbered: (t) => { const own = t.some((n) => n.num); return `<ol class="numbered${own ? ' own-nums' : ''}">${t.map((n) => `<li>${numEl(n)}<div>${stepLabel(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div></li>`).join('')}</ol>`; },
  rows: (t) => `<div class="rows">${t.map((n) => `<article class="row">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}<div class="row-body">${renderBody(n.body)}${renderSubs(n)}</div></article>`).join('')}</div>`,
  table: (t) => {
    const intro = t.filter((n) => !n.head).map((n) => `${renderBody(n.body)}${renderSubs(n)}`).join('');
    const headed = t.filter((n) => n.head);
    const body = headed.map((n) => `<tr><th scope="row">${numEl(n)}${esc(n.head)}</th><td>${renderBody(n.body)}${renderSubs(n)}</td></tr>`).join('');
    return `${intro ? `<div class="intro">${intro}</div>` : ''}${headed.length ? `<div class="table-wrap"><table class="deftable"><tbody>${body}</tbody></table></div>` : ''}`;
  },
  // A20: every head rendered here was an <h3> on live, so the heading element
  // is kept inside the <summary> rather than thrown away. <summary>'s content
  // model is "phrasing content, optionally intermixed with heading content",
  // so an h3 child is valid. The h3 is display:inline and carries no box of its
  // own, so the disclosure marker, padding and tap target are unchanged.
  details: (t) => `<div class="accordion">${t.map((n) => n.head ? `<details><summary><h3 class="faq-question">${esc(n.head)}</h3></summary><div class="acc-body">${renderBody(n.body)}${renderSubs(n)}</div></details>` : `<div class="acc-plain">${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
  regions: (t) => `<div class="regions">${t.map((n) => `<section class="region">${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}<div class="region-grid">${n.subs.map((s) => `<article class="area">${stepLabel(s)}${numEl(s)}<h4>${esc(s.head)}</h4>${renderBody(s.body)}</article>`).join('')}</div></section>`).join('')}</div>`,
  prose: (t) => `<div class="prose">${t.map((n) => `${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${n.subs.map((s) => `<h4>${esc(s.head)}</h4>${renderBody(s.body)}`).join('')}`).join('')}</div>`,
  panel: (t) => `<div class="panel">${t.map((n) => `<div class="panel-item">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
};


// ===================== redesigned lower sections (17 Sep) =====================
// Same visual language as the hero and "How a week works": blue ink, inline
// SVG icons, rounded cards, numbered badges. No wording changes.

const A18 = { name: 'Swastik Sahal' };
const A17 = { chips: ['MSc Physics', 'BE Mechanical Engineering', 'Former Amazon software engineer'] };

/** Split a section's blocks at its h3 boundaries. */
function groupsByH3(blocks) {
  const lead = []; const groups = []; let g = null; let pendingNum = null;
  for (const b of blocks) {
    if (b.t === 'h2') continue;
    // A bare numeral belongs to the heading that FOLLOWS it. Left in place it
    // falls into the previous group's body and the number renders twice.
    if ((b.t === 'text' || b.t === 'p') && /^\d{1,2}$/.test(String(b.v || '').trim())) { pendingNum = String(b.v).trim(); continue; }
    if (b.t === 'h3') { g = { head: b.v, num: pendingNum, blocks: [] }; pendingNum = null; groups.push(g); continue; }
    (g ? g.blocks : lead).push(b);
  }
  return { lead, groups };
}

function howWeTeachSection(sec) {
  const h2 = sec.blocks.find((b) => b.t === 'h2').v;
  const { lead, groups } = groupsByH3(sec.blocks);

  // --- (a) lead block -------------------------------------------------
  const intro = lead.filter((b) => b.t === 'p' && !isDecoration(b.v));

  // --- (b) the five-step cycle ---------------------------------------
  // The numbered text nodes sit before each h3, so the cycle steps are the
  // first five h3 groups.
  const CYCLE_ICONS = [ICONS.magnifier, ICONS.board, ICONS.people, ICONS.pencil, ICONS.revise];
  const cycle = groups.slice(0, 5);
  const cycleHtml = `
    <ol class="cycle">
      ${cycle.map((g, i) => `
      <li class="cycle-step">
        <span class="cycle-badge">${esc(g.num || String(i + 1))}</span>
        <span class="cycle-icon">${CYCLE_ICONS[i]}</span>
        <h3 class="cycle-title">${esc(g.head)}</h3>
        ${renderBody(g.blocks)}
      </li>`).join('')}
    </ol>
    <svg class="cycle-loop" viewBox="0 0 900 40" preserveAspectRatio="none" width="900" height="40" role="img" aria-label="Step five feeds back into step two.">
      <path d="M840 4 L840 24 Q840 32 830 32 L200 32 Q190 32 190 24 L190 10"/>
      <polyline points="184,16 190,6 196,16"/>
    </svg>`;

  // --- (c) grade tabs, CSS only ---------------------------------------
  const gradeGroup = groups.find((g) => /Grade.wise approach/.test(g.head));
  const tabButtons = gradeGroup.blocks.filter((b) => b.t === 'button').map((b) => b.v);
  const paras = gradeGroup.blocks.filter((b) => b.t === 'p' && !isDecoration(b.v));
  const lists = gradeGroup.blocks.filter((b) => b.t === 'ul');
  // The radios must be SIBLINGS of .tab-panels: the ~ combinator cannot reach
  // out of .tab-bar. Labels bind by `for`, so they can live anywhere.
  const tabs = `
    <div class="tabs">
      ${tabButtons.map((t, i) => `<input class="tab-input" type="radio" name="grade-band" id="gb-${i}"${i === 0 ? ' checked' : ''} aria-label="${esc(t)}">`).join('')}
      <div class="tab-bar">
        ${tabButtons.map((t, i) => `<label class="tab-label" for="gb-${i}">${esc(t)}</label>`).join('')}
      </div>
      <div class="tab-panels">
        ${tabButtons.map((t, i) => `
        <div class="tab-panel" id="gb-panel-${i}">
          <div class="tab-prose">${paras[i] ? `<p>${esc(paras[i].v)}</p>` : ''}</div>
          <ul class="checklist">${(lists[i] ? lists[i].items : []).map((x) => `<li>${ICONS.tick}<span>${esc(x)}</span></li>`).join('')}</ul>
        </div>`).join('')}
      </div>
    </div>`;

  // --- (d) board cards -------------------------------------------------
  const boardGroup = groups.find((g) => /Curriculum.specific/.test(g.head));
  const cards = [];
  let cur = null;
  for (const b of boardGroup.blocks) {
    if (b.t === 'h4') { cur = { name: b.v, desc: '', href: '#', link: '' }; cards.push(cur); continue; }
    if (!cur) continue;
    if (b.t === 'p') cur.desc = b.v;
    if (b.t === 'link') { cur.link = b.v; cur.href = b.href || '#'; }
  }
  // A25: the six cards run International first, to match the grouping of the
  // curricula list. Every card, its text and its badge are kept. The board-N
  // class carries the badge colour, so it stays pinned to the card's ORIGINAL
  // index — reordering must not shuffle the colours.
  cards.forEach((c, i) => { c.idx = i + 1; });
  const INTL_FIRST = ['IGCSE', 'IB MYP/DP', 'AS & A Levels', 'CBSE', 'ICSE/ISC', 'State Board'];
  const ordered = INTL_FIRST.map((name) => {
    const hit = cards.find((c) => c.name === name);
    if (!hit) throw new Error(`A25: no board card named "${name}" (have: ${cards.map((c) => c.name).join(', ')})`);
    return hit;
  });
  if (ordered.length !== cards.length) throw new Error(`A25: ${cards.length} cards but ${ordered.length} ordered`);

  const boardHtml = `
    <div class="boards-wrap">
    <div class="boards">
      ${ordered.map((c) => `
      <article class="board-card board-${c.idx}">
        <span class="board-badge">${esc(c.name)}</span>
        <p class="board-desc">${esc(c.desc)}</p>
        <a class="board-link" href="${esc(c.href)}">${esc(c.link)}</a>
      </article>`).join('')}
    </div>
    <div class="swipe-dots" aria-hidden="true">${cards.map(() => '<span></span>').join('')}</div>
    <div class="swipe-rail" aria-hidden="true"></div>
    </div>`;

  return `
<section class="sec sec-teach" id="how-we-teach">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    <div class="lead-block">${intro.map((b) => `<p>${esc(b.v)}</p>`).join('')}</div>
    ${cycleHtml}
    <h3 class="sub-head">${esc(gradeGroup.head)}</h3>
    ${tabs}
    <h3 class="sub-head">${esc(boardGroup.head)}</h3>
    ${boardHtml}
  </div>
</section>`;
}

// A25.1: the hero's last paragraph was the bullet-joined board band,
// "CBSE • IB MYP • IGCSE • ICSE • IB DP • AS & A Levels • State Board" — a
// verbatim repeat of the prose sentence directly above it, and the first of
// three flat rows of the same list. It is dropped. Every board name it carried
// appears many times elsewhere on the page; only the joined line goes.
// The guard means this can never silently drop a different paragraph.
const HERO_BAND = 'CBSE • IB MYP • IGCSE • ICSE • IB DP • AS & A Levels • State Board';
const heroLast = C.hero.paras[C.hero.paras.length - 1];
if (heroLast !== HERO_BAND) {
  throw new Error(`A25.1: the last hero paragraph is not the board band, it is ${JSON.stringify(heroLast)}`);
}
const HERO_PARAS = C.hero.paras.slice(0, -1);

// A24/A25: the nine curricula, split into two labelled sets. "International"
// and "Indian" are the only new words. IB PYP is added here because he teaches
// it and /ib-pyp-tuition-hyderabad is a live page, but the chip row omitted it.
const A25 = {
  intlLabel: 'International',
  indianLabel: 'Indian',
  summary: 'All nine curricula: International and Indian',
  intl: ['IB PYP', 'IB MYP', 'IB DP', 'IGCSE', 'AS & A Levels'],
  indian: ['CBSE', 'ICSE', 'ISC', 'State Board'],
};
const A24_PYP_CHIP = { v: 'IB PYP', href: '/ib-pyp-tuition-hyderabad' };

function curriculaSection(sec) {
  const h2 = sec.blocks.find((b) => b.t === 'h2').v;
  const intro = sec.blocks.filter((b) => (b.t === 'p' || b.t === 'text') && !isDecoration(b.v));
  const links = sec.blocks.filter((b) => b.t === 'link');

  // A24: the chip row had eight of the nine. Add IB PYP.
  if (links.some((l) => l.v === 'IB PYP')) throw new Error('A24: an IB PYP chip already exists');
  const all = [...links, A24_PYP_CHIP];

  const chip = (l) => `<a class="curr-chip" href="${esc(l.href || '#')}">${ICONS.book}<span>${esc(l.v)}</span>${ICONS.arrowR}</a>`;
  const pick = (names) => names.map((n) => {
    const hit = all.find((l) => l.v === n);
    if (!hit) throw new Error(`A25: no curriculum chip named "${n}"`);
    return hit;
  });
  const intl = pick(A25.intl);
  const indian = pick(A25.indian);
  if (intl.length + indian.length !== all.length) {
    throw new Error(`A25: ${all.length} chips but ${intl.length + indian.length} placed — every name must be in exactly one set`);
  }

  // A25: folded behind a closed <details>, the same pattern as the A12 areas
  // list, so the section reads as two labelled sets rather than one flat row.
  return `
<section class="sec sec-curricula" id="curricula">
  <div class="wrap curricula-band">
    <div class="curricula-intro">
      <h2>${esc(h2)}</h2>
      ${intro.map((b) => `<p>${esc(b.v)}</p>`).join('')}
    </div>
    <details class="curr-details">
      <summary>${esc(A25.summary)}</summary>
      <div class="curr-sets">
        <div class="curr-set">
          <h3 class="curr-set-title">${esc(A25.intlLabel)}</h3>
          <div class="curr-grid">${intl.map(chip).join('')}</div>
        </div>
        <div class="curr-set">
          <h3 class="curr-set-title">${esc(A25.indianLabel)}</h3>
          <div class="curr-grid">${indian.map(chip).join('')}</div>
        </div>
      </div>
    </details>
  </div>
</section>`;
}

function aboutSection(sec) {
  const h2 = sec.blocks.find((b) => b.t === 'h2').v;
  const rest = sec.blocks.filter((b) => b.t !== 'h2');
  const statText = rest.filter((b) => b.t === 'text').slice(0, 4).map((b) => b.v);
  const paras = rest.filter((b) => b.t === 'p');
  const quote = paras[0];
  const credential = paras[1];
  const oneOnOne = paras[paras.length - 1];

  const principles = [];
  let cur = null;
  for (const b of rest) {
    if (b.t === 'h4') { cur = { head: b.v, desc: '' }; principles.push(cur); continue; }
    if (cur && b.t === 'p' && !cur.desc && b !== oneOnOne) cur.desc = b.v;
  }
  const PICONS = [ICONS.magnifier, ICONS.pencil, ICONS.blocks, ICONS.people];

  return `
<section class="sec sec-about" id="about">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    <div class="about-grid">
      <aside class="profile-card">
        <p class="profile-name">${esc(A18.name)}</p>
        <ul class="stat-band">
          <li class="stat"><span class="stat-num">${esc(statText[0])}</span><span class="stat-label">${esc(statText[1])}</span></li>
          <li class="stat"><span class="stat-num">${esc(statText[2])}</span><span class="stat-label">${esc(statText[3])}</span></li>
        </ul>
        <p class="credential">${esc(credential.v)}</p>
        <ul class="cred-chips" aria-hidden="true">${A17.chips.map((c) => `<li>${esc(c)}</li>`).join('')}</ul>
      </aside>
      <div class="about-main">
        <blockquote class="pull-quote"><p>${esc(quote.v)}</p></blockquote>
        <div class="principles">
          ${principles.map((pr, i) => `
          <article class="principle">
            <span class="principle-icon">${PICONS[i % PICONS.length]}</span>
            <h3>${esc(pr.head)}</h3>
            <p>${esc(pr.desc)}</p>
          </article>`).join('')}
        </div>
        <p class="about-note">${esc(oneOnOne.v)}</p>
      </div>
    </div>
  </div>
</section>`;
}

function diagnosticSection(sec) {
  const h2 = sec.blocks.find((b) => b.t === 'h2').v;
  const { lead, groups } = groupsByH3(sec.blocks);
  const price = lead.filter((b) => !isDecoration(b.v));
  const gBy = (re) => groups.find((g) => re.test(g.head));
  const gWhat = gBy(/What is the/), gAfter = gBy(/What happens after/), gDetails = gBy(/Test Details/), gBook = gBy(/How to Book/);

  const detailRows = [];
  const dt = gDetails.blocks.filter((b) => b.t === 'text' || b.t === 'p');
  for (let i = 0; i + 1 < dt.length; i += 2) detailRows.push([dt[i].v, dt[i + 1].v]);

  const steps = (gBook.blocks.find((b) => b.t === 'ul') || { items: [] }).items;
  const payLines = gBook.blocks.filter((b) => (b.t === 'p' || b.t === 'text') && !isDecoration(b.v));
  const payBtn = gBook.blocks.find((b) => b.t === 'button');
  const payLinks = gBook.blocks.filter((b) => b.t === 'link');

  const prose = (g) => `<div class="diag-prose"><h3>${esc(g.head)}</h3>${renderBody(g.blocks)}</div>`;

  return `
<section class="sec sec-diagnostic" id="diagnostic-test">
  <div class="wrap">
    <div class="diag-head">
      <h2>${esc(h2)}</h2>
      ${price.map((b) => `<p class="diag-price">${esc(b.v)}</p>`).join('')}
    </div>
    <div class="diag-wrap">
      <div class="diag-cols">${prose(gWhat)}${prose(gAfter)}</div>
      <div class="swipe-dots" aria-hidden="true"><span></span><span></span></div>
      <div class="swipe-rail" aria-hidden="true"></div>
    </div>

    <h3 class="sub-head">${esc(gDetails.head)}</h3>
    <div class="table-wrap">
      <table class="deftable"><tbody>
        ${detailRows.map(([k, v]) => `<tr><th scope="row">${esc(k)}</th><td>${esc(v)}</td></tr>`).join('')}
      </tbody></table>
    </div>

    <h3 class="sub-head">${esc(gBook.head)}</h3>
    <div class="book-grid">
      <ol class="book-steps">
        ${steps.map((t) => `<li><span>${esc(t)}</span></li>`).join('')}
      </ol>
      <aside class="pay-card">
        ${payLines.map((b) => `<p>${esc(b.v)}</p>`).join('')}
        ${payBtn ? `<span class="pseudo-btn">${esc(payBtn.v)}</span>` : ''}
        <div class="pay-links">${payLinks.map((l, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(l.href || '#')}">${esc(l.v)}</a>`).join('')}</div>
      </aside>
    </div>
  </div>
</section>`;
}

// ------------------------------------------- split the hybrid section (A11)
const hybridIdx = C.sections.findIndex((s) => /hybrid-section/.test(s.cls));
if (hybridIdx < 0) throw new Error('hybrid section not found');
const hybrid = C.sections[hybridIdx];
const hybridH2 = hybrid.blocks.find((b) => b.t === 'h2').v;

const leadPs = [];
const groups = [];
let g = null;
for (const b of hybrid.blocks) {
  if (b.t === 'h2') continue;
  if (b.t === 'h3') { g = { head: b.v, blocks: [] }; groups.push(g); continue; }
  if (!g) { if ((b.t === 'p' || b.t === 'text') && !isDecoration(b.v)) leadPs.push(b); continue; }
  g.blocks.push(b);
}
// Two groups describe the week; every OTHER group is locality content and goes
// into the <details>. Assigning by exclusion rather than by name means a group
// can never be silently dropped -- an earlier version named three groups and
// lost a fourth ("Students Learn With Us From") along with 12 sentences.
const WEEK_GROUPS = ['How It Works', 'Why Online Classes Work'];
const gBy = (name) => groups.find((x) => x.head === name);
const gHow = gBy(WEEK_GROUPS[0]);
const gWhy = gBy(WEEK_GROUPS[1]);
for (const n of WEEK_GROUPS) if (!gBy(n)) throw new Error(`hybrid group missing: ${n}`);
const areaGroups = groups.filter((x) => !WEEK_GROUPS.includes(x.head));
if (!areaGroups.length) throw new Error('no locality groups found');
const assigned = WEEK_GROUPS.length + areaGroups.length;
if (assigned !== groups.length) throw new Error(`assigned ${assigned} of ${groups.length} hybrid groups`);
if (leadPs.length !== 2) throw new Error(`expected 2 lead paragraphs, got ${leadPs.length}`);
const [pCommute, pAcross] = leadPs;

const subTree = (grp) => tree(grp.blocks, grp.blocks.some((b) => b.t === 'h4') ? 'h4' : 'h5');

const cardsOf = (t) => t.map((n) => `<article class="card">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</article>`).join('');

const weekSection = () => {
  const tHow = subTree(gHow), tWhy = subTree(gWhy);
  const howSwipe = tHow.length >= SWIPE_MIN, whySwipe = tWhy.length >= SWIPE_MIN;
  return `
<section class="sec sec-week" id="hybrid-classes">
  <div class="wrap">
    <h2>${esc(A11.sectionTitle)}</h2>
    <p class="sec-lede">${esc(pCommute.v)}</p>
    ${diagramWeek()}
    ${headLine('h3', gHow.head, howSwipe)}
    ${wrapSwipe(cardsOf(tHow), howSwipe).replace('class="swipe"', 'class="swipe swipe-3"')}
    ${diagramClass()}
    ${headLine('h3', gWhy.head, whySwipe)}
    ${wrapSwipe(cardsOf(tWhy), whySwipe).replace('class="swipe"', 'class="swipe swipe-4"')}
  </div>
</section>`;
};

const areasDetails = () => `
<section class="sec sec-areas">
  <div class="wrap">
    <details class="areas-details">
      <summary>${esc(hybridH2)}</summary>
      <div class="areas-body">
        <p>${esc(pAcross.v)}</p>
        ${areaGroups.map((grp) => `<h3>${esc(grp.head)}</h3>${L.regions(tree(grp.blocks, grp.blocks.some((b) => b.t === 'h4') ? 'h4' : 'h5'))}`).join('\n')}
      </div>
    </details>
  </div>
</section>`;

// --------------------------------------------------------- remaining sections
// The carried-over live markup contains inline SVGs with only a viewBox.
// Give every one of them explicit width/height so nothing can fall back to
// the 300x150 default if a CSS rule ever misses.
const sizeRawSvgs = (html) => html.replace(/<svg\b([^>]*)>/g, (tag, attrs) => {
  if (/\bwidth=/.test(attrs)) return tag;
  return `<svg${attrs} width="20" height="20">`;
});
const RAW = Object.fromEntries(Object.entries(C.rawSections).map(([k, v]) => [k, sizeRawSvgs(v)]));

// ------------------------------- A16: explicit section order ---------------
// Order agreed 17 Sep. Keys match the live section class names; the two
// pseudo-entries are the built sections.
const ORDER = [
  'why-choose-us',
  'subjects-section',
  '__week__',
  'quick-finder',
  'how-we-work',
  'what-we-offer',
  'curricula',
  'about-section',
  'how-we-teach',
  'reviews-section',
  '__areas__',
  'faq-section',
  'modal-overlay',        // Diagnostic Test
  'contact-section',      // Get in Touch
];

// Layouts for the sections still rendered generically.
const GENERIC = {
  'why-choose-us': 'numbered',
  'subjects-section': 'cards',
  'how-we-work': 'numbered',
  'what-we-offer': 'panel',
  'faq-section': 'details',
};

const sectionByKey = (key) => C.sections.find((x) => x.cls.includes(key) && !/hybrid-section/.test(x.cls));

function renderRest() {
  const out = [];
  const used = new Set();

  for (const key of ORDER) {
    if (key === '__week__') { out.push(weekSection()); continue; }
    if (key === '__areas__') { out.push(areasDetails()); continue; }

    const sec = sectionByKey(key);
    if (!sec) throw new Error('section not found for order key: ' + key);
    used.add(sec);

    if (key === 'curricula') { out.push(curriculaSection(sec)); continue; }
    if (key === 'about-section') { out.push(aboutSection(sec)); continue; }
    if (key === 'how-we-teach') { out.push(howWeTeachSection(sec)); continue; }
    if (key === 'modal-overlay') { out.push(diagnosticSection(sec)); continue; }

    if (key === 'reviews-section') {
      out.push(`
<section class="sec sec-reviews" id="reviews">
  <div class="wrap">
    <h2>${esc((sec.blocks.find((b) => b.t === 'h2') || {}).v || 'Reviews')}</h2>
    <div class="reviews-rating" aria-label="Rating ${esc(C.rating.value)} out of 5">
      <span class="rating-stars" aria-hidden="true">${'★'.repeat(C.rating.stars)}</span>
      <span class="rating-num">${esc(C.rating.value)}</span>
      <span class="rc">${esc(A13.reviewCount)}</span>
    </div>
    <a class="btn btn-primary reviews-cta" href="${esc(C.googleReviewsLink)}" target="_blank" rel="noopener noreferrer">${esc(A15.reviewsButton)}</a>
  </div>
</section>`);
      continue;
    }

    const rawKey = Object.keys(RAW).find((k) => sec.cls.includes(k));
    if (rawKey) {
      let raw = RAW[rawKey];
      if (rawKey === 'contact-section') {
        const btn = '<button type="submit" class="btn btn-primary">Send Message</button>';
        if (!raw.includes(btn)) throw new Error('contact submit button markup not found');
        raw = raw.replace(btn, btn + `<p class="form-note">${esc(A14.formNote)}</p>`);

        // A22: the form offered IB MYP and IB DP but not IB PYP, so a Grades 1-5
        // parent could only pick a programme their child cannot be on. PYP goes
        // directly before MYP, keeping the IB programmes in ascending order.
        // ALL nine stay in the HTML: the grade filter is applied by JS, so with
        // JS off every curriculum is still present and selectable.
        const myp = '<option value="ib-myp">IB MYP</option>';
        if (!raw.includes(myp)) throw new Error('A22: the IB MYP option was not found');
        if (raw.includes('ib-pyp')) throw new Error('A22: an IB PYP option already exists');
        raw = raw.replace(myp, `<option value="ib-pyp">IB PYP</option>\n                                ${myp}`);
      }
      out.push(raw);
      continue;
    }

    const layout = GENERIC[key];
    if (!layout) throw new Error('no layout for ' + key);
    const h2 = (sec.blocks.find((b) => b.t === 'h2') || {}).v || '';
    const rest = sec.blocks.filter((b) => b.t !== 'h2');
    const top = rest.some((b) => b.t === 'h3') ? 'h3' : rest.some((b) => b.t === 'h4') ? 'h4' : null;
    const t = top ? tree(rest, top) : [{ head: null, num: null, label: null, body: rest.filter((b) => !(typeof b.v === 'string' && isDecoration(b.v))), subs: [] }];
    const swipeable = ['cards', 'panel', 'numbered', 'rows'].includes(layout) && t.length >= SWIPE_MIN;
    out.push(`
<section class="sec sec-${layout}" id="${esc(sec.id || key)}">
  <div class="wrap">
    ${headLine('h2', h2, swipeable)}
    ${wrapSwipe(L[layout](t), swipeable)}
  </div>
</section>`);
  }

  // Nothing may be dropped: every non-hybrid section must be in ORDER.
  const missing = C.sections.filter((x) => !/hybrid-section/.test(x.cls) && !used.has(x));
  if (missing.length) throw new Error('sections not placed by ORDER: ' + missing.map((x) => x.cls).join(', '));
  return out.join('\n');
}

// ================================================================== the page
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

const ICON_WA = '<svg viewBox="0 0 24 24" class="hcta-ic" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path d="M8.6 7.6c.3 0 .6 0 .8.5l.9 2c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a7 7 0 0 0 3.4 3c.3.1.5 0 .6-.1l.6-.7c.2-.2.4-.2.6-.1l2 1c.3.1.4.4.4.6a2 2 0 0 1-2 1.9c-1 0-3.4-.8-5.4-2.9S6.7 11 6.7 9.8a2 2 0 0 1 1.9-2.2z"/></svg>';
const ICON_TEL = '<svg viewBox="0 0 24 24" class="hcta-ic" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a1.6 1.6 0 0 1-1.8 1.6A15.6 15.6 0 0 1 5 5.8 1.6 1.6 0 0 1 6.6 3z"/></svg>';

const navLinks = C.header.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.text)}</a>`).join('');

/** The live footer verbatim (3 columns, each heading above its own list),
 *  with the A12 "Areas we serve" row appended before the copyright line. */
function footerHtml() {
  let f = sizeRawSvgs(C.rawSections['site-footer']);
  const areas = `
      <div class="footer-areas">
        <h3 class="footer-areas-title">${esc(A12.footerHeading)}</h3>
        <nav class="footer-areas-list" aria-label="${esc(A12.footerHeading)}">${AREAS.map((a) => `<a href="${esc(a.url)}">${esc(a.name)}</a>`).join('')}</nav>
      </div>`;
  const anchor = '<div class="footer-bottom">';
  if (!f.includes(anchor)) throw new Error('footer-bottom not found');
  f = f.replace(anchor, areas + '\n      ' + anchor);
  return f;
}

let page = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${HEAD.title}
${HEAD.description}
${HEAD.canonical}
<!-- STAGING ONLY: the live page is "index, follow". Staging must never be indexed. -->
<meta name="robots" content="noindex, nofollow">
${HEAD.og.join('\n')}
${HEAD.twitter.join('\n')}
<link rel="stylesheet" href="../../css/site.css">
<script defer src="script.js"></script>
<script defer src="js/contact-whatsapp.js"></script>
${HEAD.jsonld.join('\n')}
${TRACKING}

<!-- Microsoft Clarity -->
${HEAD.clarity}
</head>
<body class="v2">
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">ANKURAM</a>
    <div class="header-cta">
      <a class="hcta hcta-wa" href="${esc(C.whatsapp)}" aria-label="WhatsApp">${ICON_WA}<span class="hcta-text">WhatsApp</span></a>
      <a class="hcta hcta-tel" href="tel:${esc(C.header.phone.tel)}" aria-label="Call ${esc(C.header.phone.display)}">${ICON_TEL}<span class="hcta-text">${esc(C.header.phone.display)}</span></a>
      <details class="nav-mobile">
        <summary>Menu</summary>
        <nav class="nav-mobile-list" aria-label="Main">${navLinks}</nav>
      </details>
    </div>
    <nav class="nav nav-desktop" aria-label="Main">${navLinks}</nav>
  </div>
</header>

<main id="main">
  <section class="hero" id="home">
    <div class="wrap hero-inner">
      <div class="hero-text">
        <h1>${esc(C.hero.h1)}</h1>
        ${HERO_PARAS.map((p, i) => `<p class="${i === 0 ? 'lede' : ''}">${esc(p)}</p>`).join('')}
        <div class="hero-ctas">${C.hero.ctas.map((c, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(c.href)}">${esc(c.text)}</a>`).join('')}</div>
        <div class="rating" aria-label="Rating ${esc(C.rating.value)} out of 5">
          <span class="rating-num">${esc(C.rating.value)}</span>
          <span class="rating-stars" aria-hidden="true">${'★'.repeat(C.rating.stars)}</span>
          <span class="rating-meta"><span class="rc">${esc(A13.reviewCount)}</span><span class="bn">${esc(C.rating.businessName)}</span></span>
        </div>
        <ul class="trust">${C.trust.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      ${methodDiagram()}
    </div>
  </section>

${renderRest()}

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

${footerHtml()}
</body>
</html>
`;

fs.mkdirSync('design/direction-c', { recursive: true });
page = nameAllThreeIB(page);   // must run BEFORE the write
fs.writeFileSync('design/direction-c/index.html', page);

// ======================================================================= A24
// He teaches all three IB programmes and has a page for each, but the page
// enumerated only two. Every VISIBLE enumeration now names all three.
//
// The JSON-LD is frozen under invariant 3, so it is split out first and put
// back untouched. Its two board sentences keep saying "IB MYP/DP", which means
// the visible FAQ answer and the FAQPage JSON-LD now differ deliberately —
// the same accepted state as A13's review count.
function nameAllThreeIB(html) {
  const LD = /<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi;
  const blocks = html.match(LD) || [];
  const TOKEN = ' LD ';
  let i = 0;
  const shielded = html.replace(LD, () => TOKEN + (i++));

  const rewritten = shielded
    .replace(/IB \(MYP\/DP\)/g, 'IB (PYP/MYP/DP)')
    .replace(/IB MYP\/DP/g, 'IB PYP/MYP/DP');

  const out = rewritten.replace(new RegExp(TOKEN + '(\\d+)', 'g'), (_, n) => blocks[Number(n)]);

  // The JSON-LD must come back byte-identical.
  const after = out.match(LD) || [];
  if (JSON.stringify(after) !== JSON.stringify(blocks)) throw new Error('A24: JSON-LD changed');
  if (/IB \(MYP\/DP\)|IB MYP\/DP/.test(out.replace(LD, ' '))) throw new Error('A24: a two-programme enumeration survived outside JSON-LD');
  const changed = (shielded.match(/IB \(MYP\/DP\)|IB MYP\/DP/g) || []).length;
  console.log(`A24: ${changed} visible IB enumeration(s) now name all three; ${blocks.length} JSON-LD blocks untouched`);
  return out;
}

// ==================================================================== checks
// Entities are decoded before counting: "&amp;" is one ampersand, not a word.
// Counting it as one inflated every earlier total by the number of escaped
// ampersands on the page.
const decode = (t) => t
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'").replace(/&nbsp;/g, ' ')
  .replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)));
const bodyText = decode(/<body[^>]*>([\s\S]*)<\/body>/i.exec(page)[1]
  .replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ')
  .replace(/<[^>]+>/g, ' ')).replace(/\s+/g, ' ').trim();
const wc = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;

// P2 measured 3258, but that count treated every HTML entity as a word
// ("&amp;" -> "amp"). Re-measured on the same committed P2 page with entities
// decoded, the honest baseline is 3244. Every total from here on is decoded.
const P2_WORDS = 3244;
const a10 = wc(STEPS.map((s) => s.caption).concat(LOOP_LABEL).join(' '));
const methodTitles = wc(STEPS.map((s) => s.title).join(' '));
const methodNumerals = 4;
const navDupe = wc(C.header.nav.map((n) => n.text).join(' ')) + 1;

// day names: once in the header row, then again inside each block (7 + 7)
const d1 = A11.d1;
// Route A shows 7 day letters; Route B shows 2 blocks + the 2 weekend letters.
const d1Words = wc([d1.title, d1.keyOnline, d1.keyCentre, d1.routeA, d1.routeB, d1.routeBSub,
  d1.arrow, d1.weekend, ...d1.chips, d1.blockCentre, d1.blockOnline, ...d1.chips.slice(5)].join(' '));
const d2Words = wc([A11.d2.title, ...A11.d2.steps, A11.d2.loop, A11.d2.after].join(' ')) + 4; // + 1..4 badges
const swipeWords = wc(A11.swipeHint) * swipeRows;            // one hint per swipe row
const a11 = wc(A11.sectionTitle) + d1Words + d2Words + swipeWords;

const a12 = wc(A12.footerHeading) + AREAS.reduce((n, a) => n + wc(a.name), 0);
const faqRemoved = 0;   // A13 FAQ de-duplication withdrawn 17 Sep
// A15 drops the widget's four strings and adds one button label.
const reviewsBlocks = (C.sections.find((x) => x.cls.includes('reviews-section')) || { blocks: [] }).blocks;
const a15Removed = reviewsBlocks.filter((b) => b.t !== 'h2').reduce((n, b) => n + wc(b.v || ''), 0);
// The reviews block repeats the rating figure and the count above the button.
const a15Repeat = wc(C.rating.value) + wc(A13.reviewCount);
const a15 = wc(A15.reviewsButton) + a15Repeat - a15Removed;
const a14 = wc(A14.formNote);
// A17: the credential chips (the full sentence stays). A18: the name.
const a17 = A17.chips.reduce((n, c) => n + wc(c), 0);
const a18 = wc(A18.name);
// A22: one added <option> — its visible text is the only new wording.
const a22 = wc('IB PYP');
// A24: the IB PYP chip. The renames add no words: "(MYP/DP)" and "(PYP/MYP/DP)"
// are one token either way.
const a24 = wc(A24_PYP_CHIP.v);
// A25: the two set labels and the <details> summary. Nothing else is new.
const a25 = wc(A25.intlLabel) + wc(A25.indianLabel) + wc(A25.summary);
// A25.1: the hero board band is gone. Every name in it survives elsewhere; only
// the bullet-joined line goes, so the whole line's words come off the total.
const a25_1 = -wc(HERO_BAND);
const ratingDelta = wc(A13.reviewCount) - wc(C.rating.reviewCount);
const expected = P2_WORDS + a10 + methodTitles + methodNumerals + navDupe + a11 + a12 + ratingDelta - faqRemoved + a14 + a15 + a17 + a18 + a22 + a24 + a25 + a25_1;
const actual = wc(bodyText);

console.log(`head copied from live: title, description, canonical, ${HEAD.og.length} og, ${HEAD.twitter.length} twitter, ${HEAD.jsonld.length} JSON-LD`);
console.log(`A11 words: title ${wc(A11.sectionTitle)} + D1 ${d1Words} + D2 ${d2Words} + ${swipeRows} swipe hints ${swipeWords} = ${a11}`);
console.log(`A12: heading + ${AREAS.length} area links = ${a12} words`);
console.log(`A13: review count ${JSON.stringify(C.rating.reviewCount)} -> ${JSON.stringify(A13.reviewCount)} (${ratingDelta >= 0 ? '+' : ''}${ratingDelta}); FAQ duplicate removed = -${faqRemoved} words`);
console.log(`A17: credential chips +${a17}   A18: name "${A18.name}" +${a18} (monogram removed)`);
console.log(`A22: IB PYP option +${a22} words`);
console.log(`A25.1: hero board band removed ${a25_1} words`);
console.log(`A24: IB PYP chip +${a24}   A25: labels "${A25.intlLabel}"/"${A25.indianLabel}" + summary "${A25.summary}" = +${a25}`);
console.log(`A14: form note +${a14}   A15: button +${wc(A15.reviewsButton)} + rating repeat ${a15Repeat} - widget strings ${a15Removed} = ${a15}`);
console.log(`expected ${P2_WORDS} + A10 ${a10} + titles ${methodTitles} + numerals ${methodNumerals} + nav ${navDupe} + A11 ${a11} + A12 ${a12} + A13 ${ratingDelta} - FAQdup ${faqRemoved} + A14 ${a14} + A15 ${a15} + A22 ${a22} + A24 ${a24} + A25 ${a25} + A25.1 ${a25_1} = ${expected}`);
console.log(`visible words ${actual}  ${actual === expected ? 'OK' : `MISMATCH by ${actual - expected}`}`);
// A19: every tracking ID that must survive the rebuild, checked on the output.
for (const [label, id, want] of [
  ['GA4', 'G-MQRSS8DKLE', 2], ['Ads', 'AW-10954184691', 3], ['Clarity', 'uir8kpny76', 1],
  ['phone label', 'NGIFCNbv3OAbEPOvruco', 1], ['WhatsApp label', 'jucWCNPv3OAbEPOvruco', 1],
]) {
  const n = page.split(id).length - 1;
  if (n !== want) { console.log(`TRACKING: ${label} ${id} appears ${n}x, expected ${want}`); process.exitCode = 1; }
}
for (const bad of ['G-KHP2PBXF6X', 'G-MQRSS8DKKE', 'jucWCNbv']) {
  if (page.includes(bad)) { console.log(`TRACKING: forbidden ${bad} present`); process.exitCode = 1; }
}
console.log('tracking: GA4 + Ads + Clarity + both conversion labels present, no typo IDs');

if (/<img\b/i.test(page)) { console.log('A9 VIOLATION: <img> present'); process.exitCode = 1; } else console.log('A9: no <img>');
if (/\bnull\b|\bundefined\b/.test(bodyText)) { console.log('null/undefined leaked'); process.exitCode = 1; }
if (actual !== expected) process.exitCode = 1;
console.log(`html ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB`);
