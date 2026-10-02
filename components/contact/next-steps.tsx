import { SITE } from "../../lib/site";
import { WhatsApp } from "../ui/links";

// "From hello to a fixed quote": the three steps after someone gets in touch,
// then the "Where we work" postcard.

const STEPS = [
  {
    title: "We reply within 24 hours",
    body: "Email, call or book a slot. Weekdays and weekends, we read everything that comes in.",
    note: "yes, even on Saturdays",
  },
  {
    title: "A 30-minute call",
    body: "We ask about your business, your users and what the website or app has to do. No pitch deck, no pressure.",
    note: "ask dumb questions early",
  },
  {
    title: "A written plan & price",
    body: (
      <>
        Scope, milestones, timeline and a fixed quote in NPR. Priced to your project, not a rate card;{" "}
        <a href="/services#pricing">see what’s included</a>.
      </>
    ),
    note: "no surprises later",
  },
];

export default function NextSteps() {
  return (
    <section className="gn" aria-labelledby="gn-title">
      <div className="gn-in">
        <div className="gn-head">
          <p className="gn-kick">What happens next</p>
          <h2 id="gn-title" className="gn-h2">
            From hello <em>to a fixed quote.</em>
          </h2>
        </div>
        <ol className="gn-steps">
          {STEPS.map((st, i) => (
            <li key={st.title} className="gn-step">
              <span className="gn-dot">0{i + 1}</span>
              <h3>{st.title}</h3>
              <p>{st.body}</p>
              <span className="gn-hand">{st.note}</span>
            </li>
          ))}
        </ol>
        <div className="gn-card">
          <div className="gn-post">
            <p className="gn-kick">Where we work</p>
            <h2 className="gn-h2 gn-h2s">
              Kathmandu-based. <em>Nepal-wide.</em>
            </h2>
            <p>
              We’re a remote-first web design and development team from Kathmandu. Wherever your business is, in Pokhara,
              Biratnagar, Butwal or abroad, it works the same way: online calls, weekly demos on a live link, and a proper
              handover.
            </p>
            <ul className="gn-facts">
              <li>
                <b>Hours</b>
                <span>Every day, weekdays &amp; weekends</span>
              </li>
              <li>
                <b>Reply</b>
                <span>Within 24 hours</span>
              </li>
              <li>
                <b>Chat</b>
                <span>
                  <WhatsApp>WhatsApp {SITE.whatsappHandle}</WhatsApp>
                </span>
              </li>
              <li>
                <b>Work</b>
                <span>Websites, web apps, mobile apps, UI/UX</span>
              </li>
            </ul>
          </div>
          <div className="gn-stamp" aria-hidden="true">
            <span className="gn-stamp-in">
              <b>NP</b>
              <span>Kathmandu</span>
              <span>Ankora Labs</span>
            </span>
          </div>
          <div className="gn-mark" aria-hidden="true">
            <span>
              Posted from
              <br />
              Kathmandu
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
