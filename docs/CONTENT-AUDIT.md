# Content Audit — ankuramtuition.in

**Phase 1 of the site revamp.** Audit performed against the *rendered HTML* in `out/`
(what users and Google actually see), not the JSX source.

17 indexable pages · 14,055 words · 137 sections · 0 broken internal links

---

## 1. Live defects — fix these before the revamp

These are costing traffic and conversions today. None require design decisions.

### 1.1 Every non-homepage title has the brand name twice — SEVERITY: HIGH

`app/layout.tsx` sets a title template:

```ts
title: { template: "%s | Ankuram Tuition Centre" }
```

…but all 16 page-level titles *already* end with the brand. Result, live in Google today:

> `CBSE Maths Tuition in Jubilee Hills, Hyderabad | Ankuram Tuition Centre | Ankuram Tuition Centre`

All 16 affected. Every title is 68–98 characters; Google truncates around 60, so searchers
see the useful half cut off and a redundant brand fragment instead.

**Fix:** drop the brand suffix from each page's own `title`, let the template add it once.
Frees 20–25 characters per title for keywords.

### 1.2 Conflicting business address in structured data — SEVERITY: HIGH

The homepage emits **two different** `LocalBusiness` schemas that disagree:

| | `app/page.tsx:56` | `components/LocalBusinessSchema.tsx:12` |
|---|---|---|
| Postal code | `500033` | `500096` |
| Latitude | `17.4325` | `17.419361` |
| Longitude | `78.4073` | `78.397636` |

The two coordinate pairs are roughly 1.5 km apart. `lib/constants.ts:23` agrees with the
second (`500096`).

For a GMB-attached business this matters more than usual: Google cross-references on-page
structured data against the Business Profile, and NAP (Name/Address/Phone) inconsistency
is a well-established local-ranking suppressor. **This is the single highest-value fix in
this document.**

**Fix:** delete the inline `jsonLd` block in `app/page.tsx`, keep one schema sourced from
`lib/constants.ts`, and verify the postcode against the GMB listing.

### 1.3 `LocalBusiness` schema is emitted on all 17 pages — SEVERITY: MEDIUM

`LocalBusinessSchema` sits in `app/layout.tsx`, so every page declares itself to be the
business premises. It belongs on `/` and `/contact` only.

### 1.4 Sitemap URLs all redirect — SEVERITY: MEDIUM

`public/sitemap.xml` lists URLs without trailing slashes (`/cbse-maths-tuition`), but
`next.config.mjs` sets `trailingSlash: true` and `.htaccess` 301s to add one. Every
sitemap entry is a redirect hop before the real page.

**Fix:** add trailing slashes throughout `sitemap.xml`.

### 1.5 The conversion page is orphaned — SEVERITY: MEDIUM

Internal links counted from `<main>` only (excludes header/footer chrome):

| Page | Outbound | Inbound |
|---|---|---|
| `/diagnostic/` | **0** | **0** |
| `/about/` | **0** | **0** |
| `/contact/` | **0** | **0** |
| `/curricula/` | 7 | **0** |

`/diagnostic/` is where the ₹750 offer converts, and not one body-content link on the site
points to it. Every "Start With a Diagnostic" CTA goes to WhatsApp instead. The header nav
links it, but nav links carry far less weight than contextual in-content links.

---

## 2. Page inventory

| URL | Words | Sections | H2 | H3 | Paras | Avg words/para | List items |
|---|---|---|---|---|---|---|---|
| `/` | 1406 | 11 | 10 | 22 | 64 | 16.8 | 12 |
| `/ib-dp-maths-tuition/` | 1435 | 10 | 9 | 11 | 51 | 19.6 | 32 |
| `/a-levels-maths-tuition/` | 1317 | 10 | 9 | 8 | 47 | 16.1 | 45 |
| `/ib-myp-maths-tuition/` | 1220 | 10 | 9 | 7 | 38 | 18.7 | 30 |
| `/igcse-maths-tuition/` | 1180 | 10 | 9 | 6 | 49 | 16.5 | 24 |
| `/icse-maths-tuition/` | 1141 | 10 | 9 | 6 | 43 | 19.5 | 15 |
| `/isc-tuition/` | 1130 | 10 | 9 | 6 | 41 | 18.4 | 19 |
| `/cbse-maths-tuition/` | 1112 | 10 | 9 | 6 | 46 | 18.5 | 13 |
| `/class-11-tuition/` | 798 | 7 | 6 | 10 | 29 | 23.7 | 0 |
| `/class-10-tuition/` | 764 | 7 | 6 | 10 | 28 | 21.2 | 2 |
| `/class-12-tuition/` | 716 | 7 | 6 | 8 | 28 | 21.7 | 0 |
| `/class-8-tuition/` | 705 | 8 | 7 | 7 | 27 | 21.5 | 0 |
| `/class-9-tuition/` | 693 | 8 | 7 | 8 | 28 | 20.9 | 0 |
| `/diagnostic/` | 543 | 7 | 5 | 13 | 39 | 10.3 | 0 |
| `/about/` | 397 | 6 | 5 | 7 | 22 | 15.0 | 0 |
| `/contact/` | 239 | 3 | 2 | 0 | 20 | 8.9 | 0 |
| `/curricula/` | 159 | 3 | 8 | 0 | 18 | 6.7 | 0 |

**Thin pages:** `/curricula/` (159 words across 8 H2s — a link hub with headings but no
content), `/contact/` (239), `/about/` (397 — thin for the page that should carry the
trust story).

**Fragmented page:** `/diagnostic/` has 39 paragraphs averaging 10.3 words each across 13
H3s. It's chopped into confetti — the opposite failure mode from the curriculum pages, but
equally hard to read.

---

## 3. Why it reads as a wall of text

The whole site — all 137 sections across 17 pages — is built from **five** structural
shapes:

| Shape | Count | Share |
|---|---|---|
| CTA / prose band | 50 | 36% |
| Prose stack | 32 | 23% |
| Card grid | 32 | 23% |
| List stack | 17 | 12% |
| Card pair | 6 | 4% |

Every one of those shapes is: *centered heading → centered grey paragraph → bordered box
containing bold title + grey paragraph*. The container changes; the texture never does.

**Consecutive identical shapes** (the specific thing that makes a page feel like a wall):

| Page | Shape sequence | Longest identical run |
|---|---|---|
| `/` | CTA > GRID > GRID > PAIR > GRID > GRID > LIST > GRID > GRID > CTA > CTA | 2 |
| `/isc-tuition/` | CTA > PROSE > LIST > LIST > LIST > PROSE > CTA > PAIR > GRID > CTA | **3** |
| `/igcse-maths-tuition/` | CTA > PROSE > LIST > LIST > LIST > CTA > PROSE > PAIR > GRID > CTA | **3** |
| `/ib-myp-maths-tuition/` | CTA > PROSE > LIST > LIST > LIST > CTA > PROSE > GRID > GRID > CTA | **3** |
| `/cbse-maths-tuition/` | CTA > PROSE > PROSE > PROSE > LIST > PROSE > PROSE > GRID > GRID > CTA | **3** |
| `/icse-maths-tuition/` | CTA > PROSE > PROSE > PROSE > LIST > PROSE > CTA > GRID > GRID > CTA | **3** |
| `/a-levels-maths-tuition/` | CTA > PROSE > LIST > LIST > LIST > PROSE > PROSE > PAIR > GRID > CTA | **3** |

The homepage has **six card grids in eleven sections**. The curriculum pages hit three
identical list-stacks in a row, which is where the effect is worst.

Note the homepage is *not* the worst offender by word count (1406 words is reasonable for a
local-services landing page). The problem is entirely rhythm, not volume. **This confirms
the content doesn't need cutting — it needs re-shaping.**

---

## 4. Duplicate content across pages

14 distinct text blocks appear on more than one page.

| Appears on | Block |
|---|---|
| **7 pages** | "A 45-60 minute assessment that finds exactly where your child stands — and what to do about it. Rs. 750, fully credited when you enroll." |
| **6 pages** | "A 60-minute diagnostic tells you exactly where your child stands — and what to do about it. Rs. 750, fully credited when you enroll." |
| **5 pages** | "Rs. 750 — fully credited on enrollment." |
| **3 pages** | "Small batches of 3–5 students. Online, offline, and hybrid. We work with students internationally." |

Note the first two are *near*-duplicates of each other with inconsistent wording
("45-60 minute assessment" vs "60-minute diagnostic"). The site can't decide how long the
diagnostic is. `lib/constants.ts` FAQ says "45–60 minute"; the homepage hero says
"60 minutes".

**Repeated H2 headings:**

| Count | Heading |
|---|---|
| 7× | "Is This Your Child?" |
| 7× | "Common Gaps We Fix" |
| 7× | "The Diagnostic" |
| 7× | "Subjects & Grades" |
| 7× | "Start With a Diagnostic" |
| 6× | "Every Week You Wait, the Gap Grows" |
| 5× | "Subjects Available" |

The 7 curriculum pages share an identical 10-section skeleton. That's fine as a *template*
— it's a problem only because 4 of them don't use the template that exists (see §6).

Titles and meta descriptions are all unique. Good.

---

## 5. Content model (feeds Phase 5 extraction)

Every section on the site reduces to **15 block types**. This is the schema the new design
system should be built against:

| Block type | Used on | Current H2 |
|---|---|---|
| `hero` | all 17 | (H1) |
| `painPoints` | 7 curriculum, `/` | "Is This Your Child?" / "Sound Familiar?" |
| `methodSteps` | 7 curriculum, 5 grade, `/` | "How We Teach X" / "The Ankuram Method" |
| `differentiators` | 7 curriculum | "What Makes Our X Teaching Different" |
| `gapList` | 7 curriculum | "Common Gaps We Fix" |
| `diagnosticPromo` | 7 curriculum | "The Diagnostic" |
| `subjectsGrades` | 12 | "Subjects & Grades" / "Subjects Available" |
| `relatedLinks` | 12 | "X Tuition by Grade" / "Curricula We Cover for X" |
| `faqs` | 14 | "Common Questions from X Parents" |
| `ctaBand` | all 17 | "Start With a Diagnostic" / "Every Week You Wait…" |
| `testimonials` | `/` | "What Parents & Students Say" |
| `comparison` | `/` | "Not All Tuition Centres Near Me Are the Same" |
| `curriculaGrid` | `/`, `/curricula/` | "All Major Boards…" |
| `gradesGrid` | `/` | "…for Every Grade" |
| `areasServed` | `/`, `/contact/` | "Areas We Serve" |

**Implication for Phase 4:** the block library needs ~15 components, and 7 of the 17 pages
are the *same sequence* of 10 blocks with different copy. Get the curriculum template right
and 41% of the site is done in one pass.

---

## 6. The mechanical cause of the monotony

This is the most important finding in the audit, and it is an *architecture* problem, not a
taste problem.

`components/CurriculumPageTemplate.tsx` and `components/GradePageTemplate.tsx` **are** used —
by all 12 template-driven pages. The structure is already centralised. But both templates
expose their main content fields as raw JSX escape hatches:

```ts
// CurriculumPageTemplate.tsx
howWeTeachContent:        React.ReactNode;   // line 16
whatMakesDifferentContent: React.ReactNode;  // line 18
diagnosticContent:        React.ReactNode;   // line 20
subjectsContent:          React.ReactNode;   // line 21

// GradePageTemplate.tsx
whyItMatters:   React.ReactNode;             // line 14
howWeTeach:     React.ReactNode;             // line 15
parentInsight.content: React.ReactNode;      // line 20
```

So the template owns the section *skeleton*, then hands rendering of everything inside it
back to the page file. With no component available for "a card", every page author reaches
for the same markup:

| File | Copies of `<div className="bg-white p-6 rounded-xl border border-gray-100">` |
|---|---|
| `app/ib-dp-maths-tuition/page.tsx` | 12 |
| `app/igcse-maths-tuition/page.tsx` | 9 |
| `app/a-levels-maths-tuition/page.tsx` | 8 |
| `app/cbse-maths-tuition/page.tsx` | 7 |
| `app/ib-myp-maths-tuition/page.tsx` | 7 |
| `app/class-10-tuition/page.tsx` | 6 |
| `app/class-11-tuition/page.tsx` | 6 |
| `app/icse-maths-tuition/page.tsx` | 6 |
| `app/isc-tuition/page.tsx` | 6 |
| `app/class-12-tuition/page.tsx` | 4 |
| `app/class-8-tuition/page.tsx` | 4 |
| `app/class-9-tuition/page.tsx` | 4 |
| **Total** | **79 hand-written copies of one identical card** |

Across `app/`, there are **995 hardcoded `className` strings**. On `ib-dp-maths-tuition`,
27% of the file is raw JSX markup embedded inside what is nominally a data object.

**Why this produces a wall of text:** an author writing a new section has exactly one tool —
that card div. Not because anyone chose sameness, but because no alternative exists in the
codebase. Every new piece of content becomes another bordered box with a bold title and a
grey paragraph. The monotony is the architecture's default output.

**Why this is good news for the revamp:** the content is already separated into typed data
objects (`CurriculumPageData`, `GradePageData`). Phase 5 is therefore much smaller than a
from-scratch extraction — the work is converting **7 `ReactNode` fields into structured
block arrays**, not disentangling 5,630 lines of prose from markup. Once those seven fields
become data, redesigning the block components restyles all 12 pages at once.

**Corrected scope note:** an earlier reading of this codebase suggested the templates were
unused and the pages were bespoke. They are not. The line counts (278–426) are large
because the pages carry their content *plus* hand-written JSX, not because they duplicate
the template.

## 7. Recommendations by page group

**Curriculum pages (7)** — the worst wall-of-text offenders, and the biggest win: they
already share one template, so fixing `howWeTeachContent` and `whatMakesDifferentContent`
fixes all seven at once. Break the three-consecutive-list-stacks pattern: `gapList` becomes
a two-column diagnostic table, `methodSteps` becomes a horizontal timeline,
`differentiators` becomes a numbered callout. Content stays; shape changes.

**Grade pages (5)** — structurally healthier (7–8 sections, no runs longer than 2) but the
thinnest unique content. `class-8` through `class-12` largely restate the curriculum pages.
Highest average paragraph length on the site (21–24 words). Keep, but differentiate: each
grade page should lead with what's specific to *that year*.

**`/` homepage** — six card grids. Needs the most shape variety of any page, and the
4.8★/465-review proof moved above the fold. Currently section 7 of 11.

**`/diagnostic/`** — over-fragmented (39 paras averaging 10 words). Needs consolidating
*into* larger blocks, the opposite of everywhere else. Also needs inbound links from every
curriculum and grade page.

**`/curricula/`** — 159 words, 8 H2s. Either build it into a genuine comparison page
("which board is right for your child?") or merge it into the homepage grid and redirect.

**`/about/`** — 397 words. With no photography available, this page carries the entire
trust burden through copy alone. Should be the *longest* page on the site, not the
third-shortest.

**`/contact/`** — 239 words, the thinnest page on the site. The Google Maps embed is
already wired up (`app/contact/page.tsx:138`). Add written directions from each area
served, parking guidance, and class timings — all high-intent local-SEO content.

---

## 8. What carries forward

| Asset | Status |
|---|---|
| URL structure (17 slugs) | **Freeze.** Do not change any slug. |
| Copy | Keep. It's specific and parent-focused. Re-shape, don't rewrite. |
| Per-page unique titles/descriptions | Keep (after removing the doubled brand). |
| FAQ schema on 14 pages | Keep. |
| `lib/constants.ts` | Keep and extend — it's the beginning of the content layer. |
| Build/perf work (Lighthouse 93, 98 KB JS) | Protect. Do not regress. |
| Section shapes | **Replace.** This is the revamp. |
| `CurriculumPageTemplate` / `GradePageTemplate` | Keep the pattern; **replace the 7 `ReactNode` fields with typed block arrays**. |
| 79 hand-copied card divs | **Delete.** Replaced by the Phase 4 block library. |
