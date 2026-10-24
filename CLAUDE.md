# Manchester Gutters

## Project Overview
- **Domain**: manchestergutters.co.uk
- **GitHub Repo**: https://github.com/brynestein/manchester-roof-repairs
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

## Status / TODO
- [x] Domain connection fixed (manchestergutters.co.uk serves the site)
- [ ] Submit `sitemap.xml` in Google Search Console (the sitemap exists; it had not been submitted as of 2026-10-23)
- [ ] Replace placeholder images with real project photos (then remove the `P-img-missing` override in `site-checks.config.json`)
- [ ] Update phone number, email, and WhatsApp with real details (also `public/llms.txt`)
- [ ] Evaluate CMS options (TinaCMS, Decap CMS, Payload, Storyblok) for content management
- [ ] Add real Google Reviews / AggregateRating schema (LocalBusiness-family JSON-LD already emits on every page)
