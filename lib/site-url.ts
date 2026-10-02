// Absolute site origin for OG/twitter image URLs and canonical links. No
// production domain is recorded in the repo, so take it from the environment:
// NEXT_PUBLIC_SITE_URL if set, otherwise the Vercel production domain,
// otherwise the local dev server.
export const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3200");
