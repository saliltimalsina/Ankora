"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, waLink } from "../../lib/site";
import Slot from "./slot";

// (03) on /contact, "Rather talk?": WhatsApp as a wide strip (with a QR code
// on desktop), then the Cal.com calendar inline at full width, which is the
// width Cal needs for its three-column layout. The calendar mounts as the section nears the
// viewport, so people who never scroll this far don't load Cal's iframe. The
// QR code (desktop only) opens the same chat as waLink() with SITE.waHello;
// if either changes, regenerate public/images/contact-v3/whatsapp-qr.svg.

export default function Talk() {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (location.hash === "#call") return setNear(true);
    const io = new IntersectionObserver(([e]) => e.isIntersecting && setNear(true), { rootMargin: "600px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <section className="ct-talk" id="call" aria-labelledby="ct-talk-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (03)
            </p>
            <h2 id="ct-talk-h" className="dk-h2">
              Rather talk?
            </h2>
          </div>
          <p>Same people, same 24-hour promise. Pick a time for a call, or message us right now.</p>
        </div>

        <div className="ct-talk-grid">
          <div className="ct-card ct-card-wa">
            <div className="ct-wa-main">
              <div className="ct-card-head">
                <span className="ct-ic" aria-hidden="true">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" />
                  </svg>
                </span>
                <div>
                  <h3>WhatsApp us</h3>
                  <p>The quickest way in. We read every message, weekdays and weekends.</p>
                </div>
              </div>
              <a className="sn-send ct-wa-btn" href={waLink()} target="_blank" rel="noopener">
                Open WhatsApp
                <i aria-hidden="true">→</i>
              </a>
              <p className="sn-alt">
                {SITE.whatsappHandle} · <a href={SITE.phoneHref}>{SITE.phone}</a>
              </p>
            </div>
            <div className="ct-chat" aria-hidden="true">
              <span className="ct-bubble ct-bubble-me">{SITE.waHello.replace("'", "’")}</span>
              <span className="ct-bubble ct-bubble-us">
                Namaste! Tell us a little about it <span className="ct-typing"><i /><i /><i /></span>
              </span>
            </div>
            <div className="ct-qr">
              <img src="/images/contact-v3/whatsapp-qr.svg" alt="QR code that opens a WhatsApp chat with Ankora Labs" width="112" height="112" />
              <p>
                <b>On your laptop?</b> Scan with your phone’s camera and the chat opens there.
              </p>
            </div>
          </div>

          <div className="ct-card ct-card-call" ref={ref}>
            <div className="ct-card-head">
              <span className="ct-ic" aria-hidden="true">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
                  <path d="M3.5 10h17M8 3v4M16 3v4" />
                </svg>
              </span>
              <div>
                <h3>Book a 30-minute call</h3>
                <p>Free and online. No pitch, just your idea and our questions. Times show in your timezone.</p>
              </div>
            </div>
            {near ? <Slot /> : <div className="ct-cal" />}
          </div>
        </div>
      </div>
    </section>
  );
}
