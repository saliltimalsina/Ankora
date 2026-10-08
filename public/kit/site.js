/* Ankora site behaviour, loaded on every page (React pages via app/layout.tsx,
 * the homepage snapshot via app/route.ts). Settings come from lib/site.ts as
 * window.ANKORA.
 *
 * 1. Cal.com element-click embed: any [data-cal-link] opens the booking popup,
 *    light theme, Ankora green.
 * 2. Booking-link shim: the homepage snapshot still carries an old Cal link
 *    inside its RSC payload (can't be edited without breaking hydration), so
 *    every [data-cal-link] is pointed at the current one on click, before Cal
 *    reads it. If embed.js never loaded (blocked by an extension), the click
 *    opens the cal.com booking page in a new tab instead of doing nothing.
 * 3. Nav (components/kit/nav.html): mobile menu and the current-page link.
 * 4. Footer (components/kit/footer.html): plants grow in, then sway.
 * 5. Floating WhatsApp pill on phones, shown after the first screen (not on
 *    /contact, which has WhatsApp everywhere already).
 */
(function () {
  var A = window.ANKORA || {};
  var CAL_LINK = A.calLink || "ankoralabs/30min";
  var CAL_URL = A.calUrl || "https://cal.com/" + CAL_LINK;
  var CAL_NS = A.calNs || "30min";
  var CAL_CONFIG = A.calConfig || '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}';
  var WA = (A.wa || "https://wa.me/ankoralabs") + "?text=" + encodeURIComponent(A.waHello || "Hi Ankora! I'd like to talk about a project.");

  /* ---- 1. Cal.com loader (vendor snippet) ---- */
  (function (C, A, L) { var p = function (a, ar) { a.q.push(ar); }; var d = C.document; C.Cal = C.Cal || function () { var cal = C.Cal; var ar = arguments; if (!cal.loaded) { cal.ns = {}; cal.q = cal.q || []; d.head.appendChild(d.createElement("script")).src = A; cal.loaded = true; } if (ar[0] === L) { var api = function () { p(api, arguments); }; var namespace = ar[1]; api.q = api.q || []; if (typeof namespace === "string") { cal.ns[namespace] = cal.ns[namespace] || api; p(cal.ns[namespace], ar); p(cal, ["initNamespace", namespace]); } else p(cal, ar); return; } p(cal, ar); }; })(window, "https://app.cal.com/embed/embed.js", "init");
  Cal("init", CAL_NS, { origin: "https://app.cal.com" });
  // Note when embed.js actually arrives; blockers (ad/tracker extensions) often stop it.
  var calReady = false;
  var tag = document.querySelector('script[src="https://app.cal.com/embed/embed.js"]');
  if (tag) tag.addEventListener("load", function () { calReady = true; });
  Cal.config = Cal.config || {};
  Cal.config.forwardQueryParams = true;
  Cal.ns[CAL_NS]("ui", {
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
      el.setAttribute("data-cal-namespace", CAL_NS);
      el.setAttribute("data-cal-config", CAL_CONFIG);
      if (!calReady) {
        // popup can't open: send them to the booking page instead
        e.preventDefault();
        e.stopImmediatePropagation();
        window.open(CAL_URL, "_blank", "noopener");
        return;
      }
      if (el.hasAttribute("href")) e.preventDefault();
    },
    true,
  );

  /* ---- 3. nav: mobile menu + current page ---- */
  function nav() {
    var root = document.querySelector("[data-ank-nav]");
    if (!root || root.getAttribute("data-ready")) return;
    root.setAttribute("data-ready", "1");
    var path = location.pathname.replace(/\/$/, "") || "/";
    root.querySelectorAll(".ank-nav-link").forEach(function (a) {
      if (a.getAttribute("href") === path) a.setAttribute("aria-current", "page");
    });
    var btn = root.querySelector("[data-nav-toggle]");
    var panel = root.querySelector(".ank-mnav-panel");
    var bar = root.querySelector(".ank-nav-bar");
    if (!btn || !panel) return;
    function place() { if (bar) panel.style.top = Math.round(bar.getBoundingClientRect().bottom) + "px"; }
    function set(open) {
      panel.classList.toggle("is-open", open);
      btn.classList.toggle("is-x", open);
      btn.setAttribute("aria-expanded", open ? "true" : "false");
      document.body.style.overflow = open ? "hidden" : "";
      if (open) place();
    }
    btn.addEventListener("click", function (e) { e.preventDefault(); set(!panel.classList.contains("is-open")); });
    panel.addEventListener("click", function (e) {
      var a = e.target.closest("a");
      if (a && !a.hasAttribute("data-cal-link")) set(false);
    });
    document.addEventListener("keydown", function (e) { if (e.key === "Escape") set(false); });
    window.addEventListener("resize", function () { if (panel.classList.contains("is-open")) place(); });
  }

  /* ---- 4. footer plants ---- */
  function plants() {
    var el = document.querySelector("#main-footer .afoot-plants");
    if (!el || el.dataset.anim) return;
    // the drawing isn't in the page's HTML (see components/kit/footer.html): fetch it, then animate
    if (!el.querySelector("svg")) {
      if (el.dataset.load) return;
      el.dataset.load = "1";
      fetch("/kit/footer-plants.svg")
        .then(function (r) { return r.ok ? r.text() : ""; })
        .then(function (svg) {
          if (svg.indexOf("<svg") !== 0) return;
          el.innerHTML = svg;
          plants();
        })
        .catch(function () {});
      return;
    }
    el.dataset.anim = "1";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { el.classList.add("is-in"); return; }
    var longest = 0;
    el.querySelectorAll(".aplant").forEach(function (p) {
      longest = Math.max(longest, parseFloat(getComputedStyle(p).getPropertyValue("--gd")) || 0);
    });
    el.classList.add("will-grow");
    var go = function () {
      el.classList.add("is-in");
      setTimeout(function () { el.classList.add("is-sway"); }, (longest + 0.85) * 1000 + 1500);
    };
    try {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { io.disconnect(); go(); }
      }, { threshold: 0.25 });
      io.observe(el);
    } catch (e) { go(); }
  }

  /* ---- 5. WhatsApp pill (phones only) ---- */
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
  function ready() { nav(); plants(); pill(); }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready);
  else ready();
  // the homepage injects its footer after hydration; pick it up when it lands
  window.addEventListener("load", plants);
})();
