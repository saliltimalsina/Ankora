# Ankora

Ankora Labs marketing site. A minimal Next.js shell serves the static snapshot
`ankora.html` verbatim at `/`; the prebuilt `/amplify/_next` chunks in `public/`
hydrate the page so every animation runs client-side exactly as authored.

    npm install   # if node_modules not present
    npm run dev   # http://localhost:3200

Routes: `/` (ankora.html), `/contact` (contact.html), `/contact-v2`
(contact-v2.html) — each served by a route handler in `app/`.

Note: `ankora.html` embeds a React flight stream with byte-length-prefixed
rows (`id:T<hexlen>,`). Hand-editing hydrated content requires updating those
lengths, or hydration silently falls back / breaks.
