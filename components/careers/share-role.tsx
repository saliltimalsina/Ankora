"use client";

import { useState } from "react";

// "Share this role" on a role sheet: a link to /careers that lands on this
// role's sheet (#slug). Phones get the native share sheet; desktops copy the link and say so.

export default function ShareRole({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const share = async () => {
    const url = `${location.origin}/careers#${slug}`;
    const text = `${title} at Ankora Labs. Remote, anywhere in Nepal.`;
    if (navigator.share && matchMedia("(pointer:coarse)").matches) {
      try {
        await navigator.share({ title: `${title} | Ankora Labs`, text, url });
      } catch {} // closed the sheet
      return;
    }
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      window.prompt("Copy this link:", url);
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  return (
    <button type="button" className="cr-ghost cr-share" onClick={share}>
      <svg viewBox="0 0 20 20" aria-hidden="true">
        <path d="M8.5 11.5a3.5 3.5 0 0 0 5 0l3-3a3.5 3.5 0 0 0-5-5l-1 1M11.5 8.5a3.5 3.5 0 0 0-5 0l-3 3a3.5 3.5 0 0 0 5 5l1-1" />
      </svg>
      <span aria-live="polite">{copied ? "Link copied" : "Share this role"}</span>
    </button>
  );
}
