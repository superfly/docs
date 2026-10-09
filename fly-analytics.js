// PostHog and Google (GA4) for docs.fly.io, for logged-out visitors outside the EEA/UK.
//
// There is no consent banner here. EEA/UK visitors get nothing beyond Plausible (docs.json
// `integrations.plausible`, which sets nothing on the device). The banner lives on fly.io only.
//
// One self-contained file on purpose: Mintlify runs every .js in the content directory
// in no guaranteed order, so this loads its own PostHog bundle (the vendored
// no-external-code build that landing serves from fly.io) instead of relying on another file.
//
// docs.fly.io has no server, so it asks ui-ex's /api/consent-scope on fly.io (cross-origin,
// session cookie included; ui-ex allows exactly https://docs.fly.io) for:
//   * eu_scope      — did the visitor arrive via an EEA/UK edge?
//   * authenticated — is the visitor logged in?
// Anything other than a clear "not EEA/UK, logged out" (including preview hosts, local
// `mint dev` and network errors) loads nothing.
(function () {
  if (window.__flyAnalytics) return;
  window.__flyAnalytics = true;

  var POSTHOG_KEY = "phc_nuaUijb3iLWut9Kbr56bSHSP4MYdeb8CFd9BgPm3LAVY";
  var POSTHOG_HOST = "https://posthog.fly.io";
  var POSTHOG_SRC = "https://fly.io/static/javascripts/posthog.js";
  var CONSENT_SCOPE_URL = "https://fly.io/api/consent-scope";
  var GA_ID = "G-EX6DMZ1DZV";
  var ANALYTICS_BASE = "https://analytics.fly.io";

  fetch(CONSENT_SCOPE_URL, { credentials: "include", headers: { Accept: "application/json" } })
    .then(function (r) {
      return r.ok ? r.json() : null;
    })
    .catch(function () {
      return null;
    })
    .then(function (data) {
      if (!data || data.authenticated || data.eu_scope !== false) return;
      loadPosthog();
      initGoogle();
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

  function loadPosthog() {
    loadScript(POSTHOG_SRC, function () {
      if (typeof window.posthog === "undefined") return;
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
        persistence: "localStorage+cookie",
        advanced_disable_decide: true,
      });
    });
  }

  // GA4 (gtag) through the first-party analytics.fly.io proxy, as on fly.io. No GTM: ui-ex
  // dropped it because it double-reported conversions to GA4.
  function initGoogle() {
    window.dataLayer = window.dataLayer || [];
    window.gtag =
      window.gtag ||
      function () {
        window.dataLayer.push(arguments);
      };
    window.gtag("js", new Date());
    window.gtag("config", GA_ID, { transport_url: ANALYTICS_BASE, first_party_collection: true });
    loadScript(ANALYTICS_BASE + "/gtag/js?id=" + GA_ID);
  }

  function loadScript(src, onload) {
    var s = document.createElement("script");
    s.async = true;
    s.src = src;
    if (onload) s.onload = onload;
    document.head.appendChild(s);
  }
})();
