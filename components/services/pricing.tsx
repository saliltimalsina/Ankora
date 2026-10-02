"use client";

import { useRef } from "react";
import { gsap, MQ, useGSAP } from "../../lib/gsap";
import { PRICE_FACTORS, PRICING } from "../../lib/services";
import SectionHead from "../ui/section-head";
import { BookCall, WaIcon, WhatsApp } from "../ui/links";
import s from "./pricing.module.css";

// a little fountain pen that hovers over the blank quote line
function Pen({ className }: { className: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16.5 3.5l4 4L9 19l-5 1 1-5z" />
      <path d="M14 6l4 4" />
    </svg>
  );
}

// "What a website costs": three paper receipts that print out of a slot, one
// after another, as the section scrolls in. No prices on purpose: the total is
// a hand-drawn blank, filled in after the first call, with the line items and
// timeline as the tear-off list and a "fixed quote" sticker slapped on last.
export default function Pricing() {
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

        const tl = gsap.timeline({ scrollTrigger: { trigger: q("[data-slots]")[0], start: "top 75%" } });
        q("[data-receipt]").forEach((r, i) => {
          tl.fromTo(
            r,
            { clipPath: "inset(0 0 100% 0)", y: -40 },
            { clipPath: "inset(0 0 -10% 0)", y: 0, duration: 1.1, ease: "steps(14)" },
            i * 0.25,
          ).from(r.querySelectorAll("[data-line]"), { autoAlpha: 0, x: -8, stagger: 0.05, duration: 0.3 }, i * 0.25 + 0.6);
        });
        tl.from(q("[data-sticker]"), { scale: 2.2, rotate: -40, autoAlpha: 0, duration: 0.5, ease: "back.out(2)" }, "-=0.2");
        tl.from(q("[data-blank]"), { scaleX: 0, transformOrigin: "left", duration: 0.5, stagger: 0.15, ease: "power2.out" }, 0.9);
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} id="pricing" className={s.pricing} aria-labelledby="svc-pricing-title">
      <SectionHead
        id="svc-pricing-title"
        kicker="Pricing"
        className={s.head}
        after={
          <p className={s.lede}>
            Every business is different, so we don&apos;t do rate cards. Here&apos;s what each kind of project includes
            and how long it takes; after a 30-minute call you get a fixed quote in NPR, in writing.
          </p>
        }
      >
        What a website costs <em>in Nepal.</em>
      </SectionHead>

      <div data-slots className={s.slots}>
        {PRICING.map((p, i) => (
          <article key={p.name} className={s.slot}>
            <span className={s.mouth} aria-hidden="true" />
            <div data-receipt className={s.receipt}>
              <p className={s.no}>
                <span>Ankora Labs · Kathmandu</span>
                <span>No. 0{i + 1}</span>
              </p>
              <h3>{p.name}</h3>
              <p className={s.fits}>{p.fits}</p>
              <p className={s.price}>
                <small>your quote</small>
                Rs{" "}
                <span className={s.line} aria-hidden="true">
                  <span data-blank className={s.blank} />
                  <span className={s.ink}>sized to you</span>
                  <Pen className={s.pen} />
                </span>
                <span className={s.fill}>filled in after a free 30-min call</span>
              </p>
              <ul>
                {p.items.map((it) => (
                  <li key={it} data-line>
                    <span>{it}</span>
                    <i aria-hidden="true" />
                    <b aria-hidden="true">✓</b>
                  </li>
                ))}
              </ul>
              <p className={s.total}>
                <span>Timeline</span>
                <i aria-hidden="true" />
                <span>{p.weeks}</span>
              </p>
              <div className={s.actions}>
                <a href={`/contact?need=${p.need}#brief`} className={s.cta}>
                  Get my quote <span aria-hidden="true">→</span>
                </a>
                <WhatsApp text={`Hi Ankora! I'm interested in a ${p.name.toLowerCase()}. Can we talk?`} className={s.wa}>
                  <WaIcon /> Ask on WhatsApp
                </WhatsApp>
              </div>
              <BookCall className={s.call}>or book a free call</BookCall>
            </div>
          </article>
        ))}

        <p data-sticker className={s.sticker}>
          <span>Fixed quote</span>
          <b>In writing</b>
          <span>no surprises</span>
        </p>
      </div>

      <div className={s.unsure}>
        <p>
          <b>Not sure which one fits?</b> Tell us what you&apos;re building in three taps and we&apos;ll point you
          to the right one.
        </p>
        <div className={s.unsureGo}>
          <a href="/contact#brief" className={s.cta}>
            Help me choose <span aria-hidden="true">→</span>
          </a>
          <BookCall className={s.ghost}>Book a call</BookCall>
        </div>
      </div>

      <div className={s.foot}>
        <p className={s.hand}>so what moves the price?</p>
        <ul className={s.factors}>
          {PRICE_FACTORS.map((f) => (
            <li key={f}>{f}</li>
          ))}
        </ul>
      </div>
    </section>
  );
}
