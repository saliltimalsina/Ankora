import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "../../lib/site-url";

// /contact route handler: serve the Ankora contact page.
// The shared navbar lives in partials/navbar.html and is injected at the
// <!--ANKORA_NAV--> marker, so the bar stays consistent with the rest of the
// site and only needs to be edited in one place. The shared preloader is
// injected the same way as on the homepage — boot snippet in <head>, overlay at
// the end of <body>. Assets (/amplify/_next chunks, /images, /fonts) load from
// /public.
//
// contact.html carries only a title and description, so the canonical and
// social-card tags are added here against siteUrl, and the title and
// description are replaced with the Kathmandu web design ones.
export const dynamic = "force-static";

const TITLE = "Contact Ankora Labs | Web Design Company in Kathmandu, Nepal";
const DESC =
  "Get a website, web app or mobile app built in Nepal. Ankora Labs is a Kathmandu web design and development team: reply within 24 hours, 7 days a week.";
// contact.html's own <title> and description are the old generic ones; they
// are swapped for the ones above on the way out.
const OLD_TITLE = "<title>Contact — Ankora Labs</title>";
const OLD_DESC = /<meta name="description" content="[^"]*"\/>/;
const SEO_HEAD =
  `<link rel="canonical" href="${siteUrl}/contact"/>` +
  `<meta property="og:title" content="${TITLE}"/>` +
  `<meta property="og:description" content="${DESC}"/>` +
  `<meta property="og:url" content="${siteUrl}/contact"/>` +
  `<meta property="og:image" content="${siteUrl}/images/homepage/meta-image.jpg"/>` +
  `<meta property="og:type" content="website"/>` +
  `<meta name="twitter:card" content="summary_large_image"/>`;

export async function GET() {
  const [page, navbar, plHead, plBody] = await Promise.all([
    readFile(join(process.cwd(), "contact.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "navbar.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader-head.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader.html"), "utf8"),
  ]);
  const html = page
    .replace(OLD_TITLE, `<title>${TITLE}</title>`)
    .replace(OLD_DESC, `<meta name="description" content="${DESC}"/>`)
    .replace("<!--ANKORA_NAV-->", navbar)
    .replace("</head>", SEO_HEAD + plHead + "</head>")
    .replace("</body>", plBody + "</body>");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
