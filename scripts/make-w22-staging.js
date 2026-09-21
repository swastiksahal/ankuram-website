#!/usr/bin/env node
// W2.2 staging assembly. Preserves the live head (including meta robots) and
// relies on the existing staging HTTP noindex header + basic auth, verified
// on BOTH staging entrances. This script never writes to a remote server.
const fs = require('fs');
const crypto = require('crypto');
const path = require('path');
const out = 'build/staging';
const hash = f => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
const assets = ['css/site.css', 'js/contact-whatsapp.js'];
for (const f of [...assets, 'script.js']) {
  const dest = path.join(out, f);
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(f === 'script.js' ? 'public_html/script.js' : f, dest);
}
const pages = [
  ['build/production/index.html', 'index.html'],
  ['build/wave2-production/diagnostic-assessment.html', 'diagnostic-assessment.html'],
  ['build/wave2/how-we-teach.html', 'how-we-teach.html'],
];
for (const [src, dest] of pages) {
  let html = fs.readFileSync(src, 'utf8');
  for (const f of assets) {
    const re = new RegExp(`${f.replace(/[.]/g, '\\.')}\\?v=[0-9a-f]{8}`, 'g');
    if ((html.match(re) || []).length !== 1) throw Error(`${dest}: expected one versioned ${f}`);
    html = html.replace(re, `${f}?v=${hash(f)}`);
    if (hash(path.join(out, f)) !== hash(f)) throw Error(`Asset mismatch ${f}`);
  }
  fs.writeFileSync(path.join(out, dest), html);
  console.log(`${out}/${dest}: css ${hash(assets[0])}, js ${hash(assets[1])}`);
}
// Older staging has a diagnostic directory. Keep its existing route rendering
// identically while adding the canonical flat-file candidate alongside it.
let diagnostic = fs.readFileSync(path.join(out, 'diagnostic-assessment.html'), 'utf8')
  .replace(/(href|src)="(css|js)\//g, '$1="../$2/');
fs.mkdirSync(path.join(out, 'diagnostic-assessment'), { recursive: true });
fs.writeFileSync(path.join(out, 'diagnostic-assessment/index.html'), diagnostic);
console.log('Three staging pages assembled. HTTP auth/noindex must remain enabled.');
