# Ankora

Ankora Labs marketing site. A minimal Next.js shell serves the static snapshot
`ankora.html` verbatim at `/`; the prebuilt `/amplify/_next` chunks in `public/`
hydrate the page so every animation runs client-side exactly as authored.

    npm install   # required first — `next` lives in node_modules, so a fresh
                  # clone fails `npm run dev` with "next: command not found"
    npm run dev   # http://localhost:3200
    npm run build # prerenders / and /contact to static HTML

## Structure

There is no `app/layout.tsx` or `app/page.tsx`, and that is deliberate: nothing
here is a React page. Every route is a route handler that reads a snapshot HTML
file off disk, splices the shared partials into it and returns the string. Both
page routes are `force-static`, so the splicing happens once at build time and
the deployed output is plain static HTML.

    app/route.ts                         /          -> ankora.html
    app/contact/route.ts                 /contact   -> contact.html
    app/statsig-disabled/[[...path]]/    stub for the snapshot's Statsig SDK,
                                         which blocks render until /initialize
                                         answers (the bundle is patched to call
                                         this path instead of the vendor)

    partials/navbar.html                 shared nav, injected into both pages
    partials/preloader-head.html         preloader boot: paints the ground in
                                         <head> before first paint
    partials/preloader.html              preloader overlay, appended to <body>

Shared markup lives in `partials/` and is injected by every route that needs it,
so it is edited in one place. On `/` the nav and preloader are appended at the
end of `<body>` rather than spliced in place — nodes there sit outside React's
reconciled tree and survive hydration.

Note: `ankora.html` embeds a React flight stream with byte-length-prefixed
rows (`id:T<hexlen>,`). Hand-editing hydrated content requires updating those
lengths, or hydration silently falls back / breaks.
