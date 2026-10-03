import { ROLES } from "../../lib/careers";
import { WhatsApp } from "../ui/links";
import Slip from "./slip";

// (02) on /careers, "Open roles": each role in lib/careers.ts as one paper
// document (title, stamped tags, summary, the four lists; a commission-paid
// role also gets the printed commission slip, ./slip.tsx), with "Apply for
// this role" preselecting it in the form below (./apply.tsx listens for
// [data-apply-role]). The "Don't see your role?" note is a sticky note on the
// last sheet, or the whole section when no roles are open.

const BLOCKS = [
  { key: "doing", title: "What you’ll do" },
  { key: "paid", title: "How you get paid" },
  { key: "fit", title: "You’d fit if you’re" },
  { key: "get", title: "What you get from us" },
] as const;

const posted = (d: string) => new Date(`${d}T00:00:00Z`).toLocaleDateString("en-GB", { month: "long", year: "numeric", timeZone: "UTC" });

function Note() {
  return (
    <aside className="cr-note" aria-label="Open applications">
      <b>Don’t see your role?</b>
      <p>Designers, developers, anyone good: send your work anyway. We keep it for 12 months and reach out first when a seat opens.</p>
      <a href="#apply">Send your work →</a>
    </aside>
  );
}

export default function Roles() {
  return (
    <section className="cr-roles" id="roles" aria-labelledby="cr-roles-h">
      <div className="dk-wrap">
        <div className="dk-head">
          <div>
            <p className="dk-no" aria-hidden="true">
              (02)
            </p>
            <h2 id="cr-roles-h" className="dk-h2">
              {ROLES.length ? "Open roles." : "No open roles right now."}
            </h2>
          </div>
          <p>{ROLES.length ? "What’s open right now, in plain words. Not here? Send your work anyway." : "We still read every application, and keep it for 12 months."}</p>
        </div>

        {ROLES.length === 0 && <Note />}

        {ROLES.map((r, n) => (
          <article key={r.slug} className="dk-sheet cr-doc" id={r.slug} aria-labelledby={`${r.slug}-h`}>
            <img className="dk-clip" src="/images/desk/paperclip.webp" alt="" aria-hidden="true" />
            <p className="cr-doc-meta">
              <span>Role no. 0{n + 1}</span>
              <span>Posted {posted(r.posted)}</span>
            </p>
            <div className={r.commissionSlip ? "cr-doc-top cr-doc-top-slip" : "cr-doc-top"}>
              <div className="cr-doc-head">
                <h3 id={`${r.slug}-h`} className="cr-doc-h">
                  {r.title}
                </h3>
                <p className="cr-doc-sum">{r.summary}</p>
                <ul className="cr-stamps" aria-label="Role details">
                  {r.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              {r.commissionSlip && <Slip />}
            </div>
            <div className="cr-doc-grid">
              {BLOCKS.map((b) => (
                <div key={b.key} className="cr-doc-block">
                  <h4>{b.title}</h4>
                  <ul>
                    {r[b.key].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="cr-doc-foot">
              <a className="sn-send" href="#apply" data-apply-role={r.chip}>
                Apply for this role
                <i aria-hidden="true">→</i>
              </a>
              <WhatsApp className="cr-ghost" text={`Hi Ankora! I have a question about the ${r.title} role.`}>
                Ask about it on WhatsApp
              </WhatsApp>
            </div>
            {n === ROLES.length - 1 && <Note />}
          </article>
        ))}
      </div>
    </section>
  );
}
