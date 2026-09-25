"use client";

import { useEffect, useRef } from "react";
import { ScrollTrigger } from "../../lib/gsap";
import { mountShowcase } from "./engine";
import "./showcase.css";

// The homepage's work showcase, mounted into a React-owned element. React
// renders an empty div and never touches its children again; the engine owns
// everything inside it (markup, sticky pin, scroll-driven folder switching).
export default function WorkShowcase() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    mountShowcase(ref.current);
    // the stage sets its own (tall) height once built; re-measure every GSAP
    // trigger below it
    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, []);

  return <div ref={ref} id="show-stage" className="shw" />;
}
