"use client";

import { useEffect, useState } from "react";
import { SITE, waLink } from "../../lib/site";

// "Tell us in three taps": chips on a notebook page write a handwritten
// message, and the WhatsApp / email buttons send exactly that. The pricing
// receipts link here as /contact?need=<key>#brief to preselect "I need".

type Group = "who" | "need" | "when";
const GROUPS: { key: Group; legend: string; chips: { label: string; v: string; k?: string }[] }[] = [
  {
    key: "who",
    legend: "I’m a",
    chips: [
      { label: "Startup", v: "a startup" },
      { label: "Business", v: "a business" },
      { label: "Agency", v: "an agency" },
      { label: "Non-profit", v: "a non-profit" },
    ],
  },
  {
    key: "need",
    legend: "I need",
    chips: [
      { label: "Website", v: "a website", k: "website" },
      { label: "E-commerce", v: "an online store", k: "ecommerce" },
      { label: "Mobile app", v: "a mobile app", k: "app" },
      { label: "UI/UX", v: "UI/UX design", k: "uiux" },
      { label: "AI", v: "an AI feature", k: "ai" },
      { label: "Not sure yet", v: "help figuring out what I need" },
    ],
  },
  {
    key: "when",
    legend: "When",
    chips: [
      { label: "ASAP", v: "as soon as possible" },
      { label: "1–2 months", v: "in the next 1–2 months" },
      { label: "Just exploring", v: "later. Just exploring for now" },
    ],
  },
];

const message = (p: Record<Group, string>) =>
  `Hi Ankora! I’m ${p.who || "___"} and I need ${p.need || "___"}, ${p.when || "___"}. Can we talk?`;

export default function Brief() {
  const [pick, setPick] = useState<Record<Group, string>>({ who: "", need: "", when: "" });

  useEffect(() => {
    const want = new URLSearchParams(location.search).get("need");
    const chip = GROUPS[1].chips.find((c) => c.k && c.k === want);
    if (chip) setPick((p) => ({ ...p, need: chip.v }));
  }, []);

  const toggle = (g: Group, v: string) => setPick((p) => ({ ...p, [g]: p[g] === v ? "" : v }));
  const plain = message(pick);
  const blank = (v: string) => (v ? <mark>{v}</mark> : <span style={{ opacity: 0.45 }}>___</span>);

  return (
    <section className="gb" id="brief" aria-labelledby="gb-title">
      <div className="gb-in">
        <div className="gb-head">
          <p className="gn-kick">Not sure what to say?</p>
          <h2 id="gb-title" className="gn-h2">
            Tell us in <em>three taps.</em>
          </h2>
        </div>
        <div className="gb-pad">
          <div className="gb-groups">
            {GROUPS.map((g) => (
              <fieldset key={g.key} className="gb-group">
                <legend>{g.legend}</legend>
                <div className="gb-chips" data-group={g.key}>
                  {g.chips.map((c) => (
                    <button key={c.label} type="button" aria-pressed={pick[g.key] === c.v} onClick={() => toggle(g.key, c.v)}>
                      {c.label}
                    </button>
                  ))}
                </div>
              </fieldset>
            ))}
          </div>
          <div className="gb-note">
            <p className="gb-label">Your message</p>
            <p className="gb-msg" aria-live="polite">
              Hi Ankora! I’m {blank(pick.who)} and I need {blank(pick.need)}, {blank(pick.when)}. Can we talk?
            </p>
            <div className="gb-send">
              <a className="gb-btn gb-btn-wa" href={waLink(plain)} target="_blank" rel="noopener">
                Send on WhatsApp <span aria-hidden="true">→</span>
              </a>
              <a
                className="gb-btn gb-btn-mail"
                href={`mailto:${SITE.email}?subject=${encodeURIComponent("Project enquiry — Ankora Labs")}&body=${encodeURIComponent(plain + "\n\n")}`}
              >
                Send by email
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
