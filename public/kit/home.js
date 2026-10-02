/* Homepage-only placement for two shared components. The homepage is a
 * hydrated RSC snapshot, so markup added to ankora.html would be dropped on
 * hydration; these are put in place after load and put back if React
 * re-renders them away.
 *
 * 1. Work showcase: mounts public/kit/showcase.js (AnkoraShowcase) above the
 *    "You bring the vision" section, as the snapshot's own script used to.
 * 2. "Let's build" ending: clones <template id="ank-lb-tpl"> (markup from
 *    components/kit/lets-build.html, filled by app/route.ts) after
 *    #testimonials, the last section in <main>, so no GSAP pin above it moves.
 */
(function () {
  /* ---- 1. showcase ---- */
  function findAnchor() {
    var brown = document.querySelector('section[class*="25201f"]');
    if (brown) return brown;
    var els = document.querySelectorAll("h1,h2,h3,p,div,span");
    for (var i = 0; i < els.length; i++) {
      var t = els[i].textContent;
      if (t && t.indexOf("Payables that stay on track") >= 0 && els[i].children.length <= 4) {
        var w = els[i];
        while (w.parentElement && w.parentElement.children.length < 2) w = w.parentElement;
        for (var k = 0; k < 8 && w.parentElement; k++) {
          if (w.nextElementSibling) return w.nextElementSibling;
          w = w.parentElement;
        }
      }
    }
    return null;
  }
  // The stage lands inside a dark (#002813) section; without a masking graphic
  // its bg shows as a dark seam above the cream stage on scroll. Repaint ONLY
  // this stage's own dark ancestors to the cream ground so the join is clean.
  function deDark(node) {
    var a = node, hops = 0;
    while (a && a !== document.body && hops < 8) {
      var bg = getComputedStyle(a).backgroundColor;
      var cls = typeof a.className === "string" ? a.className : "";
      if (bg === "rgb(0, 40, 19)" || cls.indexOf("002813") >= 0 || cls.indexOf("25201f") >= 0) {
        a.style.background = "#F4F1E7";
        a.setAttribute("data-shw-dedark", "1");
      }
      a = a.parentElement;
      hops++;
    }
  }
  var stage = null;
  function showcase() {
    var anchor = findAnchor();
    if (!anchor || !window.AnkoraShowcase) return;
    if (!stage || !stage.isConnected) {
      stage = document.getElementById("show-stage") || document.createElement("div");
      stage.id = "show-stage";
    }
    if (stage.nextElementSibling !== anchor || stage.parentNode !== anchor.parentNode) anchor.parentNode.insertBefore(stage, anchor);
    deDark(stage);
    if (stage.getAttribute("data-built") !== "1") window.AnkoraShowcase.mount(stage);
  }

  /* ---- 2. "Let's build" ending ---- */
  function letsBuild() {
    if (document.querySelector("[data-lets-build]")) return;
    var tpl = document.getElementById("ank-lb-tpl");
    var anchor = document.getElementById("testimonials");
    if (!tpl || !anchor || !anchor.parentNode) return;
    var frag = tpl.content.cloneNode(true);
    var sec = frag.querySelector("[data-lets-build]");
    sec.classList.add("lb-fade");
    anchor.parentNode.insertBefore(frag, anchor.nextSibling);
    try {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { sec.classList.add("in"); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(sec);
    } catch (e) { sec.classList.add("in"); }
  }

  function both() { showcase(); letsBuild(); }
  function init() {
    both();
    var obs = new MutationObserver(both);
    obs.observe(document.body, { childList: true, subtree: true });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", function () { setTimeout(init, 60); });
  else setTimeout(init, 60);
  window.addEventListener("load", both);
})();
