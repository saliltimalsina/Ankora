import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import ContactHero from "../../components/contact/hero";
import Ways from "../../components/contact/ways";
import Brief from "../../components/contact/brief";
import Slot from "../../components/contact/slot";
import NextSteps from "../../components/contact/next-steps";
import "../../components/contact/contact.css";

// /contact: every way to reach the studio. Hero card, three ways in, the
// three-taps brief builder, the inline calendar, then what happens next.

const TITLE = "Contact Ankora Labs | Web Design Company in Kathmandu, Nepal";
const DESC =
  "Get a website, web app or mobile app built in Nepal. Ankora Labs is a Kathmandu web design and development team: reply within 24 hours, 7 days a week.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/contact" },
  openGraph: { title: TITLE, description: DESC, url: "/contact", images: ["/images/homepage/meta-image.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
};

export default function ContactPage() {
  return (
    <>
      <Preloader />
      <SiteNav />
      <main id="start" className="contact-page">
        <ContactHero />
        <Ways />
        <Brief />
        <Slot />
        <NextSteps />
      </main>
      <SiteFooter />
    </>
  );
}
