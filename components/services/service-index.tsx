"use client";

import { useRef, useState } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { SERVICES } from "../../lib/services";
import s from "./service-index.module.css";

// "What's included": the four services as an accordion. The chapters above
// tell the story; this is the scannable reference. Opening a row floods it
// with the service colour and reveals the full deliverables, the tools and a
// real way to start. One row open at a time.
export default function ServiceIndex() {
  const root = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  const { contextSafe } = useGSAP(
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
        q("[data-item]").forEach((item) => {
          gsap
            .timeline({ scrollTrigger: { trigger: item, start: "top 88%" } })
            .from(item.querySelector("[data-rule]"), { scaleX: 0, duration: 1, ease: "expo.out" })
            .from(item.querySelectorAll("[data-rise]"), { yPercent: 100, autoAlpha: 0, duration: 0.8, stagger: 0.06, ease: "power3.out" }, 0.1);
        });
      });
    },
    { scope: root },
  );

  const toggle = contextSafe((i: number) => {
    const items = gsap.utils.toArray<HTMLElement>("[data-item]", root.current);
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const d = reduce ? 0 : 1;
    const next = open === i ? null : i;
    items.forEach((item, k) => {
      const panel = item.querySelector("[data-panel]");
      const fill = item.querySelector("[data-fill]");
      const o = { overwrite: "auto" as const };
      if (k === next) {
        gsap.to(panel, { height: "auto", duration: 0.6 * d, ease: "expo.out", ...o, onComplete: () => ScrollTrigger.refresh() });
        gsap.to(fill, { scaleY: 1, duration: 0.5 * d, ease: "expo.out", ...o });
        gsap.fromTo(
          item.querySelectorAll("[data-in]"),
          { y: 14, autoAlpha: 0 },
          { y: 0, autoAlpha: 1, duration: 0.45 * d, stagger: 0.04 * d, ease: "power3.out", delay: 0.12 * d },
        );
      } else if (k === open) {
        gsap.to(panel, { height: 0, duration: 0.45 * d, ease: "power3.inOut", ...o, onComplete: () => next === null && ScrollTrigger.refresh() });
        gsap.to(fill, { scaleY: 0, duration: 0.45 * d, ease: "power3.inOut", ...o });
      }
    });
    setOpen(next);
  });

  return (
    <section ref={root} id="svc-index" className={s.index} aria-labelledby="svc-index-title">
      <div className={s.head} data-head>
        <p className={s.kicker}>What&rsquo;s included</p>
        <h2 id="svc-index-title" className={s.h2}>
          Pick a craft, or all four.
        </h2>
        <p className={s.sub}>
          Most products need more than one. Our designers and engineers work in the same squad, so nothing gets lost
          between them.
        </p>
      </div>

      <ul className={s.list}>
        {SERVICES.map((svc, i) => {
          const isOpen = open === i;
          return (
            <li
              key={svc.slug}
              data-item
              className={`${s.item} ${isOpen ? s.open : ""}`}
              style={{ "--accent": svc.theme.ground, "--on": svc.theme.ink } as React.CSSProperties}
            >
              <span data-fill className={s.fill} aria-hidden="true" />
              <span data-rule className={s.rule} aria-hidden="true" />
              <h3 className={s.rowH}>
                <button
                  type="button"
                  className={s.row}
                  id={`svc-row-${svc.slug}`}
                  aria-expanded={isOpen}
                  aria-controls={`svc-panel-${svc.slug}`}
                  onClick={() => toggle(i)}
                >
                  <span className={s.clip}>
                    <span data-rise className={s.n}>{svc.n}</span>
                  </span>
                  <span className={s.clip}>
                    <span data-rise className={s.title}>{svc.title}</span>
                  </span>
                  <span className={`${s.clip} ${s.shortWrap}`}>
                    <span data-rise className={s.short}>{svc.short}</span>
                  </span>
                  <span className={s.plus} aria-hidden="true" />
                </button>
              </h3>

              <div
                data-panel
                id={`svc-panel-${svc.slug}`}
                role="region"
                aria-labelledby={`svc-row-${svc.slug}`}
                className={s.panel}
              >
                <div className={s.panelIn}>
                  <ul className={s.deliv}>
                    {svc.deliverables.map((d) => (
                      <li key={d} data-in>
                        {d}
                      </li>
                    ))}
                  </ul>
                  <div className={s.side}>
                    <p data-in className={s.blurb}>
                      {svc.blurb}
                    </p>
                    <p data-in className={s.tools}>
                      <b>Tools</b> {svc.stack.join(", ")}
                    </p>
                    <a data-in className={s.cta} href="/contact">
                      {svc.cta} <span aria-hidden="true">→</span>
                    </a>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
