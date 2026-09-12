"use client";

import { useEffect, useState } from "react";
import s from "./site-nav.module.css";

// Shared site navigation, rebuilt as a component from partials/navbar.html.
// The partial stays in place for the routes still served from HTML snapshots
// (/, /contact); this is what replaces it as those routes move over.

const LINKS = [
  { href: "/#svc-stage", label: "Services", mega: true },
  { href: "/#show-stage", label: "Work" },
  { href: "/#why-us", label: "Why Us" },
  { href: "/#testimonials", label: "Testimonials" },
  { href: "/#main-footer", label: "Contact" },
];

const SERVICES = [
  {
    href: "/#svc-stage",
    title: "Product Design",
    sub: "UI/UX, design systems & prototypes",
    icon: (
      <>
        <path d="m12 19 7-7 3 3-7 7-3-3z" />
        <path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z" />
        <path d="m2 2 7.586 7.586" />
        <circle cx="11" cy="11" r="2" />
      </>
    ),
  },
  {
    href: "/#svc-stage",
    title: "Engineering",
    sub: "Web apps & full-stack builds",
    icon: (
      <>
        <polyline points="16 18 22 12 16 6" />
        <polyline points="8 6 2 12 8 18" />
      </>
    ),
  },
  {
    href: "/#svc-stage",
    title: "Mobile",
    sub: "iOS & Android apps",
    icon: (
      <>
        <rect x="5" y="2" width="14" height="20" rx="2.5" />
        <line x1="12" y1="18" x2="12.01" y2="18" />
      </>
    ),
  },
  {
    href: "/#svc-stage",
    title: "AI / Intelligence",
    sub: "AI features & workflow automation",
    icon: (
      <>
        <path d="M12 3v2M12 19v2M5 12H3M21 12h-2M6.3 6.3 4.9 4.9M19.1 19.1l-1.4-1.4M17.7 6.3l1.4-1.4M4.9 19.1l1.4-1.4" />
        <circle cx="12" cy="12" r="4" />
      </>
    ),
  },
];

function Icon({ children, size = 20 }: { children: React.ReactNode; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export default function SiteNav() {
  const [open, setOpen] = useState(false);

  // Lock the page behind the full-screen mobile panel, and close on Escape.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const logo = (
    <a className={s.logo} href="/" aria-label="Ankora Labs — home">
      <img src="/images/logos/ankora-labs.svg" alt="Ankora Labs" width={200} height={107} />
    </a>
  );

  return (
    <header className={s.wrap}>
      {/* desktop */}
      <div className={`${s.bar} ${s.desktopOnly}`}>
        <div className={s.inner}>
          <div className={s.left}>
            {logo}
            <ul className={s.links}>
              {LINKS.map((l) => (
                <li key={l.label} className={l.mega ? s.svc : undefined}>
                  <a className={s.link} href={l.href} aria-haspopup={l.mega || undefined}>
                    {l.label}
                    {l.mega && (
                      <svg
                        className={s.caret}
                        width="11"
                        height="11"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2.5}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        aria-hidden="true"
                      >
                        <polyline points="6 9 12 15 18 9" />
                      </svg>
                    )}
                  </a>

                  {l.mega && (
                    <div className={s.mega} role="menu" aria-label="Services">
                      <div className={s.megaGrid}>
                        {SERVICES.map((item) => (
                          <a key={item.title} className={s.megaItem} href={item.href} role="menuitem">
                            <span className={s.megaIcon}>
                              <Icon>{item.icon}</Icon>
                            </span>
                            <span>
                              <span className={s.megaTitle}>{item.title}</span>
                              <span className={s.megaSub}>{item.sub}</span>
                            </span>
                          </a>
                        ))}
                      </div>
                      <a className={s.megaFeat} href="/#show-stage" role="menuitem">
                        <span className={s.featTag}>Featured</span>
                        <span className={s.featTitle}>See the products we&rsquo;ve shipped</span>
                        <span className={s.featCta}>Explore our work &rarr;</span>
                      </a>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className={s.actions}>
            <a className={s.book} href="/contact">Book a Call</a>
            <a className={s.cta} href="/contact">Build with us</a>
          </div>
        </div>
      </div>

      {/* mobile */}
      <div className={`${s.bar} ${s.mobileOnly}`}>
        {logo}
        <button
          type="button"
          className={s.burger}
          aria-controls="site-nav-panel"
          aria-expanded={open}
          aria-label="Toggle navigation menu"
          onClick={() => setOpen((v) => !v)}
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" aria-hidden="true">
            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
          </svg>
        </button>
      </div>

      {open && (
        <div id="site-nav-panel" className={`${s.panel} ${s.mobileOnly}`}>
          <nav>
            <ul>
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a href={l.href} onClick={() => setOpen(false)}>{l.label}</a>
                </li>
              ))}
            </ul>
          </nav>
          <div className={s.panelActions}>
            <a className={s.cta} href="/contact">Build with us</a>
            <a className={s.book} href="/contact">Book a Call</a>
          </div>
        </div>
      )}
    </header>
  );
}
