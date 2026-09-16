/* ============================================================
   Ankuram · Class 8 Tuition LP
   Vanilla JS — no framework. Handles:
     1. Conversion tracking (gtag) on every Call/WhatsApp tap
     2. Tabs (curriculum subject × board)
     3. FAQ accordion is native <details>, no JS needed
     4. Footer year stamp
   No dependencies. ~2KB minified.
   ============================================================ */
(function () {
  'use strict';

  /* -------------------------------------------------------
     1. Conversion tracking
        Fire GA4 event + Google Ads conversion on every CTA.
     ------------------------------------------------------- */
  function trackCta(e) {
    var el = e.currentTarget;
    var cta = el.getAttribute('data-cta');
    var loc = el.getAttribute('data-location') || 'unknown';
    if (typeof window.gtag !== 'function') return;

    window.gtag('event', cta + '_click', {
      cta_type: cta,
      cta_location: loc,
      page_path: window.location.pathname
    });

    if (cta === 'whatsapp') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-10954184691/jucWCNPv3OAbEPOvruco',
        value: 100,
        currency: 'INR'
      });
    } else if (cta === 'call') {
      window.gtag('event', 'conversion', {
        send_to: 'AW-10954184691/NGIFCNbv3OAbEPOvruco',
        value: 200,
        currency: 'INR'
      });
    }
  }
  document.querySelectorAll('[data-cta]').forEach(function (el) {
    el.addEventListener('click', trackCta, { passive: true });
  });

  /* -------------------------------------------------------
     2. Tabs (curriculum: subject × board)
        Nested tabs supported via data-tabs scope.
     ------------------------------------------------------- */
  document.querySelectorAll('.tabs').forEach(function (tabsRoot) {
    var list = tabsRoot.querySelector(':scope > .tabs-list');
    if (!list) return;
    var tabs = list.querySelectorAll(':scope > .tab');
    var panels = Array.from(tabsRoot.children).filter(function (n) {
      return n.classList && n.classList.contains('tab-panel');
    });

    tabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        var target = tab.getAttribute('data-tab');
        tabs.forEach(function (t) { t.setAttribute('aria-selected', t === tab ? 'true' : 'false'); });
        panels.forEach(function (p) {
          if (p.getAttribute('data-panel') === target) {
            p.hidden = false;
          } else {
            p.hidden = true;
          }
        });
      });
    });
  });

  /* -------------------------------------------------------
     3. Footer year stamp
     ------------------------------------------------------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* -------------------------------------------------------
     4. Smooth scroll for in-page anchor links
     ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(function (a) {
    a.addEventListener('click', function (e) {
      var hash = a.getAttribute('href');
      if (hash.length < 2) return;
      var target = document.querySelector(hash);
      if (!target) return;
      e.preventDefault();
      var headerOffset = 70;
      var top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });
})();
