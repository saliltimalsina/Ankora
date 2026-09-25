"use client";

// What a chapter needs from its scene: play it from the top, pause it when
// the chapter isn't current, and clean up.
export type SceneCtl = {
  play: () => void;
  pause: () => void;
  kill: () => void;
};

// Offset of `node` inside `root` from layout offsets, so the horizontal
// track's transform (and the scene's own 3D tilt) never skew measurements.
export function local(node: HTMLElement, root: HTMLElement) {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = node;
  while (n && n !== root) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x, y, w: node.offsetWidth, h: node.offsetHeight };
}

export const canHover = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
