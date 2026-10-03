import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import CareersHero from "../../components/careers/hero";
import Roles from "../../components/careers/roles";
import Culture from "../../components/careers/culture";
import Apply from "../../components/careers/apply";
import CareersMotion from "../../components/careers/motion";
import { ROLES } from "../../lib/careers";
import { SITE } from "../../lib/site";
import { siteUrl } from "../../lib/site-url";
import "../../components/ui/desk.css";
import "../../components/ui/sentence.css";
import "../../components/careers/careers.css";

// /careers: the studio as a place to work (hero with the lanyard badge), then
// whatever roles are open (lib/careers.ts) as paper documents, the "apply in a
// minute" sentence form, and last, how we work as an annotated desk.

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
      <main id="start" className="dk-page careers-page">
        <CareersHero />
        <Roles />
        <Apply />
        <Culture />
      </main>
      <SiteFooter />
      <CareersMotion />
      {ROLES.length > 0 && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: jobsLd() }} />}
    </>
  );
}
