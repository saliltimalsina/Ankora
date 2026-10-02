import { kitHtml } from "../lib/kit";
import "./kit/nav.css";

// The site nav: components/kit/nav.html, the same markup the homepage snapshot
// gets from app/route.ts. Mobile menu and current-page link: public/kit/site.js.
export default function SiteNav() {
  return <div style={{ display: "contents" }} dangerouslySetInnerHTML={{ __html: kitHtml("nav") }} />;
}
