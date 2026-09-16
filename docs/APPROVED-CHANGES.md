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
- Any wording, price, batch size, badge or offer text (including /cbse-class-10/ "Batch of 5 students", "Most Popular", "45-minute" diagnostic copy)
- Removing unreachable files (cbse-class-10-maths.html, areas/kukatpally.html, ib-pyp-tuition-hyderabad.html, class-8-maths/sitemap.xml and robots.txt)
