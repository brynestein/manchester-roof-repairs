# Location research: which hubs and towns get pages

Hubs and towns are chosen from search demand measured over a complete list of places, not from a client's "areas we cover" blurb or from memory. Decided 2026-10-25 [D-W] after the first Manchester Gutters map filed Trafford towns under Manchester and left out six boroughs.

Worked example: `assets/location-research/` (Manchester Gutters, 270 places, two Keyword Planner runs, October 2026).

## The steps

1. **List every place in the service area from a gazetteer.** The hubs are the client's real service area at council level: local authorities or metropolitan boroughs in the UK, counties in Ireland. Under each hub, list every ward area and every built-up area from the national statistics office, the named districts inside the large towns, and the spellings people type ("chorlton cum hardy", "ashton under lyne", "the heatons"). Put each place under the authority it is actually in. For the UK, run the skill's `scripts/location_places.py authorities.json places.json` with each authority's ONS code (E08…, E06…, E07…). It takes every 2022 ward with its Census 2021 population from the ONS Nomis API and every settlement Wikidata records in the authority, splits ward names into the places people type ("Pendlebury & Clifton", "East Middleton"), and lists every change for review. Wards alone miss big towns split into wards with other names (Sale, Prestwich, Middleton, Hyde, Ashton-under-Lyne); Wikidata supplies them. Then add the spellings people type. For Ireland, use the CSO's settlements and electoral divisions by hand. A hand-picked list misses places and files some under the wrong hub; Manchester's first list did both. **Tested on Greater Manchester:** the script found all 29 Launch and Wave 2 towns and 238 of the 260 places in the hand-built list; the ones it missed were small villages and alternative spellings ("chorlton cum hardy", "the heatons").
2. **Choose the searches.**
   - **Trade terms:** the client's priority money searches, in the customer's words: for guttering, "guttering", "gutter repairs", "gutter replacement" and "fascias and soffits".
   - **Leave out** services the client offers but does not want to grow. On Manchester Gutters that was gutter cleaning, which is low-ticket. In the first run it was three quarters of the "gutter" volume and decided almost every town.
   - **Proxy terms:** one or two searches from the neighbouring trade (on a gutter site, "roofers" and "roof repairs"). They are used only to rank towns if no town has measurable trade volume.

   Write the places, terms, ambiguous names and population into a places file in the shape of the example, then run the skill's `scripts/location_keywords.py places.json keywords.csv`.
3. **Get volumes from Google Ads Keyword Planner.** Choose Get search volume and forecasts, upload the CSV, and set the location to **the country only**. Download the result.
   - **Not the account's default country.** A US-set account returns US data: "roofers denton" came back as 320 from Denton, Texas.
   - **Not a city.** City targeting counts only people Google places there at the moment they search, which pushes small towns to blank.
   - **The script checks the country** in the export and stops if it is wrong.
   - **The API is not an option on an Explorer token.** The Ads API refuses Keyword Planner on an Explorer-access developer token, so upload by hand unless the token has Basic access.
4. **Rank** with the skill's `scripts/location_rank.py places.json ranking.xlsx export1.csv [export2.csv]`. Several runs merge.
   - **Hubs** are ordered by trade searches. A hub with 50 or more a month launches. A hub below that launches only as the parent of towns that launch or wait in Wave 2; it then exists for structure and will not pull traffic on its own.
   - **Towns** are staged on trade searches: Launch at 20 or more a month, Wave 2 at 10 or more, otherwise Hold.
   - **If no town reaches 20 trade searches,** towns are staged on the proxy instead: Launch at 50 or more, Wave 2 at 20 or more. The sheet says which basis was used.
5. **Read it with its limits.**
   - **Blanks:** a blank is under Planner's floor, or merged into a close variant. It counts as 0.
   - **Rounding:** Planner rounds small figures, so 10 means roughly 5-15. Differences inside that band are not real differences.
   - **Ambiguous names:** flag place names used elsewhere in the country (Heaton, Clifton, Langley, Sale). Their figures may not be local.
   - **Exclusions:** take out searches that are not about the place. "guttering sale" is 210 a month of people shopping for guttering on sale.
   - **Bots:** whether Planner removes rank-tracker queries is not documented. A seasonal monthly pattern points to people; a flat line could be either. Treat the figures as a relative ranking, not as counts of searchers.
   - **"Near me" searches:** most people type "near me" with no town and Google supplies the place, so town figures understate local demand. The map pack takes most of those searches.
6. **Record it in the URL map.** Every hub and every Launch and Wave 2 town is a row, and its stage and searches go in the Notes column. Hold towns stay in the ranking sheet, not the map. A Hold town is built when the client has done jobs there or Search Console shows impressions for it. In Site Manager, the Plan screen's Search Console town check finds these (site-manager-build). Every town page, at any stage, is written from a place brief (place-brief).
7. **Re-run after launch.** Run it once a year, or when Search Console shows queries naming a town the site has no page for. After launch, pages are judged on clicks (measurement), not on these volumes.

## What Manchester Gutters showed (October 2026, UK, average monthly searches)

- **Demand sits at hub level.** Gutter repair, replacement, fascia and guttering searches register for 9 borough or city names and for nothing below them, apart from 10 a month each for Altrincham and Wythenshawe. Manchester has 470, Stockport 160, Oldham 150, Wigan 130 and Bolton 120 [measured].
- **The hubs carry the demand,** so they are the most important pages on a gutter site. Town pages are long-tail coverage and proof of local work.
- **The neighbouring trade is much larger.** Roofing searches total 10,010 a month against 1,200 for gutters, and they are the only ones measurable town by town (62 places) [measured]. The client chose to stay gutter-led: gutters are easier to compete for, and gutter jobs lead on to roofing work (Andrew, 25 October 2026).
- **Two hubs have no gutter demand under their own name.** Nobody searches "Trafford" for gutters or roofers, but its towns are among the strongest: Altrincham has 530 roofing searches and Sale 330. Tameside is similar. Both are kept as hubs so their towns sit under the right parent.
- **A complete list mostly confirms a careful one.** The second run added 146 places. Only 8 had any data, none above 20, and most of those names are used elsewhere in the UK [measured].
- **Result:** 10 hubs (7 on demand, 3 as parents), 10 Launch towns, 19 Wave 2 and 231 Hold.
