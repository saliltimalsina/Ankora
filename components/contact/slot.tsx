"use client";

import { useEffect, useState } from "react";
import { SITE } from "../../lib/site";

type CalNs = (action: string, opts: Record<string, unknown>) => void;
declare global {
  interface Window {
    Cal?: { ns?: Record<string, CalNs> };
  }
}

// The Cal.com calendar inline, in the "Rather talk?" section. ./talk.tsx
// mounts it as the section nears the viewport, so the page doesn't load Cal's
// iframe for people who never scroll that far. The loader comes from
// public/kit/site.js; until Cal reports the calendar ready, a message with a
// direct booking link sits behind it (and stays if an extension blocks Cal).
export default function Slot() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let tries = 0;
    const id = window.setInterval(() => {
      const cal = window.Cal?.ns?.[SITE.calNamespace];
      if (!cal && ++tries < 50) return;
      window.clearInterval(id);
      if (!cal) return;
      cal("on", { action: "linkReady", callback: () => setReady(true) });
      cal("inline", {
        elementOrSelector: "#cal-inline",
        calLink: SITE.calLink,
        layout: "month_view",
        config: { layout: "month_view", theme: "light" },
      });
    }, 100);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="ct-cal">
      {!ready && (
        <p className="ct-cal-wait">
          <span className="ct-spin" aria-hidden="true" />
          <span>Loading the calendar…</span>
          <span className="ct-cal-or">Not showing up? A browser extension may be blocking it.</span>
          <a className="ct-cal-fallback" href={SITE.calUrl} target="_blank" rel="noopener">
            Open the booking page →
          </a>
        </p>
      )}
      <div id="cal-inline" className="ct-cal-in" />
    </div>
  );
}
