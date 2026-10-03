import { ROLES } from "../../lib/careers";

// (01) on /careers: the studio as a place to work, not any one role. The
// first questions answered on one line (where, team, what's open, reply time),
// and a "Teammate" lanyard badge hanging off the top of the page, drawn in
// markup. Motion (drops in, swings with the pointer): ./motion.tsx.

export default function CareersHero() {
  const open = ROLES.length;
  const facts = [
    { k: "Where", v: "Kathmandu, remote across Nepal" },
    { k: "Team", v: "Small. Designers, engineers, partners" },
    { k: "Open now", v: open ? `${open} ${open === 1 ? "role" : "roles"}` : "Nothing, but we read everything" },
    { k: "Reply", v: "Within 5 working days" },
  ];

  return (
    <section className="cr-hero" aria-labelledby="cr-h1">
      <div className="dk-wrap cr-hero-in">
        <div className="cr-meta" data-cr-fade>
          <p className="dk-no">(01) Careers</p>
          <p className="cr-status" data-open={open ? "" : undefined}>
            <i aria-hidden="true" />
            {open ? `${open} ${open === 1 ? "role" : "roles"} open` : "No open roles right now"}
            <span> · we reply to everyone</span>
          </p>
        </div>

        <h1 id="cr-h1" className="cr-h1" data-cr-split data-hero-hide>
          Build things Nepal actually uses.
        </h1>

        <p className="cr-lede" data-cr-fade>
          We’re a small design and engineering studio in Kathmandu, making websites and apps for Nepali businesses. We
          hire rarely and carefully, and everyone on the team owns real work.
        </p>

        <dl className="cr-facts" data-cr-fade>
          {facts.map((f) => (
            <div key={f.k}>
              <dt>{f.k}</dt>
              <dd>{f.v}</dd>
            </div>
          ))}
        </dl>

        <div className="cr-ctas" data-cr-fade>
          <a className="sn-send" href="#roles">
            {open ? "See open roles" : "Why no roles?"}
            <i aria-hidden="true">↓</i>
          </a>
          <a className="cr-ghost" href="#apply">
            Apply in a minute
          </a>
        </div>
      </div>

      <div className="cr-lanyard" aria-hidden="true">
        <div className="cr-swing" data-cr-badge data-hero-hide>
          <span className="cr-strap" />
          <span className="cr-clasp" />
          <span className="cr-badge">
            <span className="cr-badge-hole" />
            <span className="cr-badge-top">Ankora Labs</span>
            <span className="cr-badge-face">
              <svg viewBox="0 0 40 40">
                <circle cx="20" cy="15" r="7" />
                <path d="M6 38c1.5-8 7-12 14-12s12.5 4 14 12" />
              </svg>
            </span>
            <span className="cr-badge-name">your name here</span>
            <b className="cr-badge-role">Teammate</b>
            <span className="cr-badge-foot">Kathmandu · Nepal-wide</span>
          </span>
        </div>
      </div>
    </section>
  );
}
