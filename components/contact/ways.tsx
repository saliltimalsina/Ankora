import { SITE } from "../../lib/site";
import { BookCall, WhatsApp } from "../ui/links";
import Today from "./today";

// "Pick your way in": a call (tear-off calendar), WhatsApp (chat bubble) or a
// written message (envelope), which jumps to the form below. Each card is the
// whole link.

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

          <a className="gw-card gw-mail" href="#brief">
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
            <h3>Send a message</h3>
            <p>Prefer writing it down? Fill in a short form. It lands in our inbox, and a copy lands in yours.</p>
            <span className="gw-go">
              Write to us <span aria-hidden="true">↓</span>
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
