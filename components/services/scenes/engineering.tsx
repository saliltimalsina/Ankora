"use client";

import { gsap } from "../../../lib/gsap";
import { canHover, type SceneCtl } from "./util";
import s from "./engineering.module.css";

// Engineering: Hukut's homepage, cut into its real component layers. They
// start pulled apart in 3D (a dev-tools layer view), then fall into place as
// the finished page. A small build log ticks through and a Lighthouse score
// counts up. On hover the assembled page tilts and its layers lift apart.

// crops of /images/homepage/Trail7.webp (2000x1049): [top px, height px]
const LAYERS = [
  { tag: "<Header />", top: 0, h: 150 },
  { tag: "<HeroBanner />", top: 160, h: 470 },
  { tag: "<CategoryRail />", top: 680, h: 285 },
];
const IMG_H = 1049;

export function EngineeringScene() {
  return (
    <div className={s.scene} data-scene="engineering">
      <div data-stage3d className={s.stage3d}>
        <div data-stack className={s.stack} role="img" aria-label="Hukut marketplace homepage, assembled from its component layers">
          {LAYERS.map((l) => (
            <div
              key={l.tag}
              data-layer
              className={s.layer}
              style={{
                aspectRatio: `2000 / ${l.h}`,
                backgroundPosition: `0 ${((l.top / (IMG_H - l.h)) * 100).toFixed(2)}%`,
              }}
            >
              <span data-tag className={s.tag}>
                {l.tag}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div data-log className={s.log}>
        <div data-row className={s.row}>
          <span>Build</span>
          <b>1.2s</b>
          <Check />
        </div>
        <div data-row className={s.row}>
          <span>Tests</span>
          <b>48 passed</b>
          <Check />
        </div>
        <div data-row className={s.row}>
          <span>Deploy</span>
          <b>Production</b>
          <Check />
        </div>
        <div className={s.score}>
          <svg viewBox="0 0 44 44" className={s.ring}>
            <circle cx="22" cy="22" r="18" className={s.ringBg} />
            <circle data-ring cx="22" cy="22" r="18" className={s.ringFg} />
          </svg>
          <b data-score>100</b>
          <span>
            Lighthouse
            <br />
            performance
          </span>
        </div>
      </div>
    </div>
  );
}

function Check() {
  return (
    <svg viewBox="0 0 16 16" className={s.check} aria-hidden="true">
      <path data-check d="M3 8.5 6.5 12 13 4.5" />
    </svg>
  );
}

export function buildEngineering(el: HTMLElement): SceneCtl {
  const one = <T extends Element = HTMLElement>(sel: string) => el.querySelector(sel) as unknown as T;
  const stack = one("[data-stack]");
  const layers = Array.from(el.querySelectorAll<HTMLElement>("[data-layer]"));
  const score = one("[data-score]");
  const n = { v: 0 };
  const gap = () => el.offsetWidth * 0.11;

  gsap.set(stack, { transformPerspective: 1600, transformStyle: "preserve-3d" });

  const tl = gsap.timeline({ paused: true });
  // exploded: tipped back and turned, layers lifted apart (header on top)
  tl.set(stack, { rotationX: 56, rotationZ: -34, scale: 0.78, y: el.offsetWidth * 0.04 }, 0)
    .set(layers, { z: (i) => (layers.length - 1 - i) * gap() }, 0)
    .set(el.querySelectorAll("[data-tag]"), { autoAlpha: 1 }, 0)
    .set(one("[data-log]"), { autoAlpha: 0, y: 20 }, 0)
    .set(el.querySelectorAll("[data-row]"), { autoAlpha: 0.35 }, 0)
    .set(el.querySelectorAll("[data-check]"), { drawSVG: "0%" }, 0)
    .set(one("[data-ring]"), { drawSVG: "0%" }, 0)
    .call(() => (score.textContent = "0"), [], 0);

  // assemble
  tl.to(stack, { rotationX: 0, rotationZ: 0, scale: 1, y: 0, duration: 1.3, ease: "expo.inOut" }, 0.45)
    .to(layers, { z: 0, duration: 1.1, ease: "expo.inOut", stagger: 0.06 }, 0.5)
    .to(el.querySelectorAll("[data-tag]"), { autoAlpha: 0, duration: 0.3, stagger: 0.05 }, 1.25);

  // ship
  tl.to(one("[data-log]"), { autoAlpha: 1, y: 0, duration: 0.5, ease: "power3.out" }, 1.55);
  el.querySelectorAll("[data-row]").forEach((row, i) => {
    tl.to(row, { autoAlpha: 1, duration: 0.2 }, 1.8 + i * 0.28).to(row.querySelector("[data-check]"), { drawSVG: "100%", duration: 0.3, ease: "power2.out" }, 1.85 + i * 0.28);
  });
  tl.to(one("[data-ring]"), { drawSVG: "100%", duration: 0.9, ease: "power2.out" }, 2.65).fromTo(
    n,
    { v: 0 },
    { v: 100, duration: 0.9, ease: "power2.out", onUpdate: () => (score.textContent = String(Math.round(n.v))) },
    2.65,
  );

  // hover: tilt toward the pointer and lift the layers apart a little
  const hover = canHover();
  const rx = gsap.quickTo(stack, "rotationX", { duration: 0.6, ease: "power3" });
  const ry = gsap.quickTo(stack, "rotationY", { duration: 0.6, ease: "power3" });
  const enter = () => {
    if (tl.isActive()) return;
    gsap.to(layers, { z: (i) => (layers.length - 1 - i) * gap() * 0.22, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  const move = (e: PointerEvent) => {
    if (tl.isActive()) return;
    const r = el.getBoundingClientRect();
    ry(((e.clientX - r.left) / r.width - 0.5) * 16);
    rx(((e.clientY - r.top) / r.height - 0.5) * -12 + 8);
  };
  const leave = () => {
    if (tl.isActive()) return;
    rx(0);
    ry(0);
    gsap.to(layers, { z: 0, duration: 0.5, ease: "power3.out", overwrite: "auto" });
  };
  if (hover) {
    el.addEventListener("pointerenter", enter);
    el.addEventListener("pointermove", move);
    el.addEventListener("pointerleave", leave);
  }

  return {
    play: () => tl.restart(),
    pause: () => tl.pause(),
    kill: () => {
      tl.kill();
      el.removeEventListener("pointerenter", enter);
      el.removeEventListener("pointermove", move);
      el.removeEventListener("pointerleave", leave);
    },
  };
}
