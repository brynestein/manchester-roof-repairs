// Consent first, tags second. Consent defaults are set before any Google tag loads, and
// nothing that sets cookies runs until the visitor accepts. This is a file rather than an
// inline script so the site's security header can keep script-src strict.
(function () {
  var w = window, d = document;
  var cfg = (d.currentScript && d.currentScript.dataset) || {};
  var KEY = 'site-consent-v1';

  w.dataLayer = w.dataLayer || [];
  function gtag() { w.dataLayer.push(arguments); }
  w.gtag = w.gtag || gtag;

  function stored() { try { return localStorage.getItem(KEY); } catch (e) { return null; } }
  function store(v) { try { localStorage.setItem(KEY, v); } catch (e) { /* private mode: choice lasts this page only */ } }

  var choice = stored(); // 'granted' | 'denied' | null

  // Ad signals stay denied: no ads run yet. The ads follow-on project revisits this.
  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: choice === 'granted' ? 'granted' : 'denied',
    wait_for_update: 500
  });

  function loadScript(src) {
    var s = d.createElement('script');
    s.async = true;
    s.src = src;
    d.head.appendChild(s);
  }

  var googleLoaded = false, clarityLoaded = false;
  function loadGoogle() {
    if (googleLoaded) return;
    googleLoaded = true;
    if (cfg.gtm) {
      w.dataLayer.push({ 'gtm.start': Date.now(), event: 'gtm.js' });
      loadScript('https://www.googletagmanager.com/gtm.js?id=' + encodeURIComponent(cfg.gtm));
    } else if (cfg.ga4) {
      loadScript('https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.ga4));
      gtag('js', new Date());
      gtag('config', cfg.ga4);
    }
  }
  // Clarity records sessions, so it only ever loads after a yes.
  function loadClarity() {
    if (clarityLoaded || !cfg.clarity) return;
    clarityLoaded = true;
    w.clarity = w.clarity || function () { (w.clarity.q = w.clarity.q || []).push(arguments); };
    loadScript('https://www.clarity.ms/tag/' + encodeURIComponent(cfg.clarity));
  }

  // 'advanced': Google tags load now and honour the denied defaults (no analytics cookies
  // until a yes). 'basic': nothing from Google loads until a yes.
  if (cfg.mode !== 'basic' || choice === 'granted') loadGoogle();
  if (choice === 'granted') loadClarity();

  var banner;
  function hide() { if (banner) banner.hidden = true; }
  function decide(v) {
    choice = v;
    store(v);
    gtag('consent', 'update', { analytics_storage: v });
    if (v === 'granted') { loadGoogle(); loadClarity(); }
    hide();
  }
  function button(label, value) {
    var b = d.createElement('button');
    b.type = 'button';
    b.className = 'cookie-banner__btn';
    b.textContent = label;
    b.addEventListener('click', function () { decide(value); });
    return b;
  }
  function show() {
    if (!banner) {
      banner = d.createElement('div');
      banner.className = 'cookie-banner';
      banner.setAttribute('role', 'region');
      banner.setAttribute('aria-label', 'Cookie choices');
      var text = d.createElement('p');
      text.textContent = 'We use analytics cookies to see how people use this site so we can improve it. They are only set if you accept.';
      var actions = d.createElement('div');
      actions.className = 'cookie-banner__actions';
      // Equal weight on both choices: rejecting must be as easy as accepting.
      actions.appendChild(button('Reject', 'denied'));
      actions.appendChild(button('Accept analytics', 'granted'));
      banner.appendChild(text);
      banner.appendChild(actions);
      d.body.appendChild(banner);
    }
    banner.hidden = false;
  }

  function init() {
    if (!choice) show();
    d.addEventListener('click', function (e) {
      var t = e.target && e.target.closest && e.target.closest('[data-cookie-settings]');
      if (t) { e.preventDefault(); show(); }
    });
  }
  if (d.readyState === 'loading') d.addEventListener('DOMContentLoaded', init); else init();
})();
