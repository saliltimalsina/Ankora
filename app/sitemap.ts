import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site-url";

// /sitemap.xml — the public pages. Add /services/[slug] here when those land.
// lastModified is the date the page's content last really changed: bump it by
// hand when you edit a page. Google only trusts lastmod when it's accurate, so
// don't use new Date() (that stamps every page on every deploy).
// Google ignores changefreq and priority, so they're left out.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${siteUrl}/`, lastModified: "2026-10-03" },
    { url: `${siteUrl}/services`, lastModified: "2026-10-03" },
    { url: `${siteUrl}/contact`, lastModified: "2026-10-03" },
    { url: `${siteUrl}/careers`, lastModified: "2026-10-03" },
    { url: `${siteUrl}/privacy`, lastModified: "2026-10-03" },
    { url: `${siteUrl}/terms`, lastModified: "2026-10-03" },
  ];
}
