#!/usr/bin/env node
/**
 * make-wave2-production.js — production build of a wave 2 page.
 *
 * The live page is a FLAT FILE at the web root (public_html/<slug>.html) and
 * the URL /<slug> is served from it extension-lessly. So the production file
 * must sit at the root and reference assets as css/... , not ../css/... .
 * Creating a <slug>/ directory would collide with the .htaccess rule that 301s
 * /<slug>/ to /<slug>, so the output is deliberately a single .html file.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PAGES = [['diagnostic-assessment', 'build/wave2/diagnostic-assessment/index.html']];
const OUT = 'build/wave2-production';
fs.mkdirSync(OUT, { recursive: true });

const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
const CSS_V = hash('css/site.css');
const WA_V = hash('js/contact-whatsapp.js');

for (const [slug, src] of PAGES) {
  let html = fs.readFileSync(src, 'utf8');
  const live = fs.readFileSync(`public_html/${slug}.html`, 'utf8');

  // assets: ../../css/... -> css/...  (the page sits at the web root)
  html = html.replace(/(href|src)="\.\.\/\.\.\/(css|js)\//g, '$1="$2/');
  if (/\.\.\//.test(html)) throw new Error(`${slug}: a ../ path survived`);

  // robots: back to the live value, and drop the staging comment
  const liveRobots = (/<meta[^>]+name="robots"[^>]*>/i.exec(live) || [])[0];
  if (!liveRobots) throw new Error(`${slug}: live page has no robots meta`);
  html = html.replace(/<!-- STAGING ONLY[\s\S]*?-->\n?/, '')
    .replace(/<meta name="robots" content="noindex, nofollow">/, liveRobots);
  if (/noindex|STAGING ONLY/.test(html)) throw new Error(`${slug}: staging marker survived`);

  for (const [ref, want] of [['css/site.css', CSS_V], ['js/contact-whatsapp.js', WA_V]]) {
    const m = new RegExp(`${ref.replace(/[./]/g, '\\$&')}\\?v=([0-9a-f]{8})`).exec(html);
    if (!m || m[1] !== want) throw new Error(`${slug}: ${ref} ?v=${m && m[1]} but shipped file is ${want}`);
  }
  // head must still be byte-identical to live
  for (const [name, re] of [['title', /<title>[\s\S]*?<\/title>/i], ['description', /<meta[^>]+name="description"[^>]*>/i], ['canonical', /<link[^>]+rel="canonical"[^>]*>/i], ['robots', /<meta[^>]+name="robots"[^>]*>/i]]) {
    const a = (re.exec(live) || [])[0]; const b = (re.exec(html) || [])[0];
    if (a !== b) throw new Error(`${slug}: ${name} differs\n  live: ${a}\n  new : ${b}`);
  }
  const ld = (h) => h.match(/<script[^>]+application\/ld\+json[^>]*>[\s\S]*?<\/script>/gi) || [];
  if (JSON.stringify(ld(live)) !== JSON.stringify(ld(html))) throw new Error(`${slug}: JSON-LD differs`);

  const out = path.join(OUT, `${slug}.html`);
  fs.writeFileSync(out, html);
  console.log(`  ${out}  ${Buffer.byteLength(html)} B`);
  console.log(`    robots: ${liveRobots}`);
  console.log(`    css/site.css?v=${CSS_V}   js/contact-whatsapp.js?v=${WA_V}`);
  console.log(`    head byte-identical to public_html/${slug}.html: title, description, canonical, robots, ${ld(live).length} JSON-LD`);
  console.log(`    sha256 ${crypto.createHash('sha256').update(fs.readFileSync(out)).digest('hex')}`);
}
