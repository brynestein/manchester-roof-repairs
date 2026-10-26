# Titles, headings, tables and page structure

## Title and description

| Element | Rule | Enforced by |
|---|---|---|
| `<title>` | 30-60 characters, unique; keyword and place first, then what earns the click ("Flat Roof Replacement Cork \| Costs & When to Replace"); brand only if it fits; no claim the page cannot back (no "best", price or guarantee unless the facts support it) | `title-length-band` (block), `title-includes-location`, `csi-alignment-check`, checker `P-title-len`, `P-title-dupe` |
| Meta description | 120-160 characters, unique, says what the page answers and why to click | `meta-description-length-band` (block), checker `P-desc-len`, `P-desc-dupe` |

- Article titles take their appeal from the real questions people ask (People Also Ask, callers, FAQs) [house, Patric].
- No year in a title unless the content is genuinely reviewed that year; never in an H1 or slug. Prices are always dated [D-K].

## Headings

| Rule | Enforced by |
|---|---|
| Exactly one `<h1>` | checker `P-h1` (block) |
| At least two `<h2>` on every page except plain pages | checker `P-h2` |
| No skipped levels | checker `P-heading-order` |
| **Articles:** 60% or more of H2s are questions (CTA and FAQ headings excluded); the first sentence under each answers it | Patric's article gate `questionH2Pct: 60`; `h2-questions-min-count` (floor) |
| **Commercial pages:** topic H2s; a visible FAQ of 6-8 questions (towns, services) or 8-12 (hubs) | `mandatory-faq-on-service-page` (count FAQ questions, not H2s) [D-E] |
| At least 3 of the top 5 People Also Ask questions for the CSI answered as an H2 or the first sentence of a paragraph | `h2-covers-real-paa` |
| Key entities (trust bodies, standards, main components, defects) in an H2 or first paragraph, not only in bullets | `no-buried-ontology-entities` |

- **H1**: commercial pages, the search phrase plus the place ("Roofers Douglas, Cork", "Roof Repair Adare, Limerick", "Gutter Cleaning Manchester"). Articles: the subject and the place, 30-45 characters, no colon, dash, suburb list or year ("Roof Insurance Claims in Cork"); the rest goes on an italic subheading line.
- **H2s** on commercial pages are topics, each a thing a customer asks about: cost, what is included, types and materials, process, local weather, property types, why us, FAQ. On articles they are the buyer's questions ("How much does a new roof cost in Cork?"), never our framing. Hub pages name defect H3s with the exact ontology label.
- Never "Summary", "The short version", "Overview", "In brief", "Conclusion".
- Numbered eyebrows ("02 / Pricing") are fine as decoration; the H2 text itself carries the topic.

## The opening

1. **A real photo** of the job type, with a true caption. [house, Patric]
2. **"At a glance" headed by the topic** ("Roof Replacement in Cork at a Glance"). On commercial pages: 2-3 sentences built from the page's own price rows (omitted if fewer than three), response time, survey and quote terms, guarantee, and the named manager. On articles: a **40-60-word answer paragraph** to the title's question, then the glance H2 with **4-6 one-sentence bullets** that each stand alone (no bullet restates the answer, cross-references another, or says "it depends" without saying on what). [house, Patric; retrofit gate]
3. **The first sentence states something.** Never "Welcome to", "We are", "Here at", "Our company", "For over N years", "Founded in", "When it comes to", "In today's", "Whether you", "As a homeowner", "Many homeowners" (`no-fluff-opening`, block; build-up openers ≤10% of sections).
4. **Articles:** a "Read next:" line with 3-4 internal links directly under the answer paragraph.
5. **An internal link in the first paragraph** on town, hub, article and entity pages (`link-in-first-paragraph`, block). Service pages are exempt (their in-prose budget is 0-2).

## Paragraphs and blocks

- **Answer first, detail second.** The paragraph straight after a question H2 is 40-60 words and answers it (`answer-first-paragraph-length`).
- **Elsewhere 2-4 sentences:** average 25 words or fewer per paragraph, no paragraph over 60 words [D-L] (checker `P-para-length`).
- **Quotable blocks.** Every paragraph and bullet is a complete claim on its own: names the place and the thing, no "this", "as above" or a bare "it depends". Read any three consecutive sentences cold; if they do not stand alone, rewrite. [practice]
- **The brand, not "we".** Name the business at least once per section; an AI cannot attribute a claim made by "we". At least 3 data points (numbers, dates, names, standards) per section. [house, Patric's gate]
- **Lists** for steps, options, what is included; one `<ul>`/`<ol>` per list, numbered steps 1-9. Never one list per item, never a list of one.
- No em dashes, no exclamation marks, currency symbol before the number, the site's English (British or Irish).

## Tables

Tables are what AI answers and featured snippets lift, and what a homeowner reads first on a cost page. Real HTML tables with a header row, readable on a phone (the table scrolls or stacks inside itself; the page never scrolls sideways), never an image, a code block or a one-row table standing in for a sentence.

| Rule | Where | Enforced by |
|---|---|---|
| A **price table** (job, typical cost range, year, and duration or warranty where known) on every cost, repair, replacement and service page. Figures only from the client's records, labelled indicative and dated, VAT treatment stated. The "at a glance" box is built from this table's rows and omitted if there are fewer than three | service, hub, town, cost article | retrofit gate on articles; manual [house, Patric] |
| At least **one comparison table** per article (materials, repair vs replace, options, cost by job) with a sub-section per option where the reader is choosing | article, guide | Patric's article gate `tables: 1` [house] |
| **Brands and materials in one table per page**, each brand with one home page on the site, rather than scattered through prose. Cut about 240 brand mentions to 55 in the Manchester drafts | service, article | manual [measured on drafts] |
| A **symptom decision table** (symptom, usual cause, what we do, price band, link to the right service) on landing pages, and optionally in a hub's "problems we fix" section | landing page (hub optional) | manual [house, orbit method] |
| A **short costings table on town pages** linking to the full price guide, so towns do not repeat identical figures 188 times | town | manual |
| A cost chart beside a cost list where there is a price range; narrow bars carry no inner text | article | [house, Patric] |

## Length [D-M]

| Page type | Target | Floor |
|---|---|---|
| Town | 1,200-1,800 words, at least 300 unique to the town | 1,000 |
| Hub | 2,500-5,000 | 2,000 |
| Service | 2,000-3,500 | 1,500 |
| Service-in-place | 1,200-2,200 | 1,000 |
| Article | 1,000-1,800 | 800 (a cost guide under 900 is thin) |
| Home | 1,500-3,000 | 1,000 |
| Entity page | 300-600 | `entity-page-word-count-band` (block) |

Length is a floor for coverage, never a target. A page named for the search at 1,200 words beat a 6,500-word page [measured]. If there is not enough real material, merge or drop the page.

## FAQ block

- 6-8 real questions on town and service pages, 8-12 on hubs, 10-12 on cost and replacement articles (cost, a cheaper or smaller version, emergency call-out, VAT, scaffolding, insurance, repair vs replace, guarantee, grants, how to spot a genuine firm, free quote). On town and hub pages the place is in every question (planning, regulations, weather, insurance), and every answer carries at least one sourced local fact from the place brief; a generic answer with the place name swapped in does not count.
- Questions customers actually ask (People Also Ask, calls, reviews); short specific answers using the same facts as the body.
- One FAQ component site-wide: native `<details>`/`<summary>` or a button that toggles `aria-expanded`; no inline `onclick`. FAQPage schema from the same items, so schema and text cannot differ.

## Page chrome

- `<main>` wraps the page content once; header, footer, floating call buttons and the cookie banner stay outside it (checker `P-main`). [measured: without it, the first extracted "sentence" of Manchester Gutters was the phone bar and opening hours]
- Full text in the HTML response; nothing important appears only after client-side JavaScript. No inline scripts (the security header blocks them).
- Visible breadcrumb on inner pages with a matching BreadcrumbList.
- One closing call to action per page: H2 with the place, tel: buttons, and the quote form at `#quote` [D-G].
