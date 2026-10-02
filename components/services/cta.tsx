"use client";

import { useRef } from "react";
import { gsap, MQ, SplitText, useGSAP } from "../../lib/gsap";
import s from "./cta.module.css";

const WA = "https://wa.me/ankoralabs?text=" + encodeURIComponent("Hi Ankora! I'd like to talk about a project.");
// Cal.com popup (public/site-kit.js); the href is the no-script fallback.
const BOOK = {
  href: "https://cal.com/ankoralabs/30min",
  "data-cal-link": "ankoralabs/30min",
  "data-cal-namespace": "30min",
  "data-cal-config": '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}',
};

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
          <a className={s.primary} {...BOOK}>
            Book a Call
          </a>
        </div>
        <a className={s.bubble} href={WA} target="_blank" rel="noopener">
          <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
          </svg>
          WhatsApp us
          <span className={s.typing} aria-hidden="true">
            <i />
            <i />
            <i />
          </span>
        </a>
        <a className={s.secondary} href="/#show-stage">
          See our work <span aria-hidden="true">→</span>
        </a>
      </div>
    </section>
  );
}
