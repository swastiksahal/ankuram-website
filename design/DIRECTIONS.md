# P2 — Three homepage directions

Local only. Three directions in `design/direction-a|b|c/` (one `index.html` +
one `styles.css` each), rendered from the real current homepage content.

## Summary

| | A — Warm editorial | B — Ankuram navy & gold | C — Diagram-led |
|---|---|---|---|
| Lighthouse mobile (perf) | **96** | **99** | **99** |
| Accessibility | 100 | 100 | 100 |
| Best practices | 75 | 79 | 79 |
| SEO | 54 | 54 | 50 |
| LCP | 903 ms | 902 ms | 901 ms |
| CLS | **0** | **0** | **0** |
| Total page weight | 619,464 B | 618,412 B | **409,170 B** |
| HTML | 39,200 B | 39,432 B | 39,051 B |
| CSS | 8,289 B | 9,110 B | 9,105 B |
| Webfont bytes | **0** | **0** | **0** |
| Hero image | 208,656 B (lazy) | 208,656 B (lazy) | none — diagram |
| Horizontal scroll @360/390/768/1440 | none | none | none |
| Visible words | 3,258 | 3,258 | 3,258 |

**Read the Lighthouse numbers with care.** These were served from `127.0.0.1`,
so there is no network latency and LCP around 900 ms is not comparable to the
live homepage's 8,501 ms. What *is* comparable: page weight (814 KB live → 619
or 409 KB), CLS (0 everywhere) and the removal of the render-blocking font
request. The real LCP number comes from staging.

**SEO 50–54 is expected and not a defect.** Every mockup carries
`<meta name="robots" content="noindex, nofollow">` and no meta description,
because these are drafts that must never be indexed. The rebuilt page inherits
the live `<title>`, description and canonical byte-identical (invariant 3).

**Best practices 75–79 matches the live baseline** and comes from the Google
tag scripts, which A1 requires. Per your P0d note, it is not chased by removing
tracking.

---

## Wording: identical in all three, and verified

All three render from `design/home-content.json`, extracted by
`design/extract-home.js`, which walks every text node in the live homepage and
copies it verbatim. No word is retyped anywhere in this phase.

```
original tokens: 3226  captured: 3205
excluded: 12 mobile-menu duplicate tokens (same words as header nav)
excluded: 3 sticky CTA bar tokens (removed by APPROVED-CHANGES A6)
no distinct string lost: all 383 unique text nodes are represented
visible words — a:3258 b:3258 c:3258 (identical)
```

The build fails if the three word counts diverge, or if `null`/`undefined`
leaks into a page. Both checks caught real bugs while building this.

Two structural notes:

- **The diagnostic pop-up became an on-page section.** The live homepage keeps
  ~400 words inside `div#diagnosticModal`. A6 removes pop-ups on non-paid
  pages, but invariants 5 and 14 keep the words, so that content is now a
  normal section (a `<details>` disclosure in B and C).
- **No paragraph on this page exceeds 60 words**, so nothing needed splitting.
  The longest is 55. The brief's "break up long blocks" rule had nothing to act
  on here; it will matter on other pages.

---

## A — Warm editorial

Calm, like a well-made textbook. Warm paper grounds, alternating section
washes, terracotta for emphasis, large serif display numerals carrying the
step sequences.

**Fonts — 0 bytes.** System stacks only:
`"Iowan Old Style", "Palatino Linotype", Palatino, "Book Antiqua", Georgia, serif`
for display, and the system UI sans for body. CLAUDE.md permits "system fonts
or one self-hosted subset font"; using zero webfonts is the strongest answer to
the live LCP problem, which *is* the webfont.

**Palette and contrast**

| Role | Hex | On | Ratio | WCAG |
|---|---|---|---|---|
| Body text | `#4A423B` | `#FAF6EF` | 9.14:1 | AAA |
| Body text (alt band) | `#4A423B` | `#FDFCFA` | 9.60:1 | AAA |
| Headings | `#1A1714` | `#FAF6EF` | 16.57:1 | AAA |
| Primary button | `#FFFFFF` | `#8F4A13` | 6.65:1 | AA |
| Link / numeral | `#8F4A13` | `#FAF6EF` | 6.17:1 | AA |
| WhatsApp button | `#FFFFFF` | `#0B6B4F` | 6.50:1 | AA |
| Final CTA band | `#FAF6EF` | `#1A1714` | 16.57:1 | AAA |
| Star glyphs (decorative) | `#C4691F` | `#FAF6EF` | 3.62:1 | AA large |

Terracotta `#C4691F` is the accent as specified; `#8F4A13` is the same hue
darkened for anything carrying text, so no text sits at 3.62:1. The stars are
`aria-hidden` with the rating exposed via `aria-label`.

**Sections**

| # | Section | Layout |
|---|---|---|
| 1 | Why Choose Ankuram Tuition Centre? | numbered steps |
| 2 | Subjects We Teach | full-width rows |
| 3 | Students From Across Hyderabad | nested region grid |
| 4 | Find Your Program | panel grid |
| 5 | How We Work | numbered steps |
| 6 | What We Offer | card grid |
| 7 | How We Teach at ANKURAM | single-column prose |
| 8 | Curricula We Support | panel grid |
| 9 | About ANKURAM | full-width rows |
| 10 | Get in Touch | panel grid |
| 11 | Reviews | card grid |
| 12 | Frequently Asked Questions | disclosure accordion |
| 13 | Diagnostic Test | single-column prose |

Method diagram sits in section 5, How We Work.

---

## B — Ankuram navy & gold

Premium and confident. Existing brand colours, crisp white cards on a mist
ground, navy full-bleed panels breaking the rhythm, gold as the single accent.

**Fonts — 0 bytes.** System UI sans throughout, weights 400/700/800.

**Palette and contrast**

| Role | Hex | On | Ratio | WCAG |
|---|---|---|---|---|
| Body text | `#46536A` | `#FFFFFF` | 7.76:1 | AAA |
| Headings | `#1A2942` | `#FFFFFF` | 14.59:1 | AAA |
| Hero body | `#C6D0E0` | `#1A2942` | 9.38:1 | AAA |
| Hero headings | `#FFFFFF` | `#1A2942` | 14.59:1 | AAA |
| Primary button | `#111C2E` | `#D4A574` | 7.67:1 | AAA |
| Header tel link | `#D4A574` | `#1A2942` | 6.55:1 | AA |
| Link on white | `#7A5320` | `#FFFFFF` | 6.81:1 | AA |
| Final CTA band | `#4A3512` | `#D4A574` | 5.21:1 | AA |
| Star glyphs (decorative) | `#B8801F` | `#FFFFFF` | 3.42:1 | AA large |

Brand gold `#D4A574` works as a *background* (7.67:1 with navy text) but not as
text on white, so `#7A5320` — the same hue darkened — carries links. This is the
one place the brand palette needed extending.

**Sections**

| # | Section | Layout |
|---|---|---|
| 1 | Why Choose Ankuram Tuition Centre? | card grid |
| 2 | Subjects We Teach | definition table |
| 3 | Students From Across Hyderabad | nested region grid |
| 4 | Find Your Program | panel grid (navy) |
| 5 | How We Work | numbered steps |
| 6 | What We Offer | full-width rows |
| 7 | How We Teach at ANKURAM | card grid |
| 8 | Curricula We Support | panel grid (navy) |
| 9 | About ANKURAM | definition table |
| 10 | Get in Touch | card grid |
| 11 | Reviews | panel grid (navy) |
| 12 | Frequently Asked Questions | disclosure accordion |
| 13 | Diagnostic Test | panel grid (navy) |

Method diagram sits in section 7, How We Teach at ANKURAM, reversed out on navy.

---

## C — Diagram-led

Clear and methodical. The method diagram *is* the hero — it appears above the
fold instead of a photograph. A faint maths-notebook grid backs the hero only.
One blue ink accent, numbered steps as the spine.

**Fonts — 0 bytes.** System UI sans, plus the system monospace stack
(`ui-monospace, SFMono-Regular, Menlo, Consolas`) for numerals, the curricula
line and table keys.

**Palette and contrast**

| Role | Hex | On | Ratio | WCAG |
|---|---|---|---|---|
| Body text | `#454F5E` | `#F7F8FA` | 7.80:1 | AAA |
| Body text (sheet) | `#454F5E` | `#FFFFFF` | 8.29:1 | AAA |
| Headings | `#14181F` | `#F7F8FA` | 16.75:1 | AAA |
| Primary button | `#FFFFFF` | `#1B3A6B` | 11.27:1 | AAA |
| Link | `#1B3A6B` | `#F7F8FA` | 10.60:1 | AAA |
| Panel text | `#1B3A6B` | `#E8EEF7` | 9.66:1 | AAA |
| Final CTA band | `#D3DEEE` | `#1B3A6B` | 8.29:1 | AAA |
| Star glyphs (decorative) | `#B8801F` | `#FFFFFF` | 3.42:1 | AA large |

Every text pair in C clears AAA. It is the most accessible of the three by a
clear margin, and the lightest at 409 KB because it carries no photograph.

**Sections**

| # | Section | Layout |
|---|---|---|
| 1 | Why Choose Ankuram Tuition Centre? | numbered steps |
| 2 | Subjects We Teach | card grid |
| 3 | Students From Across Hyderabad | nested region grid |
| 4 | Find Your Program | definition table |
| 5 | How We Work | numbered steps |
| 6 | What We Offer | panel grid |
| 7 | How We Teach at ANKURAM | full-width rows |
| 8 | Curricula We Support | card grid |
| 9 | About ANKURAM | single-column prose |
| 10 | Get in Touch | panel grid |
| 11 | Reviews | card grid |
| 12 | Frequently Asked Questions | disclosure accordion |
| 13 | Diagnostic Test | full-width rows |

Method diagram is the hero.

---

## Shared across all three

- **No two consecutive sections share a layout.** The build throws if a plan
  ever puts the same layout twice in a row.
- **Method diagram** — inline SVG, four steps, labels taken verbatim from the
  page: *Diagnostic Test → Gaps in foundational knowledge → Foundation‑First
  Learning → improve marks and confidence*. Titled and described for screen
  readers, scales to container width.
- **Rating near the top** — 4.8, five stars, "516 Reviews" and the business
  name, inside the hero, exactly the figures on the live page.
- **Header** carries the small WhatsApp + call link (A6). No sticky bar, no
  pop-up, no mid-page CTA banner. One CTA block at the bottom.
- **Single gtag load** — one `gtag/js?id=G-MQRSS8DKLE`, then `config` for both
  `G-MQRSS8DKLE` and `AW-10954184691`, per P1 section 6 item 2. Delegated
  listeners fire the WhatsApp and phone conversion labels from A1.
- **Images** carry explicit `width`/`height` plus `loading="lazy"` and
  `decoding="async"` — which is why CLS is 0 in all three.
- **No stock photography.** A and B use the centre's own existing
  `classroom-teaching.webp`; C uses no photograph at all.

## Screenshots

`design/screens/` — 6 PNGs, full page, 390 px and 1440 px, ~15 MB total
(committed, as asked). Index with byte sizes: `design/screens-index.csv`.
Raw Lighthouse JSON: `design/lighthouse/` (gitignored, 3.1 MB; the scores it
contains are in `design/checks.json`). Contrast maths: `design/contrast.json`.
Scroll and audit results: `design/checks.json`.

## One thing to decide

Direction C drops the classroom photograph entirely in favour of the diagram.
That is what makes it 200 KB lighter and gives it the cleanest accessibility
result — but it also removes the only human image on the page. If the photo
matters for warmth, C can carry it lower down at a cost of about 40 KB
(responsive, lazy); it would still be the lightest of the three.
