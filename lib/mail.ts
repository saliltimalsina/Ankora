import { SITE, waLink } from "./site";

// Server-side email for the site's forms (/api/contact, /api/apply), sent
// through Brevo's transactional API. Each form sends two emails:
//   1. a notification to the studio inbox, Reply-To the sender, so replying
//      answers them directly;
//   2. a "we've got it" confirmation to the sender.
// The confirmation never repeats free text the sender typed (only their first
// name and the options they picked), so the form can't be used to send
// someone else arbitrary content.
//
// Env: BREVO_API_KEY (required), APPLY_FROM (sender address, must be verified
// in Brevo; defaults to SITE.email). Server code only: never import from a
// client component.

export const mailReady = () => !!process.env.BREVO_API_KEY;

export const esc = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export const field = (f: FormData, k: string, max = 300) => String(f.get(k) ?? "").trim().slice(0, max);

export const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status });

/** Sent faster than a person could fill the form: a bot. The form sends how
 *  long it was open ("ms"), measured in the browser so server and visitor
 *  clocks are never compared. There's no hidden "honeypot" text field: browser
 *  autofill filled it and real people were dropped. Drops are logged, since
 *  the bot gets a fake "ok" back. */
export function looksLikeBot(f: FormData) {
  const ms = Number(field(f, "ms"));
  if (ms >= 3000) return false;
  console.warn("mail: dropped as bot, open for", field(f, "ms") || "no", "ms");
  return true;
}

/** First name for a greeting; anything that looks like a link or junk becomes "there". */
export function firstName(name: string) {
  const first = name.split(/\s+/)[0] ?? "";
  return /^[\p{L}][\p{L}'’-]{0,29}$/u.test(first) ? first : "there";
}

type Send = {
  to: { email: string; name?: string };
  replyTo?: { email: string; name?: string };
  subject: string;
  html: string;
  text?: string;
  attachment?: { name: string; content: string }[];
};

export async function send({ to, replyTo, subject, html, text, attachment }: Send) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Ankora Labs", email: process.env.APPLY_FROM || SITE.email },
      to: [to],
      replyTo: replyTo ?? { email: SITE.email, name: "Ankora Labs" },
      subject,
      htmlContent: html,
      textContent: text,
      attachment,
    }),
  });
  if (!res.ok) console.error("mail: brevo", res.status, await res.text().catch(() => ""));
  return res.ok;
}

/** The studio's copy: a heading, a table of fields, and an optional message. */
export function notification(heading: string, rows: [string, string][], message: string, footer: string) {
  return (
    `<h2 style="font-family:sans-serif;margin:0 0 12px">${esc(heading)}</h2>` +
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#667">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
      .join("") +
    `</table>` +
    (message ? `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${esc(message)}</p>` : "") +
    `<p style="font-family:sans-serif;font-size:12px;color:#889;margin-top:24px">${esc(footer)}</p>`
  );
}

const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

/**
 * The "we've got it" email, written like a short personal note: no banner,
 * buttons, boxes or address footer, and a plain-text part alongside the HTML.
 * Gmail files newsletter-shaped mail under Promotions; a note lands in Primary.
 * Every argument is either our own copy or a value the sender picked from a
 * fixed list, never free text.
 */
export function confirmation(o: {
  name: string;
  intro: string;
  summary?: [string, string][];
  steps: string[];
  waText: string;
}) {
  const summary = (o.summary ?? []).filter(([, v]) => v);
  const hi = `Hi ${firstName(o.name)},`;
  const extra = "If you want to add anything, just reply to this email.";

  const p = (html: string) => `<p style="margin:0 0 14px;">${html}</p>`;
  const a = (href: string, label: string) => `<a href="${esc(href)}" style="color:#004822;">${label}</a>`;
  const html = `<!doctype html><html><body style="margin:0;padding:16px;${FONT}font-size:15px;line-height:1.6;color:#1f2e25;">
<div style="max-width:560px;">
${p(esc(hi))}
${p(esc(o.intro))}
${summary.length ? p(summary.map(([k, v]) => `${esc(k)}: <b>${esc(v)}</b>`).join("<br>")) : ""}
${p("What happens next:")}
<ol style="margin:0 0 14px;padding-left:20px;">${o.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>
${p(`${esc(extra)} You can also ${a(waLink(o.waText), "message us on WhatsApp")} or ${a(SITE.calUrl, "book a call")}.`)}
${p("Thanks,<br>Ankora Labs")}
</div></body></html>`;

  const text = [
    hi,
    o.intro,
    summary.map(([k, v]) => `${k}: ${v}`).join("\n"),
    "What happens next:\n" + o.steps.map((s, i) => `${i + 1}. ${s}`).join("\n"),
    `${extra}\nWhatsApp: ${waLink(o.waText)}\nBook a call: ${SITE.calUrl}`,
    "Thanks,\nAnkora Labs",
  ]
    .filter(Boolean)
    .join("\n\n");

  return { html, text };
}
