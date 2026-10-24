# Handover: Manchester Gutters build-and-manage process (2026-10-24)

## Where things stand

- **Site:** manchestergutters.co.uk, Astro static site on Cloudflare Pages. Repo `brynestein/manchester-roof-repairs` (branch `master`). Hand-built, 6 pages plus 404, not on the base theme.
- **Merged today:** PR #3, squash commit `aefa582`. Real 404 page (soft-404 fixed), sitemap served at `/sitemap.xml` (old `/sitemap-index.xml` redirects), `llms.txt`, `scripts/check-site.mjs` + `site-checks.config.json` + `npm run check` + GitHub Actions workflow, the `site-content` skill at `.claude/skills/site-content/SKILL.md`, and updated `CLAUDE.md` / `PROJECT-NOTES.md`.
- **Live check after deploy:** `NODE_USE_ENV_PROXY=1 node scripts/check-site.mjs --live https://manchestergutters.co.uk` gives 0 block, 52 warn.
- **Search Console:** `https://manchestergutters.co.uk/sitemap.xml` submitted 24 Oct 2026, status Success, 6 pages discovered (property `https://manchestergutters.co.uk/`, URL-prefix).

## Decisions made

1. **Stay on Astro** (static output, full HTML in the response, good for AIO/GEO). Andrew will do most of the building, in Claude sessions. Patric uses Next.js but is a reviewer; revisit only if a site needs server-side features. The data contract (`src/data/*.json`, compositions, schema files) is framework-neutral, so a later move is a renderer swap.
2. **Do not build more site-builder software.** Only a handful of sites will ever be built. Patric's feedback (second-hand): the staged builder was too prescribed and inflexible; building directly in Claude and managing with Site Manager works better.
3. **Split of responsibilities.** Claude sessions create pages and sites (on a branch, via PR, with a Cloudflare preview). Site Manager runs the live site day to day: errors, anomalies, traffic, indexing, sitemap status, GSC, schema rendering, audits, small edits.
4. **Fixed points** for any session-built change: PR not main; checker and agency-standards validation before merge; before/after crawl diff on migrations; Andrew approves repo creation and merges.
5. **Colleague access (Patric or others):** GitHub collaborator with Write role (not Admin), branch protection on `master` requiring a PR and one approval, Cloudflare preview deployments, no Cloudflare/DNS access. Not set up yet.

## Corrections to earlier assumptions

- The live Site Manager is `apps/site-manager` inside `brynestein/audit-content`. The standalone `brynestein/site-manager` repo is archived and stale (last commit 2026-06-11).
- The existing Site Builder in that app (brief, plan, scaffold, tokens, compose, content, imagery, review, finalize) is real but partial and was never run end to end live. Findings: compose is first-fit only, Stage 5 content UI is not wired to rendering, imagery lacks AI generation and upload, writes go straight to main with no PR. Frozen as a fallback, no further investment.
- Site Manager sits behind magic-link login. Sessions cannot call its APIs (inferred, not verified). Prefer exporting plan and brief into the client repo as files.

## Reference material

- **Base theme:** `brynestein/site-builder-base-theme` (Astro, ~50 catalogue section components, tokens, `recipes.json`, selection and composition code). Not yet used for Manchester Gutters.
- **Design references from Andrew:** munstergutters.ie (Next.js, 279 pages, deep service/location structure) and dublingutter.ie (static HTML). Shared look: Sora body, Anton headings, red `#e11b22`, dark slate `#0f172a`/`#111827`, white, square-ish corners, content width ~1180-1280px. Whether this is the look wanted for Manchester Gutters, or only the build quality, is **not yet answered**. Plan: tokens only (never copy their markup).
- **Knowledge base:** `audit-content/docs/patterns/client-site-build-patterns.md` (720 lines; the repo mirror of the `client-site-patterns` skill), `site-builder-blueprint.md`, `site-builder-catalogue-compose.md`, `packages/agency-standards` (~38 executable rules: entity density, sentiment, header ratio, intent coverage). The `content-build` skill is referenced but lives on Andrew's machine and has not been read.
- **Dashboard repo:** `brynestein/manchester-gutters-dashboard` (Next.js SEO dashboard, not yet deployed).

## What is still open

For Andrew:
1. Set up the **GSC service account** so Claude can read Search Console data: create a service account with no roles, enable the Google Search Console API, add its email as a Restricted user on `https://manchestergutters.co.uk/`, then add the JSON key as a secret in the cloud environment settings under `GSC_SERVICE_ACCOUNT_JSON` (never paste it in chat). Allow `searchconsole.googleapis.com` and `oauth2.googleapis.com` if the network policy blocks them. A new session is needed to pick it up. Read-only access cannot submit sitemaps (done manually).
2. Replace placeholder phone (0161 234 5678), email and WhatsApp in `business.json`, then add them to `public/llms.txt`.
3. Real project photos, then remove the `"P-img-missing": "warn"` override in `site-checks.config.json`.
4. Answer: are Munster/Dublin the look to use for Manchester Gutters?
5. Ask Patric which builder stages hurt, and whether he wants a no-git editor or PRs.
6. Optional: install VS Code (installer downloaded) with the Claude Code extension for local previews (`npm run dev`) and diff review; keep secrets in a local env var or gitignored `.env`.

For the next session (in order):
1. Use the GSC data to build a real optimisation list (queries, pages, index coverage) for the site.
2. Fix the remaining checker warnings: skipped heading levels, generic nav labels, footer links repeating nav labels, header CTA to `/contact`, image dimensions, title/description lengths.
3. Grow the page set toward the service x location matrix (currently 6 pages; competitive is 20+). Needs real local content per place, not templated copy.
4. Contract doc for the shared data format (Phase 1), minimal `new-page` checklist skill and `new-site` runbook (Phase 2). Rebuild Manchester Gutters on the base theme one page per PR only if still wanted.
5. Site Manager work (in `audit-content/apps/site-manager`): PR mode for edits (prerequisite before anyone else edits), enable the AI Editor for this site, fix the indexing/sitemap panel (reads `sitemap-index.xml` only / contradictory state), alert when a site has no submitted sitemap, no-JS thin-page check.
6. Colleague access setup (GitHub collaborator, branch protection).

## Known limits and unverified items

- Cloudflare builds from a shallow clone, so sitemap `lastmod` is omitted in production (deliberate; no fake dates). Fix later with committed dates if wanted.
- The checker reads HTML with regular expressions, cannot judge meaning, and does not cover entity density/sentiment (use `@audit-content/agency-standards`), Core Web Vitals, GBP or rankings.
- The skill's linking rules (service pages do not link to locations/blog, anchor-text by target class, hub ratio) come from one competitor teardown. Strong defaults, not laws.
- Nothing about how AI crawlers actually treat the site has been tested.
- Commits from sessions carry the identity "Claude" rather than Brynestein.

## Where files are

- Durable (in the repo): everything merged in PR #3, including the checker and skill.
- This note is committed at `docs/handover-2026-10-24-manchester-gutters.md`.
- Session scratchpad (lost when the container is reclaimed, so save what you want to keep): `manchester-gutters-build-and-manage-plan.md` (full plan with Phase 0 results, mapping and revisions), `site-content-kit/` (already merged in PR #3), `refs/` (fetched reference-site HTML/CSS).
- Local clones in the container (also ephemeral): `/home/user/manchester-roof-repairs`, `/home/user/audit-content`, `/home/user/site-builder-base-theme`, `/home/user/site-manager` (archived), `/home/user/manchester-gutters-dashboard`.

## Suggested opener for the next session

"Read the handover note and the Manchester Gutters repo. The GSC service account is set up (variable `GSC_SERVICE_ACCOUNT_JSON`). Pull Search Console data for manchestergutters.co.uk and propose a prioritised optimisation list; do not commit or push without asking."
