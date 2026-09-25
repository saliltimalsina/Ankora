"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { SERVICES } from "../../lib/services";
import s from "./marquee.module.css";

// Two endless rows running opposite ways. Scrolling pushes them: they speed up
// with scroll velocity, follow the scroll direction, lean into it, then settle.
const TOOLS = SERVICES.flatMap((svc) => svc.stack);
const WORDS = [
  "Research", "Wireframes", "Prototypes", "Design systems",
  "Web apps", "APIs", "E-commerce", "Performance",
  "iOS", "Android", "Offline sync",
  "Assistants", "Search", "Automation", "Agents",
];

function Row({ items, variant }: { items: string[]; variant: "tools" | "words" }) {
  const run = (hidden: boolean) => (
    <div className={s.run} aria-hidden={hidden || undefined}>
      {items.map((t, i) => (
        <span key={i} className={s.item}>
          {t}
          <i className={s.sep} aria-hidden="true" />
        </span>
      ))}
    </div>
  );
  return (
    <div className={`${s.row} ${s[variant]}`}>
      <div data-loop className={s.inner}>
        {run(false)}
        {run(true)}
      </div>
    </div>
  );
}

export default function Marquee() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        const q = gsap.utils.selector(root);
        const loops = q("[data-loop]").map((el, i) =>
          gsap.fromTo(el, { xPercent: i ? -50 : 0 }, { xPercent: i ? 0 : -50, duration: 42, ease: "none", repeat: -1 }),
        );
        const skewTo = gsap.quickTo(q("[data-rows]"), "skewX", { duration: 0.5, ease: "power3" });
        const settle = gsap.delayedCall(0.18, () => skewTo(0)).pause();

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const v = self.getVelocity();
            const boost = 1 + Math.min(Math.abs(v) / 260, 5);
            loops.forEach((l) =>
              gsap.to(l, {
                timeScale: self.direction * boost,
                duration: 0.15,
                overwrite: true,
                onComplete: () => {
                  gsap.to(l, { timeScale: self.direction, duration: 1, ease: "power2.out" });
                },
              }),
            );
            skewTo(gsap.utils.clamp(-9, 9, v / -350));
            settle.restart(true);
          },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.marquee} aria-label="Tools and capabilities">
      <div data-rows className={s.rows}>
        <Row items={WORDS} variant="words" />
        <Row items={TOOLS} variant="tools" />
      </div>
    </section>
  );
}
