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

const HEAD = {
  title: one(/<title>[\s\S]*?<\/title>/i),
  description: one(/<meta[^>]+name="description"[^>]*>/i),
  canonical: one(/<link[^>]+rel="canonical"[^>]*>/i),
  og: many(/<meta[^>]+property="og:[^>]*>/gi),
  twitter: many(/<meta[^>]+name="twitter:[^>]*>/gi),
  jsonld: LIVE.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [],
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
const svg = (body, cls = 'ic') => `<svg viewBox="0 0 32 32" class="${cls}" aria-hidden="true" focusable="false">${body}</svg>`;
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
  laptop: svg('<rect x="6" y="7" width="20" height="14" rx="2"/><line x1="3" y1="25" x2="29" y2="25"/>', 'chip-ic'),
  building: svg('<rect x="7" y="6" width="18" height="21" rx="1.5"/><line x1="12" y1="12" x2="12" y2="12.5"/><line x1="16" y1="12" x2="16" y2="12.5"/><line x1="20" y1="12" x2="20" y2="12.5"/><line x1="12" y1="17" x2="12" y2="17.5"/><line x1="16" y1="17" x2="16" y2="17.5"/><line x1="20" y1="17" x2="20" y2="17.5"/><rect x="14" y="21" width="4" height="6"/>', 'chip-ic'),
};

const ARROW_RIGHT = '<svg viewBox="0 0 24 16" class="arw arw-h" aria-hidden="true" focusable="false"><line x1="1" y1="8" x2="19" y2="8"/><polyline points="14,3 20,8 14,13"/></svg>';
const ARROW_DOWN = '<svg viewBox="0 0 16 24" class="arw arw-v" aria-hidden="true" focusable="false"><line x1="8" y1="1" x2="8" y2="19"/><polyline points="3,14 8,20 13,14"/></svg>';

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
    <svg class="ms-loop-line ms-loop-h" viewBox="0 0 800 46" preserveAspectRatio="none" role="img" aria-label="${esc(aria)}"><path d="M770 2 L770 30 Q770 40 758 40 L222 40 Q210 40 210 30 L210 10"/><polyline points="204,16 210,6 216,16"/></svg>
    ${circleLoop
      ? `<svg class="ms-loop-line ms-loop-circle" viewBox="0 0 64 64" role="img" aria-label="${esc(aria)}"><path d="M52 32 a20 20 0 1 1 -6 -14"/><polyline points="46 4 46 18 32 18"/></svg>`
      : `<svg class="ms-loop-line ms-loop-v" viewBox="0 0 48 300" preserveAspectRatio="none" role="img" aria-label="${esc(aria)}"><path d="M40 292 L40 286 Q40 278 30 278 L14 278 Q4 278 4 268 L4 97 Q4 87 14 87 L30 87"/><polyline points="24,81 34,87 24,93"/></svg>`}
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
      <svg class="wk-arrow" viewBox="0 0 24 34" role="img" aria-label="${esc(d.aria)}"><path d="M12 32 L12 8"/><polyline points="5,15 12,4 19,15"/></svg>
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
  details: (t) => `<div class="accordion">${t.map((n) => n.head ? `<details><summary>${esc(n.head)}</summary><div class="acc-body">${renderBody(n.body)}${renderSubs(n)}</div></details>` : `<div class="acc-plain">${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
  regions: (t) => `<div class="regions">${t.map((n) => `<section class="region">${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}<div class="region-grid">${n.subs.map((s) => `<article class="area">${stepLabel(s)}${numEl(s)}<h4>${esc(s.head)}</h4>${renderBody(s.body)}</article>`).join('')}</div></section>`).join('')}</div>`,
  prose: (t) => `<div class="prose">${t.map((n) => `${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${n.subs.map((s) => `<h4>${esc(s.head)}</h4>${renderBody(s.body)}`).join('')}`).join('')}</div>`,
  panel: (t) => `<div class="panel">${t.map((n) => `<div class="panel-item">${stepLabel(n)}${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div>`).join('')}</div>`,
};

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
const REST = C.sections.filter((_, i) => i !== hybridIdx);
const PLAN = ['numbered', 'cards', 'table', 'numbered', 'panel', 'rows', 'cards', 'prose', 'panel', 'cards', 'details', 'rows'];
if (PLAN.length !== REST.length) throw new Error(`plan covers ${PLAN.length} of ${REST.length} sections`);
for (let i = 1; i < PLAN.length; i++) if (PLAN[i] === PLAN[i - 1]) throw new Error(`sections ${i} and ${i + 1} share layout`);

const faqIdx = REST.findIndex((s) => /faq-section/.test(s.cls));
if (faqIdx < 0) throw new Error('faq section not found');

const RAW = C.rawSections;

/** A13: drop the one FAQ pair whose question AND answer are both exact repeats. */
function dedupeFaq(blocks) {
  const out = [];
  const seen = new Set();
  let curKey = null, buf = [];
  const flush = () => {
    if (!buf.length) return;
    if (!seen.has(curKey)) { seen.add(curKey); out.push(...buf); }
    else droppedFaq.push(buf.map((b) => b.v).join(' | '));
    buf = [];
  };
  for (const b of blocks) {
    if (b.t === 'h3') { flush(); buf = [b]; curKey = null; continue; }
    if (!buf.length) { out.push(b); continue; }
    buf.push(b);
    curKey = buf.map((x) => x.v).join('||');
  }
  flush();
  return out;
}
const droppedFaq = [];

/** The four leading text nodes of About are a stat band: number + label. */
function statBand(blocks) {
  const lead = [];
  let i = 0;
  while (i < blocks.length && blocks[i].t === 'text' && lead.length < 4) { lead.push(blocks[i]); i++; }
  if (lead.length !== 4) return { band: '', rest: blocks };
  const band = `<ul class="stat-band">` +
    [[0, 1], [2, 3]].map(([n, l]) =>
      `<li class="stat"><span class="stat-num">${esc(lead[n].v)}</span><span class="stat-label">${esc(lead[l].v)}</span></li>`).join('') +
    `</ul>`;
  return { band, rest: blocks.slice(i) };
}

function renderRest() {
  const out = [];
  REST.forEach((sec, i) => {
    if (i === faqIdx) out.push(areasDetails());      // details sits just above the FAQ
    // Interactive sections keep the live markup verbatim: real dropdowns, a
    // real form, and the containers script.js writes reviews into.
    const rawKey = Object.keys(RAW).find((k) => sec.cls.includes(k));
    if (rawKey) { out.push(RAW[rawKey]); if (i === 1) out.push(weekSection()); return; }

    const h2 = (sec.blocks.find((b) => b.t === 'h2') || {}).v || '';
    let rest = sec.blocks.filter((b) => b.t !== 'h2');
    if (sec.cls.includes('faq-section')) rest = dedupeFaq(rest);

    if (sec.cls.includes('about-section')) {
      const { band, rest: after } = statBand(rest);
      const t2 = tree(after, after.some((b) => b.t === 'h3') ? 'h3' : after.some((b) => b.t === 'h4') ? 'h4' : null);
      out.push(`
<section class="sec sec-about" id="about">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    ${band}
    ${L.prose(t2)}
  </div>
</section>`);
      return;
    }

    if (sec.cls.includes('curricula')) {
      const intro = rest.filter((b) => b.t === 'p' || b.t === 'text').map((b) => `<p>${esc(b.v)}</p>`).join('');
      const chips = rest.filter((b) => b.t === 'link')
        .map((b) => `<a class="curr-chip" href="${esc(b.href || '#')}">${esc(b.v)}</a>`).join('');
      out.push(`
<section class="sec sec-curricula" id="curricula">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    ${intro}
    <div class="curr-grid">${chips}</div>
  </div>
</section>`);
      return;
    }

    const top = rest.some((b) => b.t === 'h3') ? 'h3' : rest.some((b) => b.t === 'h4') ? 'h4' : null;
    const t = top ? tree(rest, top) : [{ head: null, num: null, label: null, body: rest.filter((b) => !(typeof b.v === 'string' && isDecoration(b.v))), subs: [] }];
    const layout = PLAN[i];
    // Layouts that produce a row of comparable cards can swipe; prose cannot.
    const swipeable = ['cards', 'panel', 'numbered', 'rows'].includes(layout) && t.length >= SWIPE_MIN;
    out.push(`
<section class="sec sec-${layout}" id="${esc(sec.id || 'sec-' + (i + 1))}">
  <div class="wrap">
    ${headLine('h2', h2, swipeable)}
    ${wrapSwipe(L[layout](t), swipeable)}
  </div>
</section>`);
    if (i === 1) out.push(weekSection());            // after "Subjects We Teach"
  });
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

const ICON_WA = '<svg viewBox="0 0 24 24" class="hcta-ic" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path d="M8.6 7.6c.3 0 .6 0 .8.5l.9 2c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a7 7 0 0 0 3.4 3c.3.1.5 0 .6-.1l.6-.7c.2-.2.4-.2.6-.1l2 1c.3.1.4.4.4.6a2 2 0 0 1-2 1.9c-1 0-3.4-.8-5.4-2.9S6.7 11 6.7 9.8a2 2 0 0 1 1.9-2.2z"/></svg>';
const ICON_TEL = '<svg viewBox="0 0 24 24" class="hcta-ic" aria-hidden="true" focusable="false"><path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a1.6 1.6 0 0 1-1.8 1.6A15.6 15.6 0 0 1 5 5.8 1.6 1.6 0 0 1 6.6 3z"/></svg>';

const navLinks = C.header.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.text)}</a>`).join('');

const page = `<!DOCTYPE html>
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
${HEAD.jsonld.join('\n')}
${TRACKING}
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
        ${C.hero.paras.map((p, i) => `<p class="${i === 0 ? 'lede' : i === C.hero.paras.length - 1 ? 'curricula-line' : ''}">${esc(p)}</p>`).join('')}
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

<footer class="site-footer">
  <div class="wrap">
    ${C.footer.lines.map((l) => `<p>${esc(l)}</p>`).join('')}
    <nav class="footer-links" aria-label="Footer">${C.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join('')}</nav>
    <div class="footer-areas">
      <h2 class="footer-areas-title">${esc(A12.footerHeading)}</h2>
      <nav class="footer-areas-list" aria-label="${esc(A12.footerHeading)}">${AREAS.map((a) => `<a href="${esc(a.url)}">${esc(a.name)}</a>`).join('')}</nav>
    </div>
  </div>
</footer>
</body>
</html>
`;

fs.mkdirSync('design/direction-c', { recursive: true });
fs.writeFileSync('design/direction-c/index.html', page);

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
const faqRemoved = droppedFaq.reduce((n, t) => n + wc(t), 0);
const ratingDelta = wc(A13.reviewCount) - wc(C.rating.reviewCount);
const expected = P2_WORDS + a10 + methodTitles + methodNumerals + navDupe + a11 + a12 + ratingDelta - faqRemoved;
const actual = wc(bodyText);

console.log(`head copied from live: title, description, canonical, ${HEAD.og.length} og, ${HEAD.twitter.length} twitter, ${HEAD.jsonld.length} JSON-LD`);
console.log(`A11 words: title ${wc(A11.sectionTitle)} + D1 ${d1Words} + D2 ${d2Words} + ${swipeRows} swipe hints ${swipeWords} = ${a11}`);
console.log(`A12: heading + ${AREAS.length} area links = ${a12} words`);
console.log(`A13: review count ${JSON.stringify(C.rating.reviewCount)} -> ${JSON.stringify(A13.reviewCount)} (${ratingDelta >= 0 ? '+' : ''}${ratingDelta}); FAQ duplicate removed = -${faqRemoved} words`);
console.log(`expected ${P2_WORDS} + A10 ${a10} + titles ${methodTitles} + numerals ${methodNumerals} + nav ${navDupe} + A11 ${a11} + A12 ${a12} + A13 ${ratingDelta} - FAQ dup ${faqRemoved} = ${expected}`);
console.log(`visible words ${actual}  ${actual === expected ? 'OK' : `MISMATCH by ${actual - expected}`}`);
if (/<img\b/i.test(page)) { console.log('A9 VIOLATION: <img> present'); process.exitCode = 1; } else console.log('A9: no <img>');
if (/\bnull\b|\bundefined\b/.test(bodyText)) { console.log('null/undefined leaked'); process.exitCode = 1; }
if (actual !== expected) process.exitCode = 1;
console.log(`html ${(Buffer.byteLength(page) / 1024).toFixed(1)} KB`);
