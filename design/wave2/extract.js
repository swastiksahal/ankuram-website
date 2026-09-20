#!/usr/bin/env node
/**
 * extract.js — generic wave 2 content extractor. READ ONLY on the source page.
 *
 *   node design/wave2/extract.js public_html/diagnostic-assessment.html design/wave2/diagnostic.json
 *
 * Produces an ORDERED list of blocks. Text is copied verbatim from the source's
 * text nodes and never retyped, so no word can drift. The head is copied whole
 * and separately: title, description, canonical, robots, og/twitter, JSON-LD.
 *
 * Nav and footer text is tagged so the page builder can drop it in favour of
 * the shared header/footer blocks without losing track of what was there.
 */
const fs = require('fs');

const VOID = new Set(['area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'source', 'track', 'wbr']);
const SKIP = new Set(['script', 'style', 'svg', 'noscript']);
const squash = (s) => s.replace(/\s+/g, ' ').trim();

const ENT = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", nbsp: ' ', ndash: '–', mdash: '—', rsquo: '’', lsquo: '‘', ldquo: '“', rdquo: '”', hellip: '…', times: '×', rupee: '₹', deg: '°', middot: '·', bull: '•', rarr: '→', check: '✓', copy: '\u00a9', reg: '\u00ae', trade: '\u2122' };
const decode = (t) => String(t).replace(/&#(\d+);/g, (_, d) => String.fromCodePoint(Number(d)))
  .replace(/&#x([0-9a-f]+);/gi, (_, h) => String.fromCodePoint(parseInt(h, 16)))
  .replace(/&([a-zA-Z][a-zA-Z0-9]*);/g, (m, n) => (n in ENT ? ENT[n] : m));

/** Walk the document, emitting {type, text, href, stack} for every text node. */
function walk(src) {
  const body = /<body[^>]*>([\s\S]*)<\/body>/i.exec(src);
  const html = body ? body[1] : src;
  const out = [];
  const stack = [];
  let uid = 0;
  let i = 0;
  while (i < html.length) {
    const lt = html.indexOf('<', i);
    if (lt < 0) break;
    if (lt > i) {
      const raw = html.slice(i, lt);
      const t = squash(decode(raw));
      if (t && !stack.some((e) => SKIP.has(e.name))) out.push({ text: t, stack: stack.slice() });
    }
    const gt = html.indexOf('>', lt);
    if (gt < 0) break;
    const tag = html.slice(lt + 1, gt);
    if (tag.startsWith('/')) {
      const name = tag.slice(1).trim().toLowerCase();
      for (let k = stack.length - 1; k >= 0; k--) if (stack[k].name === name) { stack.length = k; break; }
    } else if (!tag.startsWith('!')) {
      const name = (tag.match(/^([a-zA-Z0-9-]+)/) || [, ''])[1].toLowerCase();
      const selfClose = tag.endsWith('/') || VOID.has(name);
      if (SKIP.has(name) && !selfClose) {
        const close = html.toLowerCase().indexOf(`</${name}`, gt);
        i = close < 0 ? html.length : html.indexOf('>', close) + 1;
        continue;
      }
      if (!selfClose) stack.push({ name, attrs: tag, uid: ++uid });
    }
    i = gt + 1;
  }
  return out;
}

const attr = (el, k) => { const m = new RegExp(`${k}\\s*=\\s*"([^"]*)"`, 'i').exec(el.attrs || ''); return m ? m[1] : ''; };
const hasClass = (el, c) => new RegExp(`(^|\\s)${c}(\\s|$)`).test(attr(el, 'class'));

function main() {
  const src = process.argv[2];
  const out = process.argv[3];
  if (!src || !out) throw new Error('usage: extract.js <source.html> <out.json>');
  const html = fs.readFileSync(src, 'utf8');
  const head = /<head[^>]*>([\s\S]*?)<\/head>/i.exec(html)[1];
  const one = (re) => { const m = re.exec(head); return m ? m[0] : null; };

  const nodes = walk(html);
  const blocks = [];
  let lastKey = null;
  for (const n of nodes) {
    const st = n.stack;
    // footer wins: the footer contains its own <nav class="footer-nav">, whose
    // links belong to the footer block, not to the site nav.
    const inFooter = st.some((e) => e.name === 'footer' || hasClass(e, 'footer'));
    const inNav = !inFooter && st.some((e) => e.name === 'nav' || e.name === 'header' || hasClass(e, 'mobile-menu'));
    const owner = [...st].reverse().find((e) => /^(h[1-6]|p|li|a|button|span|div|td|th|summary|strong|em)$/.test(e.name));
    if (!owner) continue;
    const heading = [...st].reverse().find((e) => /^h[1-6]$/.test(e.name));
    const li = st.some((e) => e.name === 'li');
    const a = [...st].reverse().find((e) => e.name === 'a');

    let type = 'text';
    if (heading) type = heading.name;
    else if (li) type = 'li';
    else if (st.some((e) => e.name === 'p')) type = 'p';

    const region = inNav ? 'nav' : inFooter ? 'footer' : 'main';
    const href = a ? attr(a, 'href') : null;

    // Group by the OWNING block element, not by adjacency. A paragraph with an
    // inline <a> emits several text nodes; they are one paragraph with runs, and
    // flattening them loses the link. Invariant 6 requires every href to survive.
    const ownerEl = [...st].reverse().find((e) => /^(h[1-6]|p|li|td|th|summary)$/.test(e.name)) || owner;
    const key = `${region}|${ownerEl.uid}`;
    const prev = blocks[blocks.length - 1];
    if (prev && key === lastKey) {
      prev.runs.push({ text: n.text, href: href || undefined });
      prev.v = squash(`${prev.v} ${n.text}`);
    } else {
      blocks.push({ t: type, v: n.text, region, runs: [{ text: n.text, href: href || undefined }], href: href || undefined });
    }
    lastKey = key;
  }

  const model = {
    source: src,
    head: {
      title: one(/<title>[\s\S]*?<\/title>/i),
      description: one(/<meta[^>]+name="description"[^>]*>/i),
      canonical: one(/<link[^>]+rel="canonical"[^>]*>/i),
      robots: one(/<meta[^>]+name="robots"[^>]*>/i),
      og: head.match(/<meta[^>]+property="og:[^>]*>/gi) || [],
      twitter: head.match(/<meta[^>]+name="twitter:[^>]*>/gi) || [],
      jsonld: html.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [],
    },
    internalHrefs: [...new Set([...html.matchAll(/href="([^"]+)"/g)].map((m) => m[1])
      .filter((h) => /^\/|^[a-z0-9-]+(\.html)?(#|$|\/)/i.test(h) && !/^https?:|^tel:|^mailto:|^#/.test(h)))].sort(),
    blocks: blocks.filter((b) => b.region === 'main'),
    nav: blocks.filter((b) => b.region === 'nav'),
    footer: blocks.filter((b) => b.region === 'footer'),
  };
  fs.writeFileSync(out, JSON.stringify(model, null, 2));
  const c = (t) => model.blocks.filter((b) => b.t === t).length;
  console.log(`${src} -> ${out}`);
  console.log(`  head: title/desc/canonical/robots ${['title', 'description', 'canonical', 'robots'].map((k) => (model.head[k] ? 'y' : 'N')).join('')}  og ${model.head.og.length}  tw ${model.head.twitter.length}  JSON-LD ${model.head.jsonld.length}`);
  console.log(`  main blocks ${model.blocks.length}: h1 ${c('h1')}, h2 ${c('h2')}, h3 ${c('h3')}, h4 ${c('h4')}, p ${c('p')}, li ${c('li')}, text ${c('text')}`);
  console.log(`  nav blocks ${model.nav.length}   footer blocks ${model.footer.length}   internal hrefs ${model.internalHrefs.length}`);
}
main();
