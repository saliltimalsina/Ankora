import type { MetadataRoute } from "next";
import { siteUrl } from "../lib/site-url";

// /robots.txt — everything is crawlable except the internal statsig stub;
// points crawlers at the sitemap.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/statsig-disabled" },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
