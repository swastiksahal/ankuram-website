#!/usr/bin/env node
/**
 * make-production-build.js — derive build/production from build/staging.
 *
 * The production file is the staging file with exactly ONE difference: the
 * robots meta goes from the staging value to the live value, and the
 * "STAGING ONLY" comment above it is deleted. Nothing else may differ, so this
 * script edits the staging bytes rather than re-rendering the page, and then
 * proves the difference is only those two lines.
 *
 * Usage: node scripts/make-production-build.js
 */

const fs = require('fs');
const path = require('path');

const SRC = 'build/staging';
const OUT = 'build/production';

const STAGING_COMMENT = '<!-- STAGING ONLY: the live page is "index, follow". Staging must never be indexed. -->\n';
const STAGING_ROBOTS = '<meta name="robots" content="noindex, nofollow">';

// Taken from the live page, not retyped from memory.
const LIVE = fs.readFileSync('public_html/index.html', 'utf8');
const LIVE_ROBOTS = (/<meta[^>]+name="robots"[^>]*>/i.exec(LIVE) || [])[0];
if (!LIVE_ROBOTS) throw new Error('live robots meta not found');
if (!/content="index, follow"/.test(LIVE_ROBOTS)) {
  throw new Error(`live robots meta is not "index, follow": ${LIVE_ROBOTS}`);
}

const staging = fs.readFileSync(path.join(SRC, 'index.html'), 'utf8');

if (staging.split(STAGING_ROBOTS).length - 1 !== 1) throw new Error('expected exactly 1 staging robots meta');
if (staging.split(STAGING_COMMENT).length - 1 !== 1) throw new Error('expected exactly 1 STAGING ONLY comment');

const production = staging
  .replace(STAGING_COMMENT, '')
  .replace(STAGING_ROBOTS, LIVE_ROBOTS);

// ------------------------------------------------------------- prove the diff
const a = staging.split('\n');
const b = production.split('\n');
const removed = a.filter((l) => !b.includes(l));
const added = b.filter((l) => !a.includes(l));

if (production.includes('noindex')) throw new Error('production still contains "noindex"');
if (production.includes('STAGING ONLY')) throw new Error('production still contains "STAGING ONLY"');
if (!production.includes(LIVE_ROBOTS)) throw new Error('production robots meta not applied');

// Byte accounting: the two removed lines minus the one added line, exactly.
const delta = Buffer.byteLength(staging) - Buffer.byteLength(production);
const expectedDelta = Buffer.byteLength(STAGING_COMMENT) + Buffer.byteLength(STAGING_ROBOTS) - Buffer.byteLength(LIVE_ROBOTS);
if (delta !== expectedDelta) throw new Error(`byte delta ${delta}, expected ${expectedDelta} — something else changed`);

// A19 + A1: every tracking ID must survive into the production artifact.
for (const id of ['G-MQRSS8DKLE', 'AW-10954184691', 'uir8kpny76', 'NGIFCNbv3OAbEPOvruco', 'jucWCNPv3OAbEPOvruco']) {
  if (!production.includes(id)) throw new Error(`tracking: ${id} missing from the production build`);
}
for (const bad of ['G-KHP2PBXF6X', 'G-MQRSS8DKKE']) {
  if (production.includes(bad)) throw new Error(`tracking: forbidden ${bad} present`);
}
if (/<img\b/i.test(production)) throw new Error('A9 violation: an <img> is present');

// ------------------------------------------------------------------ write out
fs.rmSync(OUT, { recursive: true, force: true });
fs.mkdirSync(path.join(OUT, 'css'), { recursive: true });
fs.mkdirSync(path.join(OUT, 'js'), { recursive: true });
fs.writeFileSync(path.join(OUT, 'index.html'), production);
fs.copyFileSync(path.join(SRC, 'css', 'site.css'), path.join(OUT, 'css', 'site.css'));
fs.copyFileSync(path.join(SRC, 'js', 'contact-whatsapp.js'), path.join(OUT, 'js', 'contact-whatsapp.js'));

// script.js is NOT shipped: the live server already has its own at /script.js.
if (fs.existsSync(path.join(OUT, 'script.js'))) throw new Error('script.js must not be in the production build');

console.log(`live robots meta: ${LIVE_ROBOTS}`);
console.log(`lines removed: ${removed.length}   lines added: ${added.length}`);
removed.forEach((l) => console.log(`  - ${l}`));
added.forEach((l) => console.log(`  + ${l}`));
console.log(`bytes: staging ${Buffer.byteLength(staging)} -> production ${Buffer.byteLength(production)} (-${delta})`);
console.log('tracking: GA4 + Ads + Clarity + both conversion labels present');
const files = [];
(function walk(d) {
  for (const e of fs.readdirSync(d, { withFileTypes: true })) {
    const f = path.join(d, e.name);
    e.isDirectory() ? walk(f) : files.push({ f, bytes: fs.statSync(f).size });
  }
})(OUT);
files.forEach((x) => console.log(`  ${x.f}  ${x.bytes} B`));
console.log(`total ${files.reduce((a2, x) => a2 + x.bytes, 0)} B in ${files.length} files`);
