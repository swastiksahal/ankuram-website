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
  // Staging carries the meta noindex as well as the HTTP header and basic auth.
  // The header and the 401 are the real protection, but every earlier staging
  // build has carried the meta too, and make-staging-build.js asserts it. Losing
  // a layer silently is how a page ends up indexed the one time auth lapses.
  const liveRobots = /<meta name="robots" content="index, follow">/;
  if (!liveRobots.test(html)) throw Error(`${dest}: expected the live robots meta`);
  html = html.replace(liveRobots,
    '<!-- STAGING ONLY: the live page is "index, follow". Staging must never be indexed. -->\n<meta name="robots" content="noindex, nofollow">');
  if (!/content="noindex, nofollow"/.test(html)) throw Error(`${dest}: staging robots meta missing`);

  fs.writeFileSync(path.join(out, dest), html);
  console.log(`${out}/${dest}: css ${hash(assets[0])}, js ${hash(assets[1])}, robots noindex`);
}
// Staging is a flat-file mirror of production: /<slug> is served from
// <slug>.html by the extension-less rewrite. A <slug>/ directory must NOT
// exist, because mod_dir then 301s /<slug> to /<slug>/ and staging stops
// matching the production route it is meant to prove. Verified on the server.
console.log('Three staging pages assembled, flat files only. HTTP auth/noindex must remain enabled.');
