"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../../lib/gsap";
import { ENGAGEMENTS } from "../../lib/services";
import s from "./engage.module.css";

// "Ways to work with us": three cards dealt onto the table from a single stack,
// tilting toward the pointer on hover.
export default function Engage() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        gsap.from(q("[data-head] > *"), {
          y: 30,
          autoAlpha: 0,
          stagger: 0.08,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });

        const cards = q("[data-card]");
        gsap.from(cards, {
          x: (i) => (1 - i) * 110 + "%",
          y: 80,
          rotate: (i) => (i - 1) * -10,
          autoAlpha: 0,
          duration: 1.1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: q("[data-cards]")[0], start: "top 78%" },
        });

      });

      mm.add(MQ.hover, () => {
        const offs = q("[data-card]").map((card) => {
          const tilt = card.querySelector("[data-tilt]") as HTMLElement;
          gsap.set(tilt, { transformPerspective: 900 });
          const rx = gsap.quickTo(tilt, "rotationX", { duration: 0.6, ease: "power3" });
          const ry = gsap.quickTo(tilt, "rotationY", { duration: 0.6, ease: "power3" });
          const move = (e: PointerEvent) => {
            const r = card.getBoundingClientRect();
            ry(((e.clientX - r.left) / r.width - 0.5) * 12);
            rx(((e.clientY - r.top) / r.height - 0.5) * -10);
          };
          const leave = () => {
            rx(0);
            ry(0);
          };
          card.addEventListener("pointermove", move as EventListener);
          card.addEventListener("pointerleave", leave);
          return () => {
            card.removeEventListener("pointermove", move as EventListener);
            card.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((off) => off());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.engage} aria-labelledby="svc-engage-title">
      <div className={s.head} data-head>
        <p className={s.kicker}>Ways to work with us</p>
        <h2 id="svc-engage-title" className={s.h2}>
          Start small, <em>or go all in.</em>
        </h2>
      </div>

      <div data-cards className={s.cards}>
        {ENGAGEMENTS.map((e, i) => (
          <article key={e.name} data-card className={`${s.card} ${i === 1 ? s.dark : ""}`}>
            <div data-tilt className={s.tilt}>
              <span className={s.tag}>{e.tag}</span>
              <h3>{e.name}</h3>
              <p>{e.body}</p>
              <ul>
                {e.points.map((p) => (
                  <li key={p}>{p}</li>
                ))}
              </ul>
              <a href="/contact" className={s.link}>
                Talk to us <span aria-hidden="true">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>

    </section>
  );
}
