// /careers: how the studio works (four cards) and, as Hiring, what happens
// after you apply (four steps), both with handwritten notes like the rest of the site.

const WAYS = [
  {
    title: "Remote-first",
    body: "Work from anywhere in Nepal. We meet online, and in Kathmandu when it actually helps.",
    note: "chiya breaks encouraged",
  },
  {
    title: "One squad",
    body: "Designers, engineers and partners on the same thread. Nobody is “just sales” and nothing gets lost in hand-offs.",
    note: "no silos here",
  },
  {
    title: "Real work, shipped",
    body: "The projects you help bring in go live for real Nepali businesses, not into a drawer.",
    note: "your name on the launch",
  },
  {
    title: "Straight talk",
    body: "Clear terms, written down. Paid on time, and credit where it’s due.",
    note: "in writing, always",
  },
];

const HIRING = [
  { title: "You send it", body: "Your message and CV, on WhatsApp or by email.", note: "a minute, tops" },
  { title: "We reply", body: "Within 5 working days, to everyone, even when it’s a no.", note: "no ghosting" },
  { title: "A 30-min chat", body: "Online. We talk about you, your network and how you like to work.", note: "no trick questions" },
  { title: "In writing", body: "Your role, terms and commission rate agreed on paper before you start.", note: "then we build" },
];

export default function Culture() {
  return (
    <section className="cr-sec cr-sec-ground" aria-labelledby="cr-ways-h">
      <div className="cr-in">
        <p className="cr-kick">How we work</p>
        <h2 id="cr-ways-h" className="cr-h2">
          Small team. <em>Big ownership.</em>
        </h2>
        <ul className="cr-ways">
          {WAYS.map((w, i) => (
            <li key={w.title} className="cr-way" style={{ "--r": `${[-1.2, 0.8, -0.6, 1.1][i]}deg` } as React.CSSProperties}>
              <span className="cr-way-pin" aria-hidden="true" />
              <h3>{w.title}</h3>
              <p>{w.body}</p>
              <span className="cr-hand">{w.note}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function Hiring() {
  return (
    <section className="cr-sec" aria-labelledby="cr-hiring-h">
      <div className="cr-in">
        <p className="cr-kick">After you hit send</p>
        <h2 id="cr-hiring-h" className="cr-h2">
          From hello <em>to your first project.</em>
        </h2>
        <ol className="cr-steps">
          {HIRING.map((s, i) => (
            <li key={s.title} className="cr-step">
              <span className="cr-dot">0{i + 1}</span>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
              <span className="cr-hand">{s.note}</span>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
