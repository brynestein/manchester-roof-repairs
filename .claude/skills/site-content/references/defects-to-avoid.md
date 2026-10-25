# Defects seen on live sites, and the rule that stops each

All measured on 24 October 2026 across munstergutters.ie, recommendedroofing.ie and dublingutter.ie. Use as a review checklist; where a checker rule exists it is named.

| Defect | Where seen | Rule | Enforced by |
|---|---|---|---|
| The areas block links the same first 30 towns alphabetically on every page, so towns A-D get 54-92 inbound links and the rest 1-7 (cause: `list.slice(0, 30)` in the links component) | Munster | Sibling links are nearest or in-hub, never a fixed slice | `S-inbound-spread`; `S-orphans` |
| 121 pages link a `#quote` anchor that does not exist on the page | Munster | Every CTA target exists on the page or the site | `P-link-broken` (in-page anchors) |
| 109 and 57 body links to redirected or dead URLs | RR, Munster | Links resolve 200 without redirect at build time | `P-link-broken`, `P-link-redirect` |
| Two newest service pages absent from nav, footer and llms.txt (6 and 9 inbound) | RR | Every page in nav/footer/sitemap/llms.txt as appropriate | `S-orphans`, `S-sitemap-coverage`; add an "in nav" check |
| Twin guttering and roofing town pages never link to each other (51 pairs) | Munster | Twins cross-link both ways | manual until a rule exists |
| Every CTA points at `/quote`, which gets as many links as the homepage | Dublin Gutter | Form on the page at `#quote` + tel:; no page link as the only CTA | `S-cta-contact` |
| Service schema says "Munster, Ireland" on every town page, never the town | Munster | `areaServed` = the page's place | manual |
| FAQs visible with no FAQPage on 128 pages; FAQ markup differs per template | RR | One FAQ component; FAQPage wherever the FAQ is visible and matches | `P-schema-faq` |
| Older articles open with an H2 "Summary"; 13 standfirsts show raw Markdown asterisks | RR, Munster, Dublin Gutter | "at a Glance" headed by the topic; no raw markup | retrofit gate; manual |
| All 121 article images `alt=""`; blog images mostly without alt | RR, Munster | Meaningful alt on every content image | `P-img-alt` |
| 91 titles over 60 characters; location titles with a brand suffix over 65 | RR, Dublin Gutter | Title 30-60, brand only if it fits | `P-title-len` |
| Identical 6-row price table on 188 town pages | RR | Town costings are the town's own rows or a short table linking to the price guide | manual |
| Landing-page schema copied from another page with the wrong `@id`s; FAQPage count ≠ visible questions | RR | Schema generated per page, validated, counts matched | `P-schema-valid`, `P-schema-faq` |
| No `<main>` on any of 732 pages | all three | `<main>` wraps the content once | `P-main` |
| No BreadcrumbList on towns despite a visible breadcrumb | RR | Visible breadcrumb ⇒ BreadcrumbList | manual |
| One Google review card repeated on 157 pages | Munster | Proof is specific to the page or omitted | manual |
| LocalBusiness + aggregateRating on every town page without the reviews shown there | RR | Rating only where reviews are evidenced on the page | manual |
| County page stems inconsistent (`/gutter-repair-cork/`, `/gutter-repairs-limerick/`, `/guttering-kerry/`) | Munster | One URL pattern per page type | `S-slug-format` (extend) |
| Nav links to a `noindex` price page; sitemap includes noindexed URLs | Munster, RR | No noindex page in the sitemap or main nav | `S-sitemap-noindex`, `P-noindex` |
| Security header too strict for the site's own scripts; or Report-Only with inline scripts everywhere | Manchester (July), RR | Header allows what pages load; no inline scripts | `S-csp-inline`, `S-csp-host` |
| 6,500-word service page outranked by 1,200-word pages named for the search | RR | One page per search, named for it; length is not a goal | plan review |
| 21 articles in four weeks, 16 never shown in search | RR | Topics only with demand evidence; measure at 28 and 90 days | plan review |
| Place articles that do not link to their place's money page compete with it: one Limerick cost post took 191 impressions and 0 clicks on Limerick searches | Munster (found and fixed Aug 2026) | Every place article links up in prose to its place's money page | manual; verifier |
| 14 near-duplicate "gutter-replacement-<suburb>" posts | Munster (merged and 301'd) | One guide per topic; place spokes only with new local material | plan review |
| Titles cut mid-phrase ("… uPVC, Aluminium &") live for months with zero clicks | Munster (fixed) | Never cut a title mid-phrase; drop trailing joining words and orphaned brand fragments | `P-title-len`; manual |
| Hard-coded `areaServed: "Munster, Ireland"` in the schema library | Munster | areaServed from the page's own place | manual |
| Area pages carrying three named, area-themed customer reviews each (at least 197 across 78 pages) against a stated "20+ Google Reviews" and aggregateRating 5/20 on every page | Dublin Gutter source data | Reviews only from verifiable sources, quoted exactly; never written into page data; rating only where the reviews are shown | manual; raise with the owner |
| Dead `#quote` buttons | Munster | Cause: `Hero.tsx` links `#quote`; the section with that id is never rendered | `P-link-broken` |
| One review card on 157 pages | Munster | Cause: hard-coded in `HomeHero.tsx` | manual |
| Keyword headings kept in the page but visually hidden "for SEO" | Munster home and two county hubs | No hidden text, unless the site has opted in (D-V) | `P-hidden-text` / `P-hidden-text-allowed` |
| A statistic ("847 projects … 43% of callouts") repeated with identical figures on six county pages | Munster | No statistic without a dataset; never repeated across places | manual |
| "15-year warranty" in 55 descriptions; "#1", "Top 6", "20% off" in titles and descriptions | Munster | Claims in titles and descriptions match the facts file | manual |
| "Three decades" on 28 pages and "30+ years" for a 2019 company; "7 days a week" against Mon-Sat hours | Dublin Gutter | One facts file; no claim literals in variants | manual (add a facts-consistency check) |
| Calculator and answer boxes give different prices and opposite VAT statements; calculator ships its internal notes | Dublin Gutter | One price source; VAT stated once; no internal notes in pages | manual |
| GA4 and Meta pixel load with no consent; the pixel's domain is missing from the security header | Munster | Consent first; every origin in the header, checked in a browser | `S-csp-host` |
| `llms-full.txt` publishes internal sales notes | Munster | Public facts only | manual |
| Sitemap `lastmod` = build date on every URL | Dublin Gutter | Real modified dates, ISO-8601 | `S-sitemap-lastmod` |
| 25 articles published dated up to six weeks ahead | Munster (fixed) | Never publish future-dated | publish gate |
| Every BlogPosting and og:image is the logo; one keyword alt on 160 images | Munster | Real job photo; alt describes the image | `P-img-alt` (extend) |
| Similarity gate checks the median only: worst pair 0.439, 439 pairs above 0.30 | Dublin Gutter | Gate on median and worst pair | similarity gate |
| Pipeline posts with "Summary" headings, stray "---", links to 5 non-existent pages, roofing topics on a gutters site | Dublin Gutter | Generated articles pass the same gates | publish gate |
| 80 LocalBusiness entities at one address, each rated 5/20 | Dublin Gutter | One entity per real premises | manual |
| Six Business Profile URLs with tracking parameters indexed as separate pages (8,045 impressions) | RR | Profile link has no parameters; use a noindex bridge (see build-and-publishing) | manual; Search Console check for `utm_` URLs |
