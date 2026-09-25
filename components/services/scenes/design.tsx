"use client";

import { gsap } from "../../../lib/gsap";
import { canHover, local, type SceneCtl } from "./util";
import s from "./design.module.css";

// Product Design: a Ratna product card goes from grey wireframe to finished
// UI, one design token at a time. A line draws from each token to the part it
// styles, and that part changes as the line arrives. The toggle under the
// card flips between the two states.
//
// Markup is the finished state (for reduced motion); the timeline animates
// into it from the wireframe.

export function DesignScene() {
  return (
    <div className={s.scene} data-scene="design">
      <svg data-wires className={s.wires} aria-hidden="true">
        <path data-wire="0" />
        <path data-wire="1" />
        <path data-wire="2" />
      </svg>

      <div className={s.tokens} aria-hidden="true">
        <div data-token="0" className={s.token}>
          <span className={s.tLabel}>Colour</span>
          <span className={s.swatches}>
            <i style={{ background: "#004822" }} />
            <i style={{ background: "#D5E27B" }} />
            <i style={{ background: "#B5703C" }} />
            <i style={{ background: "#FBF8EF" }} />
          </span>
        </div>
        <div data-token="1" className={s.token}>
          <span className={s.tLabel}>Type</span>
          <span className={s.type}>
            <b>Aa</b>
            <small>Radion / Basis</small>
          </span>
        </div>
        <div data-token="2" className={s.token}>
          <span className={s.tLabel}>Shape</span>
          <span className={s.shape}>
            <i />
            <small>radius 12</small>
          </span>
        </div>
      </div>

      <div data-card className={s.card}>
        <div data-target="2" className={s.img}>
          <span data-photo className={s.photo} role="img" aria-label="Ratna living room with a blue armchair" />
          <span data-wire-x className={s.wireX} aria-hidden="true">
            <svg viewBox="0 0 100 80" preserveAspectRatio="none">
              <path d="M0 0L100 80M100 0L0 80" />
            </svg>
          </span>
        </div>
        <div data-target="1" className={s.text}>
          <b data-final>Teak Lounge Chair</b>
          <span data-final>Living Room · Solid teak</span>
          <i data-bar className={s.bar} />
          <i data-bar className={`${s.bar} ${s.short}`} />
        </div>
        <div className={s.row}>
          <b data-final className={s.price}>
            Rs 48,500
          </b>
          <span data-target="0" className={s.btn}>
            <span data-final>Add to cart</span>
            <i data-wire-btn className={s.wireBtn} />
          </span>
        </div>
      </div>

      <button type="button" data-toggle className={s.toggle} aria-label="Switch between wireframe and final design">
        <span data-knob className={s.knob} />
        <span>Wireframe</span>
        <span>Final</span>
      </button>
    </div>
  );
}

export function buildDesign(el: HTMLElement): SceneCtl {
  const one = <T extends Element = HTMLElement>(sel: string) => el.querySelector(sel) as unknown as T;
  const card = one("[data-card]");
  const wires = Array.from(el.querySelectorAll<SVGPathElement>("[data-wire]"));
  const svg = one<SVGSVGElement>("[data-wires]");
  const toggle = one<HTMLButtonElement>("[data-toggle]");
  const knob = one("[data-knob]");

  // curves from each token's right edge to the left edge of what it styles
  const route = () => {
    svg.setAttribute("viewBox", `0 0 ${el.offsetWidth} ${el.offsetHeight}`);
    wires.forEach((w, i) => {
      const t = local(one(`[data-token="${i}"]`), el);
      const g = local(one(`[data-target="${i}"]`), el);
      const x1 = t.x + t.w;
      const y1 = t.y + t.h / 2;
      const x2 = g.x - 4;
      const y2 = g.y + g.h / 2;
      const mx = (x1 + x2) / 2;
      w.setAttribute("d", `M${x1} ${y1} C ${mx} ${y1}, ${mx} ${y2}, ${x2} ${y2}`);
    });
  };
  route();

  const q = (sel: string) => el.querySelectorAll(sel);
  const px = el.offsetWidth;
  const tl = gsap.timeline({ paused: true });

  // the wireframe state
  tl.set(card, { borderRadius: 2, boxShadow: "0 0 0 rgba(0,0,0,0)" }, 0)
    .set(q("[data-final]"), { autoAlpha: 0 }, 0)
    .set(q("[data-photo]"), { autoAlpha: 0, scale: 1.12 }, 0)
    .set([...q("[data-bar]"), one("[data-wire-x]"), one("[data-wire-btn]")], { autoAlpha: 1, scaleX: 1 }, 0)
    .set(one("[data-target='0']"), { backgroundColor: "rgba(0,0,0,0)" }, 0)
    .set(wires, { drawSVG: "0%" }, 0)
    .set(knob, { x: 0, xPercent: 0 }, 0);

  // colour -> button and price
  tl.to(wires[0], { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, 0.3)
    .to(one("[data-wire-btn]"), { autoAlpha: 0, duration: 0.25 }, 0.8)
    .to(one("[data-target='0']"), { backgroundColor: "#D5E27B", duration: 0.35 }, 0.8)
    .to(q(`.${s.row} [data-final]`), { autoAlpha: 1, duration: 0.35, stagger: 0.08 }, 0.85)
    .fromTo(q(`.${s.swatches} i`), { scale: 1 }, { scale: 1.25, duration: 0.15, yoyo: true, repeat: 1, stagger: 0.04 }, 0.3);

  // type -> title and meta
  tl.to(wires[1], { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, 1.05)
    .to(q("[data-bar]"), { scaleX: 0, transformOrigin: "100% 50%", duration: 0.35, ease: "power2.in", stagger: 0.06 }, 1.5)
    .fromTo(q(`.${s.text} [data-final]`), { autoAlpha: 0, y: 8 }, { autoAlpha: 1, y: 0, duration: 0.4, ease: "power3.out", stagger: 0.08 }, 1.6);

  // shape -> corners, shadow, the photo
  tl.to(wires[2], { drawSVG: "100%", duration: 0.5, ease: "power2.inOut" }, 1.9)
    .to(one("[data-wire-x]"), { autoAlpha: 0, duration: 0.25 }, 2.35)
    .to(q("[data-photo]"), { autoAlpha: 1, scale: 1, duration: 0.8, ease: "expo.out" }, 2.35)
    .to(card, { borderRadius: px * 0.028, boxShadow: "0 24px 44px -26px rgba(0, 30, 10, 0.55)", duration: 0.6, ease: "power2.out" }, 2.4);

  // the toggle lands on Final, the wires settle back
  tl.to(knob, { xPercent: 100, duration: 0.4, ease: "power3.inOut" }, 2.7).to(wires, { opacity: 0.35, duration: 0.5 }, 2.9);

  const flip = () => {
    if (tl.isActive()) return;
    if (tl.progress() > 0.5) tl.timeScale(1.8).reverse();
    else tl.timeScale(1.4).play();
  };
  toggle.addEventListener("click", flip);

  const hover = canHover();
  const tiltX = gsap.quickTo(card, "rotationY", { duration: 0.6, ease: "power3" });
  const tiltY = gsap.quickTo(card, "rotationX", { duration: 0.6, ease: "power3" });
  gsap.set(card, { transformPerspective: 900 });
  const move = (e: PointerEvent) => {
    const r = card.getBoundingClientRect();
    tiltX(((e.clientX - r.left) / r.width - 0.5) * 10);
    tiltY(((e.clientY - r.top) / r.height - 0.5) * -8);
  };
  const leave = () => {
    tiltX(0);
    tiltY(0);
  };
  if (hover) {
    card.addEventListener("pointermove", move);
    card.addEventListener("pointerleave", leave);
  }

  return {
    play: () => {
      route();
      tl.timeScale(1).restart();
    },
    pause: () => tl.pause(),
    kill: () => {
      tl.kill();
      toggle.removeEventListener("click", flip);
      card.removeEventListener("pointermove", move);
      card.removeEventListener("pointerleave", leave);
    },
  };
}
