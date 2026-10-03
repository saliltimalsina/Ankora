"use client";

import { useRef } from "react";
import { gsap, useGSAP, MQ } from "../../lib/gsap";
import { ROLES } from "../../lib/careers";

// /careers hero: says plainly what's on offer (bring in projects, earn on each
// one) and answers the first questions up front: pay, where, hours, reply time.

const FACTS = [
  { k: "Pay", v: "Commission per project" },
  { k: "Where", v: "Remote, anywhere in Nepal" },
  { k: "Hours", v: "Set your own" },
  { k: "Reply", v: "Within 5 working days" },
];

export default function CareersHero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MQ.motion, () => {
        gsap.from("[data-cr-in]", { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: "power3.out", delay: 0.15 });
        gsap.from(".cr-fact", { y: 20, opacity: 0, duration: 0.6, stagger: 0.07, ease: "power2.out", delay: 0.55 });
      });
    },
    { scope: root },
  );

  const open = ROLES.length;

  return (
    <section ref={root} className="cr-hero">
      <div className="cr-hero-in">
        <div className="cr-hero-top" data-cr-in>
          <p className="cr-kick">Careers at Ankora Labs</p>
          <p className="cr-status">
            <i aria-hidden="true" />
            {open ? `${open} ${open === 1 ? "role" : "roles"} open` : "No open roles right now"}
          </p>
        </div>
        <h1 className="cr-h1" data-cr-in>
          Bring in the projects. <em>Earn on every one.</em>
        </h1>
        <div className="cr-hero-row">
          <div data-cr-in>
            <p className="cr-lede">
              We’re a design and engineering studio in Kathmandu, building websites and apps for Nepali businesses. If
              you know business owners who need one, introduce them. We do the work, and you earn a commission on every
              project that signs.
            </p>
            <div className="cr-ctas">
              <a className="cr-btn cr-btn-fill" href="#roles">
                See the role <span aria-hidden="true">↓</span>
              </a>
              <a className="cr-btn" href="#apply">
                Apply in a minute
              </a>
            </div>
          </div>
          <dl className="cr-facts">
            {FACTS.map((f) => (
              <div key={f.k} className="cr-fact">
                <dt>{f.k}</dt>
                <dd>{f.v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
