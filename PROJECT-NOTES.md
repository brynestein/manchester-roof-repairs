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

## Outstanding Tasks
- [ ] Fix domain connection (add manchestergutters.co.uk as custom domain in Cloudflare Pages project)
- [ ] Replace placeholder images with real photos
- [ ] Update contact details with real phone/email
- [ ] Choose and set up a CMS (TinaCMS, Decap CMS, etc.)
- [ ] Add schema markup for local business SEO
