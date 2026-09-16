# Ankuram design system

From P2 Direction C (diagram-led), finalised in P3.

- **Stylesheet:** `css/site.css` — a new file. The live `styles.css` is not
  touched by any of this.
- **Live examples:** `design/blocks.html` (every block) and
  `design/direction-c/index.html` (the real homepage content).
- **Contrast data:** `design/site-contrast.json`.

## How it coexists with the old CSS

Everything is scoped under `.v2` on `<body>`. A migrated page carries
`class="v2"` and links both stylesheets; an unmigrated page links only
`styles.css` and renders byte-identically to today. That is what lets the
93 pages move in waves without a flag day. `styles.css` is deleted only in a
final cleanup wave, as its own decision.

## Tokens

### Colour

| Token | Hex | Use |
|---|---|---|
| `--ground` | `#F7F8FA` | page background |
| `--sheet` | `#FFFFFF` | cards, alternating sections |
| `--ink` | `#14181F` | headings |
| `--ink-soft` | `#454F5E` | body text |
| `--ink-mute` | `#5B6675` | captions, meta |
| `--blue` | `#1B3A6B` | the single accent: links, buttons, numerals |
| `--blue-deep` | `#12294C` | text on tinted panels |
| `--blue-soft` | `#E8EEF7` | panel and diagram-step fill |
| `--blue-line` | `#B9CAE2` | diagram-step border |
| `--line` | `#D8DEE7` | hairlines, card borders |
| `--grid` | `#E9EDF3` | the notebook grid, hero only |
| `--gold` | `#8A6212` | star glyphs |
| `--green` | `#0B6B4F` | WhatsApp only |

One accent colour. Gold and green are reserved for the Google stars and the
WhatsApp button and appear nowhere else.

### Type

System stacks only — **0 bytes of webfont**, and no render-blocking font
request. This is the fix for the live homepage's 8.5 s text LCP.

`--sans` system UI stack · `--mono` system monospace, for numerals, table keys
and the curricula line.

| Token | Size |
|---|---|
| `--t-xs` | 0.78rem |
| `--t-sm` | 0.88rem |
| `--t-base` | 1rem |
| `--t-lg` | 1.14rem |
| `--t-xl` | 1.4rem |
| `--t-2xl` | `clamp(1.4rem, 3.2vw, 2.05rem)` |
| `--t-3xl` | `clamp(1.9rem, 5.2vw, 3.05rem)` |

Base is 17px, dropping to 16px under 640px. Diagram captions are pinned to
**16px** below 600px so the diagram never becomes the smallest text on a phone.

### Spacing

A 4px base: `--s1` 4 · `--s2` 8 · `--s3` 12 · `--s4` 16 · `--s5` 24 ·
`--s6` 32 · `--s7` 44 · `--s8` 56 · `--s9` 72. Radii: `--radius` 10px,
`--radius-sm` 7px.

## Blocks

| # | Block | Class | Notes |
|---|---|---|---|
| 1 | Header | `.site-header` | brand, WhatsApp + call link, desktop nav, `<details>` mobile menu |
| 2 | Hero | `.hero` | notebook grid background, lede, CTAs, rating, trust list |
| 3 | Method diagram | `.method` | four steps, icons, captions, loop arrow |
| 4 | Numbered list | `.numbered` | CSS counter, or `.own-nums` when the page has its own numerals |
| 5 | Card grid | `.cards` | auto-fit, min 252px; `.step-label` pill; `.sub-card` for nesting |
| 6 | Comparison table | `.deftable` | `<th scope="row">`, scrolls horizontally, stacks under 640px |
| 7 | Steps / rows | `.rows`, `.regions` | wide items; region grid for long comparable lists |
| 8 | FAQ accordion | `.accordion` | native `<details>`, no JavaScript |
| 9 | Review band | `.rating` | 4.8, stars, review count, business name |
| 10 | Stat band | `.stat-band` | tabular figures |
| 11 | Panel grid | `.panel` | tinted, breaks a run of white cards |
| 12 | CTA band | `.cta-band` | one per page, at the bottom |

Twelve block types; the brief asked for ten.

### The method diagram

Four numbered steps, each with an inline-SVG icon (test paper; magnifier over a
gap; building blocks; exam paper with a tick), its title and its caption. Step 4
is tinted slightly stronger. A loop arrow runs from step 4 back to step 2.

- **Desktop (≥601px):** horizontal flow, arrows between steps, the loop drawn
  underneath as a bracket.
- **Mobile (≤600px):** vertical stack, down-arrows, the loop drawn as a bracket
  in a 34px gutter on the left, its label full width beneath.

Step text is **real HTML text**, not SVG text, so it reflows, scales with the
user's font size and is selectable. The `<figure>` carries `role="group"` with
an `aria-label` naming all four steps and the loop; the icons and arrows are
`aria-hidden`.

Step 4's title is lowercase in the source copy (`improve marks and confidence`).
Its first letter is raised with `::first-letter { text-transform: uppercase }` —
**CSS only**. The text node is untouched, so the wording check still sees the
original string.

## Contrast — every pair meets WCAG AA

| Pair | Ratio | Level |
|---|---|---|
| Body `#454F5E` on ground `#F7F8FA` | 7.80:1 | AAA |
| Body `#454F5E` on sheet `#FFFFFF` | 8.29:1 | AAA |
| Body `#454F5E` on panel `#E8EEF7` | 7.11:1 | AAA |
| Headings `#14181F` on ground | 16.75:1 | AAA |
| Headings `#14181F` on sheet | 17.79:1 | AAA |
| Link `#1B3A6B` on ground | 10.60:1 | AAA |
| Link `#1B3A6B` on sheet | 11.27:1 | AAA |
| Diagram title `#12294C` on step card `#E8EEF7` | 12.44:1 | AAA |
| Diagram title `#12294C` on step 4 `#D5E2F3` | 11.06:1 | AAA |
| Primary button `#FFFFFF` on `#1B3A6B` | 11.27:1 | AAA |
| Ghost button `#1B3A6B` on ground | 10.60:1 | AAA |
| WhatsApp button `#FFFFFF` on `#0B6B4F` | 6.50:1 | AA |
| Step badge `#FFFFFF` on `#1B3A6B` | 11.27:1 | AAA |
| Step label pill `#1B3A6B` on `#E8EEF7` | 9.66:1 | AAA |
| CTA band text `#D3DEEE` on `#1B3A6B` | 8.29:1 | AAA |
| CTA band heading `#FFFFFF` on `#1B3A6B` | 11.27:1 | AAA |
| Stars `#8A6212` on sheet | 5.47:1 | AA |
| Mono table key `#1B3A6B` on sheet | 11.27:1 | AAA |

**Nothing falls below 4.5:1.** Sixteen of the eighteen pairs clear AAA. The
star glyphs are additionally `aria-hidden`, with the rating exposed through an
`aria-label` on the container.

## Rules the system enforces

- No two consecutive sections share a layout; the builder throws if they do.
- Decorative numerals come from CSS counters, never from text nodes, so they
  cannot inflate a word count.
- Every image carries explicit `width`/`height` plus `loading="lazy"` — which
  is why measured CLS is 0. Under A9 the homepage carries no photograph at all.
- No JavaScript beyond the single tracking snippet: the mobile menu and the FAQ
  are `<details>`.
- One gtag load configuring both `G-MQRSS8DKLE` and `AW-10954184691`, per A1.
