import { SITE } from "../../../lib/site";
import { SEATS, BACKGROUND } from "../../../lib/careers";
import { confirmation, fail, field, isEmail, looksLikeBot, mailReady, notification, send } from "../../../lib/mail";

// POST /api/apply: the /careers application form (components/careers/apply.tsx).
// Emails the application, CV attached, to the studio inbox (Reply-To the
// applicant), then sends the applicant a "we've got it" email. See lib/mail.ts
// for the Brevo setup. Without BREVO_API_KEY the route answers 503 and the
// form points people to WhatsApp or email instead.

export const runtime = "nodejs";

const MAX_CV = 4 * 1024 * 1024; // Vercel caps request bodies at 4.5 MB
const CV_TYPES = /\.(pdf|docx?)$/i;

export async function POST(req: Request) {
  if (!mailReady()) return fail(503, "Applications by form aren’t switched on yet.");

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
  // chip labels from the page; anything else is dropped
  const seat = SEATS.find((s) => s.label === field(form, "seat", 80))?.label ?? "";
  const background = BACKGROUND.find((b) => b.label === field(form, "background", 80))?.label ?? "";
  const link = field(form, "link", 300);
  const about = field(form, "about", 2000);

  if (!name || !seat) return fail(400, "Add your name and pick a role.");
  if (!isEmail(email)) return fail(400, "Add an email address we can reply to.");

  const cv = form.get("cv");
  let attachment: { name: string; content: string }[] | undefined;
  if (cv instanceof File && cv.size > 0) {
    if (!CV_TYPES.test(cv.name)) return fail(400, "Your CV needs to be a PDF or Word file.");
    if (cv.size > MAX_CV) return fail(400, "Your CV is over 4 MB. Try a smaller PDF, or send it on WhatsApp.");
    attachment = [{ name: cv.name.replace(/[^\w.\- ]+/g, "_"), content: Buffer.from(await cv.arrayBuffer()).toString("base64") }];
  }

  const sent = await send({
    to: { email: SITE.email, name: "Ankora Labs" },
    replyTo: { email, name },
    subject: `Application: ${seat} — ${name}`,
    html: notification(
      `New application: ${seat}`,
      [
        ["Name", name],
        ["Role", seat],
        ["Email", email],
        ["Phone", phone],
        ["Experience", background],
        ["Link", link],
        ["CV", attachment ? attachment[0].name : "Not attached"],
      ],
      about,
      `Sent from ankoralabs.com/careers. Reply to this email to answer ${name}.`,
    ),
    attachment,
  });
  if (!sent) return fail(502, "We couldn’t send that just now.");

  // the applicant's copy; the application is already in, so a failure here
  // is only logged
  await send({
    to: { email, name },
    subject: "We’ve got your application — Ankora Labs",
    html: confirmation({
      name,
      heading: "Application received",
      intro: `Your application${attachment ? " and CV are" : " is"} in our inbox, and a real person will read ${attachment ? "them" : "it"}.`,
      summary: [
        ["Role", seat],
        ["CV", attachment ? "Attached" : "Not attached. Reply with it any time"],
      ],
      steps: [
        "We reply to everyone within 5 working days, even when it’s a no.",
        "If it’s a fit, we set up a 30-minute online chat.",
        "Your role, terms and commission are agreed in writing before you start.",
      ],
      waText: `Hi Ankora! I applied for the ${seat} role.`,
    }),
  });

  return Response.json({ ok: true });
}
