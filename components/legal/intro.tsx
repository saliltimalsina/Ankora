"use client";

import { gsap, useGSAP, MQ } from "../../lib/gsap";

// Motion for the legal pages: the hero copy rises in, the summary card drops
// onto the page, the stamp thumps down, and each margin note is "written" as
// its section scrolls in. Reduced motion keeps the static layout.

export default function Intro() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.from("[data-lg-in] > *", { y: 28, opacity: 0, duration: 0.8, stagger: 0.09, ease: "power3.out", delay: 0.15 });
      gsap.from("[data-lg-card]", { y: -40, rotate: 6, opacity: 0, duration: 0.9, ease: "back.out(1.6)", delay: 0.35 });
      gsap.from("[data-lg-stamp]", { scale: 1.8, opacity: 0, duration: 0.45, ease: "power4.in", delay: 1 });
      gsap.utils.toArray<HTMLElement>(".lg-note").forEach((el) => {
        gsap.from(el, {
          opacity: 0,
          x: 18,
          rotate: 3,
          duration: 0.7,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 85%" },
        });
      });
      gsap.utils.toArray<HTMLElement>("[data-lg-rise]").forEach((el) => {
        gsap.from(el.children, {
          y: 30,
          opacity: 0,
          duration: 0.7,
          stagger: 0.08,
          ease: "power3.out",
          scrollTrigger: { trigger: el, start: "top 80%" },
        });
      });
    });
  });
  return null;
}
