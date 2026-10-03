import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import LegalDoc, { type LegalSection } from "../../components/legal/legal-doc";
import PrivacyFeature from "../../components/legal/privacy-feature";
import { SITE } from "../../lib/site";
import "../../components/legal/legal.css";

// /privacy: the privacy policy. The site sets no cookies and runs no
// analytics, so the page leads with how little it holds (the ledger), then the
// policy itself with a plain-English note beside each section. Keep the ledger
// (components/legal/privacy-feature.tsx) and the sections below in step, and
// bump UPDATED whenever either changes.

const UPDATED = "3 Oct 2026";
const TITLE = "Privacy Policy | Ankora Labs";
const DESC =
  "How Ankora Labs handles your data: no cookies, no tracking, and only what you send us through Cal.com, WhatsApp or email. Written in plain English.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/privacy" },
  openGraph: { title: TITLE, description: DESC, url: "/privacy", images: ["/images/homepage/meta-image.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
};

const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "who-we-are",
    title: "Who we are",
    note: "A small studio in Kathmandu. This page is about your data and us.",
    body: (
      <>
        <p>
          Ankora Labs (“Ankora Labs”, “we”, “us”) is a web design and development studio based in Kathmandu, Nepal. This
          policy explains what personal information we collect through ankoralabs.com and when you contact us, why we
          collect it, and what you can ask us to do with it.
        </p>
        <p>
          For the information described here, we decide how and why it is used. You can reach us about anything in this
          policy at {mail} or on WhatsApp at {SITE.phone}.
        </p>
      </>
    ),
  },
  {
    id: "what-we-collect",
    title: "What we collect",
    note: "Only what you choose to send us, plus the basic logs every website has.",
    body: (
      <>
        <p>We only collect what you give us, and the minimum a website needs to run:</p>
        <ul>
          <li>
            <strong>When you book a call:</strong> your name, email address, the time you pick and anything you write in
            the booking notes.
          </li>
          <li>
            <strong>When you message us on WhatsApp:</strong> your phone number, profile name and the messages and files
            you send.
          </li>
          <li>
            <strong>When you email us:</strong> your email address, your message and any attachments.
          </li>
          <li>
            <strong>When you apply for a role:</strong> your name, email, phone number if you give it, CV, portfolio or
            profile links and anything you write in the form.
          </li>
          <li>
            <strong>When you visit the site:</strong> our host records standard server logs: IP address, browser type,
            the page requested and the time.
          </li>
        </ul>
        <p>
          We don’t use cookies, analytics, advertising pixels or any other tracking on this site. The only thing the
          site stores in your browser is a small note in session storage so the loading animation plays once per visit.
          It holds no personal information and disappears when you close the tab.
        </p>
      </>
    ),
  },
  {
    id: "why-we-use-it",
    title: "Why we use it",
    note: "To answer you, quote you, and do the work. That’s the whole list.",
    body: (
      <>
        <p>We use your information only to:</p>
        <ul>
          <li>reply to your message and hold the call you booked;</li>
          <li>understand your project and prepare a proposal and quote;</li>
          <li>deliver, invoice and support the work if you become a client;</li>
          <li>consider your application if you apply to work with us;</li>
          <li>keep the website secure and working.</li>
        </ul>
        <p>
          Where a legal basis is required, we rely on your consent (when you contact us), on taking steps you’ve asked
          for before a contract, on performing our contract with you, on our legitimate interest in running and
          protecting our business, and on our legal obligations, such as keeping accounting records.
        </p>
        <p>We don’t sell your information, use it for advertising, or add you to a mailing list you didn’t ask to join.</p>
      </>
    ),
  },
  {
    id: "who-handles-it",
    title: "Who handles it",
    note: "A few trusted tools carry your message to us. Nobody else gets it.",
    body: (
      <>
        <p>We use a small number of service providers to run the studio. Each handles your data only to provide its service:</p>
        <ul>
          <li>
            <strong>Vercel</strong> hosts this website and keeps its server logs.
          </li>
          <li>
            <strong>Cal.com</strong> runs our booking calendar; <strong>Google</strong> (Calendar and Meet) holds the
            meeting and sends the invite.
          </li>
          <li>
            <strong>Cloudflare</strong> routes email sent to our domain, and <strong>Google</strong> (Gmail) stores our
            inbox.
          </li>
          <li>
            <strong>WhatsApp</strong> (Meta) carries chats you start with us.
          </li>
          <li>
            <strong>Brevo</strong> delivers job applications sent through our careers form to our inbox.
          </li>
        </ul>
        <p>
          The LinkedIn link on this site is a plain link. LinkedIn only receives information if you click it and use
          their site, under their own policy. We may also share information if the law requires it, for example with a
          tax authority or a court.
        </p>
      </>
    ),
  },
  {
    id: "international-transfers",
    title: "International transfers",
    note: "Some of these tools have servers outside Nepal.",
    body: (
      <p>
        Several of the providers above store data outside Nepal, mainly in the United States and the European Union. We
        choose established providers that protect data with security measures and contractual safeguards, and we only
        send them what their service needs.
      </p>
    ),
  },
  {
    id: "how-long",
    title: "How long we keep it",
    note: "About a year after we last talk, unless the law needs longer.",
    body: (
      <>
        <ul>
          <li>
            <strong>Enquiries and calls that don’t become a project:</strong> deleted 12 months after our last
            conversation.
          </li>
          <li>
            <strong>Client projects:</strong> kept for the length of the project and our support period, and invoices and
            accounting records for as long as Nepali tax law requires.
          </li>
          <li>
            <strong>Job applications:</strong> kept for 12 months so we can contact you about future roles, unless you
            ask us to delete them sooner.
          </li>
          <li>
            <strong>Server logs:</strong> kept by Vercel for a short period, usually a few days.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "security",
    title: "How we protect it",
    note: "Locked accounts, few people, nothing on random laptops.",
    body: (
      <p>
        The site is served only over HTTPS. Our accounts use strong passwords and two-factor authentication, and only the
        people working on your enquiry or project can see your information. No method of sending or storing data is
        perfectly secure, but if we ever learn of a breach that affects you, we will tell you promptly.
      </p>
    ),
  },
  {
    id: "your-rights",
    title: "Your rights",
    note: "Ask what we hold, fix it, or have it deleted. Just message us.",
    body: (
      <>
        <p>
          Under Nepal’s Individual Privacy Act, 2075 (2018), and, if you are in the EU or UK, the GDPR, you can ask us
          to:
        </p>
        <ul>
          <li>tell you what information we hold about you and give you a copy;</li>
          <li>correct anything that’s wrong or out of date;</li>
          <li>delete your information, unless we have to keep it by law;</li>
          <li>stop or limit how we use it, or withdraw consent you gave earlier.</li>
        </ul>
        <p>
          Email {mail} or message us on WhatsApp. We’ll reply within 30 days, usually much sooner, and we won’t charge
          you. If you’re unhappy with our answer, you can also complain to the data protection authority where you live.
        </p>
      </>
    ),
  },
  {
    id: "client-projects",
    title: "Data in client projects",
    note: "On your project, your users’ data stays yours. We follow your instructions.",
    body: (
      <p>
        When we build or maintain a website or app for a client, we may have access to that client’s data, including
        information about their own customers. In that case we act only on the client’s instructions, keep it
        confidential, use it only for the project, and return or delete it when the work ends. The client’s own privacy
        policy covers how they use their users’ data.
      </p>
    ),
  },
  {
    id: "children",
    title: "Children",
    note: "This site is for businesses, not kids.",
    body: (
      <p>
        Our services are for businesses and adults. We don’t knowingly collect information from anyone under 16. If you
        think a child has sent us their information, tell us and we will delete it.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to this policy",
    note: "If this changes, the date at the top changes too.",
    body: (
      <p>
        We’ll update this page if the way we handle data changes, for example if we start using analytics. The date at the
        top shows the latest version. If a change matters to you as a client, we’ll tell you directly.
      </p>
    ),
  },
];

export default function PrivacyPage() {
  return (
    <>
      <Preloader />
      <SiteNav />
      <main id="start" className="legal-page">
        <LegalDoc
          kicker="Privacy policy"
          title={
            <>
              Your data, <em>kept small.</em>
            </>
          }
          lede="We only see what you choose to send us, we keep it for as long as the work needs, and we never sell it. Here’s the whole picture, in plain English first."
          updated={UPDATED}
          summary={["No cookies.", "No tracking or ads.", "We only see what you send us."]}
          feature={<PrivacyFeature />}
          sections={SECTIONS}
          askText="Hi Ankora, I have a question about my data."
        />
      </main>
      <SiteFooter />
    </>
  );
}
