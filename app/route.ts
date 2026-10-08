import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { siteUrl } from "../lib/site-url";
import { SITE } from "../lib/site";
import { kitCss, kitHtml, kitScripts } from "../lib/kit";

// Root route handler: serve the Ankora homepage snapshot with the shared navbar
// and the shared preloader.
//
// The homepage is a hydrated React (RSC) snapshot, so replacing its nav markup
// in place gets clobbered on hydration. Instead the shared nav
// (components/kit/nav.html, the same one every React page renders) is appended
// at the end of <body>, where nodes sit outside React's reconciled tree and
// survive hydration, and the snapshot's own React nav is hidden with scoped CSS.
// The other shared pieces fill <!--KIT:...--> markers in ankora.html: the
// footer, its CSS and the work showcase. The "Let's build" ending ships as a
// <template> that public/kit/home.js inserts after load (like the showcase).
// The /amplify/_next chunks still load so the rest of the homepage animates as
// before.
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
// JSON-LD blocks get the same treatment (schema.org wants absolute URLs), the
// older one's "Ankora" name is aligned with the "Ankora Labs" used everywhere
// else, and each Organization in them gets the studio's address and contact point.
//
// The snapshot still holds two hidden links to the source site's pages
// (/accounts-payable/, /invoices/) that 404 here; crawlers follow hidden links
// too, so they're pointed at /services.
export const dynamic = "force-static";

const ABSOLUTE_META = /(<meta (?:property|name)="(?:og:url|og:image|twitter:image)" content=|<link rel="canonical" href=)"\/([^"]*)"/g;
const JSON_LD = /(<script type="application\/ld\+json">)([\s\S]*?)(<\/script>)/g;
const JSON_LD_URL = /"(url|logo|@id)":"\/([^"]*)"/g;
const DEAD_LINKS = /href="\/(?:accounts-payable|invoices)\/"/g;
// Source-site leftovers that cost requests for nothing: the Trustpilot widget
// script (no widget on the page) and preloads for press logos the page never shows.
const LEFTOVERS =
  /<script src="\/\/widget\.trustpilot\.com\/[^"]*" async=""><\/script>|<link rel="preload" href="\/images\/homepage\/logos\/[a-z-]+\.webp" as="image"\/>/g;

// The snapshot's title and description are the tagline alone, which says
// nothing about what Ankora does or where; search results get the studio's
// Nepal web design/development description instead (the searches Nepali
// buyers actually make). Only the HTML tags are rewritten: editing the same
// strings inside the RSC payload breaks the stream ("Connection closed" on
// hydration).
const OLD_TITLE = "Ankora Labs | Design. Build. Grow.";
const TITLE = "Ankora Labs | Web Design & Development Company in Nepal";
const OLD_DESC =
  "Ankora Labs designs and builds digital products that are fast, scalable, and built to make an impact.";
const DESC =
  "Ankora Labs is a web design and development studio in Kathmandu. We design and build websites, web apps and mobile apps for businesses in Nepal, from UI/UX to launch.";
const TITLE_TAGS = [
  [`<title>${OLD_TITLE}</title>`, `<title>${TITLE}</title>`],
  [`<meta property="og:title" content="${OLD_TITLE}"/>`, `<meta property="og:title" content="${TITLE}"/>`],
  [`<meta name="twitter:title" content="${OLD_TITLE}"/>`, `<meta name="twitter:title" content="${TITLE}"/>`],
  [`<meta name="description" content="${OLD_DESC}"/>`, `<meta name="description" content="${DESC}"/>`],
  [`<meta property="og:description" content="${OLD_DESC}"/>`, `<meta property="og:description" content="${DESC}"/>`],
  [`<meta name="twitter:description" content="${OLD_DESC}"/>`, `<meta name="twitter:description" content="${DESC}"/>`],
];
// Hydration puts the payload's old title and description back, and search
// engines read the rendered page, so keep both on the new ones.
const KEEP_TITLE =
  "<script>(function(){var t=" +
  JSON.stringify(TITLE) +
  ",d=" +
  JSON.stringify(DESC) +
  ";function f(){if(document.title!==t)document.title=t;" +
  "var m=document.querySelector('meta[name=\"description\"]');if(m&&m.content!==d)m.content=d}f();" +
  "new MutationObserver(f).observe(document.head,{childList:true,subtree:true,characterData:true,attributes:true})})()</script>";

// The homepage is also served as Markdown (middleware.ts); say where.
const MARKDOWN_ALTERNATE = '<link rel="alternate" type="text/markdown" href="/index.md"/>';

// The snapshot only links favicon.svg; Google's search-result icon wants a
// square raster in a multiple of 48px too, so offer the same set as the React pages.
const ICONS =
  '<link rel="icon" href="/favicon.ico" sizes="any"/>' +
  '<link rel="icon" href="/icon-192.png" sizes="192x192" type="image/png"/>' +
  '<link rel="apple-touch-icon" href="/apple-touch-icon.png"/>';

const ADDRESS = { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" };
const CONTACT_POINT = {
  "@type": "ContactPoint",
  contactType: "sales",
  telephone: SITE.phone.replace(" ", "-"),
  email: SITE.email,
  url: SITE.whatsapp,
  availableLanguage: ["English", "Nepali"],
  areaServed: "NP",
};

// The snapshot's Organization entries have no address and no way to reach us.
// Readers that look only at @type Organization (not the ProfessionalService
// below) need both there to answer "where are they, how do I contact them".
function withContact(ld: string) {
  const data = JSON.parse(ld);
  for (const node of data["@graph"] ?? [data]) {
    if (node["@type"] === "Organization") Object.assign(node, { address: ADDRESS, contactPoint: CONTACT_POINT });
  }
  return JSON.stringify(data).replace(/</g, "\\u003c");
}

// Business details the snapshot's Organization lacks (opening hours, what it
// offers, booking), on the same @id so Google merges them into one entity.
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
    email: SITE.email,
    telephone: SITE.phone.replace(" ", "-"),
    address: ADDRESS,
    areaServed: ["Nepal", "Worldwide"],
    openingHours: SITE.openingHours,
    sameAs: [SITE.linkedin, "https://clutch.co/profile/ankora-labs"],
    contactPoint: CONTACT_POINT,
    potentialAction: {
      "@type": "ReserveAction",
      name: "Book a 30-minute call",
      target: SITE.calUrl,
    },
    knowsAbout: ["Product design", "UX/UI design", "Web development", "Mobile app development", "AI development"],
  }) +
  "</script>";

// Shared components, filled into the snapshot (see the note at the top).
const KIT = () => ({
  head: `<style id="ank-kit-css">${kitCss("nav")}${kitCss("lets-build")}</style>`,
  footerCss: `<style id="ankora-footer-css">${kitCss("footer")}</style>`,
  footer: kitHtml("footer"),
  showcaseCss: `<style id="show-style">${kitCss("showcase")}</style>`,
  // showcase engine + homepage placement (showcase, "Let's build"), after site.js
  scripts:
    kitScripts() +
    '<script src="/kit/showcase.js" defer></script><script src="/kit/home.js" defer></script>' +
    `<template id="ank-lb-tpl">${kitHtml("lets-build", { SECOND_HREF: "/services", SECOND_TEXT: "Our services" })}</template>`,
  nav: kitHtml("nav"),
});

// The footer's kit HTML also goes into the React payload (row 3b), so hydration
// keeps the server-rendered footer instead of clearing it. It sits inside a JSON
// row that is itself a JS string literal: encode twice, then HTML-escape like Next.
const forPayload = (html: string) =>
  JSON.stringify(JSON.stringify(html).slice(1, -1))
    .slice(1, -1)
    .replace(/</g, "\\u003c")
    .replace(/>/g, "\\u003e")
    .replace(/&/g, "\\u0026")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");

const HIDE_REACT_NAV =
  '<style id="ankc-hide-react-nav">' +
  ".rt-fixed.rt-top-0.rt-h-1100{display:none!important}" +
  "</style>";

export async function GET() {
  const kit = KIT();
  const [page, plHead, plBody, hashScroll] = await Promise.all([
    readFile(join(process.cwd(), "ankora.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader-head.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "preloader.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "hash-scroll.html"), "utf8"),
  ]);
  const html = TITLE_TAGS.reduce((h, [from, to]) => h.replace(from, to), page)
    .replace(ABSOLUTE_META, (_, tag, path) => `${tag}"${new URL(path, siteUrl)}"`)
    .replace(JSON_LD, (_, open, body, close) =>
      open +
      withContact(
        body
          .replace('"name":"Ankora",', '"name":"Ankora Labs",')
          .replace(JSON_LD_URL, (_m: string, key: string, path: string) => `"${key}":"${new URL(path, siteUrl)}"`),
      ) +
      close,
    )
    .replace(DEAD_LINKS, 'href="/services"')
    .replace(LEFTOVERS, "")
    // function replacements: the snippets are inserted literally ("$" stays "$")
    .replace("<!--KIT:footer-css-->", () => kit.footerCss)
    .replaceAll("<!--KIT:footer-->", () => kit.footer)
    .replace("KIT_FOOTER_RSC", () => forPayload(kit.footer))
    .replace("<!--KIT:showcase-css-->", () => kit.showcaseCss)
    .replace("<!--KIT:showcase-js-->", "")
    .replace("</head>", () => ICONS + MARKDOWN_ALTERNATE + BUSINESS_LD() + kit.head + plHead + "</head>")
    .replace("</body>", () => HIDE_REACT_NAV + kit.nav + plBody + hashScroll + KEEP_TITLE + kit.scripts + "</body>");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
