"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, SplitText, useGSAP } from "../../lib/gsap";
import { SERVICES } from "../../lib/services";
import s from "./hero.module.css";

// Type-only hero, set on the graph paper like a proof on a drawing board:
// cap-height and baseline rules, a margin guide, a compass circle around the
// O, the measured gap between the lines, crop marks. Every guide is measured
// from the rendered letters (baseline markers + the font's real cap height),
// so they sit exactly on the type at any size.
//
// Scrolling pins the hero: the guides let go and slide off, and the camera
// zooms into the lime-filled O until the lime (the first chapter's colour)
// fills the screen and hands over to the Product Design chapter below.

const first = SERVICES[0].theme.ground;
const NS = "http://www.w3.org/2000/svg";

// offset of `node` inside `upTo`, from layout offsets, so transforms (the zoom,
// the letter rise) never skew the measurement
function local(node: HTMLElement, upTo: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = node;
  while (n && n !== upTo) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y };
}

export default function Hero() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const el = root.current!;
      const q = gsap.utils.selector(el);
      const one = (sel: string) => q(sel)[0] as HTMLElement;
      const group = one("[data-zoom]");
      const portal = one("[data-portal]");
      const title = one("[data-title]");
      const oGlyph = one("[data-o-glyph]");
      const firstLetter = one("[data-first]");
      const base1 = one("[data-base1]");
      const base2 = one("[data-base2]");
      const guides = el.querySelector<SVGSVGElement>("[data-guides]")!;
      const compass = el.querySelector<SVGSVGElement>("[data-compass]")!;

      /* ---------------------------------------------------------- build */

      // Guides that leave on scroll get a <g data-go> wrapper: the scroll
      // moves the wrapper, the intro animates the shape, so neither overwrites
      // the other.
      const mk = <K extends keyof SVGElementTagNameMap>(parent: SVGSVGElement, tag: K, cls = "", go = "") => {
        const n = document.createElementNS(NS, tag);
        if (cls) n.setAttribute("class", cls);
        if (go) {
          const w = document.createElementNS(NS, "g");
          w.setAttribute("data-go", go);
          w.appendChild(n);
          parent.appendChild(w);
        } else parent.appendChild(n);
        return n;
      };
      guides.replaceChildren();
      compass.replaceChildren();
      const g = {
        cap: mk(guides, "line", `${s.rule} ${s.dash} ${s.creep}`, "up"),
        base1: mk(guides, "line", s.rule, "up2"),
        base2: mk(guides, "line", s.rule, "down"),
        margin: mk(guides, "line", `${s.rule} ${s.dash}`, "left"),
        capLabel: mk(guides, "text", `${s.label} ${s.desk}`, "fade"),
        baseLabel: mk(guides, "text", `${s.label} ${s.desk}`, "fade"),
        meas: mk(guides, "path", `${s.meas} ${s.desk}`, "fade"),
        measLabel: mk(guides, "text", `${s.measText} ${s.desk}`, "fade"),
        ticks: [0, 1, 2].map(() => mk(guides, "path", s.tick, "fade")),
        crops: ["tl", "tr", "bl", "br"].map((c) => mk(guides, "path", s.crop, c)),
        circle: mk(compass, "circle", s.circle),
        center: mk(compass, "path", s.center),
      };
      g.capLabel.textContent = "CAP HEIGHT";
      g.baseLabel.textContent = "BASELINE";

      const set = (n: Element, a: Record<string, string | number>) =>
        Object.entries(a).forEach(([k, v]) => n.setAttribute(k, String(v)));

      // the font's real cap height, from the rendered face
      const canvas = document.createElement("canvas").getContext("2d")!;
      const metrics = () => {
        const cs = getComputedStyle(title);
        canvas.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
        const H = canvas.measureText("H");
        const F = canvas.measureText("F");
        return { cap: H.actualBoundingBoxAscent, fBearing: -F.actualBoundingBoxLeft };
      };

      const layout = () => {
        const W = el.clientWidth;
        const Hh = el.clientHeight;
        const { cap, fBearing } = metrics();
        const b1 = local(base1, el).y;
        const b2 = local(base2, el).y;
        const cap1 = b1 - cap;
        const cap2 = b2 - cap;
        const gl = local(group, el);
        const left = local(firstLetter, el).x + fBearing;
        const right = gl.x + group.offsetWidth;

        set(guides, { viewBox: `0 0 ${W} ${Hh}`, width: W, height: Hh });
        set(g.cap, { x1: 0, x2: W, y1: cap1, y2: cap1 });
        set(g.base1, { x1: 0, x2: W, y1: b1, y2: b1 });
        set(g.base2, { x1: 0, x2: W, y1: b2, y2: b2 });
        set(g.margin, { x1: left, x2: left, y1: 0, y2: Hh });
        set(g.capLabel, { x: 18, y: cap1 - 7 });
        set(g.baseLabel, { x: 18, y: b1 - 7 });

        // the measured gap between line one's baseline and line two's cap
        const mx = right + 30;
        set(g.meas, { d: `M${mx - 6} ${b1}H${mx + 6}M${mx} ${b1}V${cap2}M${mx - 6} ${cap2}H${mx + 6}` });
        set(g.measLabel, { x: mx + 12, y: (b1 + cap2) / 2 + 4 });
        g.measLabel.textContent = String(Math.round(cap2 - b1));

        const plus = (x: number, y: number, k = 5) => `M${x - k} ${y}H${x + k}M${x} ${y - k}V${y + k}`;
        [cap1, b1, b2].forEach((y, i) => set(g.ticks[i], { d: plus(left, y) }));

        // crop marks framing the headline block
        // tight on narrow screens, where there's no measurement column and the
        // eyebrow/lede sit close; always kept inside the viewport
        const narrow = W < 900;
        const pad = narrow ? 12 : 40;
        const L = Math.max(8, left - pad);
        const R = Math.min(W - 8, right + pad + (narrow ? 0 : 36));
        const T = cap1 - pad;
        const B = b2 + pad;
        const k = narrow ? 12 : 18;
        set(g.crops[0], { d: `M${L} ${T + k}V${T}H${L + k}` });
        set(g.crops[1], { d: `M${R - k} ${T}H${R}V${T + k}` });
        set(g.crops[2], { d: `M${L} ${B - k}V${B}H${L + k}` });
        set(g.crops[3], { d: `M${R - k} ${B}H${R}V${B - k}` });

        // compass circle around the O, in the zoom group's own coordinates
        set(compass, { viewBox: `0 0 ${group.offsetWidth} ${group.offsetHeight}`, width: group.offsetWidth, height: group.offsetHeight });
        const og = local(oGlyph, group);
        const cx = og.x + oGlyph.offsetWidth / 2;
        const cy = local(base1, group).y - cap / 2;
        set(g.circle, { cx, cy, r: (cap / 2) * 1.34 });
        set(g.center, { d: plus(cx, cy, 6) });
      };

      layout();
      const ro = new ResizeObserver(() => layout());
      ro.observe(el);
      document.fonts?.ready.then(() => {
        layout();
        ScrollTrigger.refresh();
      });

      const mm = gsap.matchMedia();

      mm.add(MQ.motion, () => {
        /* ---------------------------------------------------------- intro */
        const split = SplitText.create(q("[data-split]"), { type: "chars" });
        const letters = Array.from(el.querySelectorAll<HTMLElement>("[data-o-glyph], [data-split] > *"));
        gsap.set(q("[data-hero-hide]"), { visibility: "visible" });

        gsap
          .timeline({ delay: 0.1 })
          .from(letters, { yPercent: 115, rotate: 8, duration: 1, ease: "expo.out", stagger: 0.026 })
          .from([g.cap, g.base1, g.base2], { scaleX: 0, transformOrigin: "0% 50%", duration: 0.85, ease: "power3.inOut", stagger: 0.08 }, 0.3)
          .from(g.margin, { scaleY: 0, transformOrigin: "50% 0%", duration: 0.9, ease: "power3.inOut" }, 0.35)
          .from(g.circle, { drawSVG: "0%", duration: 0.9, ease: "power2.inOut" }, 0.7)
          .from(g.center, { scale: 0, transformOrigin: "50% 50%", duration: 0.3, ease: "back.out(3)" }, 1.5)
          .from(portal, { scale: 0, autoAlpha: 0, duration: 0.6, ease: "back.out(1.8)" }, 1.25)
          .from(g.ticks, { scale: 0, transformOrigin: "50% 50%", duration: 0.25, ease: "back.out(3)", stagger: 0.05 }, 1.0)
          .from(g.meas, { scaleY: 0, transformOrigin: "50% 50%", duration: 0.45, ease: "power3.out" }, 0.95)
          .from([g.capLabel, g.baseLabel, g.measLabel], { autoAlpha: 0, x: -6, duration: 0.4, stagger: 0.06 }, 1.05)
          .from(g.crops, { scale: 0, transformOrigin: "50% 50%", duration: 0.28, ease: "back.out(2.5)", stagger: 0.04 }, 1.15)
          .from(q("[data-fade]"), { y: 16, autoAlpha: 0, duration: 0.6, ease: "power2.out", stagger: 0.07 }, 0.55);

        /* ---------------------------------------------------------- crosshair */
        // a ruler crosshair follows a real pointer, with an x/y readout
        // measured from the margin guide
        const hoverable = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
        const cross = one("[data-cross]");
        const chH = one("[data-ch-h]");
        const chV = one("[data-ch-v]");
        const read = one("[data-ch-read]");
        let zooming = false;
        const hx = gsap.quickTo(chV, "x", { duration: 0.18, ease: "power3" });
        const hy = gsap.quickTo(chH, "y", { duration: 0.18, ease: "power3" });
        const rx = gsap.quickTo(read, "x", { duration: 0.18, ease: "power3" });
        const ry = gsap.quickTo(read, "y", { duration: 0.18, ease: "power3" });
        const onMove = (e: PointerEvent) => {
          const b = el.getBoundingClientRect();
          const x = e.clientX - b.left;
          const y = e.clientY - b.top;
          hx(x);
          hy(y);
          rx(x + 10);
          ry(y + 10);
          read.textContent = `x ${Math.round(x - Number(g.margin.getAttribute("x1")))}  y ${Math.round(y)}`;
        };
        const onEnter = () => {
          if (!zooming) gsap.to(cross, { autoAlpha: 1, duration: 0.3 });
        };
        const onLeave = () => gsap.to(cross, { autoAlpha: 0, duration: 0.3 });
        if (hoverable) {
          el.addEventListener("pointermove", onMove);
          el.addEventListener("pointerenter", onEnter);
          el.addEventListener("pointerleave", onLeave);
        }

        /* ---------------------------------------------------------- zoom */
        let Z = { tx: 0, ty: 0, S: 1 };
        const measure = () => {
          const p = local(portal, group);
          const gg = local(group, el);
          const a = portal.offsetWidth / 2;
          const b = portal.offsetHeight / 2;
          const vw = el.clientWidth;
          const vh = window.innerHeight;
          const ox = p.x + a;
          const oy = p.y + b;
          Z = {
            tx: vw / 2 - (gg.x + ox),
            ty: vh / 2 - (gg.y + oy),
            // smallest scale at which the lime oval contains the viewport
            S: Math.sqrt((vw / 2 / a) ** 2 + (vh / 2 / b) ** 2) * 1.2,
          };
          gsap.set(group, { transformOrigin: `${ox}px ${oy}px` });
        };

        const zoomEase = gsap.parseEase("power2.in");
        const panEase = gsap.parseEase("power2.inOut");
        const letGo = gsap.parseEase("power2.in");
        const state = { p: 0 };
        const fades = q("[data-fade], [data-out]");
        const flood = one("[data-flood]");
        const moving = Array.from(guides.querySelectorAll<SVGGElement>("g[data-go]"));
        const apply = () => {
          const p = state.p;
          const was = zooming;
          zooming = p > 0.01;
          if (zooming && !was) gsap.to(cross, { autoAlpha: 0, duration: 0.2 });

          // the construction lets go: rules slide away, marks fly to the corners
          const l = letGo(gsap.utils.clamp(0, 1, (p - 0.06) / 0.28));
          const f = gsap.utils.clamp(0, 1, (p - 0.02) / 0.1);
          const D = 220 * l;
          moving.forEach((n) => {
            const go = n.getAttribute("data-go");
            const v =
              go === "up" ? { y: -D } :
              go === "up2" ? { y: -D * 0.5 } :
              go === "down" ? { y: D } :
              go === "left" ? { x: -D } :
              go === "tl" ? { x: -D, y: -D } :
              go === "tr" ? { x: D, y: -D } :
              go === "bl" ? { x: -D, y: D } :
              go === "br" ? { x: D, y: D } : {};
            gsap.set(n, { ...v, autoAlpha: go === "fade" ? 1 - f : 1 - l });
          });

          const z = gsap.utils.clamp(0, 1, (p - 0.06) / 0.94);
          gsap.set(group, {
            x: Z.tx * panEase(z),
            y: Z.ty * panEase(z),
            // exponential, so the zoom reads as constant speed rather than a lurch
            scale: Math.pow(Z.S, zoomEase(z)),
            // 2D so the type is re-rasterised at each scale and stays sharp
            force3D: false,
          });
          gsap.set(flood, { autoAlpha: gsap.utils.clamp(0, 1, (p - 0.93) / 0.06) });
          gsap.set(fades, { autoAlpha: 1 - gsap.utils.clamp(0, 1, p / 0.14) });
        };

        measure();
        gsap.to(state, {
          p: 1,
          ease: "none",
          onUpdate: apply,
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: "+=140%",
            pin: true,
            scrub: 0.6,
            onRefresh: () => {
              layout();
              measure();
              apply();
            },
          },
        });

        return () => {
          split.revert();
          el.removeEventListener("pointermove", onMove);
          el.removeEventListener("pointerenter", onEnter);
          el.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => ro.disconnect();
    },
    { scope: root },
  );

  return (
    <section ref={root} className={s.hero} aria-labelledby="svc-hero-title" style={{ "--first": first } as React.CSSProperties}>
      <svg data-guides className={s.guides} aria-hidden="true" />

      <div data-cross className={s.cross} aria-hidden="true">
        <i data-ch-h className={s.chH} />
        <i data-ch-v className={s.chV} />
        <span data-ch-read className={s.chRead} />
      </div>

      <div className={s.copy}>
        <p data-fade className={s.eyebrow}>
          <span>Ankora Labs</span>
          <i />
          <span>Services</span>
        </p>

        <h1 id="svc-hero-title" data-title className={s.title} data-hero-hide>
          <span data-zoom className={s.zoom}>
            <svg data-compass className={s.compass} aria-hidden="true" />
            <span className={s.line}>
              <span className={s.mask}>
                <span data-split data-first>F</span>
                <span className={s.o}>
                  <span data-o-glyph className={s.oGlyph}>O</span>
                  <span data-portal className={s.portal} aria-hidden="true" />
                </span>
                <span data-split>UR</span>
              </span>{" "}
              <span className={s.mask}>
                <span data-split>crafts.</span>
                <span data-base1 className={s.base} aria-hidden="true" />
              </span>
            </span>
            <span className={s.line}>
              <span className={s.mask}>
                <span data-split>One</span>
              </span>{" "}
              <span className={`${s.mask} ${s.team}`}>
                <span data-split>team.</span>
                <span data-base2 className={s.base} aria-hidden="true" />
              </span>
            </span>
          </span>
        </h1>

        <p data-fade className={s.lede}>
          Design, engineering, mobile and AI under one roof, so your product goes from idea to launch without the
          hand-offs.
        </p>

        <ul data-fade className={s.links} aria-label="Our services">
          {SERVICES.map((svc) => (
            <li key={svc.slug}>
              <a href={`#${svc.slug}`} style={{ "--c": svc.theme.ground } as React.CSSProperties}>
                <i />
                {svc.title}
              </a>
            </li>
          ))}
        </ul>
      </div>

      <div data-flood className={s.flood} aria-hidden="true" />

      <div data-out className={s.cue} aria-hidden="true">
        <i />
      </div>
    </section>
  );
}
