"use client";

import { useRef } from "react";
import { gsap, MQ, ScrollTrigger, useGSAP } from "../../lib/gsap";
import { SERVICES } from "../../lib/services";
import { registerChapterPin, scrollToService } from "../../lib/service-scroll";
import { buildScene, Scene, type SceneCtl } from "./scenes";
import s from "./chapters.module.css";

// One chapter per service.
//   desktop: the section pins and the track slides sideways; the ground/ink/
//            accent colours blend from one service into the next as you go.
//   mobile:  plain stacked chapters, each on its own colour, revealed in turn.
// Each chapter has an animated scene built from that client's real work
// (see ./scenes). A scene plays from the top whenever its chapter becomes
// current and pauses when it leaves, so off-screen loops cost nothing.

const N = SERVICES.length;
const first = SERVICES[0].theme;

type Vars = React.CSSProperties & Record<`--${string}`, string>;

export default function Chapters() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const q = gsap.utils.selector(root);
      const chapters = q("[data-chapter]") as HTMLElement[];
      const mm = gsap.matchMedia();

      // Copy reveal for one chapter: headline lines rise, the rest follows.
      const reveal = (ch: HTMLElement) =>
        gsap
          .timeline({ paused: true })
          .from(ch.querySelectorAll("[data-line]"), { yPercent: 110, duration: 1, ease: "expo.out", stagger: 0.08 })
          .from(ch.querySelectorAll("[data-reveal]"), { y: 24, autoAlpha: 0, duration: 0.7, ease: "power3.out", stagger: 0.08 }, 0.2)
          .from(ch.querySelectorAll("[data-deliv]"), { x: -20, autoAlpha: 0, duration: 0.5, ease: "power2.out", stagger: 0.06 }, 0.35);

      // scenes are built per layout and killed with it
      const built: SceneCtl[] = [];
      const sceneOf = (ch: HTMLElement) => {
        const c = buildScene(ch.querySelector("[data-scene]") as HTMLElement);
        built.push(c);
        return c;
      };
      const killScenes = () => built.splice(0).forEach((c) => c.kill());

      mm.add(MQ.desktop, () => {
        const pin = q("[data-pin]")[0] as HTMLElement;
        const track = q("[data-track]")[0] as HTMLElement;
        const dots = q("[data-dot]");
        const fill = q("[data-progress-fill]")[0];
        // not track.scrollWidth: the outline numerals overflow the last chapter
        const dist = () => pin.clientWidth * (N - 1);

        // Colour blends happen in the middle 40% of each hand-off, padded to
        // N-1 so its progress maps 1:1 onto the track's.
        const colors = gsap.timeline({ paused: true });
        SERVICES.forEach((svc, i) => {
          if (!i) return;
          colors.to(
            root.current,
            { "--ground": svc.theme.ground, "--ink": svc.theme.ink, "--accent": svc.theme.accent, duration: 0.4, ease: "none" },
            i - 1 + 0.3,
          );
        });
        colors.set({}, {}, N - 1);

        // Chapter state is derived from the track's own progress rather than
        // per-chapter enter/leave triggers: a deep link or a fast jump can
        // skip straight past a trigger's range, but it can't skip this.
        const copies = chapters.map(reveal);
        const scenes = chapters.map(sceneOf);
        let active = 0;
        let inView = false;

        const scroll = gsap.to(track, {
          x: () => -dist(),
          ease: "none",
          // fires once during creation too, before `scroll` is assigned, hence `this`
          onUpdate: function (this: gsap.core.Tween) {
            const p = this.progress();
            const pos = p * (N - 1);
            colors.progress(p);
            gsap.set(fill, { scaleX: p });
            // reveal a chapter's copy once about a third of it has slid in
            copies.forEach((c, i) => pos > i - 0.66 && c.play());
            const idx = Math.round(pos);
            if (idx !== active) {
              scenes[active].pause();
              active = idx;
              if (inView) scenes[idx].play();
              dots.forEach((d, i) => d.classList.toggle(s.on, i === idx));
            }
          },
          scrollTrigger: {
            trigger: root.current,
            pin,
            start: "top top",
            end: () => `+=${dist()}`,
            scrub: 0.8,
            invalidateOnRefresh: true,
            snap: {
              snapTo: 1 / (N - 1),
              duration: { min: 0.25, max: 0.7 },
              delay: 0.08,
              ease: "power2.inOut",
              // one chapter per gesture: a hard flick shouldn't fly past three of them
              inertia: false,
            },
          },
        });
        registerChapterPin(scroll.scrollTrigger!, N);

        // Whole-section visibility: start the current scene as the section
        // arrives (the first chapter plays before the pin engages), stop it
        // once the section is gone.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top 55%",
          end: "bottom 45%",
          onToggle: (self) => {
            inView = self.isActive;
            if (inView) {
              copies[active].play();
              scenes[active].play();
            } else scenes[active].pause();
          },
        });

        chapters.forEach((ch, i) => {
          if (!i) return;
          // the big outline numeral drifts slower than the chapter it sits in
          gsap.fromTo(
            ch.querySelector("[data-bign]"),
            { xPercent: 40 },
            {
              xPercent: -30,
              ease: "none",
              scrollTrigger: { trigger: ch, containerAnimation: scroll, start: "left right", end: "right left", scrub: true },
            },
          );
        });

        return () => {
          registerChapterPin(null);
          killScenes();
        };
      });

      mm.add(MQ.mobile, () => {
        chapters.forEach((ch) => {
          const copy = reveal(ch);
          const scene = sceneOf(ch);
          ScrollTrigger.create({ trigger: ch, start: "top 70%", once: true, onEnter: () => copy.play() });
          ScrollTrigger.create({
            trigger: ch.querySelector("[data-scene]"),
            start: "top 85%",
            end: "bottom 15%",
            onEnter: () => scene.play(),
            onEnterBack: () => scene.play(),
            onLeave: () => scene.pause(),
            onLeaveBack: () => scene.pause(),
          });
        });
        return killScenes;
      });

      // Deep links (/services#mobile, nav mega-menu) land on the right chapter
      // once the pin has measured itself.
      const jump = () => {
        const i = SERVICES.findIndex((svc) => `#${svc.slug}` === location.hash);
        if (i >= 0) scrollToService(SERVICES[i].slug, i);
      };
      const t = window.setTimeout(jump, 350);
      window.addEventListener("hashchange", jump);
      return () => {
        window.clearTimeout(t);
        window.removeEventListener("hashchange", jump);
      };
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      className={s.chapters}
      aria-label="Services in detail"
      style={{ "--ground": first.ground, "--ink": first.ink, "--accent": first.accent } as Vars}
    >
      <div data-pin className={s.pin}>
        <div data-track className={s.track} style={{ "--count": String(N) } as Vars}>
          {SERVICES.map((svc) => (
            <article
              key={svc.slug}
              id={svc.slug}
              data-chapter
              className={s.chapter}
              aria-labelledby={`${svc.slug}-title`}
              style={{ "--cg": svc.theme.ground, "--ci": svc.theme.ink, "--ca": svc.theme.accent } as Vars}
            >
              <span data-bign className={s.bign} aria-hidden="true">
                {svc.n}
              </span>

              <div className={s.copy}>
                <p data-reveal className={s.eyebrow}>
                  <b>{svc.n}</b>
                  <span>{svc.title}</span>
                </p>
                <h2 id={`${svc.slug}-title`} className={s.h2}>
                  {svc.headline.map((line) => (
                    <span key={line} className={s.l}>
                      <span data-line>{line}</span>
                    </span>
                  ))}
                </h2>
                <p data-reveal className={s.blurb}>
                  {svc.blurb}
                </p>
                <ul className={s.deliv}>
                  {svc.deliverables.map((d) => (
                    <li data-deliv key={d}>
                      {d}
                    </li>
                  ))}
                </ul>
                <div data-reveal className={s.foot}>
                  <a className={s.cta} href="/contact">
                    {svc.cta}
                    <span aria-hidden="true">→</span>
                  </a>
                  <p className={s.stack}>
                    <b>Tools</b> {svc.stack.join(", ")}
                  </p>
                </div>
              </div>

              <figure className={s.stage}>
                <Scene kind={svc.scene} />
                <figcaption data-caption className={s.caption}>
                  <b>Founding team project</b>
                  <span>
                    {svc.client.name} · {svc.client.kind}
                  </span>
                </figcaption>
              </figure>
            </article>
          ))}
        </div>

        <nav className={s.progress} aria-label="Service chapters">
          <span className={s.progressTrack}>
            <span data-progress-fill className={s.progressFill} />
          </span>
          {SERVICES.map((svc, i) => (
            <a
              key={svc.slug}
              data-dot
              href={`#${svc.slug}`}
              className={`${s.dot} ${i === 0 ? s.on : ""}`}
              onClick={(e) => {
                if (scrollToService(svc.slug, i)) {
                  e.preventDefault();
                  history.replaceState(null, "", `#${svc.slug}`);
                }
              }}
            >
              <b>{svc.n}</b> {svc.title}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
