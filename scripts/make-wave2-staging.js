#!/usr/bin/env node
/**
 * make-wave2-staging.js — place wave 2 pages into build/staging alongside the
 * homepage, WITHOUT touching the homepage itself.
 *
 * Each page is built with ../../ asset paths (it lives two levels down in the
 * repo). On staging it sits one level down, at /<slug>/, so the paths become
 * ../ . The A23 version strings are re-asserted against the files that ship.
 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const PAGES = [['diagnostic-assessment', 'build/wave2/diagnostic-assessment/index.html']];
const OUT = 'build/staging';
if (!fs.existsSync(path.join(OUT, 'index.html'))) throw new Error('build/staging has no homepage — run make-staging-build.js first');

const homeBefore = crypto.createHash('sha256').update(fs.readFileSync(path.join(OUT, 'index.html'))).digest('hex');

const hash = (f) => crypto.createHash('sha256').update(fs.readFileSync(f)).digest('hex').slice(0, 8);
const CSS_V = hash('css/site.css');
const WA_V = hash('js/contact-whatsapp.js');

for (const [slug, src] of PAGES) {
  let html = fs.readFileSync(src, 'utf8');
  const before = html;
  html = html.replace(/(href|src)="\.\.\/\.\.\/(css|js)\//g, '$1="../$2/');
  if (html === before) throw new Error(`${slug}: no ../../ asset path found to rewrite`);
  if (/\.\.\/\.\.\//.test(html)) throw new Error(`${slug}: a ../../ path survived the rewrite`);

  for (const [ref, want] of [['css/site.css', CSS_V], ['js/contact-whatsapp.js', WA_V]]) {
    const m = new RegExp(`\\.\\./${ref.replace(/[./]/g, '\\$&')}\\?v=([0-9a-f]{8})`).exec(html);
    if (!m) throw new Error(`${slug}: no versioned reference to ${ref}`);
    if (m[1] !== want) throw new Error(`${slug}: ${ref} referenced ?v=${m[1]} but the shipped file is ${want}`);
  }
  if (!/content="noindex, nofollow"/.test(html)) throw new Error(`${slug}: staging must be noindex`);

  const dir = path.join(OUT, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), html);
  console.log(`  ${dir}/index.html  ${Buffer.byteLength(html)} B   css ?v=${CSS_V}  js ?v=${WA_V}`);
}

const homeAfter = crypto.createHash('sha256').update(fs.readFileSync(path.join(OUT, 'index.html'))).digest('hex');
if (homeBefore !== homeAfter) throw new Error('the staging homepage changed — it must not');
console.log(`  staging homepage untouched: ${homeAfter.slice(0, 16)}`);
