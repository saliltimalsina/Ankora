import { kitHtml } from "../lib/kit";
import LetsBuildMotion from "./lets-build-motion";
import "./kit/lets-build.css";

// "Let's build" closing call to action: components/kit/lets-build.html, the
// same markup the homepage inserts after its testimonials. `second` is the
// quiet third link (e.g. "See our work" on /services).
export default function LetsBuild({ second }: { second: { href: string; text: string } }) {
  return <LetsBuildMotion html={kitHtml("lets-build", { SECOND_HREF: second.href, SECOND_TEXT: second.text })} />;
}
