# Information gain: content no competitor has

Search engines and AI answers reward a page that adds something to what the ranking set already says. A page that restates the top 10 in better prose adds nothing. This reference says what counts, where to find it, how much a page needs, and how to keep "new" from becoming "invented".

Background: `audit-content/docs/design/expectation-model-and-topic-ontology.md` (the gap calculation), `content-teardown.md` (whitespace), the Manchester pilot (`docs/content-samples/manchester-roofer/pilot-koray-review.md`, rule 1), and Patric's record-rendered proof blocks (`ai-os/projects/wp-migration-tool/rr/blog/retrofit-article.mjs`).

## What counts

Information gain is a fact, entity, relationship, question or piece of evidence that is **on our page and absent from every top-10 result for the page's search intent**. It is judged against the ranking set for that CSI, not against the web in general.

| Counts | Does not count |
|---|---|
| A standard named with what it requires (BS 5534 and the fixing schedule it sets) | The same facts reworded |
| A material grade, a product system, a failure mode specific to local housing | More words on the same points |
| Our own price range, call-out time, survey process, guarantee terms | A "fresh angle" with no new facts |
| A real job in that town, with what was done and what it cost | A claim nobody can check |
| A question callers actually ask that no page answers | A question invented to fill a FAQ |
| A photo, measurement or observation that exists because we did the work | Stock imagery, generated images |
| Conservation areas, housing eras, exposure, access limits named for that place | The town name swapped into a template |

Length is not gain. A page named for the search with 1,200 words beat a 6,500-word general page on the same site [measured, Patric's GSC data, 2026].

## Where to find it, in order

1. **The ontology minus the ranking set.** The expectation model in Site Manager computes, per page: `required = ontology ∪ best of SERP`, `infoGain = ontology − (SERP ∪ our page)`, `buried = ontology ∩ our page but not in a heading`, `serpParity = best of SERP − our page`, `coverage = |ontology ∩ our page| / |ontology|`. The `infoGain` set is the list of things the trade expects on a complete page that no competitor covers. Gap entities **replace the weakest parity entities** inside the 4-12 per 200 words density band; they do not stack on top of it. [stated in the design; the fusion code exists and is pure, so it can be run from a script]
2. **Teardown whitespace.** The content teardown lists topics, questions and entities that none of the top 10 cover, and the deficit between the competitor average and our page. Google-bolded snippet phrases in those results are the best source of H2 wording.
3. **First-party records.** Job records and invoices (what was done, in the record's own words), filmed jobs, photos, reviews, our own prices and timescales, call-out response times, the questions callers ask (Bella transcripts and call notes), what the surveyor finds most often. Competitors cannot publish these. They are rendered from records by script, never written from memory.
4. **The place brief.** The hyperlocal research checklist (housing era and stock, roof types and pitches, materials, exposure, drainage, trees, conservation areas and listed buildings by name, access and parking, planning limits, weather windows). Most competitors' town pages have none of it.
5. **Unanswered questions.** People Also Ask items with weak answers, AI-answer gaps where no page is cited for the query, "how much", "how long", "is it worth it" questions for the specific job and place.

## How much a page needs [house]

| Page type | Floor |
|---|---|
| Service, hub, town | at least 3 gap items |
| Article or guide | at least 5 gap items |
| Entity page | at least 2, including the relationship to our services |

Each gap item is stated as a plain subject-verb-object sentence, and the important ones sit in an H2 or the first paragraph so they carry weight (`no-buried-ontology-entities`). The `min-info-gain-entities` rule was deferred in July 2026 because five strong drafts all passed it; re-adopt it as a **warn** at these floors so weaker drafts are caught.

## Put it in the brief before writing

The page brief lists the gap set with its source: which ontology entities the SERP lacks, which teardown whitespace the page will fill, which records (job, photo, review, price) it will render, which place facts it will name, which unanswered questions it will answer. A reviewer checks the page against that list. No list, no claim that the page adds anything.

## The honesty line

New content is evidence we hold that others do not publish. It is never a figure, job, review, landmark, standard or accreditation produced to fill a gap.

- No record, no claim. A missing record is flagged in the PR; the page ships without that item or is held.
- A standard or regulation is cited only when checked against its source, with what it actually requires.
- Local facts come from the research brief or the client's team, not from a model's guess about a town.
- Patric's retrofit gate holds an article that cannot pass the fact-check rather than softening the claim. The same applies here: a shorter true page beats a longer one with one unsourced line.

## How sure we are

Google's information-gain patent (2022) is real and the principle is widely recommended, but we have not measured a ranking effect ourselves [practice]. Our proxies are the AI citation scoreboard (which page an assistant cites and what it has that ours lacks) and clicks and position at 28 and 90 days. The Manchester pilot showed the method finds real gaps cheaply (about $0.06 of API calls for 11 pages); it did not show rankings moving. Treat the floors above as house defaults and revise them from the data.
