# Schema and the entity graph

Structured data tells search engines and AI systems which entities a page is about and how they relate. It describes what is on the page and nothing more. Patterns from recommendedroofing.ie's graph (the strongest of the three) and Patric's build spec.

## The anchor entity

- **One organisation anchor**, built from `business.json`, defined in full once (on the homepage) with a stable `@id` (`https://<domain>/#organization`), and **referenced by `@id`** from every other page (`provider`, `parentOrganization`, `publisher`, `worksFor`). RR: 347 of 351 pages reference it.
- **Type it once and consistently.** The anchor is `Organization` (or the trade subtype as `additionalType`); never the same `@id` typed `Organization` on one page and `LocalBusiness` on another. Spell the id one way (`#organization`, not also `#organisation`).
- On the anchor: `name`, `legalName`, `url`, `logo`, `foundingDate`, `telephone` (E.164), `contactPoint` per city or region, `areaServed` as place entities with Wikipedia or Wikidata URLs where verified, `knowsAbout` (the services and topics from the ontology), `memberOf` (real accreditations only), `founder` and `employee` Person nodes, `sameAs` (Google Business Profile, socials, directory listings, Wikidata if it exists, Knowledge Graph id only if real; at least 3, `organization-needs-sameas-3plus`).
- **`LocalBusiness` only where a verified physical address exists** (head office, real branches) as `subOrganization` nodes with the trade subtype (`RoofingContractor`), a complete `PostalAddress` (`localbusiness-needs-address`, block), opening hours, geo, and at least one `ContactPoint` (`contact-point-required`, block). Other areas are `areaServed` places or ContactPoints, never invented addresses. Rate the head office only, so a branch does not read as the main entity [D-J].

## Per page, layered on top

| Page | Nodes |
|---|---|
| All | `WebPage` (`isPartOf` → `#website`, `mainEntity` → the page's main node, which carries `mainEntityOfPage` back), `BreadcrumbList` on inner pages |
| Home | `WebSite`, the organisation anchor in full, head-office `LocalBusiness` |
| Service | `Service` (`provider` → anchor, `serviceType`, `areaServed`), the manager `Person`, `FAQPage` |
| Hub | `Service`, `Person`, `FAQPage`, `LocalBusiness` only with a real address, `WebPage.about` and `mentions` |
| Town | `Service` with `areaServed` = **the town** (never the province), `Person`, `BreadcrumbList`, `FAQPage`; no LocalBusiness, no rating |
| Article | `BlogPosting` or `Article` (`author` → the owner's `Person`, `publisher` → anchor, `about` → the place), `BreadcrumbList`, `FAQPage` |
| Guides index | `CollectionPage` with `hasPart` to ids that exist |
| Gallery, videos | `ImageGallery`; `ItemList` of `VideoObject` |
| Landing page | trade schema with `hasOfferCatalog`; never `Article` |
| Entity page | the entity's type (Product, Organization, GovernmentOrganization) with `sameAs` to Wikidata and the official source (`entity-page-sameas-required`, block) |

- **`about` and `mentions`** on `WebPage` link to verified Wikipedia or Wikidata entities for the trade and the place: at most 5 `about` and 3 `mentions` per page (towns 3 and 2). Relevance over volume. Trade topics link to Wikipedia; counties carry the full Wikidata, Wikipedia and Knowledge Graph triple only where verified; otherwise omit, never fake.
- **People:** the owner as `author` on articles (`Person` with `jobTitle`, `worksFor`, visible byline on the page); the manager as `employee` named on commercial pages where the glance box names them. Titles only; no invented credentials; add `sameAs` and `image` when real.
- **FAQPage** wherever the page shows a FAQ, built from the same items so schema and text cannot differ, and only for questions shown word for word [D-F]. Google shows no FAQ rich results for commercial sites since 2023; the value is in AI assistants parsing the pairs.
- **`aggregateRating` and `Review`** only from real, verifiable reviews, nested on the entity being rated, and only on pages where those reviews are shown [D-J].

- One business entity per real premises: 80 LocalBusiness entries at one head-office address (Dublin Gutter) or the full business with a rating repeated on every page (Munster) is the pattern to avoid.
- The brand name is identical in logo alt, schema, footer and copy.
- Schema names come from the same field as the visible H1 (Munster's roofing hub schema reads an old stored H1 that lists gutter materials).

## Honesty rules

- No invented entities, Knowledge Graph ids, accreditations, people, image EXIF, authors or coordinates. No page-level `sameAs` Knowledge Graph id (individual pages have no entity of their own).
- No `TODO` or placeholder strings in published JSON-LD (`no-todo-placeholders`, block).
- `hasPart` and every `@id` reference point at nodes that exist on that page or the site.
- Schema is generated per page from data, never copied from another page (RR's landing page carried another page's ids).

## Served, valid and matching

- JSON-LD is in the HTML response, never injected later by JavaScript.
- Every page's JSON-LD parses (checker `P-schema-valid`); the anchor is referenced on every page (`P-schema-identity`); FAQPage question count equals the visible count (`P-schema-faq`); recognised types only (`schema-passes-jsonld-shape`, block; the allow-list is being extended to the types above [D-P]).
- Spot-check one URL per page type in Google's Rich Results Test and the Schema.org validator before launch.
- JSON-LD `<script type="application/ld+json">` blocks are data, not code: the security header does not block them.
