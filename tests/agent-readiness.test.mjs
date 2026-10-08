// What agents get from the site: Markdown by content negotiation and at .md
// URLs, a Markdown 404, /llms.txt, and the homepage's headings and schema.
//
//   npm test                                  build, start on a spare port, test
//   BASE_URL=https://ankoralabs.com npm test  test a deployment instead
import { test, before, after } from "node:test";
import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const PORT = 3299;
const BASE = (process.env.BASE_URL ?? `http://localhost:${PORT}`).replace(/\/$/, "");
let server;

before(async () => {
  if (process.env.BASE_URL) return;
  server = spawn("npx", ["next", "start", "-p", String(PORT)], { stdio: "ignore" });
  for (let i = 0; i < 100; i++) {
    if (await fetch(`${BASE}/robots.txt`).then((r) => r.ok, () => false)) return;
    await new Promise((r) => setTimeout(r, 200));
  }
  throw new Error("next start did not come up. Run `npm run build` first.");
});
after(() => server?.kill());

const get = (path, accept) => fetch(BASE + path, { headers: accept ? { accept } : {}, redirect: "manual" });
const type = (res) => res.headers.get("content-type") ?? "";
const varies = (res) => /(^|,\s*)accept(\s*,|$)/i.test(res.headers.get("vary") ?? "");
const MISSING = "/__no-such-page-probe-moo058m5";

test("homepage: Accept text/markdown gets Markdown with Vary: Accept", async () => {
  const res = await get("/", "text/markdown");
  assert.equal(res.status, 200);
  assert.equal(type(res), "text/markdown; charset=utf-8");
  assert.ok(varies(res), `Vary is "${res.headers.get("vary")}"`);
  const body = await res.text();
  assert.match(body, /^# Ankora Labs\n/);
  assert.ok(body.length > 500);
  assert.doesNotMatch(body, /<(div|script|html)\b/);
});

test("homepage: Accept text/html still gets HTML, with Vary: Accept", async () => {
  for (const accept of ["text/html", "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8", "*/*", undefined]) {
    const res = await get("/", accept);
    assert.equal(res.status, 200);
    assert.equal(type(res), "text/html; charset=utf-8", `Accept: ${accept}`);
    assert.ok(varies(res), `Vary is "${res.headers.get("vary")}"`);
    assert.match(await res.text(), /^<!DOCTYPE html>/i);
  }
});

test("q-values decide between Markdown and HTML", async () => {
  const cases = [
    ["text/markdown, text/html;q=0.9, */*;q=0.1", "markdown"],
    ["text/markdown, text/html, */*", "markdown"],
    ["text/html;q=0.5, text/markdown;q=0.8", "markdown"],
    ["text/html, text/markdown;q=0.9", "html"],
    ["text/markdown;q=0, text/html", "html"],
    ["text/markdown;q=0, */*", "html"],
  ];
  for (const [accept, want] of cases) {
    const res = await get("/services", accept);
    assert.equal(res.status, 200);
    assert.ok(type(res).startsWith(`text/${want}`), `Accept: ${accept} gave ${type(res)}`);
    await res.arrayBuffer();
  }
});

test("every page in the sitemap negotiates Markdown and has a .md URL", async () => {
  const xml = await (await get("/sitemap.xml")).text();
  const paths = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => new URL(m[1]).pathname);
  assert.ok(paths.length >= 6);
  for (const path of paths) {
    const negotiated = await get(path, "text/markdown");
    assert.equal(negotiated.status, 200, path);
    assert.equal(type(negotiated), "text/markdown; charset=utf-8", path);
    assert.ok(varies(negotiated), path);
    const body = await negotiated.text();
    assert.match(body, /^# \S/m, `${path} has no H1`);
    assert.ok(body.length > 500, `${path} is only ${body.length} chars`);
    assert.doesNotMatch(body, /<\/?(div|span|script|p)\b/, `${path} leaks HTML`);

    const direct = await get(path === "/" ? "/index.md" : `${path}.md`);
    assert.equal(direct.status, 200, `${path}.md`);
    assert.equal(type(direct), "text/markdown; charset=utf-8");
    assert.equal(await direct.text(), body);
  }
});

test("pages converted from HTML keep their text and links", async () => {
  const body = await (await get("/privacy", "text/markdown")).text();
  assert.match(body, /^# \S/m);
  assert.match(body, /^## (\d+ )?Who we are$/m);
  assert.match(body, /^- \*\*When you book a call:\*\* your name.*\n- \*\*When you message us on WhatsApp:\*\*.*\n- \*\*When you email us:\*\*/m);
  assert.match(body, /\[hello@ankoralabs\.com\]\(mailto:hello@ankoralabs\.com\)/);
  assert.match(body, /^- \*\*When you book a call:\*\*/m);
});

test("a missing page: 404 with a Markdown body for agents", async () => {
  for (const path of [MISSING, `${MISSING}.md`, `${MISSING}/deeper`]) {
    const res = await get(path, "text/markdown");
    assert.equal(res.status, 404, path);
    assert.equal(type(res), "text/markdown; charset=utf-8", path);
    assert.ok(varies(res));
    const body = await res.text();
    assert.match(body, /^# 404: Page not found/);
    assert.match(body, /\/llms\.txt\)/);
    assert.match(body, /\/sitemap\.xml\)/);
  }
});

test("a missing page: browsers still get the branded HTML 404", async () => {
  const res = await get(MISSING, "text/html");
  assert.equal(res.status, 404);
  assert.ok(type(res).startsWith("text/html"));
  assert.match(await res.text(), /off-grid/);
});

test("files and the API are not negotiated", async () => {
  const robots = await get("/robots.txt", "text/markdown");
  assert.equal(robots.status, 200);
  assert.ok(type(robots).startsWith("text/plain"));
  const icon = await get("/favicon.ico", "text/markdown");
  assert.equal(icon.status, 200);
  assert.ok(type(icon).startsWith("image/"));
  const api = await fetch(`${BASE}/api/contact`, { headers: { accept: "text/markdown" } });
  assert.ok(!type(api).startsWith("text/markdown"));
});

test("/llms.txt follows llmstxt.org and says when to use Ankora Labs", async () => {
  const res = await get("/llms.txt");
  assert.equal(res.status, 200);
  assert.ok(type(res).startsWith("text/plain"));
  const body = await res.text();
  const lines = body.split("\n");
  assert.equal(lines[0], "# Ankora Labs");
  assert.equal(body.match(/^# /gm).length, 1, "exactly one H1");
  assert.match(lines[2], /^> \S/, "blockquote summary after the H1");
  assert.match(body, /^## When to use Ankora Labs$/m);
  assert.match(body, /^## Optional$/m);
  assert.doesNotMatch(body, /^#{3,} /m, "no headings below H2");

  // every H2 section is a list of "- [name](url): notes" links, and each link resolves
  const sections = body.split(/^## .*$/m).slice(1);
  const urls = [];
  for (const section of sections) {
    for (const line of section.split("\n").filter((l) => l.trim())) {
      const m = line.match(/^- \[[^\]]+\]\((https?:\/\/[^)\s]+)\)(: \S.*)?$/);
      assert.ok(m, `not a file-list entry: ${line}`);
      urls.push(m[1]);
    }
  }
  assert.ok(urls.length >= 10);
  for (const url of new Set(urls.map((x) => x.split("#")[0]))) {
    const res = await get(new URL(url).pathname);
    assert.equal(res.status, 200, url);
    await res.arrayBuffer();
  }
});

test("homepage HTML: one H1, and it is the first heading", async () => {
  const html = await (await get("/", "text/html")).text();
  const headings = [...html.matchAll(/<h([1-6])\b/g)].map((m) => m[1]);
  assert.equal(headings[0], "1", `headings start ${headings.slice(0, 4).join(", ")}`);
  assert.equal(headings.filter((h) => h === "1").length, 1);
  // the footer fallback still has its template, ahead of the script that reads it
  const tpl = html.indexOf('<template id="ankora-ftpl">');
  assert.ok(tpl > html.indexOf("</main>") && tpl < html.indexOf('<script id="ankora-footer-js">'));
  assert.match(html, /<link rel="alternate" type="text\/markdown" href="\/index\.md"\/>/);
});

test("homepage schema: every Organization has an address and a contact point", async () => {
  const html = await (await get("/", "text/html")).text();
  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  const orgs = blocks.flatMap((b) => b["@graph"] ?? [b]).filter((n) => ["Organization", "ProfessionalService"].includes(n["@type"]));
  assert.ok(orgs.some((o) => o["@type"] === "Organization"));
  for (const org of orgs) {
    assert.equal(org.name, "Ankora Labs");
    assert.equal(org.address["@type"], "PostalAddress");
    assert.equal(org.address.addressLocality, "Kathmandu");
    assert.equal(org.address.addressCountry, "NP");
    assert.equal(org.contactPoint["@type"], "ContactPoint");
    assert.ok(org.contactPoint.contactType);
    assert.match(org.contactPoint.email, /@ankoralabs\.com$/);
    assert.match(org.contactPoint.telephone, /^\+977/);
  }
});
