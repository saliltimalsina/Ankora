// Open roles on /careers. Add a role here and it gets a card, a chip in the
// "Apply in a minute" form and a JobPosting entry for Google's job listings.
// Remove it when the seat is filled; the page shows an empty state when the
// list is empty. Don't list pay figures; commission rates are agreed in writing.

export type Role = {
  slug: string;
  title: string;
  /** short chip label for the apply form */
  chip: string;
  tags: string[];
  summary: string;
  doing: string[];
  paid: string[];
  fit: string[];
  get: string[];
  posted: string; // YYYY-MM-DD
  validThrough: string; // YYYY-MM-DD
  /** show the printed commission slip on this role's sheet (commission-paid roles) */
  commissionSlip?: boolean;
};

export const ROLES: Role[] = [
  {
    slug: "marketing-partner",
    title: "Business Development & Marketing Partner",
    chip: "Marketing partner",
    tags: ["Commission-based", "Project by project", "Remote · anywhere in Nepal", "Flexible hours"],
    summary:
      "You know business owners who need a better website, online store or app. We design and build them. You bring the project, we do the work, and you earn a commission on every project that signs.",
    doing: [
      "Spot businesses in your network that need a website, web app, e-commerce store or mobile app",
      "Introduce them to us on WhatsApp or a call, and join the first conversation if you like",
      "Share our work on LinkedIn, Facebook and Instagram, and in the places your clients already are",
      "Keep in touch with the clients you bring, so the next project comes back to you too",
    ],
    paid: [
      "A commission on every project you bring in, as a share of the project’s value",
      "Paid in step with the client: when they pay us, you’re paid within 7 days",
      "Your rate is agreed in writing before you start, with no targets and no fixed hours",
      "This is commission only, not a salaried job. Bring more projects, earn more",
    ],
    fit: [
      "Freelance marketers, sales people and consultants",
      "People who already talk to business owners: accountants, printers, event planners, agency folk",
      "Students and graduates with a strong network and a lot of hustle",
      "Comfortable explaining things in Nepali and English",
    ],
    get: [
      "A portfolio deck and project stories you can share",
      "Every lead logged under your name, so credit is never in question",
      "Our designers and engineers on sales calls when you need them",
      "Honest updates on every lead you introduce, won or lost",
    ],
    posted: "2026-10-03",
    validThrough: "2027-04-03",
    commissionSlip: true,
  },
];

// The apply form's chips. /api/apply only accepts these labels: they're echoed
// in the confirmation email, so free text can't be.
export const SEATS = [
  ...ROLES.map((r) => ({ label: r.chip, v: `a ${r.chip.toLowerCase()}` })),
  { label: "Designer", v: "a designer" },
  { label: "Developer", v: "a developer" },
  { label: "Something else", v: "something else (I’ll explain)" },
];
export const BACKGROUND = [
  { label: "Student", v: "a student" },
  { label: "1–3 years in", v: "1–3 years into my career" },
  { label: "4+ years in", v: "4+ years into my career" },
];
