# North Country Tree Co. — Project Context

A demo website for a fictional Plattsburgh, NY tree service company. The user is building this as a **portfolio piece** to pitch real local trades businesses on website builds. Quality bar: should look like a $1,500 build, not a template.

## Stack

- **Framework:** Next.js 15.5 (App Router), React 19, TypeScript
- **Styling:** Tailwind CSS 3.4 — brand colors live in [tailwind.config.ts](tailwind.config.ts)
- **Icons:** `lucide-react`
- **Fonts:** Fraunces (serif, headlines) + Inter (sans, body) via `next/font/google` with CSS variables (`--font-fraunces`, `--font-inter`)
- **Chatbot:** `@anthropic-ai/sdk`, model `claude-haiku-4-5-20251001` (not yet implemented)
- **Forms:** Formspree (placeholder endpoint — see TODOs)
- **Deployment target:** Vercel

## Dev workflow

```
npm run dev     # http://localhost:3000
npm run build   # production build (also type-checks + lints)
```

**Environment quirks on this machine** (Windows):
- Node was installed mid-session via winget; **fresh subprocesses don't see it on PATH**. The bash shell I use prepends `/c/Program Files/nodejs` manually. The Claude Preview MCP launches via `.claude/dev.cmd`, a wrapper that sets PATH explicitly.
- PowerShell execution policy blocks `npm.ps1`. Use `npm.cmd` directly or call from bash.

## Brand

- **Name:** North Country Tree Co. — Tagline: "Plattsburgh's 24/7 Tree Removal & Care"
- **Phone:** (518) 555-0142 (hard-coded in Header, Footer, Hero, QuoteForm — change in all four if it changes)
- **Email:** info@northcountrytreeco.com
- **Colors** (in Tailwind config): `forest` `#1a4d3a` (+ `forest-dark`, `forest-light`), `cream` `#faf6f0`, `charcoal` `#1f2937`, `emergency` `#b91c1c`
- **Tone:** Trustworthy, local, capable. Not corporate, not folksy.

## Structure

Single-page site, all sections on `/`. Anchor nav: `#services`, `#gallery`, `#contact`.

```
src/
  app/
    layout.tsx       # fonts + metadata + suppressHydrationWarning on <body>
    page.tsx         # composes all sections in order
    globals.css      # tailwind + smooth-scroll + reduced-motion
  components/
    Header.tsx       # sticky, scroll-shadow, mobile hamburger (client)
    Logo.tsx
    Hero.tsx         # full-bleed image, gradient overlay, 2 CTAs
    Services.tsx     # 3x2 grid, 6 services, lucide icons
    TrustStrip.tsx   # forest-green band, 4 pillars
    Gallery.tsx      # 3x2 grid, lightbox, IO fade-in (client)
    QuoteForm.tsx    # 5 fields, Formspree, success/error states (client)
    Footer.tsx       # forest-green, 3-col
```

## Live site

- **Production:** https://north-country-tree-co-demo.vercel.app
- **GitHub:** https://github.com/jameswburnham/north-country-tree-co
- **Vercel project:** `devant/north-country-tree-co-demo`
- **Auto-deploy:** every push to `main` deploys to production via the Vercel GitHub integration

## What's built

| Section          | Status | File                              |
| ---------------- | ------ | --------------------------------- |
| Header           | ✅     | [Header.tsx](src/components/Header.tsx) |
| Hero             | ✅     | [Hero.tsx](src/components/Hero.tsx) |
| Services         | ✅     | [Services.tsx](src/components/Services.tsx) |
| Trust Strip      | ✅     | [TrustStrip.tsx](src/components/TrustStrip.tsx) |
| Gallery          | ✅     | [Gallery.tsx](src/components/Gallery.tsx) |
| Quote Form       | ✅     | [QuoteForm.tsx](src/components/QuoteForm.tsx) |
| Footer           | ✅     | [Footer.tsx](src/components/Footer.tsx) |
| Chatbot widget   | ✅     | [Chatbot.tsx](src/components/Chatbot.tsx) |
| Chatbot API      | ✅     | [api/chat/route.ts](src/app/api/chat/route.ts) — Edge runtime, Anthropic Haiku 4.5 streaming |
| Polish pass      | ✅     | Mobile QA, keyboard nav, favicon, OG image, Lighthouse-driven a11y fixes |

## Lighthouse scores (mobile, live URL)

Last run after polish pass: **Performance 98 · Accessibility 100 · Best Practices 100 · SEO 100**.

## Decisions / departures from spec

These are intentional and worth knowing before changing:

- **Hero overlay** is a vertical gradient (`from-black/55 via-black/40 to-black/65`) rather than a flat 40% overlay. A flat overlay risks legibility on busy foliage and reads cheaper.
- **Hero image** — the spec URL `photo-1599598425947-5119f0a8f88a` was a dead 404 on Unsplash. Swapped to `photo-1754321860056-ca7254d5e7ac` (chainsaw arborist, golden hour).
- **Services tiles have no hover effect** — the user pointed out a hover lift made them look clickable, but they aren't links. Static cards.
- **Body has `suppressHydrationWarning`** in [layout.tsx](src/app/layout.tsx) — the Grammarly extension injects `data-new-gr-c-s-check-loaded` and `data-gr-ext-installed` attributes onto `<body>` post-SSR, which trips React's hydration check. The prop only suppresses attribute mismatches on that one element; deeper bugs still surface.
- **Section eyebrows** (small green tracked-out caps above H2s) are added as a polish touch — they're not in the spec but make the page read more "agency" than "template". Used on Services, Gallery, and Quote Form.
- **Lightbox is hand-built**, not a library. Keyboard nav (←/→/Esc), backdrop-click close, body-scroll lock, focus rings.
- **Gallery fade-in** uses Intersection Observer with a 60ms stagger across tiles. Respects `prefers-reduced-motion`.
- **Chatbot model is `claude-haiku-4-5`** (canonical alias, not the date-suffixed form). Per Anthropic's docs and the `claude-api` skill, dated suffixes shouldn't be used for new code.
- **System prompt forbids markdown** — chat UI renders text as-is, so any asterisks/bold would show as literal characters. Discovered during end-to-end testing when emergency response came back with `**(518) 555-0142**`.
- **`max_tokens: 1024`** on the chat route — system prompt requires 1–3 sentence responses; this caps cost at ~$0.005/response while leaving room for longer replies if needed.
- **Three-layer chatbot error handling:** 503 (no API key) → 400 (bad body) → in-stream fallback with the phone number (SDK throws mid-stream). The user always sees a graceful "call us at (518) 555-0142" message regardless of what fails.

## TODOs

**Before demoing to a prospect:**
- **Swap Formspree endpoint** in [QuoteForm.tsx:10](src/components/QuoteForm.tsx:10) — currently `https://formspree.io/f/PLACEHOLDER`. Submitting now hits the error state. Alternative: add a `DEMO_MODE` flag that fakes success.
- Add a real favicon — currently using Next.js default. Spec calls for a simple pine tree, dark green on cream.
- Add OG image (placeholder fine for portfolio).

**Polish pass — completed 2026-04-28:**
- ✅ Lighthouse on live URL: 98 / 100 / 100 / 100
- ✅ Mobile QA at 375px (no overflow, all tap targets ≥44×44, inputs ≥16px to prevent iOS zoom)
- ✅ Keyboard nav: focus-visible rings on every interactive element, Tab focus trap in the gallery lightbox
- ✅ Alt-text tightened on Hero
- ✅ scroll-mt-20 on Services + Gallery + Quote Form
- ✅ Pine-tree favicon ([icon.svg](src/app/icon.svg))
- ✅ Dynamic OG image at 1200×630 ([opengraph-image.tsx](src/app/opengraph-image.tsx))

**Cleanup (low priority):**
- Delete `kenny-v8KJtySAi9k-unsplash.jpg` from project root — leftover from hero-image hunt (gitignored, but still occupies disk).
- **Vercel: orphaned `SB_builder_demo` env var** — user created this by mistake when looking for the standard `ANTHROPIC_API_KEY` slot. Real key is now under `ANTHROPIC_API_KEY`. The orphan can be deleted from Vercel → Settings → Environment Variables.

## Things NOT to add (per spec)

- No "About Us" page, blog, newsletter signup, testimonials section, or multi-page nav.
- No animations beyond gallery fade-in and chatbot open/close.

## Working style notes

The user wants **section-by-section feedback** during builds — don't ship multiple sections in one shot. After each section: show what was built, flag any tradeoffs, wait for green-light. They explicitly value pushback when something in the spec would look cheap, over silently shipping mediocre work.
