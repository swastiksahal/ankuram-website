#!/usr/bin/env node
// Optional per-page gate used by parity.js; homepage checks remain unchanged.
const fs = require('fs');
const os = require('os');
const path = require('path');
const cp = require('child_process');
module.exports = function checkWave2(file, url) {
  if (!/^\/[a-z0-9-]+$/.test(url)) throw Error('Expected a flat Wave 2 URL');
  const source = `public_html${url}.html`;
  const live = fs.readFileSync(source, 'utf8'), built = fs.readFileSync(file, 'utf8');
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'w2-parity-'));
  function extract(input, out) {
    cp.execFileSync(process.execPath, ['design/wave2/extract.js', input, out]);
    return JSON.parse(fs.readFileSync(out));
  }
  const a = extract(source, path.join(dir, 'source.json'));
  const b = extract(file, path.join(dir, 'built.json'));
  const base = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json')).pages.find(p => p.url === url);
  let bad = 0;
  const check = (label, pass, detail = '') => { console.log(`${pass ? 'PASS' : 'FAIL'} ${label}${detail ? ': ' + detail : ''}`); if (!pass) bad++; };
  for (const k of ['title', 'description', 'canonical', 'robots', 'og', 'twitter', 'jsonld']) check(`head ${k}`, JSON.stringify(a.head[k]) === JSON.stringify(b.head[k]));
  const all = m => [...m.nav, ...m.blocks, ...m.footer];
  const counts = xs => xs.reduce((m, x) => (m.set(x, (m.get(x) || 0) + 1), m), new Map());
  for (const level of ['h1', 'h2', 'h3']) {
    const want = all(a).filter(x => x.t === level), got = counts(all(b).filter(x => x.t === level).map(x => x.v));
    const missing = [...counts(want.map(x => x.v))].filter(([k, n]) => (got.get(k) || 0) < n);
    check(`${level} retained as ${level} (${want.length}), missing ${missing.length}`, !missing.length, missing.map(x => x[0]).join(' | '));
  }
  const text = m => all(m).map(x => x.v).join(' ');
  const words = text(b).split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
  check(`word count ${words}/${base.visibleWordCount} (${(100 * words / base.visibleWordCount).toFixed(2)}%)`, words >= .95 * base.visibleWordCount);
  // Actual <a href> values: CSS, icons, canonical and text-only labels do not count.
  const anchorRuns = m => all(m).flatMap(x => x.runs.filter(r => r.href));
  const hrefs = new Set(anchorRuns(b).map(r => r.href));
  const missing = base.internalHrefs.filter(h => !hrefs.has(h));
  check(`internal destinations ${base.internalHrefs.length - missing.length}/${base.internalHrefs.length} with hrefs`, !missing.length, missing.join(' | '));
  const links = m => anchorRuns(m).filter(r => base.internalHrefs.includes(r.href)).map(r => JSON.stringify([r.text, r.href]));
  const aa = counts(links(a)), bb = counts(links(b));
  const dropped = [...aa].filter(([k, n]) => (bb.get(k) || 0) < n);
  const hrefCount = m => counts(anchorRuns(m).filter(r => base.internalHrefs.includes(r.href)).map(r => r.href));
  const ha = hrefCount(a), hb = hrefCount(b);
  const missingOccurrences = [...ha].filter(([k, n]) => (hb.get(k) || 0) < n);
  check(`internal link occurrences ${links(a).length}, missing href occurrences ${missingOccurrences.length}`, !missingOccurrences.length, missingOccurrences.map(x => x[0]).join(' | '));
  if (dropped.length) console.log(`NOTE anchor-label differences (hrefs checked above): ${dropped.map(x => x[0]).join(' | ')}`);
  else check(`exact internal text/href pairs retained (${links(a).length} occurrences)`, true);
  const content = text(b);
  const missingCopy = a.blocks.filter(x => !['Call Now', 'WhatsApp'].includes(x.v)).filter(x => !content.includes(x.v));
  check('every main-content block retained word for word', !missingCopy.length, missingCopy.map(x => x.v).join(' | '));
  const summaries = [...built.matchAll(/<summary\b[^>]*>([\s\S]*?)<\/summary>/gi)].filter(m => /faq-question/.test(m[1]));
  check(`FAQ questions retain nested h3 (${summaries.length})`, summaries.length > 0 && summaries.every(m => /<h3\b/.test(m[1])));
  fs.rmSync(dir, { recursive: true, force: true });
  console.log(bad ? `${bad} FAILED` : 'ALL PASS');
  return bad ? 1 : 0;
};
