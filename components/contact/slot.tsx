"use client";

import { useEffect, useState } from "react";
import { SITE } from "../../lib/site";

type CalNs = (action: string, opts: Record<string, unknown>) => void;
declare global {
  interface Window {
    Cal?: { ns?: Record<string, CalNs> };
  }
}

// "Grab a slot right now": the Cal.com calendar inline. The loader comes from
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
    <section className="gs" aria-labelledby="gs-title">
      <div className="gs-in">
        <div className="gs-head">
          <p className="gn-kick">Already sure?</p>
          <h2 id="gs-title" className="gn-h2">
            Grab a slot <em>right now.</em>
          </h2>
          <p className="gs-sub">Times show in your timezone, and the meeting link lands in your inbox.</p>
        </div>
        <div className="gs-frame">
          <span className="gs-tape" aria-hidden="true" />
          <div className="gs-stage">
            {!ready && (
              <p className="gs-wait">
                <span className="gs-spin" aria-hidden="true" />
                <span>Loading the calendar…</span>
                <span className="gs-or">Not showing up? A browser extension may be blocking it.</span>
                <a className="gs-fallback" href={SITE.calUrl} target="_blank" rel="noopener">
                  Open the booking page →
                </a>
              </p>
            )}
            <div id="cal-inline" className="gs-cal" />
          </div>
        </div>
      </div>
    </section>
  );
}
