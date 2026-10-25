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
- Per page: impressions, clicks, position, by device and country. Select and judge on **mobile + the site's country**: 84% of these sites' impressions are desktop rank-tracking robots [measured]. A click is a person on any device; a view may be a machine.
- Verdicts per page at 28 days (nothing judged earlier) and 90 days: **never shown** (a ranking problem; writing more cannot fix it) is a different finding from **shown and passed over** (a wording problem; a title test can). Both are reported separately, never as one "dead" count.
- Winners: ≥3 clicks and position ≤20. Multiply a winner into a new place only with a new place brief, never as a copy.
- Topics: near-miss queries at positions 5-20 with impressions are people typing the thing; they outrank machine-generated ideas as a source.
- Regression alarm: a drop in clicks within days of a deploy points at tracking, indexing or a header change before it points at content.
- No rows is not zero: a page with no data is "not yet tracked", never "earned nothing".

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
- Across the tracked sites, local-presence signals correlate +0.24 with rankings and content volume -0.22 (both significant) [measured, 2026]. When a site is not ranking, look at Google Business Profile, citations and reviews before writing another page.

## Evidence on file: munstergutters.ie, October 2026 [measured]

Search Console, mobile + Ireland, 3 and 16 months, joined to the 279-page crawl (`audit-content/docs/research/2026-10-site-content/search-console-findings.md`). The rebuild replaced a WordPress site at the end of July 2026, so the 3-month window is the clean read and the 16-month window mixes eras; year on year the rebuild earns 18-56% more clicks per day, from more pages being shown rather than a better click rate:

- Six county guttering pages earn 29% of clicks (27 per page per quarter); 126 town pages earn 15% (under 1 per page) at average position 21-25. Hubs earn; towns cover.
- Articles: 20 of 118 earned a click in 3 months; 28 were never shown; 21 were shown and passed over.
- The biggest zero-click queries are "<service> <county>" phrases with 500-700 impressions each ("gutter installation cork", "fascia installation cork", "upvc gutter installation tipperary"): no page is named for them. Service-in-place pages are built from this signal.
- Roofing on a gutters brand is shown and passed over (11,500 impressions, 0.3-0.5% CTR, positions 12-26): a secondary trade needs its own hub named for the search.
- Year in the title: posts with it earn 0.4 clicks each in the clean window, without 0.75 (small sample). Tables: no measurable difference in the clean window (0.66 vs 0.59 per post); the 16-month gap was an era effect. An era change is the first confound to rule out in any before/after comparison.
- Brand and "{brand} reviews" queries are 23% of clicks; 12% of clicks arrive through the Google Business Profile redirect URLs.

## Evidence on file: recommendedroofing.ie and the robot share, October 2026 [measured]

- Recommended Roofing (domain about a year old): clicks up about fivefold since June and average position from the mid-40s to 19, yet in 3 months on mobile in Ireland 64% of 64 clicks were the homepage on brand searches; 188 towns earned 4 clicks (102 never shown); 121 articles earned 3 (60 never shown). Same standard as Munster, a fraction of the result: **the content standard is necessary, not sufficient; authority and the off-site stack decide when it pays.**
- Town pages earn almost nothing in the short run on either site. Judge them over 6-12 months as coverage and link structure, not at 28 days.
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
