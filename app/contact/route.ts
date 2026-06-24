import { readFile } from "node:fs/promises";
import { join } from "node:path";

// /contact route handler: serve the Ankora contact page.
// Assets (/amplify/_next chunks, /images, /fonts) load from /public, so the
// navbar, footer and fonts match the rest of the site exactly.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(join(process.cwd(), "contact.html"), "utf8");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
