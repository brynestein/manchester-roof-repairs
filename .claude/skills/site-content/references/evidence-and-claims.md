# Evidence, claims and AI citation

The rule under everything: **no source, no claim.** A wrong price, guarantee or accreditation costs the client more than a missing one, and AI answers repeat what pages say as fact.

## Facts come from the client's records

- **Facts live in data files**, not in memory or copy: `business.json` (NAP, hours, years trading, insurance, accreditations), a pricing file, guarantees, `reviews.json`, case studies, jobs, `locations.json`. Copy never contradicts them; an article writer reads the built `llms-full.txt` so page and article cannot disagree.
- **Prices:** only the client's own real ranges, labelled indicative and dated, VAT treatment stated consistently across the site. Never an invented "industry average", an old unsourced figure, a single invoice, or a neighbouring range stretched to fill a gap. No published price for a job means the page says so.
- **Guarantees:** state exactly what the client gives, on exactly which jobs. Never round up, never extend a guarantee to a job type it does not cover. Patric's gate rejects any guarantee year outside the client's real tiers.
- **Accreditations, insurance, years trading:** only what the client holds and can show. Name the body correctly; link the badge to the client's listing at the issuer.
- **Statistics, storm lists, insurer rules, regulations:** left out unless there is a checkable source; link the source. Allowed external sources are the official ones (standards bodies, government, regulators, met office, the grant scheme's own page on first mention). An article lists them again at the end under "Sources and further reading" (page-templates).
- **Areas:** only places the client serves. Never promise a visit, response time or number for anywhere else.
- **One facts file.** Templates, wording variants, footers and schema contain no claim literals; they read the facts file. A claim fixed in one place and left in a variant pool is still live (Dublin Gutter: "three decades" on 28 pages after the September fix).
- **Guarantee scope travels with the claim**: separate wording for repair and replacement pages; never an unqualified "lifetime guarantee" on a repair page.
- **A checkable trust fact beats a years number** (directly employed crews, the insurance figure).
- **Each brand's prices come only from its own records**, never a sister brand's; a page without a published price says it is quoted after a survey.
- **No statistic without a dataset**, and never the same statistic on more than one place's page (Munster: "847 gutter projects … 43% of emergency callouts" with identical figures for six counties).
- **No superlatives, rankings, discounts or guarantee lengths in titles or descriptions** unless the page shows the evidence (Munster: "15-year warranty" in 55 descriptions against a 10-year maximum).
- **No visually hidden text by default.** A heading not worth showing is deleted, not clipped to 1px. The one exception is hidden keyword headings on a site that has opted in with `allowHiddenHeadings: true` in `site-checks.config.json`: Andrew's own sites only, never a client site without the client's informed agreement (D-V). Google's spam policy lists hidden text, so the risk is a manual action; the checker keeps listing every hidden heading as a warning so the choice stays visible.
- **Missing a fact?** Leave a visible `TODO` in the PR and do not publish the line. Do not soften a guess into a fact. A shorter true page beats a longer one with one unsourced line.

## First-party proof [house, Patric; D-R]

Each commercial page and article carries at least one thing that exists only because the client did the work, **rendered from records by the build, never written by the model**:

- a real job photo with a true caption (open every image before use: no stock-looking images, third-party logos, maps, near-duplicates, or images under about 700px wide used full width; caption the work, not the place)
- a filmed job, click-to-play, nothing loads until pressed
- a case study or recent job, stating only what was done in the record's own words, with the cost band
- a review from a customer, quoted exactly, dated, with the area; only from the client's own listing, never a sister brand's
- a real figure from the client's work (response time, price range, jobs completed)

- No template or data slot may *require* reviews; a review block renders only from records. A fixed "exactly 3 reviews" field forces invention where records are missing.
- A `sameAs` profile that does not exist is worse than none.

Limits per article: 2 case boxes, 2 review quotes, 1 video. Zero is fine when nothing fits; a town with no real work shows an honest "not yet filmed in {Town}" line. One review card repeated on 157 pages (Munster) is not proof.

## People

- A **named person** on commercial pages and articles with their real title: the owner as the article author (visible byline and `author` node), the manager named on town, hub and service pages ("managed day to day by"). Never invented credentials; the model never writes a byline, the template adds it.
- Never put words in a real person's mouth. A quote is used only if they said it.

## The "who should I hire" block [house, Patric]

On cost and service articles, an H2 "Who should I hire for {job} in {City}?" answered from confirmed facts (the business, its accreditations, guarantees, years, insurance, the regional number). Added after AI answers linked RR's price pages 16 times in three weeks without naming the firm. Rendered by the build from facts, written once.

## The AI-citation pass before publish [practice]

From a vendor checklist of pages cited by AI assistants (the "Cited Page Swipe File", 2026). The figures behind it are unverified; use it as a checklist, and judge results by the AI-visibility data (measurement). Tick at least five of seven, or fix first:

1. **Answer up top:** is the question answered (number, verdict or timeframe) in the first screen?
2. **Quotable:** could a stranger lift any three consecutive sentences and have them make sense alone?
3. **First-party evidence:** is there one thing that exists only because we did the work?
4. **Buyer's headings:** are headings the questions a buyer types, in their words, not ours?
5. **Named human:** is a named person with their real role on the page?
6. **Schema served:** is the structured data in the HTML and matching the visible text?
7. **Cluster:** do at least two sibling pages link here, and does this page link back?

Also check:

- **Crawlers can reach it.** `robots.txt` does not block the AI search and fetch crawlers (OAI-SearchBot, ChatGPT-User, Claude-SearchBot, Claude-User, PerplexityBot; checker `S-robots-ai`), the firewall does not refuse them (a 403 to a look-alike request is not proof the real bot is refused; check served status per bot), and the page is not `noindex`. A page an assistant cannot open cannot be cited. Blocking training-only crawlers (GPTBot, Google-Extended) is the client's call and does not stop citation.
- `/llms.txt` exists with a short site summary and key URLs, and `llms-full.txt` carries the facts the writer must agree with. [practice; no measured effect yet]

## Style that keeps claims honest

- Plain English in the site's market (British or Irish English, local terms). No exclamation marks, no fake scarcity, no "best" without proof, no em dashes.
- Say what is and is not included, and what moves the price.
- State uncertainty where it exists ("prices depend on access and roof size; most jobs fall between…").
