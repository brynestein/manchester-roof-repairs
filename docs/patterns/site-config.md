# Manchester Gutters

## Project Overview
- **Domain**: manchestergutters.co.uk
- **GitHub Repo**: https://github.com/brynestein/manchester-roof-repairs
- **Hosting**: Cloudflare Pages (auto-deploys from GitHub on push)
- **Pages.dev URL**: https://manchester-roof-repairs.pages.dev
- **Framework**: Astro (static site, no React/Tailwind — pure Astro + scoped CSS)
- **Git Branch**: master
- **Git User**: Brynestein / andrewjjbyrne1973@gmail.com

## Site Structure (6 Pages)
| Page | File | URL |
|------|------|-----|
| Home | `src/pages/index.astro` | `/` |
| Services | `src/pages/services.astro` | `/services/` |
| About | `src/pages/about.astro` | `/about/` |
| Reviews | `src/pages/reviews.astro` | `/reviews/` |
| Gallery | `src/pages/gallery.astro` | `/gallery/` |
| Contact | `src/pages/contact.astro` | `/contact/` |

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

## Placeholder Contact Details (need updating)
- Phone: 0161 234 5678
- Email: info@manchestergutters.co.uk
- WhatsApp: 441612345678

## Key Commands
- `npm run dev` — local dev server
- `npm run build` — production build (output: /dist)
- `git push` — triggers auto-deploy on Cloudflare Pages

## Status / TODO
- [ ] Fix manchestergutters.co.uk domain connection (522 error — needs custom domain added in Cloudflare Pages project settings)
- [ ] Replace placeholder images with real project photos
- [ ] Update phone number, email, and WhatsApp with real details
- [ ] Evaluate CMS options (TinaCMS, Decap CMS, Payload, Storyblok) for content management
- [ ] Add real Google Reviews / schema markup
