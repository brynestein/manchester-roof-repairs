# Internal linking: hub and spoke, link budgets, anchors

Measured on dhennessyroofing.ie (July 2026), the three group sites (October 2026) and Patric's verifier. Defaults; a site's plan may change which page is the hub for a head term [D-O].

## The model

Money pages (services, and the chosen head-term hub) collect link value. Hubs, towns, articles and entity pages feed it to them. Money pages do not leak it back to feeders, and nothing dumps it into low-value pages (contact, gallery, calculator). Nav and footer are boilerplate on every page (about 53 links); body links are the differentiator.

## Direction (content links, nav and footer excluded)

| From → To | Service | Hub | Town | Article | Home | Proof |
|---|---|---|---|---|---|---|
| **Service** | siblings by cards only; 0-2 in prose, never to siblings | **none** | **none** (areas as plain text) | **none** | 0-2 in prose, fresh anchor | 0-2 in prose |
| **Service-in-place** | up to its service | — | none (areas as text chips) | none | — | — |
| **Hub** | every service (cards) | other hubs (cards) | every town under it (cards) | guide cards to this city's articles (the one allowed hub → article block) | breadcrumb | yes |
| **Town** | every service (cards) | its hub (breadcrumb, card) | in-hub siblings, nearest 10-30 (chips) | **none** | breadcrumb | 1 in prose (insurance or proof) |
| **Article** | 3-5 in prose, keyword anchors | the place's hub (card, prose) | the place's town (chips, prose) | spoke → pillar once; pillar → spokes; "Read next" 3-4; nearby and other-cities section. No open mesh [D-D] | breadcrumb | yes |
| **Home** | every service (cards), 1-3 in prose | every hub (cards) | none | selective | — | yes |
| **Entity page** | 3-8 in prose to the services and towns that use it | — | — | — | — | — |
| **About / contact / legal** | nav only | nav only | none | none | nav | — |

| Rule | Enforced by |
|---|---|
| Service pages never link to towns or hubs in content | `service-page-no-location-links` (block), checker `S-dir-service-location`, verifier |
| Service pages never link to articles | `service-page-no-blog-links` (block), checker `S-dir-service-post`, verifier |
| Towns never link to articles | verifier (suburb → blog) |
| Articles do not link other articles beyond the structured set | `blog-post-no-prose-blog-links` (open mesh); verifier (allows pillar/spoke, Read-next, other-cities) |
| No `/contact/`, `/quote/`, gallery or calculator link in content on commercial pages | checker `S-cta-contact` (extend), verifier |
| Every page reachable; no orphans | checker `S-orphans` (block) |
| Every page in nav or footer, sitemap and llms.txt where it belongs | checker `S-sitemap-coverage`; add an "in nav" check |
| Twins (guttering and roofing page for one town) cross-link | manual until a rule exists |

## Link budgets per page (internal; external 5-7, footer-only plus 0-1 in prose)

| Page | Header | Body | Footer | Total | In prose |
|---|---|---|---|---|---|
| Home | ~29 | 40-50 (cards) | ~24 | 90-100 | 1-3 to primary services |
| Hub | ~29 | 40-60 (town cards, service cards, guides) | ~24 | 90-110 | 2-4 |
| Town | ~29 | 30-45 (sibling chips, service cards) | ~24 | 80-100 | 2-4: the first-paragraph link, 1 to the proof page, service mentions |
| Service | ~29 | 20-25 (sibling cards) | ~24 | 70-80 | **0-2**, homepage or proof, anchor not used in nav, cards or footer [D-I] |
| Article | ~33 | 8-15 | ~24 | 65-75 | 3-5 to services and places, 1 up to the pillar, Read-next 3-4 |
| Entity | ~29 | 3-8 | ~24 | 55-64 | 3-8; external ≤3 |

- Inbound: at least 5 internal links into every page (audit); no page over 200 links out.
- Spread in-prose links: no more than 2 per 150 words in any H2 section (`link-distribution-per-section`).
- First-link waste: more than 3 duplicate (target, anchor) pairs on one page is flagged (audit). The second identical anchor to the same URL is discounted.
- RR towns run about 93 content links (28 sibling chips + 18 service cards + hubs); that is the upper bound, not the target.

## Concentration

- The homepage receives at least 3x the average inbound internal links (checker `S-hub-ratio`, pages counted; audit tool counts links, dhennessy ≈5.9x); 5x or more is the target. Below 3x the site is a graph, not a hub.
- Service pages collect about 44 inbound each on dhennessy (30 locations + 14 siblings), locations about 29. On the group sites the service pages are the most-linked pages (RR `/repairs/` 1,136 content links in). Either is right if deliberate.
- **Every place article links up in prose to its place's money page.** Without it the article ranks against the money page: one Munster cost post took 191 impressions and 0 clicks on Limerick searches before the fix [measured].
- **Related reading on articles**: at most 3 posts, chosen by shared place and topic words, never newest-first (Dublin Gutter's newest-first block gives the 3 newest posts 9 links each and the rest 1) [D-D2].
- **Internal links use the site's trailing-slash form and relative paths**; Munster has 339 links without the slash (an extra redirect hop each) and 100 absolute self-links.
- **Breadcrumbs follow the hierarchy** (Home › Hub › Town), visible wherever BreadcrumbList is emitted.
- **Cross-brand links to a sister company**: one mention per page, placed after the proof and before the form; the anchor is the place with the service phrase before it ("the recommended roofers in Cork"); two links go to two of the sister's own city pages, never both to its homepage.
- **Sibling town links are nearest or in-hub, never a fixed slice.** Munster links the same first 30 alphabetical towns on every page, so A-D get 54-92 inbound and the rest 1-7. Build the sibling list from the hub (RR: 11-30 chips within the hub) or by distance.

## Anchor text [D-C]

| Target | Nav and footer | Cards and chips | In prose |
|---|---|---|---|
| Service | the service phrase as searched ("Emergency Roof Repairs"); footer label differs ("24/7 Roof Emergencies") | the service phrase; on town pages place-qualified ("Roof Repair {Town} →") | verb or partial phrase: "handles emergency roof repairs in Salford", "roof leak repairs" |
| Hub | "{Trade phrase} {City}" ("Roofers Cork", "Roofing Cork") | "Roofers {City}" | "our Cork roofers", "roof repairs in Cork" |
| Town | none | bare place name in chip lists ("Douglas"); "{Trade phrase} in {Town}" on hub town cards; "Roofers {Town}" in article chips | "Roofers {Town}", "we cover {Town}" |
| Home | brand or "Home"; logo alt = business name | — | the brand name |
| Article, guide, entity | the topic | the title | a natural fragment: "our guide to slate repair costs" |
| Proof | "Reviews", "Case studies" | — | "€6.5 million public liability", "our case studies" |
| CTA | an action: "Get a free quote" (to `#quote` or tel:) | — | an action phrase |

- Never generic: no "click here", "learn more", "read more", "find out more", "more info", "here", "this page" (`typed-anchor-text`; checker `P-link-name` for links without an accessible name). Card headings are the link, stretched over the card.
- Vary across the site: no target URL gets more than 5% of its inbound anchors as the exact head phrase (`anchor-exact-match-cap-per-url`); no single anchor type is more than 70% of a page's internal links (`anchor-diversity-per-page`). Audit bands: service anchors 60-80% partial match; town anchors 80-100% exact place; home 70-90% branded; CTA 70-95% action phrase.
- Never a service-style anchor at a town ("Roof Repairs in Blackrock" → `/…/blackrock/`) or a place anchor at a service page.
- Predicate anchors ("addresses roof storm damage", "serves Didsbury") come from the ontology's relationships and are preferred in prose.

## Navigation and footer

- **Nav labels are anchor text.** Every child label is a full search phrase ("Gutter Repairs Manchester", "Roofers Cork"); at least 60% of primary nav labels are queryable (audit `nav-label-keyword-fit`). "Services" and "Locations" are acceptable as parent labels only when every child is a full phrase. If a label does not fit, change the layout, not the label (checker `S-generic-nav`).
- **The footer lists every service** with wording that differs from the nav for the same URL (checker `S-footer-variance`, ≥3 varied), plus the hubs. dhennessy varied only 3 of 15 and still ranks, so this is belt-and-braces, not load-bearing; keep it because it costs nothing.
- One nav definition for the whole site (RR kept a copy per generator and lost pages from it).
- **Header button** points at `#quote` or tel:, never `/contact` (checker `S-cta-contact`). Footer areas lists are plain text or links to hubs only.

## Anti-patterns that fail review

1. An "Areas we serve" block of links on service pages (place names as plain text instead).
2. Every page linking to every page: nothing concentrates, nothing ranks.
3. Generic dropdown labels with abbreviated children ("Repairs", "Installations").
4. An open blog-to-blog mesh or a "Related posts" widget in the body (sidebar or footer widgets are fine).
5. Nav labels shortened to fit the design.
6. Footer labels copied from the nav.
7. Two hubs for one head term (a `/roof-repairs-<city>/` page beside `/repairs/<city>/`).
8. A sitemap that misses generated pages, or includes noindexed ones.
9. The header or closing call to action linking to `/contact` or `/quote` instead of the form on the page.
10. Service-style anchors pointing at town pages, or place anchors at service pages.
11. The same fixed slice of towns linked from every page.
12. Links to pages or anchors that do not exist; links to redirected URLs.
