"use client";

import type { ScrollTrigger } from "gsap/ScrollTrigger";

// The chapters live in a horizontally pinned track on desktop, so a plain
// #anchor jump lands on the section top instead of the right chapter. Chapters
// registers its pin trigger here; anything that wants to jump to a service
// (index rows, nav hash links) goes through scrollToService().

let pin: ScrollTrigger | null = null;
let count = 1;

export function registerChapterPin(st: ScrollTrigger | null, n = 1) {
  pin = st;
  count = n;
}

export function scrollToService(slug: string, index: number) {
  if (pin && count > 1) {
    const y = pin.start + (pin.end - pin.start) * (index / (count - 1));
    window.scrollTo({ top: y + 1, behavior: "smooth" });
    return true;
  }
  const el = document.getElementById(slug);
  if (!el) return false;
  el.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}
