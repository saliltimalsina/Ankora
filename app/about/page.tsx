import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Cta from "../../components/services/cta";
import JsonLd, { ORG_ID, breadcrumbs } from "../../components/json-ld";
import { PROCESS, SERVICES } from "../../lib/services";
import { siteUrl } from "../../lib/site-url";
import s from "../../components/content/page.module.css";

// /about: who Ankora is, where it is, how it works. Pillars are the homepage's
// "Why founders entrust their vision to us" copy; contact details match the
// footer.

const TITLE = "About Ankora Labs: Digital Product Studio in Kathmandu";
const DESC =
  "Ankora Labs is a digital product studio in Kathmandu, Nepal. Design, engineering, mobile and AI under one roof, for founders and teams worldwide.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/about" },
  openGraph: { title: TITLE, description: DESC, url: "/about", images: ["/images/homepage/meta-image.jpg"], type: "website" },
};

const PILLARS = [
  {
    title: "Product thinking",
    body: "We focus on understanding your business goals before writing a single line of code. Every feature is built to solve real problems, create value, and support long-term growth.",
  },
  {
    title: "Design that converts",
    body: "Good design is more than appearance. We create intuitive experiences that help users navigate with confidence, build trust, and take meaningful actions across your product.",
  },
  {
    title: "Engineering that scales",
    body: "We build reliable software with clean code and strong foundations. This makes your product easier to maintain, faster to improve, and ready to grow with your business.",
  },
];

export default function AboutPage() {
  return (
    <>
      <SiteNav />
      <main className={s.page}>
        <header className={s.hero}>
          <div className={s.wrap}>
            <nav className={s.crumbs} aria-label="Breadcrumb">
              <ol>
                <li><a href="/">Home</a></li>
                <li aria-current="page">About</li>
              </ol>
            </nav>
            <p className={s.eyebrow}>Made in Kathmandu, Nepal</p>
            <h1 className={s.h1}>About Ankora Labs</h1>
            <p className={s.display} aria-hidden="true">
              <span>Design.</span>
              <span>Build.</span>
              <span>Grow.</span>
            </p>
            <p className={s.lede}>
              Ankora Labs is a digital product studio. We design and build websites, web apps, mobile apps and AI
              features that are fast, scalable, and built to make an impact.
            </p>
            <div className={s.actions}>
              <a className={s.btn} href="/contact">
                Work with us <span aria-hidden="true">→</span>
              </a>
              <a className={s.btnGhost} href="/work">See our work</a>
            </div>
          </div>
        </header>

        <section className={s.section} aria-labelledby="who">
          <div className={`${s.wrap} ${s.split}`}>
            <h2 id="who" className={s.h2}>
              Who <em>we are</em>
            </h2>
            <div className={s.prose}>
              <p>
                We are a team of designers and engineers based in Kathmandu, working with founders and product
                teams. Before Ankora, our founding team designed and built products like an AI
                voice agent platform, a console 300+ call centre clerks use every day, and one of Nepal&rsquo;s gadget
                stores.
              </p>
              <p>
                We started Ankora to do that work under one roof: product design, engineering, mobile and AI in the
                same squad, so nothing gets lost in hand-offs and what gets designed is what ships.
              </p>
              <p>
                Our services: {SERVICES.map((x, i) => (
                  <span key={x.slug}>
                    <a href={`/services/${x.slug}`}>{x.title}</a>
                    {i < SERVICES.length - 2 ? ", " : i === SERVICES.length - 2 ? " and " : "."}
                  </span>
                ))}
              </p>
            </div>
          </div>
        </section>

        <section className={`${s.section} ${s.alt}`} aria-labelledby="why">
          <div className={s.wrap}>
            <h2 id="why" className={s.h2}>
              Why founders <em>trust us</em>
            </h2>
            <ul className={s.cards}>
              {PILLARS.map((p, i) => (
                <li key={p.title} className={s.card}>
                  <span className={s.n}>{String(i + 1).padStart(2, "0")}</span>
                  <h3>{p.title}</h3>
                  <p>{p.body}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <section className={s.section} aria-labelledby="how">
          <div className={s.wrap}>
            <h2 id="how" className={s.h2}>
              How we <em>work</em>
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

        <section className={`${s.section} ${s.alt}`} aria-labelledby="reach">
          <div className={`${s.wrap} ${s.split}`}>
            <h2 id="reach" className={s.h2}>
              Get in <em>touch</em>
            </h2>
            <div className={s.prose}>
              <p>Tell us what you&rsquo;re making. We&rsquo;ll come back with a plan, not a sales deck.</p>
              <div className={s.contact}>
                <a href="mailto:ankoralabscontact@gmail.com">ankoralabscontact@gmail.com</a>
                <a href="tel:+9779840171882">+977 9840171882</a>
                <span>Kathmandu, Nepal</span>
              </div>
            </div>
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
              { name: "About", path: "/about" },
            ]),
            {
              "@type": "AboutPage",
              "@id": `${siteUrl}/about#page`,
              url: `${siteUrl}/about`,
              name: TITLE,
              description: DESC,
              about: { "@id": ORG_ID },
            },
            {
              "@type": "Organization",
              "@id": ORG_ID,
              name: "Ankora Labs",
              url: `${siteUrl}/`,
              logo: `${siteUrl}/images/logos/ankora-labs.svg`,
              email: "ankoralabscontact@gmail.com",
              telephone: "+977-9840171882",
              address: { "@type": "PostalAddress", addressLocality: "Kathmandu", addressCountry: "NP" },
              knowsAbout: SERVICES.map((x) => x.title),
            },
          ],
        }}
      />
    </>
  );
}
