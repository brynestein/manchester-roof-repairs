# The place brief: what a town page needs before anyone writes it

A town page with the name swapped into a template is a doorway page. The three live sites prove the risk: Munster's guttering towns have about 300 unique words each, Dublin Gutter's suburbs one short section, and Patric's own notes call the neighbourhood pages near-copies. Munster's roofing towns and Andrew's earlier landing-page prompt show the fix: research the place, then write the weather and property sections as questions.

The brief is a record in `locations.json` (or equivalent), filled from research and the client's team, checked before the page is drafted. No brief, no page.

## Research checklist (fill what applies; mark the rest "not found", never guess)

**Housing and roofs**
- Predominant housing eras and types (Victorian terraces, 1930s semis, 1970s estates, new build) and the estates or streets they cluster in
- Typical roof types and pitches (slate, clay or concrete tile, flat, metal), common materials by era (Welsh slate, Rosemary tiles, felt, EPDM)
- Gutter and downpipe styles (cast iron heritage, uPVC, aluminium), sizes, common faults
- Chimney prevalence and condition; roof age and whether materials are near end of life
- Settlement or structural patterns (sagging ridges, movement)

**Environment**
- Exposure: prevailing wind, sheltered vs exposed streets, high ground, wind-tunnel effects
- Rain and drainage: flooding history, standing water, storm-water issues
- Trees: mature tree cover causing moss, leaf fall, branch damage
- Coast or river proximity: salt air, humidity, corrosion
- Freeze-thaw, urban heat, seasonal weather windows, nesting-season limits on access

**Rules and access**
- Conservation areas and listed buildings **by name**, and what they restrict (materials, colours, methods)
- Planning and building-control constraints relevant to roof work
- Street width, parking, scaffold and skip permits, delivery limits, overhead lines
- Shared responsibility in terraces and flats; waste disposal rules

**Market and proof**
- Our real jobs, photos, videos, reviews in this town (from records only)
- Typical repair and replacement costs here, if our records support a town-level figure
- Nearest towns we also serve (for the sibling links)
- Local landmarks worth naming where they help a reader place us (not a quota)

## How it is used on the page

| Section | Source in the brief |
|---|---|
| "{Town} weather and your roof" (3 question H3s) | exposure, rain, trees, coast, freeze-thaw |
| "{Town} property types" (3-4 question H3s) | housing eras, roof types, materials, conservation areas |
| "Local {trade} in {Town}" | where we are based, response time, access notes |
| FAQ with the town in the question, each answer carrying a sourced local fact | planning (conservation areas, Article 4 directions), regulations, weather, insurance, cost; the fact links to the council or other official page |
| Evidence of work here | jobs, photos, reviews from the records |
| Nearby areas | the nearest-towns list |

## Gates

- **Uniqueness:** at least 300 words that exist only on this page; median 6-gram Jaccard across all town pages ≤0.22 and no pair above 0.30. Dublin Gutter's first pass scored 0.363 and read as doorway pages; real local detail plus variant pools for the shared scaffolding brought it to 0.128 [measured]. Fix a failure with more local detail, never by raising the ceiling.
- **Worst pair, not just the median:** gate on both, and re-measure whenever a shared block (an answer box, a manager line) is added. Dublin Gutter's README records 0.128; its built pages now measure 0.197 median, worst pair 0.439, 439 pairs above 0.30, because only the median is checked.
- **Local material carries the difference.** Rotating stock sentences can pass the gate while the page still says nothing local (Dublin Gutter: 51-84 words of local material per page; variants shared by 13-20 pages each). Count the brief's material, not just the score.
- **Neighbours:** each brief lists 9-12 real neighbouring places; those that have pages become the sibling links (Dublin Gutter's `nb` field). Never a slice of the full list. Top up by distance when fewer than 6 neighbours have pages, never in data-file order (Dublin Gutter: 2 to 32 inbound links per area from file order).
- **Truth:** every local fact traces to the brief; every job, photo or review to a record. If nothing real exists for the town, the page says so honestly rather than implying work there.
- **Service area:** the town is inside the client's real radius and the regional phone number is right.
- **Rewrites:** a rewritten town body is at least 400 words of local material (Munster's splice script refuses less); a migrated template body is not a town page.
- **Scale:** write towns in batches only as fast as briefs can be researched. Patric assembles copy from signal-driven sentence pools (era, coast, exposure, trees) seeded per town; that is an acceptable way to draft at scale **as long as the signals are researched per town**, and the uniqueness gate still applies.
