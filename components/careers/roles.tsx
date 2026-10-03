import { ROLES } from "../../lib/careers";
import { WhatsApp } from "../ui/links";

// Open roles from lib/careers.ts as "job tickets". "Apply for this role" preselects the role in the form
// below (components/careers/apply.tsx listens for [data-apply-role]).

const BLOCKS = [
  { key: "doing", title: "What you’ll do" },
  { key: "paid", title: "How you get paid" },
  { key: "fit", title: "You’d fit if you’re" },
  { key: "get", title: "What you get from us" },
] as const;


export default function Roles() {
  return (
    <section className="cr-sec" id="roles" aria-labelledby="cr-roles-h">
      <div className="cr-in">
        <p className="cr-kick">Open {ROLES.length === 1 ? "role" : "roles"}</p>
        <h2 id="cr-roles-h" className="cr-h2">
          {ROLES.length ? (
            <>
              What the {ROLES.length === 1 ? "role" : "roles"} <em>involve{ROLES.length === 1 ? "s" : ""}.</em>
            </>
          ) : (
            <>
              No open roles <em>right now.</em>
            </>
          )}
        </h2>

        {ROLES.map((r) => (
          <article key={r.slug} className="cr-role" id={r.slug} aria-labelledby={`${r.slug}-h`}>
            <div className="cr-role-head">
              <div>
                <p className="cr-role-no">Role no. 01</p>
                <h3 id={`${r.slug}-h`}>{r.title}</h3>
                <ul className="cr-tags" aria-label="Role details">
                  {r.tags.map((t) => (
                    <li key={t}>{t}</li>
                  ))}
                </ul>
              </div>
              <p className="cr-role-sum">{r.summary}</p>
            </div>
            <div className="cr-role-grid">
              {BLOCKS.map((b) => (
                <div key={b.key} className="cr-role-block">
                  <h4>{b.title}</h4>
                  <ul>
                    {r[b.key].map((x) => (
                      <li key={x}>{x}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="cr-role-foot">
              <a className="cr-btn cr-btn-fill" href="#apply" data-apply-role={r.chip}>
                Apply for this role <span aria-hidden="true">→</span>
              </a>
              <WhatsApp className="cr-btn" text={`Hi Ankora! I have a question about the ${r.title} role.`}>
                Ask about it on WhatsApp
              </WhatsApp>
              <span className="cr-role-perf" aria-hidden="true" />
            </div>
          </article>
        ))}

        <p className="cr-also">
          <b>Designer or developer?</b> We’re not hiring for those seats right now, but send us your work anyway. We
          keep applications for 12 months and reach out first when a seat opens.
        </p>
      </div>
    </section>
  );
}
