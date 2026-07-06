import { readFile } from "node:fs/promises";
import { join } from "node:path";

// /contact route handler: serve the Ankora contact page.
// The shared navbar lives in partials/navbar.html and is injected at the
// <!--ANKORA_NAV--> marker, so the bar stays consistent with the rest of the
// site and only needs to be edited in one place. Assets (/amplify/_next
// chunks, /images, /fonts) load from /public.
export const dynamic = "force-static";

export async function GET() {
  const [page, navbar] = await Promise.all([
    readFile(join(process.cwd(), "contact.html"), "utf8"),
    readFile(join(process.cwd(), "partials", "navbar.html"), "utf8"),
  ]);
  const html = page.replace("<!--ANKORA_NAV-->", navbar);
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
