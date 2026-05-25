/* ============================================
   AISymmetric Cookie Consent + GA4 — ISO 27701
   Self-contained: injects its own banner CSS so
   this single file is drop-in for any site in
   the AISymmetric portfolio (no styles.css dep).
   Blocks GA until explicit user consent.
   ============================================ */
(function () {
  var CONSENT_KEY = 'ais_cookie_consent';
  var GA_ID = 'G-CVF4MDVKJS';
  var PRIVACY_URL = 'https://aisymmetricsolutions.com/terms#privacy-policy';

  // ---------- CSS injection (self-contained, single source of truth) ----------
  function injectStyles() {
    if (document.getElementById('cc-styles')) return;
    var css =
      '#cookie-consent-banner{position:fixed;bottom:0;left:0;right:0;z-index:10000;background:rgba(17,17,17,0.97);' +
      '-webkit-backdrop-filter:blur(20px);backdrop-filter:blur(20px);border-top:1px solid rgba(59,130,246,0.2);' +
      'padding:20px 24px;transform:translateY(100%);opacity:0;transition:transform 0.4s cubic-bezier(0.16,1,0.3,1),opacity 0.4s ease;' +
      'font-family:Inter,-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif}' +
      '#cookie-consent-banner.cc-visible{transform:translateY(0);opacity:1}' +
      '#cookie-consent-banner .cc-inner{max-width:1200px;margin:0 auto;display:flex;align-items:center;' +
      'justify-content:space-between;gap:24px}' +
      '#cookie-consent-banner .cc-text{font-size:13.5px;color:#D1D5DB;line-height:1.6;flex:1;margin:0}' +
      '#cookie-consent-banner .cc-text a{color:#22D3EE;text-decoration:underline}' +
      '#cookie-consent-banner .cc-actions{display:flex;gap:12px;flex-shrink:0}' +
      '#cookie-consent-banner .cc-btn{padding:10px 24px;border-radius:8px;font-size:13px;font-weight:600;' +
      'cursor:pointer;border:none;font-family:inherit;transition:all 0.3s ease;line-height:1}' +
      '#cookie-consent-banner .cc-btn-accept{background:linear-gradient(135deg,#3B82F6,#2563eb);color:#fff}' +
      '#cookie-consent-banner .cc-btn-accept:hover{transform:translateY(-1px);box-shadow:0 4px 20px rgba(59,130,246,0.3)}' +
      '#cookie-consent-banner .cc-btn-decline{background:rgba(255,255,255,0.08);color:#9CA3AF;' +
      'border:1px solid rgba(255,255,255,0.1)}' +
      '#cookie-consent-banner .cc-btn-decline:hover{background:rgba(255,255,255,0.12);color:#fff}' +
      '@media (max-width:768px){#cookie-consent-banner .cc-inner{flex-direction:column;text-align:center}' +
      '#cookie-consent-banner .cc-actions{width:100%}#cookie-consent-banner .cc-btn{flex:1}}';
    var style = document.createElement('style');
    style.id = 'cc-styles';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
  }

  function hasConsent() {
    try { return localStorage.getItem(CONSENT_KEY) === 'accepted'; } catch (e) { return false; }
  }

  function hasDeclined() {
    try { return localStorage.getItem(CONSENT_KEY) === 'declined'; } catch (e) { return false; }
  }

  function loadGA() {
    if (document.getElementById('ga-script')) return;
    var s = document.createElement('script');
    s.id = 'ga-script';
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    function gtag() { dataLayer.push(arguments); }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_ID, { anonymize_ip: true });
  }

  function showBanner() {
    if (document.getElementById('cookie-consent-banner')) return;
    injectStyles();
    var banner = document.createElement('div');
    banner.id = 'cookie-consent-banner';
    banner.setAttribute('role', 'dialog');
    banner.setAttribute('aria-label', 'Cookie consent');
    banner.innerHTML =
      '<div class="cc-inner">' +
        '<p class="cc-text">We use cookies and analytics to improve your experience. By clicking "Accept," you consent to our use of cookies for analytics purposes. See our <a href="' + PRIVACY_URL + '" target="_blank" rel="noopener">Privacy Policy</a> for details.</p>' +
        '<div class="cc-actions">' +
          '<button id="cc-decline" class="cc-btn cc-btn-decline">Decline</button>' +
          '<button id="cc-accept" class="cc-btn cc-btn-accept">Accept</button>' +
        '</div>' +
      '</div>';
    document.body.appendChild(banner);

    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        banner.classList.add('cc-visible');
      });
    });

    document.getElementById('cc-accept').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'accepted'); } catch (e) {}
      loadGA();
      closeBanner();
    });

    document.getElementById('cc-decline').addEventListener('click', function () {
      try { localStorage.setItem(CONSENT_KEY, 'declined'); } catch (e) {}
      closeBanner();
    });
  }

  function closeBanner() {
    var banner = document.getElementById('cookie-consent-banner');
    if (banner) {
      banner.classList.remove('cc-visible');
      setTimeout(function () { banner.remove(); }, 400);
    }
  }

  // On load: either load GA (if consented) or show banner
  if (hasConsent()) {
    loadGA();
  } else if (!hasDeclined()) {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', showBanner);
    } else {
      showBanner();
    }
  }
})();
