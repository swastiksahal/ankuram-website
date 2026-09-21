#!/usr/bin/env node
/** W2.2: page layout only. Four shared blocks are consumed without modification.
 * Source words, inline hrefs and frozen head fields come from the W2 extractor.
 * Output is a FLAT file; staging's existing HTTP auth/noindex header protects it.
 */
const fs = require('fs');
const crypto = require('crypto');
const B = require('./blocks');
const M = JSON.parse(fs.readFileSync('design/wave2/how-we-teach.json', 'utf8'));
const esc = B.esc;
const source = fs.readFileSync(M.source, 'utf8');
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
// A1/A19: copy the already-approved tracking scripts, without retyping IDs.
const approvedHome = fs.readFileSync('build/production/index.html', 'utf8');
const tracking = (approvedHome.match(/<script\b[^>]*>[\s\S]*?<\/script>/gi) || [])
  .filter(s => !/application\/ld\+json/.test(s) && /googletagmanager|window\.dataLayer|uir8kpny76/.test(s));
if (tracking.length !== 3) throw Error('Expected approved gtag loader, config/conversion listener, and Clarity');
const approvedChanges = fs.readFileSync('docs/APPROVED-CHANGES.md', 'utf8');
for (const id of ['G-MQRSS8DKLE', 'AW-10954184691', 'jucWCNPv3OAbEPOvruco', 'NGIFCNbv3OAbEPOvruco', 'uir8kpny76']) {
  if (!approvedChanges.includes(id) || !tracking.join('\n').includes(id)) throw Error(`A1/A19 missing ${id}`);
}

// A6: only the final sticky Call Now / WhatsApp controls are removed.
const sticky = M.blocks.slice(-2);
if (sticky.map(b => b.v).join('|') !== 'Call Now|WhatsApp') throw Error('Unexpected sticky controls');
const content = M.blocks.slice(0, -2);
const sections = [];
let current;
for (const b of content) {
  if (b.t === 'h1') continue;
  if (b.t === 'h2') { current = { heading: b.v, blocks: [] }; sections.push(current); }
  else if (current) current.blocks.push(b);
}
if (sections.length !== 10) throw Error('Expected ten sections');
const runs = b => (b.runs || [{ text: b.v }]).map(r => r.href
  ? `<a href="${esc(r.href)}">${esc(r.text)}</a>` : esc(r.text)).join(' ');

// Break long paragraphs at existing sentence boundaries only. No labels or
// summaries are generated. Inline anchors remain intact in every segment.
function paragraphs(b) {
  const html = runs(b);
  if (b.v.split(/\s+/).length <= 60) return `<p>${html}</p>`;
  const parts = html.split(/(?<=[.!?])\s+(?=[A-Z])/);
  const groups = []; let group = '';
  for (const part of parts) {
    if (group && (group + ' ' + part).split(/\s+/).length > 60) { groups.push(group); group = ''; }
    group += (group ? ' ' : '') + part;
  }
  if (group) groups.push(group);
  return groups.map(p => `<p>${p}</p>`).join('');
}
function body(blocks) {
  const result = []; let list = [];
  const flush = () => { if (list.length) { result.push(`<ul class="w2-list">${list.map(b => `<li>${runs(b)}</li>`).join('')}</ul>`); list = []; } };
  for (const b of blocks) {
    if (b.t === 'li') { list.push(b); continue; }
    flush();
    if (b.t === 'h3') result.push(`<h3>${esc(b.v)}</h3>`);
    else result.push(paragraphs(b));
  }
  flush(); return result.join('');
}
function groups(blocks) {
  const intro = []; const cards = []; let card;
  for (const b of blocks) {
    if (b.t === 'h3') { card = { head: b.v, blocks: [] }; cards.push(card); }
    else (card ? card.blocks : intro).push(b);
  }
  return { intro, cards };
}
const article = (c, cls) => `<article class="${cls}"><h3>${esc(c.head)}</h3><div>${body(c.blocks)}</div></article>`;
const layouts = ['intro', 'session', 'comparison', 'batch', 'method', 'signs', 'online', 'parents', 'faq', 'cta'];
if (layouts.some((x, i) => i && x === layouts[i - 1])) throw Error('Consecutive layouts must differ');
function section(s, i) {
  const layout = layouts[i]; const { intro, cards } = groups(s.blocks); let html;
  switch (layout) {
    case 'intro':
      html = `<div class="w2-teach-lead">${body(intro.slice(0, 1))}</div><div class="w2-teach-prose">${body(intro.slice(1))}</div>`;
      break;
    case 'session':
      html = `<div class="w2-prose">${body(intro)}</div><div class="w2-teach-timeline">${cards.map(c => article(c, 'w2-teach-step')).join('')}</div>`;
      break;
    case 'comparison': {
      // The final paragraph belongs below BOTH columns in the source.
      const tail = cards[1].blocks.filter(b => b.t !== 'li');
      html = `<div class="w2-prose">${body(intro)}</div><div class="w2-teach-compare">${cards.map(c => article({ ...c, blocks: c.blocks.filter(b => b.t === 'li') }, 'w2-card')).join('')}</div><div class="w2-teach-after w2-prose">${body(tail)}</div>`;
      break;
    }
    case 'batch':
      html = `<div class="w2-teach-batch"><div>${body(intro.slice(0, 1))}</div><div>${body(intro.slice(1))}</div></div>`;
      break;
    case 'method':
      html = `<div class="w2-teach-rows">${cards.map(c => article(c, 'w2-teach-row')).join('')}</div>`;
      break;
    case 'signs':
      html = `<div class="w2-prose">${body(intro)}</div><div class="w2-cards">${cards.map(c => article(c, 'w2-card')).join('')}</div>`;
      break;
    case 'online':
      html = `<div class="w2-teach-online"><div>${body(intro.slice(0, 3))}</div><div class="w2-teach-plans">${body(intro.slice(3))}</div></div>`;
      break;
    case 'parents':
      html = `<div class="w2-teach-parents">${cards.map(c => article(c, 'w2-card')).join('')}</div>`;
      break;
    case 'faq':
      html = B.faq(cards.map(c => ({ q: c.head, a: c.blocks.map(b => b.runs) })));
      break;
    case 'cta': {
      const links = intro.slice(-2);
      if (links.map(b => b.v).join('|') !== 'Book on WhatsApp|Call: 73966 69430') throw Error('Unexpected CTA');
      html = `${body(intro.slice(0, -2))}<div class="w2-teach-cta-links">${links.map((b, k) => `<a class="btn ${k ? 'btn-ghost' : 'btn-primary'}" href="${esc(b.href)}">${esc(b.v)}</a>`).join('')}</div>`;
      break;
    }
    default: throw Error(`Unplaced section ${s.heading}`);
  }
  // Intro/FAQ selectors belong to the section; other layout selectors belong
  // only to their inner content grid, never to the enclosing section as well.
  const sectionClass = ['intro', 'faq'].includes(layout) ? `w2-teach-${layout}` : `w2-teach-section-${layout}`;
  return `<section class="${layout === 'cta' ? 'cta-band' : 'w2-sec'} ${sectionClass}" aria-labelledby="teach-${i}"><div class="wrap"><h2 id="teach-${i}">${esc(s.heading)}</h2>${html}</div></section>`;
}
const main = `${B.hero({ h1: content[0].v, html: body(content.slice(1, content.findIndex(b => b.t === 'h2'))) })}\n${sections.map(section).join('\n')}`;
const quickLinks = M.footer.filter(b => b.href && b.href.startsWith('/')).map(b => ({ text: b.v, href: b.href }));
const page = `<!DOCTYPE html>
<html lang="en-IN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
${M.head.title}
${M.head.description}
${M.head.canonical}
${M.head.robots}
${M.head.og.join('\n')}
${M.head.twitter.join('\n')}
<link rel="stylesheet" href="css/site.css?v=${hash('css/site.css')}">
<script defer src="js/contact-whatsapp.js?v=${hash('js/contact-whatsapp.js')}"></script>
${M.head.jsonld.join('\n')}
${tracking.join('\n')}
</head>
<body class="v2 w2">
${B.skipLink()}
${B.header({ base: '/' })}
<main id="main">${main}</main>
${B.footer({ base: '/', quickLinks })}
</body>
</html>`;
fs.mkdirSync('build/wave2', { recursive: true });
fs.writeFileSync('build/wave2/how-we-teach.html', page);
console.log('built build/wave2/how-we-teach.html — flat file, unchanged shared blocks');
console.log(`A23 css ${hash('css/site.css')}; js ${hash('js/contact-whatsapp.js')}`);
for (const level of ['h1', 'h2', 'h3']) console.log(`${level}: ${(page.match(new RegExp(`<${level}\\b`, 'g')) || []).length}`);
for (const tag of ['title', 'description', 'canonical', 'robots']) if (!page.includes(M.head[tag])) throw Error(`Head drift: ${tag}`);
if (M.head.jsonld.some(x => !page.includes(x))) throw Error('JSON-LD drift');
if (/<img\b/i.test(page)) throw Error('A9: unexpected image');
