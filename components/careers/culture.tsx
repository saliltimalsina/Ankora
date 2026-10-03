// (04) on /careers, "How we work": a small desk made of the site's object
// photos, with the four ways we work written beside it as handwritten labels.
// Each label and its object share a numbered pin; hovering or focusing either
// one spotlights the pair and dims the rest (pure CSS, careers.css). Motion:
// the objects drop in, the labels follow (./motion.tsx).

const WAYS = [
  { n: 1, title: "Remote-first", body: "Work from anywhere in Nepal. We meet online, and in Kathmandu when it actually helps.", side: "l" },
  { n: 2, title: "One squad", body: "Designers, engineers and partners on the same thread. Nobody is “just sales”.", side: "r" },
  { n: 3, title: "Straight talk", body: "Clear terms, written down. Paid on time, and credit where it’s due.", side: "l" },
  { n: 4, title: "Real work, shipped", body: "What we make goes live for real Nepali businesses, not into a drawer.", side: "r" },
];

const OBJECTS = [
  { src: "/images/contact-v2/coffee.webp", cls: "cr-o-1", pin: 1 },
  { src: "/images/desk/prototype.webp", cls: "cr-o-2", pin: 2 },
  { src: "/images/items/ledger.webp", cls: "cr-o-3", pin: 3 },
  { src: "/images/items/phones.webp", cls: "cr-o-4", pin: 4 },
  { src: "/images/desk/keyboard.webp", cls: "cr-o-keys" },
  { src: "/images/contact-v2/pencil.webp", cls: "cr-o-pencil" },
];

function Label({ w }: { w: (typeof WAYS)[number] }) {
  return (
    <li className={`cr-label cr-label-${w.n}`} data-cr-label tabIndex={0}>
      <span className="cr-pin" aria-hidden="true">
        {w.n}
      </span>
      <b>{w.title}</b>
      <span>{w.body}</span>
    </li>
  );
}

export default function Culture() {
  return (
    <section className="cr-culture" aria-labelledby="cr-ways-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (04)
            </p>
            <h2 id="cr-ways-h" className="dk-h2">
              Small team. Big ownership.
            </h2>
          </div>
          <p>How the studio works, day to day. Point at a note to find it on the desk.</p>
        </div>

        <div className="cr-deskwrap">
          <ul className="cr-labels cr-labels-l">
            {WAYS.filter((w) => w.side === "l").map((w) => (
              <Label key={w.n} w={w} />
            ))}
          </ul>
          <div className="cr-desk" aria-hidden="true">
            {OBJECTS.map((o) => (
              <span key={o.cls} className={`cr-obj ${o.cls}`} data-cr-obj>
                <img src={o.src} alt="" />
                {o.pin && <span className="cr-pin">{o.pin}</span>}
              </span>
            ))}
          </div>
          <ul className="cr-labels cr-labels-r">
            {WAYS.filter((w) => w.side === "r").map((w) => (
              <Label key={w.n} w={w} />
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
