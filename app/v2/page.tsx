import SiteNav from "../../components/site-nav";
import s from "./page.module.css";

// Rebuilt homepage, assembled section by section.
//
// Strategy: `/` keeps serving the ankora.html snapshot until this page reaches
// parity, then the two swap and the snapshot (plus public/amplify and every
// injected MutationObserver hack) gets deleted. Each converted section moves
// from the snapshot into a real component here, one commit at a time.

export default function V2Home() {
  return (
    <>
      <SiteNav />
      <main className={s.main}>
        <section className={s.status}>
          <p className={s.eyebrow}>Rebuild in progress</p>
          <h1 className={s.title}>
            Ankora, as a <em>real</em> Next app.
          </h1>
          <p className={s.lede}>
            Sections land here one at a time. <code>/</code> keeps serving the snapshot
            until this page reaches parity.
          </p>
        </section>
      </main>
    </>
  );
}
