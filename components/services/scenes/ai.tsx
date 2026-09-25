"use client";

import { gsap, SplitText } from "../../../lib/gsap";
import { canHover, local, type SceneCtl } from "./util";
import s from "./ai.module.css";

// AI: what Answer Service does. A call comes in, the caller's words become a
// live transcript, the phrases that matter light up and fly into a ticket,
// and a reply is drafted for a person to approve. Ticket details are
// illustrative.

const BARS = 44;
const FIELDS = [
  { key: "intent", label: "Intent", value: "Refund" },
  { key: "ref", label: "About", value: "Booking" },
  { key: "urgency", label: "Urgency", value: "High" },
];

export function AiScene() {
  return (
    <div className={s.scene} data-scene="ai">
      <div className={s.call}>
        <div className={s.callHead}>
          <span className={s.live}>
            <i data-live /> Live call
          </span>
          <span className={s.timer}>Answer Service</span>
        </div>
        <div data-wave className={s.wave} aria-hidden="true">
          {Array.from({ length: BARS }, (_, i) => (
            <i key={i} style={{ transform: `scaleY(${(0.12 + 0.5 * Math.abs(Math.sin(i * 0.9)) * Math.abs(Math.sin(i * 0.23))).toFixed(3)})` }} />
          ))}
        </div>
        <p data-transcript className={s.transcript}>
          “Hi, I was <mark data-k="intent">charged twice</mark> for <mark data-k="ref">my booking</mark> yesterday. Can someone
          sort it out <mark data-k="urgency">today</mark>?”
        </p>
      </div>

      <div data-ticket className={s.ticket}>
        <div className={s.tHead}>
          <b>Ticket #4471</b>
          <span>New</span>
        </div>
        {FIELDS.map((f) => (
          <div key={f.key} className={s.field}>
            <span>{f.label}</span>
            <b data-value={f.key}>{f.value}</b>
          </div>
        ))}
        <div className={s.field}>
          <span>Route</span>
          <b data-value="route">Support</b>
        </div>
        <div data-draft className={s.draft}>
          <svg viewBox="0 0 16 16" aria-hidden="true">
            <path data-tick d="M3 8.5 6.5 12 13 4.5" />
          </svg>
          Reply drafted, waiting for approval
        </div>
      </div>
    </div>
  );
}

export function buildAi(el: HTMLElement): SceneCtl {
  const one = <T extends Element = HTMLElement>(sel: string) => el.querySelector(sel) as unknown as T;
  const bars = Array.from(el.querySelectorAll<HTMLElement>("[data-wave] i"));
  const marks = Array.from(el.querySelectorAll<HTMLElement>("mark[data-k]"));
  const split = SplitText.create(one("[data-transcript]"), { type: "words" });

  // The voice, drawn like a voice-memo recording: a new bar enters on the
  // right about nine times a second and the history slides left. Heights
  // follow a speech rhythm (syllables grouped into words with short pauses),
  // scaled by `amp`, which drops to a near-flat line when the caller stops.
  const voice = { amp: 1 };
  const STEP = 0.11; // seconds per new bar
  const heights = bars.map(() => 0.06);
  let clock = 0;
  let acc = 0;
  let word = 0; // time left in the current word (or pause, if negative)
  const sample = () => {
    word -= STEP;
    if (word < -gsap.utils.random(0.12, 0.3)) word = gsap.utils.random(0.45, 1.1); // next word
    const speaking = word > 0;
    const syllable = Math.abs(Math.sin(clock * Math.PI * 4.2)); // ~4 syllables/s
    const level = speaking ? 0.25 + 0.75 * syllable * gsap.utils.random(0.7, 1) : 0.05;
    return Math.max(0.06, level * voice.amp);
  };
  const render = () => {
    bars.forEach((b, i) => {
      // older bars (left) fade, the newest one is the accent
      gsap.to(b, { scaleY: heights[i], duration: STEP * 1.6, ease: "sine.out", overwrite: true });
      b.style.opacity = String(0.25 + 0.75 * (i / (bars.length - 1)));
    });
  };
  const tick = (_t: number, dt: number) => {
    acc += dt / 1000;
    while (acc >= STEP) {
      acc -= STEP;
      clock += STEP;
      heights.shift();
      heights.push(sample());
    }
    render();
  };
  let listening = false;
  const listen = (on: boolean) => {
    if (on === listening) return;
    listening = on;
    if (on) gsap.ticker.add(tick);
    else gsap.ticker.remove(tick);
  };
  gsap.set(bars, { transformOrigin: "50% 50%" });

  // chips that fly from the transcript into the ticket
  const chips = marks.map((m) => {
    const c = document.createElement("span");
    c.className = s.chip;
    c.textContent = m.textContent;
    c.setAttribute("aria-hidden", "true");
    el.appendChild(c);
    return c;
  });

  const tl = gsap.timeline({ paused: true });
  tl.set(split.words, { autoAlpha: 0.12 }, 0)
    .set(marks, { backgroundSize: "0% 100%" }, 0)
    .set(el.querySelectorAll("[data-value]"), { autoAlpha: 0, y: 6 }, 0)
    .set(one("[data-draft]"), { autoAlpha: 0 }, 0)
    .set(one("[data-tick]"), { drawSVG: "0%" }, 0)
    .set(chips, { autoAlpha: 0 }, 0)
    .call(() => {
      voice.amp = 1;
      listen(true);
    }, [], 0);

  // the words arrive as they're spoken
  tl.to(split.words, { autoAlpha: 1, duration: 0.18, stagger: 0.09, ease: "none" }, 0.25);
  marks.forEach((m) => {
    const first = split.words.findIndex((w) => m.contains(w));
    tl.to(m, { backgroundSize: "100% 100%", duration: 0.35, ease: "power2.out" }, 0.25 + first * 0.09 + 0.2);
  });

  // the phrases lift out and file themselves into the ticket
  const fly = 0.25 + split.words.length * 0.09 + 0.35;
  tl.call(() => {
    marks.forEach((m, i) => {
      const from = local(m, el);
      const to = local(one(`[data-value="${m.dataset.k}"]`), el);
      gsap.set(chips[i], { x: from.x, y: from.y, autoAlpha: 0 });
      chips[i].dataset.tx = String(to.x);
      chips[i].dataset.ty = String(to.y);
    });
  }, [], fly - 0.01);
  chips.forEach((c, i) => {
    const key = marks[i].dataset.k;
    tl.to(c, { autoAlpha: 1, scale: 1.08, duration: 0.15 }, fly + i * 0.22)
      .to(c, { x: () => Number(c.dataset.tx), y: () => Number(c.dataset.ty), scale: 1, duration: 0.6, ease: "power3.inOut" }, fly + i * 0.22 + 0.1)
      .to(c, { autoAlpha: 0, duration: 0.15 }, fly + i * 0.22 + 0.68)
      .to(one(`[data-value="${key}"]`), { autoAlpha: 1, y: 0, duration: 0.3, ease: "power2.out" }, fly + i * 0.22 + 0.65);
  });
  const end = fly + chips.length * 0.22 + 0.8;
  tl.to(one(`[data-value="route"]`), { autoAlpha: 1, y: 0, duration: 0.3 }, end)
    .to(one("[data-draft]"), { autoAlpha: 1, duration: 0.3 }, end + 0.25)
    .to(one("[data-tick]"), { drawSVG: "100%", duration: 0.35, ease: "power2.out" }, end + 0.3)
    // the caller has finished: the voice settles to a murmur
    .to(voice, { amp: 0.08, duration: 0.8 }, end);

  // hover: the voice follows the pointer's height; clicking the ticket replays
  const hover = canHover();
  const move = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    // only while the caller is talking; afterwards the line stays calm
    if (tl.isActive()) voice.amp = gsap.utils.clamp(0.4, 1.1, 1.3 - (e.clientY - r.top) / r.height);
  };
  const ticket = one("[data-ticket]");
  const replay = () => tl.restart();
  if (hover) el.addEventListener("pointermove", move);
  ticket.addEventListener("click", replay);

  return {
    play: () => tl.restart(),
    pause: () => {
      tl.pause();
      listen(false);
    },
    kill: () => {
      tl.kill();
      listen(false);
      chips.forEach((c) => c.remove());
      split.revert();
      el.removeEventListener("pointermove", move);
      ticket.removeEventListener("click", replay);
    },
  };
}
