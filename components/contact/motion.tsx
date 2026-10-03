"use client";

import { gsap, useGSAP, MQ, SplitText } from "../../lib/gsap";

// /contact motion. Hero: the headline rises line by line out of a mask, the
// clipboard drops onto the desk and settles, the pen rolls in, the rest fades
// up. Below: section heads, the form sheet and the two talk cards rise in,
// the closing steps stagger.
// Reduced motion keeps the static, server-rendered layout.

export default function ContactMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      const h1 = document.querySelector<HTMLElement>("[data-ct-split]");
      const tl = gsap.timeline({ defaults: { ease: "power3.out" }, delay: 0.1 });
      if (h1) {
        SplitText.create(h1, {
          type: "lines",
          mask: "lines",
          autoSplit: true,
          onSplit: (self) => {
            gsap.set(h1, { visibility: "visible" });
            return gsap.from(self.lines, { yPercent: 105, duration: 1, stagger: 0.09, ease: "power4.out", delay: 0.15 });
          },
        });
      }
      tl.from("[data-ct-drop]", { y: -90, rotation: 9, autoAlpha: 0, duration: 1.1, ease: "back.out(1.15)" }, 0.25)
        .from("[data-ct-pen]", { x: 70, y: -40, rotation: 40, autoAlpha: 0, duration: 0.9 }, 0.75)
        .from(".ct-hero [data-ct-fade]", { y: 22, autoAlpha: 0, duration: 0.7, stagger: 0.08 }, 0.55);

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
      // transforms are cleared after: a leftover one on the sheet would trap the
      // fixed bottom-sheet menus on phones
      gsap.from(".dk-sheet", {
        y: 70,
        autoAlpha: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".dk-sheet", start: "top 88%" },
        clearProps: "transform",
      });
      gsap.from(".ct-card", {
        y: 60,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-talk-grid", start: "top 85%" },
      });
      // the tickets drop onto the desk in turn, then the arrows draw between them
      gsap.from("[data-ct-arrow]", {
        drawSVG: 0,
        duration: 0.5,
        stagger: 0.25,
        ease: "power2.inOut",
        delay: 0.6,
        scrollTrigger: { trigger: ".ct-route", start: "top 78%" },
      });
      gsap.from(".ct-ticket", {
        y: 50,
        rotation: (i) => [-8, 7, -6][i] ?? 0,
        autoAlpha: 0,
        duration: 0.9,
        stagger: 0.18,
        ease: "back.out(1.4)",
        clearProps: "transform",
        scrollTrigger: { trigger: ".ct-route", start: "top 78%" },
      });
      gsap.from(".ct-fixed", {
        scale: 2.2,
        autoAlpha: 0,
        duration: 0.45,
        ease: "power4.in",
        scrollTrigger: { trigger: ".ct-route", start: "top 50%" },
      });
      gsap.from(".ct-where > *", {
        y: 26,
        autoAlpha: 0,
        duration: 0.7,
        stagger: 0.1,
        ease: "power3.out",
        scrollTrigger: { trigger: ".ct-where", start: "top 90%" },
      });
    });
  });
  return null;
}
