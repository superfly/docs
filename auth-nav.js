// Log In / Sign Up in the top right on desktop.
// The maple theme hides the desktop header and renders navbar links at the bottom of the
// sidebar (see styles.css, which hides the sidebar copies on desktop). Mobile keeps those.
// Colors reuse the theme's own classes so light/dark mode follow it; layout lives in styles.css.
(function () {
  var ID = "fly-auth-nav";

  function build() {
    var nav = document.createElement("nav");
    nav.id = ID;
    nav.setAttribute("aria-label", "Account");
    nav.className = "text-sm";
    nav.innerHTML =
      '<a href="https://fly.io/app/sign-in/" class="fly-auth-nav-login font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Log In</a>' +
      '<a href="https://fly.io/app/sign-up/?s=docs" class="fly-auth-nav-signup group relative font-medium">' +
      '<span class="absolute inset-0 bg-primary-dark rounded-xl group-hover:opacity-[0.9]"></span>' +
      '<span class="relative text-white">Sign Up</span>' +
      "</a>";
    return nav;
  }

  function ensure() {
    if (document.body && !document.getElementById(ID)) document.body.appendChild(build());
  }

  ensure();
  // Client-side navigation can re-render <body>; put the nav back if it goes missing.
  // Watch only <html> and <body> children, not the whole tree.
  var observer = new MutationObserver(function () {
    ensure();
    if (document.body) observer.observe(document.body, { childList: true });
  });
  observer.observe(document.documentElement, { childList: true });
  if (document.body) observer.observe(document.body, { childList: true });
})();
