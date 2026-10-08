import { NextResponse, type NextRequest } from "next/server";
import { prefersMarkdown } from "./lib/accept";

// Markdown for agents. Every page has a Markdown twin served by
// app/md/[[...path]]/route.ts, reached two ways:
//   - content negotiation: the page's own URL with "Accept: text/markdown"
//   - a plain URL: the path plus ".md" ("/services.md"; the homepage is "/index.md")
// A path that doesn't exist answers 404 with a Markdown body the same way.
// Page URLs carry "Vary: Accept" in both formats so caches keep them apart.
// Files (anything else with an extension), assets and the API are left alone.
export const config = {
  matcher: ["/((?!_next/|amplify/|api/|md/|images/|fonts/|kit/|statsig-disabled).*)"],
};

export function middleware(req: NextRequest) {
  if (req.method !== "GET" && req.method !== "HEAD") return NextResponse.next();
  const { pathname } = req.nextUrl;

  if (pathname.endsWith(".md")) {
    const page = pathname === "/index.md" ? "" : pathname.slice(0, -3);
    return NextResponse.rewrite(new URL(`/md${page}`, req.url));
  }
  if (/\.[a-z0-9]+$/i.test(pathname)) return NextResponse.next();

  if (prefersMarkdown(req.headers.get("accept"))) {
    return NextResponse.rewrite(new URL(`/md${pathname === "/" ? "" : pathname}`, req.url));
  }
  const res = NextResponse.next();
  res.headers.append("Vary", "Accept");
  return res;
}
