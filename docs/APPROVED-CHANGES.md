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
- FAQ: remove exact duplicate question-AND-answer pairs from the VISIBLE list only, keeping the first of each.
  Verified on the baseline: only ONE pair is an exact duplicate — "Do you have a branch in Financial District?" with an identical answer. It is removed (second occurrence).
  The Gachibowli and KPHB questions also appear twice, but their ANSWERS DIFFER, so they are not exact duplicates and both occurrences are kept. See the P4 report for the differing text; Swastik decides whether to merge them.
- The FAQPage JSON-LD contains all three duplicate questions. Per instruction it is NOT edited; the duplicates are listed in the report instead.
- Opening hours unchanged (Mon–Fri 5 AM – 10 PM, confirmed by Swastik).
