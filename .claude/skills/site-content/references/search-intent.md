# Search intent: what a page targets and whether it should exist

Full method: `audit-content/docs/design/csi-picking-process.md`. Worked example: `audit-content/docs/content-samples/manchester-roofer/pilot-koray-review.md`. Hub selection: `docs/design/trade-onboarding-hub-selection.md`.

## Central search intent (CSI)

The CSI is the one query that best covers what a page means. Every other query the page ranks for is a variant of it. Pick it from data, not from how the trade talks.

1. **List 4-5 candidate phrasings** per page: the current slug, the trade term, what customers actually say (calls, reviews, Search Console), a short head form and a longer commercial form. Include the city for local pages. Never put the locale in the query text; set it as the location parameter (DataForSEO 2826 UK, 2372 IE).
2. **Get volumes for all candidates in one batch** (`keywords_data`). Take the top two by volume. Note CPC as a conversion-value signal: "velux installation" at 10 searches a month was worth building at £19 CPC; "lead flashing" at 8,100 a month and £0.43 is DIY traffic.
3. **Compare their top-10 results.** At least 60% of the same hostnames means one intent: the higher-volume phrase is the CSI and one page covers both. Under 60% means two intents: either the CSI is wrong or the runner-up needs its own page. [measured: 4 of 5 pilot pages collapsed to one intent]
4. **Strip the city and repeat** to see national demand. The multiplier (national ÷ local) decides the page set: 30x or more, local page and a national guide; 10-30x, both, guide earns more; under 10x, local carries the value; local zero with national over about 500, guide only. A guide is worth building at 30x or roughly 1,000 UK searches a month.
5. **Retest zero-volume pages** with British or Irish English, brand-as-category names ("velux"), material names ("EPDM roof") and short forms before deciding.
6. **Assign the central entity.** A Google `/g/` id on a service concept means a distinct entity that deserves its own page; an `/m/` id on a physical thing (chimney, roof) is a facet of a service page. Resolve missing ids through Wikidata (P646 or P2671); an entity with none stays a candidate.
7. **Lock it.** Slug, title and H1 must all contain the CSI head noun (`csi-alignment-check`). Record `csi`, `csiSource` and `centralKgmid` in the page's data.

The pilot cost about $0.06 in API calls for 11 pages. Cost is not a reason to guess.

## Use the buyer's words, not the trade's [measured]

In the Manchester pilot, six of ten first guesses were the technically correct term and the wrong search term:

| Trade term | What UK customers search |
|---|---|
| new roof installation | roof replacement |
| chimney flashing | chimney repair (and "lead flashing" nationally) |
| fibreglass roofing | GRP roofing |
| roof inspection | roof survey |
| skylight installation | velux (local), roof window (national) |
| fascia and soffit | guttering, roofline |

When two phrasings show identical volume (gutter cleaning / gutter cleaner, roof repair / roof repairs, GRP / fibreglass roofing) the search engine treats them as one keyword: use either in the title with no cannibalisation risk.

Irish and UK markets differ in vocabulary, standards and bodies. Check the country you are building for.

## When a page should not exist [house]

- **No measurable demand after the retest:** fold the topic into a related page as a section (liquid waterproofing into flat roofs), keep it as an authority page that earns links rather than searches, or drop it.
- **Two pages for one intent:** merge them and redirect the weaker URL. A general service page and a "{service} {city}" page compete unless the general page is national and the city page is the service-in-place child.
- **A town without a place brief:** not published (see place-brief).
- **Effort follows demand.** In the pilot two pages held 90% of measured search volume. Write those first.

## Page types and URLs [D-A, D-B]

| Type | Answers | URL pattern |
|---|---|---|
| Home | Who you are, what you do, where | `/` |
| Service | Who does this job across the area, cost, how | `/<service>/` bare slug; city or province in the title and H1 |
| Service-in-place | The head term in one city | `/<service>/<city>/` (never `/<service>-<city>/`, which creates a second hub) |
| Hub | Who covers this city, what is different here | `/<trade-phrase>-<city>/` ("/roofers-cork/", "/gutter-services-north-dublin/") |
| Town | Who covers this town, its housing, what goes wrong | `/<trade-phrase>-<city>/<town>/` |
| Article | One topic (pillar) or one topic in one place (spoke) | `/blog/<topic>/`, `/blog/<topic>-<place>/`; the slug is the H1 and nothing more |
| Intent hedge | How to choose a roofer in this town | `/blog/roofers-<town>/` |
| Entity | One standard, material, body or council | `/entity/<slug>/` |
| Plain | About, contact, proof, legal | `/<name>/` |

- Lowercase, hyphens, no dates, no IDs, no stop-word padding, short. No year in a slug.
- Pick one trailing-slash style and keep it everywhere, including internal links.
- Never rename a live URL without a 301 redirect, and update every internal link to the new URL (57 Munster links and 109 RR links still point at redirected slugs).
- One URL pattern per page type; Munster's county pages use three stems.

## Pillars and spokes [house, Patric]

Topics become pillars; places become spokes. Build a place spoke only for topics people qualify by place (cost, flat roofing, storm damage, leaks), and only where the off-site stack for that place exists. A spoke must not use the pillar's head term as its target (it splits the pillar), name competitor brands, or repeat a covered topic.

## Intent hedge for top places [house]

Search engines choose per query whether to show a commercial page or an article. For the top 5 places by demand, publish both: the town page answers "who covers this area"; the article answers "how to choose a roofer here, what goes wrong here". Different H1, description and opening. The article links to the town page as its call to action.

## Choosing article topics [house, Patric; D-N]

A topic needs evidence that people want it: Search Console near-miss queries (positions 5-20 with impressions), People Also Ask, questions callers ask, reviews, AI-answer gaps, or how earlier articles performed. Search Console and GA4 sources outrank machine-generated ideas. No evidence of interest, no topic. Prefer repeating a topic that earned clicks (a winner: ≥3 clicks, position ≤20) in a new place with a new place brief over inventing a topic. There is no posting cadence.
