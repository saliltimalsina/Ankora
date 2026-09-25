"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP } from "../../lib/gsap";
import { FAQ } from "../../lib/services";
import s from "./faq.module.css";

// Accordion; one open at a time. Height animates to/from "auto" with GSAP.
export default function Faq() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);
  const { contextSafe } = useGSAP({ scope: root });

  const reduce = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const toggle = contextSafe((i: number) => {
    const panels = gsap.utils.toArray<HTMLElement>("[data-panel]", root.current);
    const next = open === i ? null : i;
    const d = reduce() ? 0 : 0.5;
    panels.forEach((p, k) => {
      if (k === next) gsap.to(p, { height: "auto", duration: d, ease: "expo.out" });
      else if (k === open) gsap.to(p, { height: 0, duration: d * 0.8, ease: "power3.inOut" });
    });
    setOpen(next);
  });

  return (
    <section ref={root} className={s.faq} aria-labelledby="svc-faq-title">
      <h2 id="svc-faq-title" className={s.h2}>
        Questions, <em>answered.</em>
      </h2>
      <ul className={s.list}>
        {FAQ.map((f, i) => (
          <li key={f.q} className={`${s.item} ${open === i ? s.open : ""}`}>
            <h3 className={s.q}>
              <button
                type="button"
                id={`faq-q-${i}`}
                aria-expanded={open === i}
                aria-controls={`faq-a-${i}`}
                onClick={() => toggle(i)}
              >
                <span>{f.q}</span>
                <i className={s.plus} aria-hidden="true" />
              </button>
            </h3>
            <div data-panel id={`faq-a-${i}`} role="region" aria-labelledby={`faq-q-${i}`} className={s.panel}>
              <p>{f.a}</p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
