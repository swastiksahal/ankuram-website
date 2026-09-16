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
