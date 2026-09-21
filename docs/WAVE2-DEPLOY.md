# WAVE 2 — deploy record

Roadmap: CLAUDE.md "## Wave roadmap". Wave 2 is 10 pages, not 11 —
`/curriculums` 301s to the homepage and is not a page.

---

# W2.1 /diagnostic-assessment — EXECUTED 20 September 2026

## Live path, confirmed BEFORE uploading

`public_html/diagnostic-assessment.html`, a flat file at the web root.

| URL | before | after |
|---|---|---|
| `/diagnostic-assessment` | 200 direct | **200 direct, no redirect** |
| `/diagnostic-assessment.html` | 301 → `/diagnostic-assessment` | 301 → `/diagnostic-assessment` |
| `/diagnostic-assessment/` | 301 → `/diagnostic-assessment` | 301 → `/diagnostic-assessment` |

The URL did not change. No `public_html/diagnostic-assessment/` directory was
created: `.htaccess` 301s the trailing-slash form, so a directory there would
collide with it. Verified absent before and after. Assets are referenced as
`css/site.css`, relative to the web root, because the page sits at the root.

## Step 1 — backup

`~/backups/public_html-pre-w2-20260920-061825.tar.gz`, 1.5M, 196 entries,
verified to contain `index.html`, `css/site.css` and `diagnostic-assessment.html`.

## Steps 2 and 4 — hashes before and after

| file | before | after | |
|---|---|---|---|
| `.htaccess` | `4587cf66…` | `4587cf66…` | unchanged |
| `robots.txt` | `43ed0d0e…` | `43ed0d0e…` | unchanged |
| `sitemap.xml` | `6d9d9940…` | `6d9d9940…` | unchanged |
| `styles.css` | `c75ae294…` | `c75ae294…` | unchanged |
| `script.js` | `1bf4f312…` | `1bf4f312…` | unchanged |
| `js/contact-whatsapp.js` | `5f7ccd03…` | `5f7ccd03…` | unchanged, not uploaded |
| `index.html` | `cfe08857…` | **`8c7ac696…`** | changed, A23 string only |
| `css/site.css` | `ca460165…` | **`74f43a22…`** | changed |
| `diagnostic-assessment.html` | `91b6edce…` | **`d67f598b…`** | changed |

All three new hashes equal the local builds exactly. Uploaded in order:
`css/site.css`, then the page, then `index.html` last. No `--delete`.

## The homepage — the risk in this deploy

**Pixel delta ZERO.** Full-page screenshots of the LIVE homepage, before and
after, are byte-identical at both widths:

```
390px   pre 3dfd0bf322406623c998cf0cc2480774   post 3dfd0bf322406623c998cf0cc2480774
1440px  pre 7eeb410e2680752c1ccc8f40c8bd269d   post 7eeb410e2680752c1ccc8f40c8bd269d
```

The live homepage requests `css/site.css?v=74f43a22` and receives it, 200.

Full live regression: 16/16 clean loads, all four inline handlers
`typeof=function`, no console errors. Curricula fold opens and closes with
JavaScript enabled AND disabled, 9 chips, sets International/Indian. Hero band
absent. `id="curricula"` present. All six anchor ids. Grade lists all match.
Grades 1-5 + IB PYP submits with "Curriculum: IB PYP", GA4 `form_submission` 1,
dataLayer 1, Ads `jucWCNPv3OAbEPOvruco` 1. tel: `phone_call_click` 1 +
`NGIFCNbv3OAbEPOvruco` 1. wa.me `whatsapp_click` 1 + label 1. CTA `cta_click` 1
with no Ads conversion. Nothing twice.
parity.js ALL PASS 107.4%, head parity ALL PASS, overflow 0 at six widths,
Lighthouse mobile 94 desktop 100, a11y 100/100, CLS 0.

## Edge — A23 on the new stylesheet hash

```
css/site.css?v=74f43a22                 expected 74f43a22
  mum-edge5  74f43a22 CURRENT MISS   63566 B
  mum-edge7  74f43a22 CURRENT HIT    63566 B
  mum-edge4  74f43a22 CURRENT MISS   63566 B
  mum-edge6  74f43a22 CURRENT MISS   63566 B
  mum-edge8  74f43a22 CURRENT MISS   63566 B
  mum-edge9  74f43a22 CURRENT MISS   63566 B
  7 requests, 6 nodes, stale: 0
```

16/16 clean loads of the homepage and 16/16 of `/diagnostic-assessment`, no
cache-busting. **No purge is needed and none was performed.**

## The new page, live

Title, meta description, canonical, robots and all 3 JSON-LD blocks
byte-identical to baseline. 9 H2s and 32 H3s all present as headings, 0 missing.
All 11 baseline internal links present. FAQ opens and closes with JavaScript
disabled, the `<h3>` inside each `<summary>`, tap target 356x65. No console
errors. `check-inline-handlers` passes against the live URL: `trackPhoneClick`
resolves.

## Rollback — ready, not run. All three files together.

```bash
ssh -4 -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4 \
  "cd ~/domains/ankuramtuition.com && tar -xzf ~/backups/public_html-pre-w2-20260920-061825.tar.gz public_html/index.html public_html/css/site.css public_html/diagnostic-assessment.html && cd public_html && sha256sum index.html css/site.css diagnostic-assessment.html"
# cfe08857…  index.html
# ca460165…  css/site.css
# 91b6edce…  diagnostic-assessment.html
```

They must be restored TOGETHER: `index.html` references `css/site.css?v=74f43a22`
and the old stylesheet is `ca460165`, so restoring one without the other leaves
the page asking for a version that no longer exists.

---

## Flagged, not fixed: the IB PYP chip points at a redirect

`.htaccess` line 39 is `RewriteRule ^ib-pyp-tuition-hyderabad/?$ /ib-myp-tuition-hyderabad [L,R=301]`,
so the IB PYP chip added to the homepage in A22/A24 resolves to the IB MYP page.
`baseline/live-http.csv` records the 301 and APPROVED-CHANGES already lists
`ib-pyp-tuition-hyderabad.html` among unreachable files. I should have caught
this when adding the chip. Fixing it means either removing that rewrite, which
is an unapproved `.htaccess` change, or repointing the chip. Needs a decision.

---

## W2.2 /how-we-teach — 21 September 2026 — NOT DEPLOYED

The staging candidate is built and locally verified. Full evidence and the
resume commands are in [W2.2-REPORT.md](W2.2-REPORT.md).

- Flat `how-we-teach.html`; live slashless 200 and both `.html`/slash 301s checked.
- 10/10 H2, 28/28 H3, 14/14 internal href destinations, 27/27 occurrences.
- Words 2,036 / 2,037 (99.95%); no new body copy; both JSON-LD blocks unchanged.
- All four homepage/diagnostic 390/1440 live comparisons: 0 changed pixels.
- CSS +43/-0 lines; original bytes unchanged. A23 CSS ef951be3, JS 5f7ccd03.
- Lighthouse mobile/desktop 99/100; a11y 100/100; SEO 100/100; CLS 0/0.
- Six-width overflow 0, console errors 0, runtime inline-handler checks PASS.
- Deployment stopped at the first read-only SSH operation: Network is unreachable.
  No staging or production write occurred. Current staging entrances both 401.
