# Ankora

Ankora Labs marketing site. A minimal Next.js shell serves the static snapshot
`ankora.html` verbatim at `/`; the prebuilt `/amplify/_next` chunks in `public/`
hydrate the page so every animation runs client-side exactly as authored.

    npm install   # required first — `next` lives in node_modules, so a fresh
                  # clone fails `npm run dev` with "next: command not found"
    npm run dev   # http://localhost:3200
    npm run build # prerenders / and /contact to static HTML

## Structure

`/services`, `/contact` and the 404 page are React pages. The homepage is still
a snapshot: `app/route.ts` serves `ankora.html` with the shared pieces spliced
in, and the prebuilt `/amplify/_next` chunks hydrate it.

    app/route.ts                         /          -> ankora.html (snapshot)
    app/services/page.tsx                /services
    app/contact/page.tsx                 /contact
    app/statsig-disabled/[[...path]]/    stub for the snapshot's Statsig SDK,
                                         which blocks render until /initialize
                                         answers (the bundle is patched to call
                                         this path instead of the vendor)

### For agents

    middleware.ts                Markdown by content negotiation: a page URL
                                 with "Accept: text/markdown", or the path plus
                                 ".md" (/services.md, /index.md), is rewritten
                                 to the Markdown route. Missing pages answer 404
                                 in Markdown the same way.
    app/md/[[...path]]/route.ts  the Markdown twin of every page
    app/llms.txt/route.ts        /llms.txt: what we do, when to send someone
                                 to us, and each page's Markdown URL
    lib/markdown.ts              the Markdown itself, built from lib/site.ts,
                                 lib/services.ts and lib/careers.ts. Pages with
                                 no entry there (legal pages, new pages) are
                                 converted from their HTML, so a new page needs
                                 nothing extra.

    npm test                                  build, then check all of the above
    BASE_URL=https://ankoralabs.com npm test  check a deployment (skip the
                                              build: node --test tests/*.test.mjs)

### Shared pieces: one copy each

    lib/site.ts                  contact details + booking (Cal.com, WhatsApp,
                                 email, phone). Change them here only.
    components/kit/              nav, footer, "Let's build" ending, showcase
                                 styles, as plain HTML + CSS, so the React
                                 pages and the homepage snapshot use the same
                                 markup. {{TOKENS}} are filled from lib/site.ts
                                 by lib/kit.ts.
    public/kit/site.js           behaviour on every page: Cal.com popup, nav
                                 mobile menu, footer plants, WhatsApp pill
    public/kit/showcase.js       the work showcase engine (both pages)
    public/kit/home.js           homepage only: places the showcase and the
                                 "Let's build" ending after hydration
    components/ui/               BookCall, WhatsApp, WaIcon, SectionHead
    partials/preloader*.html     preloader (homepage, /contact)

React pages render them with `<SiteNav />`, `<SiteFooter />`, `<LetsBuild />`
and `<WorkShowcase />`. In `ankora.html` the footer and showcase sit at
`<!--KIT:...-->` markers that `app/route.ts` fills; the nav is appended at the
end of `<body>`, where nodes sit outside React's reconciled tree and survive
hydration.

Note: `ankora.html` embeds a React flight stream with byte-length-prefixed
rows (`id:T<hexlen>,`). Hand-editing hydrated content requires updating those
lengths, or hydration silently falls back / breaks.
