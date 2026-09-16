#!/usr/bin/env node
/**
 * build-directions.js — render the three P2 homepage directions.
 *
 * All three read design/home-content.json, so every word on every direction is
 * the same verbatim text extracted from the live homepage. The directions differ
 * only in layout assignment and CSS.
 *
 * Usage: node design/build-directions.js
 */

const fs = require('fs');
const path = require('path');

const C = JSON.parse(fs.readFileSync('design/home-content.json', 'utf8'));

const esc = (s) => String(s).replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const words = (s) => String(s).split(/\s+/).filter(Boolean).length;

// ---------------------------------------------------------------- structure
/** Group a section's flat block list into a tree keyed by heading level. */
const BARE_NUM = /^\d{1,2}$/;

function tree(blocks, topLevel) {
  const out = [];
  let cur = null;
  let pendingNum = null;
  for (const b of blocks) {
    // The page ships its own step numbers ("01", "02") as text nodes just
    // before their heading. Keep them as the visible numeral (invariant 14:
    // the words stay) and attach them to the heading they belong to, instead
    // of letting them fall into the previous item's body.
    if ((b.t === 'text' || b.t === 'p') && BARE_NUM.test(String(b.v).trim())) { pendingNum = String(b.v).trim(); continue; }
    if (b.t === topLevel) { cur = { head: b.v, num: pendingNum, body: [], subs: [] }; pendingNum = null; out.push(cur); continue; }
    if (!cur) { out.push({ head: null, num: null, body: [b], subs: [] }); continue; }
    const deeper = /^h([2-6])$/.exec(b.t);
    if (deeper && Number(deeper[1]) > Number(topLevel[1])) {
      cur.subs.push({ head: b.v, level: b.t, body: [] });
    } else {
      const lastSub = cur.subs[cur.subs.length - 1];
      (lastSub ? lastSub.body : cur.body).push(b);
    }
  }
  if (pendingNum) out.push({ head: null, num: pendingNum, body: [], subs: [] });
  return out;
}

/** The numeral a node shows: its own from the page, else nothing (CSS counts). */
const numEl = (n) => (n.num ? `<span class="num">${esc(n.num)}</span>` : '');

const renderBody = (blocks) =>
  blocks
    .map((b) => {
      if (b.t === 'p' || b.t === 'text') return `<p>${esc(b.v)}</p>`;
      if (b.t === 'ul') return `<ul>${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      if (b.t === 'options') return `<ul class="opts">${b.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>`;
      if (b.t === 'link') return `<p><a class="inline-link" href="${esc(b.href || '#')}">${esc(b.v)}</a></p>`;
      if (b.t === 'button') return `<p><span class="pseudo-btn">${esc(b.v)}</span></p>`;
      return '';
    })
    .join('\n');

// ------------------------------------------------------------ the diagram
// Labels are verbatim strings from the homepage.
const D_LABELS = ['Diagnostic Test', 'Gaps in foundational knowledge', 'Foundation‑First Learning', 'improve marks and confidence'];

function methodDiagram(idPrefix) {
  const step = (i, x, label) => {
    const lines = label.split(' ');
    const wrapped = [];
    let line = '';
    for (const w of lines) {
      if ((line + ' ' + w).trim().length > 15) { wrapped.push(line.trim()); line = w; } else line += ' ' + w;
    }
    wrapped.push(line.trim());
    const texts = wrapped
      .map((t, n) => `<tspan x="${x + 62}" dy="${n === 0 ? 0 : 15}">${esc(t)}</tspan>`)
      .join('');
    return `
    <g>
      <rect x="${x}" y="46" width="124" height="96" rx="10" class="dg-box"/>
      <text x="${x + 62}" y="72" class="dg-num">${i}</text>
      <text x="${x + 62}" y="98" class="dg-label">${texts}</text>
    </g>`;
  };
  const arrow = (x) => `<path d="M${x} 94 l16 0 m-6 -5 l6 5 -6 5" class="dg-arrow"/>`;
  return `
<figure class="method-figure">
  <svg viewBox="0 0 700 180" role="img" aria-labelledby="${idPrefix}-t ${idPrefix}-d" class="method-svg">
    <title id="${idPrefix}-t">How we teach, in four steps</title>
    <desc id="${idPrefix}-d">${esc(D_LABELS.join(', then '))}.</desc>
    ${step(1, 8, D_LABELS[0])}
    ${arrow(140)}
    ${step(2, 180, D_LABELS[1])}
    ${arrow(312)}
    ${step(3, 352, D_LABELS[2])}
    ${arrow(484)}
    ${step(4, 524, D_LABELS[3])}
  </svg>
</figure>`;
}

// Every layout must render a node's nested subheadings, or content is lost.
const renderSubs = (n, tag) =>
  (n.subs || [])
    .map((sub) => `<div class="sub"><${tag || 'h4'}>${esc(sub.head)}</${tag || 'h4'}>${renderBody(sub.body)}</div>`)
    .join('');

// ------------------------------------------------------------- layout kit
const L = {
  cards(sec, t) {
    return `<div class="cards">${t
      .map((n) => `<article class="card">${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</article>`)
      .join('')}</div>`;
  },
  numbered(sec, t) {
    const hasOwn = t.some((n) => n.num);
    return `<ol class="numbered${hasOwn ? ' own-nums' : ''}">${t
      // The step number is decorative and comes from a CSS counter, so it is
      // not a text node: it must not count as page content.
      .map((n) => `<li>${numEl(n)}<div>${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div></li>`)
      .join('')}</ol>`;
  },
  rows(sec, t) {
    return `<div class="rows">${t
      .map((n) => `<article class="row">${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}<div class="row-body">${renderBody(n.body)}${n.subs
        .map((s) => `<div class="sub"><h4>${esc(s.head)}</h4>${renderBody(s.body)}</div>`)
        .join('')}</div></article>`)
      .join('')}</div>`;
  },
  table(sec, t) {
    // Nodes without a heading become an intro block. Putting them in a
    // colspan cell makes Lighthouse read the row as a fake <caption>.
    const intro = t.filter((n) => !n.head).map((n) => `${renderBody(n.body)}${renderSubs(n)}`).join('');
    const headed = t.filter((n) => n.head);
    const rowsHtml = headed
      .map((n) => `<tr><th scope="row">${numEl(n)}${esc(n.head)}</th><td>${renderBody(n.body)}${renderSubs(n)}</td></tr>`)
      .join('');
    const table = headed.length ? `<div class="table-wrap"><table class="deftable"><tbody>${rowsHtml}</tbody></table></div>` : '';
    return `${intro ? `<div class="intro">${intro}</div>` : ''}${table}`;
  },
  details(sec, t) {
    return `<div class="accordion">${t
      .map((n) => n.head
        ? `<details><summary>${numEl(n)}${esc(n.head)}</summary><div class="acc-body">${renderBody(n.body)}${renderSubs(n)}</div></details>`
        : `<div class="acc-plain">${renderBody(n.body)}${renderSubs(n)}</div>`)
      .join('')}</div>`;
  },
  regions(sec, t) {
    // h3 > h4 > h5 nesting, used for the big hybrid section
    return `<div class="regions">${t
      .map(
        (n) => `<section class="region">${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}
      <div class="region-grid">${n.subs
        .map((s) => `<article class="area ${s.level}"><h4>${esc(s.head)}</h4>${renderBody(s.body)}</article>`)
        .join('')}</div></section>`
      )
      .join('')}</div>`;
  },
  prose(sec, t) {
    return `<div class="prose">${t
      .map((n) => `${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${n.subs
        .map((s) => `<h4>${esc(s.head)}</h4>${renderBody(s.body)}`)
        .join('')}`)
      .join('')}</div>`;
  },
  panel(sec, t) {
    return `<div class="panel">${t
      .map((n) => `<div class="panel-item">${numEl(n)}${n.head ? `<h3>${esc(n.head)}</h3>` : ''}${renderBody(n.body)}${renderSubs(n)}</div>`)
      .join('')}</div>`;
  },
};

// Section layout assignment per direction. Checked below: no two adjacent equal.
const PLANS = {
  a: ['numbered', 'rows', 'regions', 'panel', 'numbered', 'cards', 'prose', 'panel', 'rows', 'panel', 'cards', 'details', 'prose'],
  b: ['cards', 'table', 'regions', 'panel', 'numbered', 'rows', 'cards', 'panel', 'table', 'cards', 'panel', 'details', 'panel'],
  c: ['numbered', 'cards', 'regions', 'table', 'numbered', 'panel', 'rows', 'cards', 'prose', 'panel', 'cards', 'details', 'rows'],
};

// Where the method diagram goes in each direction (section index).
const DIAGRAM_AT = { a: 4, b: 6, c: -1 }; // c puts it in the hero instead

// --------------------------------------------------------------- page shell
function renderSections(dir) {
  const plan = PLANS[dir];
  return C.sections
    .map((sec, i) => {
      const h2 = (sec.blocks.find((b) => b.t === 'h2') || {}).v || '';
      const rest = sec.blocks.filter((b) => b.t !== 'h2');
      const top = rest.some((b) => b.t === 'h3') ? 'h3' : rest.some((b) => b.t === 'h4') ? 'h4' : null;
      const t = top ? tree(rest, top) : [{ head: null, body: rest, subs: [] }];
      const layout = plan[i] || 'prose';
      const inner = (L[layout] || L.prose)(sec, t);
      const diagram = DIAGRAM_AT[dir] === i ? methodDiagram(`${dir}-m`) : '';
      return `
<section class="sec sec-${layout}" id="${esc(sec.id || 'sec-' + (i + 1))}">
  <div class="wrap">
    <h2>${esc(h2)}</h2>
    ${diagram}
    ${inner}
  </div>
</section>`;
    })
    .join('\n');
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

const stars = (n) => '★'.repeat(n);

function ratingBlock() {
  return `<div class="rating" aria-label="Rating ${esc(C.rating.value)} out of 5">
  <span class="rating-num">${esc(C.rating.value)}</span>
  <span class="rating-stars" aria-hidden="true">${stars(C.rating.stars)}</span>
  <span class="rating-meta"><span class="rc">${esc(C.rating.reviewCount)}</span><span class="bn">${esc(C.rating.businessName)}</span></span>
</div>`;
}

function page(dir, title) {
  const heroCtas = C.hero.ctas
    .map((c, i) => `<a class="btn ${i === 0 ? 'btn-primary' : 'btn-ghost'}" href="${esc(c.href)}">${esc(c.text)}</a>`)
    .join('');
  const heroDiagram = dir === 'c' ? methodDiagram('c-hero') : '';
  return `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(title)}</title>
<meta name="robots" content="noindex, nofollow">
<link rel="stylesheet" href="styles.css">
${TRACKING}
</head>
<body class="dir-${dir}">
<a class="skip" href="#main">Skip to content</a>

<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">ANKURAM</a>
    <nav class="nav" aria-label="Main">
      ${C.header.nav.map((n) => `<a href="${esc(n.href)}">${esc(n.text)}</a>`).join('')}
    </nav>
    <div class="header-cta">
      <a class="hcta hcta-wa" href="${esc(C.whatsapp)}" aria-label="WhatsApp">WhatsApp</a>
      <a class="hcta hcta-tel" href="tel:${esc(C.header.phone.tel)}">${esc(C.header.phone.display)}</a>
    </div>
  </div>
</header>

<main id="main">
  <section class="hero">
    <div class="wrap hero-inner">
      <div class="hero-text">
        <h1>${esc(C.hero.h1)}</h1>
        ${C.hero.paras.map((p, i) => `<p class="${i === 0 ? 'lede' : i === C.hero.paras.length - 1 ? 'curricula-line' : ''}">${esc(p)}</p>`).join('')}
        <div class="hero-ctas">${heroCtas}</div>
        ${ratingBlock()}
        <ul class="trust">${C.trust.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>
      </div>
      ${heroDiagram || `<figure class="hero-media"><img src="assets/classroom-teaching.webp" width="1200" height="800" alt="Ankuram Tuition Center" loading="lazy" decoding="async"></figure>`}
    </div>
  </section>

${renderSections(dir)}

  <section class="cta-final">
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
    <nav class="footer-links" aria-label="Footer">
      ${C.footer.links.map((l) => `<a href="${esc(l.href)}">${esc(l.text)}</a>`).join('')}
    </nav>
  </div>
</footer>
</body>
</html>
`;
}

// ------------------------------------------------------------------ verify
for (const [dir, plan] of Object.entries(PLANS)) {
  for (let i = 1; i < plan.length; i++) {
    if (plan[i] === plan[i - 1]) throw new Error(`direction ${dir}: sections ${i} and ${i + 1} share layout "${plan[i]}"`);
  }
  if (plan.length < C.sections.length) throw new Error(`direction ${dir}: plan covers ${plan.length} of ${C.sections.length} sections`);
}

// ------------------------------------------------------------------- write
const TITLES = {
  a: 'Warm editorial — Ankuram homepage direction A',
  b: 'Ankuram navy & gold — homepage direction B',
  c: 'Diagram-led — Ankuram homepage direction C',
};

for (const dir of ['a', 'b', 'c']) {
  const out = path.join('design', `direction-${dir}`);
  fs.mkdirSync(path.join(out, 'assets'), { recursive: true });
  fs.writeFileSync(path.join(out, 'index.html'), page(dir, TITLES[dir]));
  fs.copyFileSync('public_html/assets/images/classroom-teaching.webp', path.join(out, 'assets', 'classroom-teaching.webp'));
  fs.copyFileSync(`design/css/${dir}.css`, path.join(out, 'styles.css'));
  const bytes = fs.statSync(path.join(out, 'index.html')).size + fs.statSync(path.join(out, 'styles.css')).size;
  console.log(`direction-${dir}: html+css ${(bytes / 1024).toFixed(1)} KB  (layouts: ${PLANS[dir].join(', ')})`);
}

// word parity across the three
const text = (f) => {
  const raw = fs.readFileSync(f, 'utf8');
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(raw)[1];
  return body.replace(/<script[\s\S]*?<\/script>/g, ' ').replace(/<svg[\s\S]*?<\/svg>/g, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
};
const [ta, tb, tc] = ['a', 'b', 'c'].map((d) => text(`design/direction-${d}/index.html`));
const wc = (s) => s.split(/\s+/).filter((w) => /[\p{L}\p{N}]/u.test(w)).length;
const same = wc(ta) === wc(tb) && wc(tb) === wc(tc);
console.log(`visible words — a:${wc(ta)} b:${wc(tb)} c:${wc(tc)} ${same ? '(identical)' : '(MISMATCH)'}`);
for (const [d, t] of [['a', ta], ['b', tb], ['c', tc]]) {
  if (/\bnull\b|\bundefined\b/.test(t)) { console.log(`direction ${d}: literal null/undefined leaked into the page`); process.exitCode = 1; }
}
if (!same) process.exitCode = 1;
