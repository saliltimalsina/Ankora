// Contact details and booking settings, in one place. Everything that links
// to Cal.com, WhatsApp, email or phone reads from here: React components
// directly, the shared HTML snippets in components/kit through {{TOKENS}}
// (lib/kit.ts), and public/kit/site.js through window.ANKORA.

const CAL_LINK = "ankoralabs/30min";

export const SITE = {
  email: "hello@ankoralabs.com",
  careersEmail: "careers@ankoralabs.com", // job applications (/careers form)
  phone: "+977 9840171882",
  phoneHref: "tel:+9779840171882",
  whatsapp: "https://wa.me/ankoralabs",
  whatsappHandle: "@ankoralabs",
  linkedin: "https://www.linkedin.com/company/ankoralabs",
  // keep both in step with the Google Business Profile hours
  openingHours: "Su-Fr 09:00-18:00", // schema.org format
  hoursText: "Sunday to Friday, 09:00 to 18:00 Nepal time (UTC+5:45)",
  calLink: CAL_LINK,
  calUrl: `https://cal.com/${CAL_LINK}`,
  calNamespace: "30min",
  calConfig: '{"layout":"month_view","useSlotsViewOnSmallScreen":"true","theme":"light"}',
  waHello: "Hi Ankora! I'd like to talk about a project.",
} as const;

/** WhatsApp chat link with a message already typed. */
export const waLink = (text: string = SITE.waHello) => `${SITE.whatsapp}?text=${encodeURIComponent(text)}`;

/** Attributes that make any <a> open the Cal.com popup (public/kit/site.js). The href is the fallback. */
export const BOOK_ATTRS = {
  href: SITE.calUrl,
  "data-cal-link": SITE.calLink,
  "data-cal-namespace": SITE.calNamespace,
  "data-cal-config": SITE.calConfig,
} as const;
