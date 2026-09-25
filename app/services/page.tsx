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

// /services — every service on one page. Content comes from lib/services.ts,
// which will also feed /services/[slug] when the per-service pages land.

export const metadata: Metadata = {
  title: "Services | Ankora Labs",
  description:
    "Product design, engineering, mobile and AI from one team. See what Ankora Labs builds and how we work.",
  openGraph: {
    title: "Services | Ankora Labs",
    description: "Product design, engineering, mobile and AI from one team.",
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
    </>
  );
}
