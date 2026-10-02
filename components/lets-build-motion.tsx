"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "../lib/gsap";

// Motion for the "Let's build" section (markup from components/kit): the giant
// LET'S BUILD rises letter by letter as the section scrolls in (scrubbed), the
// rest fades up, and the Book a Call button leans toward the pointer.
export default function LetsBuildMotion({ html }: { html: string }) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const section = q("[data-lets-build]")[0] as HTMLElement;
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const split = SplitText.create(q("[data-big]"), { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 100,
          rotate: (i) => (i % 2 ? 6 : -6),
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: section, start: "top 85%", end: "top 25%", scrub: 0.8 },
        });
        gsap.from(q("[data-fade]"), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: section, start: "top 50%" },
        });
        return () => split.revert();
      });

      mm.add(MQ.hover, () => {
        const zone = q("[data-magnet]")[0] as HTMLElement;
        const btn = zone.querySelector("a")!;
        const xTo = gsap.quickTo(btn, "x", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const yTo = gsap.quickTo(btn, "y", { duration: 0.6, ease: "elastic.out(1, 0.4)" });
        const move = (e: PointerEvent) => {
          const r = zone.getBoundingClientRect();
          xTo((e.clientX - (r.left + r.width / 2)) * 0.35);
          yTo((e.clientY - (r.top + r.height / 2)) * 0.35);
        };
        const leave = () => {
          xTo(0);
          yTo(0);
        };
        zone.addEventListener("pointermove", move);
        zone.addEventListener("pointerleave", leave);
        return () => {
          zone.removeEventListener("pointermove", move);
          zone.removeEventListener("pointerleave", leave);
        };
      });
    },
    { scope: root },
  );

  // site.js rewrites the Cal attributes on click, possibly before hydration
  return <div ref={root} style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: html }} />;
}
