import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import CareersHero from "../../components/careers/hero";
import Roles from "../../components/careers/roles";
import Culture, { Hiring } from "../../components/careers/culture";
import Apply from "../../components/careers/apply";
import CareersMotion from "../../components/careers/motion";
import { ROLES } from "../../lib/careers";
import { SITE } from "../../lib/site";
import { siteUrl } from "../../lib/site-url";
import "../../components/careers/careers.css";

// /careers: the hero, open roles from lib/careers.ts, how the studio works,
// the "apply in a minute" message builder (WhatsApp or email, CV attached
// there), and what happens next.

const TITLE = "Careers at Ankora Labs | Join a Kathmandu Web Studio";
const DESC =
  "Join Ankora Labs, a web design and development studio in Kathmandu. Now open: a commission-based marketing partner role, remote anywhere in Nepal.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/careers" },
  openGraph: { title: TITLE, description: DESC, url: "/careers", images: ["/images/homepage/meta-image.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
};

// One JobPosting per open role, for Google's job listings.
const jobsLd = () =>
  JSON.stringify(
    ROLES.map((r) => ({
      "@context": "https://schema.org",
      "@type": "JobPosting",
      title: r.title,
      description: `<p>${r.summary}</p>${[
        ["What you’ll do", r.doing],
        ["How you get paid", r.paid],
        ["You’d fit if you’re", r.fit],
        ["What you get from us", r.get],
      ]
        .map(([h, l]) => `<h3>${h}</h3><ul>${(l as string[]).map((x) => `<li>${x}</li>`).join("")}</ul>`)
        .join("")}`,
      datePosted: r.posted,
      validThrough: r.validThrough,
      employmentType: "CONTRACTOR",
      jobLocationType: "TELECOMMUTE",
      applicantLocationRequirements: { "@type": "Country", name: "Nepal" },
      directApply: false,
      url: `${siteUrl}/careers#${r.slug}`,
      hiringOrganization: {
        "@type": "Organization",
        "@id": `${siteUrl}/#organization`,
        name: "Ankora Labs",
        sameAs: SITE.linkedin,
        logo: `${siteUrl}/images/logos/ankora-labs.svg`,
      },
    })),
  ).replace(/</g, "\\u003c");

export default function CareersPage() {
  return (
    <>
      <Preloader />
      <SiteNav />
      <main id="start" className="careers-page">
        <CareersHero />
        <Roles />
        <Culture />
        <Apply />
        <Hiring />
      </main>
      <SiteFooter />
      <CareersMotion />
      {ROLES.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobsLd() }} />}
    </>
  );
}
