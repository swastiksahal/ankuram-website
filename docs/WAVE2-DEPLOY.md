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

---

# W2.2 /how-we-teach — DEPLOYED TO STAGING 21 September 2026

Built in a previous session, which was blocked at the first server write by the
SSH IPv6 failure. That is now fixed (`-4`), and this session deployed the build.

## Live path, confirmed before uploading

`public_html/how-we-teach.html`, a flat file at the web root. `/how-we-teach`
returns 200 directly; `/how-we-teach.html` and `/how-we-teach/` both 301 to it.
**Assets resolve relative to the WEB ROOT** (`css/site.css`), not to a
subdirectory — the same shape as `/diagnostic-assessment`. The URL does not
change. The only `.htaccess` line naming the page is an unrelated legacy 301
from a long slug, untouched.

## The one-word difference: 2036 vs a baseline of 2037

The extra word in the baseline is **the literal string `&rarr;`**, and it is not
a word.

`public_html/how-we-teach.html` contains, once:
`<a href="/diagnostic-assessment">Learn more about the diagnostic assessment &rarr;</a>`

`scripts/fingerprint.js` has no `rarr` in its `ENTITIES` table, so its text
extraction leaves the raw `&rarr;` in place. The token contains letters, so its
word counter counts it. The baseline 2037 therefore includes one token that is
an un-decoded HTML entity.

The rebuild decodes it to the actual arrow character: 0 occurrences of `&rarr;`,
1 of `→`. `→` has no letters or digits, so the same counter correctly skips it.
**2036 is the right number and the baseline was one too high. No content was
lost.** Confirmed by running the real `fingerprint.js` on the byte-identical
file (31965 bytes, sha256 `d3d2b66e…`, unchanged since the 16 Sep snapshot) and
by a token-level diff.

The other token deltas are the shared header chrome, as on W2.1: the build adds
"Skip to content", "ANKURAM", "Menu" and drops one "Call Now" plus one phone
repetition, the latter from the sticky `mobile-cta-bar` that A6 removes on all
non-paid pages. The phone survives 3 times with 3 `tel:` links.

## Two corrections made to the inherited build

1. **Staging pages carried `index, follow`.** The W2.2 assembler builds staging
   from the production artifacts, so all three pages, including the homepage,
   lost the staging `noindex` meta they previously had. The 401 and the
   `X-Robots-Tag` header are the real protection, but `make-staging-build.js`
   asserts the meta and every earlier staging build carried it. The assembler
   now rewrites it to `noindex, nofollow` and throws if it cannot.
2. **A stale `diagnostic-assessment/` directory shadowed the flat file.** With
   both present, mod_dir 301s `/diagnostic-assessment` to
   `/diagnostic-assessment/`, so staging returned 301 where production returns
   200 — staging stopped mirroring the route it exists to prove. Verified on the
   server, then the directory was removed from staging and the assembler no
   longer creates it.

## Verification

Head parity against the live page: title, description, canonical byte-identical;
9 og, 4 twitter, **both JSON-LD blocks** byte-identical. All 10 live H2s and all
28 live H3s present **as headings**, 0 missing. All 14 baseline internal links
present.

Three staging pages render, overflow 0 at 390 and 1440, all four inline handlers
`typeof=function`, **zero console errors** on every page:

| page | 390 | 1440 |
|---|---|---|
| homepage | 12743px | 13059px |
| /diagnostic-assessment | 7465px | 5903px |
| /how-we-teach | 9233px | 7006px |

FAQ accordion on /how-we-teach, 7 `<details>`: starts closed, opens, closes,
`<h3>` inside the `<summary>`, tap target 356x65 — **with JavaScript enabled and
disabled**, no errors either way.

Staging entrances 401 across three passes, and both new pages 401.

**Production untouched**, proven by hash:

```
8c7ac696…  index.html                  unchanged
d67f598b…  diagnostic-assessment.html  unchanged
d3d2b66e…  how-we-teach.html           unchanged, still the OLD page
74f43a22…  css/site.css                unchanged
48cfc005…  .htaccess                   unchanged
43ed0d0e…  robots.txt                  unchanged
9f13ea4f…  sitemap.xml                 unchanged
```

Screenshots: `design/screens/how-we-teach-390.png`, `how-we-teach-1440.png`.

---

# W2.2 /how-we-teach — DEPLOYED TO PRODUCTION 21 September 2026

Single session confirmed before starting: local and origin both at `ad964f5`,
no divergence, clean tree.

## The file list — four files, worked out and stated before uploading

`css/site.css` gained 43 lines for this page, moving its content hash. Under A23
every page referencing it embeds that hash, so all three HTML pages had to ship
with the stylesheet or they would request a version string that no longer
describes it. Confirmed by grepping production: `index.html` and
`diagnostic-assessment.html` both carried `?v=74f43a22`.

| file | before | after |
|---|---|---|
| `css/site.css` | `74f43a22a6357fbf…` | `ef951be3698a6da6…` |
| `index.html` | `8c7ac696f107118c…` | `e41b3f39818c2f5b…` |
| `diagnostic-assessment.html` | `d67f598b0043e734…` | `ef6521184ea16a09…` |
| `how-we-teach.html` | `d3d2b66e30f02fe5…` | `c303adb5efad147e…` |

Not uploaded, and byte-identical after: `js/contact-whatsapp.js` (`5f7ccd03…`),
`.htaccess`, `robots.txt`, `sitemap.xml`, `styles.css`, `script.js`.

All three pages reference `css/site.css?v=ef951be3`. The A23 guard earned its
keep during the build: it refused to produce `diagnostic-assessment.html` while
it still carried `?v=74f43a22`, forcing the rebuild rather than shipping a stale
version string.

Backup: `~/backups/public_html-pre-w22-20260921-143342.tar.gz`, 1.5M, 196
entries, verified to contain all four files. Uploaded stylesheet first, then
how-we-teach, then diagnostic, then index.html. No delete flag.

## The two pages already live — zero pixel delta

The 43 new CSS rules each require a `w2-teach-*` class. `index.html` and
`diagnostic-assessment.html` contain **0** such classes; only the new page uses
them, 23 distinct. Proven by rendering, not by reading:

The pre-W2.2 state was reconstructed from git (`ad964f5` artifacts + `876cfd5`
stylesheet) and verified to match the hashes that were live: diagnostic
`d67f598b`, index `8c7ac696`, css `74f43a22`. Rendered locally, then diffed
against the live pages now:

```
homepage               390px    3dfd0bf322406623c998cf0c  /  3dfd0bf322406623c998cf0c   ZERO
homepage              1440px    7eeb410e2680752c1ccc8f40  /  7eeb410e2680752c1ccc8f40   ZERO
diagnostic-assessment  390px    5bdfabbd58a0001fd74f3c37  /  5bdfabbd58a0001fd74f3c37   ZERO
diagnostic-assessment 1440px    a65c0c5c09b7d7713dc664b4  /  a65c0c5c09b7d7713dc664b4   ZERO
```

Homepage `parity.js` ALL PASS 107.4%, head parity ALL PASS. Diagnostic wave-2
parity ALL PASS: 32 h3 retained, 1318/1317 words, 11/11 destinations, 23 link
occurrences, FAQ h3 nested.

## Edge, under A23

```
css/site.css?v=ef951be3     expected ef951be3
  mum-edge10 ef951be3 CURRENT MISS      mum-edge6 ef951be3 CURRENT HIT age=12
  mum-edge8  ef951be3 CURRENT HIT age=11 mum-edge9 ef951be3 CURRENT MISS
  mum-edge5  ef951be3 CURRENT MISS      mum-edge7 ef951be3 CURRENT MISS
  6 nodes, stale: 0
```

16/16 clean loads of each of the three live pages, no cache-busting.
**No purge is needed and none was performed.**

## The new page, live

`/how-we-teach` 200 with 0 redirect hops; `.html` and trailing-slash forms 301
to it. No `how-we-teach/` directory exists, so nothing shadows the flat file.

Head byte-identical to baseline: title, description, canonical, robots, 9 og,
4 twitter, **both JSON-LD blocks**. All 10 live H2s and all 28 live H3s present
as headings, 0 missing. All 14 internal destinations present.

**Link occurrences: 28, not 27.** The old live page also has 28, across the same
14 destinations, and a per-destination comparison shows no difference at all.
The 27 in the brief was one short; nothing was lost.

FAQ, 7 `<details>`: starts closed, opens, closes, `<h3>` inside the `<summary>`,
tap target 356x65 — with JavaScript **enabled and disabled**, no errors either
way. `check-inline-handlers` passes against the live URL: `trackPhoneClick`
resolves. No console errors.

## Rollback — ready, not run. All four together.

```bash
ssh -4 -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4 \
  "cd ~/domains/ankuramtuition.com && tar -xzf ~/backups/public_html-pre-w22-20260921-143342.tar.gz \
     public_html/css/site.css public_html/index.html public_html/diagnostic-assessment.html public_html/how-we-teach.html \
   && cd public_html && sha256sum css/site.css index.html diagnostic-assessment.html how-we-teach.html"
# 74f43a22…  css/site.css
# 8c7ac696…  index.html
# d67f598b…  diagnostic-assessment.html
# d3d2b66e…  how-we-teach.html
```

They must be restored TOGETHER. The stylesheet and the three pages are bound by
the A23 version string: restoring the CSS alone would leave three pages asking
for `?v=ef951be3`, and restoring a page alone would leave it asking for
`?v=74f43a22`. Either half-rollback serves a version string that does not
describe the stylesheet on disk.
