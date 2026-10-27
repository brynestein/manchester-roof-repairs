# Building a local site in Site Manager

The operator runbook from research to a planned site, worked through on Manchester Gutters (26–27 October 2026). Each step says what goes in, where, and what to check. The judgement behind each step lives in the other references; this is the order and the controls.

## The steps, and who does each

Claude asks for each input in turn, does the work, and stops at each approval. Claude can't sign in to Site Manager or Google Ads, so the operator does the clicks there; Claude says exactly what to enter and checks the result from a screenshot.

| Step | The operator gives | Claude does | The operator approves |
|---|---|---|---|
| 1. Brief | The client brief: business name, trade, services offered and which to grow, service area, confirmed facts (phone, email, insurance, guarantee, accreditations), domain | Fills in every Brief field from it ("Brief first" below), lists any claim that isn't confirmed, and gives the values to enter | The Brief values; then saves the Brief |
| 2. Search data | Google Ads access for Keyword Planner (uploads Claude's CSV, returns the export), and the Search Console property connected in Site Manager | Builds the places list and keyword CSVs, ranks hubs and towns, runs topic research and the overlap tests (location-research, topic-research) | The hubs, the Launch and Wave 2 towns, the articles |
| 3. URL map | — | Writes the URL map from the approved research (url-map) and a `.tsv` of it to paste | The URL list: every page, its stage, title and H1 |
| 4. Site Manager page list | Pastes the `.tsv` into Import URL map and saves ("Import URL map" below) | Checks the import count and skipped rows from a screenshot | — |
| 5. Landmarks | Presses Auto-populate all ("Landmarks" below), sends a screenshot | Checks each town's list for places outside the town or unknown to locals | Each town's landmarks; then saves the Brief |
| 6. Search Console town check | Pastes `places.json`, presses Check ("Search Console town check" below), sends a screenshot | Reads the results: which towns have real searches, which names are ambiguous | Which towns to add |
| 7. Plan | Presses Generate plan ("Generate plan" below), sends a screenshot | Reads it: clashes to fix, what the overlaps and notes mean | The plan |
| 8. Audit, then build | Runs the site audit, regenerates the plan, then works through Compose, Content, Imagery | Checks each stage | Scaffold (creates the repo) and Finalize (writes to it), each as its own approval |

## Before Site Manager

You need three files from the research, and the client's confirmed facts.

| File | Made by | Goes into |
|---|---|---|
| `<site>-places.json`: every place under each hub, ambiguous names, searches to leave out | location-research, `scripts/location_places.py` then edited | Plan → Search Console town check |
| `<site>-location-research.xlsx`: the ranking, Launch / Wave 2 / Hold | location-research, `scripts/location_rank.py` | Read only; its stages are in the URL map |
| `<site>-url-map.xlsx`, sheet **Internal HTML**: every page, type, stage, H1 | url-map | Plan → Import URL map |

Copying the Internal HTML sheet (header row included) gives tab-separated rows. A saved `.tsv` of it pastes the same way.

## Brief first, and save it

The Brief screen pre-fills fields from the audit, but nothing is stored until **Save brief**. Save it before touching the Plan screen; the Plan screen refuses to save a page list or generate a plan until the brief has a business name, trade and primary town.

| Field | What to enter |
|---|---|
| Business name | As the client writes it ("Manchester Gutters", not the audit's lower case) |
| Trade | The trade from the list (Guttering Specialist) |
| Primary town, primary county | The main city and its real county (Manchester, Greater Manchester) |
| Phone, email | Confirmed details only. Clear audit placeholders such as `{business.phone}` |
| USPs, accreditations | Only what the client has confirmed (evidence-and-claims). The grey text is an example, not a value |
| Services | One row per service page, **slug = the page's path** (`gutter-repairs`, `downpipes`), name as on the page, order by priority (low-priority services last) |
| Service areas | Leave to the URL map import (step 2). Set each county to the real county, never a borough |
| Style | Generic, Munster or Recommended (base-theme preset) |
| Domain | The bare domain (`manchestergutters.co.uk`), no scheme, no trailing full stop |
| Repo name | A **new** repo name. Scaffold creates the repo; never enter the name of a hand-built site repo |
| Blog seed articles, URL pattern, national hubs, entity pages | Ignored when a page list is saved; leave them unless the URL map uses `/guides/` or `/entity/` pages |

## Plan → Edit page list → Import URL map

Paste the URL map rows, header included. Choose the stages (Launch only for a first release; Launch and Wave 2 when the town briefs are ready), keep **Add its hubs and towns to the service areas** ticked, then **Replace page list** and **Save page list**.

- Page types: Home → Homepage, Service, Area hub → AreaHub, Town → Location, Service in place → ServiceInPlace, Article → Article, Blog index → Blog, Company → About / Contact, Proof → Reviews / Gallery, Legal. Utility rows (404, sitemap, robots, llms.txt) are skipped; the build makes them. Proof pages without a base-theme recipe (case studies, price guide) are skipped and listed.
- Search phrases are locked from the H1: home, services and hubs use the H1 without its comma; town pages use the part before the comma ("Guttering Cheadle, Stockport" → `guttering cheadle`). The planner keeps them; Search Console still records its evidence against them.
- Legal pages match by prefix (`/privacy-policy` stands in for `/privacy`). `/terms` is added if the map has none.
- The importer adds the hubs and towns to the service areas (existing entries kept, the primary town skipped, new places given the primary county).
- Manchester Gutters, Launch only: 46 pages (home, 5 services, 10 hubs, 10 towns, 15 articles, blog, about, contact, 2 legal), 25 rows skipped.

## Landmarks: Brief → Local landmarks

With a page list saved, the section lists only places that have a town page. Press **Auto-populate all**. It looks towns up one at a time and retries any the lookup services turn away.

- What it finds: places with a Wikipedia article within about 1.5 km of the town (2 km for places named after it), of landmark kinds (stations, parks, churches, halls, museums, venues, pubs), still open. Places named after the town rank first; at most two stations and two churches. It never falls back to the county: a thin town gets fewer, not wrong ones.
- Check every town before saving. Keep 3 to 5 places a local would recognise; remove anything over the border (Chadderton Hall Park on Middleton's list).
- Hubs and the primary town don't use landmarks.

## Plan → Search Console town check

Paste `places.json` once and **Save location research**, then **Check Search Console**. It reads 90 days of searches for the brief's domain and lists places from the research that people search for but that have no page, with impressions and top searches. **Add town page** puts the page under its hub (`/guttering-stockport/cheadle-hulme`, phrase `guttering cheadle hulme`) and the place in the service areas.

- This is the Hold-town rule in location-research: a Hold town is built when Search Console shows impressions for it or the client has done jobs there.
- A search counts only for the longest place it names ("cheadle hulme gutters" is not a Cheadle search). Names marked "used elsewhere" need their searches read.
- A new site has almost no Search Console data (Manchester Gutters: 15 searches in 90 days). Run the check again one to two months after the pages go live, then yearly.

## Generate plan, and read it

**Generate plan** costs about 3p a page (DataForSEO central-search lookups plus one planner pass). It takes a few minutes; don't press it twice (the second press is refused while the first runs; reload after a few minutes).

| What the plan shows | What to do |
|---|---|
| Preview from your brief | No audit has run, so no competitor data. Run an audit for the site, then regenerate. Finalize won't push a preview |
| Needs attention before building (keyword clash) | Two pages target the same phrase. Fix the page list (give one its own phrase) and regenerate |
| Pairs of pages share words (overlap) | Allowed when each keeps its own angle (service vs hub). No action |
| "Improves the existing /path" | A live page ranks in the top 20, or the page's own address ranks: it is improved, not rebuilt |
| "Differs from the page's phrase" under central search | Information: the central search is the national phrase, the page targets the local one |

## Compose, content, imagery, scaffold, finalize

Compose uses the brief's style preset for each page type. Scaffold creates the new repo and writes the style's tokens; it is a GitHub write and needs approval. Finalize seeds the content into the repo; it refuses a preview plan.

## Mistakes made on Manchester Gutters, and the guard now in place

| Mistake | Guard |
|---|---|
| Page list saved before the Brief, creating a brief with no business details | The Plan screen and the page-list routes refuse until the brief has a name, trade and primary town |
| Auto-populate filled two towns with the same schools from another borough (county fallback) | Landmark lookup rebuilt around the town's own coordinates, no county fallback |
| Lookups rate-limited during Auto-populate all | Spaced lookups, an automatic retry, and "busy" shown instead of "none" |
| `places.json` pasted into Import URL map | The importer says which columns it needs; the two files go in different boxes (table above) |
| Domain saved with a trailing full stop | The town check tidies the domain before matching |
| Home page given a hub's phrase by Search Console, clashing with the hub | The importer locks the home page's H1 |
| Old homepage at position 85 marked every new service page "optimise /" | Optimise only for the page's own address or a top-20 ranking |
| "Reset to auto" on a URL-map site would turn every service area, boroughs included, into a flat `/areas/` page | Don't reset a URL-map site to auto; re-import the map instead |
