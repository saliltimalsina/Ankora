"use client";

import { useEffect, useState } from "react";
import { SITE } from "../../lib/site";

// Small live pieces of the /contact hero, kept out of the server-rendered part.

/** The time in Kathmandu, set after mount (the page is prerendered). */
export function KtmClock() {
  const [t, setT] = useState("");
  useEffect(() => {
    const fmt = new Intl.DateTimeFormat("en", { timeZone: "Asia/Kathmandu", hour: "numeric", minute: "2-digit" });
    const tick = () => setT(fmt.format(new Date()).toLowerCase());
    tick();
    const id = window.setInterval(tick, 20_000);
    return () => window.clearInterval(id);
  }, []);
  return (
    <p className="ct-clock">
      <i aria-hidden="true" />
      {t ? <>It’s {t} in Kathmandu</> : "Kathmandu, Nepal"}
      <span> · we reply within 24 hours</span>
    </p>
  );
}

/** "Copy" next to the big email address. */
export function CopyEmail() {
  const [done, setDone] = useState(false);
  useEffect(() => {
    if (!done) return;
    const id = window.setTimeout(() => setDone(false), 1800);
    return () => window.clearTimeout(id);
  }, [done]);
  return (
    <button
      type="button"
      className="ct-copy"
      data-done={done || undefined}
      onClick={() => navigator.clipboard?.writeText(SITE.email).then(() => setDone(true), () => {})}
    >
      <span aria-live="polite">{done ? "Copied" : "Copy"}</span>
    </button>
  );
}
