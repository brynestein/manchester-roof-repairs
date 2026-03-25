# KitchingArt — Headless Shopify Art Store

## Project Overview
- **Artist**: David Kitching — British digital artist based in Cyprus
- **Current site**: kitchingart.com (Shopify Dawn theme)
- **Domain**: TBD (new domain, hosted on Cloudflare Pages)
- **GitHub Repo**: TBD (new repo)
- **Hosting**: Cloudflare Pages (auto-deploys from GitHub on push)
- **Framework**: Astro 6 SSR + Cloudflare adapter (no React/Tailwind — pure Astro + scoped CSS)
- **E-commerce**: Shopify Storefront API (headless — Shopify handles products, cart, checkout, payments)
- **Git User**: Brynestein / andrewjjbyrne1973@gmail.com

## Shopify Integration
- **Store domain**: `08gs2t-rs.myshopify.com`
- **API token**: Storefront public access token (in `.env`)
- **API version**: `2024-10`
- **Integration**: Option 1 — Headless sales channel (public token, safe for browser)
- **API client**: `src/lib/shopify.ts` (custom fetch, no SDK dependency)

## Site Structure
| Page | File | URL |
|------|------|-----|
| Home | `src/pages/index.astro` | `/` |
| All Collections | `src/pages/collections/index.astro` | `/collections` |
| Single Collection | `src/pages/collections/[handle].astro` | `/collections/:handle` |
| Product Detail | `src/pages/products/[handle].astro` | `/products/:handle` |
| About | `src/pages/about.astro` | `/about` |
| Contact | `src/pages/contact.astro` | `/contact` |
| Shipping | `src/pages/shipping.astro` | `/shipping` |
| Why Canvas Prints | `src/pages/why-canvas-prints.astro` | `/why-canvas-prints` |

## Shared Components
| Component | File |
|-----------|------|
| Header & Nav (dropdowns + mobile drawer) | `src/components/Header.astro` |
| Footer (links, newsletter, payments) | `src/components/Footer.astro` |
| Announcement Bar | `src/components/AnnouncementBar.astro` |
| Product Card | `src/components/ProductCard.astro` |
| Layout & Global Styles | `src/layouts/Layout.astro` |

## Design
- **Header BG**: `#2D2F36` (dark charcoal)
- **Body BG**: `#FFFFFF` (white)
- **Body text**: `rgba(18,18,18, 0.75)`
- **Nav text**: `rgb(224,224,193)` (warm cream)
- **Logo accents**: Pink, Yellow, Magenta
- **Fonts**: Assistant (body), Figtree (headings) via Google Fonts
- **Style**: Minimalist gallery aesthetic, lots of whitespace, large images

## Key Commands
- `npm run dev` — local dev server
- `npm run build` — production build (Cloudflare Pages)
- `npm run preview` — preview production build locally

## Environment Variables
```
SHOPIFY_STORE_DOMAIN=08gs2t-rs.myshopify.com
SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
PUBLIC_SHOPIFY_STORE_DOMAIN=08gs2t-rs.myshopify.com
PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN=<token>
```
Set in `.env` locally and in Cloudflare Pages environment settings for production.

## i18n
- Default locale: English
- Additional: German (`de`), French (`fr`)
- Translation files: `src/i18n/{en,de,fr}.json`

## Status / TODO
- [x] Shopify Storefront API integration (products, collections, cart, checkout)
- [x] Homepage with hero slideshow and collection previews
- [x] Collection pages with product grids
- [x] Product pages with variant selectors and add-to-cart
- [x] Static content pages (about, contact, shipping, why-canvas-prints)
- [ ] Create new GitHub repo and push
- [ ] Set up Cloudflare Pages project with new domain
- [ ] Configure environment variables in Cloudflare Pages
- [ ] Search functionality (Shopify Predictive Search API)
- [ ] Customer account pages (or redirect to Shopify)
- [ ] Newsletter subscription integration
