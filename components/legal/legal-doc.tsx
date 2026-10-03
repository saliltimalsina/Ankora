import type { ReactNode } from "react";
import { SITE, waLink } from "../../lib/site";
import Toc from "./toc";
import Intro from "./intro";

// The annotated document that /privacy and /terms share: a hero with a taped
// summary card and an "updated" ink stamp, an optional feature block (the
// privacy ledger, the terms journey), then the legal text with a handwritten
// margin note beside every section and a sticky contents list. The text in the
// main column is what binds; the notes are the plain-English version.

export type LegalSection = {
  id: string;
  title: string;
  /** handwritten margin note: the short, plain-English version */
  note: string;
  body: ReactNode;
};

export default function LegalDoc({
  kicker,
  title,
  lede,
  updated,
  summary,
  feature,
  sections,
  askText,
}: {
  kicker: string;
  /** h1; put the serif line in <em> */
  title: ReactNode;
  lede: ReactNode;
  /** e.g. "3 Oct 2026" */
  updated: string;
  /** three short lines for the taped card */
  summary: string[];
  feature?: ReactNode;
  sections: LegalSection[];
  /** WhatsApp message for the closing card */
  askText: string;
}) {
  const [day, mon, year] = updated.split(" ");
  return (
    <>
      <section className="lg-hero">
        <div className="lg-hero-in">
          <div className="lg-hero-copy" data-lg-in>
            <p className="lg-kick">{kicker}</p>
            <h1 className="lg-h1">{title}</h1>
            <p className="lg-lede">{lede}</p>
          </div>
          <div className="lg-card" data-lg-card>
            <span className="lg-tape" aria-hidden="true" />
            <p className="lg-card-lbl">The short version</p>
            <ul className="lg-card-list">
              {summary.map((line) => (
                <li key={line}>{line}</li>
              ))}
            </ul>
            <p className="lg-stamp" data-lg-stamp>
              <span>Updated</span>
              <b>
                {day} {mon}
              </b>
              <span>{year}</span>
            </p>
          </div>
        </div>
      </section>

      {feature}

      <div className="lg-body">
        <Toc items={sections.map((s) => ({ id: s.id, title: s.title }))} />
        <article className="lg-doc">
          {sections.map((s, i) => (
            <section key={s.id} id={s.id} className="lg-sec" aria-labelledby={`${s.id}-h`}>
              <div className="lg-text">
                <h2 id={`${s.id}-h`} className="lg-h2">
                  <span className="lg-num">{String(i + 1).padStart(2, "0")}</span>
                  {s.title}
                </h2>
                {s.body}
              </div>
              <aside className="lg-note" aria-label="In short">
                <svg className="lg-note-arr" viewBox="0 0 40 30" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M38 6C24 2 10 8 5 22" />
                  <path d="M2 14l3 9 8-4" />
                </svg>
                {s.note}
              </aside>
            </section>
          ))}

          <div className="lg-ask">
            <p className="lg-kick">Still unsure about something?</p>
            <h2 className="lg-ask-h">
              Ask a person, <em>not a form.</em>
            </h2>
            <p>
              Write to <a href={`mailto:${SITE.email}`}>{SITE.email}</a> or message us on WhatsApp. We reply within 24
              hours, weekends too.
            </p>
            <div className="lg-ask-btns">
              <a className="lg-btn lg-btn-fill" href={waLink(askText)} target="_blank" rel="noopener">
                Ask on WhatsApp <span aria-hidden="true">→</span>
              </a>
              <a className="lg-btn" href={`mailto:${SITE.email}?subject=${encodeURIComponent(askText)}`}>
                Send an email
              </a>
            </div>
          </div>
        </article>
      </div>
      <Intro />
    </>
  );
}
