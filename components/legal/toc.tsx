"use client";

import { useEffect, useState } from "react";

// Sticky contents list for the legal pages; marks the section being read.

export default function Toc({ items }: { items: { id: string; title: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);

  useEffect(() => {
    const els = items.map((i) => document.getElementById(i.id)).filter((e): e is HTMLElement => !!e);
    const io = new IntersectionObserver(
      (entries) => {
        const hit = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top)[0];
        if (hit) setActive(hit.target.id);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );
    els.forEach((e) => io.observe(e));
    return () => io.disconnect();
  }, [items]);

  return (
    <nav className="lg-toc" aria-label="On this page">
      <p className="lg-toc-h">On this page</p>
      <ol>
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} aria-current={active === it.id ? "true" : undefined}>
              <span>{String(i + 1).padStart(2, "0")}</span>
              {it.title}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
