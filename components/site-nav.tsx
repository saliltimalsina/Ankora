import { kitHtml } from "../lib/kit";
import "./kit/nav.css";

// The site nav: components/kit/nav.html, the same markup the homepage snapshot
// gets from app/route.ts. Mobile menu and current-page link: public/kit/site.js.
// site.js edits this markup (current page, menu state) as soon as it loads,
// which can be before hydration, so React is told not to compare it.
export default function SiteNav() {
  return <div style={{ display: "contents" }} suppressHydrationWarning dangerouslySetInnerHTML={{ __html: kitHtml("nav") }} />;
}
