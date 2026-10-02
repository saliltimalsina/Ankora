"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import "../kit/showcase.css";

declare global {
  interface Window {
    AnkoraShowcase?: { mount: (el: HTMLElement) => void };
  }
}

const SRC = "/kit/showcase.js";

// The work showcase, the same engine the homepage runs (public/kit/showcase.js).
// React renders an empty div and never touches its children again; the engine
// owns everything inside it (markup, sticky pin, scroll-driven folder switching).
export default function WorkShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mount = () => {
      window.AnkoraShowcase?.mount(el);
      // the stage sets its own (tall) height once built; re-measure every GSAP
      // trigger below it
      requestAnimationFrame(() => ScrollTrigger.refresh());
    };
    if (window.AnkoraShowcase) return mount();
    let tag = document.querySelector<HTMLScriptElement>(`script[src="${SRC}"]`);
    if (!tag) {
      tag = document.createElement("script");
      tag.src = SRC;
      document.body.appendChild(tag);
    }
    tag.addEventListener("load", mount, { once: true });
  }, []);

  return <div ref={ref} id="show-stage" className="shw" />;
}
