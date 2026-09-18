/* =============================================================================
   contact-whatsapp.js  —  A14 + A15 + A21.  Loaded with defer, AFTER script.js.
   script.js itself is never edited; everything here overrides it from outside.

   A14  The contact form on the old page sent nothing: script.js's
        handleFormSubmit validates, waits 1.5s, shows an alert() and resets.
        This replaces that with a WhatsApp handoff.

   A15  /api/google-reviews does not exist on this host, so loadGoogleReviews()
        always 404s and logs errors. The loader, error and carousel containers
        are gone from the page, so the fetch is suppressed here.

   A21  The rebuilt page carries the old page's inline on* attributes but NOT
        the old page's inline <script>, which is where the four tracking
        functions those attributes call were defined. They are redefined below.

   HOW script.js IS NEUTRALISED:

     1. script.js does  contactForm.addEventListener('submit', window.handleFormSubmit)
        We capture that exact function reference BEFORE replacing it and call
        removeEventListener with it. Same reference, so the listener detaches.

     2. script.js calls loadGoogleReviews() from its window 'load' listener.
        A top-level function declaration is a property of the global object, so
        reassigning window.loadGoogleReviews before 'load' fires replaces it.
        Defer guarantees we run before 'load'.

   THE FORM SUBMIT PATH, as it actually is (verified, not assumed):

     The form carries  onsubmit="return trackFormSubmission('contact', this)".
     On the OLD page that function was defined in an inline <script> at
     index.html:2009; it fired the GA4 form_submission event, pushed to
     dataLayer, called handleFormSubmit() 300ms later and returned false.
     The rebuild dropped that inline script, so on the rebuilt page the
     attribute threw "ReferenceError: trackFormSubmission is not defined" on
     every submit and the GA4 form_submission event never fired. The submit
     still reached WhatsApp only because of the belt-and-braces listener at the
     foot of this file.

     A21 restores the function here. It fires the same GA4 event and the same
     dataLayer push as the old page, then calls handleFormSubmit SYNCHRONOUSLY
     rather than after the old 300ms timer, so the handoff stays inside the
     user gesture, and returns false so the form never submits natively.
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

  // ---------------------------------------------------------------- A21
  // The four functions the page's inline on* attributes call. Each is defined
  // ONLY if something else has not already defined it, so if the inline script
  // ever comes back this file yields to it.
  //
  // None of these fires an Ads conversion. The conversions are owned by the
  // delegated click listener in the page's tracking block, which fires
  // NGIFCNbv3OAbEPOvruco for tel: and jucWCNPv3OAbEPOvruco for wa.me. Firing
  // them here as well would double-count every phone and WhatsApp click.
  // Checked against the old page: its versions pushed GA4 + dataLayer only.

  function push(obj) {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(obj);
  }
  function ga(name, params) {
    if (typeof window.gtag === 'function') window.gtag('event', name, params);
  }

  if (typeof window.trackFormSubmission !== 'function') {
    window.trackFormSubmission = function trackFormSubmission(formName, formElement) {
      var data = formElement ? new FormData(formElement) : null;
      var get = function (k) { return (data && data.get(k)) || 'not_specified'; };
      var grade = get('grade');
      var curriculum = get('curriculum');
      var subject = get('subject');
      var value = formName === 'diagnostic_test' ? 750 : 200;

      ga('form_submission', {
        event_category: 'conversion',
        event_label: formName,
        form_name: formName,
        grade: grade,
        curriculum: curriculum,
        subject: subject,
        value: value,
      });
      push({
        event: 'form_submission',
        eventCategory: 'Conversion',
        eventAction: 'Form Submission',
        eventLabel: formName,
        formName: formName,
        grade: grade,
        curriculum: curriculum,
        subject: subject,
        conversionType: 'primary',
        conversionValue: value,
      });

      // Synchronously, so the WhatsApp handoff stays inside the user gesture.
      if (typeof window.handleFormSubmit === 'function') {
        window.handleFormSubmit({ preventDefault: function () {} });
      }
      return false;   // never submit natively
    };
  }

  if (typeof window.trackPhoneClick !== 'function') {
    window.trackPhoneClick = function trackPhoneClick(location) {
      ga('phone_call_click', { event_category: 'contact', event_label: location, value: 1 });
      push({ event: 'phone_call', eventCategory: 'Contact', eventAction: 'Phone Call Click', eventLabel: location, conversionType: 'primary' });
    };
  }

  if (typeof window.trackWhatsAppClick !== 'function') {
    window.trackWhatsAppClick = function trackWhatsAppClick(location) {
      ga('whatsapp_click', { event_category: 'contact', event_label: location, value: 1 });
      push({ event: 'whatsapp_click', eventCategory: 'Contact', eventAction: 'WhatsApp Click', eventLabel: location, conversionType: 'primary' });
    };
  }

  if (typeof window.trackCTAClick !== 'function') {
    window.trackCTAClick = function trackCTAClick(ctaName, location) {
      ga('cta_click', { event_category: 'engagement', event_label: ctaName, cta_location: location });
      push({ event: 'cta_click', eventCategory: 'Engagement', eventAction: 'CTA Click', eventLabel: ctaName, ctaLocation: location });
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

  // Replaces script.js's handler. The A21 trackFormSubmission above calls this
  // by name, so the GA4 form_submission event and the dataLayer push happen
  // first, then the handoff runs.
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

  // If the inline onsubmit attribute is ever removed, this keeps the form
  // working. The guard tests for the ATTRIBUTE, not for trackFormSubmission:
  // A21 always defines that function, so testing the function would disable
  // this fallback permanently and let the form submit natively.
  form.addEventListener('submit', function (e) {
    if (form.getAttribute('onsubmit')) return;   // the inline attribute owns it
    window.handleFormSubmit(e);
  });

  // Exposed for the Playwright test; harmless in production.
  window.__contactWhatsAppUrl = whatsappUrl;
})();
