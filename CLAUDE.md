# Manchester Gutters

## Project Overview
- **Domain**: manchestergutters.co.uk
- **GitHub Repo**: https://github.com/brynestein/manchester-roof-repairs
- **Repo name is legacy**: this repo is the website for manchestergutters.co.uk. The name `manchester-roof-repairs` dates from the original "Roof Repairs Manchester" build, before the rebrand. It is referenced by Site Manager (`sites.ts`), Cloudflare Pages and command-center, so do not rename it on its own; if the site is ever rebuilt on the base theme, create a correctly named repo and move all three together.
- **Hosting**: Cloudflare Pages (auto-deploys from GitHub on push)
- **Pages.dev URL**: https://manchester-roof-repairs.pages.dev
- **Framework**: Astro (static site, no React/Tailwind — pure Astro + scoped CSS)
- **Git Branch**: master
- **Git User**: Brynestein / andrewjjbyrne1973@gmail.com

## Site Structure (6 Pages + 404)
| Page | File | URL |
|------|------|-----|
| Home | `src/pages/index.astro` | `/` |
| Services | `src/pages/services.astro` | `/services/` |
| About | `src/pages/about.astro` | `/about/` |
| Reviews | `src/pages/reviews.astro` | `/reviews/` |
| Gallery | `src/pages/gallery.astro` | `/gallery/` |
| Contact | `src/pages/contact.astro` | `/contact/` |
| 404 | `src/pages/404.astro` | any unknown URL (served with status 404) |

## Shared Components
| Component | File |
|-----------|------|
| Header & Nav | `src/components/Header.astro` |
| Footer | `src/components/Footer.astro` |
| Floating CTA (phone + WhatsApp) | `src/components/FloatingCTA.astro` |
| Layout & Global Styles | `src/layouts/Layout.astro` |

## Design
- **Colors**: Red (#C8102E), Dark (#1A1A1A), Yellow (#FBBC04), Light Gray (#F5F5F5)
- **Fonts**: Oswald (headings), Roboto (body) via Google Fonts
- **Style**: Similar to recommendedroofers.ie — professional trade site with trust signals

## Tracking and Consent
- GTM `GTM-N89JRGWH` carries GA4 (`G-M5SETBBHNQ`) and Microsoft Clarity. IDs live in `src/data/tracking.json`.
- Everything loads through `public/js/consent-tracking.js`. Consent Mode defaults are denied, and in `basic` mode nothing from Google or Clarity loads until the visitor accepts the cookie banner.
- The security header in `public/_headers` allows only the hosts these tags use. Adding a tag means updating the header in the same change; `npm run check` blocks if they disagree. No inline scripts or `on*=` attributes.

## Placeholder Contact Details (need updating)
- Phone: 0161 234 5678
- Email: info@manchestergutters.co.uk
- WhatsApp: 441612345678

## Key Commands
- `npm run dev` — local dev server
- `npm run build` — production build (output: /dist)
- `npm run check` — build, then run `scripts/check-site.mjs` (SEO and structure checks; fails on `block` findings)
- `git push` — triggers auto-deploy on Cloudflare Pages

## Content and SEO Rules
Follow `.claude/skills/site-content/SKILL.md` when writing or editing any page. The rules that can be checked mechanically (one H1, unique title/description, canonical, `<main>`, JSON-LD, images exist, sitemap, robots, llms.txt, 404, linking direction) are enforced by `scripts/check-site.mjs` in CI. Do not disable a check to get green; fix the page or explain the warning in the PR.

Every claim about the business (years trading, jobs completed, Google rating, insurance, accreditations, guarantee, emergency cover, reply time) lives in `src/data/facts.json` and renders through `src/lib/facts.ts`. A null value hides the claim on every page, in the FAQ and in the schema. Fill values only from records the client has confirmed; never type a claim into a page. `reviews.json` and `gallery.json` hold real reviews and jobs only; while either is empty its page is noindex, out of the sitemap and out of the menu.

## Status / TODO
- [x] Domain connection fixed (manchestergutters.co.uk serves the site)
- [x] `sitemap.xml` submitted in Google Search Console (2026-10-24, status Success, 6 pages discovered)
- [ ] Replace placeholder images with real project photos (then remove the `P-img-missing` override in `site-checks.config.json`)
- [ ] Update phone number, email, and WhatsApp with real details (also `public/llms.txt`)
- [ ] Wire the quote forms to a real destination (GHL webhook in `tracking.json` or email). The contact form posts to `#` and the home form sends details to `/contact/` in the URL, so no enquiry is delivered today
- [ ] Fill `src/data/facts.json`, `reviews.json` and `gallery.json` from the client brief
- [ ] Load the contact-page Google Map only after consent (it can set Google cookies before the visitor chooses)
- [ ] Privacy policy: confirm the legal entity, address and retention period with the client
- [ ] Evaluate CMS options (TinaCMS, Decap CMS, Payload, Storyblok) for content management
- [ ] Add real Google Reviews / AggregateRating schema (LocalBusiness-family JSON-LD already emits on every page)
