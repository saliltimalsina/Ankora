import { kitHtml } from "../lib/kit";
import "./kit/footer.css";

// The site footer: components/kit/footer.html, the same markup the homepage
// snapshot gets from app/route.ts. Plant animation: public/kit/site.js.
export default function SiteFooter() {
  return <footer id="main-footer" className="afoot" data-ankora="1" dangerouslySetInnerHTML={{ __html: kitHtml("footer") }} />;
}
