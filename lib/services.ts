// Single source for /services and the per-service pages at /services/[slug].
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
  /** /services/[slug]: search title, meta description and H1 */
  seo: { title: string; description: string; h1: string };
  /** /services/[slug]: opening paragraphs */
  intro: string[];
  /** /services/[slug]: what each deliverable means, same order as `deliverables` */
  details: string[];
  /** /services/[slug]: questions specific to this service */
  faq: { q: string; a: string }[];
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
      "UX flows & wireframes",
      "UI design & clickable prototypes",
      "Design systems & component libraries",
      "Brand & art direction",
    ],
    stack: ["Figma", "FigJam", "Framer", "Maze"],
    cta: "Start a design project",
    scene: "design",
    client: { name: "Ratna", thumb: "/images/homepage/Trail1.webp", kind: "Furniture commerce" },
    theme: { ground: "#D5E27B", ink: "#002813", accent: "#004822" },
    seo: {
      title: "Product Design: UX, UI & Design Systems | Ankora Labs",
      description:
        "UX research, UI design, prototypes and design systems for web and mobile products. Ankora Labs turns rough ideas into products people want to use.",
      h1: "Product design services",
    },
    intro: [
      "Good product design starts before anyone opens Figma. We begin with your business goals and the people who will use the product, then work out the few flows that matter most and design those properly.",
      "You get research you can act on, wireframes you can test, and polished interfaces built on a design system your engineers can keep extending. Because our designers sit in the same squad as our engineers, what we design is what ships.",
    ],
    details: [
      "Interviews, analytics reviews and heuristic audits that show where users struggle and what to fix first.",
      "Journeys and low-fidelity wireframes that settle structure and logic before visual polish.",
      "High-fidelity screens and clickable prototypes you can put in front of users and investors.",
      "Tokens, components and documentation so every new screen stays consistent and fast to build.",
      "Visual direction, type and colour that make the product feel like your brand, not a template.",
    ],
    faq: [
      {
        q: "Do you design for both web and mobile?",
        a: "Yes. We design responsive web apps, marketing sites and native iOS and Android apps, usually from one shared design system.",
      },
      {
        q: "Will we own the design files?",
        a: "Yes. Figma files, components and documentation are yours, and we hand them over in a state your team can keep working in.",
      },
      {
        q: "Can you improve an existing product instead of starting over?",
        a: "Often that is the better option. We audit what you have, fix the flows that cost you the most, and introduce a design system gradually.",
      },
    ],
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
      "Marketing sites & web apps",
      "React / Next.js frontends",
      "APIs, backends & integrations",
      "CMS & e-commerce",
      "Performance, accessibility & SEO",
    ],
    stack: ["Next.js", "TypeScript", "Node", "Postgres", "Vercel"],
    cta: "Start a build",
    scene: "engineering",
    client: { name: "Hukut", thumb: "/images/homepage/Trail7.webp", kind: "Multi-category marketplace" },
    theme: { ground: "#0C3D26", ink: "#FBF8EF", accent: "#D5E27B" },
    seo: {
      title: "Web Development: Next.js Sites & Web Apps | Ankora Labs",
      description:
        "Fast, accessible, search-ready websites and web apps built with Next.js, TypeScript and Node. Ankora Labs ships to production, not just mockups.",
      h1: "Web development & engineering services",
    },
    intro: [
      "We build websites and web applications that load fast, rank well and stay easy to change. That means a modern stack, clean code with tests where they matter, and production infrastructure set up properly from day one.",
      "From marketing sites to complex web apps with their own APIs, we take projects all the way to launch and keep them healthy after. You see progress every week on a real staging link.",
    ],
    details: [
      "Company websites, landing pages and full web applications, designed to convert and built to last.",
      "Component-driven frontends in React and Next.js with server rendering for speed and SEO.",
      "Backends, REST and GraphQL APIs, databases and integrations with the tools you already use.",
      "Content management and online stores your team can update without calling a developer.",
      "Core Web Vitals, accessibility to WCAG and technical SEO, measured rather than promised.",
    ],
    faq: [
      {
        q: "Which technologies do you use?",
        a: "Mostly Next.js, React, TypeScript, Node and Postgres, deployed on Vercel or your own cloud. If you already have a stack, we work in it.",
      },
      {
        q: "Do you handle hosting and deployment?",
        a: "Yes. We set up hosting, domains, environments and automated deployments, and hand over every account so you stay in control.",
      },
      {
        q: "Is SEO included in a website build?",
        a: "Technical SEO is part of every build: fast pages, clean markup, metadata, structured data, sitemaps and redirects.",
      },
    ],
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
      "Push, auth & in-app payments",
      "App Store & Play Store launch",
      "Ongoing releases & maintenance",
    ],
    stack: ["React Native", "Expo", "Swift", "Kotlin"],
    cta: "Start an app",
    scene: "mobile",
    client: { name: "TransferNet", thumb: "/images/homepage/Trail8.webp", kind: "Money transfer app" },
    theme: { ground: "#EBD5C0", ink: "#2E1A0B", accent: "#B5703C" },
    seo: {
      title: "Mobile App Development: iOS & Android | Ankora Labs",
      description:
        "Native-quality iOS and Android apps from one codebase with React Native. Offline sync, payments, push and App Store launch by Ankora Labs.",
      h1: "Mobile app development services",
    },
    intro: [
      "We build iOS and Android apps that feel at home on each platform, from a single React Native codebase. One team, one codebase, two app stores, without the app feeling like a website in a wrapper.",
      "We plan for real-world conditions from the start: patchy connections, older phones, push notifications and payments. Then we take the app through App Store and Play Store review and keep shipping updates after launch.",
    ],
    details: [
      "Apps for iPhone and Android phones built from one shared codebase, with native modules where needed.",
      "Local storage and background sync so the app keeps working when the connection drops.",
      "Sign-in, push notifications and in-app purchases or payments, wired up securely.",
      "Store listings, review submissions and release management for both stores.",
      "Regular releases, OS updates and crash monitoring so the app stays reliable.",
    ],
    faq: [
      {
        q: "Native or cross-platform?",
        a: "Usually React Native with Expo: one codebase for iOS and Android with native performance. We write Swift or Kotlin modules when a feature needs them.",
      },
      {
        q: "Can you publish the app to the App Store and Play Store?",
        a: "Yes. We prepare the listings, handle review submissions and set up release pipelines, all under your developer accounts.",
      },
      {
        q: "Do you build the backend too?",
        a: "Yes. Our engineering team builds the APIs, databases and admin dashboards that the app needs.",
      },
    ],
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
    seo: {
      title: "AI Development: Assistants & Automation | Ankora Labs",
      description:
        "AI assistants, semantic search, agents and workflow automation built into your product with the latest models, with evals and guardrails, by Ankora Labs.",
      h1: "AI development & automation services",
    },
    intro: [
      "AI is useful when it removes real work for your users or your team. We find those places first, then build assistants, search and automations that fit into your product instead of sitting beside it.",
      "We work with the latest models and keep things measurable: every feature ships with evaluations, guardrails and monitoring, so you know it is accurate, safe and worth what it costs to run.",
    ],
    details: [
      "Chat interfaces and assistants inside your product that answer questions and take actions for users.",
      "Search that understands meaning, over your documents, products or support content.",
      "Repetitive processes like triage, data entry and reporting handed to reliable automations.",
      "Agents that call your tools and APIs to complete multi-step tasks, with humans in the loop where needed.",
      "Test sets, safety checks and dashboards that track quality, cost and latency over time.",
    ],
    faq: [
      {
        q: "Which AI models do you work with?",
        a: "We pick the model per task from the major providers, including Claude, GPT and open models, and design so you can switch later.",
      },
      {
        q: "Is our data safe?",
        a: "We use providers and settings that do not train on your data, keep sensitive data out of prompts where possible, and log access.",
      },
      {
        q: "How do you know the AI feature works?",
        a: "Every feature gets an evaluation set built from real examples. We measure accuracy before launch and keep monitoring it after.",
      },
    ],
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
