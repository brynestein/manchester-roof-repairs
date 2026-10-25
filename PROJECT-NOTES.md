# Project Notes — Manchester Gutters Website

## Quick Reference

| Item | Value |
|------|-------|
| Domain | manchestergutters.co.uk |
| GitHub | https://github.com/brynestein/manchester-roof-repairs |
| Hosting | Cloudflare Pages |
| Live Preview | https://manchester-roof-repairs.pages.dev |
| Framework | Astro (static site) |
| Local Dev | `npm run dev` → http://localhost:4321 |

## How to Make Changes

### Option 1: Ask Claude
Open Claude Code in the project folder and describe what you want changed. Claude has full context saved in CLAUDE.md.

### Option 2: Edit Files Yourself
1. Open project in VS Code: `C:\Users\andre\roof-repairs-manchester`
2. Edit any `.astro` file in `src/pages/` or `src/components/`
3. Preview locally: `npm run dev`
4. When happy, push to GitHub:
   ```
   git add .
   git commit -m "describe your change"
   git push
   ```
5. Cloudflare auto-deploys within ~30 seconds

## File Map — Where to Edit What

| I want to change... | Edit this file |
|---------------------|---------------|
| Phone number / email | `src/components/Header.astro`, `src/components/Footer.astro`, `src/components/FloatingCTA.astro`, and CTA sections on each page |
| Navigation links | `src/components/Header.astro` |
| Footer content | `src/components/Footer.astro` |
| Page title / meta description | The `title` and `description` props at top of each page file |
| Global colours / fonts | `src/layouts/Layout.astro` (CSS variables in `:root`) |
| Home page content | `src/pages/index.astro` |
| Services list | `src/pages/services.astro` (edit the `services` array at top) |
| Customer reviews | `src/pages/reviews.astro` (edit the `reviews` array at top) |
| Gallery projects | `src/pages/gallery.astro` (edit the `projects` array at top) |
| About page text | `src/pages/about.astro` |
| Contact form / details | `src/pages/contact.astro` |

## Site Checks and SEO Plumbing

| What | Where |
|------|-------|
| Run all checks (build, then check `dist/`) | `npm run check` |
| Check the live site | `NODE_USE_ENV_PROXY=1 node scripts/check-site.mjs --live https://manchestergutters.co.uk` |
| Checker and its config | `scripts/check-site.mjs`, `site-checks.config.json` |
| Content and SEO rules (for Claude and humans) | `.claude/skills/site-content/SKILL.md` |
| CI | `.github/workflows/site-checks.yml` runs the checker on every PR and push to master |
| 404 page | `src/pages/404.astro` (Cloudflare Pages serves it with a real 404 status) |
| Sitemap at `/sitemap.xml` (single file; `astro.config.mjs` renames the integration's output) | `astro.config.mjs`; old `/sitemap-index.xml` redirects via `public/_redirects` |
| `llms.txt` for AI crawlers | `public/llms.txt` (update when services or areas change; no phone or email until real) |
| Sitemap `lastmod` | `astro.config.mjs`: last git commit date per page; omitted in shallow clones |
| Security header (CSP) | `public/_headers`; checker rules `S-csp-inline` and `S-csp-host` block a header that would stop the site's own scripts |
| Cookie banner, consent and tag loading | `public/js/consent-tracking.js`, IDs in `src/data/tracking.json`, "Cookie settings" link in the footer |

The checker fails on `block` findings and only prints `warn` findings. `P-img-missing` is set to `warn` in `site-checks.config.json` while the site uses placeholder images; remove that line once real photos are in.

## Outstanding Tasks
- [ ] GTM: set the Microsoft Clarity tag to require `analytics_storage` consent and publish; then `consent.mode` in `tracking.json` can move from `basic` to `advanced` (until then Clarity would start before the visitor answers the banner)
- [ ] Privacy and cookie policy page, linked from the banner and footer
- [ ] Banner wording reviewed once Meta Pixel and Google Ads tags are added (ad consent is denied by default today)
- [x] Domain connection: manchestergutters.co.uk serves the site (verified 2026-10-24)
- [ ] Submit `https://manchestergutters.co.uk/sitemap.xml` in Google Search Console (nothing was submitted as of 2026-10-23)
- [ ] Replace placeholder images with real photos, then remove the `P-img-missing` override from `site-checks.config.json`
- [ ] Update contact details with real phone/email/WhatsApp (also fill `llms.txt` and `business.json`)
- [ ] Choose and set up a CMS (TinaCMS, Decap CMS, etc.)
- [x] LocalBusiness-family JSON-LD on every page (checked by `P-schema-identity`)
- [ ] Add real Google reviews / AggregateRating schema (only from verified data)
- [ ] Work through remaining checker warnings: skipped heading levels, generic nav labels, footer links repeating nav labels, header CTA pointing at /contact, image dimensions, 6-page count
- [ ] After the first deploy of the 404 and redirect changes, re-run the live check: the `S-soft404` finding should be gone, and confirm whether sitemap `lastmod` appears in production
