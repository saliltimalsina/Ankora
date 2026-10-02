import type { ReactNode } from "react";
import s from "./section-head.module.css";

// The kicker + big uppercase heading that opens most sections ("WAYS TO WORK
// WITH US / Start small, or go all in."). Put the serif part in <em>. Layout
// (width, margins, alignment) stays with the section via `className`;
// `data-head` is what the sections' GSAP intros animate.
export default function SectionHead({
  id,
  kicker,
  children,
  className,
  after,
}: {
  id: string;
  kicker: string;
  children: ReactNode;
  className?: string;
  /** extra content under the heading, e.g. a lede paragraph */
  after?: ReactNode;
}) {
  return (
    <div className={className} data-head>
      <p className={s.kicker}>{kicker}</p>
      <h2 id={id} className={s.h2}>
        {children}
      </h2>
      {after}
    </div>
  );
}
