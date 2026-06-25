import { readFile } from "node:fs/promises";
import { join } from "node:path";

// /contact-v2 route handler: serve the Contactv2 flat-lay design.
// Self-contained HTML (inline CSS + fonts); assets load from /public.
export const dynamic = "force-static";

export async function GET() {
  const html = await readFile(join(process.cwd(), "contact-v2.html"), "utf8");
  return new Response(html, {
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
