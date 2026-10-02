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
import { FAQ, SERVICES } from "../../lib/services";
import { siteUrl } from "../../lib/site-url";

// /services — every service on one page. Content comes from lib/services.ts,
// which will also feed /services/[slug] when the per-service pages land.

export const metadata: Metadata = {
  title: "Web Design, UI/UX & App Development in Nepal | Ankora Labs",
  description:
    "Website and web app development, UI/UX and product design, mobile apps and AI from one Kathmandu team. See what Ankora Labs builds and how we work.",
  alternates: { canonical: "/services" },
  openGraph: {
    title: "Web Design, UI/UX & App Development in Nepal | Ankora Labs",
    description: "Web development, UI/UX design, mobile apps and AI from one Kathmandu team.",
    url: "/services",
    images: ["/images/homepage/meta-image.jpg"],
    type: "website",
  },
};

// Structured data: the four services (each at its section anchor) and the FAQ,
// so search can show them as rich results.
const ld = JSON.stringify({
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "ItemList",
      name: "Ankora Labs services",
      itemListElement: SERVICES.map((x, i) => ({
        "@type": "ListItem",
        position: i + 1,
        item: {
          "@type": "Service",
          name: x.title,
          description: x.blurb,
          url: `${siteUrl}/services#${x.slug}`,
          provider: { "@id": `${siteUrl}/#organization` },
        },
      })),
    },
    {
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ],
}).replace(/</g, "\\u003c");

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
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ld }} />
    </>
  );
}
