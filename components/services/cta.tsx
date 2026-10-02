"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "../../lib/gsap";
import s from "./cta.module.css";

// Closing call to action. The giant "LET'S BUILD" rises letter by letter as the
// section scrolls in (scrubbed), and the button leans toward the pointer.
export default function Cta() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        const split = SplitText.create(q("[data-big]"), { type: "chars" });
        gsap.from(split.chars, {
          yPercent: 100,
          rotate: (i) => (i % 2 ? 6 : -6),
          ease: "power2.out",
          stagger: 0.05,
          scrollTrigger: { trigger: root.current, start: "top 85%", end: "top 25%", scrub: 0.8 },
        });
        gsap.from(q("[data-fade]"), {
          y: 24,
          autoAlpha: 0,
          stagger: 0.1,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 50%" },
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

  return (
    <section ref={root} className={s.cta} aria-labelledby="svc-cta-title">
      <img className={s.tear} src="/images/texture/paper-tear.webp" alt="" aria-hidden="true" />
      <p data-fade className={s.kicker}>Got something in mind?</p>
      <h2 id="svc-cta-title" className={s.big}>
        <span data-big>Let&rsquo;s build</span>
      </h2>
      <p data-fade className={s.sub}>
        Tell us what you&rsquo;re making. We&rsquo;ll come back with a plan, not a sales deck.
      </p>
      <div data-fade className={s.actions}>
        <div data-magnet className={s.magnet}>
          <a className={s.primary} href="/contact">
            Book a Call
          </a>
        </div>
        <a className={s.secondary} href="/#show-stage">
          See our work <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
