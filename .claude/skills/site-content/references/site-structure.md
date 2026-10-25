# Site structure: which pages a local trade site has, and how they fit together

Decided 2026-10-24 from the crawls of munstergutters.ie, recommendedroofing.ie and dublingutter.ie, Patric's generators, and the dhennessy teardown. Defaults; a site's plan may override any of them with a reason.

## The shape

A local trade site is a **hub-and-spoke**: a small number of money pages that collect link value and rank for the head terms, fed by many place and article pages. Towns drive the page count; services stay few.

```
Home
├── Service pages (6-13)              /<service>/            money pages, national or province-wide
│   └── Service-in-place (optional)   /<service>/<city>/     only for the head term, one per city
├── City or county hubs (1-6)         /<trade-phrase>-<city>/            e.g. /roofers-cork/
│   └── Town pages (10-45 per hub)    /<trade-phrase>-<city>/<town>/     e.g. /roofers-cork/douglas/
├── Articles                          /blog/<topic>-<place>/ pillars (topic) and spokes (topic + place)
├── Proof pages                       /reviews/ /case-studies/ /gallery/ /videos/ /insurance/ /price-guide/
├── Company                           /about/ /contact/ (+ /quote/ only as a fallback for pages without a form)
└── Legal and utility                 privacy, terms, cookies, accessibility, 404, thank-you, sitemap.xml, robots.txt, llms.txt, llms-full.txt
```

Measured on the three sites: 10-13 service pages, 1-12 hubs, 78-188 town pages, 9-121 articles. dhennessy: 15 services, 30 locations, ~50 posts.

Where the clicks come from (Munster, all devices, 1 Aug - 22 Oct 2026, unfiltered): 118 articles 22%, guttering towns 20%, 6 county guttering hubs 20%, home 11%, Business Profile links 10%, services 5%, roofing towns 4%, county roofing 4%. Town pages earn as a set (25% of clicks, 81 of 126 town pages clicked) as well as covering; a secondary trade without its own named hub is shown and passed over until it has one. Year on year the gain (+42%) came mostly from articles (+345 clicks), then towns, services and the roofing hubs.

## Page types and what each is for

| Type | Answers | URL | Count | Exists when |
|---|---|---|---|---|
| Home | Who you are, what you do, where; the brand query | `/` | 1 | always |
| Service | Who does this job across the service area, what it costs, how | `/<service>/` (bare slug; city in title and H1) [D-A] | 6-13 | measured demand for the service term after the CSI check; otherwise folded into a sibling as a section |
| Service-in-place | A service in one city or county ("gutter installation Cork") | `/<service>/<city>/` | 0-12 | Search Console shows "<service> <city>" queries with impressions and no clicks, or the head term is the site's biggest query and the general service page is not ranking for it [measured: Munster's zero-click queries are exactly these]; mirrors the hub section-for-section, links up to the service, across to siblings, areas as plain text |
| City / county hub | Who covers this city, what is different here, every service here | `/<trade-phrase>-<city>/` [D-B] | 1 per city served | always one per city or county the client genuinely serves |
| Town | Who covers this town, what its housing is like, what goes wrong here | `/<trade-phrase>-<city>/<town>/` | 10-45 per hub | the town is inside the client's real radius and a place brief exists (see place-brief); never from a list alone |
| Article: pillar | One topic in depth (cost, flat roofing, storm damage) | `/blog/<topic>/` | 1 per topic with demand | demand evidence |
| Article: spoke | The topic in one place | `/blog/<topic>-<place>/` | per topic x place with demand | demand evidence; only for topics people qualify by place (cost, flat roofing, storm damage, leaks) |
| Intent hedge | Editorial twin of a top town page ("roofers {town}: how to choose") | `/blog/roofers-<town>/` | top 5 places | search shows editorial results for the place query |
| Landing page | Paid or head-term landing with one-tap recovery | `/<trade-phrase>-<county>/` | 0-1 | ads run, or the county term needs a page named for the search |
| Entity page | One standard, material, body or council explained | `/entity/<slug>/` | 9-16 | the four gates: Wikidata entry, mentioned on 3+ site pages, authoritative external source, real search demand |
| Proof | Reviews (named for "{brand} reviews"), case studies, gallery, videos, insurance, price guide | `/<name>/` | 4-9 | the record exists; a proof page without records is not built. "{brand} reviews" is a top-three query on Munster [measured] |
| Company, legal, utility | About, contact, privacy, terms, cookies, accessibility, 404, thank-you | `/<name>/` | 6-10 | always |

## Rules that shape the whole site

1. **One page per search, named for the search.** Title, H1 and URL say the same thing. A page whose name is the search beat a 6,500-word general page on the same site [measured, Patric, 2026]. Two pages for one intent are merged; one page for two intents is split only when both have demand.
2. **Pick the hub for each head term deliberately** [D-O]. dhennessy ranks its homepage for the head terms (177 inbound links, 71% of its top-3 rankings). The group sites rank their service pages (`/repairs/` 1,136 content links in). Either works; the plan says which, and the nav, cards and footer send links there. The homepage receives at least 3x the average inbound links as a floor; 5x or more is the target.
3. **Services stay few; towns do the covering.** The service x town matrix (dhennessy's 450 cells) is not built. A town page links to every service; a service page names its areas as text. Add a service-in-place page only for the head term.
4. **Towns sit under their hub** in the URL and in the links, mesh with their in-hub siblings (nearest or same hub, never a fixed alphabetical slice), and link to every service. They never link to articles.
5. **Twins cross-link.** A site with two trades (guttering and roofing) and two town pages per town must link the pair both ways. Munster has 51 twins that never do.
6. **Every page that exists is in the nav, the footer, the sitemap and llms.txt** as appropriate. RR's two newest services had 6 and 9 inbound links because they were in none of them.
7. **Nothing links to a page that does not exist.** A town in a chip list without a page renders as text. 121 Munster pages link a `#quote` anchor that is not on the page.
8. **Growth is demand-gated.** Start at the floor (home, 6+ services, 1 hub, 10+ towns with place briefs, 4+ proof pages, legal) and add a town or topic only with a place brief or demand evidence. No weekly cadence [D-N].
9. **The off-site stack decides whether any of this ranks.** In the agency's audit-tool calibration, the audit tool's Local category score correlates +0.24 with visibility and its Content category score −0.22 (regression across 48 domains, Workstream C calibration, July 2026) [measured]. Google Business Profile, citations and reviews are not this skill's job but are the gate before DNS flips (see `client-site-build-patterns.md`, Local presence gate).

## Chrome (identical on every page)

- Header: logo (alt = business name, links home), nav with keyword labels, phone (tel:), one button to `#quote` or tel:. Nav parents may be "Services" and "Locations" only when every child label is a full search phrase [D-C note].
- Footer: every service with a label that differs from the nav label, hub links, NAP in full, the company number where the business is a limited company, guarantees, accreditations with links to the issuer's listing (not its homepage), socials, legal links, "Cookie settings".
- Credentials strip near the top of commercial pages: years trading, insurance figure, memberships, guarantee. Facts from `business.json`.
- Closing CTA on every page: H2 with the place, tel: buttons, and the quote form at `#quote` on the page [D-G].
- Floating or sticky call bar on phones, outside `<main>`.
- `<main>` wraps the page content once.

## Multi-city versus single-city

| | Single city (Manchester Gutters, Dublin Gutter) | Multi-city (Recommended Roofing, Munster Gutters) |
|---|---|---|
| Service slug | bare, city in title and H1 | bare, national |
| Hubs | one city hub, or the homepage is the hub | one per city or county |
| Service-in-place | not needed | for the head term, per city |
| Town URL | `/<trade-phrase>-<city>/<town>/` | same, under each hub |
| Other-cities section | not needed | on articles and hubs |

## Not covered here

Design, performance (Core Web Vitals in Site Manager), Google Business Profile and citations (`gbp-signal-audit`), tracking and consent (each repo's notes), and the client's decisions on which towns and services are real.
