# Rule index

Every rule in one place. **Checker** = `scripts/check-site.mjs` in the site repo (built HTML or the live site, in CI). **Standards** = `@audit-content/agency-standards` (a draft against the page brief). **Audit** = the audit tool in Site Manager (the live site, weekly). **Gate** = Patric's article gates (`blog-ai-audit.mjs`, `retrofit-article.mjs`), to be ported. **Manual** = review judgement.

Block means fix before merge. Warn means fix or explain in the PR. Where a tool still differs from a threshold here, the tool's own threshold applies until it is changed. The site checker (`scripts/check-site.mjs`, manchester-roof-repairs#7) and `@audit-content/agency-standards` (audit-content#617) were aligned on 25 October 2026.

## Site structure

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| One page per search intent, named for it (slug, title, H1 share the head noun) | all three | Standards `csi-alignment-check`, `service-page-mentions-service` | warn / block |
| Service slugs bare; place in title and H1 | per site | Checker `S-slug-geo` (per site, off unless `citySlug` is set) | warn |
| One URL pattern per page type; lowercase, hyphens, no dates, no year | yes | Checker `S-slug-format` | warn |
| Trailing-slash style consistent | yes | Checker `S-trailing-slash` | warn |
| Site size | 20+ indexable pages | Checker `S-pages-min` | warn |
| Every page in sitemap; no noindex page in sitemap or main nav | yes | Checker `S-sitemap-coverage`, `S-sitemap-noindex`, `P-noindex` | block |
| Town page only with a place brief; article only with demand evidence | yes | Manual, plan review | - |
| Cost articles carry the property-type, additional-costs and lifespan tables, from the client's records | all three | Manual, plan review | - |
| Articles carry a contents list of every H2 as plain anchor links in the HTML | yes | Manual | - |
| Articles end with "Sources and further reading" when they cite a regulation, standard or statistic | yes | Manual | - |
| Articles chosen from topic research; the overlap test against the money page passes (under 60% shared top-10 hostnames); text never copied between sites | topics sheet kept with the plan | Skill `scripts/topic_rank.py`; plan review | - |
| Hubs and towns chosen from location research over a complete place list, country-level Keyword Planner data | ranking sheet kept with the plan | Skill `scripts/location_rank.py` (stops on a wrong-country export); plan review | - |
| Twins cross-link | yes | Manual | - |

## Title, description, headings

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| Title length | 30-60 characters | Standards `title-length-band`; Checker `P-title-len` | block / warn |
| Title includes city or region (local pages) | yes | Standards `title-includes-location` | warn |
| Unique titles and descriptions | yes | Checker `P-title-dupe` (warn), `P-desc-dupe` (block) | warn / block |
| Meta description length | 120-160 | Standards `meta-description-length-band`; Checker `P-desc-len` | block / warn |
| One H1 | exactly 1 | Checker `P-h1`, `P-h1-dupe` | block / warn |
| H2 count on content pages | 2+ | Checker `P-h2` | warn |
| No skipped heading levels | none | Checker `P-heading-order` | warn |
| Question H2s on articles | 60%+ | Standards `h2-questions-min-count` (60% on articles, 1 elsewhere) | warn |
| FAQ questions on commercial pages | 6-8 (town, service), 8-12 (hub) | Standards `mandatory-faq-on-service-page` (counts FAQ items) | warn |
| Town and hub FAQs: the place in every question; a sourced local fact in every answer | all | Manual (place brief review) | - |
| Top People Also Ask answered | 3 of top 5 | Standards `h2-covers-real-paa` | warn |
| No marketing opener | first sentence | Standards `no-fluff-opening` | block |
| Build-up openers per section | ≤10% | Gate `buildupPct: 10` | warn |
| Answer paragraph after a question H2 | 40-60 words | Standards `answer-first-paragraph-length` | warn |
| "At a glance" first: topic-headed, from the page's own price rows; articles answer paragraph then 4-6 standalone bullets | present | Gate (first H2 ends "at a Glance" + `<ul>`); Manual | block (articles) |
| No "Summary", "The short version", "Conclusion" headings | none | Gate | block |
| No year in H1 or slug | none | Manual | - |

## Copy

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| Words in `<main>` | town 1,000+ / hub 2,000+ / service 1,500+ / article 800+ / home 1,000+ | Checker `P-words` (per type) | warn |
| Words unique to the town | 300+; shingle similarity <0.30 vs siblings | Manual; Patric's originality check (port) | warn |
| Entity page length | 300-600 | Standards `entity-page-word-count-band` | block |
| Paragraph length | average ≤25 words, none over 60 | Checker `P-para-length`, `P-para-max` | warn |
| Lists on content pages | 1+ real list | Checker `P-lists` | warn |
| Brand named per section | 1+ | Gate `brandPerSection: 1` | warn |
| Data points per section | 3+ | Gate `dataPerSection: 3` | warn |
| No em dashes, no exclamation marks | none | Gate `noDash` | warn |
| No clichés | list in constants | Standards `no-cliches` | warn |
| No stock AI phrasing | list in constants | Standards `content-not-ai-stereotype` | block |
| Quotable paragraphs | each stands alone | Manual | - |

## Tables

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| Price table on cost, repair, replacement and service pages | present, 3+ rows, dated, VAT stated | Gate (articles); Manual | - |
| Comparison table on articles | 1+ | Gate `tables: 1` | warn |
| Brands and materials in one table per page | 1 table, each brand one home page | Manual | - |
| Symptom decision table on landing pages (optional on hubs) | present | Manual | - |

## Entities and information gain

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| Target entity density | 4-12 per 200 words (guides 4-18) | Standards `entity-density-per-200w` | warn |
| Competitor entity parity | 60% of the top-10 union | Standards `competitive-entity-parity` | warn |
| Co-occurring term coverage | 60% | Standards `lsi-coverage-min` | warn |
| Each intent in the CSI has an entity | 1+ per intent | Standards `intent-cluster-coverage` | warn |
| Key entities not buried | in an H2 or first paragraph | Standards `no-buried-ontology-entities` | warn |
| Accreditations and expected relationships as sentences | 1 plain sentence each | Standards `extractable-spo-accreditations` | warn |
| Knowledge Graph recognition of named entities | 30%+ | Audit | warn |
| Sentiment | 0.45-0.6 | Audit | warn |
| Named local places on town pages | 3+ where relevant | Standards `location-landmark-count` | warn |
| Gap items absent from every top-10 result | 3+ commercial, 5+ article, 2+ entity page, listed in the brief | Standards `min-info-gain-entities` (needs the `infoGainEntities` set from the brief) | warn |
| Entity page: related entities, outbound prose links, sameAs | 3+ each twice; 3-8; Wikidata + official | Standards `entity-page-related-mentions-min`, `entity-page-outbound-prose-min`, `entity-page-sameas-required` | warn / warn / block |
| One phone number across the site; NAP in header and footer | 1 tel:; 2 NAP renders | Checker `S-nap`; Audit `local-nap-density` | warn |

## Linking

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| Service page links to a town or hub in content | none | Checker `S-dir-service-location`; Standards `service-page-no-location-links`; verifier | block |
| Service page links to an article | none | Checker `S-dir-service-post`; Standards `service-page-no-blog-links`; verifier | block |
| Town links to an article | none | Verifier (port) | block |
| Article → article | pillar/spoke, Read-next, other-cities only | Standards `blog-post-no-prose-blog-links` (allows pillar + Read next, 4 in prose) | warn |
| Orphan pages | none | Checker `S-orphans` | block |
| Inbound links per page | 5+ | Audit | warn |
| Links out per page | ≤200 | Audit | warn |
| Homepage inbound vs average | 3x floor, 5x target | Checker `S-hub-ratio`; Audit `hub-concentration-ratio` | warn |
| In-prose links | town 2-4; hub 2-4; article 3-5; service 0-2; entity 3-8 | Checker `P-prose-links` (minimum on towns, hubs, posts, entity pages; maximum 2 on service pages); Standards `location-page-prose-links-min` | warn |
| Internal link in first paragraph (town, hub, article, entity) | 1+ | Standards `link-in-first-paragraph` | block |
| Link spread | ≤2 per 150 words per section | Standards `link-distribution-per-section` | warn |
| Authoritative outside link on content pages | 1+; body external ≤7 | Checker `P-ext-link`; Standards `external-link-count-cap` | warn |
| Generic anchors | none | Standards `typed-anchor-text`; Checker `P-link-name` | warn / block |
| Exact-match anchors to one URL | ≤5% of its inbound | Standards `anchor-exact-match-cap-per-url` | warn |
| One anchor type on a page | ≤70% | Standards `anchor-diversity-per-page` | warn |
| Anchor profile by target | service 60-80% partial; town 80-100% exact place; home 70-90% branded; CTA 70-95% action | Audit `anchor-profile-by-target-class` | warn |
| First-link waste | ≤3 duplicate (target, anchor) pairs per page | Audit `first-link-rule-waste` | warn |
| Nav labels queryable | 60%+ | Audit `nav-label-keyword-fit`; Checker `S-generic-nav` | warn |
| Footer labels vary from nav | 3+ varied | Checker `S-footer-variance` | warn |
| CTA to /contact or /quote | none; form at `#quote` + tel: | Checker `S-cta-contact` (/contact and /quote), `P-link-broken` (in-page anchors) | warn |
| Broken links, in-page anchors, redirected URLs | none | Checker `P-link-broken` (pages and in-page anchors, block), `P-link-redirect` (links to redirect sources, warn) | block / warn |
| Sibling town links from a fixed slice | best-linked place page ≤5x the median | Checker `S-inbound-spread` | warn |

## Schema

| Rule | Threshold | Enforced by | Severity |
|---|---|---|---|
| JSON-LD parses | every block | Checker `P-schema-valid` | block |
| Organisation anchor referenced on every page | yes | Checker `P-schema-identity` | block |
| FAQPage matches the visible FAQ | count equal, word for word | Checker `P-schema-faq` | warn |
| Shape and recognised types | `@context`, `@type` | Standards `schema-passes-jsonld-shape` | block |
| Complete PostalAddress on LocalBusiness | yes | Standards `localbusiness-needs-address` | block |
| ContactPoint | 1+ | Standards `contact-point-required` | block |
| `sameAs` on the anchor | 3+ | Standards `organization-needs-sameas-3plus` | warn |
| No TODO placeholders | none | Standards `no-todo-placeholders` | block |
| Service.areaServed = the page's place; ratings only where reviews shown; `@id`s resolve; BreadcrumbList with visible breadcrumb | yes | Manual | - |
| No hidden headings (classes `sr-only`, `visually-hidden`, `screen-reader-text`, `kwhide`, or inline `display:none` / `visibility:hidden`), unless the site sets `allowHiddenHeadings` (D-V) | none | Checker `P-hidden-text` (block), or `P-hidden-text-allowed` (warn) on an opted-in site | block / warn |
| Sitemap dates are real, not one build date | not all identical | Checker `S-sitemap-lastmod` | warn |

## Page plumbing

Checker: `P-main` (block), `P-canonical`, `P-canonical-path`, `P-lang`, `P-viewport`, `P-og`, `P-img-alt` (block), `P-img-missing` (block), `P-img-dims`, `S-sitemap`, `S-sitemap-lastmod`, `S-robots`, `S-robots-ai`, `S-llms`, `S-404` (block), `S-soft404` (block), `S-csp-inline` (block), `S-csp-host` (block).

## Not checked yet (candidates)

Answer box present and built from the price rows; quotable paragraphs; first-party proof on the page; named person and byline; prices and guarantees matching the records; the place brief exists; twin cross-links; in-nav check; inbound-spread check; AI-citation pass score; Patric's gates ported (question share, brand and data per section, em dashes, glance shape, guarantee years, allowed domains).
