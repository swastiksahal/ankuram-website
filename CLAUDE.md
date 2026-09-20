# ankuramtuition.com — rules for every session

## What this is
Live site of Ankuram Tuition Centre (Jubilee Hills, Hyderabad). Static HTML migrated
from WordPress, on Hostinger shared hosting. It is linked from the Google Business
Profile (518+ reviews) and is the landing domain for Google Ads CID 786-647-2391.
Goal: a complete visual redesign with ZERO loss of rankings, tracking or conversions.
A supervisor (Claude, in the project chat) reviews every phase before anything goes live.

## Server
- SSH: ssh -p 65002 -o ServerAliveInterval=15 -o ServerAliveCountMax=3 u879191658@145.79.212.4
- Web root: ~/domains/ankuramtuition.com/public_html
- Server has bash, no python, no ImageMagick (gm exists). Process substitution <(...) fails silently.
- Always `cd <dir> && <cmd>`. One command at a time.
- Never write to the server without Swastik's explicit OK in this session.
- Never use `rsync --delete` against production.
- Before any production write, take a timestamped tar backup on the server.
- After every deploy, Swastik clears the Hostinger cache (hPanel → Clear cache).
- Verify on the server with grep, not over HTTP (the CDN caches).

## Wave roadmap
Do not infer the next step from conversation memory. Read this roadmap.

  Wave 1  DONE  the homepage, through A25.2, live and verified
  Wave 2  ~11   core pages: /about/, /contact/, /how-we-teach,
                /diagnostic-assessment, /curriculums, /hybrid-tuition-hyderabad,
                /home-tuition-hyderabad, /home-tutor-hyderabad/,
                /privacy-policy/, /terms/, /thank-you
  Wave 3  24    /areas/*
  Wave 4  ~28   board pages: IB PYP/MYP/DP, IGCSE, ICSE, ISC, A-Level, CBSE,
                State Board
  Wave 5  ~28   class/grade pages, Class 8-12 maths / science / physics
  Wave 6  ~16   locality pages: Jubilee Hills, Saroornagar, "near me",
                "best tuition centre in ..."
  Wave 7  ~12   articles and topics: /blog/*, /topics/*, electrochemistry,
                basic-vs-standard, study materials
  Wave 8  4     PAID PAGES, LAST, one at a time, explicit approval each:
                8.1 /online-science-tuition-class-10-cbse/
                8.2 /online-maths-tuition-class-10-cbse/
                8.3 /online-tuition-class-10-cbse/
                8.4 /cbse-class-10/

Never start a later wave before the earlier ones are done. Inside each wave,
the highest-traffic page goes first for review but is built AFTER the template
is proven on a low-traffic page in the same wave.

## URL and SEO invariants — breaking any of these is a failed build
1. No URL changes. Every existing URL returns 200 with the same path, including
   extension-less URLs served from .html files by .htaccess.
2. .htaccess, robots.txt and sitemap.xml are unchanged unless Swastik approves a
   specific, separate change.
3. Per page, byte-identical unless listed in docs/APPROVED-CHANGES.md: <title>, meta description,
   canonical, meta robots, JSON-LD, hreflang, og:/twitter: tags.
4. H1 text identical. Every H2/H3 text retained (reordering or wrapping allowed).
5. Visible body word count >= 95% of the baseline for that page. No content deleted
   without a listed, approved reason.
6. Every internal link in the baseline still exists on that page (same href).
7. Every image keeps its alt text. New decorative SVGs use aria-hidden="true".
8. /cbse-class-10-online-tuition stays noindex,follow and stays out of the sitemap.
   Never Disallow it in robots.txt.
9. NAP identical everywhere: Ankuram Tuition Centre · Plot 229, Road No 72,
   Prashasan Nagar, Jubilee Hills, Hyderabad, Telangana 500096 · +91 73966 69430.
10. Tracking and NAP follow docs/APPROVED-CHANGES.md A1 and A2 exactly. Never copy IDs
    from old pages and never retype them from memory; use the values in that file.
11. Page weight and mobile Lighthouse (performance, SEO, accessibility) are >= baseline.
    CLS < 0.1. No new JavaScript libraries. No client-side framework.
12. Output is plain static files at the same paths. Any build tool runs locally only.
13. PAID PAGES — /online-tuition-class-10-cbse/, /online-maths-tuition-class-10-cbse/,
    /online-science-tuition-class-10-cbse/, /cbse-class-10/ are live Google Ads landing
    pages. They are rebuilt LAST, one at a time, with explicit approval each. Their URLs
    never redirect. /cbse-class-10/ must keep id=subjects, id=pricing, id=faq,
    id=diagnostic and id=reviews (Ads sitelinks point to them).
14. Never change a page's wording. Layout, structure and styling may change; words may
    not, except under APPROVED-CHANGES.
15. ANCHOR IDS — the homepage must keep the ids home, about, curricula, contact, reviews
    and hybrid-classes, each on the section holding the matching content. Google shows
    #about and #curricula as sitelinks. The parity checker verifies all six.

## Copy rules
"Maths" not "Math" · "Google Meet" never Zoom · "13+ years" never 14 · no exclamation
marks · no guarantees or result promises · no "free" anything (the diagnostic is paid,
standalone, not credited) · no pricing in title/meta/H1 · no competitor names · no
invented testimonials, statistics or student counts · banned words: unlock, empower,
holistic, world-class, passionate about education, best in Hyderabad · small batch
= 3–5, never another number · never add offers, sections or content Swastik did not
ask for · no internal codes visible to parents.

## CTA
One main CTA block at the bottom of each page. A small WhatsApp + call link in the
header bar is approved. No sticky bars, pop-ups, or hero/mid-page CTA banners.

## Design
No stock photography. Diagram-driven and editorial: inline SVG diagrams, strong type
scale, display numerals, warm paper palette, <details>/<summary> for progressive
reveal. Never two consecutive sections with the same layout. Any text block over ~60
words is broken up, restructured, or given a visual. System fonts or one self-hosted
subset font only.

## Working style
- Work in phases. At each STOP, write the report in the format asked, commit, push to
  origin ankuramtuition-com, and wait.
- Never mark a check passed without running it. Quote real command output.
- Swastik is teaching while this runs: keep reports short and exact, full lists where asked.
