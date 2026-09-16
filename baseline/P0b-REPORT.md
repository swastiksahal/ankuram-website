# P0b — Baseline audit

Local only. No SSH, no HTTP. Every figure below comes from `./public_html`
(the P0a snapshot, commit `def9eec`) and was produced by:

```
node scripts/fingerprint.js public_html baseline/seo-fingerprint.json
node scripts/audit.js public_html baseline/seo-fingerprint.json baseline
```

Artefacts: `baseline/url-inventory.csv`, `baseline/seo-fingerprint.json`,
`baseline/audit-data.json`, `baseline/broken-links.json`.

---

## 1. Counts

| Metric | Value |
|---|---|
| Files in snapshot | 152 |
| HTML pages fingerprinted | 93 |
| URLs in `sitemap.xml` | 83 |
| URLs in nested `class-8-maths/sitemap.xml` | 4 |
| Active RewriteRules in root `.htaccess` | 47 |
| — of which unconditional 301s | 43 |
| Rows in `url-inventory.csv` | 136 (93 page URLs + 43 redirect-only URLs) |
| Total HTML bytes | 2,682,086 (2.56 MB) |
| Median page | 26.0 KB · Largest 138.8 KB |
| Total visible words | 93,759 |
| Images missing `alt` | **0** |
| Invalid JSON-LD blocks | **0** |

Word-count floor for invariant 5 (95% of baseline) is stored per page in
`seo-fingerprint.json` as `visibleWordCount`, alongside `visibleTextHash`.

---

## 2. Sitemap / file mismatches

### (a) Sitemap URLs with no file — **none**

All 83 `<loc>` entries resolve to a file in the snapshot.

### (b) HTML files not in the sitemap — 8 (full list)

| File | URL | meta robots | .htaccess redirect |
|---|---|---|---|
| `404.html` | `/404` | noindex | — |
| `404/index.html` | `/404/` | noindex | — |
| `class-8-maths/thank-you.html` | `/class-8-maths/thank-you` | noindex,nofollow | — |
| `home-tutor-hyderabad/index.html` | `/home-tutor-hyderabad/` | noindex, nofollow | — |
| `thank-you.html` | `/thank-you` | noindex, nofollow | — |
| `thank-you/index.html` | `/thank-you/` | **index, follow** | — |
| `areas/kukatpally.html` | `/areas/kukatpally` | **index, follow** | `^areas/kukatpally/?$ -> /` |
| `ib-pyp-tuition-hyderabad.html` | `/ib-pyp-tuition-hyderabad` | **index, follow** | `^ib-pyp-tuition-hyderabad/?$ -> /ib-myp-tuition-hyderabad` |

Three of these are `index, follow` but absent from the sitemap. Two are
deliberately 301'd away (their files are unreachable but still on disk).
`thank-you/index.html` is `index, follow` with no redirect and no sitemap entry
— it is only held back by `Disallow: /thank-you/` in robots.txt.

### (c) Sitemap entries that are redirected away, or noindex — **none**

No contradiction between the sitemap and the unconditional 301 rules, and no
sitemap URL carries `noindex`. (An earlier pass reported all 83 as redirected;
that was my bug — I was matching the conditional domain-normalisation rule
`^(.*)$` against every path. `parseRewrites` now binds `RewriteCond` lines to
their rule and `redirectFor` skips conditional rules. Re-run output above is
after the fix.)

---

## 3. Junk — 30 files, 6.75 MB (nothing deleted)

| File | Size |
|---|---|
| `assets/Ankuram_public_html_SEO_complete_2026-07-29.zip` | 3084.9 KB |
| `blog/Ankuram_public_html_clean.zip` | 3014.3 KB |
| `index.html.bak-20260828` | 112.9 KB |
| `styles.css.bak-20260828` | 59.6 KB |
| `hybrid-tuition-hyderabad.html.bak2` | 57.3 KB |
| `cbse-class-10/index.html.bak-comp-20260828` | 44.7 KB |
| `class-10-maths-tuition.html.bak-comp-20260828` | 37.4 KB |
| `class-10-maths-tuition.html.bak-20260828` | 36.8 KB |
| `how-we-teach.html.bak-comp-20260828` | 31.2 KB |
| `how-we-teach.html.bak-20260828` | 30.9 KB |
| `cbse-class-10-maths.html.bak2` | 30.0 KB |
| `cbse-class-10-maths/index.html.bak` | 30.0 KB |
| `ib-myp-tuition-hyderabad.html.bak-20260828` | 29.6 KB |
| `ib-myp-tuition-hyderabad.html.bak2` | 29.6 KB |
| `online-maths-tuition.html.bak-comp-20260828` | 28.0 KB |
| `online-maths-tuition.html.bak-20260828` | 27.9 KB |
| `online-class-10-tuition.html.bak2-20260828` | 27.9 KB |
| `online-class-10-tuition.html.bak3-20260828` | 27.9 KB |
| `diagnostic-assessment.html.bak6-20260828` | 27.2 KB |
| `online-class-10-tuition.html.bak-20260828` | 26.7 KB |
| `diagnostic-assessment.html.bak5-20260828` | 26.7 KB |
| `diagnostic-assessment.html.bak-20260828` | 26.5 KB |
| `diagnostic-assessment.html.bak2-20260828` | 26.5 KB |
| `diagnostic-assessment.html.bak3-20260828` | 26.5 KB |
| `diagnostic-assessment.html.bak4-20260828` | 26.5 KB |
| `sitemap.xml.bak-20260808` | 12.5 KB |
| `topics/htaccess (1)` | 9.4 KB |
| `class-11-tuition/index.txt` | 9.2 KB |
| `class-9-tuition/index.txt` | 9.1 KB |
| `thank-you/index.txt` | 5.8 KB |

Directories holding no HTML (asset folders, all legitimate): `assets`,
`assets/images`, `cbse-class-10/images`, `class-8-maths/css`,
`class-8-maths/images`, `class-8-maths/js`.

**Correction to the P0a report.** My P0a file-name check used `-name "*.bak"`,
which matches only a literal `.bak` ending. It missed `.bak2`,
`.bak-20260828` and `.bak-comp-20260828`. **27 of these 30 junk files are in
commit `def9eec`** — only the two zips and `cbse-class-10-maths/index.html.bak`
were caught by the `.gitignore`. Nothing was lost, but the "149 site files" in
that commit includes 27 backup artefacts.

`topics/htaccess (1)` is a full copy of the **June 24 root `.htaccess`**,
misnamed without the leading dot, so Apache does not parse it as config — it
sits in a web-served directory as a readable text file containing the whole
redirect map and internal comments (including the note about
`/best-cbse-tuition-centre` having "536 backlinks from 285 domains").

---

## 4. Tracking

### IDs found, by page count

| Type | ID | Pages |
|---|---|---|
| GA4 | `G-MQRSS8DKLE` | 58 |
| GA4 | `G-KHP2PBXF6X` | 7 |
| GA4 | `G-MQRSS8DKKE` | **2** |
| Google Ads | `AW-10954184691` | 66 |
| GTM | `GTM-XXXXXXX` (placeholder) | **3** |
| Clarity | `uir8kpny76` | 26 |
| UA (legacy) | — | 0 |

### Conversion labels

| Label | Pages |
|---|---|
| `AW-10954184691/NGIFCNbv3OAbEPOvruco` | 10 |
| `AW-10954184691/jucWCNPv3OAbEPOvruco` | 10 |
| `AW-10954184691/jucWCNbv3OAbEPOvruco` | **1** — `best-cbse-tuition-centre.html` |
| `AW-10954184691/YOUR_LABEL` | **1** — `class-8-maths/thank-you.html` |
| `AW-10954184691/form_submit` | **1** — `thank-you.html` |

### Different / wrong IDs — full list

**`G-MQRSS8DKKE` is one character off `G-MQRSS8DKLE`** (`…DKKE` vs `…DKLE`).
Verified:

```
public_html/cbse-class-10-maths.html:76:      gtag('config', 'G-MQRSS8DKKE');
public_html/cbse-class-10-maths/index.html:76:      gtag('config', 'G-MQRSS8DKKE');
```

**`AW-10954184691/jucWCNbv3OAbEPOvruco` is one character off
`…/jucWCNPv3OAbEPOvruco`** (`P` → `b`), on `best-cbse-tuition-centre.html` —
the page the old `.htaccess` comment flags as holding 536 backlinks.

Pages on the second GA4 property `G-KHP2PBXF6X` (7): `about/index.html`,
`cbse-class-10-science/index.html`, `cbse-class-10/index.html`,
`class-10-tuition-jubilee-hills/index.html`, `contact/index.html`,
`privacy-policy/index.html`, `terms/index.html`.

### Pages carrying NO GA4, Ads or GTM tag — 23 (full list)

`a-level-maths-tuition-hyderabad.html` · `cbse-class-10-online-tuition.html` ·
`class-10-maths-tuition-hyderabad.html` · `class-10-science-tuition-hyderabad.html` ·
`class-11-tuition/index.html` · `class-12-maths-tuition-hyderabad.html` ·
`class-12-physics-tuition-hyderabad.html` · `class-8-maths-tuition-hyderabad.html` ·
`class-8-maths/privacy-policy.html` · `class-8-maths/terms.html` ·
`class-8-science-tuition-hyderabad.html` · `class-9-maths-tuition-hyderabad.html` ·
`class-9-science-tuition-hyderabad.html` · `class-9-tuition/index.html` ·
`electrochemistry-class-12-cbse/index.html` · `home-tuition-hyderabad.html` ·
`ib-maths-tuition-hyderabad.html` · `icse-maths-tuition-hyderabad.html` ·
`igcse-maths-tuition-hyderabad.html` · `maths-tuition-jubilee-hills.html` ·
`physics-tuition-hyderabad.html` · `topics/vectors-class-11-physics/index.html` ·
`topics/vectors-lecture-1-introduction/index.html`

Clarity is present on 26 of 93 pages; the other 67 are listed in
`audit-data.json` under `noClarity`.

### Placeholder IDs never replaced — 5 files

`404.html`, `404/index.html`, `cbse-class-10-online-tuition.html`,
`class-8-maths/thank-you.html`, `thank-you/index.html`.

---

## 5. NAP

### Phone

| Variant | Pages |
|---|---|
| `+91 73966 69430` | 88 |
| `+917396669430` | 88 |
| `917396669430` | 87 |
| `73966 69430` | 57 |
| `+91-7396669430` | 28 |
| `7396669430` | 4 |
| `+91 7396669430` | 1 — `best-cbse-tuition-centre.html` |
| **`+919396669430`** | **1 — `topics/vectors-class-11-physics/index.html`** |

`tel:` hrefs: `tel:+917396669430` on 88 pages; **`tel:+919396669430` on
`topics/vectors-class-11-physics/index.html`**. WhatsApp: `wa.me/917396669430`
on 87 pages, no variants.

### Postcode

| Variant | Pages |
|---|---|
| `500096` | 88 |
| `500033` | 3 — `home-tutor-hyderabad/index.html`, `topics/vectors-class-11-physics/index.html`, `topics/vectors-lecture-1-introduction/index.html` |
| `500034` | 2 — `cbse-tuition-jubilee-hills.html`, `icse-tuition-hyderabad.html` |

### Street

| Variant | Pages |
|---|---|
| `Plot 229` | 90 (no variants) |
| `Road No. 72` | 58 |
| `Road Number 72` | 23 |
| `Road 72` | 1 — `cbse-class-10-online-tuition.html` |

`Road No. 1`, `Road No. 12`, `Road No. 14`, `Road No. 36` also appear, but I
checked the surrounding text and they are directions to *other* roads ("Banjara
Hills — 10 min via Road No. 12"), not address variants.

### Coordinates

| Pair | Pages |
|---|---|
| `17.4193665, 78.3976363` | 40 |
| `17.4193665,78.3976363` | 16 |
| `17.4193614,78.3976363` | 2 — `class-8-maths/*` |
| `17.4193614, 78.4002112` | 1 — `a-level-tuition-hyderabad.html` |
| `17.4242,78.4085` | 1 — `cbse-class-10/index.html` |
| `17.4156,78.4101` (JSON-LD) | 1 — `blog/why-your-child-forgets-maths-after-studying/index.html` |

### Business name

| Variant | Pages |
|---|---|
| `Ankuram Tuition Centre` | 90 |
| `Ankuram Tuition Center` | 56 |
| `ANKURAM Tuition Centre` | 50 |
| `Ankuram tuition centre` | 1 — `cbse-class-10-online-tuition.html` |

The "Center" spelling is mostly in `alt` text and JSON-LD `alternateName`, not
body copy, but it is on 56 pages and needs a decision before the rebuild.

---

## 6. Anything surprising

1. **`/cbse-class-10-online-tuition` breaks invariant 8 today.** CLAUDE.md
   requires it to be `noindex,follow` and out of the sitemap. Live file says
   `<meta name="robots" content="index, follow, max-snippet:-1, …">` and it
   **is** in `sitemap.xml`. robots.txt correctly does not Disallow it.
2. **The Ads landing page has no working tracking.** Same file carries
   `AW-XXXXXXXXX` and `CLARITY_PROJECT_ID` placeholders — it loads
   `gtag/js?id=AW-XXXXXXXXX`. Conversions from Ads CID 786-647-2391 landing
   here are not being recorded.
3. **Two GA4 typo pages and one conversion-label typo page** (section 4). This
   is exactly the hazard invariant 10 warns about, and it is already in the
   live files, so "copy verbatim from live" would copy the typos forward.
4. **`/online-tuition.html` is linked from 24 area pages and does not exist.**
   28 broken internal-link targets in total — full list in
   `baseline/broken-links.json`. Next biggest: `/areas/jubilee-hills` from 4 pages.
5. **Canonical defects (5 pages).**
   - `class-8-maths/index.html` canonicalises to `https://ankuramtuition.com/`
     — a sitemap page pointing at the homepage.
   - `class-8-maths/class-8-maths-tuition-near-me.html`, `…/privacy-policy.html`,
     `…/terms.html` canonicalise to root-level `.html` URLs that do not exist
     as files and would 301.
   - `topics/vectors-lecture-1-introduction/index.html` canonicalises to
     `/topics/vectors-introduction/`, which is not in the snapshot at all.
6. **`electrochemistry-class-12-cbse/index.html` has 21 `<h1>` elements.**
   Invariant 4 says H1 text is identical after the rebuild — that page needs a
   ruling before it can be rebuilt.
7. **Duplicate title/content pairs**: `cbse-class-10-maths.html` and
   `cbse-class-10-maths/index.html` are two URLs, both in the sitemap, same
   title. Same for `class-8-maths/index.html` and
   `class-8-maths/class-8-maths-tuition-near-me.html`.
8. **A second sitemap exists** at `class-8-maths/sitemap.xml` with 4 URLs, three
   of which (`/class-8-maths-tuition-near-me.html`, `/privacy-policy.html`,
   `/terms.html`) are stale `.html` paths. There is also a second
   `class-8-maths/robots.txt`. Neither is referenced by the root robots.txt.
9. **robots.txt blocks two zips that do not exist** (`/ankuram-deploy.zip`,
   `/ankuramtuition-deployment.zip`) and **does not block the two that do**
   (`/assets/Ankuram_public_html_SEO_complete_2026-07-29.zip`,
   `/blog/Ankuram_public_html_clean.zip`). It also blocks `/index.txt`, which
   does not exist, while the three real `index.txt` files sit unblocked.
10. **Nothing in the snapshot serves `/areas/kukatpally` or
    `/ib-pyp-tuition-hyderabad`** — both files exist and are `index, follow`,
    but Section 3 301s run before the clean-URL rewrite, so the files are dead
    weight.

### Not verified here

URL behaviour is **derived from `.htaccess`, not observed**. No HTTP request was
made, per the phase brief. Trailing-slash handling for `topics/` (which has its
own `.htaccess` and a `DirectoryIndex` directive) and the exact precedence of
Section 3 vs Section 5 should be confirmed against the live server before any
URL is treated as settled. The sitemap lists
`/topics/vectors-class-11-physics` without a trailing slash and
`/topics/vectors-lecture-1-introduction/` with one; I could not resolve which
form actually returns 200 without a request.

---

# P0c live results

Read-only HTTP, no SSH. 304 unique URLs (every `url-inventory.csv` row, plus
each sitemap URL in its with-slash, without-slash and `.html` form, plus the
exposure targets). One `curl -sIL` HEAD per URL, rate limited to one request
per second plus one extra second per redirect hop.

```
bash scripts/live-check.sh urls.txt baseline/live-http.csv    # 304 urls, 0 errors
node scripts/compare-live.js public_html baseline/live-http.csv
  tested 304  agree 281  differ 23
  first-hop status tally: { '200': 96, '301': 205, '404': 3 }
  final status tally:     { '200': 301, '404': 3 }
```

Artefacts: `baseline/live-http.csv`, `baseline/live-vs-predicted.json`.

**Headline: 301 of 304 URLs end at 200. No live URL 404s.** The three 404s are
not real URLs — see "Defect in my own CSV" below.

## Where live behaviour differs from what .htaccess predicted — all 23

### 17 × `.html` form of a directory-backed page — predictor wrong, site correct

`/about.html` · `/blog/why-your-child-forgets-maths-after-studying.html` ·
`/cbse-class-10-science.html` · `/cbse-class-10.html` ·
`/class-10-maths-basic-vs-standard.html` · `/class-10-online-vs-offline-tuition.html` ·
`/class-11-tuition.html` · `/class-8-maths.html` · `/class-9-tuition.html` ·
`/contact.html` · `/electrochemistry-class-12-cbse.html` ·
`/online-maths-tuition-class-10-cbse.html` · `/online-maths-tuition-class-10-icse.html` ·
`/online-science-tuition-class-10-cbse.html` · `/online-tuition-class-10-cbse.html` ·
`/privacy-policy.html` · `/terms.html`

I predicted 404; live returns 301 to the extensionless form, then 301 to the
trailing-slash directory, then 200. Section 2 matches on `THE_REQUEST`, so it
strips `.html` whether or not an `X.html` file exists — my predictor required
the file. The site is behaving correctly; these all resolve in 2 hops.

### 6 × genuine differences, all under `/topics/`

| URL | Predicted | Live first hop | Ends at |
|---|---|---|---|
| `/topics/htaccess%20(1)` | 404 | **200** | itself |
| `/topics/vectors-class-11-physics` | 301 to slash | **200** | itself |
| `/topics/vectors-class-11-physics/` | 200 | 200 | itself |
| `/topics/vectors-lecture-1-introduction` | 301 to slash | **200** | itself |
| `/topics/vectors-lecture-1-introduction/` | 200 | **301** | `https://ankuramtuition.com/` |
| `/topics/vectors-class-11-physics.html` | 404 | 301 | `/404/` **with status 200** |
| `/topics/vectors-lecture-1-introduction.html` | 404 | 301 | `/404/` **with status 200** |

`topics/.htaccess` rewrites a directory to `index.html` internally instead of
letting `mod_dir` add the slash, so both the slash and no-slash forms return
200 — two URLs, one page, no redirect between them.

## 2. Scheme and host normalisation

| Request | Hops | Chain |
|---|---|---|
| `http://ankuramtuition.com/` | 1 | → `https://ankuramtuition.com/` ✅ |
| `https://www.ankuramtuition.com/` | 1 | → `https://ankuramtuition.com/` ✅ |
| `http://www.ankuramtuition.com/` | **2** | → `https://www.ankuramtuition.com/` → `https://ankuramtuition.com/` |

All three reach `https://ankuramtuition.com/`. But `http://www.` takes two hops:
something upstream of `.htaccess` (Hostinger's edge) forces HTTPS first and
keeps the `www`, and only then does Section 1 strip it. The `.htaccess` header
comment claims "always 1 hop regardless of http/https/www combination" — that
is not what the server does.

## 3. robots.txt and sitemap.xml vs the snapshot

Byte-identical. Same length, same SHA-256:

```
43ed0d0e...fffe329  live robots.txt      43ed0d0e...fffe329  public_html/robots.txt      (679 B)
6d9d9940...58a31c6b live sitemap.xml     6d9d9940...58a31c6b public_html/sitemap.xml    (6346 B)
```

The P0a snapshot is a faithful copy of both.

## 4. Are the junk files publicly fetchable? Yes — all six, status 200

| URL | Status |
|---|---|
| `/assets/Ankuram_public_html_SEO_complete_2026-07-29.zip` | **200** |
| `/blog/Ankuram_public_html_clean.zip` | **200** |
| `/topics/htaccess%20(1)` | **200** |
| `/class-11-tuition/index.txt` | **200** |
| `/class-9-tuition/index.txt` | **200** |
| `/thank-you/index.txt` | **200** |

Both full-site backup archives (3.0 MB and 2.9 MB) download to anyone with the
URL. `/topics/htaccess%20(1)` serves the June 24 redirect map as readable text.
robots.txt blocks none of the six. Nothing links to them, so this is
URL-guessing exposure rather than crawlable exposure — but `Disallow` would not
help either, since robots.txt is itself a public list of paths.

## 5. P0b questions resolved with real responses

**`cbse-class-10-maths.html` vs `/cbse-class-10-maths/` — the directory wins.**

```
/cbse-class-10-maths        301 -> /cbse-class-10-maths/   (200)
/cbse-class-10-maths/       200
/cbse-class-10-maths.html   301 -> /cbse-class-10-maths -> /cbse-class-10-maths/ (200, 2 hops)
```

`public_html/cbse-class-10-maths.html` is **unreachable**. Every route lands on
`cbse-class-10-maths/index.html`. The root-level file is dead weight, and the
duplicate-title pair flagged in P0b section 6 item 7 is therefore only one live
page, not two.

**`/topics/` trailing slash — inconsistent, and one sitemap URL is broken.**

- `/topics/vectors-class-11-physics` → 200 and `/topics/vectors-class-11-physics/`
  → 200. Both serve. The sitemap lists the no-slash form; the page's own
  canonical is the **slash** form. Sitemap and canonical disagree.
- `/topics/vectors-lecture-1-introduction` → 200.
- **`/topics/vectors-lecture-1-introduction/` → 301 → the homepage.** This is
  the form the sitemap lists. The sitemap is pointing Google at a URL that
  redirects to `/`.
- That page's canonical, `/topics/vectors-introduction/`, returns a hard **404**
  live (checked both slash forms). Confirms P0b section 6 item 5.

**`/areas/kukatpally` → 301 → `https://ankuramtuition.com/` (200).** Confirmed;
`areas/kukatpally.html` is unreachable.

**`/ib-pyp-tuition-hyderabad` → 301 → `/ib-myp-tuition-hyderabad` (200).**
Confirmed; `ib-pyp-tuition-hyderabad.html` is unreachable.

**Soft 404s.** `/topics/vectors-class-11-physics.html` and
`/topics/vectors-lecture-1-introduction.html` 301 to `/404`, which 301s to
`/404/`, which returns **HTTP 200**. The custom 404 page is served with a
success status, so crawlers see a real page rather than a 404.

## 6. Paid pages — all four clean

Fetched with `?gad_source=1&gclid=test`:

| Landing page | First hop | Redirect |
|---|---|---|
| `/online-tuition-class-10-cbse/` | **200** | none |
| `/online-maths-tuition-class-10-cbse/` | **200** | none |
| `/online-science-tuition-class-10-cbse/` | **200** | none |
| `/cbse-class-10/` | **200** | none |

No redirect at all, so no hop can drop the query string. Ad click IDs arrive intact.

`/cbse-class-10/` anchor IDs, on the live response body — all five present,
once each:

```
id="subjects"   live=1   id="pricing"  live=1   id="faq" live=1
id="diagnostic" live=1   id="reviews"  live=1
```

The live page is byte-identical to the snapshot
(`7079deff...fa73b2ee` both sides, 45,769 bytes).

## Defect in my own CSV (not a site problem)

Three rows in `baseline/url-inventory.csv` are malformed: when I derived
redirect-only URLs from `.htaccess` patterns I stripped `^` and `$` but left
other regex metacharacters, producing `/index(\.html)?`, `/wp-login\.php` and
`/xmlrpc\.php`. Those are the three 404s in the tally. The real URLs
(`/index.html`, `/wp-login.php`, `/xmlrpc.php`) are covered elsewhere in the
sweep and behave correctly. `url-inventory.csv` is left as committed so it
matches `live-http.csv` row for row; the generator needs a fix before the
inventory is reused as a comparison baseline.

## Still not verified

Everything above is HEAD requests. Response *bodies* were fetched for only two
URLs (`/cbse-class-10/` and the two text files compared in item 3). Page
content, tracking snippets firing, and Lighthouse metrics are untested.

---

# H1 server change — 16 Sep 2026

First and only production write so far. Approved by Swastik for these 6 files
only. Nothing deleted: `mv -n` throughout, no `rm` at any point.

**Pre-change backup** (CLAUDE.md requirement, taken before the first `mv`):
`~/backups/public_html-pre-H1-20260916-145452.tar.gz`, 7,640,629 bytes, all 152
files.

**Moved** from `~/domains/ankuramtuition.com/public_html/` to
`~/backups/exposed-20260916/<same subfolder>/`:

| File | Bytes | Live status now |
|---|---|---|
| `assets/Ankuram_public_html_SEO_complete_2026-07-29.zip` | 3,158,946 | 404 |
| `blog/Ankuram_public_html_clean.zip` | 3,086,658 | 404 |
| `topics/htaccess (1)` | 9,660 | 404 |
| `class-11-tuition/index.txt` | 9,373 | 404 |
| `class-9-tuition/index.txt` | 9,346 | 404 |
| `thank-you/index.txt` | 5,954 | 404 |

Sizes and mtimes preserved exactly; all six match the P0a snapshot byte for byte.

**Origin verified:** `ls` returns `No such file or directory` for all 6 under
`public_html`; `find . -type f | wc -l` = **146** (was 152). All six parent
directories keep their real content — `class-11-tuition/`, `class-9-tuition/`
and `thank-you/` still serve their `index.html`.

**Controls unaffected:** `/` and `/cbse-class-10/` returned 200 on every pass.

**CDN cache residue.** Immediately after the cache clear, results flapped
between 404 and 200 across three passes:

```
pass 1: 200 404 404 404 200 404
pass 2: 404 404 404 404 200 404
pass 3: 404 404 404 404 404 404
```

The 200s carried `age: ~10900` (about 3 hours, i.e. cached before the move) and
`cache-control: public, max-age=2592000`. That 30-day TTL comes from
`ExpiresDefault "access plus 1 month"` in `.htaccess`, which covers `.txt` and
`.zip`. The origin is clean; individual edge nodes may keep serving a stale copy
until their entry expires. Worth re-checking in a few days, and worth
remembering that `ExpiresDefault` applies a one-month TTL to any file type not
explicitly listed.

**Not changed:** `.htaccess`, `robots.txt`, `sitemap.xml`, and every HTML file.
The local `./public_html` snapshot still contains all 6 files (they are
gitignored), so it no longer mirrors the server exactly — it is the pre-H1
baseline by design.
