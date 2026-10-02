import { readFileSync } from "node:fs";
import { join } from "node:path";
import { SITE, waLink } from "./site";

// The site's shared pieces (nav, footer, "Let's build" ending, showcase styles)
// live once in components/kit as plain HTML + CSS, so the React pages and the
// homepage snapshot render exactly the same markup:
//   - React pages: SiteNav, SiteFooter, LetsBuild, WorkShowcase, which read
//     the snippet here and import its CSS
//   - the homepage route: kitHtml()/kitCss() spliced into ankora.html
// Behaviour for all of them lives in public/kit/site.js.

const dir = join(process.cwd(), "components", "kit");

const attr = (v: string) => v.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/'/g, "&#39;");

// {{TOKEN}} -> value, attribute-escaped
const TOKENS: Record<string, string> = {
  EMAIL: SITE.email,
  PHONE: SITE.phone,
  PHONE_HREF: SITE.phoneHref,
  WA: SITE.whatsapp,
  WA_HELLO: waLink(),
  WA_HANDLE: SITE.whatsappHandle,
  LINKEDIN: SITE.linkedin,
  CAL_URL: SITE.calUrl,
  CAL_LINK: SITE.calLink,
  CAL_NS: SITE.calNamespace,
  CAL_CONFIG: SITE.calConfig,
};

const cache = new Map<string, string>();

function read(file: string) {
  let v = cache.get(file);
  if (v === undefined) {
    v = readFileSync(join(dir, file), "utf8");
    if (process.env.NODE_ENV === "production") cache.set(file, v);
  }
  return v;
}

/** A shared HTML snippet with its {{TOKENS}} filled in; `vars` adds per-page ones. */
export function kitHtml(name: string, vars: Record<string, string> = {}) {
  const all = { ...TOKENS, ...vars };
  return read(`${name}.html`).replace(/\{\{([A-Z_]+)\}\}/g, (m, k: string) => (k in all ? attr(all[k]) : m));
}

/** A shared stylesheet, for routes that can't import CSS. */
export function kitCss(name: string) {
  return read(`${name}.css`);
}

/** Config for public/kit/site.js, plus the script itself. */
export function kitScripts() {
  const cfg = {
    calLink: SITE.calLink,
    calUrl: SITE.calUrl,
    calNs: SITE.calNamespace,
    calConfig: SITE.calConfig,
    wa: SITE.whatsapp,
    waHello: SITE.waHello,
  };
  return (
    `<script>window.ANKORA=${JSON.stringify(cfg).replace(/</g, "\\u003c")}</script>` +
    '<script src="/kit/site.js" defer></script>'
  );
}
