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
    // WhatsApp chat bubble, mirrors .bubble in components/services/cta.module.css
    "#ank-next .nx-bubble{position:relative;display:inline-flex;align-items:center;gap:9px;padding:15px 24px;border:1.5px solid rgba(213,226,123,.55);border-radius:26px 26px 26px 6px;color:#fbf8ef;font-size:16px;font-weight:500;text-decoration:none;transition:background .3s,color .3s,border-color .3s,transform .4s cubic-bezier(.2,.9,.3,1.3)}" +
    "#ank-next .nx-bubble svg{width:19px;height:19px;flex:none;color:#d5e27b;transition:color .3s}" +
    "#ank-next .nx-bubble:hover{background:#d5e27b;border-color:#d5e27b;color:#002813;transform:rotate(-2deg) translateY(-2px)}" +
    "#ank-next .nx-bubble:hover svg{color:#002813}" +
    "#ank-next .nx-typing{display:inline-flex;gap:3px;width:0;overflow:hidden;transition:width .3s}" +
    "#ank-next .nx-typing i{width:4px;height:4px;border-radius:50%;background:currentColor;animation:nx-typing 1.1s infinite ease-in-out}" +
    "#ank-next .nx-typing i:nth-child(2){animation-delay:.15s}#ank-next .nx-typing i:nth-child(3){animation-delay:.3s}" +
    "#ank-next .nx-bubble:hover .nx-typing{width:18px}" +
    "@keyframes nx-typing{0%,60%,100%{transform:translateY(0);opacity:.4}30%{transform:translateY(-3px);opacity:1}}" +
    "@media (prefers-reduced-motion:reduce){#ank-next .nx-typing i{animation:none}#ank-next .nx-bubble{transition:none}}" +
    "@media (prefers-reduced-motion:no-preference){#ank-next .nx-f{opacity:0;transform:translateY(24px);transition:opacity .8s ease,transform .8s cubic-bezier(.2,.8,.2,1)}#ank-next.in .nx-f{opacity:1;transform:none}#ank-next.in .nx-f:nth-child(3){transition-delay:.1s}#ank-next.in .nx-f:nth-child(4){transition-delay:.2s}#ank-next.in .nx-f:nth-child(5){transition-delay:.3s}}";

  var html =
    '<img class="nx-tear" src="/images/texture/paper-tear.webp" alt="" aria-hidden="true">' +
    '<p class="nx-kick nx-f">Got something in mind?</p>' +
    '<h2 id="ank-next-title" class="nx-f">Let’s build</h2>' +
    '<p class="nx-sub nx-f">Tell us what you’re making. We’ll come back with a plan, not a sales deck.</p>' +
    '<div class="nx-act nx-f">' +
    '<a class="nx-primary" href="https://cal.com/ankoralabs/30min" data-cal-link="ankoralabs/30min" data-cal-namespace="30min" data-cal-config=\'' + CAL_CFG + "'>Book a Call</a>" +
    '<a class="nx-bubble" href="' + WA + '" target="_blank" rel="noopener">' +
    '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z"/></svg>' +
    'WhatsApp us<span class="nx-typing" aria-hidden="true"><i></i><i></i><i></i></span></a>' +
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
