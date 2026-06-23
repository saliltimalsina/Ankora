/** @type {import('next').NextConfig} */
const nextConfig = {
  // Snapshot assets live in /public (amplify/_next, images, fonts) and are
  // served verbatim. No image optimization so the original markup stays exact.
  images: { unoptimized: true },
};

export default nextConfig;
