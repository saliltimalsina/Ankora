// (04) on /contact, "From hello to a fixed quote": the three steps after you
// get in touch as paper tickets on the desk, joined by hand-drawn arrows that
// draw in as you scroll (./motion.tsx). The last ticket gets a "Fixed" stamp.
// Below: where we work, posted from Kathmandu.

const STEPS = [
  { big: "24h", t: "We reply", s: "To every message, weekdays and weekends." },
  { big: "30 min", t: "A call", s: "Your business, your users and what it has to do. No pitch deck." },
  {
    big: "NPR",
    t: "A written plan & a fixed quote",
    s: (
      <>
        Scope, milestones and one price. <a href="/services#pricing">See what’s included</a>.
      </>
    ),
  },
];

export default function NextSteps() {
  return (
    <section className="ct-next" aria-labelledby="ct-next-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (04)
            </p>
            <h2 id="ct-next-h" className="dk-h2">
              From hello to a fixed quote.
            </h2>
          </div>
          <p>What happens after you get in touch, whichever way you choose.</p>
        </div>

        <div className="ct-route">
          {/* hand-drawn arrows between the tickets: down into 02, up into 03 */}
          {["M6 14 C 46 2, 86 26, 92 74", "M6 70 C 40 84, 84 62, 92 14"].map((d, i) => (
            <svg key={d} className={`ct-arrow ct-arrow-${i + 1}`} viewBox="0 0 110 90" aria-hidden="true">
              <path data-ct-arrow d={d} />
              <path data-ct-arrow d={i === 0 ? "M78 64 L 92 76 L 100 58" : "M80 22 L 92 12 L 102 28"} />
            </svg>
          ))}
          <ol className="ct-tickets">
            {STEPS.map((st, i) => (
              <li key={st.t} className="ct-ticket">
                <span className="ct-stub" aria-hidden="true">
                  <span>Step</span>
                  <b>0{i + 1}</b>
                </span>
                <span className="ct-ticket-body">
                  <span className="ct-big">{st.big}</span>
                  <b className="ct-ticket-t">{st.t}</b>
                  <span className="ct-ticket-s">{st.s}</span>
                </span>
                {i === STEPS.length - 1 && (
                  <span className="ct-fixed" aria-hidden="true">
                    Fixed
                    <small>no surprises</small>
                  </span>
                )}
              </li>
            ))}
          </ol>
        </div>

        <div className="ct-where">
          <p>
            <b>Kathmandu-based, Nepal-wide.</b> Pokhara, Biratnagar, Butwal or abroad, it works the same way: online calls,
            weekly demos on a live link, and a proper handover.
          </p>
          <span className="ct-post" aria-hidden="true">
            <span className="ct-postmark">
              <span>
                Posted from
                <br />
                Kathmandu
              </span>
            </span>
            <span className="ct-postage">
              <span>
                <b>NP</b>
                Ankora Labs
              </span>
            </span>
          </span>
        </div>
      </div>
    </section>
  );
}
