import Brief from "./brief";

// (02) on /contact: the sentence form on its own sheet. The ways to talk
// (a call, WhatsApp) are the next section, ./talk.tsx. /contact#brief (the
// pricing cards) lands here.

export default function Write() {
  return (
    <section className="ct-write-sec" id="brief" aria-labelledby="ct-write-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (02)
            </p>
            <h2 id="ct-write-h" className="dk-h2">
              Write us a line.
            </h2>
          </div>
          <p>Two minutes, no forms to wade through. It lands in our inbox and a copy lands in yours.</p>
        </div>
        <div className="dk-sheet">
          <img className="dk-clip" src="/images/desk/paperclip.webp" alt="" aria-hidden="true" />
          <Brief />
        </div>
      </div>
    </section>
  );
}
