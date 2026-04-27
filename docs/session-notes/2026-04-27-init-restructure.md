# 2026-04-27 — Init restructure (Ken-style contract)

## Context

Migrated `roof-repairs-manchester` to the locked-down repo structure. This is a **brochure website** for Manchester Gutters (separate from the analytics dashboard at `manchester-gutters-dashboard`). Astro 5 static site deployed on Cloudflare Pages with `push = deploy` semantics.

## What shipped

No source code changed. Docs / agents / settings only.

### New
- [CLAUDE.md](../../CLAUDE.md) — fresh contract. Identity §0 calls out the load-bearing naming mismatch (local dir `roof-repairs-manchester`, GitHub `manchester-roof-repairs`, Pages subdomain `manchester-roof-repairs.pages.dev`, custom domain `manchestergutters.co.uk`). Protocols include "push = deploy → every push needs explicit approval." Things-to-never-assume includes the 522 error on the custom domain (per command-center session log) and the Clarity-via-GTM rule (commit `95684d1`).
- [.claude/agents/code-reviewer.md](../../.claude/agents/code-reviewer.md) — Astro/SEO-tailored reviewer. Mandatory blockers: broken image references (recent commit cleaned these), heavy font weights re-added, direct Clarity tags, internal-link typos, push-as-deploy without approval.
- [.claude/settings.json](../../.claude/settings.json) — pre-approves Astro dev/build/preview/check; **denies `git push`** (push triggers a CF Pages deploy).
- This file — first session-note.

### Moved (preserved git history via `git mv`)
| From | To |
|---|---|
| `CLAUDE.md` (~50-line site spec) | `docs/patterns/site-config.md` |

### Untouched
- `src/pages/`, `src/components/`, `src/layouts/`, `astro.config.mjs`, `package.json`, `public/`, `README.md` — no source changes.
- `.claude/settings.local.json` — per-machine, preserved.
- `.claude/worktrees/` — Claude Code worktree state, preserved.

## Production state

Most recent commits: `2ec3027` "Performance: remove broken hero image references, reduce font weights", `95684d1` "Disable direct Clarity (managed via GTM instead)", `e2f9cbb` "Enable Microsoft Clarity (wd65h860xv)". Site is deployed at `https://manchester-roof-repairs.pages.dev` and intended at `https://manchestergutters.co.uk` (currently 522 error per command-center). No state changed by this session.

## Open / pending (carried from migrated site-config.md)

- [ ] Fix `manchestergutters.co.uk` domain connection (522 error — needs custom domain added in Cloudflare Pages project settings)
- [ ] Replace placeholder images with real project photos
- [ ] Update phone (`0161 234 5678`), email, WhatsApp number with real details
- [ ] Evaluate CMS options (TinaCMS, Decap CMS, Payload, Storyblok)
- [ ] Add real Google Reviews / schema markup

## Next-session opener

> Read CLAUDE.md and docs/patterns/site-config.md. roof-repairs-manchester is the Manchester Gutters brochure site (separate from the dashboard). Restructured 2026-04-27 to the Ken-style contract. Remember: push = deploy on Cloudflare Pages.

## Files touched

- New: `CLAUDE.md`, `.claude/agents/code-reviewer.md`, `.claude/settings.json`, `docs/session-notes/2026-04-27-init-restructure.md`
- Renamed (git mv): `CLAUDE.md` → `docs/patterns/site-config.md`
- Modified (in source code): none
