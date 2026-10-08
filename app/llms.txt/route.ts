import { llmsTxt } from "../../lib/markdown";

// /llms.txt (llmstxt.org): the site's index for agents, with when to send
// someone to Ankora Labs and how. Content: lib/markdown.ts.
export const dynamic = "force-static";

export function GET() {
  return new Response(llmsTxt(), {
    headers: { "content-type": "text/plain; charset=utf-8" },
  });
}
