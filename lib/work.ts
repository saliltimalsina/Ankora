// Founding-team projects: the work showcase (components/showcase) and /work.
// Done before Ankora, shown with credit to their owners. No outcome figures on
// purpose: we only state what we did and when.
//
// Short keys are the showcase engine's: n name, cat category, yr year,
// d description, role chips, img/alt/pos image, thumb finished composition,
// ic folder icon, url/dom/live link.

export type Project = {
  n: string;
  cat: string;
  yr: string;
  d: string;
  role: string[];
  img: string;
  alt: string;
  thumb?: number;
  pos?: string;
  ic: string;
  url: string;
  dom: string;
  live: number;
};

export const PROJECTS: Project[] = [
  {n:"Telvox",cat:"AI voice platform",yr:"2026",
   d:"One command centre for teams to build their AI voice agents, audit what they said, and bill for it.",
   role:["Product Design","AI Platform"],
   img:"/images/work/telvox-card.webp",thumb:1,pos:"0% 50%",alt:"Telvox AI voice agent platform",ic:"wave",
   url:"https://telvox.ai",dom:"telvox.ai",live:1},
  {n:"OCCS",cat:"Call centre platform",yr:"2024–2026",
   d:"The screen 300+ call centre clerks work in all day, with everything needed during a live call on one screen.",
   role:["UX","Product Design","Research"],
   img:"/images/work/occs-card.webp",thumb:1,alt:"OCCS callbacks screen with an incoming call, on a laptop",ic:"srv",
   url:"#",dom:"OCCS clerk console",live:0},
  {n:"Mantra Ideas",cat:"Agency website",yr:"2026",
   d:"Mantra Ideas’ own site, designed and built down to every pixel and every line.",
   role:["Web Design","Development"],
   img:"/images/work/mantra-ideas.webp",alt:"Mantra Ideas homepage",ic:"cube",
   url:"https://mantraideas.com",dom:"mantraideas.com",live:1},
  {n:"Telvox.ai",cat:"Landing page",yr:"2026",
   d:"The site that pitches Telvox before the demo does.",
   role:["Landing Page","Web Design","Development"],
   img:"/images/work/telvox-site-card.webp",thumb:1,alt:"Telvox marketing site on a laptop",ic:"arch",
   url:"https://telvox.ai",dom:"telvox.ai",live:1},
  {n:"Hukut",cat:"E-commerce",yr:"2025",
   d:"Nepal’s gadget store, rebuilt so visitors actually become buyers.",
   role:["E-commerce","Product Design"],
   img:"/images/work/hukut-card.webp",thumb:1,alt:"Hukut gadget store on a laptop",ic:"bag",
   url:"https://hukut.com",dom:"hukut.com",live:1}
];

/** URL fragment for a project on /work, e.g. "Telvox.ai" -> "telvox-ai" */
export const projectSlug = (p: Project) => p.n.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
