# Page templates: the blocks each page type carries, in order

Taken from what is live on recommendedroofing.ie (351 pages), munstergutters.ie (279) and dublingutter.ie (102), Patric's generators, and the Manchester pilot drafts. "Required" means the page is not finished without it. "If records" means it renders only from real data and is omitted when none fits; it is never written by the model.

Every commercial page shares: hero with H1 and tel: + `#quote` buttons, credentials strip, "at a Glance" box, closing CTA with the form, `<main>` around the content, and the chrome in site-structure.

## Town page (1,200-1,800 words)

| # | Block | Status | Notes |
|---|---|---|---|
| 1 | Hero: breadcrumb (Home › Locations › {Hub} › {Town}, with BreadcrumbList), eyebrow, H1 "{Trade phrase} {Town}, {Hub}", one-paragraph lede, tel: + `#quote` | required | |
| 2 | Credentials strip | required | from `business.json` |
| 3 | **"{Trade} {Town} at a Glance"**: 2-3 sentences from the page's own price rows, response time, survey and quote terms, guarantee, "managed day to day by {Manager}, {Title}" | required | omitted only if fewer than 3 price rows exist for the trade |
| 4 | "Local {trade} in {Town}": who the team is, where they are based, how fast they reach the town, the one in-prose link to the insurance or proof page, team card with phone, map embed | required | |
| 5 | **"{Town} weather and your roof"**: 3 question H3s (wet climate, winter and storms, seasonal maintenance) answered from the place brief | required | the place brief is the source; see place-brief |
| 6 | **"{Town} property types"**: 3-4 question H3s on the housing stock (era, roof and gutter materials, conservation areas by name, access), with € ranges where the records support them | required | |
| 7 | Services grid: one card per service, H3 = the service phrase, one line, link to the service page | required | |
| 8 | Short costings table for the town with a link to the full price guide | required | identical figures on 188 pages is the pattern to avoid; use the town's own rows or say the range is province-wide |
| 9 | Evidence of work here: a job photo, filmed job, case study or review from the town | if records | if none exists, an honest "not yet filmed in {Town}" line, never borrowed proof |
| 10 | FAQ: 6-8 questions with the town in the question (planning, regulations, weather, insurance, cost, response time), `<details>` or button with `aria-expanded`, FAQPage matching word for word | required | |
| 11 | Nearby areas: chips to in-hub siblings (nearest 10-30), plus "All {Hub}" | required | never a fixed alphabetical slice |
| 12 | Other cities (multi-city sites only): cards to the other hubs, anchor "{Trade phrase} {City}" | if multi-city | |
| 13 | Closing CTA with the form at `#quote` | required | |
| Schema | WebPage (mainEntity ↔), Service (provider → organisation, areaServed = the town), Person (manager), BreadcrumbList, FAQPage; LocalBusiness only with a real address; no aggregateRating unless reviews are shown on the page | | |

Links out: every service, 10-30 siblings, the hub, the proof page; zero to articles.

## City or county hub (2,500-5,000 words)

| # | Block | Status |
|---|---|---|
| 1 | Hero (photo or video), H1 "{Trade phrase} {City}", lede, tel: + `#quote` | required |
| 2 | Credentials strip, client logos | required / if records |
| 3 | "{Trade} {City} at a Glance" | required |
| 4 | "What you need to know" intro with the office box (address if real, phone, hours) and the form | required |
| 5 | Town cards: every town page under this hub, anchor "{Trade phrase} in {Town}" | required |
| 6 | Service cards + "{Problems} we fix in {City}": H3s named with the ontology's defect labels | required |
| 7 | "{Trade} costs in {City}" price table, dated, VAT stated | required |
| 8 | Recent projects (case cards), verified reviews, brands installed, videos | if records |
| 9 | Why clients choose us | required |
| 10 | Guide cards to this city's articles (the one allowed hub → article link block) | if articles exist |
| 11 | FAQ 8-12, FAQPage matching | required |
| 12 | Other cities, closing CTA with form | required |
| Schema | as town, plus LocalBusiness with the real postal address where one exists | |

## Service page (2,000-3,500 words)

| # | Block | Status |
|---|---|---|
| 1 | Hero, H1 "{Service} {City}" (single city) or "{Service}" + province (multi-city), lede, tel: + `#quote` | required |
| 2 | Credentials strip | required |
| 3 | "{Service} at a Glance" from the price table | required |
| 4 | "{Service} explained": what it is, when you need it, 3-4 H3s | required |
| 5 | Pricing table (job, range, duration or warranty, year, VAT) + what moves the price | required |
| 6 | What is included / not included | required |
| 7 | Types and materials covered: H3 per type, brands in one table | required |
| 8 | Process: numbered steps from the customer's side (survey → quote → work → aftercare) | required |
| 9 | Coverage: areas named as **plain text** with the regional phone; no links to towns | required |
| 10 | Reviews, case study, video for this service | if records |
| 11 | FAQ 6-8, FAQPage matching | required |
| 12 | Other services (cards) and closing CTA with form | required |
| Schema | Service (provider → organisation, areaServed, serviceType), Person (manager), WebPage, FAQPage | |

Links out: sibling services by cards, 0-2 in prose (homepage or proof page, fresh anchor), zero to towns or articles.

## Service-in-place page (`/<service>/<city>/`, 1,200-2,200 words)

Section-for-section mirror of the hub for one service: hero → logos → "what you need to know" + form → services and problems → costs in {City} → what a repair looks like → why {City} chooses us → FAQ → CTA. Links up to the service page and across to sibling cities; areas as text chips. Built only for the head term [see site-structure].

## Article (1,000-1,800 words; floor 800)

| # | Block | Status |
|---|---|---|
| 1 | Breadcrumb Home › Blog › {Place} (BreadcrumbList); H1 = subject + place, 30-45 chars, no colon, dash or year; italic subheading line; meta line: tag, place, updated date, "By {Owner}, {Title}"; place-correct tel: + `#quote`. On a cost article the meta description carries the headline price range | required |
| 2 | Real photo or click-to-play job video with a true caption | required (photo) / if records (video) |
| 3 | **Answer paragraph, 40-60 words**, answering the title's question | required |
| 4 | **"{Topic} at a Glance"** H2 + 4-6 one-sentence bullets that each stand alone | required |
| 5 | **Contents**: a jump list of every H2, each a plain `<a href="#id">` link to an `id` on the heading, written in the HTML (not built by script after load). On a phone it sits under the at-a-glance box and can be collapsed; on a wide screen it may sit in a sticky side column. It never scrolls inside its own box | required |
| 6 | "Read next:" one line with 3-4 internal links (service, area, related guides) | required |
| 7 | Body: question H2s (60% or more), first sentence answers each; cost list + chart; comparison table; sub-section per option; brand named once and 3+ data points per section. The group's Hold topics (topic-research) are answered here as headed sections, not as separate articles | required |
| 8 | **Cost articles, three tables**: (a) cost by property type: length in metres, total by material, time on site; (b) additional costs: access or scaffolding per elevation, related boards per metre, each downpipe, removal and disposal, add-ons; (c) lifespan and upkeep by material. Every figure from the client's own quotes and jobs (evidence-and-claims); a row with no record is left out, never estimated. A regional difference ("Manchester runs higher than…") only from the client's own data | required on cost articles |
| 9 | Case box, review quote, job video rendered from records (max 2 / 2 / 1) | if records |
| 10 | "Who should I hire for {job} in {City}?" block from confirmed facts | required on cost and service articles |
| 11 | "Guarantees on {topic}" section | required on cost, repair and replacement articles |
| 12 | "Nearby areas we also cover" (sibling spokes) and the other-cities sentence; spoke → pillar link once | required where they exist |
| 13 | FAQ 10-12 questions, FAQPage matching | required |
| 14 | **"Sources and further reading"**: the primary source for every regulation, standard or statistic the article cites (legislation.gov.uk, gov.uk guidance such as Approved Document H, the Planning Portal, the standards or trade body's own guidance), each also linked where the claim is made | required when the article cites one |
| 15 | Related cards: the service, "Your area", "All areas"; "{Trade phrase} {Town}" chips | required |
| 16 | One closing CTA band with the form | required |
| Schema | BlogPosting or Article (author Person = owner, publisher = organisation, about = Place), BreadcrumbList, FAQPage | |

Why the contents list: it lets a reader jump to the one question they came with, and it gives search engines and AI fetchers the page's outline as plain links. The same cost article uses one (a sticky side column with every H2). Observed, not measured.

Why the cost tables: a UK competitor's gutter replacement cost article (bernardandrewsroofing.com, checked 25 October 2026) is one of three sources Google's AI Overview cites for "How much does it cost to have guttering done?", and the Overview's cost-by-property-type ranges match its table. One example, not a measured effect; the tables also answer the follow-up questions a buyer has. That article has no job photos, case studies or sourced figures, so copy the blocks, never its numbers.

Forbidden: "Summary", "The short version", "In conclusion" headings; em dashes; exclamation marks; a byline written by the model; a second CTA section; links to pages that do not exist.

## Home (1,500-3,000 words)

Hero (headline, promise, 3 proof numbers) → credentials → service cards (every service) → why us → coverage cards to every hub ("{Trade phrase} {City}") → price table → reviews (dated) → FAQ 8-10 → CTA with form. 1-3 in-prose links to the primary services. Schema: WebSite, WebPage, the Organization anchor defined in full (only here), LocalBusiness for the head office.

## Landing page (orbit method)

Sticky header → service rail (phone only: What's wrong? / repairs / emergency / replacement / flat / inspection / outside area) → hero with 3 proof numbers and credentials ticker → quote band (form + phone) → **symptom decision table** (symptom → usual cause → what we do → price band → link) → escape chips → logo wall → promises + 5-step process → 4 guide cards (must exist) → areas, each deep-linked → FAQs with a jump list, not accordion-only → photo grid → closing CTA → footer + sticky call bar. Rule: a mismatched visitor reaches the right page in one tap on a phone. Trade schema, never Article; no aggregateRating unless evidenced on the page; prices quoted verbatim from the price guide.

## Entity page (300-600 words)

H1 = the entity; what it is in plain words; why it matters for the job; how we use or comply with it (3-8 in-prose links to services and towns); related entities (3+, each twice); one authoritative external link; schema type per entity (Product / Organization / GovernmentOrganization) with `sameAs` to Wikidata and the official source.

## Proof pages

Reviews (only verifiable, quoted exactly, dated, with the area), case studies (what was done in the record's words, photos, cost band), gallery (real photos, meaningful alt), videos (click-to-play, VideoObject), insurance (the certificate facts), price guide (the full tables that town pages link to). A proof page with no records is not published: it is not built, or on a live site it is noindexed and kept out of the sitemap and menus until records exist.
