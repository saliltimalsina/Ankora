"use client";

import { gsap, useGSAP, MQ } from "../../lib/gsap";

// Scroll-in motion for /careers below the hero: headings rise, role tickets
// slide up, cards and steps stagger in. Reduced motion keeps the static layout.

export default function CareersMotion() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(MQ.motion, () => {
      gsap.utils.toArray<HTMLElement>(".cr-sec .cr-in").forEach((sec) => {
        const head = sec.querySelectorAll(":scope > .cr-kick, :scope > .cr-h2, :scope > .cr-sub");
        if (head.length)
          gsap.from(head, { y: 30, opacity: 0, duration: 0.7, stagger: 0.08, ease: "power3.out", scrollTrigger: { trigger: sec, start: "top 80%" } });
        const items = sec.querySelectorAll(".cr-role, .cr-way, .cr-step, .cr-form, .cr-letter");
        if (items.length)
          gsap.from(items, {
            y: 46,
            opacity: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
            scrollTrigger: { trigger: items[0], start: "top 85%" },
          });
      });
    });
  });
  return null;
}
