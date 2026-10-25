---
name: site-content
description: The content standard for local-service trade sites (roofing, guttering and similar) - site structure and page types, the process for each page, search intent and keyword choice, titles, H1 and headings, answer-first structure, tables, entities and the trade ontology, information gain, place briefs for town pages, internal linking and anchor text (hub and spoke), schema and the entity graph, evidence and claims, AI-search citation markers, measurement. Use when planning a site, planning, writing, editing or reviewing any page, nav, footer, service, hub, town or article, or when asked to optimise a site's content or SEO. Pair with scripts/check-site.mjs, @audit-content/agency-standards and the Site Manager audit tool, which enforce the black-and-white rules.
---

# site-content

The content standard for every site we build. One skill, four enforcement layers:

| Layer | What it does | Where |
|---|---|---|
| **Judgement** | Deciding what a site and a page are for, what they say and how they link | This skill and `references/` |
| **Build checks** | Fails the build on structure, technical and linking rules | `scripts/check-site.mjs` in each site repo (rule ids `P-…`, `S-…`) |
| **Draft scoring** | Entities, intent, anchors, phrasing against the brief | `@audit-content/agency-standards` `validateContent` |
| **Site audit and outcomes** | The whole live site weekly, and Search Console, rank and AI-visibility data at 28 and 90 days | Site Manager audit tool; see measurement |

Do not carry the checkable rules in your head. Write the page, run the checks, fix what they report, then read the page as a customer would. A page that passes every check can still be thin, wrong or a near-copy.

## Read before working

| Doing | Read |
|---|---|
| Planning a site, deciding which pages exist and how they fit | [references/site-structure.md](references/site-structure.md) |
| Building any page: the blocks it carries, in order | [references/page-templates.md](references/page-templates.md) |
| Choosing what a page targets, its URL, or whether it should exist | [references/search-intent.md](references/search-intent.md) |
| Title, H1, headings, opening, paragraphs, tables, length | [references/headings-and-structure.md](references/headings-and-structure.md) |
| Which entities to name, how often, where, and how to phrase claims | [references/entities.md](references/entities.md) |
| Building the brief from the trade ontology | [references/ontology.md](references/ontology.md) |
| What makes the page add something no competitor has, and how much | [references/information-gain.md](references/information-gain.md) |
| Researching a town before its page is written | [references/place-brief.md](references/place-brief.md) |
| Internal links, link budgets, nav, footer, anchor text | [references/linking.md](references/linking.md) |
| JSON-LD and the entity graph | [references/schema.md](references/schema.md) |
| Facts, prices, guarantees, proof, authors, AI-citation pass | [references/evidence-and-claims.md](references/evidence-and-claims.md) |
| Facts file, build, publishing, redirects, tracking, images, video, calculators | [references/build-and-publishing.md](references/build-and-publishing.md) |
| How results come back and change the rules | [references/measurement.md](references/measurement.md) |
| Mistakes seen on live sites and the rule that stops each | [references/defects-to-avoid.md](references/defects-to-avoid.md) |
| Every rule in one table with its threshold and enforcer | [references/rule-index.md](references/rule-index.md) |
| Why a rule is what it is where sources disagreed | [references/decisions.md](references/decisions.md) |

## The process for a site

1. **Plan the structure** (site-structure): services with measured demand, the hub per city, the towns with place briefs, the head-term hub, proof pages that have records. Record it in the site's plan with the counts.
2. **Lock a search intent per page** (search-intent) and the hub for each head term.
3. **Approve the ontology** for the trade before it drives content (ontology).
4. **Build the chrome once**: nav, footer, credentials strip, CTA with form, consent, `<main>`.
5. **Build pages by type** from the templates, in this order: home, services, hubs, towns in batches as briefs are ready, proof pages, articles with demand evidence.
6. **Run all four layers** before and after launch (measurement). The off-site gate (Google Business Profile, citations, reviews) clears before DNS flips.

## The process for a page

1. **Classify it.** Home, service, service-in-place, hub, town, article (pillar, spoke or hedge), landing page, entity page, proof, plain. The type decides the URL, the template, the checks and the link direction.
2. **Lock the search intent.** One central search intent (CSI) per page, measured from volume and top-10 overlap, in the customer's words. No measurable demand means fold it, make it a guide, or drop it.
3. **Write the brief before the page.** The CSI; the target entities by category from the ontology (required, parity, buried); the **gap set**, what the page will say that no top-10 result says, with its source; the place brief for a town page; the top People Also Ask questions; the facts and records available (prices, guarantees, accreditations, jobs, photos, reviews). Put it in the PR so a reviewer can check it.
4. **Outline from the template.** H1 = the CSI in natural language (or the buyer's question on an article). "At a glance" first. Commercial pages: topic H2s with the trust entities and key topics in them, questions in the FAQ. Articles: a 40-60-word answer, glance bullets, then question H2s (60% or more).
5. **Write.** Answer first, then detail. Real specifics only, from records. Accreditations and standards as plain subject-verb-object sentences. Tables carry the numbers. The brand named, not "we", at least once per section.
6. **Link and mark up.** Direction, budgets and anchors per linking; JSON-LD per schema, matching what is visible.
7. **Check.** Build checks (0 block), draft scoring for client-facing competitive pages, the AI-citation pass (5 of 7). Fix or explain every warning in the PR; never silence a rule by editing config.
8. **Look at it** on desktop and phone width before merge.
9. **PR, not main.** State the CSI, the gap set, what changed, remaining warnings and why, and any fact the client must confirm.
10. **Judge it** at 28 and 90 days from Search Console; a winner is multiplied only with a new brief.

## The rules that matter most

1. **One page, one search intent, named for the search.** Title, H1 and URL say the same thing, in the buyer's words ("roof replacement" not "new roof installation", "chimney repair" not "chimney flashing", "GRP" not "fibreglass"). A 1,200-word page named for the search beat a 6,500-word general page [measured].
2. **Hub and spoke, deliberately.** Money pages (services, and the chosen head-term hub) collect links; towns and articles feed them. Service pages never link to towns or articles. Towns link to every service and their in-hub siblings. Articles link up to services, places and their pillar.
3. **One H1, at least two H2s, no skipped levels.** Commercial pages: topic H2s plus a visible FAQ. Articles: 60%+ question H2s, first sentence answers each.
4. **Answer first.** The opening states the answer (price range, timeframe, verdict) in an "at a glance" box built from the page's own price rows, before any background.
5. **Name the entities a knowledgeable person would name**, from the ontology, at 4-12 mentions per 200 words, with the important ones in an H2 or the first paragraph. Town pages are written from a place brief and measured for uniqueness.
6. **The page adds something.** At least 3 facts, entities or answers (5 on an article) that no top-10 result for the search carries, from the ontology gap, our records or the place brief, each as a plain sentence. Restating the ranking set in better prose earns nothing.
7. **Claims as sentences, not fragments.** "Our roofers hold NFRC membership." not "NFRC members". Every paragraph still makes sense quoted alone.
8. **Nothing invented.** No made-up prices, guarantees, statistics, reviews, jobs, people, landmarks, accreditations or schema. Proof is rendered from records; no record, no claim; the page is held, not softened.
9. **Tables carry the numbers.** A price table on every cost and service page, a comparison table on every article, brands in one table per page.
10. **Schema says what the page says.** One organisation anchor by `@id`, Service with `areaServed` = the page's place, FAQPage only where the visible FAQ matches word for word, ratings only where reviews are shown.
11. **Every page ends with the form.** The quote form at `#quote` and the regional phone on every page; never a link to a contact page as the only call to action.
12. **No marketing filler.** No "welcome to", "we are", "for over 20 years" openers; no clichés or stock AI phrasing; no em dashes or exclamation marks; the brand named instead of "we".
13. **One facts file, nothing hidden.** Every claim (years, ratings, hours, guarantees, prices) comes from the site's facts file, never typed into a template or variant; no visually hidden text, except hidden keyword headings on a site that has opted in (`allowHiddenHeadings`, agency-owned sites only; see D-V); `llms.txt` carries public facts only.

## How sure we are

Each rule carries one of these tags. When a rule conflicts with what a site's own data shows, the data wins for that site; record it in that repo's `docs/patterns/` and in decisions.

- **[measured]** We measured it: the Manchester search-intent pilot (July 2026), the dhennessy link graph (July 2026), the three group-site crawls (October 2026), Patric's Search Console and content-yield results (2026).
- **[house]** A house default from a competitor teardown, a built site, or a decision. Strong default, not a law; deviate with a reason in the PR.
- **[practice]** Widely recommended SEO or AI-search practice we have not tested. Several come from a vendor checklist (the "Cited Page Swipe File") whose figures we cannot verify.

The evidence behind the tags (site crawls, Search Console, code reads, decisions) is in `audit-content/docs/research/2026-10-site-content/`.

## Measuring whether it worked

A page is judged on Search Console clicks and position at 28 days and again at 90, on mobile in the site's country, and on enquiries where they can be traced. "Never shown" is a ranking problem; "shown and passed over" is a wording problem; they get different fixes. Recommended Roofing published 21 articles in four weeks in autumn 2026 and 16 of 18 judged were never shown [measured]. Across tracked sites, local-presence signals correlate positively with rankings and content volume slightly negatively [measured]. Write fewer pages against measured demand, and check the off-site stack first when a site is not ranking.

## Out of scope

Google Business Profile, reviews and citations (the `gbp-signal-audit` skill and the local presence gate), design, Core Web Vitals (Site Manager's page-speed tool), tracking and consent (each repo's notes), and anything needing the client's decision (pricing, guarantees, claims, service areas). Raise those in the PR.

## Where this skill lives

The canonical copy is in `brynestein/audit-content` at `.claude/skills/site-content/`. Each site repo carries a copy so sessions in that repo load it. Edit the canonical copy first, then copy it to the site repos; do not let copies drift.
