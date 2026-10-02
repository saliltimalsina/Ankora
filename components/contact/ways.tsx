import { SITE } from "../../lib/site";
import { BookCall, WhatsApp } from "../ui/links";
import Today from "./today";

// "Pick your way in": a call (tear-off calendar), WhatsApp (chat bubble) or an
// email brief (envelope). Each card is the whole link.

const MAIL_BODY =
  "Hi Ankora,\n\nWho we are: \nWhat we need (website / e-commerce / app / UI/UX / AI): \nWhen we’d like to launch: \nAnything else: \n\nThanks!";
const mailto = `mailto:${SITE.email}?subject=${encodeURIComponent("Project enquiry — Ankora Labs")}&body=${encodeURIComponent(MAIL_BODY)}`;

export default function Ways() {
  return (
    <section className="gw" aria-labelledby="gw-title">
      <div className="gw-in">
        <div className="gw-head">
          <p className="gn-kick">Three ways in</p>
          <h2 id="gw-title" className="gn-h2">
            Pick your <em>way in.</em>
          </h2>
        </div>
        <div className="gw-cards">
          <BookCall className="gw-card gw-cal">
            <span className="gw-art" aria-hidden="true">
              <span className="gw-rings">
                <i />
                <i />
                <i />
              </span>
              <span className="gw-page">
                <Today />
                <span className="gw-slot">30 min · online</span>
              </span>
              <span className="gw-page gw-under" />
            </span>
            <h3>Book a 30-min call</h3>
            <p>Pick a slot that suits you. Free, no pitch, just your idea and our questions.</p>
            <span className="gw-go">
              Pick a time <span aria-hidden="true">→</span>
            </span>
          </BookCall>

          <WhatsApp className="gw-card gw-wa">
            <span className="gw-art" aria-hidden="true">
              <span className="gw-chat">
                <span className="gw-msg">{SITE.waHello.replace("'", "’")}</span>
                <span className="gw-typing">
                  <i />
                  <i />
                  <i />
                </span>
              </span>
            </span>
            <h3>WhatsApp us</h3>
            <p>The quickest way to reach us. We read every message, weekdays and weekends.</p>
            <span className="gw-go">
              Open chat <span aria-hidden="true">→</span>
            </span>
          </WhatsApp>

          <a className="gw-card gw-mail" href={mailto}>
            <span className="gw-art" aria-hidden="true">
              <span className="gw-env">
                <span className="gw-letter">
                  <b>Project brief</b>
                  <i />
                  <i />
                  <i />
                </span>
                <span className="gw-flap" />
                <span className="gw-front" />
              </span>
            </span>
            <h3>Email the brief</h3>
            <p>Prefer writing it down? We’ve started the email for you, just fill in the blanks.</p>
            <span className="gw-go">
              Write to us <span aria-hidden="true">→</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
