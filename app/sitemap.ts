import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site-url";
import { SERVICES } from "../lib/services";

// /sitemap.xml — the public pages, including one per service.
export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return [
    { url: `${siteUrl}/`, lastModified, changeFrequency: "monthly", priority: 1 },
    { url: `${siteUrl}/services`, lastModified, changeFrequency: "monthly", priority: 0.9 },
    ...SERVICES.map((x) => ({
      url: `${siteUrl}/services/${x.slug}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    { url: `${siteUrl}/work`, lastModified, changeFrequency: "monthly", priority: 0.7 },
    { url: `${siteUrl}/about`, lastModified, changeFrequency: "yearly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified, changeFrequency: "yearly", priority: 0.6 },
  ];
}
