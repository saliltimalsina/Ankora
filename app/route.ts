import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "../lib/site-url";

// Root route handler: serve the Ankora homepage snapshot with the shared navbar
// and the shared preloader.
//
// The homepage is a hydrated React (RSC) snapshot, so replacing its nav markup
// in place gets clobbered on hydration. Instead we append the shared component
// (partials/navbar.html) at the end of <body> — nodes there are outside React's
// reconciled tree and survive hydration — and hide the original React nav with
// scoped CSS (matches the fixed nav wrappers but not our .ankc-nav-* ones).
// Result: /contact and / render the exact same navbar. The /amplify/_next
// chunks still load so the rest of the homepage animates as before.
//
// The preloader follows the same rule: its overlay goes at the end of <body>,
// while the small boot snippet that paints the green ground goes in <head> so
// nothing of the page flashes before the mark draws.
//
// partials/hash-scroll.html makes /#section links from other pages land on
// their section (those sections are injected after load, so the browser's own
// jump misses them).
//
// The snapshot's og:url, og:image, twitter:image and canonical are root-relative,
// which link-preview scrapers ignore, so they're rewritten against siteUrl. The
// JSON-LD blocks get the same treatment (schema.org wants absolute URLs), and the
// older one's "Ankora" name is aligned with the "Ankora Labs" used everywhere else.
//
// The snapshot still holds two hidden links to the source site's pages
// (/accounts-payable/, /invoices/) that 404 here; crawlers follow hidden links
// too, so they're pointed at /services.
export const dynamic = "force-static";

const ABSOLUTE_META = /(<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content=|<link rel="canonical" href=)"\/([^"]*)"/g;
const JSON_LD = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
const JSON_LD_URL = /"(url|logo|@id)":"\/([^"]*)"/g;
const DEAD_LINKS = /href="\/(?:accounts-payable|invoices)\/"/g;

// The snapshot's title is the tagline alone, which says nothing about what
// Ankora does; search results get the studio description instead. Only the
// HTML tags are rewritten: editing the same string inside the RSC payload
// breaks the stream ("Connection closed" on hydration).
const OLD_TITLE = "Ankora Labs | Design. Build. Grow.";
const TITLE = "Ankora Labs | Product Design & Development Studio";
const TITLE_TAGS = [
  [`<title>${OLD_TITLE}</title>`, `<title>${TITLE}</title>`],
  [`<meta property="og:title" content="${OLD_TITLE}"/>`, `<meta property="og:title" content="${TITLE}"/>`],
  [`<meta name="twitter:title" content="${OLD_TITLE}"/>`, `<meta name="twitter:title" content="${TITLE}"/>`],
];
// Hydration puts the payload's old title back, and search engines read the
// rendered page, so keep document.title on the new one.
const KEEP_TITLE =
  "<script>(function(){var t=" +
  JSON.stringify(TITLE) +
  ";function f(){if(document.title!==t)document.title=t}f();" +
  "new MutationObserver(f).observe(document.head,{childList:true,subtree:true,characterData:true})})()</script>";

// Business details the snapshot's Organization lacks (location, contact, what
// it offers), on the same @id so Google merges them into one entity.
const BUSINESS_LD = () =>
  '<script type="application/ld+json">' +
  JSON.stringify({
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${siteUrl}/#organization`,
    name: "Ankora Labs",
    url: `${siteUrl}/`,
    logo: `${siteUrl}/images/logos/ankora-labs.svg`,
    image: `${siteUrl}/images/homepage/meta-image.jpg`,
    email: "ankoralabscontact@gmail.com",
    telephone: "+977-9840171882",
    address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
    areaServed: "Worldwide",
    knowsAbout: ["Product design", "UX/UI design", "Web development", "Mobile app development", "AI development"],
  }) +
  "</script>";

const HIDE_REACT_NAV =
  '<style id="ankc-hide-react-nav">' +
  ".rt-fixed.rt-top-0.rt-h-1100:not(.ankc-nav-desktop):not(.ankc-nav-mobile){display:none!important}" +
  "</style>";

export async function GET() {
  const [page, navbar, plHead, plBody, hashScroll] = await Promise.all([
    readFile(join(process.cwd(), "ankora.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "navbar.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader-head.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "hash-scroll.html"), "utf8"),
  ]);
  const html = TITLE_TAGS.reduce((h, [from, to]) => h.replace(from, to), page)
    .replace(ABSOLUTE_META, (_, tag, path) => `${tag}"${new URL(path, siteUrl)}"`)
    .replace(JSON_LD, (_, open, body, close) =>
      open +
      body
        .replace('"name":"Ankora",', '"name":"Ankora Labs",')
        .replace(JSON_LD_URL, (_m: string, key: string, path: string) => `"${key}":"${new URL(path, siteUrl)}"`) +
      close,
    )
    .replace(DEAD_LINKS, 'href="/services"')
    .replace("</head>", BUSINESS_LD() + plHead + "</head>")
    .replace("</body>", HIDE_REACT_NAV + navbar + plBody + hashScroll + KEEP_TITLE + "</body>");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
