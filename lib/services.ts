// Single source for the services page (and, later, /services/[slug]).
// Order matters: it sets the 01–04 numbering and the chapter sequence.
//
// NOTE: deliverables, stack, FAQ and engagement copy are first-pass drafts
// written to fill the layout. Review before launch.

export type SceneKind = "design" | "engineering" | "mobile" | "ai";

export type Service = {
  slug: string;
  n: string;
  title: string;
  /** one line under the title in the index + nav */
  short: string;
  /** chapter headline, one line per entry */
  headline: string[];
  blurb: string;
  deliverables: string[];
  stack: string[];
  cta: string;
  /** the chapter's animated scene */
  scene: SceneKind;
  /** whose work the scene is built from */
  client: { name: string; kind: string; thumb: string };
  /** chapter palette: ground, ink, accent */
  theme: { ground: string; ink: string; accent: string };
};

export const SERVICES: Service[] = [
  {
    slug: "design",
    n: "01",
    title: "Product Design",
    short: "Research · UX · UI · Design systems",
    headline: ["Design that", "earns trust", "on sight."],
    blurb:
      "Research, wireframes, and polished interfaces. We turn rough ideas into products people actually want to use, and hand off systems your team can keep building on.",
    deliverables: [
      "User research & product audits",
      "UI/UX design: flows, wireframes & prototypes",
      "Website & app UI design",
      "Design systems & component libraries",
      "Brand & art direction",
    ],
    stack: ["Figma", "FigJam", "Framer", "Maze"],
    cta: "Start a design project",
    scene: "design",
    client: { name: "Ratna", thumb: "/images/homepage/Trail1.webp", kind: "Furniture commerce" },
    theme: { ground: "#D5E27B", ink: "#002813", accent: "#004822" },
  },
  {
    slug: "engineering",
    n: "02",
    title: "Engineering",
    short: "Web apps · Sites · APIs · Performance",
    headline: ["Websites", "engineered", "to perform."],
    blurb:
      "Fast, accessible, search-ready builds on a modern stack, shipped to production and not just handed off as a mockup.",
    deliverables: [
      "Business websites & web apps",
      "E-commerce with eSewa, Khalti & Fonepay",
      "React / Next.js frontends, APIs & backends",
      "CMS, hosting & domain setup",
      "Performance, accessibility & SEO",
    ],
    stack: ["Next.js", "TypeScript", "Node", "Postgres", "Vercel"],
    cta: "Start a build",
    scene: "engineering",
    client: { name: "Hukut", thumb: "/images/homepage/Trail7.webp", kind: "Multi-category marketplace" },
    theme: { ground: "#0C3D26", ink: "#FBF8EF", accent: "#D5E27B" },
  },
  {
    slug: "mobile",
    n: "03",
    title: "Mobile",
    short: "iOS · Android · One codebase",
    headline: ["Apps that", "feel right", "at home."],
    blurb:
      "Native-quality iOS and Android from one codebase. Smooth, offline-ready, and built to scale with you from the first release.",
    deliverables: [
      "iOS & Android apps",
      "Offline-first data & sync",
      "Push, auth & local payment gateways",
      "App Store & Play Store launch",
      "Ongoing releases & maintenance",
    ],
    stack: ["React Native", "Expo", "Swift", "Kotlin"],
    cta: "Start an app",
    scene: "mobile",
    client: { name: "TransferNet", thumb: "/images/homepage/Trail8.webp", kind: "Money transfer app" },
    theme: { ground: "#EBD5C0", ink: "#2E1A0B", accent: "#B5703C" },
  },
  {
    slug: "ai",
    n: "04",
    title: "AI / Intelligence",
    short: "Assistants · Search · Automation · Agents",
    headline: ["Intelligence", "built into", "the product."],
    blurb:
      "Chat, search, automation, and agents wired into your product with the latest models. Useful, not gimmicky.",
    deliverables: [
      "Chat & in-product assistants",
      "Semantic search over your data",
      "Workflow automation",
      "Agents & tool integrations",
      "Evals, guardrails & monitoring",
    ],
    stack: ["LLM APIs", "Vector search", "Python", "TypeScript"],
    cta: "Start an AI project",
    scene: "ai",
    client: { name: "Answer Service", thumb: "/images/homepage/Trail2.webp", kind: "AI call answering" },
    theme: { ground: "#E7B7AF", ink: "#002813", accent: "#004822" },
  },
];

export const PROCESS = [
  { n: "01", title: "Discover", body: "Workshops, audits and user interviews to find what actually matters.", note: "ask dumb questions early" },
  { n: "02", title: "Design", body: "Flows, wireframes and a clickable prototype you can put in front of users.", note: "test before we build" },
  { n: "03", title: "Build", body: "Weekly demos on a real staging link. No black box, no big reveal.", note: "ship every week" },
  { n: "04", title: "Launch", body: "QA, performance passes, analytics and a calm launch day.", note: "no 2am deploys" },
  { n: "05", title: "Grow", body: "Measure, iterate and scale. We stick around after go-live.", note: "then do it again" },
];

export const ENGAGEMENTS = [
  {
    name: "Sprint",
    tag: "Focused",
    body: "A tightly scoped burst: a prototype, an audit, or one feature taken from idea to shipped.",
    points: ["Fixed scope", "Clickable output", "Clear next steps"],
  },
  {
    name: "Build",
    tag: "End to end",
    body: "Design and engineering under one roof, from first workshop through launch day.",
    points: ["Dedicated squad", "Weekly demos", "Launch support"],
  },
  {
    name: "Partner",
    tag: "Ongoing",
    body: "An embedded product team that keeps shipping after launch, month after month.",
    points: ["Monthly roadmap", "Design + dev capacity", "Shared metrics"],
  },
];

export const FAQ = [
  {
    q: "How much does a website cost in Nepal?",
    a: "It depends on the project and on your business. A five-page company site, an online store with eSewa checkout and a full product with mobile apps are very different builds, so we don't use a rate card. After a 30-minute call you get a fixed, written quote in NPR, sized to what you actually need, with no hidden extras.",
  },
  {
    q: "Can you integrate eSewa, Khalti, Fonepay and other payments?",
    a: "Yes. We integrate eSewa, Khalti, Fonepay, connectIPS and bank QR for local payments, and Stripe or PayPal when you sell abroad, plus SMS, email, maps and whatever else your product needs.",
  },
  {
    q: "Do you handle hosting, domains and maintenance?",
    a: "Yes. We set up hosting, your .com or .com.np domain, SSL and backups, and can keep the site updated, monitored and secure after launch on a monthly care plan.",
  },
  {
    q: "Do you work with businesses outside Kathmandu?",
    a: "Yes. We're a remote-first team based in Kathmandu and work with clients all over Nepal and abroad. Calls, demos and handover all happen online, and we're reachable on weekdays and weekends.",
  },
  {
    q: "Can you do design only, or engineering only?",
    a: "Yes. Most clients use both, but we regularly pick up a design system for an in-house dev team, or build from designs someone else made.",
  },
  {
    q: "Can you take over an existing product?",
    a: "Yes. We start with a short audit of the codebase or design files, share what we found, and agree on a plan before changing anything.",
  },
  {
    q: "How long does a project take?",
    a: "It depends on scope. After a first call we send a written plan with milestones, so you know the timeline before anything is signed.",
  },
  {
    q: "Do you work with early-stage startups?",
    a: "Often. A Sprint is a good way to get a prototype in front of users or investors without committing to a full build.",
  },
  {
    q: "What happens after launch?",
    a: "You own everything: code, design files and accounts. Many teams keep us on as a Partner; others take it in-house with a proper handover.",
  },
];

// The three kinds of project and what each includes. No prices on purpose:
// in Nepal the right number depends on the client as much as the scope, so
// every project gets its own fixed quote after a first call.
export const PRICING = [
  {
    name: "Business website",
    // preselects this in the /contact brief builder (/contact?need=website#brief)
    need: "website",
    weeks: "3–5 weeks",
    fits: "Companies, startups & professionals",
    items: ["Custom design, no templates", "Up to 8 pages + CMS", "Mobile-first & fast", "SEO setup & Google Analytics", "Hosting, domain & SSL setup"],
  },
  {
    name: "E-commerce & web apps",
    need: "ecommerce",
    weeks: "6–10 weeks",
    fits: "Online stores, portals & dashboards",
    items: ["Everything in Business website", "eSewa, Khalti & Fonepay checkout", "Products, orders & inventory admin", "Customer accounts & dashboards", "APIs & third-party integrations"],
  },
  {
    name: "Product build",
    need: "app",
    weeks: "10–16 weeks",
    fits: "Startups & new digital products",
    items: ["UX research & clickable prototype", "Web app + iOS & Android apps", "Backend, APIs & admin panel", "Analytics, QA & store launch", "Weekly demos on staging"],
  },
];

// What actually moves a quote, shown under the receipts.
export const PRICE_FACTORS = [
  "Number of pages & screens",
  "Custom features & dashboards",
  "Payments & integrations",
  "Content & copywriting",
  "Web only, or web + mobile apps",
  "Care plan after launch",
];

// Who the work is for. Each kind of client is backed by a product our
// founding team shipped (before Ankora, as the homepage notes); `look` is the
// phrase people search for it.
export const INDUSTRIES = [
  { name: "E-commerce & retail", look: "E-commerce website development", proof: "Ratna · Hukut", color: "#D5E27B" },
  { name: "Fintech & payments", look: "Fintech & money transfer apps", proof: "TransferNet", color: "#EBD5C0" },
  { name: "AI-powered services", look: "AI chatbots & automation", proof: "Answer Service", color: "#E7B7AF" },
  { name: "Startups & new products", look: "MVP & startup app development", proof: "Sprint → Build", color: "#CFE8A3" },
  { name: "Businesses going online", look: "Company & business websites", proof: "Business website", color: "#FBF8EF" },
];

export const INTEGRATIONS = ["eSewa", "Khalti", "Fonepay", "connectIPS", "IME Pay", "Bank QR", "Stripe", "PayPal", "SMS gateways", "Google Maps", "Email & WhatsApp", "Any REST API"];
