import { readFile } from "node:fs/promises";
import { join } from "node:path";

// Root route handler: serve the Ankora snapshot document untouched.
// The browser then loads the original /amplify/_next chunks from /public and
// hydrates, so every animation runs identically to the source site.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(join(process.cwd(), "ankora.html"), "utf8");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
