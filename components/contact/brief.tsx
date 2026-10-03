"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, waLink } from "../../lib/site";
import { GROUPS, type Group } from "../../lib/brief";

// "Tell us in three taps": chips and a few fields on a notebook page write a
// handwritten message. "Send message" posts it to /api/contact, which emails
// the studio and sends the sender a "we've got it" email; WhatsApp and the
// visitor's own email app stay as fallbacks with the same message ready. The
// pricing receipts link here as /contact?need=<key>#brief to preselect "I need".

const message = (p: Record<Group, string>) =>
  `Hi Ankora! I’m ${p.who || "___"} and I need ${p.need || "___"}, ${p.when || "___"}. Can we talk?`;

type Status = { s: "idle" | "sending" | "sent" } | { s: "error"; msg: string };

export default function Brief() {
  const [pick, setPick] = useState<Record<Group, string>>({ who: "", need: "", when: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [more, setMore] = useState("");
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [nudge, setNudge] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const opened = useRef(0); // when the form appeared; the API ignores instant (bot) sends

  useEffect(() => {
    opened.current = Date.now();
    const want = new URLSearchParams(location.search).get("need");
    const chip = GROUPS[1].chips.find((c) => c.k && c.k === want);
    if (chip) setPick((p) => ({ ...p, need: chip.v }));
  }, []);

  // a warning goes away once the form changes
  useEffect(() => setNudge(""), [name, email]);

  const toggle = (g: Group, v: string) => setPick((p) => ({ ...p, [g]: p[g] === v ? "" : v }));
  const label = (g: Group) => GROUPS.find((x) => x.key === g)!.chips.find((c) => c.v === pick[g])?.label ?? "";
  const plain = [message(pick), more.trim(), name.trim() ? `— ${name.trim()}` : ""].filter(Boolean).join("\n\n");
  const blank = (v: string) => (v ? <mark>{v}</mark> : <span style={{ opacity: 0.45 }}>___</span>);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.s === "sending") return;
    if (!name.trim()) {
      setNudge("Add your name first.");
      return nameRef.current?.focus();
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setNudge("Add an email address we can reply to.");
      return emailRef.current?.focus();
    }
    setStatus({ s: "sending" });
    const fd = new FormData();
    fd.set("name", name.trim());
    fd.set("email", email.trim());
    fd.set("phone", phone.trim());
    fd.set("who", label("who"));
    fd.set("need", label("need"));
    fd.set("when", label("when"));
    fd.set("message", [message(pick), more.trim()].filter(Boolean).join("\n\n"));
    fd.set("company", trap.current?.value ?? "");
    fd.set("t", String(opened.current));
    try {
      const res = await fetch("/api/contact", { method: "POST", body: fd });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean; error?: string };
      if (res.ok && data.ok) setStatus({ s: "sent" });
      else setStatus({ s: "error", msg: data.error || "We couldn’t send that just now." });
    } catch {
      setStatus({ s: "error", msg: "You seem to be offline." });
    }
  };

  const sending = status.s === "sending";

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
          <form id="gb-form" className="gb-groups" onSubmit={submit} noValidate>
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

            <div className="gb-fields">
              <label className="gb-field">
                <span>Your name</span>
                <input ref={nameRef} type="text" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ram Thapa" />
              </label>
              <label className="gb-field">
                <span>Email</span>
                <input ref={emailRef} type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@business.com" />
              </label>
              <label className="gb-field">
                <span>
                  Phone or WhatsApp <i>(optional)</i>
                </span>
                <input type="tel" name="phone" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" />
              </label>
              <label className="gb-field gb-field-wide">
                <span>
                  Anything else? <i>(optional)</i>
                </span>
                <textarea rows={3} name="message" value={more} onChange={(e) => setMore(e.target.value)} placeholder="Your business, your current website, a deadline…" />
              </label>
            </div>
            {/* spam trap: hidden from people, filled in by bots */}
            <input ref={trap} type="text" name="company" tabIndex={-1} autoComplete="off" className="gb-trap" aria-hidden="true" />
          </form>

          <div className="gb-note">
            {status.s === "sent" ? (
              <div role="status">
                <p className="gb-label">Sent</p>
                <p className="gb-msg gb-done">Thank you, {name.trim().split(" ")[0]}! It’s in our inbox.</p>
                <p className="gb-done-p">
                  We’ll reply within 24 hours, weekends too. A copy is on its way to <b>{email.trim()}</b>.
                </p>
              </div>
            ) : (
              <>
                <p className="gb-label">Your message</p>
                <p className="gb-msg" aria-live="polite">
                  Hi Ankora! I’m {blank(pick.who)} and I need {blank(pick.need)}, {blank(pick.when)}. Can we talk?
                  {more.trim() && (
                    <>
                      <br />
                      <span className="gb-more">{more.trim()}</span>
                    </>
                  )}
                  {name.trim() && (
                    <>
                      <br />— {name.trim()}
                    </>
                  )}
                </p>
                <div className="gb-send">
                  <button type="submit" form="gb-form" className="gb-btn gb-btn-wa" disabled={sending}>
                    {sending ? "Sending…" : "Send message"} {!sending && <span aria-hidden="true">→</span>}
                  </button>
                </div>
                {(nudge || status.s === "error") && (
                  <p className="gb-nudge" role="alert">
                    {nudge || (status.s === "error" && `${status.msg} Try WhatsApp or email below.`)}
                  </p>
                )}
                <p className="gb-or">
                  <span>or send it your way</span>
                </p>
                <div className="gb-alt">
                  <a href={waLink(plain)} target="_blank" rel="noopener">
                    WhatsApp
                  </a>
                  <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Project enquiry — Ankora Labs")}&body=${encodeURIComponent(plain + "\n\n")}`}>
                    Your email app
                  </a>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
