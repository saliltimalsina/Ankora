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
