import type { AnchorHTMLAttributes, ReactNode } from "react";
import { BOOK_ATTRS, waLink } from "../../lib/site";

// The two contact actions used across the site. Use these instead of writing
// the Cal.com / WhatsApp details into a component, so they change in one
// place (lib/site.ts).

type A = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, "href"> & { children: ReactNode };

/** Opens the Cal.com booking popup (public/kit/site.js); falls back to cal.com. */
export function BookCall({ children, ...rest }: A) {
  return (
    <a {...BOOK_ATTRS} {...rest}>
      {children}
    </a>
  );
}

/** Opens a WhatsApp chat with `text` already typed. */
export function WhatsApp({ text, children, ...rest }: A & { text?: string }) {
  return (
    <a href={waLink(text)} target="_blank" rel="noopener" {...rest}>
      {children}
    </a>
  );
}

export function WaIcon({ size = 17, className }: { size?: number; className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2Zm0 18.2a8.2 8.2 0 0 1-4.2-1.2l-.3-.2-3 .8.8-2.9-.2-.3A8.2 8.2 0 1 1 12 20.2Zm4.5-6.1c-.2-.1-1.5-.7-1.7-.8-.2-.1-.4-.1-.6.1l-.8 1c-.1.2-.3.2-.5.1a6.7 6.7 0 0 1-3.3-2.9c-.2-.4.2-.4.7-1.3.1-.2 0-.3 0-.4l-.8-1.8c-.2-.5-.4-.4-.6-.4h-.5a1 1 0 0 0-.7.3 3 3 0 0 0-.9 2.2 5.2 5.2 0 0 0 1.1 2.7 11.8 11.8 0 0 0 4.5 4c1.7.7 2.3.8 3.2.6.5-.1 1.5-.6 1.7-1.2.2-.6.2-1.1.2-1.2-.1-.1-.3-.2-.5-.3Z" />
    </svg>
  );
}
