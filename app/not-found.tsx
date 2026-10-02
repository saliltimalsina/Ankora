import type { Metadata } from "next";
import Link from "next/link";
import SiteNav from "../components/site-nav";
import s from "./not-found.module.css";

// Branded 404: keeps visitors who hit a dead link on the site, with a way back
// to the pages that exist. Next sends it with a 404 status and noindex.

export const metadata: Metadata = {
  title: "Page not found | Ankora Labs",
  robots: { index: false },
};

export default function NotFound() {
  return (
    <>
      <SiteNav />
      <main className={s.main}>
        <p className={s.eyebrow}>404</p>
        <h1 className={s.title}>
          This page went <em>off-grid.</em>
        </h1>
        <p className={s.lede}>The link may be old or mistyped. Here’s where to pick things back up.</p>
        <nav className={s.links}>
          <Link href="/" className={s.primary}>Back to home</Link>
          <Link href="/services">Our services</Link>
          <Link href="/contact">Contact us</Link>
        </nav>
      </main>
    </>
  );
}
