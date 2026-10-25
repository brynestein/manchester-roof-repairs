# Topic research: which articles get written

Articles are chosen from measured demand, the same way hubs and towns are (location-research). Decided 2026-10-25 [D-X]. Articles produced about half of Munster's year-on-year gain, +345 clicks over Aug-Oct 2026 [measured]. Recommended Roofing's 21 articles written in four weeks, without measured demand, earned almost nothing at first.

Worked example: `assets/topic-research/` (Manchester Gutters, 96 topic searches in 7 groups, October 2026).

## The steps

1. **Collect candidate topics in the customer's words.** Sources, strongest first:
   - **The site's own Search Console.** After launch, look for searches with impressions at positions 8-30 that have no page named for them. Use unfiltered data. A page export leaves out about two thirds of clicks as anonymised searches, so use the API for per-page searches.
   - **A sister site's Search Console** for the same trade: questions that already earn clicks there. Rewrite them in the new country's English (Munster's "how much to replace gutters ireland" becomes "how much to replace gutters").
   - **Google's "People also ask"** for the main service searches.
   - **Keyword Planner's "Discover new keywords"** from three to five seeds.
   - **The questions customers ask** on calls and in emails.

   Leave out services the client offers but does not want to grow, as in location research.
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

   Write the topics, the money pages and any sister-site evidence into a topics file in the shape of the example, then run the skill's `scripts/topic_keywords.py topics.json keywords.csv`.
3. **Get volumes from Keyword Planner** (Get search volume and forecasts), with the location set to the country only, as in location research.
4. **Stage** with the skill's `scripts/topic_rank.py topics.json topics.xlsx export.csv`:
   - **Launch:** 100 or more searches a month, or proven on a sister site with measurable volume.
   - **Wave 2:** 30 or more, or proven on a sister site.
   - **Hold:** below that.
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
