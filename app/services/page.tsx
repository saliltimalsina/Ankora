import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import Hero from "../../components/services/hero";
import ServiceIndex from "../../components/services/service-index";
import Chapters from "../../components/services/chapters";
import Marquee from "../../components/services/marquee";
import Process from "../../components/services/process";
import Engage from "../../components/services/engage";
import WorkShowcase from "../../components/showcase/work-showcase";
import Faq from "../../components/services/faq";
import Cta from "../../components/services/cta";
import ScrollRefresh from "../../components/services/scroll-refresh";
import SiteFooter from "../../components/site-footer";
import JsonLd, { breadcrumbs } from "../../components/json-ld";
import { SERVICES } from "../../lib/services";
import { siteUrl } from "../../lib/site-url";

// /services — every service on one page, linking out to /services/[slug].
// Content comes from lib/services.ts.

export const metadata: Metadata = {
  title: "Services: Product Design, Web, Mobile & AI | Ankora Labs",
  description:
    "Product design, engineering, mobile and AI from one team. See what Ankora Labs builds and how we work.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Services: Product Design, Web, Mobile & AI | Ankora Labs",
    description: "Product design, engineering, mobile and AI from one team.",
    url: "/services",
    images: ["/images/homepage/meta-image.jpg"],
    type: "website",
  },
};

export default function ServicesPage() {
  return (
    <>
      <SiteNav />
      <main data-gsap-page>
        <Hero />
        <Chapters />
        <Marquee />
        <ServiceIndex />
        <Process />
        <Engage />
        <WorkShowcase />
        <Faq />
        <Cta />
      </main>
      <SiteFooter />
      <ScrollRefresh />
      <noscript>
        <style>{`[data-hero-hide]{visibility:visible!important}`}</style>
      </noscript>
      <JsonLd
        data={{
          "@graph": [
            breadcrumbs([
              { name: "Home", path: "/" },
              { name: "Services", path: "/services" },
            ]),
            {
              "@type": "ItemList",
              name: "Ankora Labs services",
              itemListElement: SERVICES.map((x, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: x.title,
                url: `${siteUrl}/services/${x.slug}`,
              })),
            },
          ],
        }}
      />
    </>
  );
}
