"use client";

import { useEffect, useRef, useState } from "react";
import { SITE, waLink } from "../../lib/site";
import { SEATS, BACKGROUND } from "../../lib/careers";

// "Apply in a minute": a short form with a CV upload. The letter beside it
// writes the application as you type (the same idea as the /contact brief
// builder). "Send application" posts everything, CV included, to /api/apply,
// which emails it to the studio inbox. WhatsApp and email stay as fallbacks
// with the same message ready. "Apply for this role" buttons elsewhere on the
// page preselect a role through data-apply-role.

const MAX_CV = 4 * 1024 * 1024;
const CV_TYPES = /\.(pdf|docx?)$/i;

type Status = { s: "idle" | "sending" | "sent" } | { s: "error"; msg: string };

const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

export default function Apply() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [seat, setSeat] = useState("");
  const [bg, setBg] = useState("");
  const [link, setLink] = useState("");
  const [about, setAbout] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [cvErr, setCvErr] = useState("");
  const [drag, setDrag] = useState(false);
  const [status, setStatus] = useState<Status>({ s: "idle" });
  const [nudge, setNudge] = useState("");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const trap = useRef<HTMLInputElement>(null);
  const opened = useRef(0); // when the form appeared; the API ignores instant (bot) sends

  useEffect(() => {
    opened.current = Date.now();
  }, []);

  // "Apply for this role" on a role card
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
  useEffect(() => setNudge(""), [name, email, seat]);

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

  // WhatsApp / email fallbacks only need a name and a role
  const guard = (e: React.MouseEvent) => {
    if (name.trim() && seat) return;
    e.preventDefault();
    setNudge("Add your name and pick a role first.");
    if (!name.trim()) nameRef.current?.focus();
  };

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
    if (!seat) return setNudge("Pick the role you’re applying for.");
    setNudge("");
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

  const blank = (v: string) => (v ? <mark>{v}</mark> : <span className="cr-blank">___</span>);
  const sending = status.s === "sending";

  return (
    <section className="cr-sec cr-sec-apply" id="apply" aria-labelledby="cr-apply-h">
      <div className="cr-in">
        <p className="cr-kick">Apply in a minute</p>
        <h2 id="cr-apply-h" className="cr-h2">
          Fill it in. <em>Attach your CV.</em>
        </h2>
        <p className="cr-sub">
          No portal, no account. Your application and CV land straight in our inbox. Prefer WhatsApp or your own email?
          That works too.
        </p>

        <div className="cr-apply">
          <form id="cr-apply-form" className="cr-form" onSubmit={submit} noValidate>
            <div className="cr-row">
              <label className="cr-field">
                <span>Your name</span>
                <input ref={nameRef} type="text" name="name" autoComplete="name" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Sita Sharma" />
              </label>
              <label className="cr-field">
                <span>Email</span>
                <input ref={emailRef} type="email" name="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
              </label>
            </div>

            <label className="cr-field">
              <span>
                Phone or WhatsApp <i>(optional)</i>
              </span>
              <input type="tel" name="phone" autoComplete="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="98XXXXXXXX" />
            </label>

            <fieldset className="cr-field">
              <legend>I’d like to join as</legend>
              <div className="cr-chips">
                {SEATS.map((s) => (
                  <button key={s.label} type="button" aria-pressed={seat === s.v} onClick={() => setSeat(seat === s.v ? "" : s.v)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <fieldset className="cr-field">
              <legend>
                Where I’m at <i>(optional)</i>
              </legend>
              <div className="cr-chips">
                {BACKGROUND.map((s) => (
                  <button key={s.label} type="button" aria-pressed={bg === s.v} onClick={() => setBg(bg === s.v ? "" : s.v)}>
                    {s.label}
                  </button>
                ))}
              </div>
            </fieldset>

            <label className="cr-field">
              <span>
                LinkedIn, portfolio or GitHub <i>(optional)</i>
              </span>
              <input type="url" inputMode="url" name="link" value={link} onChange={(e) => setLink(e.target.value)} placeholder="linkedin.com/in/…" />
            </label>

            <label className="cr-field">
              <span>
                In a line or two: why you? <i>(optional)</i>
              </span>
              <textarea
                rows={3}
                name="about"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                placeholder="e.g. I run social media for 12 restaurants in Lalitpur and half of them need a new website."
              />
            </label>

            <div className="cr-field">
              <span>
                Your CV or resume <i>(PDF or Word, up to 4 MB)</i>
              </span>
              {cv ? (
                <div className="cr-file">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" />
                    <path d="M14 3v5h5M9 13h6M9 17h4" />
                  </svg>
                  <span className="cr-file-name">{cv.name}</span>
                  <span className="cr-file-size">{kb(cv.size)}</span>
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
                  className={`cr-drop${drag ? " is-drag" : ""}`}
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
                  <input ref={fileRef} type="file" name="cv" accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={(e) => pickCv(e.target.files?.[0])} />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M12 16V4M7 9l5-5 5 5M5 20h14" />
                  </svg>
                  <b>Drop your CV here</b>
                  <span>or click to choose a file</span>
                </label>
              )}
              {cvErr && (
                <p className="cr-err" role="alert">
                  {cvErr}
                </p>
              )}
            </div>

            {/* spam trap: hidden from people, filled in by bots */}
            <input ref={trap} type="text" name="company" tabIndex={-1} autoComplete="off" className="cr-trap" aria-hidden="true" />
          </form>

          <div className="cr-letter">
            <img className="cr-clip" src="/images/desk/paperclip.webp" alt="" aria-hidden="true" />
            {status.s === "sent" ? (
              <div className="cr-done" role="status">
                <p className="cr-letter-lbl">Sent</p>
                <p className="cr-done-h">Thank you, {name.trim().split(" ")[0]}!</p>
                <p className="cr-done-p">
                  Your application{cv ? " and CV are" : " is"} in our inbox. We reply to everyone within 5 working days, at{" "}
                  <b>{email.trim()}</b>.
                </p>
              </div>
            ) : (
              <>
                <p className="cr-letter-lbl">Your message</p>
                <div className="cr-letter-msg" aria-live="polite">
                  <p>
                    Hi Ankora! I’m {blank(name.trim())}, and I’d like to apply as {blank(seat)}.
                  </p>
                  {bg && <p>I’m {blank(bg)}.</p>}
                  {link.trim() && (
                    <p>
                      You can see more of me here: <mark>{link.trim()}</mark>
                    </p>
                  )}
                  {about.trim() && <p>{about.trim()}</p>}
                  <p>{cv ? <>My CV is attached: <mark>{cv.name}</mark></> : "My CV is attached."}</p>
                </div>

                <div className="cr-send">
                  <button type="submit" form="cr-apply-form" className="cr-btn cr-btn-fill" disabled={sending}>
                    {sending ? "Sending…" : "Send application"} {!sending && <span aria-hidden="true">→</span>}
                  </button>
                </div>
                {(nudge || status.s === "error") && (
                  <p className="cr-nudge" role="alert">
                    {nudge || (status.s === "error" && `${status.msg} Try WhatsApp or email below.`)}
                  </p>
                )}

                <p className="cr-or">
                  <span>or send it your way</span>
                </p>
                <div className="cr-alt">
                  <a href={waLink(plain)} target="_blank" rel="noopener" onClick={guard}>
                    WhatsApp
                  </a>
                  <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(plain + "\n\n")}`} onClick={guard}>
                    Your email app
                  </a>
                </div>
                <p className="cr-cv">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21 11.5l-8.6 8.6a5 5 0 0 1-7.1-7.1l8.6-8.6a3.3 3.3 0 0 1 4.7 4.7l-8.6 8.6a1.7 1.7 0 0 1-2.4-2.4l7.9-7.9" />
                  </svg>
                  Going that way? Attach your CV in the chat or email before you send.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
