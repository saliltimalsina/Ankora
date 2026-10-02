import type { MetadataRoute } from "next";

// /manifest.webmanifest — name, colours and icons for "Add to Home Screen".
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Ankora Labs",
    short_name: "Ankora",
    description:
      "Ankora Labs designs and builds digital products that are fast, scalable, and built to make an impact.",
    start_url: "/",
    display: "browser",
    background_color: "#f4f1e6",
    theme_color: "#1e4626",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
  };
}
