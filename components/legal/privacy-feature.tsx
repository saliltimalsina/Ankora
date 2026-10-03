// /privacy feature block: the "what we keep" ledger (a receipt with one line
// per thing we hold, ending in "Cookies: 0") and the "where it goes" flow.

const ROWS: { what: string; how: string; why: string; who: string; keep: string }[] = [
  {
    what: "A booked call",
    how: "name, email, time, anything you type",
    why: "To hold the call and prepare for it",
    who: "Cal.com, Google Calendar & Meet",
    keep: "12 months after we last talk",
  },
  {
    what: "A WhatsApp chat",
    how: "number, name, your messages",
    why: "To reply and talk through your project",
    who: "WhatsApp (Meta)",
    keep: "12 months after we last talk",
  },
  {
    what: "An email",
    how: "address, message, attachments",
    why: "To reply and send quotes",
    who: "Cloudflare (routing), Google (inbox)",
    keep: "12 months after we last talk",
  },
  {
    what: "A job application",
    how: "CV, links, contact details",
    why: "To consider you for a role",
    who: "Brevo (form delivery), then our inbox",
    keep: "12 months, or less if you ask",
  },
  {
    what: "Visiting this site",
    how: "IP address, browser, page asked for",
    why: "To serve pages and keep the site safe",
    who: "Vercel (hosting)",
    keep: "A few days, in server logs",
  },
];

export default function PrivacyFeature() {
  return (
    <>
      <section className="lg-feat" aria-labelledby="lg-ledger-h">
        <div className="lg-feat-in" data-lg-rise>
          <p className="lg-kick">What we keep</p>
          <h2 id="lg-ledger-h" className="lg-feat-h">
            The whole list. <em>It’s short.</em>
          </h2>
          <p className="lg-feat-sub">
            Everything this website and our team can hold about you, itemised like a receipt. If it isn’t on this list,
            we don’t have it.
          </p>
        </div>
        <div className="lg-ledger">
          <div className="lg-ledger-top">
            <span>
              <b>Ankora Labs</b>
              <br />
              Kathmandu, Nepal
            </span>
            <span style={{ textAlign: "right" }}>
              Data receipt
              <br />
              No. 0001
            </span>
          </div>
          <table>
            <thead>
              <tr>
                <th scope="col">When you…</th>
                <th scope="col">Why</th>
                <th scope="col">Handled by</th>
                <th scope="col">Kept for</th>
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r) => (
                <tr key={r.what}>
                  <td>
                    {r.what}
                    <small>{r.how}</small>
                  </td>
                  <td data-l="Why">{r.why}</td>
                  <td data-l="Handled by">{r.who}</td>
                  <td data-l="Kept for">{r.keep}</td>
                </tr>
              ))}
              <tr className="lg-ledger-zero">
                <td>Cookies</td>
                <td className="lg-zero">0</td>
                <td data-l="Trackers">No ads, no analytics</td>
                <td data-l="Banner">Nothing to accept</td>
              </tr>
            </tbody>
          </table>
          <div className="lg-ledger-total">
            <span>Sold to anyone</span>
            <b>Nothing. Ever.</b>
          </div>
        </div>
      </section>

      <section className="lg-feat" aria-labelledby="lg-flow-h">
        <div className="lg-feat-in" data-lg-rise>
          <p className="lg-kick">Where it goes</p>
          <h2 id="lg-flow-h" className="lg-feat-h">
            Three roads in. <em>No exits.</em>
          </h2>
        </div>
        <div className="lg-flow" aria-label="Your message travels from you, through Cal.com, WhatsApp or email, to the Ankora Labs team, and nowhere else.">
          <div className="lg-node">
            <b>You</b>
            <span>a booking, chat or email</span>
          </div>
          <div className="lg-pipes" aria-hidden="true">
            <i className="lg-pipe" />
          </div>
          <div className="lg-mid">
            <div className="lg-node">
              <b>Cal.com</b>
            </div>
            <div className="lg-node">
              <b>WhatsApp</b>
            </div>
            <div className="lg-node">
              <b>Email</b>
            </div>
          </div>
          <div className="lg-pipes" aria-hidden="true">
            <i className="lg-pipe" />
          </div>
          <div className="lg-node lg-node-us">
            <b>Ankora Labs</b>
            <span>our small team, and only us</span>
          </div>
        </div>
        <p className="lg-never">
          <span className="lg-never-lbl">and never to…</span>
          <s>advertisers</s>
          <s>data brokers</s>
          <s>mailing lists you didn’t ask for</s>
          <s>AI training sets</s>
        </p>
      </section>
    </>
  );
}
