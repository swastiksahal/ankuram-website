# Approved changes — the ONLY allowed differences from baseline in the rebuild
Every rebuilt page must pass parity except for the items below. Each change is logged per page in the parity report.

A1 TRACKING — one standard block on every indexable page, replacing whatever is there:
  GA4 G-MQRSS8DKLE · Google Ads AW-10954184691 · WhatsApp conversion AW-10954184691/jucWCNPv3OAbEPOvruco · Phone conversion AW-10954184691/NGIFCNbv3OAbEPOvruco · Clarity uir8kpny76
  Fixes: G-MQRSS8DKKE typo, G-KHP2PBXF6X on .com pages, label typo jucWCNbv…, AW-XXXXXXXXX / CLARITY_PROJECT_ID / GTM-XXXXXXX / YOUR_LABEL placeholders, and the 23 pages with no tag.
  Every wa.me link fires the WhatsApp label; every tel: link fires the phone label.
A2 NAP — one form everywhere, visible text and JSON-LD:
  Name "Ankuram Tuition Centre" (JSON-LD alternateName may keep "Ankuram Tuition Center"; remove "Center" from alt text and body).
  Address "Plot 229, Road No. 72, Prashasan Nagar, Jubilee Hills, Hyderabad, Telangana 500096".
  Phone display "+91 73966 69430", tel:+917396669430, wa.me/917396669430.
  Geo 17.4193614, 78.4002112.
  Fixes: +919396669430 typo, postcodes 500033 and 500034, all other coordinate pairs.
A3 BROKEN INTERNAL LINKS — the 28 targets in baseline/broken-links.json may be repointed, but ONLY to a mapping that the supervisor approves first (docs/link-map.csv, proposed in P1).
A4 CANONICALS — the 5 defective canonicals may be corrected to the URL that actually serves 200 (per baseline/live-http.csv).
A5 H1 — electrochemistry-class-12-cbse keeps its first H1 text as the single H1; the other 20 become H2 with identical text.
A6 CTA — header gets the approved small WhatsApp + call link. Sticky bars, pop-ups and mid-page CTA banners are removed EXCEPT on the four paid pages, which keep their current conversion elements until Swastik decides.

NOT approved (need a separate decision — do not change):
- Any URL, redirect, .htaccess, robots.txt or sitemap.xml change
- /cbse-class-10-online-tuition indexing status
- Any wording, price, batch size or offer text (including /cbse-class-10/ "Batch of 5 students", "45-minute" diagnostic copy)
- Removing unreachable files (cbse-class-10-maths.html, areas/kukatpally.html, ib-pyp-tuition-hyderabad.html, class-8-maths/sitemap.xml and robots.txt)

A3 decisions (link-map approved, 16 Sep):
- Apply docs/link-map.csv exactly as proposed for every row that has a URL.
- The 10 DECIDE rows: remove the <a> element but keep its visible text as plain text inside body content. If the link is a navigation/menu item (e.g. "Study Notes", "Practice Sheets", "Resources") remove the whole menu item. Log each one per page in the parity report as an A3 exception to invariants 5 and 6.
- /areas/jubilee-hills -> / and /online-tuition.html -> /online-maths-tuition are approved.

A7 /cbse-class-10/ (paid page, last wave, Swastik's decisions 16 Sep):
- KEEP the sticky mobile WhatsApp/Call bar on the 4 paid pages only (conversion exception for mobile ad traffic). All other pages follow A6.
- KEEP fees, batch sizes, hours and timings exactly: Regular Rs 8,000/month, batch of 5, 6 hours/week, Mon–Sat 8–9 PM; Intensive Rs 14,000/month, batch of 3, 10 hours/week, Mon–Sat 6:30–8 PM + Sun test.
- CHANGE badge text "Most Popular" to "Recommended" (visible text only).
- KEEP "45-minute assessment + 45-minute personal review" and KEEP "We schedule your child's diagnostic within 48 hours".
- ADD exactly:
  (a) Diagnostic pricing card, after "Detailed gap analysis report": "Full worked solutions to every question, written by Swastik"
  (b) "How it works" step 2, after the existing sentence ending "...reviews results with you and your child" (unchanged), a new sentence: "You also receive Swastik's full worked solutions to every question, including the ones your child answered correctly."
- Do NOT add these to the FAQ or JSON-LD; FAQ JSON-LD stays byte-identical.

A8 /cbse-class-10-online-tuition, applied when its wave ships:
- set meta robots to "noindex, follow"
- remove its <url> entry from sitemap.xml (the only approved sitemap edit)
- never Disallow it in robots.txt
- evidence: 16 impressions, 0 clicks in 16 months; not used by Ads

A9 NO PHOTOS OF THE CENTRE (Swastik, 16 Sep):
- remove every photograph of the premises/classroom site-wide, including assets/images/classroom-teaching.webp wherever it is used
- remove the <img> together with its alt text, and log each removal per page as an A9 exception to invariant 7
- no replacement photo; visuals are diagrams, worked-maths graphics and typography only
- do not delete the file from the server; it simply stops being referenced

A10 METHOD DIAGRAM CAPTIONS (final wording approved on screenshot before any deploy):
- the diagram keeps its four existing titles exactly; add one caption under each, exactly:
  1 Diagnostic Test — "A test on last year's topics shows exactly where your child stands."
  2 Gaps in foundational knowledge — "Swastik solves every question and marks the exact gaps behind each mistake."
  3 Foundation-First Learning — "Weak basics are re-taught first, then the current syllabus is built on top."
  4 improve marks and confidence — "Regular practice and tests in small batches of 3–5, until the topic holds."
- add a loop arrow from step 4 back to step 2, labelled: "Tested again — any gap found is fixed again."
- these captions go in the diagram only, never in JSON-LD, title, meta or H1; the word-count check must allow exactly these added words

A11 HYBRID MODEL SECTION WITH DIAGRAMS (Swastik, 17 Sep; final wording approved on staging screenshot before production).
Facts confirmed by Swastik:
- Weekday classes are online on Google Meet. Swastik solves live on a digital board, shared on screen.
- The student solves on paper, sends a photo on WhatsApp, and it is corrected during the class.
- Worksheets are sent after class.
- Weekends at the Jubilee Hills centre are for in-person doubt clearing, and for revision and practice.
- Two routes depend on the student:
  Route A: weekdays online plus Saturday–Sunday at the centre.
  Route B (weaker foundations): 2 weekdays at the centre, other weekdays online, plus weekends at the centre, moving to Route A as confidence builds.
- No timings anywhere. No class recordings. Do not mention tests in the new diagrams.
New visible text is limited to the section title "How a week works" and the diagram labels and captions below. All existing wording stays word-for-word.
  D1 "Two routes through the week" (rebuilt 17 Sep): day chips "M T W T F S S"; key labels "Online · Google Meet" and "At the centre"; "Route A"; "Route B"; "Foundation support"; arrow label "As confidence builds"; and one line directly under the strip: "Weekends at the centre: doubts cleared in person · revision and practice".
    Route A shows five Online chips (M T W T F) then two At-the-centre chips (S S).
    Route B replaces its weekday chips with two grouped blocks carrying NO day letters: "2 days · At the centre" then "3 days · Online", followed by the two At-the-centre weekend chips. The earlier "+2" badge and the line "Any 2 weekdays at the centre" are removed -- the two blocks now carry that meaning, and no specific weekday is ever named.
    Chip styling: Online = white fill, blue outline, laptop icon. At the centre = solid navy fill, white text, building icon. Both pairs are AA (11.27:1).
  D2 "A weekday online class" (mobile-first rebuild, 17 Sep; these replace the longer labels): "Solved live on the digital board"; "Your child tries the next one"; "Photo sent on WhatsApp"; "Corrected in class"; centre label "Next problem · back to step 2"; under the loop, on one line: "After class: a worksheet to practise". On phones the four steps form a clockwise 2x2 with arrows between them (1 to 2, 2 down to 3, 3 back to 4).
  D3 removed (17 Sep). Its content is carried by the single weekend line in D1.
  Swipe rows below 600px carry the hint "Swipe →", set in the body font at 14px grey, at the right end of the row's heading line.
Structure (staging first; production needs a separate approval):
- The existing "How It Works" and "Why Online Classes Work" content moves under one section titled "How a week works", every sentence kept word-for-word.
- The locality cards move into a closed <details> titled "Students From Across Hyderabad", placed just above the FAQ, with the "Students from across Hyderabad learn with us …" sentence inside it.
- JSON-LD areaServed and every FAQ answer stay byte-identical.

A12 AREAS (Swastik, 17 Sep):
- The locality cards stay inside the closed <details> titled "Students From Across Hyderabad", just above the FAQ. Unchanged.
- Add ONE footer row titled "Areas we serve", linking every /areas/ page that returns a first-hop and final 200 in baseline/live-http.csv — 23 pages. /areas/kukatpally is excluded because it 301s to the homepage.
- Link text is the area name taken from that page's own H1 ("Best Tuition Centre for <Area> Students" -> "<Area>"), which is why KPHB and SR Nagar keep their real capitalisation.
- JSON-LD areaServed and every FAQ area answer stay byte-identical.

A13 HOMEPAGE WORDING (Swastik, 17 Sep):
- Visible review count "516 Reviews" becomes "500+ reviews". The JSON-LD AggregateRating reviewCount stays "516" and is NOT touched — the visible text and the structured data now differ deliberately, and that is the approved state.
- FAQ de-duplication: WITHDRAWN 17 Sep by the supervisor. The one exact duplicate pair ("Do you have a branch in Financial District?") has been RESTORED, so the visible FAQ matches the FAQPage JSON-LD exactly again — 23 visible pairs, 17 JSON-LD entries, the same three questions appearing twice in both.
  It will be done later as a single change touching the visible list and the JSON-LD together.
  For the record, verified on the baseline: only that one pair was an exact question-AND-answer duplicate. The Gachibowli and KPHB questions also appear twice but their ANSWERS DIFFER, so they were never candidates.
- Opening hours unchanged (Mon–Fri 5 AM – 10 PM, confirmed by Swastik).


A14 CONTACT FORM -> WHATSAPP (supervisor, 17 Sep; the live form sends nothing):
- On submit: trackFormSubmission runs first, unchanged (GA4 form_submission + dataLayer push). Then name and phone are validated as before. Then the browser goes to https://wa.me/917396669430 with the enquiry prefilled in the same tab.
- Message body, one line per non-empty field; empty fields are omitted entirely:
    Hi Swastik, I'd like to enquire about tuition.
    Name: {name}
    Phone: {phone}
    Grade: {grade}
    Curriculum: {curriculum}
    Message: {message}
  Grade and Curriculum use the visible option text, not the value code.
- The WhatsApp conversion AW-10954184691/jucWCNPv3OAbEPOvruco fires exactly once before the redirect, via event_callback with a 1-second fallback timeout.
- The alert() and the fake 1.5-second "Sending…" delay are removed. Button text stays "Send Message".
- A14 wording: one line under the button — "Opens WhatsApp with your details filled in."
- Implemented in js/contact-whatsapp.js, loaded with defer AFTER script.js. script.js is NOT edited.

A15 REVIEWS BLOCK (supervisor, 17 Sep; the live widget is broken — /api/google-reviews 404s):
- Kept, in the hero: the stars, "4.8", the business-name line and "500+ reviews".
- Removed from the page: the loading container, the error container and the carousel, and with them these four baseline strings — "Loading reviews...", "Unable to load reviews at this time.", "See our Google reviews →", "View all reviews on Google →".
- A15 wording: one button, "Read our reviews on Google", linking to the Google Maps reviews URL already on the page (the href that sat behind "See our Google reviews →").
- loadGoogleReviews() is prevented from running by js/contact-whatsapp.js. script.js is NOT edited.
- id="reviews" is kept. JSON-LD stays byte-identical.

A16 SECTION ORDER (supervisor, 17 Sep). The homepage runs in this order, enforced by an explicit list in the builder which throws if any section is left unplaced:
  hero · Why Choose Ankuram Tuition Centre? · Subjects We Teach · How a week works · Find Your Program · How We Work · What We Offer · Curricula We Support · About ANKURAM · How We Teach at ANKURAM · Reviews · Students From Across Hyderabad (closed details) · Frequently Asked Questions · Diagnostic Test · Get in Touch · Book Diagnostic Test · footer
No wording changes; this is ordering only.

A17 ABOUT PROFILE BLOCK (supervisor, 17 Sep). Presentation additions in the About section:
- A monogram circle reading "SS". No photograph (A9).
- Three credential chips: "MSc Physics", "BE Mechanical Engineering", "Former Amazon software engineer". These are presentation only and repeat wording already in the credential sentence, which stays in full and unchanged.
- The stat pair 13+ / Years Teaching and 3-5 / Students per Batch is shown as large numerals with small labels. Existing wording.

A18 — the decorative 'SS' monogram in the About profile card is removed and replaced with the name 'Swastik Sahal' set in display type. Approved by Swastik, 18 Sep 2026. No avatar, photo or image placeholder anywhere on the page.

A19 — Microsoft Clarity (uir8kpny76) was dropped during the homepage rebuild and is restored byte-identically from the live source. Not a change to live behaviour; a regression fix.
  Root cause: design/build-c-final.js copies the live head field by field (title, description, canonical, og, twitter, JSON-LD) and Clarity had no extraction rule, so it was never carried over. The builder now lifts the whole script element out of the live head verbatim and emits it immediately after the A1 gtag block, the same position it holds on live.
  Guard added in the builder and in scripts/make-staging-build.js: the build fails if G-MQRSS8DKLE, AW-10954184691, uir8kpny76, NGIFCNbv3OAbEPOvruco or jucWCNPv3OAbEPOvruco is missing, or if G-KHP2PBXF6X or the G-MQRSS8DKKE typo appears.

A20 — 25 live h3 strings that the rebuild had demoted are restored as headings. Approved by the supervisor, 18 Sep 2026. Semantics only: no wording, no layout, no pixel changes.
  Why: these are Tier A/B query strings on the page that earns 77% of the site's clicks — "CBSE, ICSE, IGCSE and IB", "Class 10 tuition in Hyderabad", "IB MYP tuition in Hyderabad", "maths tuition near me", "Banjara Hills", "Gachibowli", "KPHB", "Financial District".
  (a) The five How We Teach cycle titles go from <p class="cycle-title"> back to <h3 class="cycle-title">: Diagnose, Explain, Practice Together, Practice Alone, Review + Improve.
  (b) The FAQ and accordion questions keep their <h3> inside the <summary>: <summary><h3 class="faq-question">…</h3></summary>. 23 elements carrying the 20 unique live h3 strings (Gachibowli, KPHB and Financial District each appear twice — the A13 duplicates). <summary>'s content model is "phrasing content, optionally intermixed with heading content", so this is valid.
  CSS hands every heading property back to the parent so nothing moves: .faq-question is display:inline with font:inherit, and .cycle-title regains line-height:inherit and letter-spacing:inherit, which the global .v2 h1-h4 rule would otherwise have overridden.
  Not in scope, unchanged: the <summary> reading "Menu" (never a heading on live) and "Students From Across Hyderabad" (a live h2, already present as an h3 under the A11/A12 structure).
  Verified: all six section screenshots byte-identical before and after (pixel difference 0); computed styles and every box measurement unchanged at 390 and 1440; accordions open and close with JavaScript disabled; Lighthouse accessibility 100 mobile and desktop; axe violations identical before and after; Chrome's accessibility tree exposes the nested h3 as role=heading level=3, so the MDN button-role concern does not apply here.

A21 — the four inline tracking functions the rebuilt page calls but no longer defines are restored in js/contact-whatsapp.js. Regression fix, 18 Sep 2026. No wording, no markup, no head change: index.html and css/site.css are byte-identical to what is already in production; only js/contact-whatsapp.js changes.
  Root cause, the same class as A19: the builder carries raw sections over verbatim, including their inline on* attributes, but does not carry the old page's inline <script>. The old page defined trackFormSubmission, trackPhoneClick, trackWhatsAppClick and trackCTAClick at public_html/index.html:1949-2100. The rebuild kept all 7 call sites and dropped all 4 definitions, so each threw "ReferenceError: <name> is not defined" on the live homepage and the GA4 form_submission event never fired.
  Restored with the same GA4 event names, parameters and dataLayer payloads as the old page. None of them fires an Ads conversion, because the delegated click listener in the page's tracking block already owns NGIFCNbv3OAbEPOvruco and jucWCNPv3OAbEPOvruco; firing them here too would double-count. Verified: exactly one conversion per phone click and per WhatsApp click.
  trackFormSubmission calls handleFormSubmit SYNCHRONOUSLY instead of the old page's 300ms setTimeout, so the WhatsApp handoff stays inside the user gesture. It still returns false, so the form never submits natively.
  The belt-and-braces submit listener now keys off the presence of the onsubmit ATTRIBUTE rather than the existence of trackFormSubmission, which A21 always defines; keying off the function would have disabled that fallback permanently.
  A guard in scripts/make-staging-build.js now fails the build if any inline on* attribute calls a function that nothing shipped defines.

A22 — IB PYP is added to the contact form's curriculum select, and the curriculum list is filtered by the grade chosen. Approved by Swastik, 18 Sep 2026, because the form omitted a programme he teaches: it offered IB MYP and IB DP but not IB PYP, so it accepted "Grades 1-5 + IB MYP", which is impossible, while /ib-pyp-tuition-hyderabad is a live Tier A page.
  The mapping is the SITE'S OWN, not inferred from general knowledge of the boards. Source: the "Curricula We Support" table on /cbse-icse-igcse-ib-tuition-hyderabad — "CBSE Grades: 1-12", "ICSE / ISC Grades: 1-12", "IB PYP Grades: 1-5", "IB MYP Grades: 6-10", "IB DP Grades: 11-12", "IGCSE & A-Levels Grades: 9-12". Corroborated by /ib-tuition-hyderabad ("IB PYP (Primary Years Programme) Class 1-5 (Ages 6-11)", "IB MYP (Middle Years Programme) Class 6-10 (Ages 11-16)", "IB DP ... Class 11-12 (Ages 16-19)"), the PYP page H1 ("Class 1 to 5"), the ISC H1 ("Class 11–12"), the A-Level page ("Class 11-12 at depth") and the MYP page ("Grades 6–10 band").
    Grades 1-5    CBSE, ICSE, IB PYP, State Board
    Grades 6-10   CBSE, ICSE, IB MYP, IGCSE, State Board
    Grades 11-12  CBSE, ISC, IB DP, AS & A Levels, State Board
  No page contradicts this. Two places where the site is thinner than the mapping, recorded rather than hidden: (a) no page states IGCSE's own grade range — the only statement bundles it with A-Levels as 9-12, so placing IGCSE in the 6-10 band covers 9-10 but the band also exposes it at 6-8; (b) the State Board page evidences Class 9-10 only and it is absent from the grade table, so its presence in all three bands rests on the homepage's "We teach Grades 1–12" and the FAQ listing State Board among supported curricula.
  Implementation: all nine curricula stay in the HTML and JS REMOVES the inapplicable ones, so with JavaScript off every curriculum is present and selectable. Blank grade shows all nine. The select is never disabled or emptied. A selected curriculum is kept when still valid and otherwise reset to the placeholder, never silently swapped. Same <select>, id, name and placeholder; every option keeps both a value and visible text, because contact-whatsapp.js reads the text. In js/contact-whatsapp.js only; script.js is not edited; no library.
  NOTE for a future decision, not changed here: the homepage FAQ answer reads "We support CBSE, ICSE, ISC, IGCSE, IB (MYP/DP), AS & A Levels, and State Board" — it says IB (MYP/DP) and omits PYP, so the form now offers a programme that sentence does not list. Changing that wording needs separate approval under invariant 14.

A23 — css/site.css and js/contact-whatsapp.js are referenced with ?v=<first 8 hex of that file's own sha256>, computed in the build. Approved 19 Sep 2026, because two Hostinger edge PoPs (mum-edge5, mum-edge8) kept serving a stale js asset to roughly 30% of visitors through two manual purges.
  The edge keys on the query string — established by evidence, not assumed: while the bare URL returned the pre-A21 file (8194ecd3) from those two nodes, the same path with ?cachebust=<timestamp> returned the deployed bytes (1e48b2de) every time. A different query string is therefore a different cache key, so a content hash guarantees a fresh key the moment either file changes.
  Derived in scripts/make-staging-build.js, never hand-written: a hand-typed version eventually does not get bumped, and every future wave ships CSS. The build fails if the referenced hash does not match the file actually shipped.

A24 — every VISIBLE enumeration of the IB programmes names all three: PYP, MYP and DP. Approved 19 Sep 2026, because he teaches PYP and /ib-pyp-tuition-hyderabad is a Tier A page, yet the homepage named only two.
  Five visible occurrences changed, style matched, no sentence restructured:
    1. hero lede          "IB (MYP/DP)"  -> "IB (PYP/MYP/DP)"
    2. CTA band paragraph "IB (MYP/DP)"  -> "IB (PYP/MYP/DP)"   (same sentence as the hero lede)
    3. "All Curricula Supported" card  "IB MYP/DP" -> "IB PYP/MYP/DP"
    4. board card badge   "IB MYP/DP"    -> "IB PYP/MYP/DP"
    5. visible FAQ answer "IB (MYP/DP)"  -> "IB (PYP/MYP/DP)"
  Plus an IB PYP chip in the "Curricula We Support" list, which had eight of the nine.
  THE JSON-LD IS UNCHANGED, frozen under invariant 3. It still says "IB MYP/DP" in the Organization description and "IB (MYP/DP)" in the FAQPage answer. The visible FAQ answer and the FAQPage JSON-LD therefore differ deliberately from now on — the same accepted state as A13's review count. The builder asserts the JSON-LD blocks are byte-identical before and after the rename and throws if any changed.
  Four baseline strings no longer match their baseline form because the enumeration inside them changed. They are NOT deletions: each is still on the page word for word apart from the added PYP. scripts/parity.js lists all four as approved removals AND separately asserts that each reappears in its new form, so a rename can never be mistaken for a drop. Baseline strings 423/432; word count 107.7%.

A25 — the curricula list is grouped and folded so the page stops reading as a flat row of equals. Approved 19 Sep 2026. Presentation only; every one of the nine names stays on the page and stays indexable. Nothing is removed and no board is demoted.
  1. HERO CHIP BAND: NOT REMOVED — STOPPED, see below.
  2. The nine chips are split into two labelled sets:
       International   IB PYP, IB MYP, IB DP, IGCSE, AS & A Levels
       Indian          CBSE, ICSE, ISC, State Board
     "International" and "Indian" are the only new words besides the summary. The builder throws if any chip lands in neither set or if a named chip is missing.
  3. The sets sit inside a <details> closed by default, the same pattern and CSS shape as the A12 locality fold, summary "All nine curricula: International and Indian". The section intro stays visible above it. It opens and closes with no JavaScript.
  4. The six board cards run International first: IGCSE, IB PYP/MYP/DP, AS & A Levels, CBSE, ICSE/ISC, State Board. All six cards, all their text and all their badges are kept. The board-N class carries the badge colour, so it stays pinned to each card's ORIGINAL index and reordering does not shuffle the colours.
  id="curricula" stays on the section holding this content.

A25.1 — the hero's bullet-joined board band is REMOVED. Approved 19 Sep 2026 after the stop condition was raised and reviewed.
  Removed: <p class="curricula-line">CBSE • IB MYP • IGCSE • ICSE • IB DP • AS & A Levels • State Board</p>, a verbatim repeat of the prose sentence directly above it and the first of three flat rows of the same list. Both .curricula-line CSS rules are deleted; no dead selector remains.
  The bullet-joined line is the ONLY baseline string this drops, 423 -> 422 of 432, and it is the only string parity.js lists as newly removed. No board name is lost: parity.js now asserts every one of the nine is still on the page and prints its count. After removal: CBSE 18, ICSE 16, ISC 10, IGCSE 17, IB PYP 5, IB MYP 8, IB DP 5, AS & A Levels 9, State Board 12. Each of the seven names the band carried fell by exactly one; ISC and IB PYP were not in it and are unchanged. Word count 3464, 107.4%.
  The builder throws unless the last hero paragraph is exactly that band, so it can never silently drop a different paragraph.
  Spacing: the hero loses 79px at 390 and 64px at 1440, and the CTA row moves up by exactly that. The gap between the last paragraph and the CTA row goes 27px -> 16px at 390 and 36px -> 24px at 1440, because the removed band was display:inline-block and its bottom margin did not collapse; the remaining gap is the stylesheet's own --s4 margin on .hero-ctas. There is no hole and no stray divider. Left as the natural spacing rather than padded back with a magic number.
A25.1 superseded — the note below records the state before approval.
A25.1 NOT DONE (superseded 19 Sep) — the hero chip band was still on the page. The stop condition set with the instruction was met: removing <p class="curricula-line">"CBSE • IB MYP • IGCSE • ICSE • IB DP • AS & A Levels • State Board"</p> deletes a baseline string that exists nowhere else on the page as a string. Every individual board NAME in it survives many times over (CBSE 19, ICSE 17, IGCSE 18, IB MYP 11, IB DP 6, AS & A Levels 7, State Board 13), so no board would be lost — but the band as a string would be, taking the count to 422/432. Awaiting a decision.

A25.2 — the hero CTA row gets a bigger break above it, one step up the token scale. Approved 19 Sep 2026. The CTA row is a change of function and must read as a larger break than the gap between paragraphs; after A25.1 the two were near-identical.
  .v2 .hero-ctas margin-top: var(--s5) -> var(--s6) at base; var(--s4) -> var(--s5) at <=600px. Nothing else.
  No literal px introduced: the margin is `var(--s6) 0 var(--s4)` and `var(--s5) 0 var(--s3)`, tokens only. Measured on staging: 390px gap 24px (= --s5) against an 11px paragraph gap; 1440px gap 32px (= --s6) against an 18px paragraph gap. The CTA break is now roughly twice the paragraph gap at both widths.

W2.1 — /diagnostic-assessment rebuilt on the wave 2 template. Approved 20 Sep 2026, STAGING ONLY. Head byte-identical, wording unchanged, no new page content.
  The four shared blocks live in design/wave2/blocks.js and are parameterised, not copied: header+nav (9 of 10 wave 2 pages), hero (5 of 10), FAQ accordion (5 of 10), footer (9 of 10). The only per-page difference in the header and footer is where the nav anchors point, which is the `base` option: same-page on the homepage, back to "/" everywhere else.
  CSS SCOPING, the wave's main risk. css/site.css is shared with the live homepage. The four blocks emit the SAME class contracts the homepage already uses, so they are styled by existing .v2 rules and need no new CSS at all. Wave 2 pages are <body class="v2 w2">; every new rule is prefixed .v2.w2 and the homepage body is <body class="v2"> with no w2, so no new rule can match it. 18 selectors added, all .w2-scoped, appended only — the existing stylesheet is byte-identical up to the appended block. Verified: the staging homepage is PIXEL-IDENTICAL to the live homepage at 390 and 1440, same sha256.
  Visible words 1318 vs 1317 = 100.1%. The difference is the shared header chrome, not page copy: "Skip to content", "ANKURAM", "WhatsApp" and "Menu" come from the approved A6 header, and the phone number appears fewer times because the live page repeated it in both the desktop and mobile nav copies.
  Two defects in my own first pass, found by the checks and fixed: inline <a> inside paragraphs was being flattened, which dropped four internal links (invariant 6) — the extractor now groups text nodes by their owning block element and keeps runs, so hrefs survive; and I had added hero CTA buttons that duplicated the page's own CTA links, which is new content — removed, and CTA-only paragraphs now render with the existing .btn classes instead, same words.
