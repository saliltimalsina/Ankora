"use client";

import { useEffect } from "react";
import { ScrollTrigger } from "../../lib/gsap";

// Pins measure text height. Web fonts landing after the first measure shift
// everything below them, so re-measure once fonts and images are in.
export default function ScrollRefresh() {
  useEffect(() => {
    let alive = true;
    const refresh = () => alive && ScrollTrigger.refresh();
    document.fonts?.ready.then(refresh);
    window.addEventListener("load", refresh);
    return () => {
      alive = false;
      window.removeEventListener("load", refresh);
    };
  }, []);
  return null;
}
