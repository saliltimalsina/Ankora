import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import ContactHero from "../../components/contact/hero";
import Write from "../../components/contact/write";
import Talk from "../../components/contact/talk";
import NextSteps from "../../components/contact/next-steps";
import ContactMotion from "../../components/contact/motion";
import "../../components/ui/desk.css";
import "../../components/ui/sentence.css";
import "../../components/contact/contact.css";

// /contact: the hero with every direct line (email first), the sentence form,
// "Rather talk?" (calendar and WhatsApp side by side), then what happens next.

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
      <main id="start" className="dk-page contact-page">
        <ContactHero />
        <Write />
        <Talk />
        <NextSteps />
      </main>
      <SiteFooter />
      <ContactMotion />
    </>
  );
}
