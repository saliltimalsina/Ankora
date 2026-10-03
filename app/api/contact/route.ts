import { SITE } from "../../../lib/site";
import { chipLabel } from "../../../lib/brief";
import { confirmation, fail, field, isEmail, looksLikeBot, mailReady, notification, send } from "../../../lib/mail";

// POST /api/contact: the /contact enquiry form (components/contact/brief.tsx).
// Emails the enquiry to the studio inbox (Reply-To the sender), then sends the
// sender a "we've got it" email. See lib/mail.ts for the Brevo setup. Without
// BREVO_API_KEY the route answers 503 and the form points people to WhatsApp
// or email instead.

export const runtime = "nodejs";

export async function POST(req: Request) {
  if (!mailReady()) return fail(503, "Our form isn’t switched on yet.");

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return fail(400, "That didn’t come through. Please try again.");
  }
  if (looksLikeBot(form)) return Response.json({ ok: true });

  const name = field(form, "name", 120);
  const email = field(form, "email", 200);
  const phone = field(form, "phone", 40);
  // chip labels from the page (Startup, Website, ASAP…); anything else is dropped
  const who = chipLabel("who", field(form, "who", 40));
  const need = chipLabel("need", field(form, "need", 40));
  const when = chipLabel("when", field(form, "when", 40));
  const message = field(form, "message", 3000);

  if (!name) return fail(400, "Add your name.");
  if (!isEmail(email)) return fail(400, "Add an email address we can reply to.");

  const sent = await send({
    to: { email: SITE.email, name: "Ankora Labs" },
    replyTo: { email, name },
    subject: `Project enquiry: ${need || "General"} — ${name}`,
    html: notification(
      `New enquiry${need ? `: ${need}` : ""}`,
      [
        ["Name", name],
        ["Email", email],
        ["Phone", phone],
        ["They are", who],
        ["They need", need],
        ["When", when],
      ],
      message,
      `Sent from ankoralabs.com/contact. Reply to this email to answer ${name}.`,
    ),
  });
  if (!sent) return fail(502, "We couldn’t send that just now.");

  // the sender's copy; the enquiry is already in, so a failure here is only logged
  await send({
    to: { email, name },
    subject: "We’ve got your message — Ankora Labs",
    ...confirmation({
      name,
      intro: "Your message is in our inbox, and a real person will reply within 24 hours, weekends too.",
      summary: [
        ["You are", who],
        ["You need", need],
        ["When", when],
      ],
      steps: [
        "We reply within 24 hours by email, or WhatsApp if you left a number.",
        "A free 30-minute call about your business and what you need built.",
        "A written plan with scope, timeline and a fixed quote in NPR.",
      ],
      waText: "Hi Ankora! I just sent you a message through your website.",
    }),
  });

  return Response.json({ ok: true });
}
