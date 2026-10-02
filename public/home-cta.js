/* Homepage closing CTA: the same "Let's build" ending as /services
 * (components/services/cta.tsx), so both pages close the same way.
 *
 * The homepage is a hydrated RSC snapshot, so this can't live in ankora.html's
 * markup (hydration would drop it). Like the footer (#ankora-footer-js), it's
 * inserted after load and put back if React re-renders it away. It goes after
 * #testimonials, the last section in <main>, so no GSAP pin above it moves.
 */
(function () {
  var ID = "ank-next";
  var WA = "https://wa.me/ankoralabs?text=" + encodeURIComponent("Hi Ankora! I'd like to talk about a project.");
  var CAL_CFG = '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}';

  // mirrors components/services/cta.module.css
  var css =
    "#ank-next{position:relative;display:flex;flex-direction:column;align-items:center;padding:clamp(120px,18vh,200px) clamp(20px,5vw,72px) clamp(110px,16vh,180px);background:#002813;color:#fbf8ef;text-align:center;font-family:'Basis Grotesque Pro',ui-sans-serif,system-ui,sans-serif}" +
    "#ank-next .nx-tear{position:absolute;top:-3.3vw;left:0;width:100%;height:8vw;object-fit:cover;z-index:2;pointer-events:none}" +
    "#ank-next .nx-kick{margin:0;font-size:12px;font-weight:500;letter-spacing:.16em;text-transform:uppercase;color:#d5e27b}" +
    "#ank-next h2{margin:18px 0 0;font-family:'RadionB','Arial Narrow',system-ui,sans-serif;font-size:clamp(64px,15vw,260px);font-weight:700;line-height:.86;letter-spacing:-.035em;text-transform:uppercase;white-space:nowrap;color:#d5e27b}" +
    "#ank-next .nx-sub{max-width:44ch;margin:28px 0 0;font-size:clamp(16px,1.3vw,20px);line-height:1.5;color:rgba(251,248,239,.78)}" +
    "#ank-next .nx-act{display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:12px 28px;margin-top:40px}" +
    "#ank-next .nx-primary{display:inline-block;padding:18px 34px;border-radius:99px;background:#e7b7af;color:#002813;font-size:17px;font-weight:600;text-decoration:none;cursor:pointer;transition:background .3s}" +
    "#ank-next .nx-primary:hover{background:#f0c7c0}" +
    "#ank-next .nx-secondary{font-weight:500;color:#fbf8ef;text-decoration:none}" +
    "#ank-next .nx-secondary span{display:inline-block;transition:transform .3s}" +
    "#ank-next .nx-secondary:hover span{transform:translateX(4px)}" +
    "@media (prefers-reduced-motion:no-preference){#ank-next .nx-f{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)}#ank-next.in .nx-f{opacity:1;transform:none}#ank-next.in .nx-f:nth-child(3){transition-delay:.1s}#ank-next.in .nx-f:nth-child(4){transition-delay:.2s}#ank-next.in .nx-f:nth-child(5){transition-delay:.3s}}";

  var html =
    '<img class="nx-tear" src="/images/texture/paper-tear.webp" alt="" aria-hidden="true">' +
    '<p class="nx-kick nx-f">Got something in mind?</p>' +
    '<h2 id="ank-next-title" class="nx-f">Let’s build</h2>' +
    '<p class="nx-sub nx-f">Tell us what you’re making. We’ll come back with a plan, not a sales deck.</p>' +
    '<div class="nx-act nx-f">' +
    '<a class="nx-primary" href="https://cal.com/ankoralabs/30min" data-cal-link="ankoralabs/30min" data-cal-namespace="30min" data-cal-config=\'' + CAL_CFG + "'>Book a Call</a>" +
    '<a class="nx-secondary" href="' + WA + '" target="_blank" rel="noopener">WhatsApp us <span aria-hidden="true">→</span></a>' +
    '<a class="nx-secondary" href="/services">Our services <span aria-hidden="true">→</span></a>' +
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
    try {
      var io = new IntersectionObserver(function (es) {
        if (es[0].isIntersecting) { sec.classList.add("in"); io.disconnect(); }
      }, { threshold: 0.3 });
      io.observe(sec);
    } catch (e) { sec.classList.add("in"); }
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
