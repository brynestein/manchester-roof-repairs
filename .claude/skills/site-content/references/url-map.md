# The URL map: every page a site will have, before it is built

Every site plan includes a URL map. It lists each page that will exist, why, and how it links, in the same columns as a Screaming Frog "Internal: HTML" export. That way the plan can be compared line by line with a crawl of the built site. Worked example: `assets/manchester-gutters-url-map.xlsx` (Manchester Gutters, proposed, October 2026; hubs and towns from `assets/location-research/`, services and proof pages to be confirmed by the client brief).

## Columns

| Column | What goes in it |
|---|---|
| Address | The path, lowercase, hyphens, trailing slash, following the page-type pattern in site-structure |
| Page type | Home, Service, Service in place, Area hub, Town, Article: pillar, Article: spoke, Blog index, Landing page, Entity, Proof, Company, Legal, Utility |
| Crawl depth | Clicks from the home page. Nothing deeper than 3; most pages 1 or 2 |
| Indexability | Indexable, or Non-indexable with the reason (noindex while a proof page has no records, utility files) |
| Build stage | Launch; With a place brief; With demand evidence; When records exist; Only with data (service in place); If in scope |
| Title 1 and length | The planned title, 30-60 characters, keyword and place first |
| H1-1 | The planned H1 in the page type's pattern ("{Service} {City}", "{Trade phrase} {Town}, {Hub}") |
| Word count target | From the length table in headings-and-structure |
| Content sections | The blocks in order, from page-templates |
| Inlinks from | Which page types link here (link rules in linking) |
| Outlinks to | Which page types this page links to, and the budgets |
| Schema | The nodes per page type (schema) |
| Notes | Anything the client must confirm, or the condition for building the page |

## Rules

- **Every row has a reason to exist.** That means measured demand for services and articles, a place brief for towns, records for proof pages, and Search Console impressions for a service-in-place page. A row without its condition met waits in a later build stage; it is not built empty.
- **The map shows the floor.** List where the launch set sits against the site floor (home, 6+ services, 1 hub, 10+ towns with briefs, 4+ proof pages, legal; the checker warns below 20 pages) and what reaches it.
- **Hubs and towns come from location research** (location-research): every council area the client serves is a hub; towns are the Launch and Wave 2 rows of the ranking, each under the authority it is actually in. Hold towns stay in the ranking sheet. Put each row's stage and measured searches in Notes.
- **Articles come from topic research** (topic-research): the Launch and Wave 2 topics that passed the overlap test, each with its search and the money page it was tested against in Notes.
- **One search per row.** Two rows for one intent are merged; check the titles and H1s against the CSI before the map is signed off.
- **After launch, crawl the site and compare.** A built page missing from the map, or a mapped page missing from the crawl, is a finding.

## Layouts

`assets/layouts/` holds a wireframe per page type (home, service, service in place, area hub, town, article, landing page, proof, company), plus `hub-and-spoke.png` and `link-matrix.png`. They are drawn from page-templates and linking. When either reference changes, regenerate them with `docs/standards/build/` in audit-content, so the pictures never contradict the rules.
