/* Homepage closing CTA: "Your idea, next." band between the testimonials and
 * the footer.
 *
 * The homepage is a hydrated RSC snapshot, so this can't live in ankora.html's
 * markup (hydration would drop it). Like the footer (#ankora-footer-js), it's
 * inserted after load and put back if React re-renders it away. It goes after
 * #testimonials, the last section in <main>, so no GSAP pin above it moves.
 */
(function () {
  var ID = "ank-next";
  var WA = "https://wa.me/ankoralabs?text=" + encodeURIComponent("Hi Ankora! I saw your work and I'd like to talk about a project.");
  var CAL_CFG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}';

  var css =
    "@font-face{font-family:'Caveat';src:url(/fonts/caveat-0.woff2) format('woff2');font-display:swap}" +
    "#ank-next{position:relative;overflow:hidden;background:#002813;color:#fbf8ef;padding:clamp(90px,14vh,150px) clamp(20px,5vw,72px);font-family:'Basis Grotesque Pro',ui-sans-serif,system-ui,sans-serif}" +
    "#ank-next .nx-in{position:relative;z-index:1;max-width:1300px;margin:0 auto}" +
    "#ank-next .nx-kick{margin:0 0 18px;font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#8fab6f}" +
    "#ank-next h2{margin:0;font-family:'RadionB','Arial Narrow',system-ui,sans-serif;font-weight:700;text-transform:uppercase;font-size:clamp(48px,8vw,128px);line-height:.88;letter-spacing:-.02em;color:#d5e27b}" +
    "#ank-next h2 em{display:block;font-family:'Tobias',Georgia,serif;font-style:italic;font-weight:400;text-transform:none;color:#fbf8ef}" +
    "#ank-next .nx-hand{display:inline-block;margin:22px 0 0;font-family:'Caveat',cursive;font-size:clamp(24px,2.4vw,32px);color:#e7b7af;transform:rotate(-2deg)}" +
    "#ank-next .nx-cards{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:clamp(14px,2vw,24px);margin-top:clamp(40px,6vh,64px)}" +
    "#ank-next .nx-card{display:flex;flex-direction:column;gap:8px;padding:24px 24px 22px;border-radius:20px;text-decoration:none;cursor:pointer;transition:transform .35s cubic-bezier(.2,.9,.3,1.2),box-shadow .35s}" +
    "#ank-next .nx-card:hover{transform:translateY(-6px) rotate(-1deg);box-shadow:0 24px 40px -24px rgba(0,0,0,.6)}" +
    "#ank-next .nx-card:nth-child(2):hover{transform:translateY(-6px) rotate(1deg)}" +
    "#ank-next .nx-card b{font-family:'RadionB','Arial Narrow',system-ui,sans-serif;font-size:clamp(24px,2.2vw,32px);text-transform:uppercase;line-height:1}" +
    "#ank-next .nx-card span{font-size:15px;line-height:1.5;opacity:.8}" +
    "#ank-next .nx-card i{margin-top:auto;padding-top:14px;font-style:normal;font-weight:500}" +
    "#ank-next .nx-cal{background:#d5e27b;color:#002813}" +
    "#ank-next .nx-wa{background:#fbf8ef;color:#002813}" +
    "#ank-next .nx-quote{background:transparent;color:#fbf8ef;border:1.5px solid #fbf8ef55}" +
    "#ank-next .nx-promise{display:flex;flex-wrap:wrap;gap:10px 28px;margin:clamp(36px,5vh,52px) 0 0;padding:0;list-style:none;font-size:15px;color:#c2d6a4}" +
    "#ank-next .nx-promise li::before{content:'\\2713';margin-right:8px;color:#d5e27b;font-weight:700}" +
    "#ank-next .nx-ring{position:absolute;right:-120px;top:-120px;width:420px;height:420px;border:2px dashed #d5e27b33;border-radius:50%;animation:nx-spin 60s linear infinite}" +
    "@keyframes nx-spin{to{transform:rotate(360deg)}}" +
    "@media (max-width:900px){#ank-next .nx-cards{grid-template-columns:1fr}#ank-next .nx-ring{width:260px;height:260px;right:-90px;top:-90px}}" +
    "@media (prefers-reduced-motion:reduce){#ank-next .nx-ring{animation:none}#ank-next .nx-card{transition:none}}";

  var html =
    '<span class="nx-ring" aria-hidden="true"></span>' +
    '<div class="nx-in">' +
    '<p class="nx-kick">Your turn</p>' +
    '<h2 id="ank-next-title">Your idea,<em>next on the list.</em></h2>' +
    '<p class="nx-hand">pick whichever feels easiest ↓</p>' +
    '<div class="nx-cards">' +
    '<a class="nx-card nx-cal" href="https://cal.com/ankoralabs/30min" data-cal-link="ankoralabs/30min" data-cal-namespace="30min" data-cal-config=\'' + CAL_CFG + '\'>' +
    "<b>Book a free call</b><span>30 minutes, online. Bring the idea, we bring the questions.</span><i>Pick a time →</i></a>" +
    '<a class="nx-card nx-wa" href="' + WA + '" target="_blank" rel="noopener">' +
    "<b>WhatsApp us</b><span>The quickest way to reach us, weekdays and weekends.</span><i>Open chat →</i></a>" +
    '<a class="nx-card nx-quote" href="/contact#brief">' +
    "<b>Get a quote</b><span>Tell us what you’re building in three taps. Fixed quote in writing.</span><i>Start here →</i></a>" +
    "</div>" +
    '<ul class="nx-promise"><li>Reply within 24 hours</li><li>Fixed quote, no surprises</li><li>Weekly demos on a live link</li><li>You own all code &amp; designs</li></ul>' +
    "</div>";

  function put() {
    if (document.getElementById(ID)) return;
    var anchor = document.getElementById("testimonials");
    if (!anchor || !anchor.parentNode) return;
    if (!document.getElementById(ID + "-css")) {
      var st = document.createElement("style");
      st.id = ID + "-css";
      st.textContent = css;
      document.head.appendChild(st);
    }
    var sec = document.createElement("section");
    sec.id = ID;
    sec.setAttribute("aria-labelledby", "ank-next-title");
    sec.innerHTML = html;
    anchor.parentNode.insertBefore(sec, anchor.nextSibling);
  }

  document.addEventListener("DOMContentLoaded", put);
  window.addEventListener("load", put);
  [300, 1200, 2500, 4000].forEach(function (d) { setTimeout(put, d); });
  try {
    var m = new MutationObserver(put);
    m.observe(document.documentElement, { childList: true, subtree: true });
    setTimeout(function () { m.disconnect(); }, 9000);
  } catch (e) {}
})();
