/* =============================================================================
   contact-whatsapp.js  —  A14 + A15.  Loaded with defer, AFTER script.js.
   script.js itself is never edited; everything here overrides it from outside.

   A14  The contact form currently sends nothing: script.js's handleFormSubmit
        validates, waits 1.5s, shows an alert() and resets. This replaces that
        with a WhatsApp handoff, keeping trackFormSubmission untouched.

   A15  /api/google-reviews does not exist on this host, so loadGoogleReviews()
        always 404s and logs errors. The loader, error and carousel containers
        are gone from the page, so the fetch is suppressed here.

   HOW script.js IS NEUTRALISED (two bindings, both handled):

     1. script.js does  contactForm.addEventListener('submit', window.handleFormSubmit)
        We capture that exact function reference BEFORE replacing it and call
        removeEventListener with it. Same reference, so the listener detaches.

     2. index.html has  onsubmit="return trackFormSubmission('contact', this)"
        and trackFormSubmission calls handleFormSubmit() by name 300ms later.
        That name resolves on the global object, so reassigning
        window.handleFormSubmit makes the tracking path call OUR handler.

     3. script.js calls loadGoogleReviews() from its window 'load' listener.
        A top-level function declaration is a property of the global object, so
        reassigning window.loadGoogleReviews before 'load' fires replaces it.
        Defer guarantees we run before 'load'.
   ========================================================================= */
(function () {
  'use strict';

  var WA_NUMBER = '917396669430';
  var WA_CONVERSION = 'AW-10954184691/jucWCNPv3OAbEPOvruco';

  // ---------------------------------------------------------------- A15
  // Replace the reviews loader before window 'load' runs it.
  if (typeof window.loadGoogleReviews === 'function') {
    window.loadGoogleReviews = function noReviewsFetch() {
      /* A15: the endpoint does not exist on this host and the containers have
         been removed. A static link to Google replaces the widget. */
    };
  }

  // ---------------------------------------------------------------- A14
  var form = document.getElementById('contactForm');
  if (!form) return;

  // Detach script.js's own submit listener using its original reference.
  var original = window.handleFormSubmit;
  if (typeof original === 'function') {
    form.removeEventListener('submit', original);
  }

  function value(id) {
    var el = document.getElementById(id);
    if (!el) return '';
    // For a <select>, prefer the visible option text over the value code.
    if (el.tagName === 'SELECT') {
      var opt = el.options[el.selectedIndex];
      return opt && opt.value ? opt.textContent.trim() : '';
    }
    return (el.value || '').trim();
  }

  function buildMessage() {
    var lines = ["Hi Swastik, I'd like to enquire about tuition."];
    var fields = [
      ['Name', value('name')],
      ['Phone', value('phone')],
      ['Grade', value('grade')],
      ['Curriculum', value('curriculum')],
      ['Message', value('message')],
    ];
    for (var i = 0; i < fields.length; i++) {
      if (fields[i][1]) lines.push(fields[i][0] + ': ' + fields[i][1]);  // empty fields are omitted
    }
    return lines.join('\n');
  }

  function whatsappUrl() {
    return 'https://wa.me/' + WA_NUMBER + '?text=' + encodeURIComponent(buildMessage());
  }

  /** Fire the WhatsApp conversion once, then redirect once. */
  function convertThenGo(url) {
    var done = false;
    function go() {
      if (done) return;
      done = true;
      window.location.href = url;
    }
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'conversion', { send_to: WA_CONVERSION, event_callback: go });
      window.setTimeout(go, 1000);   // fallback if the callback never arrives
    } else {
      go();
    }
  }

  // Replaces script.js's handler. trackFormSubmission() calls this by name, so
  // GA4 form_submission and the dataLayer push still happen first, unchanged.
  window.handleFormSubmit = function handleFormSubmitWhatsApp(e) {
    if (e && typeof e.preventDefault === 'function') e.preventDefault();

    var name = value('name');
    var phone = value('phone');
    if (!name || !phone) {
      // Same validation as before, without the alert(): the fields say it.
      var missing = !name ? document.getElementById('name') : document.getElementById('phone');
      if (missing) { missing.setAttribute('aria-invalid', 'true'); missing.focus(); }
      return false;
    }
    document.getElementById('name').removeAttribute('aria-invalid');
    document.getElementById('phone').removeAttribute('aria-invalid');

    convertThenGo(whatsappUrl());
    return false;
  };

  // If the inline onsubmit attribute is ever removed, this keeps the form working.
  form.addEventListener('submit', function (e) {
    if (typeof window.trackFormSubmission === 'function') return;  // tracking path owns it
    window.handleFormSubmit(e);
  });

  // Exposed for the Playwright test; harmless in production.
  window.__contactWhatsAppUrl = whatsappUrl;
})();
