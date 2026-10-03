import { SITE } from "../../../lib/site";

// POST /api/apply: the /careers application form (components/careers/apply.tsx).
// Emails the application, with the CV attached, to the studio inbox through
// Brevo's transactional email API. Reply-To is the applicant, so answering the
// email answers them.
//
// Needs BREVO_API_KEY in the Vercel project's environment. APPLY_FROM is the
// sender address, which must be a verified sender (or on a verified domain) in
// Brevo; it defaults to the studio address. Without the key the route answers
// 503 and the form points people to WhatsApp or email instead.

export const runtime = "nodejs";

const MAX_CV = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB
const CV_TYPES = /\.(pdf|docx?)$/i;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);
const field = (f: FormData, k: string, max = 300) => String(f.get(k) ?? "").trim().slice(0, max);
const fail = (status: number, error: string) => Response.json({ ok: false, error }, { status });

export async function POST(req: Request) {
  const key = process.env.BREVO_API_KEY;
  if (!key) return fail(503, "Applications by form aren’t switched on yet.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "That didn’t come through. Please try again.");
  }

  // bots fill the hidden field; pretend it worked
  if (field(form, "company")) return Response.json({ ok: true });

  const name = field(form, "name", 120);
  const email = field(form, "email", 200);
  const phone = field(form, "phone", 40);
  const seat = field(form, "seat", 80);
  const background = field(form, "background", 80);
  const link = field(form, "link", 300);
  const about = field(form, "about", 2000);

  if (!name || !seat) return fail(400, "Add your name and pick a role.");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail(400, "Add an email address we can reply to.");

  const cv = form.get("cv");
  let attachment: { name: string; content: string }[] | undefined;
  if (cv instanceof File && cv.size > 0) {
    if (!CV_TYPES.test(cv.name)) return fail(400, "Your CV needs to be a PDF or Word file.");
    if (cv.size > MAX_CV) return fail(400, "Your CV is over 4 MB. Try a smaller PDF, or send it on WhatsApp.");
    attachment = [{ name: cv.name.replace(/[^\w.\- ]+/g, "_"), content: Buffer.from(await cv.arrayBuffer()).toString("base64") }];
  }

  const rows: [string, string][] = [
    ["Name", name],
    ["Role", seat],
    ["Email", email],
    ["Phone", phone],
    ["Experience", background],
    ["Link", link],
    ["CV", attachment ? attachment[0].name : "Not attached"],
  ];
  const html =
    `<h2 style="font-family:sans-serif;margin:0 0 12px">New application: ${esc(seat)}</h2>` +
    `<table style="font-family:sans-serif;font-size:14px;border-collapse:collapse">` +
    rows
      .filter(([, v]) => v)
      .map(([k, v]) => `<tr><td style="padding:4px 16px 4px 0;color:#667">${k}</td><td style="padding:4px 0">${esc(v)}</td></tr>`)
      .join("") +
    `</table>` +
    (about ? `<p style="font-family:sans-serif;font-size:14px;white-space:pre-wrap;margin-top:16px">${esc(about)}</p>` : "") +
    `<p style="font-family:sans-serif;font-size:12px;color:#889;margin-top:24px">Sent from ankoralabs.com/careers. Reply to this email to answer ${esc(name)}.</p>`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": key, "content-type": "application/json", accept: "application/json" },
    body: JSON.stringify({
      sender: { name: "Ankora Labs Careers", email: process.env.APPLY_FROM || SITE.email },
      to: [{ email: SITE.email, name: "Ankora Labs" }],
      replyTo: { email, name },
      subject: `Application: ${seat} — ${name}`,
      htmlContent: html,
      attachment,
    }),
  });

  if (!res.ok) {
    console.error("apply: brevo", res.status, await res.text().catch(() => ""));
    return fail(502, "We couldn’t send that just now.");
  }
  return Response.json({ ok: true });
}
