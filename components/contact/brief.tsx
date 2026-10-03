"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, waLink } from "../../lib/site";
import { GROUPS, type Group } from "../../lib/brief";
import { Choose, Fill, Stamp } from "../ui/sentence";

// The /contact form (in ./write.tsx): the message is the form. Gaps in one sentence pick
// who they are, what they need and when (lib/brief.ts), then a name and an
// email. "Send it" posts to /api/contact, which emails the studio and sends the
// sender a "we've got it" email; WhatsApp and the visitor's own email app stay
// as fallbacks with the same message ready. The pricing receipts link here as
// /contact?need=<key>#brief to preselect "I need".

const message = (p: Record<Group, string>) =>
  `Hi Ankora! I’m ${p.who || "___"} and I need ${p.need || "___"}, ${p.when || "___"}. Can we talk?`;

const PLACEHOLDER: Record<Group, string> = { who: "who you are", need: "what you need", when: "when" };

type Status = { s: "idle" | "sending" | "sent" } | { s: "error"; msg: string };
type Bad = "" | "name" | "email";

export default function Brief() {
  const [pick, setPick] = useState<Record<Group, string>>({ who: "", need: "", when: "" });
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [more, setMore] = useState("");
  const [extra, setExtra] = useState(false);
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [bad, setBad] = useState<Bad>("");
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
  useEffect(() => {
    setNudge("");
    setBad("");
  }, [name, email]);

  const label = (g: Group) => GROUPS.find((x) => x.key === g)!.chips.find((c) => c.v === pick[g])?.label ?? "";
  const plain = [message(pick), more.trim(), name.trim() ? `— ${name.trim()}` : ""].filter(Boolean).join("\n\n");
  const group = (g: Group) => GROUPS.find((x) => x.key === g)!;
  // the five gaps in reading order; the first empty one is cued
  const gaps = { who: !!pick.who, need: !!pick.need, when: !!pick.when, name: !!name.trim(), email: !!email.trim() };
  const done = Object.values(gaps).filter(Boolean).length;
  const cue = bad ? "" : (Object.keys(gaps) as (keyof typeof gaps)[]).find((k) => !gaps[k]) ?? "";
  const choose = (g: Group) => (
    <Choose
      cue={cue === g}
      label={group(g).legend}
      placeholder={PLACEHOLDER[g]}
      options={group(g).chips}
      value={pick[g]}
      onChange={(v) => setPick((p) => ({ ...p, [g]: v }))}
    />
  );

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.s === "sending") return;
    if (!name.trim()) {
      setBad("name");
      setNudge("Add your name, so we know who to reply to.");
      return nameRef.current?.focus();
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setBad("email");
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
    fd.set("hp", trap.current?.value ?? "");
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
  const sent = status.s === "sent";
  const hint = nudge || (status.s === "error" ? `${status.msg} Try WhatsApp or email below.` : "");

  return (
    <form className="sn-form" onSubmit={submit} noValidate data-sent={sent || undefined}>
      {!sent && (
        <div className="sn-how">
          <p>
            <b>Fill in the gaps.</b> Tap a highlighted word to pick an answer or type it in.
          </p>
          <p className="sn-progress" aria-hidden="true">
            <span className="sn-dots">
              {Object.values(gaps).map((on, i) => (
                <i key={i} data-on={on || undefined} />
              ))}
            </span>
            {done} of 5
          </p>
        </div>
      )}
      <fieldset className="sn-words" disabled={sent || sending}>
        <legend className="sr-only">Your message</legend>
        <div className="sn">
          Hi Ankora, I’m {choose("who")} and I need <span className="sn-nb">{choose("need")},</span>{" "}
          <span className="sn-nb">{choose("when")}.</span>
        </div>
        <div className="sn">
          My name is{" "}
          <span className="sn-nb">
            <Fill ref={nameRef} label="Your name" name="name" autoComplete="name" required value={name} onChange={setName} placeholder="your name" invalid={bad === "name"} cue={cue === "name"} />,
          </span>{" "}
          reply to me at{" "}
          <span className="sn-nb">
            <Fill
              ref={emailRef}
              label="Your email"
              type="email"
              name="email"
              autoComplete="email"
              inputMode="email"
              required
              value={email}
              onChange={setEmail}
              placeholder="you@business.com"
              invalid={bad === "email"}
              cue={cue === "email"}
            />
            .
          </span>
        </div>
        {extra && (
          <div className="sn-extra">
            <div className="sn">
              You can also call me on{" "}
              <Fill label="Phone or WhatsApp (optional)" type="tel" name="phone" autoComplete="tel" value={phone} onChange={setPhone} placeholder="98XXXXXXXX" />.
            </div>
            <textarea
              className="sn-note"
              rows={3}
              name="message"
              aria-label="Anything else (optional)"
              value={more}
              onChange={(e) => setMore(e.target.value)}
              placeholder="Your business, your current website, a deadline…"
            />
          </div>
        )}
      </fieldset>

      {/* spam trap: hidden from people, filled in by bots */}
      <input ref={trap} type="text" name="hp" tabIndex={-1} autoComplete="off" data-1p-ignore data-lpignore="true" className="sn-trap" aria-hidden="true" />

      {sent ? (
        <div className="sn-done" role="status">
          <Stamp top="Ankora Labs" bottom="Kathmandu" />
          <div>
            <p className="sn-done-h">Thank you, {name.trim().split(" ")[0]}. It’s in our inbox.</p>
            <p className="sn-done-p">
              We’ll reply within 24 hours, weekends too. A copy is on its way to <b>{email.trim()}</b>.
            </p>
          </div>
        </div>
      ) : (
        <>
          <p className="sn-hint" role="alert" data-err={hint ? "" : undefined}>
            {hint}
          </p>
          <div className="sn-actions">
            {!extra && (
              <button type="button" className="sn-more" aria-expanded={false} onClick={() => setExtra(true)}>
                <i aria-hidden="true">+</i> Add a phone number or a note
              </button>
            )}
            <button type="submit" className="sn-send" disabled={sending}>
              {sending ? "Sending…" : "Send it"}
              <i aria-hidden="true">→</i>
            </button>
          </div>
          <p className="sn-alt">
            Rather talk? <a href="#call">Book a call or WhatsApp us</a>. Or send this same message from{" "}
            <a href={waLink(plain)} target="_blank" rel="noopener">
              WhatsApp
            </a>{" "}
            or{" "}
            <a href={`mailto:${SITE.email}?subject=${encodeURIComponent("Project enquiry — Ankora Labs")}&body=${encodeURIComponent(plain + "\n\n")}`}>
              your email app
            </a>
            .
          </p>
        </>
      )}
    </form>
  );
}
