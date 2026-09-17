# P1 — Architecture proposal

Proposal only. Nothing here is built or deployed until Swastik approves it.
Every number cited comes from the P0a–P0d baseline in `baseline/`.

---

## 1. Build approach

**Choice: a small plain-Node build (`scripts/build.js`, ~250 lines). Not Eleventy.**

The build reads a per-page data file, renders it through a layout and partials,
and writes the result to a path taken **literally** from a manifest.

```
src/
  layouts/base.html          one layout, {{slots}}
  partials/header.html  footer.html  tracking.html  nap.html
  pages/<slug>.json          { outPath, title, meta, blocks: [...] }
  blocks/<slug>/*.html       the page's own words, extracted verbatim
scripts/build.js             renders src/ -> dist/
dist/                        byte-for-byte what uploads to public_html
```

**Why not Eleventy.** Eleventy is the obvious default and I considered it
seriously. The deciding factor is invariant 1: no URL may change, and this site
has **three** path conventions living side by side:

| Convention | Count | Example |
|---|---|---|
| `name.html` at the root | 41 | `how-we-teach.html` |
| `folder/index.html` | 24 | `about/index.html` |
| `folder/name.html` | 28 | `areas/ameerpet.html`, `class-8-maths/terms.html` |

Eleventy's permalink logic wants to normalise that mix; getting it back out
verbatim requires an explicit `permalink` on all 93 pages, at which point the
permalink list *is* the manifest and Eleventy's routing is dead weight sitting
between me and the one thing that must not break. A plain build makes `outPath` the only source of
truth, with no translation layer to misconfigure. Secondary reasons: the
parity toolchain (`fingerprint.js`, `audit.js`, `compare-live.js`) is already
plain Node with no dependencies, so the build shares its HTML parsing; and a
dependency-free build cannot change its output because of an upstream minor
release.

**The honest trade-off:** I am hand-rolling templating, incremental builds and
a dev server that Eleventy gives for free. For 93 static pages with no
pagination, no collections and no tags, that is a few hundred lines. If the
site later grows a blog index or tag pages, revisit this.

### Path parity, proven automatically

`baseline/url-inventory.csv` is the contract. `scripts/parity.js` asserts, on
every build:

1. **Set equality of output paths.** Every `dist/**/*.html` maps to a URL by the
   same `urlForFile()` the baseline used. That set must equal the 93 page URLs
   in the inventory — no extras, no omissions. A missing file and a renamed
   file both fail here.
2. **The three path conventions are preserved per page.** `cbse-class-10-maths/index.html`
   must not become `cbse-class-10-maths.html`, and vice versa. Compared on the
   literal `file` column, not the URL — the URL alone cannot distinguish
   `areas/ameerpet.html` from a hypothetical `areas/ameerpet/index.html`.
3. **Byte-identical `.htaccess`, `robots.txt`, `sitemap.xml`** (invariant 2) —
   SHA-256 against the baseline copies. These three are copied, never generated.

The build **fails** rather than writes if any of the three fail. Wave-limited
builds compare only the migrated subset and pass through the rest untouched.

---

## 2. Content extraction — moving words without changing them

The risk is obvious: a human retyping 93,759 words will change some of them.
So no word is ever retyped.

**Extraction is mechanical.** `scripts/extract.js` parses each baseline file and
writes its visible text into `src/blocks/<slug>/` as HTML fragments, split at
existing section boundaries (`<section>`, `<h2>`). Text nodes are copied as
exact substrings of the source file — the script never reformats, re-wraps or
re-encodes them. Entities stay as authored (`&amp;`, `&#8211;`), because
normalising them would change bytes without changing meaning and make the diff
noisy.

**Proof, two layers:**

- **`visibleTextHash`** (already in `seo-fingerprint.json`) — the SHA-256 of the
  normalised visible text. If it matches the baseline, the page's words are
  provably untouched and no further checking is needed. This is the pass
  condition for most pages.
- **Word-level diff** when the hash differs, which it legitimately will on pages
  touched by A1/A2 (a phone number or a business name changes in visible text).
  `scripts/parity.js` produces a word-level diff and classifies every changed
  run against APPROVED-CHANGES:
  - `+91 73966 69430` replacing `+919396669430` → allowed, A2
  - `Ankuram Tuition Centre` replacing `Ankuram Tuition Center` → allowed, A2
  - `500096` replacing `500033`/`500034` → allowed, A2
  - anything else → **FAIL**, with the page, the before text and the after text

Invariant 5 (word count ≥ 95%) and invariant 14 (wording never changes) are
both enforced by this. Invariant 14 is the stricter of the two: in practice the
allowed diff is a closed list of about a dozen exact string substitutions, and
the checker rejects a changed word even when the count is unaffected.

---

## 3. Shared layout and CSS coexistence

**Layout.** One `base.html` with slots for head metadata, header, content and
footer.

- **Header**: logo, navigation, and the approved small WhatsApp + call link
  (CLAUDE.md CTA section). No sticky behaviour, no banner.
- **Footer**: NAP from a single `nap.html` partial, built from APPROVED-CHANGES
  A2, so one edit changes all 93 pages and drift cannot reappear.
- **One main CTA block** at the bottom of each page.

**CSS during migration.** Pages migrate in waves, so old and new pages coexist
on the live site for weeks. Two rules keep that safe:

1. **New CSS is additive and namespaced.** `assets/site.css` is a new file.
   Every new rule is scoped under a root class (`.v2`) that only rebuilt pages
   carry on `<body>`. A rebuilt page links both `styles.css` (old) and
   `site.css` (new); an unmigrated page links only `styles.css` and is
   bit-identical to today.
2. **The old `styles.css` is never edited during migration.** Not one byte.
   It is deleted only in a final cleanup wave, after the last page migrates and
   parity passes — and that deletion is its own approval.

The cost is that rebuilt pages carry both stylesheets for the duration
(9.3 KB old + new). Invariant 11 says page weight must not regress, so each
rebuilt page must absorb that overhead and still come in lighter — achievable
given the savings in section 6, but it is measured per page, not assumed.

---

## 4. Parity checker — `scripts/parity.js`

```
node scripts/parity.js dist/            # whole site
node scripts/parity.js dist/ --wave 3   # only wave 3 pages
```

It reruns `fingerprint.js` against the build output, loads
`baseline/seo-fingerprint.json` and `docs/APPROVED-CHANGES.md`, and prints
**PASS/FAIL per page per rule**, then a summary. Non-zero exit on any FAIL.

| Rule | Scope | Check |
|---|---|---|
| 1 URLs unchanged | global | output path set == inventory set; both path conventions preserved |
| 2 .htaccess/robots/sitemap | global | SHA-256 identical to baseline |
| 3 head metadata | page | title, description, canonical, robots, JSON-LD, hreflang, og/twitter byte-identical unless A1/A2/A4 |
| 4 headings | page | H1 text identical (A5 exception); every baseline H2/H3 string still present |
| 5 word count | page | `visibleWordCount >= 0.95 * baseline` |
| 6 internal links | page | every baseline href still present, unless remapped per an approved `link-map.csv` row (A3) |
| 7 images | page | every baseline `src` keeps its exact `alt`; new inline SVG has `aria-hidden="true"` |
| 8 noindex page | page | `/cbse-class-10-online-tuition` robots and sitemap absence unchanged |
| 9 NAP | page | one canonical form (A2); any other variant fails |
| 10 tracking | page | exactly the A1 IDs; any other ID, or a placeholder, fails |
| 11 weight/CLS | page | bytes <= baseline; Lighthouse CLS < 0.1, scores >= baseline |
| 12 static output | global | no framework runtime, no new JS library in `dist/` |
| 13 paid pages | page | the 4 URLs never redirect; `/cbse-class-10/` keeps the 5 anchor ids |
| 14 wording | page | `visibleTextHash` match, or word-diff fully explained by APPROVED-CHANGES |
| 15 anchor ids | page | homepage keeps `#home`, `#about`, `#curricula`, `#contact`, `#reviews`, `#hybrid-classes`, each on the section with the matching content |

Rules 11 and 13 need a running page, so they run against staging, not `dist/`.
The rest are static and run on every build.

---

## 5. Tracking

**One generated partial.** `src/partials/tracking.html` is **generated** by
`scripts/gen-tracking.js`, which parses `docs/APPROVED-CHANGES.md` A1 and emits
the snippet. The IDs exist in exactly one place. Nobody — including me — types
an ID into a template. This directly implements the revised invariant 10.

Shape of the emitted block (one gtag load, both properties configured — see
section 6):

```html
<script async src="https://www.googletagmanager.com/gtag/js?id=G-MQRSS8DKLE"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-MQRSS8DKLE');
  gtag('config', 'AW-10954184691');
</script>
<!-- Clarity uir8kpny76 -->
```

**Click wiring.** Delegated listeners, no per-link handlers:

- any `a[href^="https://wa.me/"]` → `gtag('event','conversion',{send_to:'AW-10954184691/jucWCNPv3OAbEPOvruco'})`
- any `a[href^="tel:"]` → `gtag('event','conversion',{send_to:'AW-10954184691/NGIFCNbv3OAbEPOvruco'})`

Delegation means a link added later is wired automatically, and it holds the
new JS to a few lines — no library, per invariant 11.

**Proof that events actually fire.** `scripts/verify-tracking.js` uses the
Playwright already installed in P0d:

1. Load the page, record all requests via `page.on('request')`.
2. Assert a request to `googletagmanager.com/gtag/js?id=G-MQRSS8DKLE`.
3. Assert a `clarity.ms` request.
4. Click the first `wa.me` link with navigation blocked, assert a
   `google-analytics.com/g/collect` or `googleads.g.doubleclick.net` request
   whose payload contains the WhatsApp label.
5. Same for the first `tel:` link and the phone label.
6. Assert **zero** requests carrying `G-MQRSS8DKKE`, `G-KHP2PBXF6X`,
   `AW-XXXXXXXXX`, `GTM-XXXXXXX` or `jucWCNbv…`.

Step 6 is the one that would have caught the live typos in P0b. It runs per
page, per wave, and a failure blocks the wave.

---

## 6. Homepage performance plan

### What makes it 814 KB and 8.5 s today

Measured, `baseline/lighthouse/home-mobile.json`: performance **63**,
LCP **8501 ms**, 32 requests, 790.8 KB transferred, 813,884 bytes total weight.

**The LCP element is text, not an image** — `section#home > div.container >
div.hero-content > p.hero-subtitle`. That matters: the usual "preload the hero
image" fix is irrelevant here. The hero paragraph cannot paint until its
webfont resolves, and the webfont is behind a render-blocking cross-origin
stylesheet.

| Item | Bytes | What it costs |
|---|---|---|
| `assets/images/classroom-teaching.webp` | 204.2 KB | **offscreen** — not in the viewport, still fully downloaded; also unsized for mobile (159.1 KB of it wasted at 390 px) |
| `gtag/js?id=G-MQRSS8DKLE` | 187.3 KB | 79.7 KB unused |
| `gtag/js?id=AW-10954184691` | 161.6 KB | 60.5 KB unused — **a second full gtag bundle for the same library** |
| Inter woff2 × 2 (`fonts.gstatic.com`) | 130.6 KB | blocks the text LCP |
| `fonts.googleapis.com/css2?family=Inter…` | 1.2 KB | **render-blocking for 930 ms** |
| `clarity.js` | 25.2 KB | 15 ms blocking |
| document / `script.js` / `styles.css` / logo | 47.8 KB | — |

Third-party total: 513.3 KB across 20 requests, of which Google Tag Manager is
348.8 KB and 172 ms of main-thread blocking.

### What I will change

1. **Self-host one Inter subset.** Latin subset, weights 400/600/700, `woff2`,
   `font-display: swap`, `<link rel="preload">`. Removes the render-blocking
   `fonts.googleapis.com` request entirely (**−930 ms**), removes two
   cross-origin connections, and cuts 130.6 KB to roughly 25 KB. CLAUDE.md
   already permits "one self-hosted subset font". **This is the LCP fix** — the
   hero text stops waiting on a third-party round trip.
2. **Load gtag once.** One `gtag/js?id=G-MQRSS8DKLE` plus
   `gtag('config','AW-10954184691')` on the same library, instead of two full
   bundles. **−161.6 KB.** Both properties stay live exactly as A1 requires —
   this removes a duplicate download, not a tag. (Per your P0d note: tracking
   stays, best-practices is not chased by deleting tags.)
3. **Fix the offscreen hero image.** `loading="lazy"`, `decoding="async"`, and a
   `srcset`/`sizes` set rendered at 390/780/1440. It is below the fold, so lazy
   loading is safe and cannot affect LCP. **−165 KB on mobile.**
4. **Explicit `width`/`height` on every image** so lazy loading cannot introduce
   layout shift. Homepage CLS is 0 today and must stay under 0.1.
5. **Defer `script.js`** once I confirm nothing in it is needed for first paint.

**Projected:** 814 KB → roughly 380 KB, with the render-blocking stylesheet
gone. Target is performance ≥ 90 and LCP < 2.5 s.

**What I cannot fix:** the 187.3 KB gtag bundle is Google's and A1 requires it.
It is `async`, so it should not block LCP, but it sets a hard floor on page
weight and contributes 172 ms of blocking time. If performance lands at 85
rather than 90 after items 1–5, that bundle is the reason, and the next lever
would be a tracking decision, not a build decision — I would bring it back to
you rather than drop a tag.

---

## 7. Staging

`staging.ankuramtuition.com`, served from a directory **outside**
`public_html`, protected by HTTP basic auth **and** `X-Robots-Tag: noindex`.

Both are needed. Basic auth stops crawlers fetching anything; the header is the
backstop for the window where auth is misconfigured. A staging copy of 93 pages
getting indexed would be a duplicate-content event on a site whose entire point
is its rankings.

### What Swastik clicks in hPanel

1. hPanel → **Domains → Subdomains**. Create subdomain `staging`, domain
   `ankuramtuition.com`. Set the document root to `domains/staging.ankuramtuition.com/public_html`
   — **not** anything under the live `public_html`.
2. hPanel → **Websites → Manage → SSL**. Issue a free SSL certificate for
   `staging.ankuramtuition.com`. Wait for it to show Active.
3. hPanel → **Advanced → Password Protect Directories** (some plans list it as
   Directory Privacy). Select the staging document root. Create one user, set a
   password, Save.
4. Tell me the username. **Send the password by a separate channel, not in this
   chat** — I do not need it to build, only to run the staging checks, and it
   should never enter a transcript or a commit.
5. Visit `https://staging.ankuramtuition.com` in a private window. Confirm a
   browser password prompt appears **before** any page content.
6. Tell me it is ready. I will add a staging-only `.htaccess` containing
   `Header always set X-Robots-Tag "noindex, nofollow"` and verify it with
   `curl -I`, checking both that the header is present and that an
   unauthenticated request returns **401**.

The live `.htaccess`, `robots.txt` and `sitemap.xml` are untouched by all of
this (invariant 2). The staging `.htaccess` is a separate file under a separate
document root.

---

## 8. Wave plan

Generated by `scripts/make-waves.js`, full listing in `docs/waves.csv`. The
script fails if any file is unassigned or assigned twice.

```
total files assigned: 93 (fingerprint pages: 93)
  wave 1     1 files  Homepage
  wave 2     9 files  Utility and trust pages
  wave 3    23 files  Area pages
  wave 4    11 files  Board and curriculum pages
  wave 5     8 files  Subject pages
  wave 6    26 files  Class and grade pages
  wave 7     8 files  Content, topics and remaining service pages
  wave 8.1   1 files  Paid Ads landing pages (one at a time)
  wave 8.2   1 files  Paid Ads landing pages (one at a time)
  wave 8.3   1 files  Paid Ads landing pages (one at a time)
  wave 8.4   1 files  Paid Ads landing pages (one at a time)
  wave X     3 files  Untouched (unreachable)
sum of waves: 93 == 93 OK
```

**Wave 1 — Homepage** (`index.html`). Alone, because it proves the layout, the
tracking partial, the NAP partial and the whole parity checker on the page with
the most to gain (performance 63) and the most traffic to lose.

**Wave 2 — Utility and trust pages** (9): `about/`, `contact/`,
`privacy-policy/`, `terms/`, `how-we-teach`, `thank-you` ×2, `404` ×2. Small,
low-traffic, low-risk. This is where the shared header/footer earns confidence
before it reaches commercial pages.

**Wave 3 — Area pages** (23). Near-identical structure, one template, largest
count. `areas/kukatpally.html` is **not** here — it is unreachable (wave X).

**Wave 4 — Board and curriculum pages** (11). Includes
`best-cbse-tuition-centre` — the page carrying 536 backlinks and the
`jucWCNbv…` conversion-label typo, so it gets individual attention.

**Wave 5 — Subject pages** (8).

**Wave 6 — Class and grade pages** (26). The commercial core, including the
`class-8-maths/` cluster (whose desktop CLS of 0.51 gets fixed here) and
`cbse-class-10-online-tuition` (whose noindex status must **not** change).

**Wave 7 — Content and topics** (8): the blog post, `electrochemistry-class-12-cbse`
(the 21-H1 page, fixed under A5), both `topics/` pages,
`diagnostic-assessment`, `home-tuition-hyderabad`, `home-tutor-hyderabad/`,
`hybrid-tuition-hyderabad`.

**Wave 8 — Paid Ads landing pages, one at a time, separate approval each:**

| Sub-wave | Page | Order rationale |
|---|---|---|
| 8.1 | `online-science-tuition-class-10-cbse/` | lowest complexity of the four |
| 8.2 | `online-maths-tuition-class-10-cbse/` | same template, proven by 8.1 |
| 8.3 | `online-tuition-class-10-cbse/` | worst mobile performance of the four (87) |
| 8.4 | `cbse-class-10/` | **last** — Ads sitelinks depend on its 5 anchor ids |

**Wave X — untouched** (3): `cbse-class-10-maths.html`, `areas/kukatpally.html`,
`ib-pyp-tuition-hyderabad.html`. Proved unreachable in P0c. Not rebuilt, not
deleted (deletion is explicitly not approved).

---

## 9. `docs/link-map.csv`

Generated by `scripts/make-link-map.js`. **Proposal only — not applied.**

28 broken targets. Every proposed replacement is verified against
`baseline/live-http.csv` (first hop 200 **and** final 200); the generator exits
non-zero if any proposal fails that check.

- **18 mapped to a verified live 200.** Examples: `/about.html` → `/about/`;
  `/curricula.html` → `/cbse-icse-igcse-ib-tuition-hyderabad`; `/topics/vectors`
  → `/topics/vectors-class-11-physics/`; `/online-tuition.html` (linked from 24
  area pages, the single biggest win) → `/online-maths-tuition`.
- **10 marked `DECIDE`.** These are links to pages that were never written —
  `/notes` ("Study Notes"), `/practice` ("Practice Sheets"), `/resources`,
  `/topics/vectors-lecture-2-components/` ("Next: Components & Unit Vectors"),
  `/topics/vectors-lecture-3-addition/` (already labelled "Coming soon"),
  `/topics/vectors-practice-1/`, and four "related topic" links to unwritten
  Class 11 physics articles.

I deliberately did **not** invent a 200 URL for those 10. Sending a reader who
clicked "Practice Sheet 1" to a sales page is worse than the 404 they get
today, and it would be a wording-level change to the page's meaning. Each needs
your call: remove the link, or write the page. See section 10.

---

## 10. Risks and open questions

**Questions I need answered before building**

1. **The 10 `DECIDE` links.** Remove the link, or write the page? Removing a
   link touches invariant 6 (every baseline internal link must still exist), so
   whichever you choose needs to be written into APPROVED-CHANGES as an
   explicit A3 exception.
2. **`/online-tuition.html` → `/online-maths-tuition`** is my proposal for the
   link on 24 area pages, but the anchor reads "Learn More About Online
   Tuition" and the target is maths-specific. If a general online-tuition page
   is coming, the link should wait for it.
3. **`/areas/jubilee-hills` → `/`.** Four pages link to an area page for the
   locality the centre is actually in. Homepage is my proposal; a dedicated
   Jubilee Hills area page may be the better answer, but that is new content,
   not a rebuild.
4. ~~Staging password~~ — **ANSWERED 16 Sep.** Swastik sets it himself in hPanel.
   Never ask for it, never print it. Section 7 step 4 is amended accordingly.
5. ~~Old `styles.css` deletion~~ — **ANSWERED 16 Sep.** Separate decision after
   all waves are live. Not now.

**Risks I am carrying**

6. **The `class-8-maths/` cluster is the messiest corner of the site** — its own
   `sitemap.xml` and `robots.txt`, a canonical pointing at the homepage, three
   canonicals pointing at non-existent root paths, and desktop CLS of 0.51.
   Fixing the canonicals is approved (A4); removing its stray sitemap/robots is
   **not**. So it will end up correct but still carrying two orphan files.
7. **Both gtag bundles are 349 KB of third-party weight.** Section 6 halves it
   by deduplicating the loader, but if homepage performance stalls below 90
   after every build-side fix, the remaining lever is a tracking decision.
8. ~~**Soft 404s.**~~ `/404/` returns HTTP 200, so anything 301'd into it looks
   like a real page to Google. **DEFERRED 16 Sep** — fixing it means touching
   `.htaccess`; separate decision after all waves are live.
9. **CDN cache during waves.** H1 showed edge nodes serving deleted files for
   hours after a cache clear, with a 30-day `ExpiresDefault`. Each wave needs a
   cache clear plus a three-pass verification, not a single request.

~~10. Two live GA4 properties.~~ **WITHDRAWN 16 Sep — this was my error.**
`G-MQRSS8DKLE` and `G-KHP2PBXF6X` are two data streams of the *same* GA4
property (374743429), not two properties. Standardising on `G-MQRSS8DKLE` keeps
data flowing to the same property, so no dashboard goes flat. Not a risk.

---

## 11. Tier A rules (added 16 Sep, from Search Console)

Source: `baseline/gsc-2026-09-16.md` (property `sc-domain:ankuramtuition.com`,
15 May 2025 – 14 Sep 2026). Tiers are built by `scripts/gsc-tiers.js` into
`baseline/gsc-tiers.csv`, and joined onto `docs/waves.csv` as a `tier` column.

Tiers use Step 7, the last 3 months (2026-06-15 to 2026-09-14):

| Tier | Meaning | Pages |
|---|---|---|
| A | at least 1 click | 33 |
| B | impressions, 0 clicks | 48 |
| C | no data in the window | 12 |

### The homepage is the whole site's search traffic

**77.3% of all search clicks over the full 16 months** (1,416 of 1,833, apex
plus `www`), and **67.3% over the last 3 months** (235 of 349). Both numbers are
computed from the transcription; the 16-month figure is the 77% one.

Therefore, on `index.html`:

- **`<title>`, meta description, `<h1>` and JSON-LD are frozen byte-for-byte.**
  No exceptions beyond A1 (tracking) and A2 (NAP). Not a word, not a character
  of punctuation, not a reordering of JSON-LD keys.
- The parity checker treats any diff in those four on the homepage as a hard
  FAIL, not a warning, regardless of how the diff arose.

### Gate before any Tier A page ships

Both of these must be produced and approved before a Tier A page is deployed:

1. **Side-by-side screenshot review** — old vs new, at 390 px and 1440 px, full
   page, presented together for Swastik to compare.
2. **Word-level diff showing zero unapproved removals** — every changed run
   classified against APPROVED-CHANGES. Any unclassified change blocks the ship.

A Tier B or C page needs the standard parity run; a Tier A page needs both of
the above on top of it.

### Two GSC rows that earn traffic but have no file

From `baseline/gsc-unmapped.csv`:

- **`/class-8-maths-tuition-near-me.html` — 3 clicks, 139 impressions** in the
  last 3 months. It is a `.htaccess` 301 to
  `/class-8-maths/class-8-maths-tuition-near-me`, not a file. It behaves like a
  Tier A URL and must keep redirecting; do not let it 404.
- **`/wp-content/uploads/2023/03/Topic-3.-Geometry-and-Trigonometry.pdf` — 13
  clicks, 613 impressions**, the highest-earning non-homepage URL in the window.
  It is a WordPress-era PDF that is no longer on the site, and `.htaccess` sends
  `^wp-content/` to the homepage. Worth a separate decision: restore the PDF, or
  accept that those 13 clicks land on the homepage.

Also unmapped, with no traffic: `assets/images/classroom-teaching.webp` (3
impressions, 0 clicks — relevant to A9, which removes it), plus
`tutor.ankuramtuition.com`, `www/blogs/` and `www/class-10-tuition-center/`.
