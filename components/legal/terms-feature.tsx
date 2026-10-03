// /terms feature block: a project's life from quote to support, each stop
// linking to the clause that covers it.

const STOPS = [
  { title: "Quote", body: "A written scope and a fixed price in NPR.", href: "#quotes" },
  { title: "Kickoff", body: "Proposal signed, advance paid, we start.", href: "#payments" },
  { title: "Build", body: "Weekly demos on a live link.", href: "#your-part" },
  { title: "Revisions", body: "Feedback rounds, changes priced openly.", href: "#revisions" },
  { title: "Launch", body: "Tested, then live on your domain.", href: "#launch" },
  { title: "Handover", body: "Code, logins and ownership pass to you.", href: "#ownership" },
  { title: "Support", body: "Bugs fixed free for 30 days.", href: "#warranty" },
];

export default function TermsFeature() {
  return (
    <section className="lg-feat" aria-labelledby="lg-journey-h">
      <div className="lg-feat-in">
        <div data-lg-rise>
          <p className="lg-kick">How a project runs</p>
          <h2 id="lg-journey-h" className="lg-feat-h">
            Seven stops. <em>No small print.</em>
          </h2>
          <p className="lg-feat-sub">
            Every project follows the same road. Tap a stop to read the part of these terms that covers it.
          </p>
        </div>
        <ol className="lg-journey" data-lg-rise>
          {STOPS.map((s, i) => (
            <li key={s.title} className="lg-stop">
              <a href={s.href}>
                <span className="lg-stop-dot">{String(i + 1).padStart(2, "0")}</span>
                <b>{s.title}</b>
                <span>{s.body}</span>
                <em>Read the terms</em>
              </a>
            </li>
          ))}
        </ol>
        <p className="lg-journey-note">your signed proposal always wins if it says something different ↓</p>
      </div>
    </section>
  );
}
