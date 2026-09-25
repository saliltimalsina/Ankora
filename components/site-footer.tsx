import { readFileSync } from "node:fs";
import { join } from "node:path";
import FooterPlants from "./footer-plants";
import "./site-footer.css";

// The homepage footer, for pages rendered by the Next app. Markup comes from
// partials/footer.html (lifted from the ankora.html snapshot's footer
// template), read once at build time, so there is one copy to edit.
const html = readFileSync(join(process.cwd(), "partials", "footer.html"), "utf8");

export default function SiteFooter() {
  return (
    <>
      <footer id="main-footer" className="afoot" data-ankora="1" dangerouslySetInnerHTML={{ __html: html }} />
      <FooterPlants />
    </>
  );
}
