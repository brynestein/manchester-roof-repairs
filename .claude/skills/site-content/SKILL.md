---
name: site-content
description: House rules and workflow for writing and structuring pages on local-service client sites (roofing, guttering and similar) - page types, URL structure, one H1, headings, internal linking, entities and local context, schema, AI-search (AIO/GEO) plumbing. Use when creating or editing any page, nav, footer, service or location page, blog post, or when asked to optimise a site's content or SEO. Pair with scripts/check-site.mjs, which enforces the black-and-white rules.
---

# site-content

Two parts. **This skill is judgement**: how to decide what a page is, what it says and how it links. **`scripts/check-site.mjs` is enforcement**: it fails the build on the rules that have a yes/no answer. Do not carry the checkable rules in your head; write the page, run the checker, fix what it reports.

Rule ids below (`P-…` per page, `S-…` site-wide) match the checker output.

## Workflow for a new or changed page

1. **Classify it.** Home, service, location, post (editorial), or plain page (about, contact, gallery, reviews, legal). The type decides the URL pattern, the checks that apply and the linking direction.
2. **Pick the URL** from the rules below. Never rename a live URL without a redirect.
3. **Name the target query and entities** before writing: the one phrase the page should rank for, the places, materials, standards and bodies a knowledgeable person would mention. Put them in the brief or PR description so a reviewer can check them.
4. **Outline** with one H1 (the target query in natural language) and H2s that each answer a question a customer would ask. Then write.
5. **Link** (see Internal linking) and add structured data (see Schema).
6. **Check:** `node scripts/check-site.mjs --dist dist` after a build. Fix every `BLOCK`. Warnings are fixed or explained in the PR description, never silenced by editing the config.
7. **PR, not main.** State what you changed, which warnings remain and why.

## Page basics (checker: P-title, P-desc, P-canonical, P-h1, P-main, P-lang, P-og)

- Exactly one `<h1>`; at least two `<h2>`s on service, location and post pages; no skipped levels (H1 then H3 is a finding).
- Unique `<title>` (30-65 chars) and unique meta description (70-160) on every page, written for the click, not stuffed.
- Absolute canonical URL on the site's own host. `<main>` wraps the page content once; header, footer and floating CTAs stay outside it, so AI and entity extractors read the right text.
- No page is `noindex` and listed in the sitemap.

## URL structure (S-slug-format, S-slug-geo, S-trailing-slash)

- Lowercase, hyphen-separated, no dates, no IDs, no stop-word padding.
- Patterns: `/services/<service>-in-<city>/` (the city in the slug is a small, durable relevance signal; set `citySlug` in `site-checks.config.json` to enforce), `/locations/<place>/`, `/post/<slug>/`. Location slugs are just the place name.
- Pick one trailing-slash style and keep it everywhere, including internal links.
- A new page set (service x place) must be generated from data, not copy-pasted: see Location differentiation.

## Copy (P-words, P-para-length, P-lists)

- Service, location and post pages: aim for 750+ words in `<main>`, but never pad. If there is not enough real material for the page, merge it or drop it.
- Short paragraphs (average 20 words or fewer), descriptive subheads, lists and tables for steps, prices, comparisons and materials. These are what AI answers quote.
- Lead each section with the direct answer, then the detail. Include real specifics: costs as ranges, timescales, materials, standards, what is and is not included.
- Real FAQs (3-5 per service/location/post page) that customers actually ask; mark them up as FAQPage (see Schema).
- Do not invent testimonials, ratings, case studies, accreditations, prices or photographs. If the fact is not in the client data, leave a visible `TODO` in the PR and do not publish it.

## Entities and local context

- Name things precisely and consistently: the business, the town and neighbouring areas, local landmarks and housing stock, materials (cast iron, PVC, slate), standards and trade bodies. Prefer names that have a Wikipedia or Wikidata entry.
- Aim for entity density in the 4-12 named entities per 200 words range; more reads as stuffing. Keep sentiment neutral-to-positive and factual, not salesy.
- Location pages need genuinely different content per place (architecture, common faults, landmarks, access) drawn from `src/data/locations.json` or equivalent. A template with the place name swapped is a doorway page; if you cannot write ~500 unique words about a place, do not publish the page.
- Semantic scoring (entity density, sentiment, header ratio, intent coverage) is not in the checker. Run `@audit-content/agency-standards` `validateContent` from the audit-content repo when the content is client-facing and competitive, and treat block-severity results like checker blocks.

## Internal linking (S-orphans, S-hub-ratio, S-dir-*, S-generic-nav, S-footer-variance, S-cta-contact, P-prose-links)

These are house defaults taken from a competitor teardown; they are strong defaults, not laws. If you deviate for a good reason, say so in the PR.

- **Every page is reachable.** No orphans. The homepage should receive at least 3x the average inbound links of other pages once the site has 10+ pages.
- **Direction.** Location pages link to services and to other locations. Service pages link to other services and **not** to location pages or blog posts (render place names on service pages as plain text). Blog posts link in to services and locations, in prose; no "related posts" widgets.
- **Anchor text by target.** Services: the keyword phrase ("Emergency Roof Repairs"). Locations: the exact place name only. Home: the brand or "Home". Contact/quote: an action phrase. Blog: a natural sentence fragment. Never "click here", never a service phrase pointing at a location.
- **Nav labels are anchor text:** use the target query phrase, not "Services" or "More". If it does not fit, change the layout, not the label.
- **Footer anchors vary from nav anchors** for the same URL (synonymous phrasing), so each URL earns two distinct anchor signals.
- **Header CTA** points at an on-page form anchor or a `tel:` link rather than `/contact`.
- **3-5 in-prose internal links** per service, location and post page, in the body copy, with contextual anchors, plus one link to an authoritative external source (government, standards body, trade association).

## Schema (P-schema-valid, P-schema-identity, P-schema-faq)

- LocalBusiness-family JSON-LD (trade-specific subtype, e.g. `RoofingContractor`) on every page, built from `business.json` so name, address and phone (NAP) never drift. Layered per page: FAQPage on service/location/post, `Service` or `ItemList` on hubs, `Article` on posts, `ImageGallery` on galleries.
- `AggregateRating` and `Review` only from real, verifiable data. No placeholders in published output.
- Schema must match what is visible on the page. Validate with the schema tooling in Site Manager before merge.

## Technical and AI-search plumbing (S-sitemap-*, S-robots*, S-llms, S-404, S-soft404, P-img-*)

- Pages are statically generated: the full text must be in the HTML response. No content that appears only after client-side JavaScript.
- A real 404 page that is served with HTTP 404 (S-404, S-soft404). A sitemap (conventionally `/sitemap.xml`; an index only when the site needs several files) that lists every indexable page, with `lastmod` only where the date is real, referenced from `robots.txt` and submitted in Search Console. `robots.txt` does not block AI crawlers unless the client asks.
- A real `/llms.txt` (plain text, short site summary and key URLs).
- Every image referenced must exist (P-img-missing), have meaningful alt text, explicit dimensions and a modern format.
- Core Web Vitals targets (LCP under 2.5s, INP under 200ms, CLS under 0.1) are checked in Site Manager's page-speed tool, not here.

## Out of scope for this skill

Google Business Profile and citation work (use the `gbp-signal-audit` skill and the local-presence gate), rank and traffic analysis (Search Console, Site Manager), and anything needing the client's decision (pricing, guarantees, claims). Raise those in the PR.

## Reading checker output

`BLOCK` fails the run and must be fixed before merge. `warn` is advisory: fix it or give a reason. Two cautions: tiny sites (under 10 pages) will not trigger the hub-ratio check, and the checker cannot judge meaning, so a page that passes can still be thin, wrong or duplicated in substance. Read it as a person would.
