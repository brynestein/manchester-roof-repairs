# Topic research: which articles get written

Articles are chosen from measured demand, the same way hubs and towns are (location-research). Decided 2026-10-25 [D-X]. Articles produced about half of Munster's year-on-year gain, +345 clicks over Aug-Oct 2026 [measured]. Recommended Roofing's 21 articles written in four weeks, without measured demand, earned almost nothing at first.

Worked example: `assets/topic-research/` (Manchester Gutters, 96 topic searches in 7 groups, October 2026).

## The steps

1. **Collect candidate topics in the customer's words.** No single source is enough, so every run uses all of these that exist. Every search is a real search; nothing is staged without a Keyword Planner volume.
   - **Keyword Planner's "Discover new keywords"**, location set to the country, with seeds for each service **and** each common problem or job (for gutters: guttering, gutter repair, gutter replacement, fascias and soffits, downpipe, leaking gutter, blocked downpipe, gutter brackets, rogue roofer). Service-only seeds return short phrases and miss the questions.
   - **Google autocomplete**, from the skill's `scripts/topic_autocomplete.py config.json suggestions.json`. It crosses question openings ("how much", "how far apart", "why is my") and endings ("cost", "leaking", "regulations") with the trade's nouns, and returns the question wordings people type. Free, no key; the endpoint is unofficial, so the script caches and paces its requests.
   - **A trade seed list**: the jobs and problems the trade knows about and the questions the client gets on calls and in emails, one search per line. Allowed as a source because the volume run decides; a seed with no volume is never staged.
   - **Google's "People also ask"** for the main service searches.
   - **Search Console**: the site's own once it is live (searches with impressions at positions 8-30 and no page named for them; unfiltered data, or the API for per-page searches), and a sister site's in the same trade where there is one, rewritten for the country ("how much to replace gutters ireland" becomes "how much to replace gutters").

   Leave out services the client offers but does not want to grow, as in location research. Then run the skill's `scripts/topic_candidates.py config.json candidates.xlsx --planner discover.csv --suggest suggestions.json --seeds seeds.csv [--gsc Queries.csv ...] [--volumes earlier-runs.csv ...]`, which:
   - keeps searches that name the trade and carry a question, cost, problem, comparison or rules word. Bare service searches such as "gutter repair" belong to the money pages;
   - drops shops, "near me", jobs, other countries, other meanings of the trade's words ("fascia" in the body, "downpipe" on a car; set in the config's exclusions), and the typed AI prompts that reach Search Console;
   - strips a sister site's place names;
   - collapses Planner's close variants, which share one volume and one monthly pattern, into one cluster;
   - writes a CSV of the searches with no volume yet, for one Planner upload. Keyword Planner rejects a search over 10 words or with stray punctuation, so the script strips punctuation and leaves those out.

   **Tested on Manchester Gutters without the sister sites' Search Console** (25 October 2026): Discover from service seeds alone found 57% of the article plan's search volume and missed 3 of its 14 articles. Discover plus autocomplete found all 14 and 72% of the volume; adding the trade seed list, 86%. The first Manchester list, written from memory and staged without checking, traced to real searches for only 18 of 96.
2. **Group them.** Each group has a job:

   | Group | Example | What it is for |
   |---|---|---|
   | Cost | "gutter replacement cost" | Buyers pricing a job; the highest-converting articles. The pillar for each service |
   | Cost in a place | "gutter repair cost manchester" | A spoke, written only where the place version has its own volume or a sister site shows place spokes earning |
   | How-to | "how to install guttering" | Mostly DIY readers. They earn clicks, links and AI citations, and some readers give up and call. End with when to call a professional, and link to the service |
   | Comparison | "upvc vs cast iron guttering" | Buyers choosing a material; a comparison table is required |
   | Problem and signs | "why are my gutters overflowing" | Homeowners diagnosing a fault before they call |
   | Trust and hiring | "roofing scams", "questions to ask a roofer" | People vetting traders. Real facts only, and the consumer body and law of the country (UK: Trading Standards, TrustMark, the 14-day cancellation right on contracts signed at home). Never name a real firm as a scammer |
   | Rules, responsibility, lifespan | "who is responsible for guttering" | Owners, landlords and neighbours; answers they cannot easily find elsewhere |

   Choose one cluster per article: merge clusters that ask the same question in different words, and drop the ones that are a product search ("ogee guttering", "guttering sealant") or a navigational one ("trustmark"). Write the chosen topics, the money pages and the sister-site evidence into a topics file in the shape of the example. **The title comes from the cluster:** its highest-volume wording, kept as a question when the searches are questions ("How Much Does Gutter Replacement Cost?"); the H1 is 30-45 characters with no colon, dash or year, and the title tag 60 or fewer (headings-and-structure). The other wordings in the cluster become the article's H2s and FAQ questions. `scripts/topic_keywords.py topics.json keywords.csv` writes an upload for any that still lack a volume.
3. **Get volumes from Keyword Planner** (Get search volume and forecasts), with the location set to the country only, as in location research.
4. **Stage** with the skill's `scripts/topic_rank.py topics.json topics.xlsx export.csv`:
   - **Launch:** 100 or more searches a month, or proven on a sister site with measurable volume.
   - **Wave 2:** 30 or more, or proven on a sister site.
   - **Hold:** below that. A Hold topic is not dropped: it becomes a headed section of its group's main article (the cost article answers "how long do gutters last" and "do you need building regulations").
   - **Duplicates:** topics with the same volume and the same monthly pattern are probably one search to Google, and the sheet flags them. Write one article for both.
5. **Run the overlap test before writing.** This is the cannibalisation gate. Compare the top-10 results for the article's search with those for the money page the sheet names (search-intent).
   - **60% or more of the same hostnames:** Google treats them as one search. The topic becomes a section of that page, not an article. A "gutter repairs guide" aimed at "gutter repairs" would fight `/gutter-repairs/`.
   - **Under 60%:** the article is safe as its own page. "How to fix a leaking gutter joint" and "uPVC vs cast iron guttering" are different searches from the service page's.
   - **Titles:** an article's title and H1 never use the money page's bare search phrase.
6. **Each site writes its own article.** A starter set of evergreen topics can be shared between sites, but the text never is. Google keeps one copy of duplicated articles and drops the rest. The facts also differ by country, and the article has to carry the site's own prices, jobs and photos (evidence-and-claims).
7. **Record and judge.** Launch and Wave 2 topics go in the URL map with their search, stage and the money page they were tested against. Each article is judged at 28 and 90 days on clicks (measurement). The topic research is re-run when Search Console shows new questions.

## AI search

Question-shaped titles, a 40-60-word answer first, tables and named sources are what AI assistants quote. The citation markers in evidence-and-claims apply to every article. The effect on AI citations is not yet measured for these sites.

## What Munster showed (Search Console, all devices, 1 Aug - 22 Oct 2026)

| Article | Clicks | Group |
|---|---|---|
| Irish roofer scams: how to spot them and hire safely | 72 | Trust. Its largest visible search is "irish roofers reviews complaints", so some clicks may be people checking a particular firm (unconfirmed) |
| Gutter installation: a step-by-step guide | 68 (26 a year earlier) | How-to |
| Fascia and soffit Limerick: uPVC costs and replacement | 57 | Cost in a place |
| Average cost of gutter repairs | 33 | Cost |
| Gutter repair cost Limerick | 19 | Cost in a place |
| Gutter installation: essential tools and materials | 10 | How-to |
| Common gutter installation mistakes | 7 | How-to |

Cost, how-to and trust articles all earn, and cost articles earn in a place as well as nationally [measured].

## What Manchester Gutters showed (Keyword Planner UK, October 2026)

2,878 real searches (Search Console of the two sister sites, Discover new keywords from five seeds, and 3,403 Google autocomplete suggestions, with one more Planner volume run) became 16 articles, about 23,900 searches a month: `assets/topic-research/manchester-gutters-articles.json`. The largest are gutter replacement cost (4,270 a month across its searches), what fascias and soffits are (4,120), fascia and soffit replacement cost (2,590), gutter brackets and fall (2,480) and leaking gutter joint (2,410). Autocomplete surfaced one topic no other source had (what fascias and soffits are) and roughly tripled the bracket and fall article (bracket types, "rise and fall", fall ratio). None of the cost searches with "manchester" in them has measurable volume, so the cost articles are national pillars with the client's own Manchester prices. The biggest raw numbers were not article demand: "guttering sealant" (3,600) and "ogee guttering" (2,900) are product searches, "trustmark" (5,400) is navigational, "what is fascia in the body" (880) is another meaning of the word.
