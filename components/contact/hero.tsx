import { SITE, waLink } from "../../lib/site";
import { CopyEmail, KtmClock } from "./hero-bits";

// /contact hero: one line of intent, then the email address as the biggest
// thing on the page (with a copy button), phone / WhatsApp / LinkedIn beneath,
// and the clipboard scene cropped off the right edge. Motion: ./motion.tsx.

export default function ContactHero() {
  return (
    <section className="ct-hero" aria-labelledby="ct-h1">
      <div className="dk-wrap ct-hero-in">
        <div className="ct-meta" data-ct-fade>
          <p className="dk-no">(01) Contact</p>
          <KtmClock />
        </div>

        <h1 id="ct-h1" className="ct-h1" data-ct-split data-hero-hide>
          Tell us what you’re building.
        </h1>

        <div className="ct-mail" data-ct-fade>
          <p className="ct-lbl">Write to us</p>
          <div className="ct-mail-row">
            <a className="ct-mail-a" href={`mailto:${SITE.email}`}>
              {SITE.email}
            </a>
            <CopyEmail />
          </div>
        </div>

        <dl className="ct-lines" data-ct-fade>
          <div>
            <dt className="ct-lbl">Call</dt>
            <dd>
              <a href={SITE.phoneHref}>{SITE.phone}</a>
            </dd>
          </div>
          <div>
            <dt className="ct-lbl">WhatsApp</dt>
            <dd>
              <a href={waLink()} target="_blank" rel="noopener">
                {SITE.whatsappHandle}
              </a>
            </dd>
          </div>
          <div>
            <dt className="ct-lbl">LinkedIn</dt>
            <dd>
              <a href={SITE.linkedin} target="_blank" rel="noopener">
                /company/ankoralabs
              </a>
            </dd>
          </div>
        </dl>
      </div>

      <div className="ct-scene" aria-hidden="true">
        <img className="ct-board" src="/images/contact-v3/clipboard.webp" alt="" data-ct-drop />
        <img className="ct-pen" src="/images/contact-v3/pen.webp" alt="" data-ct-pen />
        <p className="ct-hand" data-ct-fade>
          sketch it here,
          <br />
          we’ll build it
        </p>
      </div>
    </section>
  );
}
