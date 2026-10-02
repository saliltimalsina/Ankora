import { siteUrl } from "../lib/site-url";

// Renders schema.org structured data. Server component; the JSON is escaped so
// a "</script>" inside copy can't close the tag early.
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  const json = JSON.stringify({ "@context": "https://schema.org", ...data }).replace(/</g, "\\u003c");
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: json }} />;
}

// Same @id as the homepage's Organization, so every page's data points at one
// entity.
export const ORG_ID = `${siteUrl}/#organization`;

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: it.name,
      item: `${siteUrl}${it.path}`,
    })),
  };
}
