"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../../lib/gsap";
import { INDUSTRIES, INTEGRATIONS } from "../../lib/services";
import SectionHead from "../ui/section-head";
import s from "./built-for.module.css";

// "Who we build for": the kinds of clients we already ship for, each row a
// strip of tape that floods with its colour on hover, with the work that backs
// it. Below, the payment gateways and services we plug in, dropped onto the
// board like fridge magnets.
export default function BuiltFor() {
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
        q("[data-row]").forEach((row) => {
          gsap.from(row, {
            xPercent: -6,
            autoAlpha: 0,
            duration: 0.9,
            ease: "expo.out",
            scrollTrigger: { trigger: row, start: "top 90%" },
          });
        });
        gsap.from(q("[data-chip]"), {
          y: -120,
          rotate: () => gsap.utils.random(-30, 30),
          autoAlpha: 0,
          duration: 0.9,
          ease: "bounce.out",
          stagger: { each: 0.05, from: "random" },
          scrollTrigger: { trigger: q("[data-board]")[0], start: "top 80%" },
        });
      });

      mm.add(MQ.hover, () => {
        const offs = q("[data-chip]").map((chip) => {
          const enter = () =>
            gsap.fromTo(chip, { rotate: 0 }, { rotate: gsap.utils.random([-8, 8]), duration: 0.6, ease: "elastic.out(1.2, 0.3)" });
          const leave = () => gsap.to(chip, { rotate: 0, duration: 0.5, ease: "power3.out" });
          chip.addEventListener("pointerenter", enter);
          chip.addEventListener("pointerleave", leave);
          return () => {
            chip.removeEventListener("pointerenter", enter);
            chip.removeEventListener("pointerleave", leave);
          };
        });
        return () => offs.forEach((off) => off());
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="built-for" className={s.built} aria-labelledby="svc-built-title">
      <SectionHead id="svc-built-title" kicker="Who we build for" className={s.head}>
        Built for <em>Nepali businesses.</em>
      </SectionHead>

      <ul className={s.rows}>
        {INDUSTRIES.map((x, i) => (
          <li key={x.name} data-row className={s.row} style={{ "--c": x.color } as React.CSSProperties}>
            <span className={s.n}>0{i + 1}</span>
            <h3>{x.name}</h3>
            <span className={s.look}>{x.look}</span>
            <span className={s.proof}>{x.proof}</span>
          </li>
        ))}
      </ul>

      <p className={s.note}>Named projects were designed and built by our founding team, some before Ankora.</p>

      <div data-board className={s.board}>
        <p className={s.boardHead}>
          <span className={s.label}>Plugs into</span>
          <span className={s.hand}>yes, all of them</span>
        </p>
        <ul className={s.chips} aria-label="Payment gateways and integrations">
          {INTEGRATIONS.map((t) => (
            <li key={t} data-chip className={s.chip}>
              {t}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
