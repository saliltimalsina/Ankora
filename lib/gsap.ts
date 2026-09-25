"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/Draggable";
import { InertiaPlugin } from "gsap/InertiaPlugin";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

// One place to register plugins, so every client component imports GSAP from
// here and never has to remember which plugins are already on.
gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, Draggable, InertiaPlugin, CustomEase, useGSAP);

// Shared media queries for gsap.matchMedia(). Reduced motion always wins: those
// visitors get the static layout, which is also the server-rendered markup.
export const MQ = {
  desktop: "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
  mobile: "(max-width: 1023px) and (prefers-reduced-motion: no-preference)",
  hover: "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
  motion: "(prefers-reduced-motion: no-preference)",
};

export { gsap, ScrollTrigger, SplitText, DrawSVGPlugin, Draggable, CustomEase, useGSAP };
