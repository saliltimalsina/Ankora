import type { ReactNode } from "react";
import { SITE, waLink } from "../../lib/site";

// /contact hero: the headline, the torn-paper card with every way to reach us,
// and the clipboard scene.

const stroke = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round", strokeLinejoin: "round" } as const;

const ROWS: { label: string; icon: ReactNode; value: ReactNode }[] = [
  {
    label: "Email",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <rect x="2.5" y="5" width="19" height="14.5" rx="2.2" />
        <path d="M3.5 7l8.5 6 8.5-6" />
      </svg>
    ),
    value: <a href={`mailto:${SITE.email}`}>{SITE.email}</a>,
  },
  {
    label: "Phone",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M4.5 3.5h4l1.8 4.6-2.3 1.8a14.5 14.5 0 0 0 6.1 6.1l1.8-2.3 4.6 1.8v4a1.8 1.8 0 0 1-2 1.8A17.8 17.8 0 0 1 2.7 5.5a1.8 1.8 0 0 1 1.8-2z" />
      </svg>
    ),
    value: <a href={SITE.phoneHref}>{SITE.phone}</a>,
  },
  {
    label: "WhatsApp",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M4.5 19.5l1.1-3.6A8 8 0 1 1 8.4 18.6z" />
        <path d="M9.2 8.6c.2-.4.5-.4.8-.4l.6 1.4c.1.2 0 .4-.1.5l-.5.6c.6 1.2 1.6 2.1 2.8 2.7l.6-.6c.2-.1.4-.2.6-.1l1.4.7c0 .4-.1.8-.4 1.1-.5.5-1.4.7-2.4.3-2-.8-3.5-2.3-4.2-4.3-.3-.9-.2-1.5.4-1.9z" />
      </svg>
    ),
    value: (
      <a href={waLink()} target="_blank" rel="noopener">
        {SITE.whatsappHandle} · chat with us
      </a>
    ),
  },
  {
    label: "Based in",
    icon: (
      <svg viewBox="0 0 24 24" {...stroke}>
        <path d="M12 21.5s-7.2-5.9-7.2-11.3a7.2 7.2 0 1 1 14.4 0C19.2 15.6 12 21.5 12 21.5z" />
        <circle cx="12" cy="10" r="2.6" />
      </svg>
    ),
    value: <span className="val">Kathmandu · working across Nepal, 7 days a week</span>,
  },
  {
    label: "LinkedIn",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor">
        <rect x="2.5" y="2.5" width="19" height="19" rx="2.6" fill="none" stroke="currentColor" strokeWidth="1.7" />
        <path d="M7.1 9.8h2.1v7H7.1zM8.15 8.7a1.22 1.22 0 1 1 0-2.44 1.22 1.22 0 0 1 0 2.44zM11 9.8h2v1c.3-.6 1.1-1.2 2.2-1.2 2.1 0 2.7 1.3 2.7 3.1v4.1h-2.1v-3.7c0-1-.3-1.7-1.2-1.7-.9 0-1.5.7-1.5 1.8v3.6H11z" />
      </svg>
    ),
    value: (
      <a href={SITE.linkedin} target="_blank" rel="noopener">
        {SITE.linkedin.replace("https://www.", "")}
      </a>
    ),
  },
];

export default function ContactHero() {
  return (
    <section className="gc">
      <div className="gc-grid">
        <div className="gc-left">
          <h1 className="gc-h1">
            Let’s
            <br />
            build
            <span className="it">
              something
              <br />
              together.
            </span>
          </h1>
          <p className="gc-sub">
            Need a website, web app or mobile app built in Nepal? Whether you have an idea, a product to improve, or just
            want to explore what’s possible—<span className="us">we’d love to hear from you.</span>
          </p>
          <div className="gc-card">
            <span className="gc-tape" />
            <ul className="gc-rows">
              {ROWS.map((r) => (
                <li key={r.label}>
                  <span className="ic">{r.icon}</span>
                  <div>
                    <p className="lbl">{r.label}</p>
                    {r.value}
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <p className="gc-reply">
            <svg className="arr" viewBox="0 0 34 34" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M28 27 C14 29 6 21 8 8" />
              <path d="M3 13 L8 6 L14 11" />
            </svg>
            We usually reply within <span className="circ">24 hours</span>.
          </p>
        </div>
        <div className="gc-right">
          <p className="gc-convo">
            The conversation
            <br />
            <span className="u2">starts here.</span>
            <svg className="arr" viewBox="0 0 90 74" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M86 8 C40 4 12 26 10 62" />
              <path d="M2 50 L10 64 L22 56" />
            </svg>
          </p>
          <div className="gc-scene">
            <img className="gc-clip" src="/images/contact-v3/clipboard.webp" alt="Notebook on a clipboard" />
            <img className="gc-pen" src="/images/contact-v3/pen.webp" alt="" />
          </div>
        </div>
      </div>
    </section>
  );
}
