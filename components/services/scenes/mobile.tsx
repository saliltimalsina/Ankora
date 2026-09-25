"use client";

import { gsap } from "../../../lib/gsap";
import { canHover, local, type SceneCtl } from "./util";
import s from "./mobile.module.css";

// Mobile: one codebase, two phones. A single component tag feeds an iOS and
// an Android phone; every time a pulse runs down the lines, both screens move
// on together. Screens are rebuilt from TransferNet's app (a money transfer
// app we designed), not device-mockup stock.

function Screens() {
  return (
    <div data-track className={s.track}>
      <div className={s.scr}>
        <p className={s.brand}>TransferNet</p>
        <div className={s.dark}>
          <small>You send</small>
          <b>500.00 <em>AUD</em></b>
          <small>They receive</small>
          <b>32,629.75 <em>NPR</em></b>
        </div>
        <p className={s.rate}>
          65.2595 <span>+0.69%</span>
        </p>
        <span className={s.cta}>Send now</span>
      </div>
      <div className={s.scr}>
        <p className={s.h}>Who are you sending to?</p>
        {[
          ["JD", "John Doe"],
          ["AS", "Alice Smith"],
          ["BM", "Bob Martin"],
        ].map(([i, n], k) => (
          <div key={n} className={`${s.person} ${k === 1 ? s.picked : ""}`}>
            <i>{i}</i>
            <span>{n}</span>
          </div>
        ))}
        <span className={s.cta}>Continue</span>
      </div>
      <div className={s.scr}>
        <div className={s.done}>
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M5 12.5 10 17l9-10" />
          </svg>
        </div>
        <p className={s.h}>Transfer created</p>
        <p className={s.sub}>100 AUD to Alice Smith</p>
        <span className={s.cta}>Track transfer</span>
      </div>
    </div>
  );
}

function Phone({ os }: { os: "ios" | "android" }) {
  return (
    <div data-phone className={`${s.phone} ${s[os]}`}>
      <div className={s.screen}>
        <div className={s.status}>
          <span>9:41</span>
          <i />
        </div>
        <Screens />
        <div className={s.homebar} />
      </div>
    </div>
  );
}

export function MobileScene() {
  return (
    <div className={s.scene} data-scene="mobile" role="img" aria-label="The same TransferNet screens running in sync on an iPhone and an Android phone">
      <svg data-links className={s.links} aria-hidden="true">
        <path data-link="0" className={s.line} />
        <path data-link="1" className={s.line} />
        <path data-pulse="0" className={s.pulse} />
        <path data-pulse="1" className={s.pulse} />
      </svg>

      <div data-pair className={s.pair}>
        <figure className={s.slot}>
          <Phone os="ios" />
          <figcaption>iOS</figcaption>
        </figure>
        <figure className={s.slot}>
          <Phone os="android" />
          <figcaption>Android</figcaption>
        </figure>
      </div>

      <span data-chip className={s.chip}>
        &lt;TransferCard /&gt;
      </span>
    </div>
  );
}

export function buildMobile(el: HTMLElement): SceneCtl {
  const one = <T extends Element = HTMLElement>(sel: string) => el.querySelector(sel) as unknown as T;
  const svg = one<SVGSVGElement>("[data-links]");
  const chip = one("[data-chip]");
  const phones = Array.from(el.querySelectorAll<HTMLElement>("[data-phone]"));
  const tracks = Array.from(el.querySelectorAll<HTMLElement>("[data-track]"));
  const links = Array.from(el.querySelectorAll<SVGPathElement>("[data-link]"));
  const pulses = Array.from(el.querySelectorAll<SVGPathElement>("[data-pulse]"));

  // lines from the chip down into each phone's screen edge
  const route = () => {
    svg.setAttribute("viewBox", `0 0 ${el.offsetWidth} ${el.offsetHeight}`);
    const c = local(chip, el);
    phones.forEach((p, i) => {
      const r = local(p, el);
      const x1 = c.x + (i ? c.w : 0);
      const y1 = c.y + c.h / 2;
      const x2 = i ? r.x : r.x + r.w;
      const y2 = r.y + r.h * 0.42;
      const d = `M${x1} ${y1} C ${(x1 + x2) / 2} ${y1}, ${(x1 + x2) / 2} ${y2}, ${x2} ${y2}`;
      links[i].setAttribute("d", d);
      pulses[i].setAttribute("d", d);
    });
  };
  route();

  const tl = gsap.timeline({ paused: true });
  tl.fromTo(phones, { y: 40, rotation: (i) => (i ? 5 : -5), autoAlpha: 0 }, { y: 0, rotation: 0, autoAlpha: 1, duration: 0.9, ease: "expo.out", stagger: 0.1 }, 0)
    .fromTo(chip, { scale: 0.6, autoAlpha: 0 }, { scale: 1, autoAlpha: 1, duration: 0.45, ease: "back.out(2.4)" }, 0.45)
    .fromTo(links, { drawSVG: "0%" }, { drawSVG: "100%", duration: 0.6, ease: "power2.inOut" }, 0.6)
    .set(tracks, { xPercent: 0 }, 0)
    .set(pulses, { drawSVG: "0% 0%", autoAlpha: 0 }, 0);

  // in sync: pulse down both lines, then both screens move on together
  const loop = gsap.timeline({ repeat: -1, repeatDelay: 0.2 });
  [1, 2, 0].forEach((i) => {
    loop
      .set(pulses, { autoAlpha: 1, drawSVG: "0% 0%" }, "+=1.2")
      .to(pulses, { drawSVG: "84% 100%", duration: 0.45, ease: "power1.in" })
      .to(pulses, { autoAlpha: 0, duration: 0.1 })
      .to(tracks, { xPercent: (-100 / 3) * i, duration: 0.6, ease: "expo.inOut" }, "<");
  });
  tl.add(loop, 1.1);

  const hover = canHover();
  const pair = one("[data-pair]");
  gsap.set(pair, { transformPerspective: 1100 });
  const ry = gsap.quickTo(pair, "rotationY", { duration: 0.7, ease: "power3" });
  const rx = gsap.quickTo(pair, "rotationX", { duration: 0.7, ease: "power3" });
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * 18);
    rx(((e.clientY - r.top) / r.height - 0.5) * -10);
  };
  const leave = () => {
    ry(0);
    rx(0);
  };
  if (hover) {
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
  }

  return {
    play: () => {
      route();
      tl.restart();
    },
    pause: () => tl.pause(),
    kill: () => {
      tl.kill();
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    },
  };
}
