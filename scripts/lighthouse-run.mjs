#!/usr/bin/env node
/**
 * lighthouse-run.mjs — mobile + desktop Lighthouse on the P0d target pages.
 *
 * Usage: node scripts/lighthouse-run.mjs [outDir]
 *
 * Targets: the homepage, the 4 paid Ads landing pages, and the 5 largest pages
 * by byte size. Runs one audit at a time so the numbers are not skewed by
 * competing load. JSON reports land in baseline/lighthouse/ (gitignored);
 * the score summary is written to baseline/lighthouse-summary.json.
 */

import fs from 'fs';
import path from 'path';
import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

const SITE = 'https://ankuramtuition.com';
const outDir = process.argv[2] || 'baseline/lighthouse';

const PAID = [
  '/online-tuition-class-10-cbse/',
  '/online-maths-tuition-class-10-cbse/',
  '/online-science-tuition-class-10-cbse/',
  '/cbse-class-10/',
];

function targets() {
  const fp = JSON.parse(fs.readFileSync('baseline/seo-fingerprint.json', 'utf8'));
  const biggest = fp.pages
    .slice()
    .sort((a, b) => b.bytes - a.bytes)
    .slice(0, 5)
    .map((p) => p.url);

  const list = [];
  const seen = new Set();
  const add = (url, why) => {
    if (seen.has(url)) return;
    seen.add(url);
    list.push({ url, why });
  };
  add('/', 'homepage');
  PAID.forEach((u) => add(u, 'paid'));
  biggest.forEach((u) => add(u, 'largest'));
  return list;
}

const slug = (url) => {
  const s = url.replace(/^\//, '').replace(/\/$/, '');
  return s === '' ? 'home' : s.replace(/\//g, '-').replace(/[^a-zA-Z0-9._-]/g, '_');
};

const DESKTOP = {
  formFactor: 'desktop',
  screenEmulation: { mobile: false, width: 1350, height: 940, deviceScaleFactor: 1, disabled: false },
  throttling: { rttMs: 40, throughputKbps: 10240, cpuSlowdownMultiplier: 1 },
};

async function run(url, mode, port) {
  const opts = {
    port,
    output: 'json',
    logLevel: 'error',
    onlyCategories: ['performance', 'accessibility', 'best-practices', 'seo'],
  };
  const config = {
    extends: 'lighthouse:default',
    settings: mode === 'desktop' ? DESKTOP : {},
  };
  const res = await lighthouse(SITE + url, opts, config);
  return res;
}

const num = (v, d = 0) => (typeof v === 'number' ? Number(v.toFixed(d)) : null);

(async () => {
  fs.mkdirSync(outDir, { recursive: true });
  const list = targets();
  console.log(`${list.length} pages x 2 modes = ${list.length * 2} audits`);

  const chrome = await chromeLauncher.launch({
    chromeFlags: ['--headless=new', '--no-sandbox', '--disable-gpu'],
  });

  const summary = [];
  for (const t of list) {
    for (const mode of ['mobile', 'desktop']) {
      const label = `${t.url} [${mode}]`;
      try {
        const res = await run(t.url, mode, chrome.port);
        const lhr = res.lhr;
        const file = path.join(outDir, `${slug(t.url)}-${mode}.json`);
        fs.writeFileSync(file, JSON.stringify(lhr));

        summary.push({
          url: t.url,
          why: t.why,
          mode,
          performance: num(lhr.categories.performance.score * 100),
          accessibility: num(lhr.categories.accessibility.score * 100),
          bestPractices: num(lhr.categories['best-practices'].score * 100),
          seo: num(lhr.categories.seo.score * 100),
          lcpMs: num(lhr.audits['largest-contentful-paint'].numericValue),
          cls: num(lhr.audits['cumulative-layout-shift'].numericValue, 3),
          totalBytes: num(lhr.audits['total-byte-weight'].numericValue),
          file: path.basename(file),
        });
        console.log(`  ${label} perf=${summary.at(-1).performance} a11y=${summary.at(-1).accessibility} seo=${summary.at(-1).seo}`);
      } catch (e) {
        console.log(`  ${label} FAILED: ${e.message.split('\n')[0]}`);
        summary.push({ url: t.url, why: t.why, mode, error: e.message.split('\n')[0] });
      }
    }
  }

  await chrome.kill();
  fs.writeFileSync('baseline/lighthouse-summary.json', JSON.stringify({ generatedAt: new Date().toISOString(), summary }, null, 2));
  console.log(`wrote baseline/lighthouse-summary.json (${summary.length} rows)`);
})();
