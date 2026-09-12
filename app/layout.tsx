import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

// Root layout for the rebuilt app. Route handlers (app/route.ts serving the
// homepage snapshot, app/contact/route.ts) return raw Responses and are not
// affected by this layout — only real page routes render inside it.

const disp = localFont({
  variable: "--font-disp",
  display: "swap",
  src: [
    { path: "../public/fonts/RadionB-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/RadionB-Demi.woff2", weight: "600", style: "normal" },
    { path: "../public/fonts/RadionB-Bold.woff2", weight: "700", style: "normal" },
  ],
});

const body = localFont({
  variable: "--font-body",
  display: "swap",
  src: [
    { path: "../public/fonts/basis-grotesque-regular-pro.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/basis-grotesque-medium-pro.woff2", weight: "500", style: "normal" },
    { path: "../public/fonts/basis-grotesque-bold-pro.woff2", weight: "700", style: "normal" },
  ],
});

const serif = localFont({
  variable: "--font-serif",
  display: "swap",
  src: [
    { path: "../public/fonts/Tobias-Regular.woff2", weight: "400", style: "normal" },
    { path: "../public/fonts/Tobias-RegularItalic.woff2", weight: "400", style: "italic" },
  ],
});

const hand = localFont({
  variable: "--font-hand",
  display: "swap",
  src: [{ path: "../public/fonts/caveat-0.woff2", weight: "400", style: "normal" }],
});

// Absolute base for OG/twitter image URLs. No production domain is recorded in
// the repo, so take it from the environment: NEXT_PUBLIC_SITE_URL if set,
// otherwise the Vercel production domain, otherwise the local dev server.
const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3200");

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Ankora Labs | Design. Build. Grow.",
  description:
    "Ankora Labs designs and builds digital products that are fast, scalable, and built to make an impact.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" },
    ],
  },
  openGraph: {
    title: "Ankora Labs | Design. Build. Grow.",
    description:
      "Ankora Labs designs and builds digital products that are fast, scalable, and built to make an impact.",
    images: ["/images/homepage/meta-image.jpg"],
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${disp.variable} ${body.variable} ${serif.variable} ${hand.variable}`}
    >
      <body>{children}</body>
    </html>
  );
}
