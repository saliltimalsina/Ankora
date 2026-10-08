// Content negotiation for the Markdown twins (middleware.ts). A request gets
// Markdown when its Accept header names text/markdown with a q-value above 0
// that is at least text/html's (RFC 9110 section 12.5.1). Wildcards never ask
// for Markdown: browsers and crawlers that send */* keep getting HTML.
export function prefersMarkdown(accept: string | null): boolean {
  if (!accept) return false;
  let md = 0;
  let html = 0;
  for (const part of accept.split(",")) {
    const [type, ...params] = part.split(";").map((p) => p.trim().toLowerCase());
    const qParam = params.find((p) => p.startsWith("q="));
    const q = qParam ? Number(qParam.slice(2)) : 1;
    if (!(q >= 0 && q <= 1)) continue;
    if (type === "text/markdown") md = q;
    else if (type === "text/html" || type === "application/xhtml+xml") html = Math.max(html, q);
  }
  return md > 0 && md >= html;
}
