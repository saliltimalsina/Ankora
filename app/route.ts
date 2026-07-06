import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Root route handler: serve the Ankora homepage snapshot with the shared navbar.
//
// The homepage is a hydrated React (RSC) snapshot, so replacing its nav markup
// in place gets clobbered on hydration. Instead we append the shared component
// (partials/navbar.html) at the end of <body> — nodes there are outside React's
// reconciled tree and survive hydration — and hide the original React nav with
// scoped CSS (matches the fixed nav wrappers but not our .ankc-nav-* ones).
// Result: /contact and / render the exact same navbar. The /amplify/_next
// chunks still load so the rest of the homepage animates as before.
export const dynamic = "force-static";

const HIDE_REACT_NAV =
  '<style id="ankc-hide-react-nav">' +
  ".rt-fixed.rt-top-0.rt-h-1100:not(.ankc-nav-desktop):not(.ankc-nav-mobile){display:none!important}" +
  "</style>";

export async function GET() {
  const [page, navbar] = await Promise.all([
    readFile(join(process.cwd(), "ankora.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "navbar.html"), "utf8"),
  ]);
  const html = page.replace("</body>", HIDE_REACT_NAV + navbar + "</body>");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
