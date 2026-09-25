"use client";

import { useEffect } from "react";

// The footer plants grow in when the footer scrolls into view, then sway.
// Same behaviour as the snapshot's ankora-footer-js, minus the re-injection
// retries it needed to survive hydration.
export default function FooterPlants() {
  useEffect(() => {
    const el = document.querySelector<HTMLElement>("#main-footer .afoot-plants");
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let longest = 0;
    el.querySelectorAll<SVGElement>(".aplant").forEach((p) => {
      longest = Math.max(longest, parseFloat(getComputedStyle(p).getPropertyValue("--gd")) || 0);
    });

    el.classList.add("will-grow");
    let sway = 0;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        el.classList.add("is-in");
        sway = window.setTimeout(() => el.classList.add("is-sway"), (longest + 0.85) * 1000 + 1500);
      },
      { threshold: 0.25 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      window.clearTimeout(sway);
    };
  }, []);
  return null;
}
