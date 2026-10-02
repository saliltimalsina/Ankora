import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Cta from "../../components/services/cta";
import JsonLd, { breadcrumbs } from "../../components/json-ld";
import { PROJECTS, projectSlug } from "../../lib/work";
import { siteUrl } from "../../lib/site-url";
import s from "../../components/content/page.module.css";

// /work: every founding-team project on one crawlable page, each with an anchor
// (/work#hukut) that the service pages link to.

const TITLE = "Our Work: Web, Product & AI Projects | Ankora Labs";
const DESC =
  "Products our founding team designed and built: an AI voice platform, a call centre console, e-commerce and agency sites. See the work behind Ankora Labs.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/work" },
  openGraph: { title: TITLE, description: DESC, url: "/work", images: ["/images/homepage/meta-image.jpg"], type: "website" },
};

export default function WorkPage() {
  return (
    <>
      <SiteNav />
      <main className={s.page}>
        <header className={s.hero}>
          <div className={s.wrap}>
            <nav className={s.crumbs} aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">Work</li>
              </ol>
            </nav>
            <p className={s.eyebrow}>From our founding team</p>
            <h1 className={s.h1}>Our work</h1>
            <p className={s.display} aria-hidden="true">
              <span>Built,</span>
              <span>shipped,</span>
              <span>in use.</span>
            </p>
            <p className={s.lede}>
              Product design, web development and AI platforms our founding team designed and built, from a console
              300+ call centre clerks use all day to a national gadget store.
            </p>
            <div className={s.actions}>
              <a className={s.btn} href="/contact">
                Start a project <span aria-hidden="true">→</span>
              </a>
              <a className={s.btnGhost} href="/services">Our services</a>
            </div>
          </div>
        </header>

        <section className={s.section} aria-label="Projects">
          <div className={s.wrap}>
            <ul className={s.work}>
              {PROJECTS.map((p) => (
                <li key={p.n} id={projectSlug(p)} className={s.project}>
                  <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
                  <div className={s.projectBody}>
                    <div className={s.projectHead}>
                      <h2>{p.n}</h2>
                      <span className={s.yr}>{p.yr}</span>
                    </div>
                    <p className={s.cat}>{p.cat}</p>
                    <p>{p.d}</p>
                    <ul className={s.chips} aria-label="Our role">
                      {p.role.map((r) => (
                        <li key={r}>{r}</li>
                      ))}
                    </ul>
                    {p.live ? (
                      <a className={s.visit} href={p.url} target="_blank" rel="noopener">
                        Visit {p.dom} <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                  </div>
                </li>
              ))}
            </ul>
            <p className={s.note}>
              Products our founding team designed and built before Ankora, at previous companies. Names and marks
              belong to their owners.
            </p>
          </div>
        </section>
      </main>
      <Cta />
      <SiteFooter />

      <JsonLd
        data={{
          "@graph": [
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Work", path: "/work" },
            ]),
            {
              "@type": "CollectionPage",
              "@id": `${siteUrl}/work#page`,
              url: `${siteUrl}/work`,
              name: TITLE,
              description: DESC,
              mainEntity: {
                "@type": "ItemList",
                itemListElement: PROJECTS.map((p, i) => ({
                  "@type": "ListItem",
                  position: i + 1,
                  item: {
                    "@type": "CreativeWork",
                    name: p.n,
                    description: p.d,
                    genre: p.cat,
                    url: `${siteUrl}/work#${projectSlug(p)}`,
                    image: `${siteUrl}${p.img}`,
                  },
                })),
              },
            },
          ],
        }}
      />
    </>
  );
}
