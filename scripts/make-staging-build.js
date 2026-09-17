#!/usr/bin/env node
/**
 * make-staging-build.js — assemble build/staging: the finished Direction C
 * homepage plus css/site.css, and nothing else.
 *
 * The design page links ../../css/site.css because it lives two levels down in
 * the repo. On staging the page is the document root, so that href is rewritten
 * to css/site.css and the stylesheet is copied alongside it.
 *
 * Usage: node scripts/make-staging-build.js
 */

const fs = require('fs');
const path = require('path');

const OUT = 'build/staging';
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'css'), { recursive: true });

let html = fs.readFileSync('design/direction-c/index.html', 'utf8');

const hrefRe = /href="\.\.\/\.\.\/css\/site\.css"/g;
const found = (html.match(hrefRe) || []).length;
if (found !== 1) throw new Error(`expected exactly 1 site.css href, found ${found}`);
html = html.replace(hrefRe, 'href="css/site.css"');

if (/<img\b/i.test(html)) throw new Error('A9 violation: an <img> is present');
if (!/content="noindex, nofollow"/.test(html)) throw new Error('robots meta missing');

fs.writeFileSync(path.join(OUT, 'index.html'), html);
fs.copyFileSync('css/site.css', path.join(OUT, 'css', 'site.css'));
// script.js drives the finder, the contact form and the reviews block
fs.copyFileSync('public_html/script.js', path.join(OUT, 'script.js'));

// Any reference that is not the stylesheet, an anchor, a tel:, or an absolute
// URL would be a file we have not shipped.
const refs = [...html.matchAll(/(?:src|href)="([^"]+)"/g)].map((m) => m[1]);
const SHIPPED = ['css/site.css', 'script.js'];
const unshipped = refs.filter((r) => !/^(#|tel:|https?:|\/)/.test(r) && !SHIPPED.includes(r));
if (unshipped.length) throw new Error('unshipped local references: ' + unshipped.join(', '));

const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    e.isDirectory() ? walk(f) : files.push({ f, bytes: fs.statSync(f).size });
  }
})(OUT);

console.log('stylesheet href rewritten: 1');
console.log('robots meta: noindex, nofollow');
console.log('A9: no <img>');
files.forEach((x) => console.log(`  ${x.f}  ${x.bytes} B`));
console.log(`total ${files.reduce((a, x) => a + x.bytes, 0)} B in ${files.length} files`);
