"use client";

import { gsap, useGSAP, MQ, SplitText } from "../../lib/gsap";

// /careers motion. Hero: the headline rises line by line, the lanyard badge
// drops in and settles (then swings with the pointer), the rest fades up.
// Below: section heads and sheets rise in; the desk objects drop in and the
// labels follow; a role's commission slip prints line by line. Reduced motion
// keeps the static, server-rendered layout (slip fully printed).

export default function CareersMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();

    mm.add(MQ.motion, () => {
      const h1 = document.querySelector<HTMLElement>("[data-cr-split]");
      if (h1)
        SplitText.create(h1, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(h1, { visibility: "visible" });
            return gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.09, ease: "power4.out", delay: 0.15 });
          },
        });
      gsap.from(".cr-hero [data-cr-fade]", { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", delay: 0.55 });

      // the badge drops in already tilted and settles once. (Setting the tilt up
      // front matters: tilting it on landing made it visibly snap.)
      const badge = document.querySelector("[data-cr-badge]");
      if (badge) {
        gsap.set(badge, { rotation: 9 });
        gsap
          .timeline({ delay: 0.35 })
          .from(badge, { yPercent: -60, autoAlpha: 0, duration: 0.6, ease: "power2.in" })
          .to(badge, { rotation: 0, duration: 1.8, ease: "elastic.out(1, 0.3)" });
      }

      gsap.utils.toArray<HTMLElement>(".dk-head").forEach((head) =>
        gsap.from(head.children, {
          y: 30,
          autoAlpha: 0,
          duration: 0.8,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: head, start: "top 85%" },
        }),
      );
      // transforms are cleared after: a leftover one on a sheet would trap the
      // fixed bottom-sheet menus on phones
      gsap.utils.toArray<HTMLElement>(".dk-sheet").forEach((sheet) =>
        gsap.from(sheet, {
          y: 70,
          autoAlpha: 0,
          duration: 1,
          ease: "power3.out",
          clearProps: "transform",
          scrollTrigger: { trigger: sheet, start: "top 88%" },
        }),
      );
      gsap.from(".cr-note", {
        y: -30,
        rotation: 12,
        autoAlpha: 0,
        duration: 0.8,
        ease: "back.out(1.6)",
        clearProps: "transform",
        scrollTrigger: { trigger: ".cr-note", start: "top 90%" },
      });

      // the commission slip prints top-down as it comes into view, line by
      // line, then the "Paid" stamp lands
      if (document.querySelector("[data-cr-slip]"))
        gsap
          .timeline({ scrollTrigger: { trigger: "[data-cr-slip]", start: "top 80%" } })
          .fromTo("[data-cr-slip]", { clipPath: "inset(0 0 100% 0)" }, { clipPath: "inset(0 0 0% 0)", duration: 1.6, ease: "steps(14)" })
          .from("[data-cr-line]", { opacity: 0, x: -8, duration: 0.25, stagger: 0.22 }, 0.35)
          .from("[data-cr-stamp]", { scale: 2.4, opacity: 0, duration: 0.35, ease: "power4.in" }, ">0.15");

      // the desk: objects drop onto it, then the labels and their arrows
      gsap.from("[data-cr-obj]", {
        y: -60,
        rotation: (i) => (i % 2 ? 10 : -10),
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.08,
        ease: "back.out(1.3)",
        scrollTrigger: { trigger: ".cr-desk", start: "top 80%" },
      });
      gsap.from("[data-cr-label]", {
        y: 20,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.12,
        ease: "power3.out",
        delay: 0.4,
        scrollTrigger: { trigger: ".cr-desk", start: "top 80%" },
      });
    });

    // after it settles, the badge swings with the pointer: a quick sideways move
    // nudges it the other way, then it eases back to rest (mouse only)
    mm.add(MQ.hover, () => {
      const badge = document.querySelector("[data-cr-badge]");
      if (!badge) return;
      const swing = gsap.quickTo(badge, "rotation", { duration: 1.4, ease: "elastic.out(1, 0.3)" });
      let lastX = 0;
      let rest = 0;
      const ready = performance.now() + 2600;
      const onMove = (e: PointerEvent) => {
        const dx = e.clientX - lastX;
        lastX = e.clientX;
        if (performance.now() < ready || Math.abs(dx) < 2) return;
        swing(gsap.utils.clamp(-8, 8, -dx * 0.35));
        window.clearTimeout(rest);
        rest = window.setTimeout(() => swing(0), 140);
      };
      window.addEventListener("pointermove", onMove);
      return () => {
        window.removeEventListener("pointermove", onMove);
        window.clearTimeout(rest);
      };
    });

  });
  return null;
}
