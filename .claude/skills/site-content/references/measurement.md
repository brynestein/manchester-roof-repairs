# Measurement: how the rules are enforced and how results feed back

Publishing is not the result. The standard has four layers of enforcement, each answering a different question, and the last one is what changes the rules over time.

| Layer | Runs | Answers | Tool |
|---|---|---|---|
| 1. Build checks | every build and PR, in CI | Is the page structurally right? One H1, titles, canonical, `<main>`, schema parses, links resolve, sitemap, robots, llms.txt, security header, link direction | `scripts/check-site.mjs` in each site repo |
| 2. Draft scoring | on each draft, against the page brief | Does the copy carry the brief? Entity density and salience, parity with the ranking set, claims as sentences, anchors, openings, clichés | `@audit-content/agency-standards` `validateContent` |
| 3. Site audit | weekly per live site, in Site Manager | Does the whole site behave? Hub ratio, inbound spread, anchor profile by target, nav-label fit, first-link waste, NAP density, AI readiness, coverage matrix, the content teardown against the top 10 | `apps/audit-tool` rules; Site Manager audit inbox (fixes proposed, never auto-applied: see portal plan Phase 0 card 9) |
| 4. Outcomes | weekly pulls, judged at 28 and 90 days | Did it work? Shown, clicked, ranked, cited, enquired | Search Console, rank tracker, AI visibility, GA4 phone taps and form fills, GHL leads |

## What each outcome source gives

**Search Console** (the primary source; Phase 2 of the portal plan builds the pipeline)
- Per page: impressions, clicks, position, by device and country. Judge click rate and position on **mobile + the site's country**: desktop carries 64-78% of these sites' impressions but 26-39% of clicks, a pattern that fits rank-tracking robots (Patric measured 84% desktop earlier in 2026) [measured]. Count a page's clicks from unfiltered data on every device: a click is a person; a view may be a machine.
- Verdicts per page at 28 days (nothing judged earlier) and 90 days: **never shown** (a ranking problem; writing more cannot fix it) is a different finding from **shown and passed over** (a wording problem; a title test can). Both are reported separately, never as one "dead" count.
- Winners: ≥3 clicks and position ≤20. Multiply a winner into a new place only with a new place brief, never as a copy.
- Topics: near-miss queries at positions 5-20 with impressions are people typing the thing; they outrank machine-generated ideas as a source.
- Regression alarm: a drop in clicks within days of a deploy points at tracking, indexing or a header change before it points at content.
- No rows is not zero: a page with no data is "not yet tracked", never "earned nothing".
- **Judge pages on unfiltered page data.** A page table filtered by country or device leaves out anonymised queries: on Munster that removed about two thirds of clicks (553 page clicks against 1,619 site clicks in the same window) and hid most of what town pages earn. Use the filters for click rate and position, never to count a page's clicks.

**Rank tracker** (DataForSEO through Site Manager's geo-grid, or Patric's tracker)
- The ranking set per search intent: who is above us, which is the competitor list the ontology comparison and the content teardown need.
- Positions for pages below GSC's impression floor, and competitor movement over time.
- Local pack positions by grid point for the Google Business Profile work.

**AI visibility** (Patric's citation scoreboard today; a vendor MCP only after it is checked against this list)
- For each real query: which assistants cite which page, whether that is stable across two runs on the same day, what the cited page has that ours lacks (the six yes/no signals), and whether our page is reachable by the assistants' crawlers.
- "Showed no AI answer" is not "nobody cited".

**Leads** (GA4 `phone_call` taps and form events per page; GHL enquiries with first-touch page; call records)
- A tap is not a call; not measured is not zero; calls carry no page unless the assistant asks "how did you hear about us".

## How results change the rules

- A rule tagged [house] or [practice] is promoted to [measured] when a site's own data supports it, or loosened when it contradicts it, and the change is recorded in that repo's `docs/patterns/` and in `decisions.md` here.
- Thresholds that are explicitly open to revision from data: word-count bands, the 3/5 information-gain floors, question-H2 share on articles, link budgets, the 0.30 similarity gate, nav-vs-footer anchor variance (dhennessy data already says it is belt-and-braces).
- A test needs a sample: Patric's title loop tests only pages at position ≤10 with ≥200 impressions, judges at day 42, reverts losers; his pattern detector refuses to report a pattern under 12 judged articles. Copy that discipline; a refusal is a result.
- In the agency's audit-tool calibration, the audit tool's Local category score has a regression coefficient of +0.24 against visibility and its Content proxy score −0.22 (48 domains from Recommended Roofing's rank tracker, including directories and large sites; Workstream C, July 2026) [measured, both significant]. When a site is not ranking, look at Google Business Profile, citations and reviews before writing another page.

## Evidence on file: munstergutters.ie, October 2026 [measured]

Search Console joined to the 279-page crawl (`audit-content/docs/research/2026-10-site-content/search-console-findings.md`, Part D has the comparison exports). The rebuild replaced a WordPress site at the end of July 2026. Year on year (1 Aug - 22 Oct, all devices, unfiltered) clicks rose 42% (1,573 to 2,233); on mobile in Ireland clicks per day rose 18-56% by month with impressions up 54-69%, click rate flat and average position better (August 17.7 to 8.8):

- Where the gain came from: articles +345 clicks (posts shown 14 to 109, average position 27 to 15.5; 61 posts with no clicks in 2025 earned 357), Business Profile links +218 (bridge pages 199, tagged URLs 19; partly the same clicks recorded on a new URL: home and the Cork hub fell 102), guttering towns +96 (+27%), services +89, county roofing +68. County guttering hubs were flat (470 to 455).
- Town pages earn as a set: 551 clicks in the 2026 window (25% of the site), 81 of 126 town pages clicked, 16 with 10 or more; town clicks rose 16% overall and 27% on guttering towns. An earlier reading that towns earn under 1 click per page per quarter came from a filtered export and was wrong.
- The biggest zero-click queries are "<service> <county>" phrases with 500-700 impressions each ("gutter installation cork", "fascia installation cork", "upvc gutter installation tipperary"): no page is named for them. Service-in-place pages are built from this signal.
- Roofing on a gutters brand is shown and passed over (11,500 impressions, 0.3-0.5% CTR, positions 12-26): a secondary trade needs its own hub named for the search.
- Year in the title and tables: no reliable difference on complete data (Aug-Oct 2026, per post: with a year mean 3.3 and median 2, without mean 4.6 and median 0; with a table mean 4.5, without 3.4, but only 27 posts lack one). Treat both as not proven. An era change is the first confound to rule out in any before/after comparison.
- Brand and "{brand} reviews" queries are 23% of the clicks that Search Console attributes to a query; about 10% of all clicks (218 of 2,233, Aug-Oct 2026) arrive through the Google Business Profile bridge URLs.

## Evidence on file: recommendedroofing.ie and the robot share, October 2026 [measured]

- Recommended Roofing (domain about a year old): clicks up about fivefold since June and average position from the mid-40s to 19, yet in 3 months on mobile in Ireland 64% of 64 clicks were the homepage on brand searches; 188 towns earned 4 clicks (102 never shown); 121 articles earned 3 (60 never shown). Same standard as Munster, a fraction of the result: **the content standard is necessary, not sufficient; authority and the off-site stack decide when it pays.**
- Town pages: on Munster (trading since 2010) they earn a quarter of clicks; on Recommended Roofing (young domain) 23 clicks in 3 months across 188 towns, up from 3. Judge towns as a set and over 6-12 months, not one page at 28 days.
- Robot share: desktop is 64% (Munster) and 78% (Recommended Roofing) of impressions but 26% and 39% of clicks, at a fifth of mobile's click rate. Select and judge click-through on mobile in the site's country; count clicks from every device. Always filter to the site's country (Munster: 60,000 US and UK impressions for 150 clicks).
- Business Profile links with tracking parameters are indexed as separate pages on Recommended Roofing (6 URLs, 8,045 impressions), the fault Munster fixed with a noindex bridge.

## Cadence

| What | When |
|---|---|
| Build checks | every PR |
| Draft scoring | every page before PR |
| Site audit | weekly, and after any structural change |
| GSC pull | weekly per site; page verdicts at 28 and 90 days |
| Rank tracker | weekly on the tracked keyword set per site |
| AI visibility | weekly, two runs the same day |
| Rule review | quarterly, or when a site's data contradicts a rule |
