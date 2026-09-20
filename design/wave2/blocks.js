/**
 * blocks.js — the four shared wave 2 blocks, built once and consumed by every
 * wave 2 page builder. Nothing here is specific to any one page.
 *
 * SCOPING, THE BIGGEST RISK IN WAVE 2
 * css/site.css is shared with the live homepage. These four blocks therefore
 * emit the SAME class contracts the homepage already uses — .site-header,
 * .hero/.hero-inner/.hero-text/.hero-ctas, .accordion/details/summary/
 * h3.faq-question, .footer/.footer-content/.footer-section — so they are styled
 * by the EXISTING .v2 rules and need no new CSS at all. Wave 2 pages carry
 * class="v2 w2": .v2 gives them the design system, .w2 scopes every new rule.
 * The homepage body is class="v2" with no w2, so no .w2 rule can reach it.
 *
 * The only difference between the homepage's header and a wave 2 header is
 * where the nav anchors point: on the homepage they are same-page (#about), on
 * every other page they must return to the homepage (/#about). That is the
 * `base` option, and it is the reason these are parameterised blocks rather
 * than copied markup.
 */

const esc = (s) => String(s)
  .replace(/&(?!#?\w+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const PHONE_DISPLAY = '+91 73966 69430';
const PHONE_TEL = 'tel:+917396669430';
const WHATSAPP = 'https://wa.me/917396669430';

const ICON_WA = '<svg viewBox="0 0 24 24" class="hcta-ic" width="20" height="20" aria-hidden="true" focusable="false"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2z"/><path d="M8.6 7.6c.3 0 .6 0 .8.5l.9 2c.1.3 0 .5-.1.7l-.5.6c-.2.2-.2.4-.1.6a7 7 0 0 0 3.4 3c.3.1.5 0 .6-.1l.6-.7c.2-.2.4-.2.6-.1l2 1c.3.1.4.4.4.6a2 2 0 0 1-2 1.9c-1 0-3.4-.8-5.4-2.9S6.7 11 6.7 9.8a2 2 0 0 1 1.9-2.2z"/></svg>';
const ICON_TEL = '<svg viewBox="0 0 24 24" class="hcta-ic" width="20" height="20" aria-hidden="true" focusable="false"><path d="M6.6 3h3l1.5 4-2 1.4a12 12 0 0 0 5.5 5.5L16 12l4 1.5v3a1.6 1.6 0 0 1-1.8 1.6A15.6 15.6 0 0 1 5 5.8 1.6 1.6 0 0 1 6.6 3z"/></svg>';

// The nav, exactly as the homepage has it. `base` is '' on the homepage and '/'
// on every other page, so the same list serves both.
const NAV = [
  { text: 'Home', anchor: '#home' },
  { text: 'How We Teach', href: '/how-we-teach' },
  { text: 'Online Classes', href: '/online-maths-tuition' },
  { text: 'Curricula', anchor: '#curricula' },
  { text: 'About', anchor: '#about' },
  { text: 'Contact', anchor: '#contact' },
];

const navHref = (n, base) => (n.href ? n.href : `${base}${n.anchor}`);

/** BLOCK 1 — header + nav. Used by 9 of the 10 wave 2 pages (all but /thank-you). */
function header({ base = '/' } = {}) {
  const links = NAV.map((n) => `<a href="${esc(navHref(n, base))}">${esc(n.text)}</a>`).join('');
  return `<header class="site-header">
  <div class="wrap header-inner">
    <a class="brand" href="/">ANKURAM</a>
    <div class="header-cta">
      <a class="hcta hcta-wa" href="${WHATSAPP}" aria-label="WhatsApp">${ICON_WA}<span class="hcta-text">WhatsApp</span></a>
      <a class="hcta hcta-tel" href="${PHONE_TEL}" aria-label="Call ${esc(PHONE_DISPLAY)}">${ICON_TEL}<span class="hcta-text">${esc(PHONE_DISPLAY)}</span></a>
      <details class="nav-mobile">
        <summary>Menu</summary>
        <nav class="nav-mobile-list" aria-label="Main">${links}</nav>
      </details>
    </div>
    <nav class="nav nav-desktop" aria-label="Main">${links}</nav>
  </div>
</header>`;
}

/**
 * BLOCK 2 — hero. Used by 5 of the 10 (how-we-teach, diagnostic-assessment,
 * hybrid-tuition-hyderabad, home-tuition-hyderabad, home-tutor-hyderabad).
 * Takes the page's own H1 and lede; adds no wording of its own.
 * No id="home": that anchor belongs to the homepage and must not be duplicated.
 */
function hero({ h1, paras = [], ctas = [], html = null }) {
  if (!h1) throw new Error('wave2 hero: no H1');
  // `html` lets the page pass its OWN already-rendered intro, so the hero never
  // invents copy. `paras` remains for pages that only have plain text.
  const body = html !== null ? html
    : paras.map((p, i) => `<p class="${i === 0 ? 'lede' : ''}">${esc(p)}</p>`).join('');
  const cta = ctas.length
    ? `<div class="hero-ctas">${ctas.map((c) => `<a class="btn ${esc(c.cls || 'btn-primary')}" href="${esc(c.href)}">${esc(c.text)}</a>`).join('')}</div>`
    : '';
  return `<section class="hero">
  <div class="wrap hero-inner">
    <div class="hero-text">
      <h1>${esc(h1)}</h1>
      ${body}
      ${cta}
    </div>
  </div>
</section>`;
}

/**
 * BLOCK 3 — FAQ accordion. Used by 5 of the 10 (the same five as the hero).
 * A20: the question keeps its <h3> INSIDE the <summary>. A bare <summary> is a
 * heading lost, which is exactly what A20 had to undo on the homepage.
 */
function faq(items) {
  if (!items.length) throw new Error('wave2 faq: no items');
  // answers arrive as run arrays so inline links survive (invariant 6)
  const runs = (r) => (Array.isArray(r) ? r : [{ text: r }])
    .map((x) => (x.href ? `<a href="${esc(x.href)}">${esc(x.text)}</a>` : esc(x.text))).join(' ');
  const one = (it) => `<details><summary><h3 class="faq-question">${esc(it.q)}</h3></summary><div class="acc-body">${it.a.map((p) => `<p>${runs(p)}</p>`).join('')}</div></details>`;
  return `<div class="accordion">${items.map(one).join('')}</div>`;
}

/**
 * BLOCK 4 — footer. Used by 9 of the 10 (all but /thank-you).
 * Same three columns and the same three H3s the live pages carry, so those
 * headings are retained. The A12 "Areas we serve" row is homepage-only and is
 * deliberately not here. The phone link keeps its inline onclick, so any page
 * using this block must also ship js/contact-whatsapp.js, which defines
 * trackPhoneClick — the A21 lesson, applied forwards.
 */
function footer({ base = '/', quickLinks = null } = {}) {
  const links = (quickLinks || [
    { text: 'Home', anchor: '#home' },
    { text: 'Curricula', anchor: '#curricula' },
    { text: 'About', anchor: '#about' },
    { text: 'Contact', anchor: '#contact' },
  ]).map((n) => `<a href="${esc(n.href ? n.href : `${base}${n.anchor}`)}">${esc(n.text)}</a>`).join('\n          ');
  return `<footer class="footer">
  <div class="container">
    <div class="footer-content">
      <div class="footer-section">
        <h3>Ankuram Tuition Centre | Math Tuition | Science Tuition</h3>
        <p>Expert tuition for Grades 1-12 in Jubilee Hills, Hyderabad.</p>
      </div>
      <div class="footer-section">
        <h3>Quick Links</h3>
        <nav class="footer-nav">
          ${links}
        </nav>
      </div>
      <div class="footer-section">
        <h3>Contact</h3>
        <p><a href="${PHONE_TEL}" data-track="phone_call" data-track-location="footer" onclick="trackPhoneClick('footer'); return true;">${esc(PHONE_DISPLAY)}</a></p>
        <p>Plot 229, Rd Number 72<br>Prashasan Nagar, Jubilee Hills<br>Hyderabad, Telangana 500096</p>
      </div>
    </div>
    <div class="footer-bottom">
      <p>&copy; 2026 Ankuram Tuition Centre. All rights reserved.</p>
    </div>
  </div>
</footer>`;
}

const skipLink = () => '<a class="skip" href="#main">Skip to content</a>';

module.exports = { header, hero, faq, footer, skipLink, esc, PHONE_DISPLAY, PHONE_TEL, WHATSAPP, NAV };
