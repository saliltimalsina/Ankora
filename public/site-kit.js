/* Ankora site kit, loaded on every page.
 *
 * 1. Cal.com element-click embed: any [data-cal-link] opens the 30-min booking
 *    popup, light theme, Ankora green.
 * 2. Booking-link shim: the homepage snapshot still carries the old Cal link
 *    inside its RSC payload (can't be edited without breaking hydration), so
 *    every [data-cal-link] is pointed at the current one on click, before Cal
 *    reads it. If embed.js never loaded (blocked by an extension), the click
 *    opens the cal.com booking page in a new tab instead of doing nothing.
 * 3. Floating WhatsApp pill on phones, shown after the first screen (not on
 *    /contact, which has WhatsApp everywhere already).
 */
(function () {
  var CAL_LINK = "ankoralabs/30min";
  var CAL_CONFIG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}';
  var WA = "https://wa.me/ankoralabs?text=" + encodeURIComponent("Hi Ankora! I'd like to talk about a project.");

  /* ---- 1. Cal.com loader (vendor snippet) ---- */
  (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", "30min", { origin: "https://app.cal.com" });
  // Note when embed.js actually arrives; blockers (ad/tracker extensions) often stop it.
  var calReady = false;
  var tag = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
  if (tag) tag.addEventListener("load", function () { calReady = true; });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;
  Cal.ns["30min"]("ui", {
    theme: "light",
    cssVarsPerTheme: { light: { "cal-brand": "#004822" }, dark: { "cal-brand": "#D5E27B" } },
    hideEventTypeDetails: false,
    layout: "month_view",
  });

  /* ---- 2. booking-link shim (capture phase, runs before Cal's handler) ---- */
  document.addEventListener(
    "click",
    function (e) {
      var el = e.target && e.target.closest && e.target.closest("[data-cal-link]");
      if (!el) return;
      el.setAttribute("data-cal-link", CAL_LINK);
      el.setAttribute("data-cal-namespace", "30min");
      el.setAttribute("data-cal-config", CAL_CONFIG);
      if (!calReady) {
        // popup can't open: send them to the booking page instead
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open("https://cal.com/" + CAL_LINK, "_blank", "noopener");
        return;
      }
      if (el.hasAttribute("href")) e.preventDefault();
    },
    true,
  );

  /* ---- 3. WhatsApp pill (phones only) ---- */
  function pill() {
    // /contact already offers WhatsApp in its card, channels and brief builder
    if (document.getElementById("ank-wa") || location.pathname === "/contact") return;
    var css = document.createElement("style");
    css.textContent =
      "#ank-wa{position:fixed;right:16px;bottom:18px;z-index:120;display:none;align-items:center;gap:8px;padding:12px 18px 12px 14px;border-radius:99px;" +
      "background:#004822;color:#d5e27b;font:500 15px/1 'Basis Grotesque Pro',ui-sans-serif,system-ui,sans-serif;text-decoration:none;" +
      "box-shadow:0 12px 28px -10px rgba(0,40,19,.6);transform:translateY(140%);transition:transform .45s cubic-bezier(.2,.9,.3,1.2)}" +
      "#ank-wa svg{width:20px;height:20px;flex:none}" +
      "#ank-wa.on{transform:none}" +
      "@media (max-width:900px){#ank-wa{display:inline-flex}}" +
      "@media (prefers-reduced-motion:reduce){#ank-wa{transition:none}}";
    document.head.appendChild(css);
    var a = document.createElement("a");
    a.id = "ank-wa";
    a.href = WA;
    a.target = "_blank";
    a.rel = "noopener";
    a.setAttribute("aria-label", "Chat with Ankora Labs on WhatsApp");
    a.innerHTML =
      '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>' +
      "<span>WhatsApp us</span>";
    document.body.appendChild(a);
    var onScroll = function () {
      a.classList.toggle("on", window.scrollY > window.innerHeight * 0.6);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", pill);
  else pill();
})();
