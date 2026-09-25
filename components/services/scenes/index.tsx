"use client";

import type { SceneKind } from "../../../lib/services";
import { AiScene, buildAi } from "./ai";
import { buildDesign, DesignScene } from "./design";
import { buildEngineering, EngineeringScene } from "./engineering";
import { buildMobile, MobileScene } from "./mobile";
import type { SceneCtl } from "./util";

export type { SceneCtl };

export function Scene({ kind }: { kind: SceneKind }) {
  if (kind === "design") return <DesignScene />;
  if (kind === "engineering") return <EngineeringScene />;
  if (kind === "mobile") return <MobileScene />;
  return <AiScene />;
}

const BUILDERS: Record<SceneKind, (el: HTMLElement) => SceneCtl> = {
  design: buildDesign,
  engineering: buildEngineering,
  mobile: buildMobile,
  ai: buildAi,
};

export function buildScene(el: HTMLElement): SceneCtl {
  return BUILDERS[el.dataset.scene as SceneKind](el);
}
