"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../../lib/gsap";
import { PROCESS } from "../../lib/services";
import s from "./process.module.css";

// A hand-drawn line winds through the five steps and draws itself as you
// scroll; each step pops in as the pen reaches it. The path is traced from the
// real dot positions on every refresh, so it holds at any width.
export default function Process() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const wrap = q("[data-wrap]")[0] as HTMLElement;
      const svg = root.current!.querySelector<SVGSVGElement>("[data-svg]")!;
      const paths = Array.from(root.current!.querySelectorAll<SVGPathElement>("[data-path]"));
      const dots = q("[data-dot]") as HTMLElement[];

      const trace = () => {
        const box = wrap.getBoundingClientRect();
        const pts = dots.map((d) => {
          const r = d.getBoundingClientRect();
          return [r.left + r.width / 2 - box.left, r.top + r.height / 2 - box.top];
        });
        // start above the first dot, end below the last, so the line runs in and out
        const [x0, y0] = pts[0];
        const [xn, yn] = pts[pts.length - 1];
        let d = `M ${x0} ${y0 - 120} L ${x0} ${y0}`;
        for (let i = 1; i < pts.length; i++) {
          const [ax, ay] = pts[i - 1];
          const [bx, by] = pts[i];
          const my = (by - ay) / 2;
          d += ` C ${ax} ${ay + my}, ${bx} ${by - my}, ${bx} ${by}`;
        }
        d += ` L ${xn} ${yn + 120}`;
        svg.setAttribute("viewBox", `0 0 ${box.width} ${box.height}`);
        paths.forEach((p) => p.setAttribute("d", d));
      };
      trace();

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

        gsap.fromTo(
          paths[1],
          { drawSVG: "0%" },
          {
            drawSVG: "100%",
            ease: "none",
            scrollTrigger: {
              trigger: wrap,
              start: "top 60%",
              end: "bottom 60%",
              scrub: 0.6,
              invalidateOnRefresh: true,
              onRefreshInit: trace,
            },
          },
        );

        q("[data-step]").forEach((step) => {
          gsap
            .timeline({
              scrollTrigger: { trigger: step, start: "center 62%", toggleActions: "play none none reverse" },
            })
            .from(step.querySelector("[data-dot]"), { scale: 0, duration: 0.5, ease: "back.out(2.4)" })
            .from(
              step.querySelector("[data-card]"),
              { y: 40, rotate: step.getAttribute("data-side") === "l" ? -4 : 4, autoAlpha: 0, duration: 0.7, ease: "power3.out" },
              0.08,
            )
            .from(step.querySelector("[data-hand]"), { autoAlpha: 0, x: -10, duration: 0.4 }, 0.4);
        });
      });

      const onResize = () => trace();
      window.addEventListener("resize", onResize);
      return () => window.removeEventListener("resize", onResize);
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.process} aria-labelledby="svc-process-title">
      <div className={s.head} data-head>
        <p className={s.kicker}>How we work</p>
        <h2 id="svc-process-title" className={s.h2}>
          From first call <br />
          to <em>launch day.</em>
        </h2>
      </div>

      <div data-wrap className={s.wrap}>
        <svg data-svg className={s.svg} aria-hidden="true" preserveAspectRatio="none">
          <path data-path className={s.ghost} />
          <path data-path className={s.ink} />
        </svg>
        <ol className={s.steps}>
          {PROCESS.map((p, i) => (
            <li key={p.n} data-step data-side={i % 2 ? "r" : "l"} className={`${s.step} ${i % 2 ? s.r : s.l}`}>
              <span data-dot className={s.dot}>
                {p.n}
              </span>
              <div data-card className={s.card}>
                <h3>{p.title}</h3>
                <p>{p.body}</p>
                <span data-hand className={s.hand}>
                  {p.note}
                </span>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
