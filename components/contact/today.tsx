"use client";

import { useEffect, useState } from "react";

// The tear-off calendar page on the "Book a call" card shows today's date.
// Set after mount: the page is prerendered, so a build-time date would be stale.
export default function Today() {
  const [d, setD] = useState<{ mon: string; day: string } | null>(null);
  useEffect(() => {
    const now = new Date();
    setD({ mon: now.toLocaleString("en", { month: "short" }).toUpperCase(), day: String(now.getDate()).padStart(2, "0") });
  }, []);
  return (
    <>
      <b className="gw-mon">{d?.mon ?? " "}</b>
      <span className="gw-day">{d?.day ?? " "}</span>
    </>
  );
}
