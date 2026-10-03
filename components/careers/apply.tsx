"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, waLink } from "../../lib/site";
import { SEATS, BACKGROUND } from "../../lib/careers";
import { Choose, Fill, Stamp } from "../ui/sentence";

// (03) on /careers, "Apply in a minute": the application is one sentence with
// gaps (the same pieces as the /contact form, components/ui/sentence.tsx), plus
// a CV that clips onto the sheet. "Send application" posts everything, CV
// included, to /api/apply, which emails it to the studio inbox. WhatsApp and
// email stay as fallbacks with the same message ready. "Apply for this role"
// buttons elsewhere on the page preselect a role through data-apply-role.

const MAX_CV = 4 * 1024 * 1024;
const CV_TYPES = /\.(pdf|docx?)$/i;

type Status = { s: "idle" | "sending" | "sent" } | { s: "error"; msg: string };
type Bad = "" | "name" | "seat" | "email";

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function Apply() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seat, setSeat] = useState("");
  const [bg, setBg] = useState("");
  const [link, setLink] = useState("");
  const [about, setAbout] = useState("");
  const [extra, setExtra] = useState(false);
  const [cv, setCv] = useState<File | null>(null);
  const [cvErr, setCvErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [bad, setBad] = useState<Bad>("");
  const [nudge, setNudge] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const seatRef = useRef<HTMLButtonElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const opened = useRef(0); // when the form appeared; the API ignores instant (bot) sends

  useEffect(() => {
    opened.current = Date.now();
  }, []);

  // "Apply for this role" on a role sheet
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const a = (e.target as Element).closest?.("[data-apply-role]");
      const chip = a?.getAttribute("data-apply-role");
      const s = chip && SEATS.find((x) => x.label === chip);
      if (s) setSeat(s.v);
    };
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // a warning goes away once the form changes
  useEffect(() => {
    setNudge("");
    setBad("");
  }, [name, email, seat]);

  const pickCv = (f: File | undefined | null) => {
    setCvErr("");
    if (!f) return;
    if (!CV_TYPES.test(f.name)) return setCvErr("Use a PDF or Word file.");
    if (f.size > MAX_CV) return setCvErr("That file is over 4 MB. Try a smaller PDF.");
    setCv(f);
  };

  const seatLabel = SEATS.find((s) => s.v === seat)?.label ?? "";
  const plain = [
    `Hi Ankora! I’m ${name.trim() || "___"}, and I’d like to apply as ${seat || "___"}.`,
    bg ? `I’m ${bg}.` : "",
    link.trim() ? `You can see more of me here: ${link.trim()}` : "",
    about.trim(),
    "My CV is attached.",
  ]
    .filter(Boolean)
    .join("\n");
  const subject = `Application: ${seatLabel || "Open application"}${name.trim() ? ` — ${name.trim()}` : ""}`;

  // the three gaps we need, in reading order; the first empty one is cued
  const gaps = { name: !!name.trim(), seat: !!seat, email: !!email.trim() };
  const done = Object.values(gaps).filter(Boolean).length;
  const cue = bad ? "" : (Object.keys(gaps) as (keyof typeof gaps)[]).find((k) => !gaps[k]) ?? "";

  // WhatsApp / email fallbacks only need a name and a role
  const guard = (e: React.MouseEvent) => {
    if (name.trim() && seat) return;
    e.preventDefault();
    setBad(name.trim() ? "seat" : "name");
    setNudge("Add your name and pick a role first.");
    if (!name.trim()) nameRef.current?.focus();
    else seatRef.current?.focus();
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (status.s === "sending") return;
    if (!name.trim()) {
      setBad("name");
      setNudge("Add your name first.");
      return nameRef.current?.focus();
    }
    if (!seat) {
      setBad("seat");
      setNudge("Pick the role you’re applying for.");
      return seatRef.current?.focus();
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
    fd.set("seat", seatLabel);
    fd.set("background", BACKGROUND.find((b) => b.v === bg)?.label ?? "");
    fd.set("link", link.trim());
    fd.set("about", about.trim());
    fd.set("company", trap.current?.value ?? "");
    fd.set("t", String(opened.current));
    if (cv) fd.set("cv", cv);
    try {
      const res = await fetch("/api/apply", { method: "POST", body: fd });
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
    <section className="cr-apply" id="apply" aria-labelledby="cr-apply-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (03)
            </p>
            <h2 id="cr-apply-h" className="dk-h2">
              Apply in a minute.
            </h2>
          </div>
          <p>No portal, no account. Your application and CV land straight in our inbox.</p>
        </div>

        <form className="dk-sheet sn-form" onSubmit={submit} noValidate>
          <img className="dk-clip" src="/images/desk/paperclip.webp" alt="" aria-hidden="true" />
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
                {done} of 3
              </p>
            </div>
          )}

          <fieldset className="sn-words" disabled={sent || sending}>
            <legend className="sr-only">Your application</legend>
            <div className="sn">
              Hi Ankora, I’m{" "}
              <Fill ref={nameRef} label="Your name" name="name" autoComplete="name" required value={name} onChange={setName} placeholder="your name" invalid={bad === "name"} cue={cue === "name"} />{" "}
              and I’d like to join as{" "}
              <span className="sn-nb">
                <Choose ref={seatRef} label="I’d like to join as" placeholder="which role" options={SEATS} value={seat} onChange={setSeat} invalid={bad === "seat"} cue={cue === "seat"} />.
              </span>
            </div>
            <div className="sn">
              I’m <Choose label="Where I’m at (optional)" placeholder="where you’re at" options={BACKGROUND} value={bg} onChange={setBg} />, and you can see my work at{" "}
              <span className="sn-nb">
                <Fill label="LinkedIn, portfolio or GitHub (optional)" type="url" inputMode="url" name="link" value={link} onChange={setLink} placeholder="a link" />.
              </span>
            </div>
            <div className="sn">
              Reply to me at{" "}
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
                  placeholder="you@example.com"
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
                  <span className="sn-nb">
                    <Fill label="Phone or WhatsApp (optional)" type="tel" name="phone" autoComplete="tel" value={phone} onChange={setPhone} placeholder="98XXXXXXXX" />.
                  </span>
                </div>
                <textarea
                  className="sn-note"
                  rows={3}
                  name="about"
                  aria-label="In a line or two: why you? (optional)"
                  value={about}
                  onChange={(e) => setAbout(e.target.value)}
                  placeholder="In a line or two, why you? A project you’re proud of, what you want to get better at, anything."
                />
              </div>
            )}

            {/* the CV clips onto the sheet */}
            <div className="cr-cv">
              {cv ? (
                <div className="cr-file">
                  <span className="cr-file-page" aria-hidden="true">
                    <img src="/images/desk/paperclip.webp" alt="" />
                    <i />
                    <i />
                    <i />
                  </span>
                  <span className="cr-file-t">
                    <b>{cv.name}</b>
                    <span>{kb(cv.size)} · clipped to your application</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setCv(null);
                      if (fileRef.current) fileRef.current.value = "";
                    }}
                    aria-label="Remove CV"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <label
                  className="cr-drop"
                  data-drag={drag || undefined}
                  onDragOver={(e) => {
                    e.preventDefault();
                    setDrag(true);
                  }}
                  onDragLeave={() => setDrag(false)}
                  onDrop={(e) => {
                    e.preventDefault();
                    setDrag(false);
                    pickCv(e.dataTransfer.files?.[0]);
                  }}
                >
                  <input
                    ref={fileRef}
                    type="file"
                    name="cv"
                    accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                    onChange={(e) => pickCv(e.target.files?.[0])}
                  />
                  <span className="cr-drop-ic" aria-hidden="true">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9" />
                    </svg>
                  </span>
                  <span>
                    <b>Clip on your CV</b> <i>(optional)</i>
                    <span>Drop it here or click to choose. PDF or Word, up to 4 MB.</span>
                  </span>
                </label>
              )}
              {cvErr && (
                <p className="cr-err" role="alert">
                  {cvErr}
                </p>
              )}
            </div>
          </fieldset>

          {/* spam trap: hidden from people, filled in by bots */}
          <input ref={trap} type="text" name="company" tabIndex={-1} autoComplete="off" className="sn-trap" aria-hidden="true" />

          {sent ? (
            <div className="sn-done" role="status">
              <Stamp top="Ankora Labs" bottom="Careers" />
              <div>
                <p className="sn-done-h">Thank you, {name.trim().split(" ")[0]}. It’s in our inbox.</p>
                <p className="sn-done-p">
                  Your application{cv ? " and CV are" : " is"} with us. We reply to everyone within 5 working days, at{" "}
                  <b>{email.trim()}</b>.
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
                    <i aria-hidden="true">+</i> Add a phone number or why you
                  </button>
                )}
                <button type="submit" className="sn-send" disabled={sending}>
                  {sending ? "Sending…" : "Send application"}
                  <i aria-hidden="true">→</i>
                </button>
              </div>
              <ol className="cr-after" aria-label="After you apply">
                <li>We reply within 5 working days, even when it’s a no</li>
                <li>A 30-minute chat online</li>
                <li>Your role and terms agreed in writing</li>
              </ol>
              <p className="sn-alt">
                Or send the same message from{" "}
                <a href={waLink(plain)} target="_blank" rel="noopener" onClick={guard}>
                  WhatsApp
                </a>{" "}
                or{" "}
                <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain + "\n\n")}`} onClick={guard}>
                  your email app
                </a>
                , and attach your CV there.
              </p>
            </>
          )}
        </form>
      </div>
    </section>
  );
}
