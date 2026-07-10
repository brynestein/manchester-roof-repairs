# CLAUDE.md — roof-repairs-manchester

> Project contract. Read first. Hard rules unless explicitly overridden in this conversation.

## 0. Identity

- **User:** Andrew Byrne (`brynestein` on GitHub, `andrewjjbyrne1973@gmail.com`).
- **Project:** **Manchester Gutters brochure website** (the static front-of-house site, separate from the analytics dashboard at `manchester-gutters-dashboard`). 6-page Astro static site.
- **Naming gotcha:** local directory is `roof-repairs-manchester`; **GitHub repo is `manchester-roof-repairs`**; deployed Pages.dev URL is `manchester-roof-repairs.pages.dev`. Custom domain: `manchestergutters.co.uk` (522 error per command-center session log — domain wiring needs fixing).
- **Production:** Cloudflare Pages, auto-deploy from `master` on push.
- **Site spec:** [docs/patterns/site-config.md](docs/patterns/site-config.md) — page list, components, design system (colours, fonts), deployment, status TODO. Was the prior CLAUDE.md.

## 1. Protocols (do not skip)

1. **Andrew approves all commits and pushes.** Push triggers a Cloudflare Pages deploy — every push is a deploy. Draft → preview → **stop and ask** before `git push`.
2. **Code review before presenting non-trivial changes.** Run [.claude/agents/code-reviewer.md](.claude/agents/code-reviewer.md).
3. **Never use `--no-verify`, `--force`, `--amend`, `git reset --hard`, `git clean -fd`.**
4. **Never expose secrets.** This is a static site so secrets are minimal, but any GA / Clarity / GTM IDs that aren't already public should not be added without confirming they're meant to be public.

## 2. Start-of-session ritual

1. Read most recent file under [docs/session-notes/](docs/session-notes/).
2. Read [docs/patterns/site-config.md](docs/patterns/site-config.md) for the page/component/design system.
3. `git status`, `git log --oneline -5`.
4. Only then start work.

## 3. End-of-session ritual

1. Write a new file in `docs/session-notes/` named `YYYY-MM-DD-<short-slug>.md`.
2. If a non-obvious Astro / Cloudflare Pages / Clarity / GTM quirk came up, add to `docs/patterns/`.
3. Tell Andrew the summary; **do not push** (push = deploy).

## 4. Stack snapshot

- **Framework:** Astro 5.12 (static)
- **Styling:** Pure Astro + scoped CSS (no Tailwind, no React)
- **Plugins:** `@astrojs/sitemap` (sitemap.xml generation)
- **Tracking:** Microsoft Clarity (managed via GTM per recent commits — direct integration disabled in `95684d1`)
- **Hosting:** Cloudflare Pages (auto-deploy from `master`)
- **Dev port:** 4321 (Astro default; per template port table — shared across roof-repairs sites, used one at a time)
- **GitHub repo:** `brynestein/manchester-roof-repairs` (mismatch with local dir name — see §0)

## 5. What lives where

- `src/pages/` — six pages (`index`, `services`, `about`, `reviews`, `gallery`, `contact`)
- `src/components/` — `Header.astro`, `Footer.astro`, `FloatingCTA.astro` (phone + WhatsApp)
- `src/layouts/Layout.astro` — global layout + styles
- `astro.config.mjs` — Astro config (sitemap plugin)
- `public/` — static assets
- `docs/patterns/site-config.md` — site spec (was prior CLAUDE.md)
- `docs/session-notes/` — dated end-of-session logs
- `.claude/settings.local.json` — per-machine settings (preserved)
- `.claude/worktrees/` — Claude Code worktree state (preserved)

## 6. Permissions

[.claude/settings.json](.claude/settings.json) pre-approves safe Astro dev/build commands. **`git push`** is NOT pre-approved (push = deploy per protocol §1).

## 7. Things to never assume

- **Naming triple-mismatch:** local dir `roof-repairs-manchester`, GitHub repo `manchester-roof-repairs`, custom domain `manchestergutters.co.uk`, Pages subdomain `manchester-roof-repairs.pages.dev`. If you see references to one, mentally map. Don't try to "fix" the mismatch — they're load-bearing and changing one breaks links.
- **Custom domain `manchestergutters.co.uk` 522 error** — per command-center session log. Until fixed, share `manchester-roof-repairs.pages.dev` for previews.
- **Microsoft Clarity is managed via GTM** (commit `95684d1` "Disable direct Clarity (managed via GTM instead)"). Don't reintroduce direct Clarity script tags.
- **Placeholder contact details** are still in the site (per migrated site-config.md) — phone `0161 234 5678`, email `info@manchestergutters.co.uk`, WhatsApp `441612345678`. These are placeholders unless Andrew has updated them recently.
- **Two related "manchester-gutters" repos exist** — this brochure site, and the dashboard (`manchester-gutters-dashboard`). They share a client but are unrelated codebases. Don't mix.
- **Push = deploy.** Every commit pushed to `master` deploys live. Be deliberate about what's in any commit.

## 8. House style

- Be terse. Andrew reads diffs.
- No emoji in code or commit messages.
- No trailing summaries unless asked.
- Comments are *why*, not *what*.
- Prefer editing existing files. No abstractions on the first call site.
- Astro: prefer `.astro` files over framework components unless interactivity demands React/Vue/etc.
