import type { Metadata } from "next";
import SiteNav from "../../components/site-nav";
import SiteFooter from "../../components/site-footer";
import Preloader from "../../components/preloader";
import LegalDoc, { type LegalSection } from "../../components/legal/legal-doc";
import TermsFeature from "../../components/legal/terms-feature";
import { SITE } from "../../lib/site";
import "../../components/legal/legal.css";

// /terms: terms for using the site and the general basis for client work,
// laid out as the project journey (components/legal/terms-feature.tsx links
// each stop to its clause by id). No prices or rates appear here: quotes
// depend on the client. A signed proposal overrides these terms.

const UPDATED = "3 Oct 2026";
const TITLE = "Terms of Service | Ankora Labs";
const DESC =
  "The terms for using ankoralabs.com and working with Ankora Labs: quotes, payments, revisions, ownership, support and more, in plain English.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  alternates: { canonical: "/terms" },
  openGraph: { title: TITLE, description: DESC, url: "/terms", images: ["/images/homepage/meta-image.jpg"], type: "website" },
  twitter: { card: "summary_large_image" },
};

const mail = <a href={`mailto:${SITE.email}`}>{SITE.email}</a>;

const SECTIONS: LegalSection[] = [
  {
    id: "about",
    title: "About these terms",
    note: "The ground rules. Your signed proposal can change them.",
    body: (
      <>
        <p>
          These terms apply when you use ankoralabs.com and when you work with Ankora Labs (“we”, “us”), a web design and
          development studio based in Kathmandu, Nepal. By using the site or accepting a proposal from us, you agree to
          them.
        </p>
        <p>
          Each project also has its own written proposal setting out the scope, timeline, price and payment schedule. If
          the proposal and these terms ever disagree, <strong>the signed proposal wins</strong>.
        </p>
      </>
    ),
  },
  {
    id: "using-the-site",
    title: "Using this website",
    note: "Browse freely. Don’t break it or copy it.",
    body: (
      <>
        <p>
          You’re welcome to browse, share links to and contact us through this site. Please don’t try to break, overload
          or gain unauthorised access to it, and don’t copy its design, code, text or images for your own use without our
          permission.
        </p>
        <p>
          We work to keep the information here accurate, but it’s general information about our services, not an offer.
          Projects shown as built by our founding team include work done before Ankora Labs was formed. Links to other
          websites are provided for convenience; we aren’t responsible for their content.
        </p>
      </>
    ),
  },
  {
    id: "quotes",
    title: "Quotes & proposals",
    note: "One fixed price, in writing, before any work starts.",
    body: (
      <>
        <p>
          After our first call we send a written proposal with the scope, milestones, timeline and a fixed quote in NPR
          (or another currency we agree). Quotes are priced to each project, so we don’t publish rates.
        </p>
        <p>
          A quote is valid for 30 days. Work outside the agreed scope isn’t included in the price; we’ll always quote it
          separately and wait for your approval before doing it.
        </p>
      </>
    ),
  },
  {
    id: "payments",
    title: "Payments",
    note: "An advance to start, the rest at milestones. No surprise invoices.",
    body: (
      <>
        <p>
          Projects start once the proposal is accepted and the advance payment set out in it is received. The rest is
          paid in stages tied to milestones, as listed in the proposal, with the final payment due at launch or handover.
        </p>
        <p>
          Invoices are due within 7 days. If a payment is more than 14 days late, we may pause work until it’s settled,
          and the timeline moves by the length of the pause. Prices include or exclude taxes as stated in the proposal,
          in line with Nepali law.
        </p>
      </>
    ),
  },
  {
    id: "your-part",
    title: "Your part",
    note: "Projects move as fast as content and feedback do.",
    body: (
      <>
        <p>To keep a project on schedule, you agree to:</p>
        <ul>
          <li>provide content (text, images, logos, product details) and account access when the plan needs them;</li>
          <li>give feedback on demos and designs within 5 working days, or let us know when you’ll be late;</li>
          <li>name one person who can make decisions and approve work;</li>
          <li>make sure you have the rights to everything you give us to use.</li>
        </ul>
        <p>
          If content or feedback arrives late, the timeline moves with it. If a project is on hold for more than 60 days
          because we’re waiting on you, we may invoice for the work completed so far.
        </p>
      </>
    ),
  },
  {
    id: "revisions",
    title: "Revisions & changes",
    note: "Two rounds of changes per stage are included. More is quoted first.",
    body: (
      <>
        <p>
          Each design and build stage includes two rounds of revisions, unless the proposal says otherwise. A round is
          one consolidated list of changes from you.
        </p>
        <p>
          New features, new pages or a change of direction count as a change request. We’ll tell you what it costs and
          how it affects the timeline, and only start once you approve.
        </p>
      </>
    ),
  },
  {
    id: "third-party",
    title: "Third-party costs",
    note: "Hosting, domains and app store fees are yours, in your name.",
    body: (
      <>
        <p>
          Some things your project needs are sold by other companies: hosting, domain names, email, paid plugins or
          themes, stock images, payment gateways (eSewa, Khalti, Fonepay and others), app store developer accounts, and
          AI or API usage. Unless the proposal says otherwise, you pay for these directly.
        </p>
        <p>
          Wherever possible we set these accounts up in your name, so you own them. We aren’t responsible for outages,
          price changes or policy decisions made by these providers.
        </p>
      </>
    ),
  },
  {
    id: "launch",
    title: "Testing & launch",
    note: "We test before launch, and launch on a day that suits you.",
    body: (
      <p>
        Before launch we test on current versions of major browsers and on phones, and review performance and basic SEO
        setup. We’ll agree a launch date with you, and launch once you approve the final version and the payments due by
        then are made.
      </p>
    ),
  },
  {
    id: "ownership",
    title: "Ownership",
    note: "Pay in full and it’s all yours: code, design, files.",
    body: (
      <>
        <p>
          Once the project is paid in full, you own the final designs, code and content we created for you, and we hand
          over the source code, design files and the logins you need.
        </p>
        <p>
          We keep ownership of our own tools, components and know-how that existed before your project or that aren’t
          specific to it, and you get a permanent licence to use them as part of your product. Open-source software and
          third-party assets stay under their own licences.
        </p>
      </>
    ),
  },
  {
    id: "portfolio",
    title: "Showing your project",
    note: "We may show your project after launch. Tell us if you’d rather we didn’t.",
    body: (
      <p>
        After launch we may show the finished work in our portfolio, on social media and in proposals, and name you as a
        client. We never share confidential information this way. If you’d rather we didn’t, or the work is under a
        non-disclosure agreement, tell us and we’ll keep it private.
      </p>
    ),
  },
  {
    id: "confidentiality",
    title: "Confidentiality",
    note: "Your plans, numbers and data stay with us.",
    body: (
      <p>
        We keep your business information, plans, data and login details confidential, during the project and after it.
        We’ll sign a separate non-disclosure agreement if you need one. You agree to keep our proposals and pricing
        confidential too.
      </p>
    ),
  },
  {
    id: "warranty",
    title: "Bug fixes & support",
    note: "Bugs we caused, fixed free for 30 days after launch.",
    body: (
      <>
        <p>
          For 30 days after launch, we fix bugs in the work we delivered free of charge. This doesn’t cover new features,
          changes made by anyone else, or problems caused by hosting, third-party services or software updates.
        </p>
        <p>After that, ongoing support, updates and new work are available through a maintenance plan or a new quote.</p>
      </>
    ),
  },
  {
    id: "liability",
    title: "Limits of liability",
    note: "If something goes wrong, our liability is capped at what you paid us.",
    body: (
      <p>
        We do careful, professional work, but we can’t guarantee that a website or app will be free of every error or
        will achieve particular business results, such as sales or search rankings. To the extent the law allows, our
        total liability for a project is limited to the amount you paid us for it, and we aren’t liable for indirect
        losses such as lost profits or data. Nothing here limits liability that can’t be limited by law.
      </p>
    ),
  },
  {
    id: "ending",
    title: "Pausing or ending a project",
    note: "Either side can stop with notice. You pay for work done, nothing more.",
    body: (
      <>
        <p>
          Either of us can end a project by giving written notice (email or WhatsApp counts). You pay for the work
          completed up to that date and any third-party costs we’ve already committed to on your behalf. If your
          payments so far are more than that, we refund the difference.
        </p>
        <p>
          We hand over the completed work once it’s paid for. We may also end a project straight away if payments stay
          unpaid after a reminder, or if the work would be unlawful.
        </p>
      </>
    ),
  },
  {
    id: "law",
    title: "Governing law & disputes",
    note: "Nepali law. And we’d always rather talk it out first.",
    body: (
      <p>
        These terms are governed by the laws of Nepal. If there’s a disagreement, we’ll first try to resolve it by
        talking openly. If that doesn’t work, either of us may take it to the courts of Kathmandu.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to these terms",
    note: "New terms only apply to new projects.",
    body: (
      <p>
        We may update these terms from time to time; the date at the top shows the latest version. Changes don’t affect a
        project that’s already under way unless we both agree. Questions? Write to {mail}.
      </p>
    ),
  },
];

export default function TermsPage() {
  return (
    <>
      <Preloader />
      <SiteNav />
      <main id="start" className="legal-page">
        <LegalDoc
          kicker="Terms of service"
          title={
            <>
              Fair terms, <em>in writing.</em>
            </>
          }
          lede="How we work together, from the first quote to the last bug fix. Every clause comes with a plain-English note from us."
          updated={UPDATED}
          summary={["A fixed quote before we start.", "You own it once it’s paid.", "30 days of free bug fixes."]}
          feature={<TermsFeature />}
          sections={SECTIONS}
          askText="Hi Ankora, I have a question about your terms."
        />
      </main>
      <SiteFooter />
    </>
  );
}
