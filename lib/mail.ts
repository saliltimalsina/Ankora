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

/** Hidden "hp" field filled in, or sent faster than a person could: a bot.
 *  The trap is named "hp", not something like "company", because browser
 *  autofill fills recognisable names and real people got dropped as bots.
 *  Drops are logged, since the bot gets a fake "ok" back. */
export function looksLikeBot(f: FormData) {
  const t = Number(field(f, "t"));
  const why = field(f, "hp") ? "trap filled" : !t ? "no timestamp" : Date.now() - t < 3000 ? "too fast" : "";
  if (why) console.warn("mail: dropped as bot,", why);
  return !!why;
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
  attachment?: { name: string; content: string }[];
};

export async function send({ to, replyTo, subject, html, attachment }: Send) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": process.env.BREVO_API_KEY!, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Ankora Labs", email: process.env.APPLY_FROM || SITE.email },
      to: [to],
      replyTo: replyTo ?? { email: SITE.email, name: "Ankora Labs" },
      subject,
      htmlContent: html,
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

const C = { ink: "#002813", green: "#004822", lime: "#d5e27b", paper: "#fbf8ef", line: "#e3decf", text: "#3c5141", muted: "#7a8a7d" };
const FONT = "font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,Arial,sans-serif;";

/**
 * The "we've got it" email, in the site's colours. Every argument is either
 * our own copy or a value the sender picked from a fixed list, never free text.
 */
export function confirmation(o: {
  name: string;
  heading: string;
  intro: string;
  summary?: [string, string][];
  steps: string[];
  waText: string;
}) {
  const summary = (o.summary ?? []).filter(([, v]) => v);
  const btn = (href: string, label: string, solid: boolean) =>
    `<a href="${esc(href)}" style="${FONT}display:inline-block;margin:0 8px 8px 0;padding:12px 22px;border-radius:99px;font-size:15px;font-weight:600;text-decoration:none;${
      solid ? `background:${C.green};color:${C.lime};` : `border:1.5px solid ${C.green};color:${C.green};`
    }">${label}</a>`;

  return `<!doctype html><html><body style="margin:0;padding:0;background:${C.paper};">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${C.paper};padding:24px 12px;">
<tr><td align="center">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fffef7;border:1px solid ${C.line};border-radius:18px;overflow:hidden;">
  <tr><td style="background:${C.ink};padding:22px 28px;${FONT}font-size:22px;font-weight:700;letter-spacing:.5px;color:${C.lime};">Ankora Labs</td></tr>
  <tr><td style="padding:30px 28px 8px;${FONT}">
    <p style="margin:0 0 6px;font-size:13px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">${esc(o.heading)}</p>
    <h1 style="margin:0 0 16px;font-size:26px;line-height:1.2;color:${C.ink};">Thanks, ${esc(firstName(o.name))}!</h1>
    <p style="margin:0 0 18px;font-size:16px;line-height:1.6;color:${C.text};">${o.intro}</p>
    ${
      summary.length
        ? `<table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;margin:0 0 20px;background:${C.paper};border:1px solid ${C.line};border-radius:12px;">
      ${summary
        .map(
          ([k, v]) =>
            `<tr><td style="${FONT}padding:10px 16px;font-size:13px;color:${C.muted};width:110px;">${esc(k)}</td><td style="${FONT}padding:10px 16px 10px 0;font-size:15px;color:${C.ink};">${esc(v)}</td></tr>`,
        )
        .join("")}
    </table>`
        : ""
    }
    <p style="margin:0 0 8px;font-size:13px;letter-spacing:1.6px;text-transform:uppercase;color:${C.muted};">What happens next</p>
    <ol style="margin:0 0 22px;padding-left:20px;font-size:15px;line-height:1.6;color:${C.text};">
      ${o.steps.map((s) => `<li style="margin-bottom:6px;">${s}</li>`).join("")}
    </ol>
    <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:${C.text};">Want to add something? Just reply to this email, or message us:</p>
    <p style="margin:0 0 6px;">${btn(waLink(o.waText), "Chat on WhatsApp", true)}${btn(SITE.calUrl, "Book a 30-min call", false)}</p>
  </td></tr>
  <tr><td style="padding:18px 28px 26px;border-top:1px solid ${C.line};${FONT}font-size:12.5px;line-height:1.6;color:${C.muted};">
    Ankora Labs · Web design &amp; development · Kathmandu, Nepal<br>
    <a href="mailto:${SITE.email}" style="color:${C.green};">${SITE.email}</a> · ${esc(SITE.phone)}<br>
    You’re getting this because this address was used on a form at ankoralabs.com. If that wasn’t you, ignore this email.
  </td></tr>
</table>
</td></tr></table></body></html>`;
}
