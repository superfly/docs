// PostHog and Google (GA4/GTM) for docs.fly.io, behind the same consent gate as fly.io.
// A port of landing's posthog-consent.js; keep the two in step.
//
// One self-contained file on purpose: Mintlify runs every .js in the content directory
// in no guaranteed order, so this loads its own PostHog bundle (the vendored
// no-external-code build that landing serves from fly.io) instead of relying on another file.
//
// docs.fly.io has no server, so it asks ui-ex's /api/consent-scope on fly.io (cross-origin,
// session cookie included; ui-ex allows exactly https://docs.fly.io) for:
//   * eu_scope      — did the visitor arrive via an EEA/UK edge (consent needed)?
//   * authenticated — is the visitor logged in?
// All tracking is skipped for logged-in visitors. If that check fails (preview hosts,
// local `mint dev`, network errors), nothing loads.
//
// Plausible is separate (docs.json `integrations.plausible`) and sets nothing on the device.
(function () {
  if (window.__flyAnalytics) return;
  window.__flyAnalytics = true;

  var POSTHOG_KEY = "phc_nuaUijb3iLWut9Kbr56bSHSP4MYdeb8CFd9BgPm3LAVY";
  var POSTHOG_HOST = "https://posthog.fly.io";
  var POSTHOG_SRC = "https://fly.io/static/javascripts/posthog.js";
  var CONSENT_SCOPE_URL = "https://fly.io/api/consent-scope";
  var GA_ID = "G-EX6DMZ1DZV";
  var GTM_ID = "GTM-M35Q2HRQ";
  var ANALYTICS_BASE = "https://analytics.fly.io";
  var CONSENT_KEY = "ph_consent"; // localStorage: "granted" | "denied" | null
  var PREFS_HASH = "#cookie-preferences";

  var started = false;

  function storedConsent() {
    try {
      return window.localStorage.getItem(CONSENT_KEY);
    } catch (e) {
      return null;
    }
  }

  function persistConsent(value) {
    try {
      window.localStorage.setItem(CONSENT_KEY, value);
    } catch (e) {
      /* storage disabled: consent is session-only */
    }
  }

  fetch(CONSENT_SCOPE_URL, { credentials: "include", headers: { Accept: "application/json" } })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .catch(function () {
      return null;
    })
    .then(function (data) {
      if (!data) return;
      // Identity kill-switch: never run any analytics for a logged-in visitor.
      if (data.authenticated) return;
      start(Boolean(data.eu_scope));
    });

  function start(euScope) {
    started = true;
    var consent = storedConsent();
    loadPosthog(euScope, consent);
    initGoogle(euScope, consent);
    if (euScope && consent === null) openBanner();
  }

  // The "Cookie preferences" footer link (docs.json) reopens the banner. Delegated because
  // Mintlify re-renders the footer on client-side navigation.
  document.addEventListener("click", function (e) {
    var link = e.target.closest && e.target.closest('a[href$="' + PREFS_HASH + '"]');
    if (!link) return;
    e.preventDefault();
    if (started) openBanner();
  });

  // Hosts we treat as "us" for referrer attribution: fly.io and any *.fly.io subdomain.
  function isInternalHost(host, currentHost) {
    return host === currentHost || host === "fly.io" || host.endsWith(".fly.io");
  }

  // Rewrite internal referrers to PostHog's "$direct" so moving between fly.io and the
  // docs doesn't overwrite the real traffic source. Mirrors landing and ui-ex.
  function scrubInternalReferrer(props, currentHost) {
    if (!props) return;
    var pairs = [
      ["$referring_domain", "$referrer"],
      ["$initial_referring_domain", "$initial_referrer"],
    ];
    for (var i = 0; i < pairs.length; i++) {
      var domain = props[pairs[i][0]];
      if (typeof domain === "string" && domain !== "$direct" && isInternalHost(domain, currentHost)) {
        props[pairs[i][0]] = "$direct";
        props[pairs[i][1]] = "$direct";
      }
    }
  }

  function beforeSend(event) {
    if (!event || !event.properties) return event;
    var currentHost = window.location.hostname;
    scrubInternalReferrer(event.properties, currentHost);
    scrubInternalReferrer(event.properties.$set_once, currentHost);
    return event;
  }

  function loadPosthog(euScope, consent) {
    loadScript(POSTHOG_SRC, function () {
      if (typeof window.posthog === "undefined") return;
      var startOptedOut = euScope && consent !== "granted";
      window.posthog.init(POSTHOG_KEY, {
        api_host: POSTHOG_HOST,
        ui_host: "https://eu.posthog.com",
        disable_external_dependency_loading: true,
        before_send: beforeSend,
        autocapture: false,
        capture_dead_clicks: false,
        rageclick: false,
        enable_heatmaps: false,
        disable_session_recording: true,
        disable_surveys: true,
        capture_exceptions: false,
        person_profiles: "identified_only",
        // Mintlify navigates client-side, so count route changes as pageviews.
        capture_pageview: "history_change",
        capture_pageleave: true,
        persistence: startOptedOut ? "memory" : "localStorage+cookie",
        opt_out_capturing_by_default: startOptedOut,
        advanced_disable_decide: true,
      });
    });
  }

  // GA4 (gtag) + GTM through the first-party analytics.fly.io proxy, as on fly.io.
  function initGoogle(euScope, consent) {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };

    // Consent Mode v2 default: granted outside EEA/UK or once accepted, denied otherwise.
    window.gtag("consent", "default", consentPayload(!euScope || consent === "granted" ? "granted" : "denied"));
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { transport_url: ANALYTICS_BASE, first_party_collection: true });

    loadScript(ANALYTICS_BASE + "/gtag/js?id=" + GA_ID);
    loadScript(ANALYTICS_BASE + "/gtm.js?id=" + GTM_ID);
  }

  function updateGoogleConsent(state) {
    if (typeof window.gtag !== "function") return;
    window.gtag("consent", "update", consentPayload(state));
  }

  function consentPayload(state) {
    return {
      ad_storage: state,
      analytics_storage: state,
      ad_user_data: state,
      ad_personalization: state,
    };
  }

  function loadScript(src, onload) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }

  function grant() {
    persistConsent("granted");
    if (typeof window.posthog !== "undefined" && window.posthog.opt_in_capturing) {
      window.posthog.opt_in_capturing({ captureEventName: false });
      window.posthog.capture("$pageview");
    }
    updateGoogleConsent("granted");
    closeBanner();
  }

  function deny() {
    persistConsent("denied");
    if (typeof window.posthog !== "undefined" && window.posthog.opt_out_capturing) {
      window.posthog.opt_out_capturing();
    }
    updateGoogleConsent("denied");
    closeBanner();
  }

  // Copy owned by Legal; keep in sync with landing's _posthog_banner.html.erb and ui-ex.
  // Styles live in styles.css (#ph-consent-banner).
  function buildBanner() {
    var el = document.createElement("div");
    el.id = "ph-consent-banner";
    el.hidden = true;
    el.setAttribute("role", "dialog");
    el.setAttribute("aria-live", "polite");
    el.setAttribute("aria-label", "Cookie notice");
    el.innerHTML =
      "<p><strong>Hi, it's us, Fly.io.</strong> We hate these things as much as anyone, but the " +
      "marketing gods demand conversion metrics.</p>" +
      "<p>We set analytics cookies to measure traffic and ad conversion on our marketing and docs " +
      "pages. These cookies only cover logged-out visits, never what you do in the dashboard.</p>" +
      '<p>Read all about it in our <a href="https://fly.io/legal/privacy-policy/">Privacy Policy</a>.</p>' +
      '<div class="ph-consent-actions">' +
      '<button id="ph-consent-reject" type="button">Reject</button>' +
      '<button id="ph-consent-accept" type="button">Accept</button>' +
      "</div>";
    el.querySelector("#ph-consent-accept").addEventListener("click", grant);
    el.querySelector("#ph-consent-reject").addEventListener("click", deny);
    return el;
  }

  function banner() {
    var el = document.getElementById("ph-consent-banner");
    if (!el && document.body) {
      el = buildBanner();
      document.body.appendChild(el);
    }
    return el;
  }

  var bannerOpen = false;

  function openBanner() {
    bannerOpen = true;
    var el = banner();
    if (el) el.hidden = false;
  }

  function closeBanner() {
    bannerOpen = false;
    var el = document.getElementById("ph-consent-banner");
    if (el) el.hidden = true;
  }

  // Client-side navigation can re-render <body> (see auth-nav.js); put an open banner back.
  var observer = new MutationObserver(function () {
    if (bannerOpen) openBanner();
    if (document.body) observer.observe(document.body, { childList: true });
  });
  observer.observe(document.documentElement, { childList: true });
  if (document.body) observer.observe(document.body, { childList: true });
})();
