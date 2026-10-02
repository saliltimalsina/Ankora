import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SiteNav from "../../../components/site-nav";
import SiteFooter from "../../../components/site-footer";
import Cta from "../../../components/services/cta";
import JsonLd, { ORG_ID, breadcrumbs } from "../../../components/json-ld";
import { ENGAGEMENTS, PROCESS, SERVICES, type Service } from "../../../lib/services";
import { PROJECTS, projectSlug } from "../../../lib/work";
import { siteUrl } from "../../../lib/site-url";
import s from "../../../components/content/page.module.css";

// /services/[slug]: one indexable page per service, so each can rank for its
// own searches (and show up as a sitelink). Copy comes from lib/services.ts;
// /services stays the animated overview and links here.

type Props = { params: Promise<{ slug: string }> };

// Founding-team projects that show this service, matched on their role chips.
const WORK_ROLES: Record<string, string[]> = {
  design: ["Product Design", "UX", "Web Design"],
  engineering: ["Development", "Landing Page"],
  mobile: [],
  ai: ["AI Platform"],
};

const find = (slug: string) => SERVICES.find((x) => x.slug === slug);

export const dynamicParams = false;

export function generateStaticParams() {
  return SERVICES.map((x) => ({ slug: x.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const svc = find((await params).slug);
  if (!svc) return {};
  const path = `/services/${svc.slug}`;
  return {
    title: svc.seo.title,
    description: svc.seo.description,
    alternates: { canonical: path },
    openGraph: {
      title: svc.seo.title,
      description: svc.seo.description,
      url: path,
      images: ["/images/homepage/meta-image.jpg"],
      type: "website",
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const svc = find((await params).slug);
  if (!svc) notFound();

  const path = `/services/${svc.slug}`;
  const work = PROJECTS.filter((p) => p.role.some((r) => WORK_ROLES[svc.slug].includes(r)));
  const others = SERVICES.filter((x) => x.slug !== svc.slug);

  return (
    <>
      <SiteNav />
      <main
        className={s.page}
        style={{ "--ground": svc.theme.ground, "--on": svc.theme.ink, "--accent": svc.theme.accent } as React.CSSProperties}
      >
        <header className={s.hero}>
          <div className={s.wrap}>
            <nav className={s.crumbs} aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li><a href="/services">Services</a></li>
                <li aria-current="page">{svc.title}</li>
              </ol>
            </nav>
            <p className={s.eyebrow}>{svc.n} · {svc.short}</p>
            <h1 className={s.h1}>{svc.seo.h1}</h1>
            <p className={s.display} aria-hidden="true">
              {svc.headline.map((line) => (
                <span key={line}>{line}</span>
              ))}
            </p>
            <p className={s.lede}>{svc.blurb}</p>
            <div className={s.actions}>
              <a className={s.btn} href="/contact">
                {svc.cta} <span aria-hidden="true">→</span>
              </a>
              <a className={s.btnGhost} href="/services">All services</a>
            </div>
          </div>
        </header>

        <section className={s.section} aria-labelledby="approach">
          <div className={`${s.wrap} ${s.split}`}>
            <h2 id="approach" className={s.h2}>
              How we <em>approach it</em>
            </h2>
            <div className={s.prose}>
              {svc.intro.map((p) => (
                <p key={p}>{p}</p>
              ))}
              <p className={s.meta}>
                <b>Tools</b>
                {svc.stack.join(", ")}
              </p>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.alt}`} aria-labelledby="included">
          <div className={s.wrap}>
            <h2 id="included" className={s.h2}>
              What&rsquo;s <em>included</em>
            </h2>
            <ul className={s.cards}>
              {svc.deliverables.map((d, i) => (
                <li key={d} className={s.card}>
                  <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{d}</h3>
                  <p>{svc.details[i]}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.section} aria-labelledby="process">
          <div className={s.wrap}>
            <h2 id="process" className={s.h2}>
              How a project <em>runs</em>
            </h2>
            <ol className={s.steps}>
              {PROCESS.map((p) => (
                <li key={p.n}>
                  <span className={s.n}>{p.n}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className={`${s.section} ${s.alt}`} aria-labelledby="engage">
          <div className={s.wrap}>
            <h2 id="engage" className={s.h2}>
              Ways to <em>work together</em>
            </h2>
            <ul className={s.cards}>
              {ENGAGEMENTS.map((e) => (
                <li key={e.name} className={s.card}>
                  <span className={s.n}>{e.tag}</span>
                  <h3>{e.name}</h3>
                  <p>{e.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {work.length > 0 && (
          <section className={s.section} aria-labelledby="work">
            <div className={s.wrap}>
              <h2 id="work" className={s.h2}>
                Related <em>work</em>
              </h2>
              <ul className={s.work}>
                {work.map((p) => (
                  <li key={p.n} className={s.project}>
                    <img src={p.img} alt={p.alt} loading="lazy" width={1600} height={1000} />
                    <div className={s.projectBody}>
                      <div className={s.projectHead}>
                        <h3>{p.n}</h3>
                        <span className={s.yr}>{p.yr}</span>
                      </div>
                      <p className={s.cat}>{p.cat}</p>
                      <p>{p.d}</p>
                      <a className={s.visit} href={`/work#${projectSlug(p)}`}>
                        About this project <span aria-hidden="true">→</span>
                      </a>
                    </div>
                  </li>
                ))}
              </ul>
              <p className={s.note}>
                Projects our founding team designed and built before Ankora, at previous companies. Names and marks
                belong to their owners.
              </p>
            </div>
          </section>
        )}

        <section className={`${s.section} ${s.alt}`} aria-labelledby="faq">
          <div className={`${s.wrap} ${s.split}`}>
            <h2 id="faq" className={s.h2}>
              Questions, <em>answered</em>
            </h2>
            <ul className={s.faq}>
              {svc.faq.map((f) => (
                <li key={f.q}>
                  <details>
                    <summary>{f.q}</summary>
                    <p>{f.a}</p>
                  </details>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.section} aria-labelledby="more">
          <div className={s.wrap}>
            <h2 id="more" className={s.h2}>
              Other <em>services</em>
            </h2>
            <ul className={s.related}>
              {others.map((o) => (
                <li key={o.slug}>
                  <a
                    href={`/services/${o.slug}`}
                    style={{ "--rg": o.theme.ground, "--ri": o.theme.ink } as React.CSSProperties}
                  >
                    <span>{o.n}</span>
                    <b>{o.title}</b>
                    <span>{o.short}</span>
                  </a>
                </li>
              ))}
            </ul>
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
              { name: "Services", path: "/services" },
              { name: svc.title, path },
            ]),
            serviceLd(svc, path),
            {
              "@type": "FAQPage",
              mainEntity: svc.faq.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            },
          ],
        }}
      />
    </>
  );
}

function serviceLd(svc: Service, path: string) {
  return {
    "@type": "Service",
    "@id": `${siteUrl}${path}#service`,
    name: svc.title,
    serviceType: svc.seo.h1,
    description: svc.seo.description,
    url: `${siteUrl}${path}`,
    provider: { "@id": ORG_ID },
    areaServed: "Worldwide",
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: svc.title,
      itemListElement: svc.deliverables.map((d, i) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: d, description: svc.details[i] },
      })),
    },
  };
}
