// The /contact brief builder's chips ("I'm a / I need / When"). Shared by the
// form (components/contact/brief.tsx) and /api/contact, which only accepts
// these labels: they're echoed in the confirmation email, so free text can't be.
// `k` is the key the pricing cards preselect with /contact?need=<k>#brief.

export type Group = "who" | "need" | "when";

export const GROUPS: { key: Group; legend: string; chips: { label: string; v: string; k?: string }[] }[] = [
  {
    key: "who",
    legend: "I’m a",
    chips: [
      { label: "Startup", v: "a startup" },
      { label: "Business", v: "a business" },
      { label: "Agency", v: "an agency" },
      { label: "Non-profit", v: "a non-profit" },
    ],
  },
  {
    key: "need",
    legend: "I need",
    chips: [
      { label: "Website", v: "a website", k: "website" },
      { label: "E-commerce", v: "an online store", k: "ecommerce" },
      { label: "Mobile app", v: "a mobile app", k: "app" },
      { label: "UI/UX", v: "UI/UX design", k: "uiux" },
      { label: "AI", v: "an AI feature", k: "ai" },
      { label: "Not sure yet", v: "help figuring out what I need" },
    ],
  },
  {
    key: "when",
    legend: "When",
    chips: [
      { label: "ASAP", v: "as soon as possible" },
      { label: "1–2 months", v: "in the next 1–2 months" },
      { label: "Just exploring", v: "later. Just exploring for now" },
    ],
  },
];

/** The chip label for `group`, or "" if `label` isn't one of them. */
export const chipLabel = (group: Group, label: string) =>
  GROUPS.find((g) => g.key === group)!.chips.find((c) => c.label === label)?.label ?? "";
