import type { NextRequest } from "next/server";
import { siteUrl } from "../../../lib/site-url";
import { PAGES, htmlToMarkdown, notFoundMarkdown } from "../../../lib/markdown";

// The Markdown twin of every page. Nobody links here: middleware.ts rewrites a
// page URL to /md/<path> when the request prefers text/markdown, and "<path>.md"
// URLs the same way. Pages listed in lib/markdown.ts get their hand-built
// Markdown; any other page is fetched as HTML from this same origin and
// converted, and a path that isn't a page answers 404, still in Markdown, with
// links back to pages that exist.

const markdown = (body: string, status: number, path?: string) =>
  new Response(body, {
    status,
    headers: {
      "content-type": "text/markdown; charset=utf-8",
      vary: "Accept",
      // same policy as the HTML pages; never stored by the CDN, so the two
      // formats of one URL can't be mixed up
      "cache-control": "public, max-age=0, must-revalidate",
      ...(path ? { link: `<${siteUrl}${path}>; rel="canonical"` } : { "x-robots-tag": "noindex" }),
    },
  });

export async function GET(req: NextRequest, { params }: { params: Promise<{ path?: string[] }> }) {
  const path = "/" + ((await params).path ?? []).join("/");
  const page = PAGES[path];
  if (page) return markdown(page(), 200, path);

  // Asking for HTML keeps middleware.ts from sending this request back here.
  const res = await fetch(req.nextUrl.origin + path, {
    headers: { accept: "text/html" },
    redirect: "manual",
  }).catch(() => null);
  if (res?.status === 200 && res.headers.get("content-type")?.includes("text/html")) {
    return markdown(htmlToMarkdown(await res.text()), 200, path);
  }
  return markdown(notFoundMarkdown(path), 404);
}
