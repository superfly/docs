// Sign In / Sign Up in the top right on desktop.
// The maple theme hides the desktop header and renders navbar links at the bottom of the
// sidebar (see styles.css, which hides the sidebar copies). Mobile keeps the theme's own header.
// Classes are the theme's own, copied from its header markup, so light/dark mode follow it.
(function () {
  var ID = "fly-auth-nav";

  function build() {
    var nav = document.createElement("nav");
    nav.id = ID;
    nav.setAttribute("aria-label", "Account");
    nav.className = "hidden lg:flex items-center gap-x-5 text-sm";
    nav.innerHTML =
      '<a href="https://fly.io/app/sign-in/" class="whitespace-nowrap font-medium text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">Sign In</a>' +
      '<a href="https://fly.io/app/sign-up/?s=docs" class="group relative inline-flex items-center px-3 py-1.5 whitespace-nowrap font-medium">' +
      '<span class="absolute inset-0 bg-primary-dark rounded-xl group-hover:opacity-[0.9]"></span>' +
      '<span class="z-10 text-white">Sign Up</span>' +
      "</a>";
    return nav;
  }

  function ensure() {
    if (document.body && !document.getElementById(ID)) document.body.appendChild(build());
  }

  ensure();
  // Client-side navigation can re-render <body>; put the nav back if it goes missing.
  new MutationObserver(ensure).observe(document.documentElement, { childList: true, subtree: true });
})();
